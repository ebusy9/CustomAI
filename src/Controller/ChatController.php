<?php

namespace App\Controller;

use App\Entity\Message;
use App\Form\KeyVerificationType;
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
        return $this->render('chat/index.html.twig', []);
    }


    #[Route('/key_verification', name: 'app_key_verification', methods: ['GET', 'POST'])]
    public function keyVerification(Request $request, OpenAIService $openAIService): Response
    {

        if ($request->isMethod('POST') ) {

            $requestData = json_decode($request->getContent(), true);

            if(isset($requestData['key'])) {

                if($openAIService->vertifyPassword($requestData['key'])) {
                    return  new JsonResponse(['keyStatus' => 'valid']);
                }

                return  new JsonResponse(['keyStatus' => 'invalid']);
            }
        }

        return new Response(status: Response::HTTP_BAD_REQUEST);
    }


    #[Route('/api/gpt', name: 'api_pgt', methods: ['GET', 'POST', 'DELETE'])]
    public function gpt(Request $request, EntityManagerInterface $entityManager, OpenAIService $openAIService): Response
    {
        $message = new Message();
        $form = $this->createForm(MessageType::class, $message);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            if ($form->get('premiumUser')->getData() !== null) {
                $openAIService->loginPremiumUser($form->get('premiumUser')->getData());
            }

            if ($openAIService->isRemainingFreeMsg() || $openAIService->isPremiumUserValidAndLoggedIn()) {
                $openAIService->setContextLimit($form->get('contextLimit')->getData());
                $openAIService->setSystemMessage($form->get('systemMessage')->getData());
                $openAIService->setTemperature($form->get('temperature')->getData());

                $message = $openAIService->stampUserMessage($message);
                $response = $openAIService->generateResponse($message);

                $entityManager->persist($message);
                $entityManager->persist($response);
                $entityManager->flush();

                return new JsonResponse($openAIService->prepareJsonResponseForMessages($form, $response, $message));
            }

            return new Response(status: Response::HTTP_UNAUTHORIZED);
        }

        if ($request->isMethod('DELETE')) {
            $requestData = json_decode($request->getContent(), true);

            if ($requestData['message'] === '*') {
                $messages = $openAIService->markMessagesAsDeleted();
                $quantity = count($messages);
            } elseif (gettype($requestData['message']) === 'integer') {
                $messages = $openAIService->markOneMessageAsDeleted($requestData['message']);
                $quantity = 1;
            }

            $entityManager->flush();
            return new JsonResponse(['deletedQuantity' => $quantity]);
        }

        if ($request->isMethod('GET')) {
            return new JsonResponse($openAIService->prepareJsonResponseForMessagesAndModels($form));
        }

        return new Response(status: Response::HTTP_BAD_REQUEST);
    }
}
