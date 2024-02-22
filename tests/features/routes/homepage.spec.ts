import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Bidhub/);
});

test("displays recent listings with 10 items", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("Recent listings")).toBeVisible();

  const listingsList = page.locator("#listing-previews");

  const listItemCount = await listingsList.locator("li").count();

  expect(listItemCount).toBe(10);
});

test("displays popular categories with 4 category options", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.getByText("Popular categories")).toBeVisible();

  const categoryList = page.locator("#popular-category-list");

  const listItemCount = await categoryList.locator("li").count();

  expect(listItemCount).toBe(4);
});

test("Popular category list items contain a child <a> element", async ({
  page,
}) => {
  await page.goto("/");

  const listItems = page.locator("#popular-category-list li");
  for (let i = 0; i < (await listItems.count()); i++) {
    const currentItem = listItems.nth(i);

    await expect(currentItem.locator("a")).toBeVisible();
  }
});
