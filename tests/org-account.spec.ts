import { test, expect } from "@playwright/test";
import { loginToDashboard } from "../helpers/login.helper";
import { Topbar } from "../pages/topbar.page";
import { OrgAccountPage } from "../pages/org-account.page";
import { Logger } from "../utils/logger";
import { OrgDashboardPage } from "../pages/org-dashboard.page";
import { OrganizationReportsPage } from "../pages/org-reports.page";

test.describe("Organization Account Page Tests", () => {
  test.beforeEach(async ({ page }) => {
    await loginToDashboard(page);
  });

  //Validate Account Page key elements
  test("Account Page – all key elements visible", async ({ page }) => {
    const topbar = new Topbar(page);

    Logger.step("Opening Profile tray");
    await topbar.profileIcon.click();

    Logger.step("Click 'My Organization'");
    await topbar.profileMenuMyOrg.click();

    Logger.step("Load Organization Account Page");
    const account = new OrgAccountPage(page);
    await account.isLoaded();

    Logger.step("Validate main heading");
    await expect(account.accountHeading).toBeVisible();
    Logger.step("Validate sub heading");
    await expect(account.accountSubHeading).toBeVisible();

    Logger.step("Validate total users label");
    await expect(account.totalUsersLabel).toBeVisible();
    Logger.step("Validate total projects label");
    await expect(account.totalProjectsLabel).toBeVisible();

    Logger.step("Validate tabs");
    await expect(account.generalTab).toBeVisible();
    Logger.step("Assert GENERAL tab is selected by default");
    await expect(account.generalTab).toHaveAttribute("aria-selected", "true");

    Logger.step("Validate Organization tab visibility");
    await expect(account.organizationTab).toBeVisible();
  });

  //Validate General Tab elements
  test("General Tab: validate all profile information elements", async ({
    page,
  }) => {
    const topbar = new Topbar(page);

    Logger.step("Open profile menu");
    await topbar.profileIcon.click();

    Logger.step("Click My Organization");
    await topbar.profileMenuMyOrg.click();

    Logger.step("Load Organization Account Page");
    const account = new OrgAccountPage(page);
    await account.isLoaded();

    Logger.step("Validate GENERAL tab is selected");
    await expect(account.generalTab).toHaveAttribute("aria-selected", "true");

    Logger.step("Validate Profile Information heading");
    await expect(account.profileInfoHeading).toBeVisible();

    Logger.step("Validate avatar image visibility");
    await expect(account.profileAvatar).toBeVisible();

    Logger.step("Validate email header (shows logged-in email)");
    await expect(
      account.getProfileEmailHeader(process.env.USER_EMAIL!)
    ).toBeVisible();
    Logger.step("Validate Full Name label");
    await expect(account.fullNameLabel).toBeVisible();

    Logger.step("Validate Email Address label");
    await expect(account.emailAddressLabel).toBeVisible();
  });

  //Validate Organization Tab elements
  test("My Organization: Total Users count matches Users tab count", async ({
    page,
  }) => {
    // Step 1: Login & go to Reports page
    const dashboard = new OrgDashboardPage(page);
    await dashboard.expandNavigation();
    await dashboard.navReports.click();

    Logger.step("Load Reports Page");
    const reports = new OrganizationReportsPage(page);
    await reports.isLoaded();

    Logger.step("Switch to USERS tab");
    await reports.usersTab.click();

    Logger.step("Get total users count from Reports");
    await expect(page.getByRole("button", { name: "1" })).toBeVisible({
      timeout: 5000,
    });
    const usersCount = await reports.getUsersCount();
    Logger.info(`User count from Reports = ${usersCount}`);

    // Step 2: Navigate to My Organization
    Logger.step("Open Profile menu");
    const topbar = new Topbar(page);
    await topbar.profileIcon.click();

    Logger.step("Click My Organization option");
    await topbar.profileMenuMyOrg.click();

    Logger.step("Load Organization Account Page");
    const account = new OrgAccountPage(page);
    await account.isLoaded();

    // Step 3: Validate Total Users count
    Logger.step("Validate Total Users count matches Reports page");
    const displayedCount = await account.getTotalUsersNumber().innerText();
    expect(Number(displayedCount)).toBe(usersCount);
  });

  //Validate Organization Tab elements settings & members visibility
  test("My Organization: Organization tab settings & members visibility", async ({
    page,
  }) => {
    const topbar = new Topbar(page);

    Logger.step("Open profile menu");
    await topbar.profileIcon.click();

    Logger.step("Click 'My Organization'");
    await topbar.profileMenuMyOrg.click();

    Logger.step("Load Organization Account Page");
    const orgPage = new OrgAccountPage(page);
    await orgPage.isLoaded();

    Logger.step("Switch to ORGANIZATION tab");
    await orgPage.organizationTab.click();

    // 1. Settings icon + heading
    Logger.step("Validate Organization Settings icon & heading");
    await expect(orgPage.settingsIcon).toBeVisible();
    await expect(orgPage.orgSettingsHeading).toBeVisible();

    // 2. Business icon + organization name
    Logger.step("Validate business icon and organization name");
    await expect(orgPage.businessIcon).toBeVisible();
    await expect(orgPage.orgNameLabel).toBeVisible();
    await expect(orgPage.orgNameValue).toBeVisible();

    // 3. Retention (Timer icon + value)
    Logger.step("Validate retention timer and value");
    await expect(orgPage.timerIcon).toBeVisible();
    await expect(orgPage.retentionValue).toBeVisible();

    // 4. CheckCircle count
    Logger.step("Check number of CheckCircle icons");
    const cnt = await orgPage.getCheckCircleCount();
    Logger.info(`CheckCircle icons count: ${cnt}`);
    await expect(cnt).toBe(2); // as specified

    // 5. QC Enabled + Value
    Logger.step("Validate QC Enabled pair");
    await expect(orgPage.qcEnabledLabel).toBeVisible();
    await expect(orgPage.qcEnabledValue).toBeVisible();

    // 6. Stain Enabled + Value
    Logger.step("Validate Stain Enabled pair");
    await expect(orgPage.stainEnabledLabel).toBeVisible();
    await expect(orgPage.stainEnabledValue).toBeVisible();

    // 7. Second People icon + Members heading
    Logger.step("Validate People icon (second) & Organization Members heading");
    await expect(orgPage.peopleOutlineIconSecond).toBeVisible();
    await expect(orgPage.orgMembersHeading).toBeVisible();

    // 8. Primary SVG path visibility
    Logger.step("Validate primary SVG icons");
    await expect(orgPage.primarySvgPaths.first()).toBeVisible();

    // 9. Search box visibility
    Logger.step("Validate Members search box visibility");
    await expect(orgPage.membersSearchBox).toBeVisible();

    // 10. Members table rows (if available)
    Logger.step("Validate members list visibility");
    const membersCount = await orgPage.getOrgMembersCount();
    Logger.info(`Organization members loaded: ${membersCount}`);

    if (membersCount > 0) {
      await expect(orgPage.orgMembersRows.first()).toBeVisible();
    } else {
      Logger.info(
        "No organization members loaded — skipping members row assertion"
      );
    }
  });

  //Validate Topbar Logout functionality
  test("Topbar: Logout redirects user to Landing Page", async ({ page }) => {
    const topbar = new Topbar(page);

    Logger.step("Click profile icon to open menu");
    await topbar.profileIcon.click();

    Logger.step("Click Log out");
    await topbar.profileMenuLogout.click();

    Logger.step("Validate landing page is shown");
    await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
    await expect(page.getByText("Welcome to Virtual Stain Hub")).toBeVisible();
  });
  
});
