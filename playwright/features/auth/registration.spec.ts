import { faker } from "@faker-js/faker";
import { test, expect } from "@playwright/test";

test("can successfully register", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "Log in" }).click();
  await page.getByLabel("Username").click();
  await page.getByLabel("Username").fill(faker.internet.userName());
  await page.getByLabel("Username").press("Tab");
  await page.getByLabel("Email").fill(faker.internet.email());
  await page.getByLabel("Password").click();
  await page.getByLabel("Password").fill("password");

  await page.getByRole("button", { name: "Sign up" }).click();
  await page.getByRole("button", { name: "User avatar" }).click();
  await page.getByRole("menuitem", { name: "Manage" }).click();

  await expect(page.locator("#manage-user-form-email")).toBeEditable();
});

/**
 * If you are using the seed script to populate the database, these fields should be taken
 */
test("cannot register if the username or email are taken", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "Log in" }).click();

  await page.getByLabel("Username").click();
  await page.getByLabel("Username").fill("TestUser");
  await page.getByLabel("Username").press("Tab");
  await page.getByLabel("Email").fill("playwright@test.com");
  await page.getByLabel("Email").press("Tab");
  await page.getByLabel("Password").fill("password");

  await page.getByRole("button", { name: "Sign up" }).click();

  await expect(
    page.getByText("A user already exists with this email")
  ).toBeVisible();
  await expect(
    page.getByText("A user already exists with this username")
  ).toBeVisible();
});

test("can recover from an error state", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "Log in" }).click();

  await page.getByLabel("Username").click();
  await page.getByLabel("Username").fill("TestUser");
  await page.getByLabel("Username").press("Tab");
  await page.getByLabel("Email").fill("playwright@test.com");
  await page.getByLabel("Email").press("Tab");
  await page.getByLabel("Password").fill("password");

  await page.getByRole("button", { name: "Sign up" }).click();

  await expect(
    page.getByText("A user already exists with this email")
  ).toBeVisible();
  await expect(
    page.getByText("A user already exists with this username")
  ).toBeVisible();

  await page.getByLabel("Username").click();
  await page.getByLabel("Username").fill(faker.internet.userName());

  await page.getByLabel("Username").press("Tab");
  await page.getByLabel("Email").fill(faker.internet.email());

  await page.getByRole("button", { name: "Sign up" }).click();

  await page.getByRole("button", { name: "User avatar" }).click();
  await page.getByRole("menuitem", { name: "Manage" }).click();

  await expect(page.locator("#manage-user-form-email")).toBeEditable();
});
