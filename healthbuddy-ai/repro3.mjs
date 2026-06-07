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
    if (msg.type() === 'error' || msg.type() === 'warning') {
      consoleMessages.push('[' + msg.type() + '] ' + msg.text());
    }
  });

  // SCENARIO 1: Fresh user, no profile
  console.log('=== SCENARIO 1: Fresh user, no profile ===');
  await page.goto('http://localhost:3003/#/login', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1000));

  // Sign up as new user
  await page.evaluate(() => {
    const emailInput = document.querySelector('input[type="email"]');
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    const nameInput = document.querySelector('input[type="text"]');
    if (emailInput) {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(emailInput, 'newuser@example.com');
      emailInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (nameInput) {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(nameInput, 'New User');
      nameInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (passwordInputs.length > 0) {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(passwordInputs[0], 'password123');
      passwordInputs[0].dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
  await new Promise((r) => setTimeout(r, 500));

  // Click "Sign Up" / submit
  await page.evaluate(() => {
    const form = document.querySelector('form');
    if (form) {
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.click();
    }
  });
  await new Promise((r) => setTimeout(r, 2000));

  console.log('URL after signup:', page.url());

  // Go to assessment
  await page.goto('http://localhost:3003/#/assessment', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1500));

  // Click a sample profile
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

  console.log('URL after submit:', page.url());

  // SCENARIO 2: Interact with the dashboard
  console.log('=== SCENARIO 2: Interact with the dashboard ===');
  // Click on the line chart
  await page.evaluate(() => {
    const svgs = document.querySelectorAll('svg');
    console.log('Found ' + svgs.length + ' SVGs');
    svgs.forEach((svg, i) => {
      const rect = svg.getBoundingClientRect();
      console.log('SVG ' + i + ': ' + rect.width + 'x' + rect.height);
    });
  });
  await new Promise((r) => setTimeout(r, 500));

  // Try navigating around
  await page.goto('http://localhost:3003/#/habits', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 2000));

  await page.goto('http://localhost:3003/#/daily-plan', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 2000));

  await page.goto('http://localhost:3003/#/coach', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 2000));

  await page.goto('http://localhost:3003/#/dashboard', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 2000));

  console.log('=== ERRORS ===');
  errors.forEach((e) => console.log(e));
  console.log('=== WARNINGS AND ERRORS IN CONSOLE ===');
  consoleMessages.forEach((m) => console.log(m));

  await browser.close();
})();
