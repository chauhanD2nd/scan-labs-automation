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
    await expect(uploads.getTabHeading("Slide Upload Dashboard")).toBeVisible();
    await expect(uploads.uploadsSubHeading).toBeVisible();

    Logger.step("Validate tabs");
    await expect(uploads.uploadTab).toBeVisible();
    await expect(uploads.uploadTab).toHaveAttribute("aria-selected", "true");

    await expect(uploads.inProgressTab).toBeVisible();
    await expect(uploads.completedTab).toBeVisible();
  });

  test("Uploads Page - verify Upload tab content is visible", async ({
    page,
  }) => {
    const uploads = new UploadsPage(page);
    await uploads.isLoaded();

    Logger.step("Validate Upload tab is active");
    await expect(uploads.uploadTab).toHaveAttribute("aria-selected", "true");

    // --- Upload tab content ---

    Logger.step("Validate Upload tab main heading");
    await expect(uploads.getTabHeading("Upload Slides")).toBeVisible();

    Logger.step("Validate description paragraph");
    await expect(
      uploads.getParagraph("Select and upload slide files")
    ).toBeVisible();

    Logger.step("Validate Upload Guidelines heading");
    await expect(uploads.uploadGuidelinesHeading).toBeVisible();

    Logger.step("Validate guidelines");
    await expect(uploads.guideline1).toBeVisible();
    await expect(uploads.guideline2).toBeVisible();
    await expect(uploads.guideline3).toBeVisible();

    Logger.step("Validate drag/drop text");
    await expect(uploads.dragDropText).toBeVisible();

    Logger.step("Validate supported formats & max size headings");
    await expect(uploads.supportedFormatsHeading).toBeVisible();
    await expect(uploads.maxFileSizeHeading).toBeVisible();

    Logger.step("Validate Upload button is visible");
    await expect(uploads.uploadButton).toBeVisible();
  });

  test("Uploads: In Progress tab shows expected content", async ({ page }) => {
    const uploads = new UploadsPage(page);
    await uploads.isLoaded();

    Logger.step("Validate loading uploads indicator is visible");
    await expect(page.getByText("Loading uploads...")).toBeVisible();


    Logger.step("Click In Progress tab");
    await uploads.inProgressTab.click();

    Logger.step("Validate In Progress tab heading");
    await expect(uploads.inProgressHeading).toBeVisible();

    Logger.step("Validate In Progress description text");
    await expect(uploads.inProgressDescription).toBeVisible();

    Logger.step("Validate 'No files currently uploading' message");
    await expect(uploads.noFilesUploadingText).toBeVisible();
  });

  test("Uploads: Completed tab shows expected content", async ({ page }) => {
    const uploads = new UploadsPage(page);
    await uploads.isLoaded();

    Logger.step("Click Completed tab");
    await uploads.completedTab.click();

    Logger.step("Validate loading completed uploads indicator is visible");
    await expect(page.getByText("Loading completed uploads...")).toBeVisible();
    
    Logger.step("Validate Completed tab heading");
    await expect(uploads.getTabHeading("Slide Upload History")).toBeVisible();

    Logger.step("Validate Completed tab description text");
    await expect(
      uploads.getParagraph("View slide(s) upload history")
    ).toBeVisible();

    Logger.step("Validate 'No completed uploads' message");
    await expect(uploads.noCompletedUploadsText).toBeVisible();
  });
});
