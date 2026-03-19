/**
 * Tests E2E — flujos que requieren sesión iniciada.
 * Usan la sesión guardada por auth.setup.js
 */
import { test, expect } from "@playwright/test";

const HAS_CREDENTIALS = !!(process.env.E2E_TEST_EMAIL && process.env.E2E_TEST_PASSWORD);

test.describe("Usuario autenticado", () => {
  test.skip(!HAS_CREDENTIALS, "Requiere E2E_TEST_EMAIL y E2E_TEST_PASSWORD en .env");

  test("el header muestra el nombre de usuario y el botón Salir", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: /salir/i })).toBeVisible();
  });

  test("puede acceder a favoritos", async ({ page }) => {
    await page.goto("/favorites");
    await expect(page).toHaveURL(/\/favorites/);
  });

  test("puede acceder al dashboard", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/dashboard/);
    // Debe mostrar alguno de los dos dashboards
    await expect(
      page.getByText(/panel de administración|mi pokédex/i)
    ).toBeVisible({ timeout: 10_000 });
  });

  test("puede acceder a su perfil", async ({ page }) => {
    await page.goto("/profile");
    await expect(page.getByRole("heading", { name: /mi perfil/i })).toBeVisible();
  });

  test("puede añadir y quitar un Pokémon de favoritos", async ({ page }) => {
    await page.goto("/pokemon/1");
    await expect(page.getByText(/bulbasaur/i)).toBeVisible({ timeout: 10_000 });

    const favBtn = page.getByRole("button", { name: /añadir a favoritos|quitar de favoritos/i });
    await expect(favBtn).toBeVisible();

    // Guardar el texto inicial para detectar el cambio
    const initialText = await favBtn.textContent();
    await favBtn.click();

    // El texto del botón debe cambiar (añadido ↔ quitado)
    await expect(favBtn).not.toHaveText(initialText, { timeout: 5_000 });

    // Deshacer el cambio para no contaminar otros tests
    await favBtn.click();
    await expect(favBtn).toHaveText(initialText, { timeout: 5_000 });
  });

  test("cerrar sesión redirige al login", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /salir/i }).click();
    await expect(page.getByRole("link", { name: /iniciar sesión/i })).toBeVisible();
  });
});
