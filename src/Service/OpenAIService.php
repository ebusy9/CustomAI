<?php

namespace App\Service;

use App\Entity\Message;
use App\Entity\OpenAIModel;
use App\Repository\MessageRepository;
use DateTimeImmutable;
use OpenAI;
use Symfony\Component\Form\Form;
use Symfony\Component\HttpClient\Psr18Client;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

class OpenAIService
{
    private string $apiKey;
    private ?string $systemMessage = null;
    private int $contextLimit = 0;
    private int $temperature = 10;
    private int $freeMsgSentToday = 0;
    const FREE_MSG_LIMIT = 4;

    public function __construct(
        $apiKey,
        private MessageRepository $messageRepository
    ) {
        $this->apiKey = $apiKey;

        $freeMessages = $messageRepository->findBy(['role' => 'user', 'premiumUser' => null], ['createdAt' => 'DESC'], 4);
        foreach ($freeMessages as $message) {
            if ($message->getCreatedAt()->format('d') === (new DateTimeImmutable())->format('d')) {
                $this->freeMsgSentToday++;
            }
        }
    }


    public function generateResponse(Message $message): Message
    {
        $serializer = new Serializer([new ObjectNormalizer()], []);
        $messagesFromDb = $this->messageRepository->findBy(['isDeleted' => false], ['createdAt' => 'ASC'], $this->contextLimit);

        $messages = [];

        if ($this->systemMessage !== null) {
            $messages = [
                [
                    'role' => 'system',
                    'content' => $this->systemMessage
                ]
            ];
        }

        if ($messagesFromDb !== []) {
            foreach ($messagesFromDb as $messageObject) {
                $messageArray = $serializer->normalize($messageObject, null);
                array_push($messages, ['role' => $messageArray['role'], 'content' => $messageArray['content']]);
            }
        }

        array_push($messages, ['role' => 'user', 'content' => $message->getContent()]);



        $client = OpenAI::factory()
            ->withApiKey($this->apiKey)
            ->withBaseUri('https://api.openai.com/v1/')
            ->withHttpClient(new Psr18Client())
            ->make();

        $result = $client->chat()->create([
            'model' => $message
                ->getModel()
                ->getName(),
            'messages' => $messages,
            'temperature' => $this->getTemperature()
        ]);

        $response = $result->toArray();

        $responseMessageObject = (new Message())
            ->setContent($response['choices'][0]['message']['content'])
            ->setModel($message->getModel())
            ->setCreatedAt(new DateTimeImmutable())
            ->setRole('assistant');


        return $responseMessageObject;
    }



    public function getArrayWithAllMessagesForJsonEncode(Form $form): array
    {

        $serializer = new Serializer([new ObjectNormalizer()], []);
        $messages = $this->messageRepository->findBy(['isDeleted' => false], ['createdAt' => 'ASC']);

        $messagesArray = [];

        if ($messages !== []) {
            foreach ($messages as $value) {
                $valueArray = $serializer->normalize($value, null);
                array_push($messagesArray, $valueArray);
            }
        }

        $models = [];

        foreach ($form->createView()->children['model']->vars['choices'] as $choice) {
            array_push($models, ['label' => $choice->data->getUiName(), 'value' => $choice->value]);
        }

        $responseArray = [
            'token' => $form->createView()->children['_token']->vars['value'],
            'models' => $models,
            'messages' => $messagesArray,
            'remainingFreeMsg' => self::FREE_MSG_LIMIT - $this->freeMsgSentToday
        ];

        return $responseArray;
    }


    public function getArrayWithResponseForJsonEncode(Form $form, Message $assistantMessage, Message $userMessage): array
    {
        $serializer = new Serializer([new ObjectNormalizer()], []);

        $response = [
            'token' => $form->createView()->children['_token']->vars['value'],
            'userMessage' => $serializer->normalize($userMessage, null),
            'assistantMessage' => $serializer->normalize($assistantMessage, null)
        ];

        return $response;
    }

    public function markMessagesAsDeleted(): array
    {
        $messages = $this->messageRepository->findBy(['isDeleted' => false]);
        foreach ($messages as $message) {
            $message->setIsDeleted(true);
        };

        return $messages;
    }

    public function markOneMessageAsDeleted(int $id): Message
    {
        $message = $this->messageRepository->findOneBy(['id' => $id]);
        $message->setIsDeleted(true);

        return $message;
    }


    public function setSystemMessage(?string $systemMessage): void
    {
        $this->systemMessage = $systemMessage;
    }

    public function setContextLimit(int $contextLimit): void
    {
        $this->contextLimit = $contextLimit;
    }

    public function setTemperature(int $temperature): void
    {
        $this->temperature = $temperature;
    }

    public function getTemperature(): float
    {
        if ($this->temperature === 0) {
            return $this->temperature;
        }

        return $this->temperature / 10;
    }

    public function getFreeMsgSentToday(): int
    {
        return $this->freeMsgSentToday;
    }

    public function isRemainingFreeMsg(): bool
    {
        if (self::FREE_MSG_LIMIT - $this->freeMsgSentToday <= 0) {
            return false;
        }

        return true;
    }
}
