-- Add new values to category_enum safely
ALTER TYPE category_enum ADD VALUE IF NOT EXISTS 'GENERAL_NOTICE';
ALTER TYPE category_enum ADD VALUE IF NOT EXISTS 'GRANT';
ALTER TYPE category_enum ADD VALUE IF NOT EXISTS 'FELLOWSHIP';
