-- ============================================================
-- Phase 20: Ingredient-Level Inventory Management
-- Migration: 006_phase20_ingredients.sql
-- ============================================================

-- 1. Create ingredients table
CREATE TABLE ingredients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    unit TEXT NOT NULL, -- e.g., 'g', 'ml', 'pcs'
    quantity_in_stock NUMERIC(10, 2) NOT NULL DEFAULT 0,
    low_stock_threshold NUMERIC(10, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_ingredients_restaurant ON ingredients(restaurant_id);

-- 2. Create recipe_ingredients table
CREATE TABLE recipe_ingredients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
    quantity_required NUMERIC(10, 2) NOT NULL,
    UNIQUE(menu_item_id, ingredient_id)
);

CREATE INDEX idx_recipe_ingredients_menu_item ON recipe_ingredients(menu_item_id);

-- 3. Add ingredients_deducted to orders
ALTER TABLE orders ADD COLUMN ingredients_deducted BOOLEAN NOT NULL DEFAULT false;

-- 4. Create trigger to deduct inventory
CREATE OR REPLACE FUNCTION deduct_inventory_on_prep()
RETURNS TRIGGER AS $$
BEGIN
    -- Only run when status changes to 'preparing' and ingredients haven't been deducted
    IF NEW.status = 'preparing' AND OLD.status != 'preparing' AND NEW.ingredients_deducted = false THEN
        
        -- Deduct ingredients for all order items
        UPDATE ingredients i
        SET quantity_in_stock = i.quantity_in_stock - subquery.total_deduction
        FROM (
            SELECT ri.ingredient_id, SUM(ri.quantity_required * oi.quantity) as total_deduction
            FROM recipe_ingredients ri
            JOIN order_items oi ON oi.menu_item_id = ri.menu_item_id
            WHERE oi.order_id = NEW.id
            GROUP BY ri.ingredient_id
        ) subquery
        WHERE i.id = subquery.ingredient_id;

        -- Mark as deducted
        NEW.ingredients_deducted = true;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_deduct_inventory
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION deduct_inventory_on_prep();

-- 5. RLS Policies
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ingredients_select" ON ingredients FOR SELECT USING (true);
CREATE POLICY "ingredients_insert" ON ingredients FOR INSERT WITH CHECK (true);
CREATE POLICY "ingredients_update" ON ingredients FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "ingredients_delete" ON ingredients FOR DELETE USING (true);

CREATE POLICY "recipe_ingredients_select" ON recipe_ingredients FOR SELECT USING (true);
CREATE POLICY "recipe_ingredients_insert" ON recipe_ingredients FOR INSERT WITH CHECK (true);
CREATE POLICY "recipe_ingredients_update" ON recipe_ingredients FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "recipe_ingredients_delete" ON recipe_ingredients FOR DELETE USING (true);
