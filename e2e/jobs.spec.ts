
import { test, expect } from "@playwright/test";

test("home page displays job listings", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Explore jobs" })
  ).toBeVisible();

  await expect(page.getByText("12 jobs found")).toBeVisible();

  await expect(
  page.getByRole("button", { name: /Show saved jobs/i })
).toBeVisible();
});

test("user can search for a job", async ({ page }) => {
  await page.goto("/");

  const search = page.getByRole("searchbox", {
    name: "Search jobs",
  });

  await expect(search).toBeEnabled();

  await search.fill("Frontend Developer");

  await expect(page.getByText("1 job found")).toBeVisible();

  await expect(
    page.getByRole("heading", { name: "Frontend Developer" })
  ).toBeVisible();
});

test("user can open job details", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: /View Details/i }).first().click();

  await expect(page.getByRole("button", { name: /Apply/i })).toBeVisible();
});
