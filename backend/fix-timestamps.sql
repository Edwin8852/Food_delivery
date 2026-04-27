-- Fix NULL values in users table timestamps
-- Run this BEFORE adding NOT NULL constraints

-- Update NULL createdAt values
UPDATE users
SET "createdAt" = NOW()
WHERE "createdAt" IS NULL;

-- Update NULL updatedAt values
UPDATE users
SET "updatedAt" = NOW()
WHERE "updatedAt" IS NULL;

-- Verify all rows have timestamps
SELECT COUNT(*) as rows_with_null_createdAt FROM users WHERE "createdAt" IS NULL;
SELECT COUNT(*) as rows_with_null_updatedAt FROM users WHERE "updatedAt" IS NULL;

-- Fix other tables with NULL timestamps (optional)
UPDATE restaurants SET "createdAt" = NOW() WHERE "createdAt" IS NULL;
UPDATE foods SET "createdAt" = NOW() WHERE "createdAt" IS NULL;
UPDATE addresses SET "createdAt" = NOW() WHERE "createdAt" IS NULL;
UPDATE orders SET "createdAt" = NOW() WHERE "createdAt" IS NULL;
UPDATE reviews SET "createdAt" = NOW() WHERE "createdAt" IS NULL;

-- Add NOT NULL constraints to prevent future NULL values
ALTER TABLE users ALTER COLUMN "createdAt" SET NOT NULL;
ALTER TABLE users ALTER COLUMN "updatedAt" SET NOT NULL;
