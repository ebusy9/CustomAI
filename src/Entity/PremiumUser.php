<?php

namespace App\Entity;

use App\Repository\PremiumUserRepository;
use DateTimeImmutable;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PremiumUserRepository::class)]
class PremiumUser
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $password = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $expiresAt = null;

    #[ORM\OneToMany(mappedBy: 'premiumUser', targetEntity: Message::class)]
    private Collection $messages;

    #[ORM\Column]
    private ?int $requestLimit = null;

    public function __construct()
    {
        $this->messages = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getExpiresAt(): ?\DateTimeImmutable
    {
        return $this->expiresAt;
    }

    public function setExpiresAt(\DateTimeImmutable $expiresAt): static
    {
        $this->expiresAt = $expiresAt;

        return $this;
    }

    /**
     * @return Collection<int, Message>
     */
    public function getMessages(): Collection
    {
        return $this->messages;
    }

    public function addMessage(Message $message): static
    {
        if (!$this->messages->contains($message)) {
            $this->messages->add($message);
            $message->setPremiumUser($this);
        }

        return $this;
    }

    public function removeMessage(Message $message): static
    {
        if ($this->messages->removeElement($message)) {
            if ($message->getPremiumUser() === $this) {
                $message->setPremiumUser(null);
            }
        }

        return $this;
    }

    public function getRequestLimit(): ?int
    {
        return $this->requestLimit;
    }

    public function setRequestLimit(int $requestLimit): static
    {
        $this->requestLimit = $requestLimit;

        return $this;
    }

    public function isValid(): bool
    {
        if($this->expiresAt < new DateTimeImmutable()) {
            return false;
        }
        
        if (count($this->messages) >= $this->requestLimit) {
            return false;
        }

        return true;
    }
}
