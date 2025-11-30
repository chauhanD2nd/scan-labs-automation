import { Page } from "@playwright/test";
import { LandingPage } from "../pages/landing.page";
import { LoginPage } from "../pages/login.page";
import { ENV } from "../config/env";

// Utility function to log into the dashboard
export async function loginToDashboard(page: Page) {
  const landingPage = new LandingPage(page);
  const loginPage = new LoginPage(page);
  
  await landingPage.open();
  await landingPage.isLoaded();
  await landingPage.clickOktaSignIn();
  await loginPage.isLoaded();

  await loginPage.login(ENV.username, ENV.password);
}
