import { test as base } from "@playwright/test";
import { LandingPage } from "../pages/landing.page";
import { LoginPage } from "../pages/login.page";

// FIX: Add TypeScript typing for fixtures
type Fixtures = {
  landingPage: LandingPage;
  loginPage: LoginPage;
};

export const test = base.extend<Fixtures>({
  landingPage: async ({ page }, use) => {
    const landing = new LandingPage(page);
    await landing.open();
    await landing.isLoaded();
    await use(landing);
  },

  loginPage: async ({ page, landingPage }, use) => {
    const login = new LoginPage(page);
    await landingPage.clickOktaSignIn();
    await login.isLoaded();
    await use(login);
  }
});

export { expect } from "@playwright/test";
