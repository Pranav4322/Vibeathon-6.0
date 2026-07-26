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
);

-- Categories
INSERT INTO categories (id, restaurant_id, name, sort_order)
VALUES
  ('c0000001-0000-0000-0000-000000000001', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Starters', 1),
  ('c0000002-0000-0000-0000-000000000002', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Main Course', 2),
  ('c0000003-0000-0000-0000-000000000003', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Breads', 3),
  ('c0000004-0000-0000-0000-000000000004', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Desserts & Drinks', 4);

-- Menu Items — Starters
INSERT INTO menu_items (restaurant_id, category_id, name, description, price, is_veg, prep_time_minutes, availability_status)
VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000001-0000-0000-0000-000000000001',
   'Paneer Tikka', 'Marinated cottage cheese cubes grilled in tandoor with bell peppers and onions', 249.00, true, 15, 'available'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000001-0000-0000-0000-000000000001',
   'Chicken Seekh Kebab', 'Minced chicken mixed with aromatic spices, skewered and chargrilled', 299.00, false, 18, 'available'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000001-0000-0000-0000-000000000001',
   'Crispy Corn', 'Golden fried corn tossed with spicy masala and curry leaves', 179.00, true, 10, 'available'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000001-0000-0000-0000-000000000001',
   'Fish Amritsari', 'Batter-fried fish fillets with ajwain and chaat masala', 349.00, false, 20, 'low');

-- Menu Items — Main Course
INSERT INTO menu_items (restaurant_id, category_id, name, description, price, is_veg, prep_time_minutes, availability_status)
VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000002-0000-0000-0000-000000000002',
   'Dal Makhani', 'Slow-cooked black lentils with cream, butter and aromatic spices', 199.00, true, 20, 'available'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000002-0000-0000-0000-000000000002',
   'Butter Chicken', 'Tender chicken in rich tomato-butter gravy with kasuri methi', 329.00, false, 22, 'available'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000002-0000-0000-0000-000000000002',
   'Palak Paneer', 'Fresh spinach gravy with soft paneer cubes seasoned with garlic', 219.00, true, 18, 'available'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000002-0000-0000-0000-000000000002',
   'Chicken Biryani', 'Fragrant basmati rice layered with spiced chicken and saffron', 349.00, false, 25, 'out'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000002-0000-0000-0000-000000000002',
   'Veg Biryani', 'Aromatic basmati rice with seasonal vegetables and whole spices', 249.00, true, 22, 'available');

-- Menu Items — Breads
INSERT INTO menu_items (restaurant_id, category_id, name, description, price, is_veg, prep_time_minutes, availability_status)
VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000003-0000-0000-0000-000000000003',
   'Butter Naan', 'Soft leavened bread brushed with butter, baked in tandoor', 69.00, true, 8, 'available'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000003-0000-0000-0000-000000000003',
   'Garlic Naan', 'Tandoor-baked naan topped with fresh garlic and coriander', 79.00, true, 8, 'available'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000003-0000-0000-0000-000000000003',
   'Tandoori Roti', 'Whole wheat bread baked in clay oven', 39.00, true, 6, 'available');

-- Menu Items — Desserts & Drinks
INSERT INTO menu_items (restaurant_id, category_id, name, description, price, is_veg, prep_time_minutes, availability_status)
VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000004-0000-0000-0000-000000000004',
   'Gulab Jamun', 'Golden fried milk dumplings soaked in rose-cardamom sugar syrup', 129.00, true, 5, 'available'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000004-0000-0000-0000-000000000004',
   'Mango Lassi', 'Thick and creamy yogurt drink blended with Alphonso mango pulp', 149.00, true, 5, 'available'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c0000004-0000-0000-0000-000000000004',
   'Masala Chai', 'Traditional Indian spiced tea brewed with ginger and cardamom', 59.00, true, 5, 'available');

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
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '8', 8, 'free');
