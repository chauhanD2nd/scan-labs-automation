import { Locator, Page } from "@playwright/test";

export class TopBar {
  readonly page: Page;

  // --- Locators ---
  readonly supportButton: Locator;
  readonly profileIcon: Locator;
  readonly hiringOrgButton: Locator;
  // Profile dropdown options
  readonly profileMenuMyOrg: Locator;
  readonly profileMenuLogout: Locator;

  //hiring org option
  readonly hiringOrgDropdownItem: Locator;

  constructor(page: Page) {
    this.page = page;

    // Support button (left top — support icon)
    this.supportButton = page.locator(
      'img[class*="cursor-pointer"][alt="Support"]'
    );

    // Profile icon (left top — alt = logged in email)
    this.profileIcon = page.locator('img[class*="cursor-pointer"][alt*="@"]');

    // Hiring Org button: flex container → child span with text
    this.hiringOrgButton = page.locator(
      "div[class^='flex'] span:has-text('PictorLabs Hiring Org')"
    );

    // Profile dropdown options (appear after clicking profile icon)
    this.profileMenuMyOrg = page.getByText("My Organization", { exact: true });
    this.profileMenuLogout = page.getByText("Log out", { exact: true });

    // Topbar elements hiring org button (right top)
    this.hiringOrgButton = page.getByText("PictorLabs Hiring Org").first();
    // Dropdown item hiring org
    this.hiringOrgDropdownItem = page.getByText("PictorLabs Hiring Org").nth(1);
  }

  async isLoaded() {
    await this.supportButton.waitFor({ state: "visible" });
  }
}
