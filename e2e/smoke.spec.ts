import { test, expect } from "@playwright/test";

test("hub loads and links to basketball", async ({ page }) => {
  await page.goto("/en");
  await expect(page.getByRole("heading", { name: /PERFECT/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /how to play/i })).toBeVisible();
});

test("basketball play mode select", async ({ page }) => {
  await page.goto("/en/basketball/play");
  await expect(page.getByText(/classic|hoopiq|daily/i).first()).toBeVisible();
});
