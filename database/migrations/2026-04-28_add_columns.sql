-- Migration: add total_price to order_items and image_url to products
-- Run with: mysql -u <user> -p ecommerce_cp < 2026-04-28_add_columns.sql

SET @OLD_SQL_MODE=@@SQL_MODE;
SET SQL_MODE='ANSI_QUOTES';

-- Add total_price to order_items (MySQL 8+ supports IF NOT EXISTS)
ALTER TABLE `order_items`
  ADD COLUMN IF NOT EXISTS `total_price` DECIMAL(10,2) NOT NULL DEFAULT 0.00;

-- Populate total_price for existing rows
UPDATE `order_items`
SET `total_price` = `unit_price` * `quantity`
WHERE `total_price` IS NULL OR `total_price` = 0.00;

-- Add image_url to products
ALTER TABLE `products`
  ADD COLUMN IF NOT EXISTS `image_url` VARCHAR(255) DEFAULT NULL;

-- Add returned status to orders (MySQL does not support IF NOT EXISTS for ENUM values)
ALTER TABLE `orders`
  MODIFY COLUMN `status` ENUM('pending','confirmed','shipped','delivered','returned','cancelled') NOT NULL DEFAULT 'pending';

-- Restore SQL_MODE
SET SQL_MODE=@OLD_SQL_MODE;

-- Quick verification queries (manual):
-- SELECT item_id, unit_price, quantity, total_price FROM order_items LIMIT 10;
-- SELECT product_id, product_name, image_url FROM products LIMIT 10;
