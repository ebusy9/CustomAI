<?php

namespace App\Controller;

use App\Entity\Message;
use App\Form\MessageType;
use App\Service\OpenAIService;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;


class ChatController extends AbstractController
{
    #[Route('/', name: 'app_chat')]
    public function chat(): Response
    {
        return $this->render('chat/index.html.twig', [
        ]);
    }


    #[Route('/api/gpt', name: 'api_pgt', methods: ['GET', 'POST'])]
    public function gpt(Request $request, EntityManagerInterface $entityManager, OpenAIService $openAIService): Response
    {
        $message = new Message();
        $form = $this->createForm(MessageType::class, $message);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $openAIService->setContextLimit($form->get('contextLimit')->getData());
            $openAIService->setSystemMessage($form->get('systemMessage')->getData());
            $openAIService->setTemperature($form->get('temperature')->getData());
            $message->setCreatedAt(new DateTimeImmutable())
                ->setRole('user');
            $response = $openAIService->generateResponse($message);

            $entityManager->persist($message);
            $entityManager->persist($response);
            $entityManager->flush();
            
            return new JsonResponse($openAIService->getArrayWithResponseForJsonEncode($form, $response, $message));
        }

        return new JsonResponse($openAIService->getArrayWithAllMessagesForJsonEncode($form));
    }
}
