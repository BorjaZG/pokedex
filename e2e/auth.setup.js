/**
 * Setup de autenticación para los tests E2E.
 * Hace login una vez y guarda la sesión en e2e/.auth/user.json
 * para que el resto de tests autenticados la reutilicen.
 *
 * Requiere en .env.test (o .env):
 *   E2E_TEST_EMAIL=tu@email.com
 *   E2E_TEST_PASSWORD=tupassword
 */
import { test as setup, expect } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const AUTH_FILE  = path.join(__dirname, ".auth", "user.json");

const EMAIL    = process.env.E2E_TEST_EMAIL;
const PASSWORD = process.env.E2E_TEST_PASSWORD;

setup("autenticar usuario de prueba", async ({ page }) => {
  if (!EMAIL || !PASSWORD) {
    console.warn("⚠️  E2E_TEST_EMAIL / E2E_TEST_PASSWORD no definidos — saltando setup");
    return;
  }

  await page.goto("/login");
  await page.getByLabel("Email").fill(EMAIL);
  await page.getByLabel("Contraseña").fill(PASSWORD);
  await page.getByRole("button", { name: /entrar/i }).click();

  // Esperar a que el login tenga efecto (aparece el botón Salir)
  await expect(page.getByRole("button", { name: /salir/i })).toBeVisible({ timeout: 10_000 });

  // Guardar cookies + localStorage con la sesión de Supabase
  await page.context().storageState({ path: AUTH_FILE });
});
