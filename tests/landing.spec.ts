import { test, expect } from "@playwright/test";
import { LandingPage } from "../pages/landing.page";

test.describe("Landing Page", () => {

  // Runs before EACH test in this file
  test.beforeEach(async ({ page }) => {
    const landing = new LandingPage(page);
    await landing.open();       // go to baseURL
    await landing.isLoaded();   // verify landing page is correct
  });

  test("verify landing page UI", async ({ page }) => {
    const landing = new LandingPage(page);

    await expect(landing.pictorLabsBanner).toBeVisible();
    await expect(landing.virtualStainHubHeading).toBeVisible();
    await expect(landing.byPictorLabsText).toBeVisible();
    await expect(landing.oktaSignInBtn).toBeVisible();
  });

});
