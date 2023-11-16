-- DropForeignKey
ALTER TABLE "CategoriesOnListings" DROP CONSTRAINT "CategoriesOnListings_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "CategoriesOnListings" DROP CONSTRAINT "CategoriesOnListings_listingId_fkey";

-- DropForeignKey
ALTER TABLE "UserPersonalDetails" DROP CONSTRAINT "UserPersonalDetails_userId_fkey";

-- AddForeignKey
ALTER TABLE "UserPersonalDetails" ADD CONSTRAINT "UserPersonalDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoriesOnListings" ADD CONSTRAINT "CategoriesOnListings_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoriesOnListings" ADD CONSTRAINT "CategoriesOnListings_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
