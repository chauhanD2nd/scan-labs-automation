import { test, expect } from "@playwright/test";
import { OrganizationReportsPage } from "../pages/org-reports.page";
import { OrgDashboardPage } from "../pages/org-dashboard.page";
import { loginToDashboard } from "../helpers/login.helper";
import {
  generateTimestampString,
  getCurrentQuarterText,
  getCurrentYear,
} from "../utils/helpers";
import { Logger } from "../utils/logger";

test.beforeEach(async ({ page }) => {
  Logger.step("Logging into dashboard");
  await loginToDashboard(page);

  Logger.step("Navigating to Reports");
  const dashboard = new OrgDashboardPage(page);
  await dashboard.isLoaded();
  await dashboard.expandNavigation();
  await dashboard.navReports.click();
});

test("Reports Page: headings and tab visibility", async ({ page }) => {
  const reports = new OrganizationReportsPage(page);
  await reports.isLoaded();

  Logger.step("Validate main headings");
  await expect(reports.orgReportsHeading).toBeVisible();
  await expect(reports.orgReportsSubHeading).toBeVisible();

  Logger.step("Validate tabs");
  await expect(reports.stainsTab).toBeVisible();
  await expect(reports.stainsTab).toHaveAttribute("aria-selected", "true");
  await expect(reports.usersTab).toBeVisible();
});

test("Reports Page: STAIN tab contents", async ({ page }) => {
  const reports = new OrganizationReportsPage(page);
  await reports.isLoaded();

  Logger.step("Check info text under stains tab");
  await expect(reports.stainsInfoText).toBeVisible();

  Logger.step("Validate Year dropdown");
  const expectedYear = getCurrentYear();
  await expect(reports.yearLabel).toBeVisible();
  Logger.step("Assert year dropdown is showing current year");
  await expect(reports.yearValueDisplay(expectedYear)).toBeVisible({
    timeout: 10000,
  });

  Logger.step("Validate Download Usage Report button");
  await expect(reports.downloadBtn).toBeVisible();

  Logger.step("Validate Stain Type Details section");
  await expect(reports.stainTypeDetailsHeader).toBeVisible();
  await expect(reports.panelIHC).toBeVisible();
  await expect(reports.panelHE).toBeVisible();
  await expect(reports.panelSpecial).toBeVisible();
});

test("Reports: IHC panel expand, validate content and collapse", async ({
  page,
}) => {
  const reports = new OrganizationReportsPage(page);
  await reports.isLoaded();

  Logger.step("Expand IHC panel");
  await reports.panelIHC.click();

  Logger.step("Validate Quarter dropdown label");
  await expect(reports.ihcQuarterLabel).toBeVisible();

  const expectedQuarter = getCurrentQuarterText();
  Logger.info(`Expected quarter: ${expectedQuarter}`);

  Logger.step("Validate Quarter dropdown default value");
  await expect(reports.ihcQuarterValue(expectedQuarter).nth(0)).toBeVisible({
    timeout: 8000, // extra wait buffer
  });

  Logger.step("Validate Download IHC Usage Report button");
  await expect(reports.ihcDownloadBtn).toBeVisible();

  Logger.step("Validate section headings inside IHC panel");
  await expect(reports.monthlyDistributionHeading).toBeVisible();
  await expect(reports.monthlyBreakdownHeading).toBeVisible();

  Logger.step("Collapse IHC panel");
  await reports.panelIHC.click();

  Logger.step("Ensure inner elements collapse (download disappears)");
  await expect(reports.ihcDownloadBtn).not.toBeVisible({
    timeout: 8000,
  });
});

test("Reports: Users tab -- search box + user list visibility", async ({
  page,
}) => {
  const reports = new OrganizationReportsPage(page);
  await reports.isLoaded();

  Logger.step("Switch to USERS tab");
  await reports.usersTab.click();

  Logger.step("Validate users search field is visible");
  await expect(reports.usersSearchField).toBeVisible();

  Logger.step("Validate user list has at least 1 user");
  // Waiting manually because load may take time
  await page.waitForTimeout(5000);

  const userCount = await reports.userEmailList.count();
  Logger.info(`User count found = ${userCount}`);

  expect(userCount).toBeGreaterThan(0);
});

test("Users Tab: Logged-in user appears with View User button", async ({
  page,
}) => {
  test.fail(true, "Known issue in demo app — expected to fail");

  const reports = new OrganizationReportsPage(page);
  await reports.isLoaded();

  Logger.step("Switch to USERS tab");
  await reports.usersTab.click();

  Logger.step("Type logged-in user email in Users search field");
  const loggedInEmail = process.env.USER_EMAIL!;
  await reports.usersSearchField.fill(loggedInEmail);

  Logger.step("Wait for filtered results to load");
  await page.waitForTimeout(5000);

  Logger.step("Expect logged-in user email to be visible");
  await expect(reports.userEmailText(loggedInEmail)).toBeVisible();

  Logger.step("Expect unique 'View User' button to appear");
  await expect(reports.viewUserButton(loggedInEmail)).toBeVisible();
});

test("Users Tab: Search with random text shows No data available", async ({
  page,
}) => {
  Logger.step("Load Reports page");
  const reports = new OrganizationReportsPage(page);
  await reports.isLoaded();

  Logger.step("Navigate to USERS tab");
  await reports.usersTab.click();

  const randomText = generateTimestampString();
  Logger.info(`Generated random search text: ${randomText}`);

  Logger.step("Enter random text into Users search field");
  await reports.usersSearchField.fill(randomText);

  Logger.step("Assert 'No data available' appears after search");
  await expect(reports.noDataMessage).toBeVisible({ timeout: 5000 });
});
