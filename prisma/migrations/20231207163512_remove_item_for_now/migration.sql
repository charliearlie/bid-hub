/*
  Warnings:

  - You are about to drop the column `itemId` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the `Item` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Listing" DROP CONSTRAINT "Listing_itemId_fkey";

-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "itemId";

-- AlterTable
ALTER TABLE "ProductDetails" ALTER COLUMN "isSmart" DROP DEFAULT;

-- DropTable
DROP TABLE "Item";
