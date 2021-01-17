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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `answer`
--

LOCK TABLES `answer` WRITE;
/*!40000 ALTER TABLE `answer` DISABLE KEYS */;
/*!40000 ALTER TABLE `answer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project`
--

DROP TABLE IF EXISTS `project`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project` (
  `projectId` int NOT NULL AUTO_INCREMENT,
  `projectName` varchar(45) NOT NULL,
  `username` varchar(50) NOT NULL,
  PRIMARY KEY (`projectId`),
  KEY `FK_researcher_project_idx` (`username`),
  CONSTRAINT `FK_researcher_project` FOREIGN KEY (`username`) REFERENCES `researcher` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project`
--

LOCK TABLES `project` WRITE;
/*!40000 ALTER TABLE `project` DISABLE KEYS */;
INSERT INTO `project` VALUES (1,'Project1','disguised123');
/*!40000 ALTER TABLE `project` ENABLE KEYS */;
UNLOCK TABLES;

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
  PRIMARY KEY (`questionId`),
  KEY `FK_test_question_idx` (`testId`),
  CONSTRAINT `FK_test_question` FOREIGN KEY (`testId`) REFERENCES `test` (`testId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question`
--

LOCK TABLES `question` WRITE;
/*!40000 ALTER TABLE `question` DISABLE KEYS */;
/*!40000 ALTER TABLE `question` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `researcher`
--

DROP TABLE IF EXISTS `researcher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `researcher` (
  `username` varchar(50) NOT NULL,
  `userPassword` varchar(50) NOT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `researcher`
--

LOCK TABLES `researcher` WRITE;
/*!40000 ALTER TABLE `researcher` DISABLE KEYS */;
INSERT INTO `researcher` VALUES ('Disguised','password123'),('disguised123','password123');
/*!40000 ALTER TABLE `researcher` ENABLE KEYS */;
UNLOCK TABLES;

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
  PRIMARY KEY (`taskId`),
  KEY `FK_test_task_idx` (`testId`),
  CONSTRAINT `FK_test_task` FOREIGN KEY (`testId`) REFERENCES `test` (`testId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task`
--

LOCK TABLES `task` WRITE;
/*!40000 ALTER TABLE `task` DISABLE KEYS */;
/*!40000 ALTER TABLE `task` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `taskgrade`
--

DROP TABLE IF EXISTS `taskgrade`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `taskgrade` (
  `taskGradeId` int NOT NULL AUTO_INCREMENT,
  `testId` int NOT NULL,
  `taskId` int NOT NULL,
  `grade` varchar(50) NOT NULL,
  PRIMARY KEY (`taskGradeId`),
  KEY `FK_testgrade_taskgrade_idx` (`testId`),
  KEY `FK_task_taskgrade_idx` (`taskId`),
  CONSTRAINT `FK_task_taskgrade` FOREIGN KEY (`taskId`) REFERENCES `task` (`taskId`),
  CONSTRAINT `FK_test_taskgrade` FOREIGN KEY (`testId`) REFERENCES `test` (`testId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `taskgrade`
--

LOCK TABLES `taskgrade` WRITE;
/*!40000 ALTER TABLE `taskgrade` DISABLE KEYS */;
/*!40000 ALTER TABLE `taskgrade` ENABLE KEYS */;
UNLOCK TABLES;

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
  `launchedDate` date NOT NULL,
  `status` varchar(45) NOT NULL,
  PRIMARY KEY (`testId`),
  KEY `FK_project_test_idx` (`projectId`),
  CONSTRAINT `FK_project_test` FOREIGN KEY (`projectId`) REFERENCES `project` (`projectId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `test`
--

LOCK TABLES `test` WRITE;
/*!40000 ALTER TABLE `test` DISABLE KEYS */;
/*!40000 ALTER TABLE `test` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `testgrade`
--

DROP TABLE IF EXISTS `testgrade`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `testgrade` (
  `testGradeId` int NOT NULL AUTO_INCREMENT,
  `testInstanceId` int NOT NULL,
  `comment` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`testGradeId`),
  KEY `FK_testinstance_testgrade_idx` (`testInstanceId`),
  CONSTRAINT `FK_testinstance_testgrade` FOREIGN KEY (`testInstanceId`) REFERENCES `testinstance` (`testInstanceId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `testgrade`
--

LOCK TABLES `testgrade` WRITE;
/*!40000 ALTER TABLE `testgrade` DISABLE KEYS */;
/*!40000 ALTER TABLE `testgrade` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `testinstance`
--

DROP TABLE IF EXISTS `testinstance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `testinstance` (
  `testInstanceId` int NOT NULL AUTO_INCREMENT,
  `testId` int NOT NULL,
  `studyDate` date NOT NULL,
  `videoLocation` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`testInstanceId`),
  KEY `FK_test_testInstance_idx` (`testId`),
  CONSTRAINT `FK_test_testInstance` FOREIGN KEY (`testId`) REFERENCES `test` (`testId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `testinstance`
--

LOCK TABLES `testinstance` WRITE;
/*!40000 ALTER TABLE `testinstance` DISABLE KEYS */;
/*!40000 ALTER TABLE `testinstance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `videotimestamp`
--

DROP TABLE IF EXISTS `videotimestamp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `videotimestamp` (
  `timeStampId` int NOT NULL AUTO_INCREMENT,
  `testInstanceId` int NOT NULL,
  `type` varchar(45) NOT NULL,
  `label` varchar(45) NOT NULL,
  `startTime` varchar(10) NOT NULL,
  `endTime` varchar(10) NOT NULL,
  PRIMARY KEY (`timeStampId`),
  KEY `FK_testinstance_videotimestamp_idx` (`testInstanceId`),
  CONSTRAINT `FK_testinstance_videotimestamp` FOREIGN KEY (`testInstanceId`) REFERENCES `testinstance` (`testInstanceId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `videotimestamp`
--

LOCK TABLES `videotimestamp` WRITE;
/*!40000 ALTER TABLE `videotimestamp` DISABLE KEYS */;
/*!40000 ALTER TABLE `videotimestamp` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-01-17 23:27:41
