-- Add pin_code to staff table for rapid PIN login
ALTER TABLE staff ADD COLUMN pin_code TEXT DEFAULT '1234';
