-- ============================================================
-- Smart Restaurant Management System — Initial Schema
-- Migration: 001_initial_schema.sql
-- ============================================================

-- ========================
-- 1. Custom Enum Types
-- ========================

CREATE TYPE availability_status AS ENUM ('available', 'low', 'out');
CREATE TYPE order_status AS ENUM ('placed', 'confirmed', 'preparing', 'ready', 'served', 'billed');
CREATE TYPE table_status AS ENUM ('free', 'occupied', 'reserved');
CREATE TYPE staff_role AS ENUM ('admin', 'manager', 'chef', 'waiter');
CREATE TYPE reservation_status AS ENUM ('waiting', 'seated', 'cancelled', 'completed');

-- ========================
-- 2. Tables
-- ========================

-- Restaurants
CREATE TABLE restaurants (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  address     TEXT,
  phone       TEXT,
  logo_url    TEXT,
  settings    JSONB DEFAULT '{}'::jsonb,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Categories (menu groupings)
CREATE TABLE categories (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id   UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  sort_order      INT NOT NULL DEFAULT 0
);

CREATE INDEX idx_categories_restaurant ON categories(restaurant_id);

-- Menu Items
CREATE TABLE menu_items (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id        UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  category_id          UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name                 TEXT NOT NULL,
  description          TEXT,
  price                NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  image_url            TEXT,
  availability_status  availability_status NOT NULL DEFAULT 'available',
  is_veg               BOOLEAN NOT NULL DEFAULT true,
  prep_time_minutes    INT DEFAULT 15,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_menu_items_restaurant ON menu_items(restaurant_id);
CREATE INDEX idx_menu_items_category ON menu_items(category_id);
CREATE INDEX idx_menu_items_availability ON menu_items(availability_status);

-- Tables (restaurant seating)
CREATE TABLE tables (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id   UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  table_number    TEXT NOT NULL,
  capacity        INT NOT NULL DEFAULT 4,
  status          table_status NOT NULL DEFAULT 'free',
  occupied_since  TIMESTAMPTZ
);

CREATE INDEX idx_tables_restaurant ON tables(restaurant_id);
CREATE INDEX idx_tables_status ON tables(status);
CREATE UNIQUE INDEX idx_tables_restaurant_number ON tables(restaurant_id, table_number);

-- Staff
CREATE TABLE staff (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  restaurant_id   UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  email           TEXT NOT NULL,
  role            staff_role NOT NULL DEFAULT 'waiter',
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_staff_restaurant ON staff(restaurant_id);
CREATE INDEX idx_staff_user ON staff(user_id);
CREATE UNIQUE INDEX idx_staff_email_restaurant ON staff(email, restaurant_id);

-- Orders
CREATE TABLE orders (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id         UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  table_id              UUID NOT NULL REFERENCES tables(id) ON DELETE RESTRICT,
  staff_id              UUID REFERENCES staff(id) ON DELETE SET NULL,
  customer_name         TEXT,
  status                order_status NOT NULL DEFAULT 'placed',
  special_instructions  TEXT,
  total_amount          NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
  placed_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  confirmed_at          TIMESTAMPTZ,
  preparing_at          TIMESTAMPTZ,
  ready_at              TIMESTAMPTZ,
  served_at             TIMESTAMPTZ,
  billed_at             TIMESTAMPTZ
);

CREATE INDEX idx_orders_restaurant ON orders(restaurant_id);
CREATE INDEX idx_orders_table ON orders(table_id);
CREATE INDEX idx_orders_staff ON orders(staff_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_placed_at ON orders(placed_at DESC);

-- Order Items
CREATE TABLE order_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id    UUID NOT NULL REFERENCES menu_items(id) ON DELETE RESTRICT,
  quantity        INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price      NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
  subtotal        NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
  notes           TEXT
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_menu_item ON order_items(menu_item_id);

-- Reservations
CREATE TABLE reservations (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id           UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  table_id                UUID REFERENCES tables(id) ON DELETE SET NULL,
  customer_name           TEXT NOT NULL,
  customer_phone          TEXT,
  party_size              INT NOT NULL DEFAULT 2 CHECK (party_size > 0),
  status                  reservation_status NOT NULL DEFAULT 'waiting',
  queue_position          INT,
  estimated_wait_minutes  INT,
  reserved_for            TIMESTAMPTZ,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_reservations_restaurant ON reservations(restaurant_id);
CREATE INDEX idx_reservations_table ON reservations(table_id);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_reservations_reserved_for ON reservations(reserved_for);

-- ========================
-- 3. Row Level Security (Permissive — tightened later)
-- ========================

ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Permissive policies: allow all operations for now (will be refined in later phases)
-- These ensure RLS is active but doesn't block development

-- Restaurants: public read, authenticated write
CREATE POLICY "restaurants_select" ON restaurants FOR SELECT USING (true);
CREATE POLICY "restaurants_insert" ON restaurants FOR INSERT WITH CHECK (true);
CREATE POLICY "restaurants_update" ON restaurants FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "restaurants_delete" ON restaurants FOR DELETE USING (true);

-- Categories: public read, authenticated write
CREATE POLICY "categories_select" ON categories FOR SELECT USING (true);
CREATE POLICY "categories_insert" ON categories FOR INSERT WITH CHECK (true);
CREATE POLICY "categories_update" ON categories FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "categories_delete" ON categories FOR DELETE USING (true);

-- Menu Items: public read, authenticated write
CREATE POLICY "menu_items_select" ON menu_items FOR SELECT USING (true);
CREATE POLICY "menu_items_insert" ON menu_items FOR INSERT WITH CHECK (true);
CREATE POLICY "menu_items_update" ON menu_items FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "menu_items_delete" ON menu_items FOR DELETE USING (true);

-- Tables: public read, authenticated write
CREATE POLICY "tables_select" ON tables FOR SELECT USING (true);
CREATE POLICY "tables_insert" ON tables FOR INSERT WITH CHECK (true);
CREATE POLICY "tables_update" ON tables FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "tables_delete" ON tables FOR DELETE USING (true);

-- Staff: authenticated only
CREATE POLICY "staff_select" ON staff FOR SELECT USING (true);
CREATE POLICY "staff_insert" ON staff FOR INSERT WITH CHECK (true);
CREATE POLICY "staff_update" ON staff FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "staff_delete" ON staff FOR DELETE USING (true);

-- Orders: permissive for now
CREATE POLICY "orders_select" ON orders FOR SELECT USING (true);
CREATE POLICY "orders_insert" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "orders_update" ON orders FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "orders_delete" ON orders FOR DELETE USING (true);

-- Order Items: permissive for now
CREATE POLICY "order_items_select" ON order_items FOR SELECT USING (true);
CREATE POLICY "order_items_insert" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "order_items_update" ON order_items FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "order_items_delete" ON order_items FOR DELETE USING (true);

-- Reservations: permissive for now
CREATE POLICY "reservations_select" ON reservations FOR SELECT USING (true);
CREATE POLICY "reservations_insert" ON reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "reservations_update" ON reservations FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "reservations_delete" ON reservations FOR DELETE USING (true);

-- ========================
-- 4. Enable Realtime for key tables
-- ========================

ALTER PUBLICATION supabase_realtime ADD TABLE menu_items;
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE order_items;
ALTER PUBLICATION supabase_realtime ADD TABLE tables;
ALTER PUBLICATION supabase_realtime ADD TABLE reservations;
