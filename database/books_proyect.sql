DROP DATABASE IF EXISTS `biblioteca_nueva`;

-- Crea la base de datos
CREATE DATABASE IF NOT EXISTS `biblioteca_nueva` DEFAULT CHARACTER SET utf8mb4 COLLATE=utf8mb4_unicode_ci;
USE `biblioteca_nueva`;

-- Tabla: authors
CREATE TABLE IF NOT EXISTS `authors` (
  `id_author` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `state` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_author`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: categories
CREATE TABLE IF NOT EXISTS `categories` (
  `id_category` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `state` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `description` TEXT,
  PRIMARY KEY (`id_category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: editorials
CREATE TABLE IF NOT EXISTS `editorials` (
  `id_editorial` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `state` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `description` TEXT,
  PRIMARY KEY (`id_editorial`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: users
CREATE TABLE IF NOT EXISTS `users` (
  `id_user` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `role` VARCHAR(20) DEFAULT 'user',
  `state` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: books
CREATE TABLE IF NOT EXISTS `books` (
  `id_book` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `isbn` VARCHAR(13) DEFAULT NULL,
  `year` INT DEFAULT NULL,
  `id_author` INT NOT NULL,
  `id_category` INT NOT NULL,
  `id_editorial` INT NOT NULL,
  `state` TINYINT(1) DEFAULT 1,
  `is_deleted` TINYINT(1) DEFAULT 0,
  `deleted_at` DATETIME DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `description` TEXT,
  `available_copies` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_book`),
  FOREIGN KEY (`id_author`) REFERENCES `authors`(`id_author`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`id_category`) REFERENCES `categories`(`id_category`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`id_editorial`) REFERENCES `editorials`(`id_editorial`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: index (solo si tu proyecto la necesita, normalmente no es necesaria)
CREATE TABLE IF NOT EXISTS `index` (
  `id` INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


