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
-- Table structure for table `taskgrade`
--

DROP TABLE IF EXISTS `taskgrade`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `taskgrade` (
  `taskGradeId` int NOT NULL AUTO_INCREMENT,
  `testGradeId` int NOT NULL,
  `taskId` int NOT NULL,
  `grade` varchar(50) NOT NULL,
  PRIMARY KEY (`taskGradeId`),
  KEY `FK_task_taskgrade_idx` (`taskId`),
  KEY `FK_testGrade_taskgrade_idx` (`testGradeId`),
  CONSTRAINT `FK_task_taskgrade` FOREIGN KEY (`taskId`) REFERENCES `task` (`taskId`) ON DELETE CASCADE,
  CONSTRAINT `FK_testGrade_taskgrade` FOREIGN KEY (`testGradeId`) REFERENCES `testgrade` (`testGradeId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `taskgrade`
--

LOCK TABLES `taskgrade` WRITE;
/*!40000 ALTER TABLE `taskgrade` DISABLE KEYS */;
INSERT INTO `taskgrade` VALUES (1,1,13,'Not Graded'),(2,1,14,'Pass'),(3,1,15,'Fail'),(4,1,13,'Pass'),(5,1,14,'Fail'),(6,1,15,'Pass'),(7,1,13,'Not Graded'),(8,1,14,'Pass'),(9,1,15,'Pass'),(10,1,13,'Pass'),(11,1,14,'Fail'),(12,1,15,'Pass'),(13,1,13,'Not Graded'),(14,1,14,'Pass'),(15,1,15,'Pass'),(16,1,13,'Not Graded'),(17,1,14,'Pass'),(18,1,15,'Not Graded'),(19,1,13,'Pass'),(20,1,14,'Fail'),(21,1,15,'Pass'),(22,1,13,'Fail'),(23,1,14,'Pass'),(24,1,15,'Pass'),(25,1,13,'Pass'),(26,1,14,'Fail'),(27,1,15,'Pass'),(28,1,13,'Not Graded'),(29,1,14,'Pass'),(30,1,15,'Pass'),(31,2,13,'Not Graded'),(32,2,14,'Not Graded'),(33,2,15,'Not Graded'),(34,3,13,'Not Graded'),(35,3,14,'Not Graded'),(36,3,15,'Not Graded'),(37,4,13,'Not Graded'),(38,4,14,'Not Graded'),(39,4,15,'Not Graded'),(40,5,13,'Not Graded'),(41,5,14,'Not Graded'),(42,5,15,'Not Graded'),(43,6,13,'Not Graded'),(44,6,14,'Not Graded'),(45,6,15,'Not Graded'),(46,7,13,'Fail'),(47,7,14,'Fail'),(48,7,15,'Fail'),(49,8,13,'Not Graded'),(50,8,14,'Pass'),(51,8,15,'Pass');
/*!40000 ALTER TABLE `taskgrade` ENABLE KEYS */;
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
