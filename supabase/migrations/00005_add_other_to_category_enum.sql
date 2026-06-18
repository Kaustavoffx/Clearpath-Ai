-- Add OTHER to category_enum safely
ALTER TYPE category_enum ADD VALUE IF NOT EXISTS 'OTHER';
