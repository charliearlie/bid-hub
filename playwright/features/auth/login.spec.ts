import { test, expect } from "@playwright/test";
import { userData } from "prisma/fixtures";

test("can log in successfully", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "Log in" }).click();
  await page.getByRole("main").getByRole("link", { name: "Log in" }).click();
  await page.locator("#login-identifier-form-emailOrUsername").click();

  await page
    .locator("#login-identifier-form-emailOrUsername")
    .fill(userData.email);
  await page.getByRole("button", { name: "Next" }).click();

  expect(page.getByText("Welcome back " + userData.username)).toBeVisible();

  await page.locator("#login-challenge-form-password").click();

  await page.locator("#login-challenge-form-password").fill(userData.password);

  await page.getByRole("button", { name: "Log in" }).click();

  await page.waitForURL("/");

  expect(await page.getByRole("button", { name: "User avatar" })).toBeVisible();
});

test("shows an error if no username or email is input", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "Log in" }).click();
  await page.getByRole("main").getByRole("link", { name: "Log in" }).click();

  await page.locator("#login-identifier-form-emailOrUsername").click();
  await page.getByRole("button", { name: "Next" }).click();

  expect(page.getByText("Email or username is required")).toBeVisible();
});

test("handles incorrect password", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "Log in" }).click();
  await page.getByRole("main").getByRole("link", { name: "Log in" }).click();

  await page.locator("#login-identifier-form-emailOrUsername").click();
  await page
    .locator("#login-identifier-form-emailOrUsername")
    .fill(userData.email);

  await page.getByRole("button", { name: "Next" }).click();

  await page.locator("#login-challenge-form-password").click();

  await page
    .locator("#login-challenge-form-password")
    .fill("incorrectpassword");

  expect(page.getByText("Incorrect password")).toBeVisible();
});
