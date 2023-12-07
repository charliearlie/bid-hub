/*
  Warnings:

  - A unique constraint covering the columns `[listingId]` on the table `BookOptions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Brand` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[listingId]` on the table `ClothingOptions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[listingId]` on the table `ElectricalOptions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Brand` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Brand" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "insuranceAvailable" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "GameOptions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "developer" TEXT,
    "genre" TEXT[],
    "language" TEXT,
    "platform" TEXT[],
    "publisher" TEXT,
    "releaseDate" TIMESTAMP(3),
    "listingId" UUID NOT NULL,

    CONSTRAINT "GameOptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Warranty" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "duration" INTEGER NOT NULL,
    "extendable" BOOLEAN NOT NULL DEFAULT false,
    "manufacturerWarranty" BOOLEAN NOT NULL DEFAULT false,
    "bidHubExtendedWarranty" BOOLEAN NOT NULL DEFAULT false,
    "maxExtension" INTEGER NOT NULL DEFAULT 0,
    "listingId" UUID NOT NULL,

    CONSTRAINT "Warranty_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GameOptions_id_key" ON "GameOptions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "GameOptions_listingId_key" ON "GameOptions"("listingId");

-- CreateIndex
CREATE UNIQUE INDEX "Warranty_id_key" ON "Warranty"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Warranty_listingId_key" ON "Warranty"("listingId");

-- CreateIndex
CREATE UNIQUE INDEX "BookOptions_listingId_key" ON "BookOptions"("listingId");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_slug_key" ON "Brand"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ClothingOptions_listingId_key" ON "ClothingOptions"("listingId");

-- CreateIndex
CREATE UNIQUE INDEX "ElectricalOptions_listingId_key" ON "ElectricalOptions"("listingId");

-- AddForeignKey
ALTER TABLE "GameOptions" ADD CONSTRAINT "GameOptions_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Warranty" ADD CONSTRAINT "Warranty_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
