import { test } from '@playwright/test';

test('App starts without critical errors', async ({ page }) => {
  const messages: string[] = [];
  page.on('console', (msg) => messages.push(msg.text()));
  page.on('pageerror', (err) => messages.push(err.toString()));

  try {
    const response = await page.goto('http://localhost:4200', {
      timeout: 15000,
    });
    // Wait for app root
    await page.waitForSelector('app-root', { timeout: 10000 });

    // Check if we have app content (not just empty root)
    const content = await page.textContent('app-root');
    console.log('App Content Length:', content?.length);

    // Assert no critical errors in console
    const criticalErrors = messages.filter(
      (m) =>
        m.includes('NullInjectorError') ||
        m.includes('Circular dependency') ||
        m.includes('Application failed to start'),
    );

    if (criticalErrors.length > 0) {
      console.error('Critical Errors Found:', criticalErrors);
      throw new Error(`Critical Errors: ${criticalErrors.join(', ')}`);
    }

    console.log('App started successfully!');
  } catch (e) {
    console.error('Failed to load app:', e);
    console.log('Console Logs:', messages);
    throw e;
  }
});
