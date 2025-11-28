import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";

// Okta Login Page (Email / Password authentication)
export class LoginPage extends BasePage {
  readonly pictorLabsBanner: Locator;
  readonly welcomeHeading: Locator;
  readonly loginDescription: Locator;

  readonly emailLabel: Locator;
  readonly emailInput: Locator;

  readonly passwordLabel: Locator;
  readonly passwordInput: Locator;

  readonly passwordToggleBtn: Locator;
  readonly forgotPasswordLink: Locator;

  readonly continueBtn: Locator;

  readonly emailRequiredError: Locator;
  readonly passwordRequiredError: Locator;

  readonly emailInvalid: Locator;
  readonly passwordInvalid: Locator;

  readonly showPasswordTooltip: Locator;
  readonly hidePasswordTooltip: Locator;

  readonly passwordInputHidden: Locator;
  readonly passwordInputVisible: Locator;

  constructor(page: Page) {
    super(page);

    // Static UI elements
    this.pictorLabsBanner = page.locator("img#prompt-logo-center");
    this.welcomeHeading = page.getByRole("heading", { name: "Welcome" });
    this.loginDescription = page.getByText(/Log in to .* to continue/i);

    // Email field
    this.emailLabel = page.locator("#username-label");
    this.emailInput = page.locator("input#username");

    // Password field
    this.passwordLabel = page.locator("#password-label");
    this.passwordInput = page.locator("input#password");

    //Hidedn and vivible password inputs    
    this.passwordInputHidden = page.locator('input#password[type="password"]');
    this.passwordInputVisible = page.locator('input#password[type="text"]');

    // Forgot password link
    this.forgotPasswordLink = page.getByRole("link", {
      name: "Forgot password?",
    });

    // Login button
    this.continueBtn = page.locator(
      'button[type="submit"][name="action"][value="default"]'
    );

    // Validation error messages (only visible when fields are empty)
    this.emailRequiredError = page.locator("#error-cs-username-required");
    this.passwordRequiredError = page.locator("#error-cs-password-required");

    this.emailInvalid = page.locator('input#username[aria-invalid="true"]');
    this.passwordInvalid = page.locator('input#password[aria-invalid="true"]');

    // Tooltip elements
    this.showPasswordTooltip = page.getByText("Show password", { exact: true });
    this.hidePasswordTooltip = page.getByText("Hide password", { exact: true });

    // Password toggle button
    this.passwordToggleBtn = page.locator('button[role="switch"][aria-label="Show password"]');
  }

  // Page identity check → ensures correct page is loaded
  async isLoaded() {
    await this.welcomeHeading.waitFor({ state: "visible" });
  }

  // Perform login with given creds
  async login(email: string, password: string) {
    await this.type(this.emailInput, email);
    await this.type(this.passwordInput, password);
    await this.click(this.continueBtn);
  }

  // Toggle show/hide password
  async togglePasswordVisibility() {
    await this.passwordToggleBtn.click();
  }
}
