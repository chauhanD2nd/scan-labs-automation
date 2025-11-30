import { Locator, Page } from "@playwright/test";

export class Topbar {
  readonly page: Page;

  // --- Locators ---
  readonly supportButton: Locator;
  readonly profileIcon: Locator;
  readonly hiringOrgButton: Locator;
  

  constructor(page: Page) {
    this.page = page;

    // Support button (left top — support icon)
    this.supportButton = page.locator('img[class*="cursor-pointer"][alt="Support"]');

    // Profile icon (left top — alt = logged in email)
    this.profileIcon = page.locator('img[class*="cursor-pointer"][alt*="@"]');

    // Hiring Org button: flex container → child span with text
    this.hiringOrgButton = page.locator(
      "div[class^='flex'] span:has-text('PictorLabs Hiring Org')"
    );
  }

  async isLoaded() {
    await this.supportButton.waitFor({ state: "visible" });
  }
}
