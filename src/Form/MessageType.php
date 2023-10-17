<?php

namespace App\Form;

use App\Entity\Message;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\Range;

class MessageType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('content')
            ->add('systemMessage', TextType::class, [
                'mapped' => false,
                'required' => false,
                'label' => false
            ])
            ->add('model')
            ->add('contextLimit', NumberType::class, [
                'mapped' => false,
                'required' => false,
                'label' => false,
                'constraints' => new Range(min: 0, max: 10)
            ])
            ->add('temperature', NumberType::class, [
                'mapped' => false,
                'required' => false,
                'label' => false,
                'constraints' => new Range(min: 0, max: 20)
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Message::class,
        ]);
    }
}
