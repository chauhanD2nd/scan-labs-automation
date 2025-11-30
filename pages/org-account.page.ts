import { Locator, Page, expect } from "@playwright/test";

export class OrgAccountPage {
  readonly page: Page;

  // --- Headings ---
  readonly accountHeading: Locator;
  readonly accountSubHeading: Locator;

  // --- Metrics ---
  readonly totalUsersLabel: Locator;
  readonly totalProjectsLabel: Locator;

  // --- Tabs ---
  readonly generalTab: Locator;
  readonly organizationTab: Locator;

  // --- GENERAL TAB elements ---
  readonly profileInfoHeading: Locator;
  readonly profileAvatar: Locator;
  readonly fullNameLabel: Locator;
  readonly emailAddressLabel: Locator;

  // --- Organization page locators

  // 1. Settings icon
  readonly settingsIcon: Locator;
  // 2. Organization Settings heading
  readonly orgSettingsHeading: Locator;
  // 3. Business icon
  readonly businessIcon: Locator;
  // 4. Organization Name label + value
  readonly orgNameLabel: Locator;
  readonly orgNameValue: Locator;
  // 5. Timer icon + retention value
  readonly timerIcon: Locator;
  readonly retentionValue: Locator;
  // 6. CheckCircle icons (count)
  readonly checkCircleIcons: Locator;
  // 7+8. QC Enabled label and sibling value
  readonly qcEnabledLabel: Locator;
  readonly qcEnabledValue: Locator;
  // 9+10. Stain Enabled label and sibling value
  readonly stainEnabledLabel: Locator;
  readonly stainEnabledValue: Locator;
  // 11. PeopleOutlineIcon (second one)
  readonly peopleOutlineIconSecond: Locator;
  // 12. Organization Members heading
  readonly orgMembersHeading: Locator;
  // 13. SVG path visibility (primary colored icon paths)
  readonly primarySvgPaths: Locator;
  // 14. Search by name/email textbox
  readonly membersSearchBox: Locator;
  // 15. Users list rows (to check count > 0)
  readonly orgMembersRows: Locator;

  constructor(page: Page) {
    this.page = page;

    // Main Heading
    this.accountHeading = page.locator(
      'h2[class*="text-2xl"]:has-text("Your Account")'
    );

    // Subheading
    this.accountSubHeading = page.locator(
      'div[class*="text-neutral-500"]:has-text("Organization Account Management")'
    );

    // Total Users Label
    this.totalUsersLabel = page.locator('p:has-text("Total Users")');

    // Total Projects Label
    this.totalProjectsLabel = page.locator('p:has-text("Total Projects")');

    // Tabs
    this.generalTab = page.getByRole("tab", { name: "GENERAL" });
    this.organizationTab = page.getByRole("tab", { name: "ORGANIZATION" });

    // --- GENERAL TAB elements ---
    this.profileInfoHeading = page.locator(
      `h6[class*="text-primary"]:has-text("PROFILE INFORMATION")`
    );

    this.profileAvatar = page.locator(`img[class^="MuiAvatar-img"]`);

    this.fullNameLabel = page.locator(
      `h6[class*="text-xs"]:has-text("Full Name")`
    );

    this.emailAddressLabel = page.locator(
      `h6[class*="text-xs"]:has-text("Email Address")`
    );

    this.settingsIcon = page.locator('[data-testid="SettingsIcon"]');
    this.orgSettingsHeading = page.locator(
      'h6:has-text("Organization Settings")'
    );

    this.businessIcon = page.locator('[data-testid="BusinessIcon"]');
    this.orgNameLabel = page.locator('h6:has-text("Organization Name")');
    this.orgNameValue = page.locator('h6:has-text("pictorlabs-hiring-org")'); // if dynamic, replace with has-text or create method

    this.timerIcon = page.locator('[data-testid="TimerIcon"]');
    this.retentionValue = page.locator('h6:has-text("14 days")');

    this.checkCircleIcons = page.locator('[data-testid="CheckCircleIcon"]'); // use .count() when needed

    this.qcEnabledLabel = page.locator('h6:has-text("QC Enabled")');
    this.qcEnabledValue = page.locator(
      'xpath=//h6[contains(.,"QC Enabled")]/following-sibling::h6[1]'
    );

    this.stainEnabledLabel = page.locator('h6:has-text("Stain Enabled")');
    this.stainEnabledValue = page.locator(
      'xpath=//h6[contains(.,"Stain Enabled")]/following-sibling::h6[1]'
    );

    this.peopleOutlineIconSecond = page
      .locator('[data-testid="PeopleOutlineIcon"]')
      .nth(1);

    this.orgMembersHeading = page.locator(
      'h6:has-text("Organization Members")'
    );

    this.primarySvgPaths = page.locator(
      ".MuiSvgIcon-root.MuiSvgIcon-colorPrimary > path"
    );

    this.membersSearchBox = page.getByRole("textbox", {
      name: "Search by name or email",
    });

    this.orgMembersRows = page.locator(".some-user-row-selector"); // replace with your actual row selector for members list
  }
  // Returns the header that shows the user's email
  getProfileEmailHeader(email: string) {
    return this.page.locator(`h6[class*="text-lg"]:has-text("${email}")`);
  }

  getTotalUsersNumber() {
    return this.page
      .locator('h5[class*="MuiTypography-h5"][class*="text-primary-600"]')
      .nth(0);
  }
  // Returns integer count of CheckCircle icons
  async getCheckCircleCount(): Promise<number> {
    return await this.checkCircleIcons.count();
  }

  // Return text of org name (useful if dynamic)
  async getOrgNameText(): Promise<string> {
    return await this.orgNameValue.innerText();
  }

  // Return number of members currently loaded
  async getOrgMembersCount(): Promise<number> {
    return await this.orgMembersRows.count();
  }

  async isLoaded() {
    await this.accountHeading.waitFor({ timeout: 10_000 });
  }
}
