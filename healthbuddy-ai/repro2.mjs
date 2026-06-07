import puppeteer from 'puppeteer-core';

const errors = [];
const consoleMessages = [];

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();

  page.on('pageerror', (err) => {
    errors.push('PAGEERROR: ' + err.message);
  });
  page.on('console', (msg) => {
    consoleMessages.push('[' + msg.type() + '] ' + msg.text());
  });

  // Pre-set localStorage
  await page.evaluateOnNewDocument(() => {
    const user = {
      id: 'user-test123',
      name: 'Test User',
      email: 'test@example.com',
      role: 'user',
    };
    localStorage.setItem('healthbuddy_session_user', JSON.stringify(user));
  });

  // Load the production build
  await page.goto('http://localhost:3003/', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1000));

  // Go to login page, then guest login
  await page.goto('http://localhost:3003/#/login', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1000));

  // Guest login
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const guestBtn = buttons.find((b) => b.textContent.includes('Continue as Guest'));
    if (guestBtn) guestBtn.click();
  });
  await new Promise((r) => setTimeout(r, 2000));

  console.log('=== URL AFTER GUEST LOGIN ===');
  console.log(page.url());

  // Go to assessment
  await page.goto('http://localhost:3003/#/assessment', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 2000));

  // Click "School Student" sample
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const sampleBtn = buttons.find((b) => b.textContent.includes('School Student'));
    if (sampleBtn) sampleBtn.click();
  });
  await new Promise((r) => setTimeout(r, 500));

  // Submit
  await page.evaluate(() => {
    const form = document.querySelector('form');
    if (form) {
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.click();
    }
  });
  await new Promise((r) => setTimeout(r, 5000));

  console.log('=== URL AFTER SUBMIT ===');
  console.log(page.url());

  console.log('=== ERRORS ===');
  errors.forEach((e) => console.log(e));
  console.log('=== ALL CONSOLE ===');
  consoleMessages.forEach((m) => console.log(m));

  await browser.close();
})();
