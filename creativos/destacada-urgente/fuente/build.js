// Portada de historia destacada "urgente": sirena roja al centro, colores Velora.
const { chromium } = require('playwright');
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..');
const SIRENA = `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
<defs>
  <radialGradient id="glow" cx="50%" cy="48%" r="50%"><stop offset="0" stop-color="#FF3B30" stop-opacity=".55"/><stop offset="1" stop-color="#FF3B30" stop-opacity="0"/></radialGradient>
  <linearGradient id="domo" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FF6B5E"/><stop offset=".55" stop-color="#E53935"/><stop offset="1" stop-color="#B71C1C"/></linearGradient>
  <linearGradient id="base" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1E5BD6"/><stop offset="1" stop-color="#0B2A5B"/></linearGradient>
</defs>
<circle cx="200" cy="200" r="190" fill="url(#glow)"/>
<g stroke="#FF3B30" stroke-width="16" stroke-linecap="round">
  <path d="M200 38v34"/><path d="M86 86l24 24"/><path d="M314 86l-24 24"/><path d="M44 196h34"/><path d="M322 196h34"/>
</g>
<path d="M120 286V214a80 80 0 0 1 160 0v72z" fill="url(#domo)"/>
<path d="M150 214a50 50 0 0 1 34-47" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="14" stroke-linecap="round"/>
<rect x="96" y="282" width="208" height="46" rx="16" fill="url(#base)"/>
<rect x="120" y="296" width="160" height="8" rx="4" fill="#3FA9F5" opacity=".7"/>
</svg>`;
const page = (W, H, dark) => `<!doctype html><html><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:${W}px;height:${H}px;overflow:hidden;display:grid;place-items:center;
background:${dark ? 'radial-gradient(90% 60% at 50% 45%,#1E5BD6 0%,#0B2A5B 60%,#071B3D 100%)' : 'radial-gradient(90% 60% at 50% 45%,#FFFFFF 0%,#F1F5FB 55%,#DDE8F8 100%)'}}
.d{width:${Math.round(W * .62)}px;height:${Math.round(W * .62)}px;border-radius:50%;display:grid;place-items:center;
background:${dark ? 'rgba(255,255,255,.06)' : '#fff'};box-shadow:${dark ? 'inset 0 0 0 6px rgba(255,255,255,.12)' : '0 30px 70px rgba(11,42,91,.14), inset 0 0 0 6px #EAF1FD'}}
.d svg{width:78%;height:78%}
</style></head><body><div class="d">${SIRENA}</div></body></html>`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  for (const [n, W, H, dark] of [['clara-cuadrada', 1080, 1080, 0], ['oscura-cuadrada', 1080, 1080, 1], ['clara-historia', 1080, 1920, 0], ['oscura-historia', 1080, 1920, 1]]) {
    await p.setViewportSize({ width: W, height: H });
    await p.setContent(page(W, H, dark));
    await p.screenshot({ path: path.join(OUT, `velora-destacada-urgente-${n}.png`) });
  }
  await b.close(); console.log('ok');
})();
