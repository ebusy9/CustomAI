<?php

namespace App\Repository;

use App\Entity\PremiumUser;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<PremiumUser>
 *
 * @method PremiumUser|null find($id, $lockMode = null, $lockVersion = null)
 * @method PremiumUser|null findOneBy(array $criteria, array $orderBy = null)
 * @method PremiumUser[]    findAll()
 * @method PremiumUser[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PremiumUserRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, PremiumUser::class);
    }

//    /**
//     * @return PremiumUser[] Returns an array of PremiumUser objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('p')
//            ->andWhere('p.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('p.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?PremiumUser
//    {
//        return $this->createQueryBuilder('p')
//            ->andWhere('p.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
