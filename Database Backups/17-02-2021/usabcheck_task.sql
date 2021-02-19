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
-- Table structure for table `task`
--

DROP TABLE IF EXISTS `task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task` (
  `taskId` int NOT NULL AUTO_INCREMENT,
  `testId` int NOT NULL,
  `stepsJSON` varchar(2000) NOT NULL,
  `sequenceNumber` int NOT NULL,
  `taskName` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`taskId`),
  KEY `FK_test_task_idx` (`testId`),
  CONSTRAINT `FK_test_task` FOREIGN KEY (`testId`) REFERENCES `test` (`testId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task`
--

LOCK TABLES `task` WRITE;
/*!40000 ALTER TABLE `task` DISABLE KEYS */;
INSERT INTO `task` VALUES (5,24,'[{\"value\":\"Do X......\"},{\"value\":\"Do Y......\"},{\"value\":\"Select Z......\"}]',2,'Task A'),(6,25,'[{\"value\":\"Do X......\"},{\"value\":\"Do Y......\"},{\"value\":\"Select Z......\"}]',2,'Task A'),(7,25,'[{\"value\":\"Do A......\"},{\"value\":\"Do B......\"},{\"value\":\"Select C......\"}]',4,'Task B'),(8,27,'[{\"value\":\"Do X......\"},{\"value\":\"Do Y......\"},{\"value\":\"Select Z......\"}]',2,'Task C'),(9,27,'[{\"value\":\"Do A......\"},{\"value\":\"Do B......\"},{\"value\":\"Select C......\"}]',4,'Task D'),(10,28,'[{\"value\":\"Do X......\"},{\"value\":\"Do Y......\"},{\"value\":\"Select Z......\"}]',2,'Task E'),(11,28,'[{\"value\":\"Do A......\"},{\"value\":\"Do B......\"},{\"value\":\"Select C......\"}]',4,'Task F'),(12,28,'[{\"value\":\"\"}]',5,'Task G'),(13,29,'[{\"value\":\"Do X......\"},{\"value\":\"Do Y......\"},{\"value\":\"Select Z......\"}]',2,'Select Item to Purchase'),(14,29,'[{\"value\":\"Do A......\"},{\"value\":\"Do B......\"},{\"value\":\"Select C......\"}]',4,'Clear Shopping Cart'),(15,29,'[{\"value\":\"Do E......\"},{\"value\":\"Do F......\"},{\"value\":\"Do G......\"},{\"value\":\"Do H......\"}]',5,'Purchase Item'),(16,43,'[{\"value\":\"11111\"}]',1,'Test ');
/*!40000 ALTER TABLE `task` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-02-17 15:27:46
