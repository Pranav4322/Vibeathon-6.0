-- ============================================================
-- Smart Restaurant Management System — Seed Data
-- 1 demo restaurant, 4 categories, ~15 menu items, 8 tables
-- ============================================================

-- Demo Restaurant
INSERT INTO restaurants (id, name, address, phone, logo_url, settings)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'The Spice Garden',
  '42 MG Road, Koramangala, Bangalore 560034',
  '+91 80 1234 5678',
  NULL,
  '{"currency": "INR", "tax_rate": 5.0, "opening_hours": "11:00-23:00"}'::jsonb
) ON CONFLICT DO NOTHING;

-- Categories
INSERT INTO categories (id, restaurant_id, name, sort_order)
VALUES
  ('c0000001-0000-0000-0000-000000000001', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Starters', 1),
  ('c0000002-0000-0000-0000-000000000002', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Main Course', 2),
  ('c0000003-0000-0000-0000-000000000003', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Breads', 3),
  ('c0000004-0000-0000-0000-000000000004', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Desserts & Drinks', 4)
ON CONFLICT DO NOTHING;

-- Menu Items — Starters
INSERT INTO menu_items (restaurant_id, category_id, name, description, price, is_veg, prep_time_minutes, availability_status, course_category)
VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000001-0000-0000-0000-000000000001',
   'Paneer Tikka', 'Marinated cottage cheese cubes grilled in tandoor with bell peppers and onions', 249.00, true, 15, 'available', 'starter'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000001-0000-0000-0000-000000000001',
   'Chicken Seekh Kebab', 'Minced chicken mixed with aromatic spices, skewered and chargrilled', 299.00, false, 18, 'available', 'starter'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000001-0000-0000-0000-000000000001',
   'Crispy Corn', 'Golden fried corn tossed with spicy masala and curry leaves', 179.00, true, 10, 'available', 'starter'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000001-0000-0000-0000-000000000001',
   'Fish Amritsari', 'Batter-fried fish fillets with ajwain and chaat masala', 349.00, false, 20, 'low', 'starter')
ON CONFLICT DO NOTHING;

-- Menu Items — Main Course
INSERT INTO menu_items (restaurant_id, category_id, name, description, price, is_veg, prep_time_minutes, availability_status, course_category)
VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000002-0000-0000-0000-000000000002',
   'Dal Makhani', 'Slow-cooked black lentils with cream, butter and aromatic spices', 199.00, true, 20, 'available', 'main'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000002-0000-0000-0000-000000000002',
   'Butter Chicken', 'Tender chicken in rich tomato-butter gravy with kasuri methi', 329.00, false, 22, 'available', 'main'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000002-0000-0000-0000-000000000002',
   'Palak Paneer', 'Fresh spinach gravy with soft paneer cubes seasoned with garlic', 219.00, true, 18, 'available', 'main'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000002-0000-0000-0000-000000000002',
   'Chicken Biryani', 'Fragrant basmati rice layered with spiced chicken and saffron', 349.00, false, 25, 'out', 'main'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000002-0000-0000-0000-000000000002',
   'Veg Biryani', 'Aromatic basmati rice with seasonal vegetables and whole spices', 249.00, true, 22, 'available', 'main')
ON CONFLICT DO NOTHING;

-- Menu Items — Breads
INSERT INTO menu_items (restaurant_id, category_id, name, description, price, is_veg, prep_time_minutes, availability_status, course_category)
VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000003-0000-0000-0000-000000000003',
   'Butter Naan', 'Soft leavened bread brushed with butter, baked in tandoor', 69.00, true, 8, 'available', 'main'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000003-0000-0000-0000-000000000003',
   'Garlic Naan', 'Tandoor-baked naan topped with fresh garlic and coriander', 79.00, true, 8, 'available', 'main'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000003-0000-0000-0000-000000000003',
   'Tandoori Roti', 'Whole wheat bread baked in clay oven', 39.00, true, 6, 'available', 'main')
ON CONFLICT DO NOTHING;

-- Menu Items — Desserts & Drinks
INSERT INTO menu_items (restaurant_id, category_id, name, description, price, is_veg, prep_time_minutes, availability_status, course_category)
VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000004-0000-0000-0000-000000000004',
   'Gulab Jamun', 'Golden fried milk dumplings soaked in rose-cardamom sugar syrup', 129.00, true, 5, 'available', 'dessert'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000004-0000-0000-0000-000000000004',
   'Mango Lassi', 'Thick and creamy yogurt drink blended with Alphonso mango pulp', 149.00, true, 5, 'available', 'beverage'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000004-0000-0000-0000-000000000004',
   'Masala Chai', 'Traditional Indian spiced tea brewed with ginger and cardamom', 59.00, true, 5, 'available', 'beverage')
ON CONFLICT DO NOTHING;

-- Tables (8 tables with varying capacity)
INSERT INTO tables (restaurant_id, table_number, capacity, status)
VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '1', 2, 'free'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2', 2, 'free'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '3', 4, 'free'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '4', 4, 'free'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '5', 4, 'free'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '6', 6, 'free'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '7', 6, 'free'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '8', 8, 'free')
ON CONFLICT DO NOTHING;

-- Staff
INSERT INTO staff (restaurant_id, name, email, role, pin_code) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Chef Gordon', 'gordon@spicegarden.com', 'chef', '1234'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Manager Mike', 'mike@spicegarden.com', 'manager', '4321'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Waiter Will', 'will@spicegarden.com', 'waiter', '0000')
ON CONFLICT (email, restaurant_id) DO NOTHING;

