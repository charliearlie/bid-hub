/*
  Warnings:

  - The values [NEW_SEALED,NEW_WITH_PACKAGING] on the enum `Condition` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Like` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserFeedback` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "GenderOptions" AS ENUM ('MENS', 'WOMENS', 'UNISEX', 'GIRLS', 'BOYS');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PostageType" AS ENUM ('STANDARD', 'COURIER', 'NEXT_DAY', 'SIGNED_FOR');

-- AlterEnum
BEGIN;
CREATE TYPE "Condition_new" AS ENUM ('NEW', 'NEW_WITHOUT_PACKAGING', 'DAMAGED', 'USED');
ALTER TABLE "Listing" ALTER COLUMN "condition" TYPE "Condition_new" USING ("condition"::text::"Condition_new");
ALTER TYPE "Condition" RENAME TO "Condition_old";
ALTER TYPE "Condition_new" RENAME TO "Condition";
DROP TYPE "Condition_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_listingId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_listingId_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserFeedback" DROP CONSTRAINT "UserFeedback_buyerId_fkey";

-- DropForeignKey
ALTER TABLE "UserFeedback" DROP CONSTRAINT "UserFeedback_sellerId_fkey";

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "numberSold" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "condition" SET DEFAULT 'NEW';

-- DropTable
DROP TABLE "Comment";

-- DropTable
DROP TABLE "Like";

-- DropTable
DROP TABLE "UserFeedback";

-- CreateTable
CREATE TABLE "Review" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "comment" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "listingId" UUID NOT NULL,
    "sellerId" UUID NOT NULL,
    "buyerId" UUID NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FulfilmentOption" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "method" "PostageType" NOT NULL DEFAULT 'STANDARD',
    "price" INTEGER NOT NULL DEFAULT 5,
    "minDays" INTEGER NOT NULL DEFAULT 3,
    "maxDays" INTEGER NOT NULL DEFAULT 5,
    "listingId" UUID NOT NULL,

    CONSTRAINT "FulfilmentOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClothingOptions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "sizes" TEXT[],
    "materials" TEXT[],
    "colours" TEXT[],
    "fit" TEXT,
    "listingId" UUID NOT NULL,
    "brand" TEXT,
    "style" TEXT,
    "gender" "GenderOptions",

    CONSTRAINT "ClothingOptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ElectricalOptions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "brand" TEXT,
    "modelNumber" TEXT,
    "powerSource" TEXT,
    "voltage" TEXT,
    "wattage" INTEGER,
    "connectivity" TEXT,
    "features" TEXT[],
    "dimensions" TEXT,
    "weight" INTEGER,
    "certifications" TEXT[],
    "usageInstructions" TEXT,
    "warrantyInformation" TEXT,
    "isSmart" BOOLEAN DEFAULT false,
    "energyEfficiency" TEXT,
    "compatibleDevices" TEXT[],
    "listingId" UUID NOT NULL,

    CONSTRAINT "ElectricalOptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookOptions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "author" TEXT,
    "genre" TEXT[],
    "language" TEXT,
    "pageCount" INTEGER,
    "publicationYear" INTEGER,
    "publisher" TEXT,
    "ISBN" TEXT,
    "listingId" UUID NOT NULL,

    CONSTRAINT "BookOptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "totalAmount" INTEGER NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "sellerId" UUID NOT NULL,
    "listingId" UUID NOT NULL,
    "buyerId" UUID NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FulfilmentDetails" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "method" "PostageType" NOT NULL DEFAULT 'STANDARD',
    "price" INTEGER NOT NULL DEFAULT 5,
    "orderId" UUID NOT NULL,
    "deliveryAddressId" UUID NOT NULL,

    CONSTRAINT "FulfilmentDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Watch" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "listingId" UUID NOT NULL,

    CONSTRAINT "Watch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Review_id_key" ON "Review"("id");

-- CreateIndex
CREATE UNIQUE INDEX "FulfilmentOption_id_key" ON "FulfilmentOption"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ClothingOptions_id_key" ON "ClothingOptions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ElectricalOptions_id_key" ON "ElectricalOptions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "BookOptions_id_key" ON "BookOptions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Order_id_key" ON "Order"("id");

-- CreateIndex
CREATE UNIQUE INDEX "FulfilmentDetails_id_key" ON "FulfilmentDetails"("id");

-- CreateIndex
CREATE UNIQUE INDEX "FulfilmentDetails_orderId_key" ON "FulfilmentDetails"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "FulfilmentDetails_deliveryAddressId_key" ON "FulfilmentDetails"("deliveryAddressId");

-- CreateIndex
CREATE UNIQUE INDEX "Watch_id_key" ON "Watch"("id");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FulfilmentOption" ADD CONSTRAINT "FulfilmentOption_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClothingOptions" ADD CONSTRAINT "ClothingOptions_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElectricalOptions" ADD CONSTRAINT "ElectricalOptions_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookOptions" ADD CONSTRAINT "BookOptions_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FulfilmentDetails" ADD CONSTRAINT "FulfilmentDetails_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FulfilmentDetails" ADD CONSTRAINT "FulfilmentDetails_deliveryAddressId_fkey" FOREIGN KEY ("deliveryAddressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Watch" ADD CONSTRAINT "Watch_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Watch" ADD CONSTRAINT "Watch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
