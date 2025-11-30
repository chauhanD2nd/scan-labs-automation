# 🧪 Playwright Automation Framework — Virtual Stain Hub

End-to-end UI automation framework built using **Playwright + TypeScript**, designed for the Virtual Stain Hub application.  
This project covers **authentication, dashboard modules, top-bar actions, support workflow, reports, uploads, organization settings**, and full error & UI validation.

---

## 🚀 Tech Stack

- **Playwright** (TypeScript)
- **Node.js**
- **Jenkins CI Integration**
- **Page Object Model (POM)**
- **Allure + HTML Reports**
- **Environment-driven test data**

---

## 📁 Project Structure

├── pages/
│ ├── landing.page.ts
│ ├── login.page.ts
│ ├── org-dashboard.page.ts
│ ├── uploads.page.ts
│ ├── org-reports.page.ts
│ ├── topbar.page.ts
│ ├── support-popup.page.ts
│ ├── organization.page.ts
│
├── tests/
│ ├── login.spec.ts
│ ├── dashboard.spec.ts
│ ├── uploads.spec.ts
│ ├── reports.spec.ts
│ ├── topbar.spec.ts
│ ├── organization.spec.ts
│
├── helpers/
│ ├── login.helper.ts
│ ├── test-data.ts
│ ├── helpers.ts
│
├── utils/
│ ├── logger.ts
│
├── playwright.config.ts
├── package.json
├── README.md

---

## 🔧 Environment Setup

Install dependencies:

```bash
npm install
Run Playwright dependency installer:

### ⚙️ Local Environment Variables (PowerShell Setup)

This project uses environment variables for credentials and environment URLs.  
To make local setup easy, a PowerShell script `env.ps1` is included.

I placed it here (but did not push):

.\config\env.ps1

To load all required environment variables into your PowerShell session, run:
.\config\env.ps1
You must run this once per terminal session before starting Playwright tests.
This ensures sensitive credentials never enter source control and remain only in your local environment.
BASE_URL=https://app.pictorlabs.ai
USER_EMAIL=your.email@domain.com
USER_PASSWORD=yourPassword


▶️ Running Tests
Run all tests
npx playwright test

Run in headed (debug) mode
npx playwright test --headed

Open Playwright inspector
npx playwright test --debug

npx playwright show-report

🔄 CI Integration (Jenkins)
Jenkins is configured to:
Pull the latest branch
Install dependencies
Run Playwright tests with tags
Always generate HTML report even on failures
Optionally update JIRA or Slack

Example Jenkins command:
npx playwright test --project=chromium --reporter=html --grep "@smoke" || true
(|| true ensures Jenkins doesn’t stop the pipeline on failures)

🧱 Framework Features
Full POM (Page Object Model)
Strong explicit waits
Reusable helper utilities
Dynamic dropdown selectors
Random text generator for unique IDs
Support popup automation
Reset session timeout validation
Top-bar utilities (Profile / Support / Org Switcher)
Organization settings validations
Upload module: Upload / In-Progress / Completed tabs

📌 Developer Notes
All selectors use stable locators (getByRole, getByText, data-testid).
Logging uses a custom Logger.step("message").
Strong visibility checks with Playwright expect().
Reusable custom locator methods (e.g., getTabHeading(text)).
Designed to support large-scale regression suites.

👨‍💻 Author
SDET Automation Framework implemented and designed with:
Clean coding practices
Modular structure
Scalable test architecture
Clear logging and reporting
✅ Conclusion
This automation project is built to be:
Stable
Readable
Scalable
CI-ready
Easily maintainable
Feel free to extend modules, add tags, or scale parallel execution.

---