-- Phase 19 Modifiers
UPDATE menu_items SET available_modifiers = '[{"name": "Extra Spicy", "price": 0}, {"name": "Jain (No Onion/Garlic)", "price": 0}]'::jsonb WHERE name = 'Paneer Tikka';
UPDATE menu_items SET available_modifiers = '[{"name": "Extra Chicken", "price": 99}, {"name": "Extra Raita", "price": 20}]'::jsonb WHERE name = 'Chicken Biryani';
UPDATE menu_items SET available_modifiers = '[{"name": "Extra Butter", "price": 10}]'::jsonb WHERE name = 'Butter Naan';
UPDATE menu_items SET available_modifiers = '[{"name": "Less Sweet", "price": 0}]'::jsonb WHERE name = 'Mango Lassi';

-- Phase 20: Ingredients
INSERT INTO ingredients (id, restaurant_id, name, unit, quantity_in_stock, low_stock_threshold) VALUES
  ('f0000001-0000-0000-0000-000000000001', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Paneer', 'g', 5000, 1000),
  ('f0000002-0000-0000-0000-000000000002', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Chicken', 'g', 10000, 2000),
  ('f0000003-0000-0000-0000-000000000003', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Basmati Rice', 'g', 20000, 5000),
  ('f0000004-0000-0000-0000-000000000004', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Butter', 'g', 2000, 500),
  ('f0000005-0000-0000-0000-000000000005', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Black Lentils', 'g', 5000, 1000),
  ('f0000006-0000-0000-0000-000000000006', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Milk', 'ml', 10000, 2000),
  ('f0000007-0000-0000-0000-000000000007', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Wheat Flour', 'g', 15000, 3000),
  ('f0000008-0000-0000-0000-000000000008', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Tomatoes', 'g', 8000, 1500),
  ('f0000009-0000-0000-0000-000000000009', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Onions', 'g', 10000, 2000)
ON CONFLICT DO NOTHING;

-- Phase 20: Recipe Ingredients
INSERT INTO recipe_ingredients (menu_item_id, ingredient_id, quantity_required)
SELECT m.id, i.id, 200 FROM menu_items m, ingredients i WHERE m.name = 'Paneer Tikka' AND i.name = 'Paneer'
UNION ALL
SELECT m.id, i.id, 100 FROM menu_items m, ingredients i WHERE m.name = 'Paneer Tikka' AND i.name = 'Onions'
UNION ALL
SELECT m.id, i.id, 250 FROM menu_items m, ingredients i WHERE m.name = 'Chicken Seekh Kebab' AND i.name = 'Chicken'
UNION ALL
SELECT m.id, i.id, 150 FROM menu_items m, ingredients i WHERE m.name = 'Dal Makhani' AND i.name = 'Black Lentils'
UNION ALL
SELECT m.id, i.id, 50 FROM menu_items m, ingredients i WHERE m.name = 'Dal Makhani' AND i.name = 'Butter'
UNION ALL
SELECT m.id, i.id, 200 FROM menu_items m, ingredients i WHERE m.name = 'Butter Chicken' AND i.name = 'Chicken'
UNION ALL
SELECT m.id, i.id, 100 FROM menu_items m, ingredients i WHERE m.name = 'Butter Chicken' AND i.name = 'Tomatoes'
UNION ALL
SELECT m.id, i.id, 50 FROM menu_items m, ingredients i WHERE m.name = 'Butter Chicken' AND i.name = 'Butter'
UNION ALL
SELECT m.id, i.id, 150 FROM menu_items m, ingredients i WHERE m.name = 'Palak Paneer' AND i.name = 'Paneer'
UNION ALL
SELECT m.id, i.id, 200 FROM menu_items m, ingredients i WHERE m.name = 'Chicken Biryani' AND i.name = 'Chicken'
UNION ALL
SELECT m.id, i.id, 150 FROM menu_items m, ingredients i WHERE m.name = 'Chicken Biryani' AND i.name = 'Basmati Rice'
UNION ALL
SELECT m.id, i.id, 150 FROM menu_items m, ingredients i WHERE m.name = 'Veg Biryani' AND i.name = 'Basmati Rice'
UNION ALL
SELECT m.id, i.id, 100 FROM menu_items m, ingredients i WHERE m.name = 'Butter Naan' AND i.name = 'Wheat Flour'
UNION ALL
SELECT m.id, i.id, 20 FROM menu_items m, ingredients i WHERE m.name = 'Butter Naan' AND i.name = 'Butter'
UNION ALL
SELECT m.id, i.id, 100 FROM menu_items m, ingredients i WHERE m.name = 'Garlic Naan' AND i.name = 'Wheat Flour'
UNION ALL
SELECT m.id, i.id, 100 FROM menu_items m, ingredients i WHERE m.name = 'Tandoori Roti' AND i.name = 'Wheat Flour'
UNION ALL
SELECT m.id, i.id, 100 FROM menu_items m, ingredients i WHERE m.name = 'Gulab Jamun' AND i.name = 'Milk'
UNION ALL
SELECT m.id, i.id, 200 FROM menu_items m, ingredients i WHERE m.name = 'Mango Lassi' AND i.name = 'Milk'
UNION ALL
SELECT m.id, i.id, 150 FROM menu_items m, ingredients i WHERE m.name = 'Masala Chai' AND i.name = 'Milk'
ON CONFLICT DO NOTHING;