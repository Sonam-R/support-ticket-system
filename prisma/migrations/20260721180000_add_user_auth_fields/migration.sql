-- AlterTable
ALTER TABLE "User" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "User" ADD COLUMN "password" TEXT;

-- Backfill existing users with bcrypt hash of "Password123"
UPDATE "User"
SET "password" = '$2b$10$c8KGBkLYnW.K4gb8Mp42cuDqiDwp1NoePhx0sjYa6FfLEwm76l8cm'
WHERE "password" IS NULL;

ALTER TABLE "User" ALTER COLUMN "password" SET NOT NULL;
