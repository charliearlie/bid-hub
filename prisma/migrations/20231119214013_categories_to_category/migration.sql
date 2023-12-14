/*
  Warnings:

  - You are about to drop the `CategoriesOnItems` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CategoriesOnListings` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categoryId` to the `Listing` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CategoriesOnItems" DROP CONSTRAINT "CategoriesOnItems_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "CategoriesOnItems" DROP CONSTRAINT "CategoriesOnItems_itemId_fkey";

-- DropForeignKey
ALTER TABLE "CategoriesOnListings" DROP CONSTRAINT "CategoriesOnListings_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "CategoriesOnListings" DROP CONSTRAINT "CategoriesOnListings_listingId_fkey";

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "categoryId" UUID NOT NULL,
ADD COLUMN     "rating" INTEGER;

-- DropTable
DROP TABLE "CategoriesOnItems";

-- DropTable
DROP TABLE "CategoriesOnListings";

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
