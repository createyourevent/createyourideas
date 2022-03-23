-- MySQL dump 10.13  Distrib 5.7.34, for Linux (x86_64)
--
-- Host: localhost    Database: createyourevent
-- ------------------------------------------------------
-- Server version	5.7.34

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `point`
--

LOCK TABLES `point` WRITE;
/*!40000 ALTER TABLE `point` DISABLE KEYS */;
INSERT INTO `point` (`id`, `jhi_key`, `name`, `key_name`, `description`, `key_description`, `category`, `points`, `count_per_day`, `creation_date`) VALUES (1,'register_user','Register as user','points.register_user','If you create an account on www.createyourevent.org you get any points.','points.register_user_desc','REGISTER',10,1,NULL),(2,'register_organizer','Register as organizer','points.register_organizer','If you create an account on www.createyourevent.org you will get any points.','points.register_organizer_desc','REGISTER',75,1,NULL),(3,'register_supplier','Register as supplier','points.register_supplier','If you create an account on www.createyourevent.org as supplier, you will get any points. ','points.register_supplier_desc','REGISTER',50,1,NULL),(4,'register_service','Register as service','points.register_service','If you create an account on www.createyourevent.org as service, you will get any points.','points.register_service_desc','REGISTER',50,1,NULL),(5,'login','Login on www.createyourevent.org ','points.login','If you sign in in your account you will get some points. You could login max. 5 times per day.','points.login_desc','MISCELLANEOUS',2,5,NULL),(6,'add_comment','Add a comment','points.add_comment','If you add a comment, you get any points. You could write max. 5 comments per day.','points.add_comment_desc','COMMENT',5,5,NULL),(7,'create_event','Create an event ','points.create_event','If you create an event on www.createyourevent.org and write it out, you will earn some points. You could create maximal 5 events per day.','points.create_event_desc','EVENT',10,5,NULL),(8,'create_shop','Create a shop','points.create_shop','If you register a shop on www.createyourevent.org, you will earn some points. Further, for each product, which you register, you will get some points too. ','points.create_shop_desc','SHOP',25,3,NULL),(9,'create_product','Create a product','points.create_product','If you register a product in our store for the events, you will get any points. Further, if you sell a product about our plattform, you will earn some points too. ','points.create_product_desc','PRODUCT',10,5,NULL),(10,'create_service','Create a service','points.create_service','If you register a service, for example a security, a sanitary service or something other, you will get some points. For each service category you will recive the same points.','points.create_service_desc','SERVICE',25,3,NULL),(11,'upload_image_product','Upload a product image in product-image-gallery','points.upload_image_product','If you upload any images in the product-image-gallery  you will get some points. You could upload maximal 10 pictures per day.','points.upload_image_product_desc','PRODUCT',5,10,NULL),(12,'upload_image_shop','Upload a shop image','points.upload_image_shop','If you upload a shop-image you will get some points. You could upload too some pictures from your team or like that. ','points.upload_image_shop_desc','SHOP',5,10,NULL),(13,'upload_image_event','Upload a event image','points.upload_image_event','If you upload any image on the event which you create, you will get some points. For each pictures you will get 5 points.','points.upload_image_event_desc','EVENT',5,10,NULL),(14,'rating_like','If you rate something with like/dislike','points.rating_like','If you rate something on www.createyourevent.org and give a little feedback about your like/dislike, you will get some points.','points.rating_like_desc','RATING',7,5,NULL),(15,'rating_stars','Rating with stars','points.rating_stars','If you rate with stars you will get some points.','points.rating_stars','RATING',3,5,NULL);
/*!40000 ALTER TABLE `point` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-11-20 18:04:15
