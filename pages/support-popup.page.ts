import { Locator, Page } from "@playwright/test";
import { ISSUE_CATEGORIES } from "../testData/test-data";

export class SupportPopup {
  readonly page: Page;

  // --- Popup Header ---
  readonly orderIdLabel: Locator;

  // --- Email Field ---
  readonly emailLabel: Locator;
  readonly emailInput: Locator;

  // --- Title Field ---
  readonly titleLabel: Locator;
  readonly titleInput: Locator;

  // --- Issue Category Dropdown ---
  readonly issueCategoryInput: Locator;

  // --- Description Field ---
  readonly problemDescriptionLabel: Locator;

  // --- Submit Button ---
  readonly requestSupportBtn: Locator;

  // --- Error Locators ---
  readonly issueCategoryError: Locator;

  // --- Success Popup Locators ---
  readonly successIcon: Locator;
  readonly successMessage: Locator;
  readonly closeSuccessBtn: Locator;

  constructor(page: Page) {
    this.page = page;

    // # Order ID:
    this.orderIdLabel = page.locator(
      `div[style*="bold"]:has-text("# Order ID:")`
    );

    // Email label
    this.emailLabel = page.locator(
      `label[data-shrink="true"]:has-text("Email")`
    );

    // Email input (disabled)
    this.emailInput = page.locator(`input[disabled][name="email"]`);

    // Title label + input
    this.titleLabel = page.locator(
      `label[data-shrink="true"]:has-text("Title")`
    );
    this.titleInput = page.locator(`input[name="title"]`);

    // Issue Category input (dynamic ID but always input[type=text])
    this.issueCategoryInput = page.getByRole("combobox", {
      name: "Issue Category",
    });

    // Problem Description label
    this.problemDescriptionLabel = page
      .locator(`label:has-text("Problem Description")`)
      .first();

    // Request Support button
    this.requestSupportBtn = page.locator(`button:has-text("Request Support")`);
    this.issueCategoryError = page.locator(
      `span[class*="text-red"]:has-text("Please select a issue category")`
    );

    // Success popup locators
    this.successIcon = page.getByTestId("SuccessOutlinedIcon");
    this.successMessage = page.getByText("Your request has been", {
      exact: false,
    });
    this.closeSuccessBtn = page.getByRole("button", { name: "Close" });
  }

  // --- ERROR TEXT METHOD (corrected location!) ---
  getErrorText(errorText: string): Locator {
    return this.page.locator(`p[class*="Mui-error"]:has-text("${errorText}")`);
  }

  // --- Dynamic Issue Category Option ---
  getDropdownOption(optionName: string) {
    return this.page.getByRole("option", { name: optionName });
  }
  // Select random category from ISSUE_CATEGORIES
  async selectRandomCategory() {
    // Step 1: Click dropdown
    await this.issueCategoryInput.click();

    // Step 2: Pick random category
    const randomIndex = Math.floor(Math.random() * ISSUE_CATEGORIES.length);
    const randomCategory = ISSUE_CATEGORIES[randomIndex];

    // Step 3: Click that dropdown option
    await this.page.getByRole("option", { name: randomCategory }).click();

    return randomCategory; // return selected item if needed
  }
  // Popup must be visible to proceed
  async isVisible() {
    await this.orderIdLabel.waitFor({ timeout: 10_000 });
  }
}
