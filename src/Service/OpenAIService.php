<?php

namespace App\Service;

use App\Entity\Message;
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

    public function __construct(
        $apiKey,
        private MessageRepository $messageRepository
    ) {
        $this->apiKey = $apiKey;
    }


    public function generateResponse(string $prompt): Message
    {
        $serializer = new Serializer([new ObjectNormalizer()], []);
        $messagesFromDb = $this->messageRepository->findBy([], ['createdAt' => 'ASC'], 1);

        $messages = [];

        if ($this->systemMessage !== null) {
            $messages = [['role' => 'system', 'content' => $this->systemMessage]];
        }

        if ($messagesFromDb !== []) {
            foreach ($messagesFromDb as $messageObject) {
                $messageArray = $serializer->normalize($messageObject, null);
                array_push($messages, ['role' => $messageArray['role'], 'content' => $messageArray['content']]);
            }
        }

        array_push($messages, ['role' => 'user', 'content' => $prompt]);

        $client = OpenAI::factory()
            ->withApiKey($this->apiKey)
            ->withBaseUri('https://api.openai.com/v1/')
            ->withHttpClient(new Psr18Client())
            ->make();

        $result = $client->chat()->create([
            'model' => 'gpt-3.5-turbo',
            'messages' => $messages
        ]);

        $response = $result->toArray();

        $message = (new Message())
            ->setContent($response['choices'][0]['message']['content'])
            ->setCreatedAt(new DateTimeImmutable())
            ->setRole('assistant');

        return $message;
    }



    public function getArrayWithAllMessagesForJsonEncode(Form $form): array
    {
        $serializer = new Serializer([new ObjectNormalizer()], []);
        $messages = $this->messageRepository->findBy([], ['createdAt' => 'ASC']);

        $messagesArray = [];

        if ($messages !== []) {
            foreach ($messages as $value) {
                $valueArray = $serializer->normalize($value, null);
                array_push($messagesArray, $valueArray);
            }
        }

        $models = [];

        foreach ($form->createView()->children['model']->vars['choices'] as $choice) {
            array_push($models, ['label' => $choice->label, 'value' => $choice->value]);
        }

        $responseArray = [
            'token' => $form->createView()->children['_token']->vars['value'],
            'models' => $models,
            'messages' => $messagesArray
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


    public function setSystemMessage(?string $systemMessage): void
    {
        $this->systemMessage = $systemMessage;
    }
}
