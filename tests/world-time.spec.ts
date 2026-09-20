import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test('search selects a timezone and only adds it after confirmation', async ({ page }) => {
  await page.getByRole('combobox', { name: /search cities/i }).fill('Asia/Tokyo')
  await page.getByRole('option', { name: /Tokyo/i }).first().click()
  await expect(page.getByText('Asia / Tokyo').first()).toBeVisible()
  await expect(page.getByRole('article').filter({ hasText: 'Tokyo' })).toHaveCount(0)
  await page.getByRole('button', { name: 'Add to comparison' }).click()
  await expect(page.getByRole('article').filter({ hasText: 'Tokyo' })).toBeVisible()
  await page.reload()
  await expect(page.getByRole('article').filter({ hasText: 'Tokyo' })).toBeVisible()
})

test('map countries and UTC bands update the sidebar without adding cards', async ({ page }) => {
  await page.getByRole('button', { name: /Peru\. Press Enter to select/ }).click()
  await expect(page.getByText('America / Lima').first()).toBeVisible()
  await expect(page.getByText('Peru').first()).toBeVisible()
  await expect(page.getByRole('article')).toHaveCount(1)
  await page.getByRole('button', { name: /Select UTC.*5$/ }).first().click()
  await expect(page.getByRole('button', { name: 'Add to comparison' })).toBeVisible()
  await expect(page.getByRole('article')).toHaveCount(1)
})

test('country marker does not block selecting a neighbouring country', async ({ page }) => {
  await page.getByRole('button', { name: /Côte d'Ivoire\. Press Enter to select/ }).click()
  await expect(page.getByText("Côte d'Ivoire").first()).toBeVisible()
  await page.getByRole('button', { name: /Ghana\. Press Enter to select/ }).click()
  await expect(page.getByText('Ghana').first()).toBeVisible()
  await expect(page.getByText('Africa / Abidjan').first()).toBeVisible()
})

test('large countries keep a scrollable, searchable timezone list', async ({ page }, testInfo) => {
  await page.getByRole('button', { name: /United States of America\. Press Enter to select/ }).click()
  const sidebar = page.getByRole('complementary', { name: 'Selected timezone details' })
  expect(await sidebar.evaluate((element) => element.scrollHeight > element.clientHeight)).toBe(true)
  await page.getByRole('textbox', { name: 'Filter timezones' }).fill('PST')
  await expect(page.getByRole('button', { name: /America\/Los Angeles.*PDT.*PST/i })).toBeVisible()
  await page.screenshot({ path: testInfo.outputPath('filtered-timezones.png'), fullPage: true })
})

test('desktop workspace keeps cards beneath the map and the sidebar alongside the overlap panel', async ({ page }) => {
  test.skip((await page.viewportSize())!.width <= 800, 'Desktop layout assertion')
  await expect(page.getByText('Drag to reorder')).toHaveCount(0)
  await expect(page.getByText(/All times are saved/i)).toHaveCount(0)

  const sidebar = await page.getByRole('complementary', { name: 'Selected timezone details' }).boundingBox()
  const map = await page.locator('.map-panel').boundingBox()
  const card = await page.getByRole('article').first().boundingBox()
  const overlap = await page.getByRole('heading', { name: 'Overlap Hours' }).locator('..').locator('..').boundingBox()

  expect(sidebar).not.toBeNull()
  expect(map).not.toBeNull()
  expect(card).not.toBeNull()
  expect(overlap).not.toBeNull()
  expect(map!.height).toBeGreaterThanOrEqual(500)
  expect(card!.height).toBeLessThanOrEqual(100)
  expect(card!.x).toBeGreaterThanOrEqual(map!.x)
  expect(sidebar!.y + sidebar!.height).toBeGreaterThanOrEqual(overlap!.y + overlap!.height)
})

test('renders the responsive comparison experience', async ({ page }, testInfo) => {
  await expect(page.getByRole('img', { name: /world map/i })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Overlap Hours' })).toBeVisible()
  await page.screenshot({ path: testInfo.outputPath('world-time.png'), fullPage: true })
})
