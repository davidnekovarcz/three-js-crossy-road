/** Step forward, wait for the first hit, then save the score with the test Gmail. */
export default async ({ page, url }) => {
  await page.goto(url(), { waitUntil: "domcontentloaded" });
  const score = page.locator("#score");
  await score.waitFor();

  const result = page.locator("#result-container");
  const forward = page.locator("#controls button").nth(0);
  const left = page.locator("#controls button").nth(1);
  const right = page.locator("#controls button").nth(3);
  await forward.waitFor();
  // Corn starts at 0, so a vehicle hit ends the run. Rows are forest, logs,
  // or animals; only animals hit. A tree can block forward, so step aside
  // and try again. Wait for a hit only after the score actually advances.
  for (let i = 0; i < 24; i += 1) {
    if (await result.isVisible().catch(() => false)) break;
    const before = Number((await score.innerText()).trim());
    await forward.click();
    await page.waitForTimeout(350);
    if (Number((await score.innerText()).trim()) === before) {
      await (i % 2 === 0 ? left : right).click();
      await page.waitForTimeout(250);
      await forward.click();
      await page.waitForTimeout(350);
    }
    const after = Number((await score.innerText()).trim());
    if (after >= 1 && after !== before) {
      await result.waitFor({ timeout: 8000 }).catch(() => {});
    }
  }

  const value = Number((await score.innerText()).trim());
  if (value < 1) {
    throw new Error(`score stayed at ${value}`);
  }
  await result.waitFor({ timeout: 1000 });

  const signIn = page.locator("#sign-in-button");
  if (await signIn.isVisible().catch(() => false)) {
    await acceptGoogleAccount(page, signIn);
  }

  await page.getByRole("button", { name: "Retry" }).waitFor({ timeout: 45000 });
};

async function acceptGoogleAccount(page, signIn) {
  const popupPromise = page.waitForEvent("popup", { timeout: 20000 }).catch(() => null);
  await signIn.click();
  const popup = await popupPromise;
  if (!popup) {
    throw new Error(
      "Google sign-in did not open. Save the test Gmail once with: npx kaloko auth save --env local --account player",
    );
  }

  const account = popup.locator("[data-identifier], [data-email]").first();
  const email = popup.locator("input[type='email']");
  const deadline = Date.now() + 25000;
  while (Date.now() < deadline) {
    if (popup.isClosed()) return;
    if (await account.isVisible().catch(() => false)) {
      await account.click();
      await popup.waitForEvent("close", { timeout: 20000 }).catch(() => {});
      return;
    }
    if (await email.isVisible().catch(() => false)) break;
    await page.waitForTimeout(300);
  }
  if (popup.isClosed()) return;

  throw new Error(
    "Google asked for an email. Save the dedicated test Gmail once with: npx kaloko auth save --env local --account player. The password stays out of git.",
  );
}
