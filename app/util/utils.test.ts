import { generateSlug } from "./utils";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "<uuid>"),
}));

describe("utils", () => {
  describe("generateSlug", () => {
    it("should generate a slug with a UUID appended", () => {
      const listingTitle = "Rare Green Ukulele";
      const slug = generateSlug(listingTitle);
      const expectedSlug = "rare-green-ukulele-<uuid>";

      expect(slug).toBe(expectedSlug);
    });

    it("should replace non-alphanumeric characters with hyphens", () => {
      const listingTitle = "Best Listing Ever?!";
      const slug = generateSlug(listingTitle);
      const expectedSlug = "best-listing-ever-<uuid>";

      expect(slug).toBe(expectedSlug);
    });

    it("should remove leading and trailing hyphens", () => {
      const listingTitle = "-Rare Kebab Recipe-";
      const slug = generateSlug(listingTitle);
      const expectedSlug = "rare-kebab-recipe-<uuid>";

      expect(slug).toBe(expectedSlug);
    });
  });
});
