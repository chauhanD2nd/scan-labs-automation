import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";

// Landing page shown before authentication (Okta entry point)
export class LandingPage extends BasePage {
  readonly oktaSignInBtn: Locator;
  readonly pictorLabsBanner: Locator;
  readonly virtualStainHubHeading: Locator;
  readonly byPictorLabsText: Locator;

  constructor(page: Page) {
    super(page);
    this.oktaSignInBtn = page.getByRole("button", { name: "Sign In" });
    this.pictorLabsBanner = page.locator('img[src*="pictorlabs_logo"]');
    this.virtualStainHubHeading = page.getByRole('heading', { name: 'Welcome to Virtual Stain Hub' });
    this.byPictorLabsText = page.getByText('by Pictor Labs', { exact: true });
  }

  // Navigate to base URL landing screen
  async open() {
    await this.goto("/"); // resolved via baseURL
  }


    // Validate landing page is loaded (page identity check)
  async isLoaded() {
    await this.virtualStainHubHeading.waitFor({ state: "visible" });
  }

  
  // Click the Okta Sign In button → transitions to actual login page
  async clickOktaSignIn() {
    await this.click(this.oktaSignInBtn);
  }
}
