CREATE DATABASE  IF NOT EXISTS `usabcheck` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `usabcheck`;
-- MySQL dump 10.13  Distrib 8.0.22, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: usabcheck
-- ------------------------------------------------------
-- Server version	8.0.22

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `researcher`
--

DROP TABLE IF EXISTS `researcher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `researcher` (
  `researcherId` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `userPassword` varchar(250) NOT NULL,
  PRIMARY KEY (`researcherId`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `researcher`
--

LOCK TABLES `researcher` WRITE;
/*!40000 ALTER TABLE `researcher` DISABLE KEYS */;
INSERT INTO `researcher` VALUES (4,'testuser123','$2a$10$wpxYsMF58Jro4e3Zc0WH..dLYrG2WX/HeJi3fbjGH.ZiGiq0zHZL.'),(5,'testuser1234','$2a$10$kouiReUkkt57KQsjnfsEVe.dGlA2dUJ1l9P/kWM75nz535BzuWECm'),(6,'SampleUser1','$2a$10$N9HIgayqeEEKeBQIklU.0uHOI5gWFSQc8rsg4Z5HFbVNlAAsouX8a'),(11,'SampleUser2','$2a$10$Dm8TyoR40MC4GOVTBmj6i.X9nULzF.N4/I9NRqtJLB57KZxMyfPv.'),(12,'SampleUser3','$2a$10$5307Eb0k/WPNv3Tr2tcTlOpEmd9jbkJgBIuGjd8bEymVlOhZBdIH2'),(13,'SampleUser4','$2a$10$k5G1PswiLIv21.1Pwq5J1ObOzlg3Nfx9AXE2kuv7iUUybJ5T5A3X6'),(14,'SampleUser5','$2a$10$qw8ISfg7NRn6S3NM2WnFP.ZNwKiwgxKrNXr5JfVmOihaN6LdZE.RK'),(15,'SampleUser7','$2a$10$gNURdpAJ4ZREEI.0rxz8HOfP/BqOUyiCUWmau36HSd5TFWknj6JOO'),(16,'SampleUser9','$2a$10$elGczS1GGcav0bnfL13vkuADRlb3xCJw7kIHJMnS7xFZ3u.eSvWti'),(17,'SampleUser0009','$2a$10$sCVZOwex8euRTn8ikPOZg.vlTnGapLiUN4AyKKn7Jg0H0bhw.XVKy'),(18,'SampleUser008','$2a$10$7BOFV9ppyzHA5jETWgXNAOrir8KfntRulTgJ5zF3fJmLPv6dpr/mC'),(19,'SampleUser0-07','$2a$10$etcSQYdAfa/BmAdjSE8BuOPlkhHyZRIOwGCmEBjjL5yP0mMB3W0PC'),(20,'SampleUser002','$2a$10$GYRcP.S65n4Zq8P8g7wjUOjNoz9aeIxuhPLuOeUbJXXO8Gv1JIgk2');
/*!40000 ALTER TABLE `researcher` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-03-13 18:27:47
