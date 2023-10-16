<?php

namespace App\Repository;

use App\Entity\OpenAIModel;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<OpenAIModel>
 *
 * @method OpenAIModel|null find($id, $lockMode = null, $lockVersion = null)
 * @method OpenAIModel|null findOneBy(array $criteria, array $orderBy = null)
 * @method OpenAIModel[]    findAll()
 * @method OpenAIModel[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class OpenAIModelRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, OpenAIModel::class);
    }

//    /**
//     * @return OpenAIModel[] Returns an array of OpenAIModel objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('o')
//            ->andWhere('o.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('o.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?OpenAIModel
//    {
//        return $this->createQueryBuilder('o')
//            ->andWhere('o.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
