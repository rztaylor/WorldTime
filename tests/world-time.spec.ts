import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test('adds a city through keyboard search and persists it', async ({ page }) => {
  await page.getByRole('combobox', { name: /search cities/i }).fill('Tokyo')
  await page.getByRole('option', { name: /Tokyo/i }).first().click()
  await expect(page.getByText('Asia/Tokyo').first()).toBeVisible()
  await expect(page.getByRole('article').filter({ hasText: 'Tokyo' })).toBeVisible()
  await page.reload()
  await expect(page.getByRole('article').filter({ hasText: 'Tokyo' })).toBeVisible()
})

test('renders the responsive comparison experience', async ({ page }, testInfo) => {
  await expect(page.getByRole('img', { name: /world map/i })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Overlap Hours' })).toBeVisible()
  await page.screenshot({ path: testInfo.outputPath('world-time.png'), fullPage: true })
})
