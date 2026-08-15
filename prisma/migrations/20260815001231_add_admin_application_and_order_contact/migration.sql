/*
  Warnings:

  - Added the required column `customerEmail` to the `Order` table.
  - Added the required column `phoneNumber` to the `Order` table.
  - Added the required column `shippingAddress` to the `Order` table.
*/

-- CreateEnum
CREATE TYPE "AdminApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Order"
ADD COLUMN "backupPhone" TEXT,
ADD COLUMN "customerEmail" TEXT,
ADD COLUMN "phoneNumber" TEXT,
ADD COLUMN "shippingAddress" TEXT;

-- Fill existing orders with the customer's current email.
UPDATE "Order" o
SET "customerEmail" = u.email
FROM "User" u
WHERE o."userId" = u.id;

-- Temporary values for existing orders.
UPDATE "Order"
SET
  "phoneNumber" = 'NOT_PROVIDED',
  "shippingAddress" = 'NOT_PROVIDED'
WHERE "phoneNumber" IS NULL
   OR "shippingAddress" IS NULL;

-- Make the fields required for all future orders.
ALTER TABLE "Order"
ALTER COLUMN "customerEmail" SET NOT NULL,
ALTER COLUMN "phoneNumber" SET NOT NULL,
ALTER COLUMN "shippingAddress" SET NOT NULL;

-- CreateTable
CREATE TABLE "AdminApplication" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "status" "AdminApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedBy" INTEGER,
    "reviewedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminApplication_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AdminApplication"
ADD CONSTRAINT "AdminApplication_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminApplication"
ADD CONSTRAINT "AdminApplication_reviewedBy_fkey"
FOREIGN KEY ("reviewedBy") REFERENCES "User"("id")
ON DELETE SET NULL ON UPDATE CASCADE;