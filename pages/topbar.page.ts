import { Locator, Page } from "@playwright/test";

export class Topbar {
  readonly page: Page;

  // --- Locators ---
  readonly supportButton: Locator;
  readonly profileIcon: Locator;
  readonly hiringOrgButton: Locator;
  // Profile dropdown options
  readonly profileMenuMyOrg: Locator;
  readonly profileMenuLogout: Locator;
  

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

   // Profile dropdown options (appear after clicking profile icon)
this.profileMenuMyOrg = page.getByText("My Organization", { exact: true });
this.profileMenuLogout = page.getByText("Log out", { exact: true });
  }

  async isLoaded() {
    await this.supportButton.waitFor({ state: "visible" });
  }
}
