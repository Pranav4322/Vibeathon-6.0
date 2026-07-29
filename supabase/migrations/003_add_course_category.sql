-- Migration: 003_add_course_category.sql
-- Description: Adds course_category to menu_items and chef_override_minutes to orders

-- 1. Create enum for course categories
CREATE TYPE course_category AS ENUM ('starter', 'main', 'dessert', 'beverage');

-- 2. Add course_category to menu_items with default 'main'
ALTER TABLE menu_items 
ADD COLUMN course_category course_category NOT NULL DEFAULT 'main';

-- 3. Add chef_override_minutes to orders
ALTER TABLE orders 
ADD COLUMN chef_override_minutes INT DEFAULT 0;
