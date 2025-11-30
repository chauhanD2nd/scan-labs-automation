// We use a custom test fixture that EXTENDS Playwright's built-in `test`.
// It still behaves exactly like Playwright's test, but adds `loginPage`
// so each test starts already on the Login Page.
// `expect` continues to come from Playwright directly.
import { test } from "../fixtures/login.fixture";
import { expect } from "@playwright/test";
import { Logger } from "../utils/logger";
import { LandingPage } from "../pages/landing.page";
import { LoginPage } from "../pages/login.page";

test.describe("Navigation: Landing → Login", () => {
  // The fixture already navigates to login page and returns `loginPage`.
  // Each test receives a fresh, isolated instance → zero cross-test interference.

  test("should navigate to Okta login page from landing page", async ({
    loginPage,
  }) => {
    // Core UI checks (login page guaranteed to be loaded via fixture)
    await expect(loginPage.pictorLabsBanner).toBeVisible();
    await expect(loginPage.welcomeHeading).toBeVisible();
    await expect(loginPage.loginDescription).toBeVisible();
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.continueBtn).toBeVisible();
  });

  test("should show validation errors when clicking Continue with empty fields", async ({
    loginPage,
  }) => {
    // Click Continue with no input
    await loginPage.click(loginPage.continueBtn);

    // Expect both validation errors to appear
    await expect(loginPage.emailRequiredError).toBeVisible();
    await expect(loginPage.passwordRequiredError).toBeVisible();

    // Fields should be marked as invalid (aria-invalid=true)
    await expect(loginPage.emailInvalid).toBeVisible();
    await expect(loginPage.passwordInvalid).toBeVisible();
  });

  test("should show correct tooltip on hover before and after toggling password visibility", async ({
    loginPage,
  }) => {
    // Hover BEFORE toggle → should show "Show password"
    await loginPage.passwordToggleBtn.hover();
    await expect(loginPage.showPasswordTooltip).toBeVisible();

    // Toggle visibility
    await loginPage.passwordToggleBtn.click();

    // Hover AFTER toggle → should show "Hide password"
    await loginPage.passwordToggleBtn.hover();
    await expect(loginPage.hidePasswordTooltip).toBeVisible();
  });

  test("password field should switch between hidden and visible types", async ({
    loginPage,
  }) => {
    // Initial state → password masked
    await expect(loginPage.passwordInputHidden).toBeVisible();

    // Toggle → password visible
    await loginPage.passwordToggleBtn.click();
    await expect(loginPage.passwordInputVisible).toBeVisible();
    await expect(loginPage.passwordToggleBtn).toHaveAttribute(
      "aria-checked",
      "true"
    );

    // Toggle back → password masked again
    await loginPage.passwordToggleBtn.click();
    await expect(loginPage.passwordInputHidden).toBeVisible();
    await expect(loginPage.passwordToggleBtn).toHaveAttribute(
      "aria-checked",
      "false"
    );
  });

  test("Login: valid email but invalid password shows error", async ({
    page,
  }) => {
    const wrongPassword = "incorrectpass";

    const landingPage = new LandingPage(page);
      const loginPage = new LoginPage(page);
    
      await landingPage.open();
      await landingPage.isLoaded();
      await landingPage.clickOktaSignIn();
      await loginPage.isLoaded();
    
      await loginPage.login(process.env.USER_EMAIL!, wrongPassword);
  
    Logger.step("Validate wrong credentials error appears");
    await expect(page.getByText('Wrong email or password')).toBeVisible();
  });
});
