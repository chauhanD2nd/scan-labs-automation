import { test, expect } from "@playwright/test";
import { UploadsPage } from "../pages/uploads.page";
import { OrgDashboardPage } from "../pages/org-dashboard.page";
import { Logger } from "../utils/logger";
import { loginToDashboard } from "../helpers/login.helper";

test.describe("Uploads Page Tests", () => {
  test.beforeEach(async ({ page }) => {
    await loginToDashboard(page);
    Logger.step("Navigate to Uploads from Dashboard");
    const dashboard = new OrgDashboardPage(page);
    await dashboard.isLoaded();
    await dashboard.expandNavigation();
    await dashboard.navUploads.click();
    Logger.step("Load Uploads Page");
  });

  test("Uploads Page - headings and tabs visibility", async ({ page }) => {
    const uploads = new UploadsPage(page);
    await uploads.isLoaded();

    Logger.step("Validate main headings");
    await expect(uploads.uploadsHeading).toBeVisible();
    await expect(uploads.uploadsSubHeading).toBeVisible();

    Logger.step("Validate tabs");
    await expect(uploads.uploadTab).toBeVisible();
    await expect(uploads.uploadTab).toHaveAttribute("aria-selected", "true");

    await expect(uploads.inProgressTab).toBeVisible();
    await expect(uploads.completedTab).toBeVisible();
  });
  
  test("Uploads Page - verify Upload tab content is visible", async ({ page }) => {
    const uploads = new UploadsPage(page);
    await uploads.isLoaded();

    Logger.step("Validate Upload tab is active");
    await expect(uploads.uploadTab).toHaveAttribute("aria-selected", "true");

    Logger.step("Validate Upload tab content");
    await expect(uploads.uploadSlidesHeading).toBeVisible();
    await expect(uploads.uploadDescription).toBeVisible();
    await expect(uploads.uploadGuidelinesHeading).toBeVisible();

    Logger.step("Validate guidelines");
    await expect(uploads.guideline1).toBeVisible();
    await expect(uploads.guideline2).toBeVisible();
    await expect(uploads.guideline3).toBeVisible();

    Logger.step("Validate drag/drop text");
    await expect(uploads.dragDropText).toBeVisible();

    Logger.step("Validate supported formats & max file size");
    await expect(uploads.supportedFormatsHeading).toBeVisible();
    await expect(uploads.maxFileSizeHeading).toBeVisible();

    Logger.step("Validate Upload button is visible");
    await expect(uploads.uploadButton).toBeVisible();
  });
});
