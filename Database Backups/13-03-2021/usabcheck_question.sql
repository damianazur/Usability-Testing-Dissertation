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
-- Table structure for table `question`
--

DROP TABLE IF EXISTS `question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `question` (
  `questionId` int NOT NULL AUTO_INCREMENT,
  `testId` int NOT NULL,
  `questionConfigsJSON` varchar(1000) NOT NULL,
  `sequenceNumber` int NOT NULL,
  `stage` varchar(45) NOT NULL,
  PRIMARY KEY (`questionId`),
  KEY `FK_test_question_idx` (`testId`),
  CONSTRAINT `FK_test_question` FOREIGN KEY (`testId`) REFERENCES `test` (`testId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question`
--

LOCK TABLES `question` WRITE;
/*!40000 ALTER TABLE `question` DISABLE KEYS */;
INSERT INTO `question` VALUES (32,29,'{\"type\":\"question\",\"questionType\":\"text\",\"questionText\":\"What is your name?\"}',0,'pre-test'),(33,29,'{\"type\":\"question\",\"questionType\":\"multiple-choice\",\"questionText\":\"What is your favorite colour?\",\"choices\":[{\"value\":\"Red\"},{\"value\":\"Green\"},{\"value\":\"Blue\"},{\"value\":\"White\"},{\"value\":\"Black\"},{\"value\":\"Orange\"},{\"value\":\"Yellow\"}]}',1,'pre-test'),(34,29,'{\"type\":\"question\",\"questionType\":\"multiple-choice\",\"questionText\":\"How would you rate the difficulty of that task?\",\"choices\":[{\"value\":\"Easy\"},{\"value\":\"Moderate\"},{\"value\":\"Difficult\"}]}',3,'test'),(35,29,'{\"type\":\"question\",\"questionType\":\"text\",\"questionText\":\"Do you have any feedback for us?\"}',6,'test'),(36,42,'{\"type\":\"question\",\"questionType\":\"text\",\"questionText\":\"Hello\"}',0,'pre-test'),(37,43,'{\"type\":\"question\",\"questionType\":\"text\",\"questionText\":\"Hello\"}',0,'pre-test'),(50,84,'{\"type\":\"question\",\"questionType\":\"text\",\"questionText\":\"Hello\"}',0,'pre-test'),(51,85,'{\"type\":\"question\",\"questionType\":\"multiple-choice\",\"questionText\":\"dd\",\"choices\":[{\"value\":\"ffff\"}]}',0,'pre-test'),(52,86,'{\"type\":\"question\",\"questionType\":\"multiple-choice\",\"questionText\":\"ju\",\"choices\":[{\"value\":\"j\"}]}',0,'pre-test'),(53,87,'{\"type\":\"question\",\"questionType\":\"text\",\"questionText\":\"Hello\"}',0,'pre-test'),(57,101,'{\"type\":\"question\",\"questionType\":\"text\",\"questionText\":\"ddd\"}',0,'pre-test');
/*!40000 ALTER TABLE `question` ENABLE KEYS */;
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
