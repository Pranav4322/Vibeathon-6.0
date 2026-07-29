-- Phase 19: Advanced Table & Reservation Management

-- 1. Add available_modifiers to menu_items
ALTER TABLE menu_items
ADD COLUMN available_modifiers JSONB DEFAULT '[]'::jsonb;

-- 2. Add modifiers and is_held to order_items
ALTER TABLE order_items
ADD COLUMN modifiers JSONB DEFAULT '[]'::jsonb,
ADD COLUMN is_held BOOLEAN DEFAULT false;

-- 3. Add reservation_id and is_pre_order to orders, and allow table_id to be null
ALTER TABLE orders
ALTER COLUMN table_id DROP NOT NULL,
ADD COLUMN reservation_id UUID REFERENCES reservations(id) ON DELETE SET NULL,
ADD COLUMN is_pre_order BOOLEAN DEFAULT false;
