import { Locator, Page } from "@playwright/test";

export class ModelsPage {
  readonly page: Page;

  // Headings
  orgModelsHeading: Locator;
  orgModelsSubHeading: Locator;

  // Tabs
  stainManagementTab: Locator;

  // Summary section
  totalStainersLabel: Locator;
  totalStainersValue: Locator;

  // Sections (Auto Deep Stainer, Auto Restainer)
  autoDeepStainerHeading: Locator;
  autoRestainerHeading: Locator;

  // First card under Auto Deep Stainer (H&E v0.1.0)
  heCard_v010: Locator;

  // First card under Auto Restainer (PanCK-MG-TRT)
  panCKCard: Locator;

  constructor(page: Page) {
    this.page = page;

    // --- Page Title ---
    this.orgModelsHeading = page.getByRole("heading", {
      name: "Organization Models",
      exact: true,
    });

    this.orgModelsSubHeading = page.getByText("Organization Stain Management", {
      exact: true,
    });

    // --- Tabs ---
    this.stainManagementTab = page.getByRole("tab", {
      name: "Stain Management",
      exact: true,
    });

    // --- Summary Cards ---
    this.totalStainersLabel = page.getByText("Total Stainers Available", {
      exact: true,
    });

    this.totalStainersValue = this.totalStainersLabel
      .locator("xpath=following-sibling::div[1]");

    // --- Section headings ---
    this.autoDeepStainerHeading = page.getByRole("heading", {
      name: "Auto Deep Stainer",
      exact: true,
    });

    this.autoRestainerHeading = page.getByRole("heading", {
      name: "Auto Restainer",
      exact: true,
    });

    // --- A Few Important Cards ---
    this.heCard_v010 = page.getByText("Version: v0.1.0").locator("xpath=ancestor::div[contains(@class,'border')][1]");

    this.panCKCard = page
      .getByText("PanCK-MG-TRT", { exact: false })
      .locator("xpath=ancestor::div[contains(@class,'border')][1]");
  }

  async isLoaded() {
    await this.orgModelsHeading.waitFor({ timeout: 10_000 });
  }
}
