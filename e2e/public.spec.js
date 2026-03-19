/**
 * Tests E2E — rutas públicas (sin autenticación)
 */
import { test, expect } from "@playwright/test";

test.describe("Rutas públicas", () => {
  test("la página principal carga y muestra el título", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/pokédex/i);
    await expect(page.getByRole("link", { name: /pokédex explorer/i })).toBeVisible();
  });

  test("el listado de Pokémon muestra resultados", async ({ page }) => {
    await page.goto("/pokemon");
    // Esperar a que cargue al menos un Pokémon
    await expect(page.getByText(/bulbasaur/i)).toBeVisible({ timeout: 15_000 });
  });

  test("el buscador filtra Pokémon por nombre", async ({ page }) => {
    await page.goto("/pokemon");
    await expect(page.getByText(/bulbasaur/i)).toBeVisible({ timeout: 15_000 });

    const searchInput = page.getByPlaceholder(/buscar/i).first();
    await searchInput.fill("char");

    await expect(page.getByText(/charmander/i)).toBeVisible();
    await expect(page.getByText("bulbasaur")).not.toBeVisible();
  });

  test("el detalle de un Pokémon muestra su nombre y estadísticas", async ({ page }) => {
    await page.goto("/pokemon/6");
    await expect(page.getByText(/charizard/i)).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(/hp/i)).toBeVisible();
  });

  test("el listado de tipos carga correctamente", async ({ page }) => {
    await page.goto("/types");
    await expect(page.getByRole("heading", { name: /fire/i }).first()).toBeVisible({ timeout: 10_000 });
  });

  test("una ruta inexistente muestra la página 404", async ({ page }) => {
    await page.goto("/ruta-que-no-existe");
    await expect(page.getByText(/404|no encontrada|not found/i)).toBeVisible();
  });
});

test.describe("Redirecciones de rutas protegidas", () => {
  test("favoritos redirige a login si no hay sesión", async ({ page }) => {
    await page.goto("/favorites");
    await expect(page).toHaveURL(/\/login/);
  });

  test("dashboard redirige a login si no hay sesión", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });

  test("perfil redirige a login si no hay sesión", async ({ page }) => {
    await page.goto("/profile");
    await expect(page).toHaveURL(/\/login/);
  });
});
