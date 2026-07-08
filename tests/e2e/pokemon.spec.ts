import { expect, test } from '@playwright/test';

test.describe('Pokemon Pages', () => {
	test('home page loads and displays Pokemon', async ({ page }) => {
		await page.goto('/');
		await expect(page.locator('h1')).toContainText('Pokédex');

		const firstCard = page.locator('a[href*="/pokemon/"]').first();
		await expect(firstCard).toBeVisible();
	});

	test('Pokemon detail page loads', async ({ page }) => {
		await page.goto('/pokemon/pikachu');

		await expect(page.locator('h1')).toContainText('Pikachu');
		await expect(page.locator('text=Electric')).toBeVisible();
	});
});

test.describe('Berries Pages', () => {
	test('berries page loads', async ({ page }) => {
		await page.goto('/berries');

		await expect(page.locator('h1')).toContainText('Berries');
		const berryCards = page.locator('a[href*="/berries/"]');
		await expect(berryCards.first()).toBeVisible();
	});
});
