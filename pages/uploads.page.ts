import { Locator, Page, expect } from "@playwright/test";

export class UploadsPage {
  readonly page: Page;

  // --- Headings ---
  readonly uploadsHeading: Locator;
  readonly uploadsSubHeading: Locator;

  // --- Tabs ---
  readonly uploadTab: Locator;
  readonly inProgressTab: Locator;
  readonly completedTab: Locator;
  // Upload tab content
  readonly uploadSlidesHeading: Locator;
  readonly uploadDescription: Locator;
  readonly uploadGuidelinesHeading: Locator;

  readonly guideline1: Locator;
  readonly guideline2: Locator;
  readonly guideline3: Locator;

  readonly dragDropText: Locator;
  readonly supportedFormatsHeading: Locator;
  readonly maxFileSizeHeading: Locator;

  readonly uploadButton: Locator;
  // In Progress tab content
  readonly inProgressHeading: Locator;
  readonly inProgressDescription: Locator;
  readonly noFilesUploadingText: Locator;
  // Completed tab content 
  readonly noCompletedUploadsText: Locator;

  constructor(page: Page) {
    this.page = page;

    // Tabs
    this.uploadTab = page.getByRole("tab", { name: "Upload" });
    this.inProgressTab = page.getByRole("tab", { name: "In Progress" });
    this.completedTab = page.getByRole("tab", { name: "Completed" });

    //  Upload Tab Content
    // --- Top heading ---
    this.uploadsHeading = page.locator(
      'h2[class*="text-2xl"]:has-text("Slide Upload Dashboard")'
    );

    this.uploadsSubHeading = page.locator('div[class*="text-neutral-500"]', {
      hasText: "Slide Management Dashboard",
    });

    // Upload Slides heading inside Upload tab
    this.uploadSlidesHeading = page.locator("h2[class*='font-bold']", {
      hasText: "Upload Slides",
    });

    this.uploadDescription = page.getByText(
      "Select and upload slide files to begin applying virtual stains",
      { exact: false }
    );

    this.uploadGuidelinesHeading = page.getByRole("heading", {
      name: "Upload Guidelines:",
      exact: true,
    });

    this.guideline1 = page.getByText(
      "Ensure slides are properly labeled before upload",
      { exact: true }
    );

    this.guideline2 = page.getByText(
      "Uploaded slides may be auto-processed based on your organization's staining rules",
      { exact: true }
    );

    this.guideline3 = page.getByText(
      "For large batches, please allow a few minutes for processing to begin",
      { exact: true }
    );

    this.dragDropText = page.getByText(
      "Choose files or drag and drop files here",
      { exact: true }
    );

    this.supportedFormatsHeading = page.getByRole("heading", {
      name: /Supported formats/,
    });

    this.maxFileSizeHeading = page.getByRole("heading", {
      name: /Maximum file size/,
    });

    this.uploadButton = page.locator(
      "button[class^='bg-primary-600']:has-text('Upload')"
    );

    // --- In Progress tab content ---

    this.inProgressHeading = page.locator(
      'h2[class*="text-2xl"]:has-text("Slide Upload(s) In Progress")'
    );

    // Partial match
    this.inProgressDescription = page.locator(
      'p[class*="text-xl"][class*="text-gray"]:has-text("Your files are uploading in the background")'
    );

    this.noFilesUploadingText = page.locator(
      'h6[class*="MuiTypography-h6"][class*="text-gray"]:has-text("No files currently uploading")'
    );

    this.noCompletedUploadsText = page.locator(
  "h6[class*='MuiTypography-h6'][class*='text-gray']:has-text('No completed uploads')"
);
  }

  async isLoaded() {
    await this.uploadsHeading.waitFor({ timeout: 10_000 });
  }

  getTabHeading(text: string) {
  return this.page.locator(`h2[class*="text-2xl"]:has-text("${text}")`);
}

// Generate a <p> locator for tab description paragraphs (partial match)
getParagraph(partialText: string) {
  return this.page.locator(
    `p[class*="text-xl"][class*="text-gray"]:has-text("${partialText}")`
  );
}
}


