/*
  Warnings:

  - You are about to drop the `BookOptions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ClothingOptions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ElectricalOptions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GameOptions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BookOptions" DROP CONSTRAINT "BookOptions_listingId_fkey";

-- DropForeignKey
ALTER TABLE "ClothingOptions" DROP CONSTRAINT "ClothingOptions_listingId_fkey";

-- DropForeignKey
ALTER TABLE "ElectricalOptions" DROP CONSTRAINT "ElectricalOptions_listingId_fkey";

-- DropForeignKey
ALTER TABLE "GameOptions" DROP CONSTRAINT "GameOptions_listingId_fkey";

-- DropTable
DROP TABLE "BookOptions";

-- DropTable
DROP TABLE "ClothingOptions";

-- DropTable
DROP TABLE "ElectricalOptions";

-- DropTable
DROP TABLE "GameOptions";

-- CreateTable
CREATE TABLE "ProductDetails" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "sizes" TEXT[],
    "materials" TEXT[],
    "colours" TEXT[],
    "fit" TEXT,
    "listingId" UUID NOT NULL,
    "brand" TEXT,
    "style" TEXT,
    "gender" "GenderOptions",
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
    "author" TEXT,
    "genre" TEXT[],
    "language" TEXT,
    "pageCount" INTEGER,
    "publicationYear" INTEGER,
    "publisher" TEXT,
    "ISBN" TEXT,
    "developer" TEXT,
    "platform" TEXT[],
    "releaseDate" TIMESTAMP(3),

    CONSTRAINT "ProductDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductDetails_id_key" ON "ProductDetails"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ProductDetails_listingId_key" ON "ProductDetails"("listingId");

-- AddForeignKey
ALTER TABLE "ProductDetails" ADD CONSTRAINT "ProductDetails_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
