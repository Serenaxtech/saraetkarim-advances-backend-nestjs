-- mydb.category definition

CREATE TABLE `category` (
  `category_ID` int NOT NULL AUTO_INCREMENT,
  `category_Name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`category_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- mydb.customer definition

CREATE TABLE `customer` (
  `customer_ID` int NOT NULL AUTO_INCREMENT,
  `customer_FullName` varchar(140) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `customer_Email` varchar(100) DEFAULT NULL,
  `customer_Password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `customer_PhoneNumber` varchar(8) DEFAULT NULL,
  `role` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`customer_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- mydb.address definition

CREATE TABLE `address` (
  `address_ID` int NOT NULL AUTO_INCREMENT,
  `region` varchar(45) DEFAULT NULL,
  `street` varchar(45) DEFAULT NULL,
  `building` varchar(45) DEFAULT NULL,
  `floor` int DEFAULT '0',
  `moreDetails` varchar(45) DEFAULT NULL,
  `customer_ID` int DEFAULT NULL,
  PRIMARY KEY (`address_ID`),
  KEY `customer_ID` (`customer_ID`),
  CONSTRAINT `address_ibfk_1` FOREIGN KEY (`customer_ID`) REFERENCES `customer` (`customer_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- mydb.product definition

CREATE TABLE `product` (
  `product_ID` int NOT NULL AUTO_INCREMENT,
  `product_IMG` varchar(45) DEFAULT NULL,
  `product_Name` varchar(45) DEFAULT NULL,
  `product_Description` mediumtext,
  `product_Info` mediumtext,
  `product_Price` decimal(10,2) DEFAULT NULL,
  `category_ID` int DEFAULT NULL,
  `stock_quantity` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`product_ID`),
  KEY `category_ID` (`category_ID`),
  CONSTRAINT `product_ibfk_1` FOREIGN KEY (`category_ID`) REFERENCES `category` (`category_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- mydb.reviews definition

CREATE TABLE `reviews` (
  `review_ID` int NOT NULL AUTO_INCREMENT,
  `customer_ID` int DEFAULT NULL,
  `product_ID` int DEFAULT NULL,
  `rating` int DEFAULT NULL,
  `review_Text` mediumtext,
  PRIMARY KEY (`review_ID`),
  KEY `customer_ID` (`customer_ID`),
  KEY `product_ID` (`product_ID`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`customer_ID`) REFERENCES `customer` (`customer_ID`),
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`product_ID`) REFERENCES `product` (`product_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- mydb.cart definition

CREATE TABLE `cart` (
  `cart_ID` int NOT NULL AUTO_INCREMENT,
  `customer_ID` int DEFAULT NULL,
  `product_ID` int DEFAULT NULL,
  `quantity` int DEFAULT '1',
  `status` enum('active','checked_out') DEFAULT 'active',
  PRIMARY KEY (`cart_ID`),
  KEY `customer_ID` (`customer_ID`),
  KEY `product_ID` (`product_ID`),
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`customer_ID`) REFERENCES `customer` (`customer_ID`),
  CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`product_ID`) REFERENCES `product` (`product_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- mydb.customization definition

CREATE TABLE `customization` (
  `customization_ID` int NOT NULL AUTO_INCREMENT,
  `customization_Size` int DEFAULT NULL,
  `customization_Color` varchar(45) DEFAULT NULL,
  `product_ID` int DEFAULT NULL,
  PRIMARY KEY (`customization_ID`),
  KEY `product_ID` (`product_ID`),
  CONSTRAINT `customization_ibfk_1` FOREIGN KEY (`product_ID`) REFERENCES `product` (`product_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- mydb.orders definition

CREATE TABLE `orders` (
  `order_ID` int NOT NULL AUTO_INCREMENT,
  `cart_ID` int DEFAULT NULL,
  PRIMARY KEY (`order_ID`),
  KEY `cart_ID` (`cart_ID`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`cart_ID`) REFERENCES `cart` (`cart_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- mydb.shipment definition

CREATE TABLE `shipment` (
  `shipment_ID` int NOT NULL AUTO_INCREMENT,
  `order_ID` int DEFAULT NULL,
  `customer_ID` int DEFAULT NULL,
  PRIMARY KEY (`shipment_ID`),
  KEY `order_ID` (`order_ID`),
  KEY `customer_ID` (`customer_ID`),
  CONSTRAINT `shipment_ibfk_1` FOREIGN KEY (`order_ID`) REFERENCES `orders` (`order_ID`),
  CONSTRAINT `shipment_ibfk_2` FOREIGN KEY (`customer_ID`) REFERENCES `customer` (`customer_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;