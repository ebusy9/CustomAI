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
    private string $systemMessage;

    public function __construct(
        $apiKey,
        private MessageRepository $messageRepository
    ) {
        $this->apiKey = $apiKey;
    }


    public function generateResponse(string $prompt): Message
    {
        $serializer = new Serializer([new ObjectNormalizer()], []);
        $messagesFromDb = $this->messageRepository->findBy([], ['createdAt' => 'ASC'], 7);

        $messages = [['role' => 'system', 'content' => $this->systemMessage]];

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



    public function getArrayForJsonEncode(Form $form): array
    {
        $serializer = new Serializer([new ObjectNormalizer()], []);
        $messages = $this->messageRepository->findBy([], ['createdAt' => 'ASC']);

        $messagesArray = [];

        if ($messages !== []) {
            foreach ($messages as $value) {
                $valueArray = $serializer->normalize($value, null);
                $valueArray['createdAt'] = date("D j M G:i:s", $valueArray['createdAt']['timestamp']);
                unset($valueArray['id']);
                array_push($messagesArray, $valueArray);
            }
        }

        $chat = [
            'token' => $form->createView()->children['_token']->vars['value'],
            'messages' => $messagesArray
        ];

        return $chat;
    }



    public function setSystemMessage(string $systemMessage): void
    {
        $this->systemMessage = $systemMessage;
    }
}
