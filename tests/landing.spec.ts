import { test, expect } from "@playwright/test";
import { LandingPage } from "../pages/landing.page";
import { Logger } from "../utils/logger";

test.describe("Landing Page", () => {

  // Runs before EACH test in this file
  test.beforeEach(async ({ page }) => {
    const landing = new LandingPage(page);
    await landing.open();       // go to baseURL
    await landing.isLoaded();   // verify landing page is correct
  });

  test("verify landing page UI -- @Smoke", async ({ page }) => {
    const landing = new LandingPage(page);

    Logger.step("Validate Pictor Labs banner is visible");
    await expect(landing.pictorLabsBanner).toBeVisible();
    Logger.step("Validate Virtual Stain Hub heading is visible");
    await expect(landing.virtualStainHubHeading).toBeVisible();
    Logger.step("Validate by Pictor Labs text is visible");
    await expect(landing.byPictorLabsText).toBeVisible();
    Logger.step("Validate Okta Sign In button is visible");
    await expect(landing.oktaSignInBtn).toBeVisible();
  });

});
