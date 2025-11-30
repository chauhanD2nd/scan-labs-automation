import { test, expect } from "@playwright/test";
import { TopBar } from "../pages/topbar.page";
import { SupportPopup } from "../pages/support-popup.page";
import { loginToDashboard } from "../helpers/login.helper";
import { Logger } from "../utils/logger";
import { generateTimestampString } from "../utils/helpers";
import { ISSUE_CATEGORIES } from "../testData/test-data";

test.describe("Topbar Tests", () => {
  test.beforeEach(async ({ page }) => {
    await loginToDashboard(page);
  });

  // Test: Verify Topbar elements are visible
  test("Topbar: Support, Profile, and Hiring Org buttons are visible", async ({
    page,
  }) => {
    const topbar = new TopBar(page);

    Logger.step("Validate Support button is visible");
    await expect(topbar.supportButton).toBeVisible();

    Logger.step("Validate Profile icon is visible");
    await expect(topbar.profileIcon).toBeVisible();

    Logger.step("Validate Hiring Org button is visible");
    await expect(topbar.hiringOrgButton).toBeVisible();
  });
  // Test: Verify Support Popup core fields are visible
  test("Support Popup - all core fields visible", async ({ page }) => {
    const topbar = new TopBar(page);

    Logger.step("Click Support button");
    await topbar.supportButton.click();

    const support = new SupportPopup(page);
    await support.isVisible();

    Logger.step("Validate Order ID label");
    await expect(support.orderIdLabel).toBeVisible();

    Logger.step("Validate Email field + label");
    await expect(support.emailLabel).toBeVisible();
    await expect(support.emailInput).toBeVisible();

    Logger.step("Validate Title field");
    //await expect(support.titleLabel).toBeVisible();
    await expect(support.titleInput).toBeVisible();
    support.titleInput.click;

    Logger.step("Validate Issue Category dropdown field");
    await expect(support.issueCategoryInput).toBeVisible();

    Logger.step("Validate Problem Description label");
    await expect(support.problemDescriptionLabel).toBeVisible();

    Logger.step("Validate Request Support button");
    await expect(support.requestSupportBtn).toBeVisible();
  });

  // Test: Verify validation errors appear when submitting empty Support Popup form//
  test("Support Popup - validation errors appear when submitting empty form", async ({
    page,
  }) => {
    const topbar = new TopBar(page);

    Logger.step("Open Support popup");
    await topbar.supportButton.click();

    const support = new SupportPopup(page);
    await support.isVisible();

    Logger.step("Click Request Support without entering anything");
    await support.requestSupportBtn.click();

    Logger.step("Validate Title required error");
    await expect(support.getErrorText("Please add a title")).toBeVisible();

    Logger.step("Validate Description required error");
    await expect(
      support.getErrorText("Please add a description")
    ).toBeVisible();

    Logger.step("Validate Issue Category required error");
    await expect(support.issueCategoryError).toBeVisible();
  });

  // Test: Verify all Issue Category dropdown options are visible
  test("Support Popup – Issue Category dropdown options visible", async ({
    page,
  }) => {
    const topbar = new TopBar(page);

    Logger.step("Open Support Popup");
    await topbar.supportButton.click();

    const support = new SupportPopup(page);
    await support.isVisible();

    Logger.step("Click Issue Category dropdown");
    await support.issueCategoryInput.click();

    Logger.step("Validate all dropdown options");
    const options = ISSUE_CATEGORIES;
    for (const opt of options) {
      Logger.info(`Checking option: ${opt}`);
      await expect(support.getDropdownOption(opt)).toBeVisible();
    }
  });

  // Test: Submit Support Request successfully
  test("Submit Support Request successfully", async ({ page }) => {
    const topbar = new TopBar(page);

    Logger.step("Open Support Popup");
    await topbar.supportButton.click();

    const supportPopup = new SupportPopup(page);

    const unique = generateTimestampString();
    const title = `Issue-${unique}`;
    const description = `${title} description`;

    Logger.step("Filling Title");
    //await page
    //.getByRole("textbox", { name: "Issue title" })
    //.waitFor({ timeout: 5000 });
    await page.getByRole("textbox", { name: "Issue title" }).click();
    Logger.step("Typing Issue Title using keyboard");
    await page.keyboard.type(title, { delay: 20 }); // realistic typing

    Logger.step("Selecting random Issue Category");
    await supportPopup.selectRandomCategory();

    Logger.step("Filling Problem Description");
    await page
      .getByRole("textbox", { name: "Problem Description" })
      .fill(description);

    Logger.step("Submitting Support Request");
    await supportPopup.requestSupportBtn.click();

    Logger.step("Validating Success Popup");
    await expect(page.getByTestId("SuccessOutlinedIcon")).toBeVisible();
    await expect(page.getByText("Your request has been")).toBeVisible();
    await expect(page.getByRole("button", { name: "Close" })).toBeVisible();

    Logger.step("Closing success popup");
    await page.getByRole("button", { name: "Close" }).click();

    Logger.step("Validating popup disappeared");
    await expect(page.getByTestId("SuccessOutlinedIcon")).not.toBeVisible();
  });

  // Test: Verify Profile menu options
  test("Topbar: Profile menu shows My Organization & Log out", async ({
    page,
  }) => {
    const topbar = new TopBar(page);

    Logger.step("Click profile icon");
    await topbar.profileIcon.click();

    Logger.step("Validate 'My Organization' option is visible");
    await expect(topbar.profileMenuMyOrg).toBeVisible();

    Logger.step("Validate 'Log out' option is visible");
    await expect(topbar.profileMenuLogout).toBeVisible();
  });

  //Validate Hiring Org dropdown
  test("Topbar: Hiring Org dropdown displays second option", async ({
    page,
  }) => {
    const topbar = new TopBar(page);

    Logger.step("Click Hiring Org button in top bar");
    await topbar.hiringOrgButton.click();

    Logger.step("Validate the second Hiring Org dropdown item is visible");
    await expect(topbar.hiringOrgDropdownItem).toBeVisible();
  });
});
