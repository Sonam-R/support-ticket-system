-- AlterEnum: migrate Role values from AGENT/CUSTOMER to SUPPORT_AGENT/VIEWER
ALTER TYPE "Role" RENAME TO "Role_old";

CREATE TYPE "Role" AS ENUM ('ADMIN', 'SUPPORT_AGENT', 'VIEWER');

ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;

ALTER TABLE "User"
  ALTER COLUMN "role" TYPE "Role"
  USING (
    CASE "role"::text
      WHEN 'AGENT' THEN 'SUPPORT_AGENT'::"Role"
      WHEN 'CUSTOMER' THEN 'VIEWER'::"Role"
      ELSE "role"::text::"Role"
    END
  );

ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'VIEWER';

DROP TYPE "Role_old";

-- AlterTable: add soft delete support
ALTER TABLE "User" ADD COLUMN "deletedAt" TIMESTAMP(3);
