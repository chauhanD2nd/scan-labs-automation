import { test, expect } from "@playwright/test";
import { OrgDashboardPage } from "../pages/org-dashboard.page";
import { loginToDashboard } from "../helpers/login.helper";
import { testData } from "../testData/test-data";
import { Logger } from "../utils/logger";
import { getCurrentQuarterText } from "../utils/helpers";

test.describe("Dashboard Tests", () => {
  test.beforeEach(async ({ page }) => {
    await loginToDashboard(page);
  });

  test("Dashboard loads correctly", async ({ page }) => {
    const dashboardPage = new OrgDashboardPage(page);
    await dashboardPage.isLoaded();
    await expect(dashboardPage.orgActivityHeading).toBeVisible();
  });

  test("Left nav expands", async ({ page }) => {
    const dashboardPage = new OrgDashboardPage(page);

    await dashboardPage.expandNavigation();

    await expect(dashboardPage.navDashboard).toBeVisible();
    await expect(dashboardPage.navModel).toBeVisible();
    await expect(dashboardPage.navReports).toBeVisible();
    await expect(dashboardPage.navUploads).toBeVisible();
  });

  test("Navigation works", async ({ page }) => {
    const dashboardPage = new OrgDashboardPage(page);
    Logger.step("Clicking on Expand Navigation");
    await dashboardPage.expandNavigation();
    Logger.step("Clicking Left Nav Dashboard");
    await dashboardPage.navDashboard.click();
    Logger.step("Asserting Dashboard loaded");
    await expect(dashboardPage.orgActivityHeading).toBeVisible();
    Logger.step("Clicking Left Nav Model");
    await dashboardPage.navModel.click();
    // assert model page later
  });

  test("Slide Overview section shows correct default counts", async ({
    page,
  }) => {
    const dashboardPage = new OrgDashboardPage(page);
    Logger.step("Asserting Dashboard loaded");
    await dashboardPage.isLoaded();

    // Section heading
    Logger.step("Asserting Slide Overview heading is visible");
    await expect(dashboardPage.slideOverviewHeading).toBeVisible();

    // Labels are visible
    Logger.step("Asserting Slide Overview labels are visible");
    await expect(dashboardPage.totalScanningLabel).toBeVisible();
    await expect(dashboardPage.totalStainingLabel).toBeVisible();
    await expect(dashboardPage.totalDownloadsLabel).toBeVisible();

    // === Values from test data ===
    Logger.step("Asserting Slide Overview values match test data");
    await expect(dashboardPage.totalScanningValue).toHaveText(
      String(testData.scanning)
    );
    await expect(dashboardPage.totalStainingValue).toHaveText(
      String(testData.staining)
    );
    await expect(dashboardPage.totalDownloadsValue).toHaveText(
      String(testData.downloads)
    );

    // Intentional fail demo
    Logger.step("Intentional fail demo");
    test.fail();
    expect(10).toBe(20); // expected failure
  });

  test("Slide Overview intentional fail demo", async ({ page }) => {
    Logger;
    test.fail();
    expect(5).toBe(6); // fails but marked xfail
  });

  test("Staining Usage: validate IHC, Special, H&E, Total rows", async ({
    page,
  }) => {
    const dashboardPage = new OrgDashboardPage(page);

    await dashboardPage.isLoaded();

    // Wait for the section to be fully ready
    await dashboardPage.waitForStainingUsageToLoad();
    //await expect(true).toBe(false);

    // IHC Row
    Logger.step("Asserting IHC row metrics");
    const ihc = await dashboardPage.getMetrics("IHC");
    await expect(ihc.processing).toHaveText(testData.ihc.processing.toString());
    await expect(ihc.completed).toHaveText(testData.ihc.completed.toString());
    await expect(ihc.failed).toHaveText(testData.ihc.failed.toString());

    // Special Row
    Logger.step("Asserting Special row metrics");
    const special = await dashboardPage.getMetrics("Special");
    await expect(special.processing).toHaveText(
      testData.special.processing.toString()
    );
    await expect(special.completed).toHaveText(
      testData.special.completed.toString()
    );
    await expect(special.failed).toHaveText(testData.special.failed.toString());

    // H&E Row
    Logger.step("Asserting H&E row metrics");
    const he = await dashboardPage.getMetrics("H&E");
    await expect(he.processing).toHaveText(testData.he.processing.toString());
    await expect(he.completed).toHaveText(testData.he.completed.toString());
    await expect(he.failed).toHaveText(testData.he.failed.toString());

    // Total Row
    Logger.step("Asserting Total row metrics calculations");
    const total = await dashboardPage.getMetrics("Total");
    await expect(total.processing).toHaveText(
      testData.total.processing.toString()
    );
    await expect(total.completed).toHaveText(
      testData.total.completed.toString()
    );
    await expect(total.failed).toHaveText(testData.total.failed.toString());
  });

  test("Quarter dropdown shows correct default quarter", async ({ page }) => {
    const dashboardPage = new OrgDashboardPage(page);

    Logger.step("Loading dashboard page");
    await dashboardPage.isLoaded();

    Logger.step("Calculating expected system quarter text");
    const expectedQuarter = getCurrentQuarterText();
    Logger.info(`Expected Quarter: ${expectedQuarter}`);

    Logger.step("Asserting default quarter displayed on UI");
    await expect(dashboardPage.currentQuarterDisplay).toHaveValue(
      expectedQuarter
    );

    Logger.step("Clicking quarter dropdown to expand");
    await dashboardPage.quarterDropdownButton.click();

    Logger.step("Validating dropdown opened (aria-label switched to 'Close')");
    await expect(dashboardPage.quarterDropdownButton).toHaveAttribute(
      "aria-label",
      "Close"
    );
  });

  test("Organization Overview - header, subheader, and tabs visibility", async ({
    page,
  }) => {
    const dashboardPage = new OrgDashboardPage(page);

    Logger.step("Waiting for dashboard to fully load");
    await dashboardPage.isLoaded();

    Logger.step("Asserting Organization Overview heading is visible");
    await expect(dashboardPage.orgOverviewHeading).toBeVisible();

    Logger.step("Asserting Organization Overview subheading is visible");
    await expect(dashboardPage.orgOverviewSubHeading).toBeVisible();

    Logger.step("Asserting 'Slides' tab is visible and selected");
    await expect(dashboardPage.slidesTab).toBeVisible();
    await expect(dashboardPage.slidesTab).toHaveAttribute(
      "aria-selected",
      "true"
    );

    Logger.step("Asserting 'Projects' tab is visible and NOT selected");
    await expect(dashboardPage.projectsTab).toBeVisible();
    await expect(dashboardPage.projectsTab).toHaveAttribute(
      "aria-selected",
      "false"
    );
  });

  test("Org Overview: validate tabs, search & filters UI", async ({ page }) => {
    const dashboard = new OrgDashboardPage(page);

    Logger.step("Ensure dashboard is loaded");
    await dashboard.isLoaded();

    Logger.step(
      "Assert Organization Overview heading & subheading are visible"
    );
    await expect(dashboard.orgOverviewHeading).toBeVisible();
    await expect(dashboard.orgOverviewSubHeading).toBeVisible();

    Logger.step(
      "Assert default Tabs exist (Slides selected, Projects present)"
    );
    await expect(dashboard.slidesTab).toBeVisible();
    await expect(dashboard.projectsTab).toBeVisible();
    await expect(dashboard.slidesTab).toHaveAttribute("aria-selected", "true");

    Logger.step("Assert Search icon + Search input are visible");
    await expect(dashboard.searchIcon).toBeVisible();
    await expect(dashboard.searchInput).toBeVisible();

    Logger.step("Assert Filter icon + label are visible");
    await expect(dashboard.filterButtonIcon).toBeVisible(); // ✅ (restored)
    await expect(dashboard.filterLabel).toBeVisible(); // ✅ (restored)

    Logger.step("Open filter menu and validate options");
    await dashboard.filterButtonIcon.click(); // ✅ (restored)
    await expect(dashboard.filterMenu).toBeVisible();

    // Static filter option locators
    await expect(dashboard.filterOptionTissueType).toBeVisible();
    await expect(dashboard.filterOptionSpecies).toBeVisible();
    await expect(dashboard.filterOptionImageType).toBeVisible();
    await expect(dashboard.filterOptionStains).toBeVisible();

    Logger.step("Assert Upload Slides button is visible");
    await expect(dashboard.uploadSlidesBtn).toBeVisible();
  });

  test("Upload Slides: permission tooltip appears on hover", async ({
    page,
  }) => {
    const dashboard = new OrgDashboardPage(page);

    Logger.step("Ensure dashboard is loaded");
    await dashboard.isLoaded();

    Logger.step("Hover on Upload Slides");
    await dashboard.uploadSlidesWrapper.hover();

    Logger.step("Waiting for tooltip 'Demo mode' to appear");
    await expect(dashboard.tooltipDemoMode).toBeVisible({ timeout: 10000 });

    Logger.step("Move mouse away to hide tooltip");
    await page.mouse.move(0, 0);

    await expect(dashboard.tooltipDemoMode).not.toBeVisible({ timeout: 5000 });
  });
});
