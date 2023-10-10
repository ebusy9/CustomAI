<?php

namespace App\Controller;

use App\Entity\Message;
use App\Form\MessageType;
use App\Service\OpenAIService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ChatController extends AbstractController
{
    #[Route('/', name: 'app_chat')]
    public function chat(OpenAIService $openAIService, Request $request, EntityManagerInterface $entityManager): Response
    {
        $messages = [];
        $responses = [];

        $message = new Message();
        $form = $this->createForm(MessageType::class, $message);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $messages = $form->get('content')->getData();
            $responses = $openAIService->generateResponse($form->get('content')->getData());
        }
        
        return $this->render('chat/index.html.twig', [
            'form' => $form->createView(),
            'messages' => $messages,
            'responses' => $responses
        ]);
    }
}
