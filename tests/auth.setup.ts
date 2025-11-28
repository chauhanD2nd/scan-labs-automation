import { chromium } from "@playwright/test";
import { ENV } from "../config/env";
import { LandingPage } from "../pages/landing.page";
import { LoginPage } from "../pages/login.page";

async function globalSetup() {
  console.log("PLAYWRIGHT BASE_URL:", ENV.url);

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // IMPORTANT: globalSetup DOES NOT use baseURL — so we must pass full URL
  await page.goto(ENV.url);

  const landing = new LandingPage(page);
  const login = new LoginPage(page);

  await landing.isLoaded();
  await landing.clickOktaSignIn();
  await login.isLoaded();

  await login.login(ENV.username, ENV.password);

  // Save session
  await context.storageState({ path: "auth.json" });

  await browser.close();
}

export default globalSetup;
