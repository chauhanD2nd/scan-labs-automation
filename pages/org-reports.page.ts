import { Page, Locator } from "@playwright/test";

export class OrganizationReportsPage {
  readonly page: Page;

  // --- Main Headings ---
  orgReportsHeading: Locator;
  orgReportsSubHeading: Locator;

  // --- Tabs ---
  stainsTab: Locator;
  usersTab: Locator;

  // --- Stains Tab Content ---
  stainsInfoText: Locator;

  // Download Usage Report Button
  downloadWrapper: Locator;
  downloadBtn: Locator;

  // Stain Type Details Section Header
  stainTypeDetailsHeader: Locator;

  // Expandable Panels
  panelIHC: Locator;
  panelHE: Locator;
  panelSpecial: Locator;

  // --- Locators inside expanded IHC panel ---
  ihcQuarterLabel: Locator;
  ihcQuarterValue: (expectedQuarter: string) => Locator;
  ihcDownloadBtn: Locator;
  monthlyDistributionHeading: Locator;
  monthlyBreakdownHeading: Locator;

  // --- USERS Tab Content ---
  usersSearchField: Locator;
  userEmailList: Locator;
  loggedInUserCard: (email: string) => Locator;
  viewUserButton: (email: string) => Locator;
  userEmailText: (email: string) => Locator;
  noDataMessage: Locator;

  readonly yearLabel: Locator;

  constructor(page: Page) {
    this.page = page;

    // Headings
    this.orgReportsHeading = page.getByRole("heading", {
      name: "Organization Reports",
      exact: true,
    });
    this.orgReportsSubHeading = page.getByText(
      "Entire organization's Detailed Documents",
      { exact: true }
    );

    // Tabs
    this.stainsTab = page.getByRole("tab", { name: "STAINS" });
    this.usersTab = page.getByRole("tab", { name: "USERS" });

    // Info text under STAIN tab
    this.stainsInfoText = page.getByText(
      "Number of stains Organization completed over the past 365 days",
      { exact: true }
    );

    // Year dropdown label + value
    this.yearLabel = page.getByLabel("Year");
    // Download Usage Report
    this.downloadWrapper = page.locator(
      "div[data-testid='permission-wrapper'] >> text=Download Usage Report"
    );
    this.downloadBtn = this.downloadWrapper.getByText("Download Usage Report", {
      exact: true,
    });

    // "Stain Type Details"
    this.stainTypeDetailsHeader = page.getByRole("heading", {
      name: "Stain Type Details",
      exact: true,
    });

    // Expandable Panels
    this.panelIHC = page.locator("h6", { hasText: "Immunohistochemistry" });
    this.panelHE = page.locator("h6", { hasText: "Hematoxylin and Eosin" });
    this.panelSpecial = page.locator("h6", { hasText: "Special Stain" });

    // --- Quarter dropdown inside expanded IHC panel ---
    this.ihcQuarterLabel = this.page
      .locator('label[class^="MuiFormLabel-root MuiInputLabel"]', {
        hasText: "Quarter",
      })
      .nth(0);

    // Using same stable pattern as Year dropdown trick:
    this.ihcQuarterValue = (expectedQuarter: string) =>
      page.locator(
        `input[role="combobox"][class*="MuiInputBase-input"][value="${expectedQuarter}"]`
      );

    // Download button inside IHC panel
    this.ihcDownloadBtn = page.getByText("Download IHC Usage Report", {
      exact: true,
    });

    // Panel inner headings
    this.monthlyDistributionHeading = page
      .getByText("Monthly Distribution", {
        exact: true,
      })
      .nth(0);
    this.monthlyBreakdownHeading = page
      .getByText("Monthly Breakdown", {
        exact: true,
      })
      .nth(0);

    // USERS tab search input
    this.usersSearchField = page.locator(
      'input[placeholder="Search by name or email"]'
    );

    // User list (any user email has '@' in text)
    this.userEmailList = page
      .locator(
        '[class*="MuiTypography-root MuiTypography-body1"][class*="font-medium"]'
      )
      .filter({ hasText: "@" });
    this.loggedInUserCard = (email: string) =>
      page
        .locator('[class*="MuiTypography-body1"]', { hasText: email })
        .first();
    this.viewUserButton = (email: string) =>
      this.loggedInUserCard(email).locator(
        "xpath=ancestor::div[contains(@class,'MuiBox-root')][1]//button[text()='View User']"
      );

    // Dynamic locator → finds a user row by email substring
    this.userEmailText = (email: string) =>
      this.page.locator(
        '[class*="MuiTypography-root"][class*="MuiTypography-body1"]',
        { hasText: email }
      );
    this.noDataMessage = this.page.getByText("No data available", {
      exact: true,
    });
  }

  async isLoaded() {
    await this.orgReportsHeading.waitFor({ state: "visible" });
  }

  // Dynamic Year value locator (function style)
  yearValueDisplay(expectedYear: string) {
    return this.page.locator(
      `input[role="combobox"][class*="MuiInputBase-input"][value="${expectedYear}"]`
    );
  }
}
