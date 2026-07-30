-- ============================================================
-- Phase 21: Menu Enhancements (Allergens)
-- Migration: 007_phase21_allergens.sql
-- ============================================================

ALTER TABLE ingredients
ADD COLUMN allergens TEXT[] DEFAULT '{}'::TEXT[];
