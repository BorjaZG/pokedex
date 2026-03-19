import { defineConfig } from "@playwright/test";
import "dotenv/config";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  retries: 1,
  workers: 1,
  reporter: "html",

  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    locale: "es-ES",
    channel: "chrome",
  },

  projects: [
    // Flujos que requieren login — se ejecutan primero para generar storageState
    {
      name: "setup",
      testMatch: /auth\.setup\.js/,
    },
    // Tests públicos (sin login)
    {
      name: "public",
      testMatch: /public\.spec\.js/,
    },
    // Tests autenticados (reutilizan la sesión guardada)
    {
      name: "authenticated",
      testMatch: /authenticated\.spec\.js/,
      dependencies: ["setup"],
      use: { storageState: "e2e/.auth/user.json" },
    },
  ],

  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
