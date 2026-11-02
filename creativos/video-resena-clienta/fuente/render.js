const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const dir = __dirname, mode = process.argv[2];
  const env = JSON.parse(fs.readFileSync(path.join(dir, 'env.json')));
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await pg.goto('file://' + path.join(dir, 'video.html'), { waitUntil: 'networkidle' });
  await pg.evaluate(() => document.fonts.ready);
  await pg.evaluate(e => window.init(e), env);
  const fps = 30, total = env.dur + 3.5;
  const times = mode === 'preview' ? [0.2, 2.5, 20, 45, env.dur + 2] : [...Array(Math.ceil(total * fps)).keys()].map(i => i / fps);
  const out = path.join(dir, mode === 'preview' ? 'prev' : 'frames'); fs.mkdirSync(out, { recursive: true });
  for (let i = 0; i < times.length; i++) {
    await pg.evaluate(t => window.render(t), times[i]);
    await pg.screenshot({ path: path.join(out, String(i).padStart(5, '0') + '.jpg'), type: 'jpeg', quality: 92 });
    if (i % 300 === 0) console.log('frame', i, '/', times.length);
  }
  await b.close();
})();
