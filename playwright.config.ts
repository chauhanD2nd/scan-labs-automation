import { defineConfig, devices } from "@playwright/test";
import { ENV } from "./config/env";

export default defineConfig({
  testDir: "./tests",

  use: {
    baseURL: ENV.url,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "retain-on-failure",
  },

  reporter: "html",

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  expect: {
    timeout: 30000,
  },
});
