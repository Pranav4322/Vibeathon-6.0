-- Migration: 004_add_course_override.sql
-- Description: Adds course_override to order_items for Phase 18

ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS course_override course_category NULL;
