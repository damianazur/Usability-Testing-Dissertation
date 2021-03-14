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
-- Table structure for table `answer`
--

DROP TABLE IF EXISTS `answer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `answer` (
  `answerId` int NOT NULL AUTO_INCREMENT,
  `answerJSON` varchar(1000) NOT NULL,
  `questionId` int NOT NULL,
  `testInstanceId` int NOT NULL,
  PRIMARY KEY (`answerId`),
  KEY `FK_testinstance_answer_idx` (`testInstanceId`),
  KEY `FK_question_answer_idx` (`questionId`),
  CONSTRAINT `FK_question_answer` FOREIGN KEY (`questionId`) REFERENCES `question` (`questionId`),
  CONSTRAINT `FK_testinstance_answer` FOREIGN KEY (`testInstanceId`) REFERENCES `testinstance` (`testInstanceId`)
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `answer`
--

LOCK TABLES `answer` WRITE;
/*!40000 ALTER TABLE `answer` DISABLE KEYS */;
INSERT INTO `answer` VALUES (1,'{\"answer\":\"Damo\"}',32,5),(2,'{\"answer\":\"Orange\"}',33,5),(3,'{\"answer\":\"Easy\"}',34,5),(4,'{\"answer\":\"nope\"}',35,5),(5,'{\"answer\":\"Damo\"}',32,6),(6,'{\"answer\":\"Orange\"}',33,6),(7,'{\"answer\":\"Easy\"}',34,6),(8,'{\"answer\":\"nope\"}',35,6),(9,'{\"answer\":\"Damo\"}',32,7),(10,'{\"answer\":\"Orange\"}',33,7),(11,'{\"answer\":\"Easy\"}',34,7),(12,'{\"answer\":\"nope\"}',35,7),(13,'{\"answer\":\"Damo\"}',32,8),(14,'{\"answer\":\"Orange\"}',33,8),(15,'{\"answer\":\"Easy\"}',34,8),(16,'{\"answer\":\"nope\"}',35,8),(17,'{\"answer\":\"Damo\"}',32,9),(18,'{\"answer\":\"Orange\"}',33,9),(19,'{\"answer\":\"Easy\"}',34,9),(20,'{\"answer\":\"nope\"}',35,9),(21,'{\"answer\":\"Damo\"}',32,10),(22,'{\"answer\":\"Orange\"}',33,10),(23,'{\"answer\":\"Easy\"}',34,10),(24,'{\"answer\":\"nope\"}',35,10),(25,'{\"answer\":\"Answer Something\"}',32,11),(26,'{\"answer\":\"Green\"}',33,11),(27,'{\"answer\":\"Moderate\"}',34,11),(28,'{\"answer\":\"Nope, not really\"}',35,11),(29,'{\"answer\":\"Answer Something\"}',32,12),(30,'{\"answer\":\"Green\"}',33,12),(31,'{\"answer\":\"Moderate\"}',34,12),(32,'{\"answer\":\"Nope, not really\"}',35,12),(33,'{\"answer\":\"Something here\"}',32,13),(34,'{\"answer\":\"Red\"}',33,13),(35,'{\"answer\":\"Moderate\"}',34,13),(36,'{\"answer\":\"Nopeeee\"}',35,13),(37,'{\"answer\":\"deiudb\"}',32,14),(38,'{\"answer\":\"Blue\"}',33,14),(39,'{\"answer\":\"Moderate\"}',34,14),(40,'{\"answer\":\"edede\"}',35,14),(41,'{\"answer\":\"Damian Wojtowicz\"}',32,15),(42,'{\"answer\":\"Green\"}',33,15),(43,'{\"answer\":\"Moderate\"}',34,15),(44,'{\"answer\":\"Nope\"}',35,15),(45,'{\"answer\":\"Damian Wojtowicz\"}',32,16),(46,'{\"answer\":\"Green\"}',33,16),(47,'{\"answer\":\"Moderate\"}',34,16),(48,'{\"answer\":\"Nope\"}',35,16),(49,'{\"answer\":\"Alice\"}',32,17),(50,'{\"answer\":\"Blue\"}',33,17),(51,'{\"answer\":\"Difficult\"}',34,17),(52,'{\"answer\":\"Maybe next time c:\"}',35,17),(53,'{\"answer\":\"Paul\"}',32,18),(54,'{\"answer\":\"Orange\"}',33,18),(55,'{\"answer\":\"Moderate\"}',34,18),(56,'{\"answer\":\"Nooo\"}',35,18),(57,'{\"answer\":\"Damiain Wojtowicz\"}',32,19),(58,'{\"answer\":\"Yellow\"}',33,19),(59,'{\"answer\":\"Difficult\"}',34,19),(60,'{\"answer\":\"Not at the moment\"}',35,19),(61,'{\"answer\":\"Alex\"}',32,20),(62,'{\"answer\":\"Green\"}',33,20),(63,'{\"answer\":\"Easy\"}',34,20),(64,'{\"answer\":\"No feedback.\"}',35,20),(65,'{\"answer\":\"Damian\"}',32,21),(66,'{\"answer\":\"Orange\"}',33,21),(67,'{\"answer\":\"Moderate\"}',34,21),(68,'{\"answer\":\"No feedback\"}',35,21);
/*!40000 ALTER TABLE `answer` ENABLE KEYS */;
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
