-- Phase 22: Post-Dining Feedback System
-- Create the feedback table to store ratings and reviews

CREATE TABLE feedback (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id   UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  food_rating     INT NOT NULL CHECK (food_rating >= 1 AND food_rating <= 5),
  service_rating  INT NOT NULL CHECK (service_rating >= 1 AND service_rating <= 5),
  ambiance_rating INT NOT NULL CHECK (ambiance_rating >= 1 AND ambiance_rating <= 5),
  review_text     TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Ensure only one feedback per order
  CONSTRAINT unique_order_feedback UNIQUE (order_id)
);

CREATE INDEX idx_feedback_restaurant ON feedback(restaurant_id);
CREATE INDEX idx_feedback_order ON feedback(order_id);
CREATE INDEX idx_feedback_created_at ON feedback(created_at DESC);

-- RLS Policies
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Permissive policies for now (similar to other tables in this project)
-- Customers can insert their own feedback (public)
CREATE POLICY "feedback_insert" ON feedback FOR INSERT WITH CHECK (true);
-- Staff can select feedback
CREATE POLICY "feedback_select" ON feedback FOR SELECT USING (true);
CREATE POLICY "feedback_update" ON feedback FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "feedback_delete" ON feedback FOR DELETE USING (true);
