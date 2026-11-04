// Portada de destacada con la misma estética que las demás de @velora.argentina:
// fondo azul con degradado radial, ícono de línea blanca y un acento de color (acá, rojo).
const { chromium } = require('playwright');
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..');
const SW = 22; // grosor de línea, como los íconos de las otras portadas
const ICON = (rojoLleno) => `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#fff" stroke-width="${SW}" stroke-linecap="round" stroke-linejoin="round">
  <g><path d="M200 52v36"/><path d="M92 98l25 25"/><path d="M308 98l-25 25"/><path d="M50 210h36"/><path d="M314 210h36"/></g>
  <path d="M128 292v-70a72 72 0 0 1 144 0v70" ${rojoLleno ? 'fill="#E53935"' : ''}/>
  ${rojoLleno ? '' : '<path d="M128 292v-70a72 72 0 0 1 144 0v70z" fill="#E53935" stroke="none" opacity=".95"/>'}
  <path d="M128 292v-70a72 72 0 0 1 144 0v70"/>
  <path d="M168 226a34 34 0 0 1 24-30" stroke="#FFB4AE" stroke-width="16"/>
  <rect x="104" y="292" width="192" height="44" rx="12"/>
</svg>`;
const html = (W, H) => `<!doctype html><html><head><meta charset="utf-8"><style>
*{margin:0;padding:0}
body{width:${W}px;height:${H}px;overflow:hidden;display:grid;place-items:center;
background:radial-gradient(circle at 50% 50%, #1D4797 0%, #163A80 38%, #0F2A60 70%, #0B2150 100%)}
svg{width:${Math.round(W * .62)}px;height:${Math.round(W * .62)}px;filter:drop-shadow(0 0 40px rgba(229,57,53,.35))}
</style></head><body>${ICON(true)}</body></html>`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  for (const [n, W, H] of [['portada', 1080, 1080], ['portada-historia', 1080, 1920]]) {
    await p.setViewportSize({ width: W, height: H });
    await p.setContent(html(W, H));
    await p.screenshot({ path: path.join(OUT, `velora-destacada-urgente-${n}.png`) });
  }
  await b.close(); console.log('ok');
})();
