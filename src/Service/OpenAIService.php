<?php

namespace App\Service;

use OpenAI;
use Symfony\Component\HttpClient\Psr18Client;

class OpenAIService
{
    private string $apiKey;

    public function __construct($apiKey)
    {
        $this->apiKey = $apiKey;
    }


    public function generateResponse(string $prompt)
    {

        $client = OpenAI::factory()
            ->withApiKey($this->apiKey)
            ->withBaseUri('https://api.openai.com/v1/')
            ->withHttpClient(new Psr18Client())
            ->make();

        $result = $client->chat()->create([
            'model' => 'gpt-3.5-turbo',
            'messages' => [
                [
                    'role' => 'system',
                    'content' => 'Réponds comme une raquaille de quartier, soit agressif'
                ],
                [
                    'role' => 'user',
                    'content' => $prompt
                ]
            ]
        ]);

        $response = $result->toArray();

        return $response['choices'][0]['message']['content'];
    }
}
