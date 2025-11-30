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
    Logger.step("Validate Pictor Labs banner is visible");
    await expect(loginPage.pictorLabsBanner).toBeVisible();

    Logger.step("Validate welcome heading is visible");
    await expect(loginPage.welcomeHeading).toBeVisible();

    Logger.step("Validate login description text is visible");
    await expect(loginPage.loginDescription).toBeVisible();

    Logger.step("Validate email input is visible");
    await expect(loginPage.emailInput).toBeVisible();

    Logger.step("Validate password input is visible");
    await expect(loginPage.passwordInput).toBeVisible();

    Logger.step("Validate Continue button is visible");
    await expect(loginPage.continueBtn).toBeVisible();
  });

  // Ensures empty email/password show correct validation messages
  test("should show validation errors when clicking Continue with empty fields", async ({
    loginPage,
  }) => {
    // Click Continue with no input
    Logger
    await loginPage.click(loginPage.continueBtn);

    // Expect both validation errors to appear
    Logger.step("Validate email & password required errors are visible");
    await expect(loginPage.emailRequiredError).toBeVisible();
    await expect(loginPage.passwordRequiredError).toBeVisible();

    // Fields should be marked as invalid (aria-invalid=true)
    Logger.step("Validate email & password inputs are marked invalid");
    await expect(loginPage.emailInvalid).toBeVisible();
    await expect(loginPage.passwordInvalid).toBeVisible();
  });

  // Validate tooltip visibility before and after password visibility toggle
  test("should show correct tooltip on hover before and after toggling password visibility", async ({
    loginPage,
  }) => {
    // Hover BEFORE toggle → should show "Show password"
    Logger.step("Hover over password visibility toggle button");
    await loginPage.passwordToggleBtn.hover();
    Logger.step("Validate 'Show password' tooltip is visible");
    await expect(loginPage.showPasswordTooltip).toBeVisible();

    // Toggle visibility
    Logger.step("Click password visibility toggle button");
    await loginPage.passwordToggleBtn.click();

    // Hover AFTER toggle → should show "Hide password"
    Logger.step("Hover over password visibility toggle button again");
    await loginPage.passwordToggleBtn.hover();
    Logger.step("Validate 'Hide password' tooltip is visible");
    await expect(loginPage.hidePasswordTooltip).toBeVisible();
  });

  test("password field should switch between hidden and visible types", async ({
    loginPage,
  }) => {
    // Initial state → password masked
    Logger.step("Validate password input is initially masked");
    await expect(loginPage.passwordInputHidden).toBeVisible();

    // Toggle → password visible
    Logger.step("Click password visibility toggle button");
    await loginPage.passwordToggleBtn.click();
    Logger.step("Validate password input is now visible");
    await expect(loginPage.passwordInputVisible).toBeVisible();
    Logger.step("Validate toggle button aria-checked=true");
    await expect(loginPage.passwordToggleBtn).toHaveAttribute(
      "aria-checked",
      "true"
    );

    // Toggle back → password masked again
    Logger.step("Click password visibility toggle button again");
    await loginPage.passwordToggleBtn.click();
    Logger.step("Validate password input is now hidden again"); 
    await expect(loginPage.passwordInputHidden).toBeVisible();
    Logger.step("Validate toggle button aria-checked=false");
    await expect(loginPage.passwordToggleBtn).toHaveAttribute(
      "aria-checked",
      "false"
    );
  });

  // Validate error message on invalid login attempt
  test("Login: valid email but invalid password shows error", async ({
    page,
  }) => {
    const wrongPassword = "incorrectpass";
    const landingPage = new LandingPage(page);
    const loginPage = new LoginPage(page);

    Logger.step("Opening Landing Page");
    await landingPage.open();

    Logger.step("Validating Landing Page is loaded");
    await landingPage.isLoaded();

    Logger.step("Clicking Okta Sign In");
    await landingPage.clickOktaSignIn();

    Logger.step("Validating Okta Login Page is loaded");
    await loginPage.isLoaded();

    await loginPage.login(process.env.USER_EMAIL!, wrongPassword);

    Logger.step("Validate wrong credentials error appears");
    await expect(page.getByText("Wrong email or password")).toBeVisible();
  });
});
