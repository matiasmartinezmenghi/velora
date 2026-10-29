const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const dir = process.argv[2];
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.html'))) {
    await pg.goto('file://' + path.join(dir, f), { waitUntil: 'networkidle' });
    await pg.evaluate(() => document.fonts.ready);
    await pg.waitForTimeout(300);
    await pg.screenshot({ path: path.join(dir, f.replace('.html', '.png')) });
    console.log('png', f);
  }
  await b.close();
})();
