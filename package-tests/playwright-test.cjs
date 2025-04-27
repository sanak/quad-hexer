const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  page.on('console', (msg) => console.log(msg.text()));

  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(5000); // wait for 5 seconds to see the console output

  await browser.close();
})();
