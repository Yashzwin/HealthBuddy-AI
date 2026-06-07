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

  // Set up a regular user (not guest) and existing profile
  await page.evaluateOnNewDocument(() => {
    const user = {
      id: 'user-realuser',
      name: 'Real User',
      email: 'real@example.com',
      role: 'user',
    };
    localStorage.setItem('healthbuddy_session_user', JSON.stringify(user));

    const profile = {
      id: 'profile-existing',
      userId: 'user-realuser',
      age: 25,
      lifeStage: 'Young Adult',
      name: 'Real User',
      dailySleepHours: 7,
      dailyWaterIntake: 6,
      dailyScreenTime: 4,
      dailyStudyHours: 0,
      dailyWorkSittingHours: 0,
      activityLevel: 'moderate',
      sportsExerciseLevel: 'moderate',
      postureConcer: 2,
      stressLevel: 3,
      breakFrequency: 'sometimes',
      mealRegularity: 'somewhat regular',
      outdoorTimeHours: 1,
      mobilityLevel: 'full',
      caregiverContext: '',
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    };
    localStorage.setItem('healthbuddy_user_profiles', JSON.stringify([profile]));
  });

  // Go directly to the dashboard
  await page.goto('http://localhost:3000/#/dashboard', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 5000));

  // Try to interact with the dashboard
  // Click the line chart points
  await page.evaluate(() => {
    const svg = document.querySelector('svg');
    if (svg) {
      const circles = svg.querySelectorAll('circle');
      console.log('Found ' + circles.length + ' circles in first SVG');
    }
  });

  // Try to navigate around
  await page.goto('http://localhost:3000/#/habits', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 3000));

  await page.goto('http://localhost:3000/#/daily-plan', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 3000));

  await page.goto('http://localhost:3000/#/coach', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 3000));

  console.log('=== ERRORS ===');
  errors.forEach((e) => console.log(e));
  console.log('=== WARNINGS AND ERRORS IN CONSOLE ===');
  consoleMessages.filter((m) => m.startsWith('[warn]') || m.startsWith('[error]')).forEach((m) => console.log(m));

  await browser.close();
})();
