import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base.page";
import { Logger } from "../utils/logger";

export class OrgDashboardPage extends BasePage {
  readonly navDashboard: Locator;
  readonly navModel: Locator;
  readonly navReports: Locator;
  readonly navUploads: Locator;
  readonly expandNavBtn: Locator;
  readonly orgActivityHeading: Locator;
  // Slide Overview Section
  readonly slideOverviewHeading: Locator;
  readonly totalScanningLabel: Locator;
  readonly totalScanningValue: Locator;
  readonly totalStainingLabel: Locator;
  readonly totalStainingValue: Locator;
  readonly totalDownloadsLabel: Locator;
  readonly totalDownloadsValue: Locator;

  // STAINING USAGE OVERVIEW SECTION
  readonly ihcRow: Locator;
  readonly specialRow: Locator;
  readonly heRow: Locator;
  readonly totalRow: Locator;

  constructor(page: Page) {
    super(page);

    this.navDashboard = page.getByRole("button", { name: "Dashboard" });
    this.navModel = page.getByRole("button", { name: "Model" });
    this.navReports = page.getByRole("button", { name: "Reports" });
    this.navUploads = page.getByRole("button", { name: "Uploads" });

    this.expandNavBtn = page.getByTestId("ChevronRightIcon");
    this.orgActivityHeading = page.getByRole("heading", {
      name: "Organization Activity",
    });

    // --- Slide Overview Section ---
    this.slideOverviewHeading = page.getByRole("heading", {
      name: "Slide Overview",
    });

    this.totalScanningLabel = page.getByText("Total WSI Slides Scanned");
    this.totalScanningValue = page
      .locator("[class*='MuiTypography-h6 text-gray']")
      .nth(0); // index 0

    this.totalStainingLabel = page.getByText("Total VSI Slides Stained");
    this.totalStainingValue = page
      .locator("[class*='MuiTypography-h6 text-gray']")
      .nth(1); // index 1

    this.totalDownloadsLabel = page.getByText("Total Downloads");
    this.totalDownloadsValue = page
      .locator("[class*='MuiTypography-h6 text-gray']")
      .nth(2); // index 2

    // Row titles
    this.ihcRow = page.getByText("IHC", { exact: true }).locator("xpath=../..");
    this.specialRow = page
      .getByText("Special", { exact: true })
      .locator("xpath=../..");
    this.heRow = page.getByText("H&E", { exact: true }).locator("xpath=../..");
    this.totalRow = page
      .getByText("Total", { exact: true })
      .locator("xpath=../..");
  }

  async isLoaded() {
    await this.orgActivityHeading.waitFor({ state: "visible" });
  }

  async expandNavigation() {
    await this.expandNavBtn.click();
  }

  // Helper to extract the columns inside a row
  getProcessing(row: Locator) {
    return row.locator("span.text-xs:text-right").first();
  }

  getCompleted(row: Locator) {
    return row.locator("span.text-xs:text-right").nth(1);
  }

  getFailed(row: Locator) {
    return row.locator("span.text-xs:text-right").nth(2);
  }

  // --- Staining Usage Overview Section --- //

  // Row selectors (generic method)
  getRow(label: string) {
    return this.page
      .getByText(label, { exact: true })
      .locator("xpath=ancestor::div[contains(@class,'flex')]");
  }

  // Wait for table to fully load (Total row is the most stable anchor)
  async waitForStainingUsageToLoad() {
    Logger.info("Waiting for Staining Usage Overview Table data to load");
    await this.page
      .getByText("Total", { exact: true })
      .waitFor({ timeout: 10000 });
  }

  // Returns the three numeric metric locators (Processing, Completed, Failed)
  // for any given row label in the Staining Usage table.
  async getMetrics(rowLabel: string) {
    const row = this.getRow(rowLabel);

    const processing = row.locator("span.font-semibold").nth(0);
    const completed = row.locator("span.font-semibold").nth(1);
    const failed = row.locator("span.font-semibold").nth(2);

    return {
      processing,
      completed,
      failed,
    };
  }
}
