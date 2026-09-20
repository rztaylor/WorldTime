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

test('map countries and UTC bands update the sidebar without adding cards', async ({ page }, testInfo) => {
  await page.getByRole('button', { name: /Peru\. Press Enter to select/ }).click()
  await expect(page.getByText('America / Lima').first()).toBeVisible()
  await expect(page.getByText('Peru').first()).toBeVisible()
  await expect(page.getByRole('article')).toHaveCount(1)
  await expect(page.getByRole('heading', { name: 'Country', exact: true })).toHaveCount(0)

  await page.getByRole('button', { name: 'Select UTC', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Countries at UTC' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Ghana', exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Iceland', exact: true })).toBeVisible()
  await expect(page.locator('.selected-country')).toHaveCount(0)
  expect(await page.locator('.related-country').count()).toBeGreaterThan(1)
  await expect(page.getByRole('article')).toHaveCount(1)
  await page.screenshot({ path: testInfo.outputPath('utc-band-countries.png'), fullPage: true })

  await page.getByRole('button', { name: 'Ghana', exact: true }).click()
  await expect(page.getByText('Africa / Abidjan').first()).toBeVisible()
  await expect(page.getByRole('button', { name: /Accra Capital UTC/ })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Country', exact: true })).toHaveCount(0)
  await expect(page.locator('.selected-country')).toHaveCount(1)
})

test('country drilldown returns to the originating UTC offset list', async ({ page }) => {
  await page.getByRole('button', { name: 'Select UTC+1', exact: true }).click()
  await page.getByRole('button', { name: 'United Kingdom', exact: true }).click()
  const back = page.getByRole('button', { name: 'Back to UTC+1' })
  await expect(back).toBeVisible()
  await back.click()
  await expect(page.getByRole('heading', { name: 'Countries at UTC+1' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'United Kingdom', exact: true })).toBeVisible()
})

test('country marker does not block selecting a neighbouring country', async ({ page }) => {
  await page.getByRole('button', { name: /Côte d'Ivoire\. Press Enter to select/ }).click()
  await expect(page.getByText("Côte d'Ivoire").first()).toBeVisible()
  await page.getByRole('button', { name: /Ghana\. Press Enter to select/ }).click()
  await expect(page.getByText('Ghana').first()).toBeVisible()
  await expect(page.getByText('Africa / Abidjan').first()).toBeVisible()
})

test('UTC bands stay synchronized with map pan and zoom', async ({ page }, testInfo) => {
  const mapTransform = page.locator('.rsm-zoomable-group')
  const bandTransform = page.locator('.band-transform')
  const synchronized = async () => {
    const mapValue = await mapTransform.getAttribute('transform')
    const bandValue = await bandTransform.getAttribute('transform')
    const mapMatch = mapValue?.match(/translate\(([-\d.]+) [-\d.]+\) scale\(([-\d.]+)\)/)
    const bandMatch = bandValue?.match(/translate\(([-\d.]+) 0\) scale\(([-\d.]+) 1\)/)
    return Boolean(mapMatch && bandMatch && Math.abs(Number(mapMatch[1]) - Number(bandMatch[1])) < 0.01 && Math.abs(Number(mapMatch[2]) - Number(bandMatch[2])) < 0.01)
  }

  await expect.poll(synchronized).toBe(true)
  const initialTransform = await mapTransform.getAttribute('transform')
  const initialBandWidth = (await page.getByRole('button', { name: 'Select UTC', exact: true }).boundingBox())!.width
  await page.getByRole('button', { name: 'Zoom in' }).click()
  await expect.poll(synchronized).toBe(true)
  expect(await mapTransform.getAttribute('transform')).not.toBe(initialTransform)
  expect((await page.getByRole('button', { name: 'Select UTC', exact: true }).boundingBox())!.width).toBeGreaterThan(initialBandWidth)

  const map = page.getByRole('img', { name: /world map/i })
  const bounds = (await map.boundingBox())!
  await page.mouse.move(bounds.x + bounds.width * 0.65, bounds.y + bounds.height * 0.55)
  await page.mouse.down()
  await page.mouse.move(bounds.x + bounds.width * 0.45, bounds.y + bounds.height * 0.55, { steps: 5 })
  await page.mouse.up()
  await expect.poll(synchronized).toBe(true)
  await page.screenshot({ path: testInfo.outputPath('panned-zoomed-map.png'), fullPage: true })
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
  await expect(page.getByText('Current offsets · includes daylight saving')).toBeVisible()
  await expect(page.getByText(/UTC\+1 now/)).toBeVisible()
  await expect(page.getByText('Standard offset: UTC')).toBeVisible()
  await expect(page.getByRole('img', { name: /world map/i })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Overlap Hours' })).toBeVisible()
  await page.screenshot({ path: testInfo.outputPath('world-time.png'), fullPage: true })
})
