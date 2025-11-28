import { Page, Locator } from '@playwright/test';

// Base class for all page objects (shared utilities)
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page; // expose Playwright page to child pages
  }

  // Standardized click with room for future logging/retries
  async click(locator: Locator) {
    await locator.click();
  }

  // Standardized typing method
  async type(locator: Locator, value: string) {
    await locator.fill(value);
  }

  // Navigate using relative path; baseURL is applied automatically
  async goto(path: string = '/') {
    await this.page.goto(path);
  }
}
