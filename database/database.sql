-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: ecommerce_cp
-- ------------------------------------------------------
-- Server version	8.0.40

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
-- Table structure for table `address`
--

DROP TABLE IF EXISTS `address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `address` (
  `address_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `flat_no` varchar(20) DEFAULT NULL,
  `building_name` varchar(100) DEFAULT NULL,
  `city` varchar(50) NOT NULL,
  `state` varchar(50) NOT NULL,
  `pincode` varchar(10) NOT NULL,
  PRIMARY KEY (`address_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `address_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `address`
--

LOCK TABLES `address` WRITE;
/*!40000 ALTER TABLE `address` DISABLE KEYS */;
INSERT INTO `address` VALUES (1,1,'101','Sunshine Apartments','Mumbai','Maharashtra','400001'),(2,1,'202','Green Valley','Pune','Maharashtra','411001'),(3,2,'305','Blue Heights','Bangalore','Karnataka','560001'),(4,3,'10','Rose Residency','Delhi','Delhi','110001'),(5,4,'a11','vit','rajgurunagar, pune','Maharashtra','410505'),(6,5,'test1','vit','rajgurunagar, pune','Maharashtra','410505'),(7,4,'11','asdf','rajgurunagar, pune','Maharashtra','410505'),(8,6,'11','aaaa','rajgurunagar, pune','Maharashtra','410505'),(9,7,'11','aaaa','rajgurunagar, pune','Maharashtra','410505'),(10,7,'56','fghj','rajgurunagar, pune','Maharashtra','410505'),(11,4,'vit','123','pune','Maharashtra','440146'),(12,8,'11','vit','pune','Maharashtra','440146'),(13,9,'11','asd','dfg','fgh','41741'),(14,11,'11','asdfg','dafsrgdhg','afsdgh','123456789'),(15,12,'12345','sdfg','sdfb','dfgh','1234'),(16,12,'66','ert','ert','ert','66'),(17,14,'1211','VIT','Pune','Maharashtra','410505'),(18,11,'11','VIT','Pune','Maharashtra','410505');
/*!40000 ALTER TABLE `address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `item_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `unit_price` decimal(10,2) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`item_id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,1,1,0.00,1999.00),(2,1,3,1,0.00,899.00),(3,2,5,1,0.00,2499.00),(4,3,4,1,0.00,1299.00),(5,4,2,1,0.00,3499.00),(6,4,1,2,0.00,1999.00),(7,4,4,1,0.00,1299.00),(8,5,2,1,0.00,3499.00),(9,5,1,2,0.00,1999.00),(10,5,4,1,0.00,1299.00),(11,6,2,1,0.00,3499.00),(12,6,1,2,0.00,1999.00),(13,6,4,1,0.00,1299.00),(14,7,3,1,0.00,899.00),(15,8,1,1,0.00,1999.00),(16,9,1,3,0.00,1999.00),(17,9,2,2,0.00,3499.00),(18,9,3,2,0.00,899.00),(19,10,1,1,0.00,1999.00),(20,10,2,1,0.00,3499.00),(21,10,5,3,0.00,2499.00),(22,11,1,1,0.00,1999.00),(23,11,2,1,0.00,3499.00),(24,11,3,1,0.00,899.00),(25,12,1,2,0.00,1999.00),(26,12,2,2,0.00,3499.00),(27,12,3,1,0.00,899.00),(28,13,1,3,0.00,1999.00),(29,13,2,3,0.00,3499.00),(30,13,3,1,0.00,899.00),(31,13,4,1,0.00,1299.00),(32,14,3,3,0.00,899.00),(33,14,2,3,0.00,3499.00),(34,15,1,1,0.00,1999.00),(35,16,1,1,0.00,1999.00),(36,16,3,1,0.00,899.00),(37,17,1,4,0.00,1999.00),(38,17,3,1,0.00,899.00),(39,17,4,1,0.00,1299.00),(40,18,2,1,0.00,3499.00),(41,18,3,1,0.00,899.00),(42,19,3,2,0.00,899.00),(43,19,4,1,0.00,1299.00),(44,19,2,1,0.00,3499.00),(45,20,5,2,0.00,2499.00),(46,21,4,2,0.00,2598.00),(47,22,2,2,3499.00,6998.00),(48,23,1,1,1999.00,1999.00),(49,23,2,2,3499.00,6998.00),(50,23,3,3,899.00,2697.00),(51,23,4,3,1299.00,3897.00),(52,24,3,3,899.00,2697.00),(53,24,5,1,2499.00,2499.00),(54,25,3,3,899.00,2697.00),(55,25,4,1,1299.00,1299.00),(56,26,1,1,1999.00,1999.00),(57,26,3,2,899.00,1798.00),(58,26,4,1,1299.00,1299.00),(59,26,5,1,2499.00,2499.00),(60,27,1,1,1999.00,1999.00),(61,27,4,1,1299.00,1299.00),(62,27,3,2,899.00,1798.00),(63,28,1,1,1999.00,1999.00),(64,28,4,1,1299.00,1299.00),(65,28,3,2,899.00,1798.00),(66,29,1,1,1999.00,1999.00),(67,29,4,1,1299.00,1299.00),(68,29,3,2,899.00,1798.00),(69,30,1,2,1999.00,3998.00),(70,30,4,3,1299.00,3897.00),(71,30,3,3,899.00,2697.00),(72,31,3,1,899.00,899.00),(73,31,4,1,1299.00,1299.00);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `address_id` int NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('pending','confirmed','shipped','delivered','cancelled') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`order_id`),
  KEY `user_id` (`user_id`),
  KEY `address_id` (`address_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`address_id`) REFERENCES `address` (`address_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,1,1,4498.00,'confirmed','2026-03-02 09:22:15'),(2,2,3,2499.00,'delivered','2026-03-02 09:22:15'),(3,3,4,1299.00,'pending','2026-03-02 09:22:15'),(4,4,1,8796.00,'pending','2026-03-02 11:19:53'),(5,4,1,8796.00,'pending','2026-03-02 11:20:04'),(6,4,5,8796.00,'confirmed','2026-03-02 11:23:44'),(7,4,5,899.00,'confirmed','2026-03-02 11:24:34'),(8,4,5,1999.00,'confirmed','2026-03-02 11:59:44'),(9,5,6,14793.00,'confirmed','2026-03-02 12:04:46'),(10,4,5,12346.00,'confirmed','2026-03-02 19:26:40'),(11,4,5,6397.00,'confirmed','2026-03-02 19:51:54'),(12,6,8,11895.00,'confirmed','2026-03-02 20:05:26'),(13,7,9,18692.00,'confirmed','2026-03-02 21:11:16'),(14,4,7,13194.00,'confirmed','2026-03-09 08:20:32'),(15,4,11,1999.00,'confirmed','2026-03-09 08:37:55'),(16,4,5,2898.00,'confirmed','2026-03-09 08:51:16'),(17,8,12,10194.00,'confirmed','2026-03-11 06:08:38'),(18,4,7,4398.00,'confirmed','2026-03-11 06:10:37'),(19,9,13,6596.00,'confirmed','2026-03-25 07:45:04'),(20,11,14,4998.00,'confirmed','2026-04-18 08:50:59'),(21,11,14,2598.00,'confirmed','2026-04-18 08:58:56'),(22,11,14,6998.00,'confirmed','2026-04-18 09:04:28'),(23,11,14,15591.00,'confirmed','2026-04-18 09:05:02'),(24,12,15,5196.00,'confirmed','2026-04-18 09:40:48'),(25,12,16,3996.00,'confirmed','2026-04-18 10:54:15'),(26,14,17,7595.00,'confirmed','2026-04-24 12:00:30'),(27,11,14,5096.00,'pending','2026-04-27 17:19:05'),(28,11,14,5096.00,'pending','2026-04-27 17:19:21'),(29,11,14,5096.00,'pending','2026-04-27 17:19:36'),(30,11,14,10592.00,'confirmed','2026-04-27 17:21:23'),(31,11,18,2198.00,'confirmed','2026-04-27 17:22:25');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `payment_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `user_id` int NOT NULL,
  `payment_method` enum('cash','upi','credit_card','debit_card') NOT NULL,
  `status` enum('pending','completed','failed','refunded') DEFAULT 'pending',
  `paid_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`payment_id`),
  UNIQUE KEY `order_id` (`order_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  CONSTRAINT `payment_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
INSERT INTO `payment` VALUES (1,1,1,'upi','completed','2026-03-02 09:22:15'),(2,2,2,'credit_card','completed','2026-03-02 09:22:15'),(3,3,3,'cash','pending','2026-03-02 09:22:15'),(4,6,4,'upi','completed','2026-03-02 11:23:44'),(5,7,4,'upi','completed','2026-03-02 11:24:34'),(6,8,4,'upi','completed','2026-03-02 11:59:44'),(7,9,5,'cash','completed','2026-03-02 12:04:46'),(8,10,4,'cash','completed','2026-03-02 19:26:40'),(9,11,4,'upi','completed','2026-03-02 19:51:54'),(10,12,6,'cash','completed','2026-03-02 20:05:26'),(11,13,7,'cash','completed','2026-03-02 21:11:16'),(12,14,4,'cash','completed','2026-03-09 08:20:32'),(13,15,4,'cash','completed','2026-03-09 08:37:55'),(14,16,4,'upi','completed','2026-03-09 08:51:16'),(15,17,8,'cash','completed','2026-03-11 06:08:38'),(16,18,4,'cash','completed','2026-03-11 06:10:37'),(17,19,9,'upi','completed','2026-03-25 07:45:04'),(18,20,11,'cash','completed','2026-04-18 08:50:59'),(19,21,11,'upi','completed','2026-04-18 08:58:56'),(20,22,11,'upi','completed','2026-04-18 09:04:28'),(21,23,11,'debit_card','completed','2026-04-18 09:05:02'),(22,24,12,'upi','completed','2026-04-18 09:40:48'),(23,25,12,'upi','completed','2026-04-18 10:54:15'),(24,26,14,'upi','completed','2026-04-24 12:00:30'),(25,30,11,'upi','completed','2026-04-27 17:21:23'),(26,31,11,'credit_card','completed','2026-04-27 17:22:25');
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `product_name` varchar(100) NOT NULL,
  `product_price` decimal(10,2) NOT NULL,
  `stock` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Wireless Headphones',1999.00,20,'2026-03-02 09:22:15'),(2,'Mechanical Keyboard',3499.00,9,'2026-03-02 09:22:15'),(3,'USB-C Hub',899.00,65,'2026-03-02 09:22:15'),(4,'Laptop Stand',1299.00,55,'2026-03-02 09:22:15'),(5,'Webcam HD 1080p',2499.00,33,'2026-03-02 09:22:15');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'john_doe','john@gmail.com','hashed_password_1','2026-03-02 09:22:15'),(2,'jane_smith','jane@gmail.com','hashed_password_2','2026-03-02 09:22:15'),(3,'raj_kumar','raj@gmail.com','hashed_password_3','2026-03-02 09:22:15'),(4,'atharva01','atharvakalaskar4952@gmail.com','$2b$10$Qwnu852mNzZPJT5m2iHrMen66yIr5ydzkm2UJ2acNEvrFOqZGw/ay','2026-03-02 10:56:43'),(5,'testuser','test123@gmail.com','$2b$10$M4fM.mONAyFk6JLUuQ0BIeMRrheqH10DQFEfQl31RGnTgozL9fWL6','2026-03-02 12:03:47'),(6,'abcd','abcd@gmail.com','$2b$10$vQzg8m8SUMGkXWF6zRRFD.C3EqR/mI5fsKWKKwTfFfqnKgZuhlb4u','2026-03-02 20:04:22'),(7,'aaaa','aaaa@gmail.com','$2b$10$h1mFsO/ZRZtnd/wSeKozcuj5wqxaEZ5zRKagwwmNiZgVCFW7vgive','2026-03-02 21:10:12'),(8,'1234','1234@gmail.com','$2b$10$KQT.ZPMFOukEHSOM2OnOWODcMQ4zccFsfQ4Evj3mEFr5PjSwIqHsa','2026-03-11 06:07:00'),(9,'abcde','abcde@gmail.com','$2b$10$04jv3D9QN2TMCRzbGYyeCeN24wfOA8WzKMr9SyoWm6pFjOVtSUdfu','2026-03-25 07:41:03'),(10,'12411703','aaaa@gamil.com','$2b$10$tAUueHyWxpcrXBrxA48k5O00SnmnvAVPDwZyWAVRamKodLafCnS6S','2026-04-18 08:49:13'),(11,'aaaaaaaa','a@gamil.com','$2b$10$31/5CoJAQOwKTQvT6scGSeYZTST/xBjH.flb21dY4bltdeLmbF.a.','2026-04-18 08:50:12'),(12,'ak@gmail.com','ak@gmail.com','$2b$10$Yhjm7cbRym9S1NLKnnlnuOTFVAMX8Mrv6CqvbfNGVqFWmrOTHfgh.','2026-04-18 09:39:37'),(14,'testuser123','testuser123@gmail.com','$2b$10$IQyZQwqqiIicCV6ewXwlVeKwm.69bnB7fEl67c2gYHQDoyYWTa1pS','2026-04-24 11:55:30');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-27 22:57:17
