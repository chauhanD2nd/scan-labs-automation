import { test, expect } from "@playwright/test";
import { ModelsPage } from "../pages/models.page";
import { OrgDashboardPage } from "../pages/org-dashboard.page";
import { Logger } from "../utils/logger";
import { loginToDashboard } from "../helpers/login.helper";

test.describe("Dashboard Tests", () => {
  test.beforeEach(async ({ page }) => {
    await loginToDashboard(page);
  });

  test("Models Page: essential elements visibility", async ({ page }) => {
    Logger.step("Navigate to Models from Dashboard");
    const dashboard = new OrgDashboardPage(page);
    await dashboard.isLoaded();
    await dashboard.expandNavigation();
    await dashboard.navModel.click();

    Logger.step("Load Models Page");
    const modelsPage = new ModelsPage(page);
    await modelsPage.isLoaded();

    Logger.step("Validate main headings");
    await expect(modelsPage.orgModelsHeading).toBeVisible();
    await expect(modelsPage.orgModelsSubHeading).toBeVisible();

    Logger.step("Validate Stain Management tab exists");
    await expect(modelsPage.stainManagementTab).toBeVisible();
    await expect(modelsPage.stainManagementTab).toHaveAttribute(
      "aria-selected",
      "true"
    );

    Logger.step("Validate Total Stainers summary section");
    await expect(modelsPage.totalStainersLabel).toBeVisible();
    await expect(modelsPage.totalStainersValue).toBeVisible();

    Logger.step("Validate section headings");
    await expect(modelsPage.autoDeepStainerHeading).toBeVisible();
    await expect(modelsPage.autoRestainerHeading).toBeVisible();
    Logger.step("Validate important cards (H&E 0.1.0 & PanCK-MG-TRT)");
    await expect(modelsPage.heCard_v010).toBeVisible();
    await expect(modelsPage.panCKCard).toBeVisible();
  });
});
