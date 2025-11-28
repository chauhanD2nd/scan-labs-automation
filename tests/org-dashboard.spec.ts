import { test, expect } from "@playwright/test";
import { OrgDashboardPage } from "../pages/org-dashboard.page";
import { loginToDashboard } from "../helpers/login.helper";
import { testData } from "../testData/test-data";
import { Logger } from "../utils/logger";

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
    Logger.step("Waiting for Staining Usage Overview Table data to load");
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
});
