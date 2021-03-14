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
-- Table structure for table `test`
--

DROP TABLE IF EXISTS `test`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `test` (
  `testId` int NOT NULL AUTO_INCREMENT,
  `testName` varchar(45) NOT NULL,
  `projectId` int NOT NULL,
  `launchedDate` varchar(20) NOT NULL,
  `testStatus` varchar(45) NOT NULL,
  `referenceCode` varchar(8) DEFAULT NULL,
  `scenario` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`testId`),
  UNIQUE KEY `testName_UNIQUE` (`testName`),
  KEY `FK_project_test_idx` (`projectId`),
  CONSTRAINT `FK_project_test` FOREIGN KEY (`projectId`) REFERENCES `project` (`projectId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=109 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `test`
--

LOCK TABLES `test` WRITE;
/*!40000 ALTER TABLE `test` DISABLE KEYS */;
INSERT INTO `test` VALUES (29,'Sample Test 5',3,'2021-01-27','Open','H8VH1NLA',NULL),(42,'Sample Test 6',3,'2021-01-28','Open','CJN9XQ4P',NULL),(43,'Sample Test 7',3,'2021-01-28','Open','H9ON26UF',NULL),(84,'Project 3 Test 1',5,'2021-03-03','Open','FCWPVBR0',NULL),(85,'P3T2',5,'2021-03-03','Closed','PYMLA7PE',NULL),(86,'P3 T3',5,'2021-03-03','Open','GM8TAAER',NULL),(87,'A1',22,'2021-03-08','Open','GT6OLJMZ',NULL),(101,'Product Selection and Purchasing',5,'2021-03-09','Open','PMPBV97H',NULL),(102,'Test ABC',3,'2021-03-09','Open','X1KN3XWN',NULL),(107,'Sample Text X',3,'2021-03-10','Open','TEZPS4YT','This is a fake scneario');
/*!40000 ALTER TABLE `test` ENABLE KEYS */;
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
