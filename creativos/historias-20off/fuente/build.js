const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = __dirname, OUT = process.argv[2] || path.join(D, 'out');
fs.mkdirSync(OUT, { recursive: true });
const img = (f) => 'data:image/png;base64,' + fs.readFileSync(path.join(D, f)).toString('base64');
const LOGO = img('logo_crop.png'), PROD = img('prod.png'), COMENT = img('comment_card.png');

const ICON = {
  rayo: '<svg viewBox="0 0 24 24"><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" fill="currentColor"/></svg>',
  reloj: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M9 2h6"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5 9-10"/></svg>',
  flecha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M6 13l6 6 6-6"/></svg>',
  baja: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7l7 7 4-4 7 7"/><path d="M21 11v6h-6"/></svg>',
};

const BASE = (body) => `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@100..125,800..900&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=block">
<style>
*{box-sizing:border-box;margin:0;padding:0}
:root{--navy:#0B2A5B;--azul:#1E5BD6;--violeta:#7C3AED;--mag:#C2309A;--gris:#5B6B82;--amarillo:#FFE81A;--rojo:#E53935}
body{width:1080px;height:1920px;overflow:hidden;font-family:"Plus Jakarta Sans",sans-serif;color:var(--navy)}
.c{position:relative;width:1080px;height:1920px;overflow:hidden;background:linear-gradient(135deg,#F5F7FA 0%,#F5F7FA 45%,#E8EEF9 80%,#E2E9F6 100%)}
.c::after{content:"";position:absolute;right:-200px;bottom:-240px;width:700px;height:700px;border-radius:50%;background:radial-gradient(closest-side,rgba(124,58,237,.10),transparent);pointer-events:none}
.top{position:absolute;left:72px;right:72px;top:236px;display:flex;justify-content:space-between;align-items:center}
.top img{height:80px;display:block}
.pill{display:inline-flex;align-items:center;gap:10px;background:#fff;border-radius:999px;padding:16px 28px;font-weight:800;font-size:27px;box-shadow:0 10px 30px rgba(11,42,91,.10);border:1px solid #E6EBF3}
.pill svg{width:28px;height:28px;color:var(--violeta)}
.h{font-family:Archivo,sans-serif;font-weight:900;font-stretch:118%;line-height:.94;letter-spacing:-.01em;text-transform:uppercase;color:var(--navy)}
.g{background:linear-gradient(90deg,var(--azul),var(--violeta) 70%,#9B2FD6);-webkit-background-clip:text;background-clip:text;color:transparent}
.card{background:#fff;border-radius:44px;box-shadow:0 24px 60px rgba(11,42,91,.10);border:1px solid #E9EEF5}
.foot{position:absolute;left:0;right:0;bottom:250px;text-align:center;font-weight:700;font-size:28px;color:var(--gris)}
.chip{display:inline-flex;align-items:center;gap:10px;border-radius:999px;padding:12px 22px;font-weight:800;font-size:26px}
.chip svg{width:26px;height:26px}
.cta{display:flex;align-items:center;justify-content:center;gap:14px;border-radius:30px;padding:30px;background:linear-gradient(90deg,var(--azul),var(--violeta));color:#fff;font-weight:800;font-size:36px;box-shadow:0 18px 40px rgba(124,58,237,.30)}
.cta svg{width:36px;height:36px}
</style></head><body><div class="c">${body}</div></body></html>`;

const TOP = (txt) => `<div class="top"><img src="${LOGO}" alt="Velora"><span class="pill">${ICON.rayo}${txt}</span></div>`;

const S = {};

// 1 · Anuncio del 20%
S['1-hoy-20'] = TOP('Velora Cyber · Día 2 de 4') + `
<div style="position:absolute;left:72px;right:72px;top:400px">
  <div class="h" style="font-size:118px">Hoy todo<br>con <span class="g">20%</span><br><span class="g">OFF</span></div>
  <div style="margin-top:34px;font-size:38px;font-weight:700;line-height:1.35;color:var(--gris)">En todos los packs de Velora Antimoho.<br>Sin código: se aplica solo en el carrito.</div>
</div>
<div class="card" style="position:absolute;left:72px;right:72px;top:1010px;height:430px;overflow:hidden;display:flex">
  <img src="${PROD}" style="width:430px;height:100%;object-fit:cover;object-position:50% 40%">
  <div style="flex:1;padding:40px 40px;display:flex;flex-direction:column;justify-content:center;gap:22px">
    <div class="h" style="font-size:44px;font-stretch:112%">Velora<br>Antimoho</div>
    <div style="font-size:28px;font-weight:600;color:var(--gris)">Sacá el moho sin fregar</div>
    <div style="display:grid;gap:12px;font-size:26px;font-weight:800">
      <span style="display:flex;gap:10px;align-items:center"><span style="width:28px;height:28px;color:#1FA463">${ICON.check}</span>Envío gratis</span>
      <span style="display:flex;gap:10px;align-items:center"><span style="width:28px;height:28px;color:#1FA463">${ICON.check}</span>Garantía 30 días</span>
    </div>
  </div>
</div>
<div class="card" style="position:absolute;left:72px;right:72px;top:1480px;padding:30px 40px;display:flex;align-items:center;justify-content:space-between;gap:20px">
  <div style="display:flex;align-items:center;gap:16px;font-weight:800;font-size:32px"><span style="width:44px;height:44px;color:var(--violeta)">${ICON.reloj}</span>Termina hoy 23:59</div>
  <span class="chip" style="background:#FDECEC;color:var(--rojo)"><span style="width:26px;height:26px">${ICON.baja}</span>Mañana 15%</span>
</div>
<div class="foot">Velora Cyber · 2, 3, 4 y 5 de noviembre</div>`;

// 2 · Precios de hoy
const fila = (n, antes, hoy, cu, top) => `
<div class="card" style="padding:34px 40px;display:flex;align-items:center;justify-content:space-between;gap:20px;${top ? 'border:4px solid var(--violeta);box-shadow:0 24px 60px rgba(124,58,237,.22);position:relative' : ''}">
  ${top ? '<span class="chip" style="position:absolute;top:-28px;left:36px;background:linear-gradient(90deg,var(--azul),var(--violeta));color:#fff;font-size:24px;padding:10px 20px">Mejor precio por unidad</span>' : ''}
  <div><div class="h" style="font-size:52px;font-stretch:112%">Llevá ${n}</div><div style="margin-top:8px;font-size:28px;font-weight:700;color:var(--gris)">${cu} c/u</div></div>
  <div style="text-align:right"><div style="font-size:30px;font-weight:700;color:#9AA5B5;text-decoration:line-through;text-decoration-color:var(--rojo);text-decoration-thickness:3px">${antes}</div><div class="h g" style="font-size:72px;font-stretch:108%">${hoy}</div></div>
</div>`;
S['2-precios'] = TOP('Hoy 20% OFF') + `
<div style="position:absolute;left:72px;right:72px;top:400px">
  <div class="h" style="font-size:112px">Precios<br><span class="g">de hoy</span></div>
  <div style="margin-top:26px;font-size:36px;font-weight:700;color:var(--gris)">Con el 20% ya aplicado. Envío gratis.</div>
</div>
<div style="position:absolute;left:72px;right:72px;top:820px;display:grid;gap:34px">
  ${fila(2, '$53.740', '$42.992', '$21.496', false)}
  ${fila(3, '$66.240', '$52.992', '$17.664', false)}
  ${fila(5, '$91.240', '$72.992', '$14.598', true)}
</div>
<div style="position:absolute;left:72px;right:72px;top:1530px"><div class="cta">Comprá con 20% OFF <span style="width:36px;height:36px">${ICON.flecha}</span></div></div>
<div class="foot">Precios válidos hasta hoy 23:59 · Sin código</div>`;

// 3 · Escalera de días
const dia = (lab, pct, est) => {
  const hoy = est === 'hoy', pas = est === 'pasado';
  return `<div class="card" style="display:flex;align-items:center;justify-content:space-between;padding:30px 44px;${hoy ? 'background:var(--amarillo);border:3px solid #F2C200;transform:scale(1.04);box-shadow:0 24px 50px rgba(242,194,0,.35)' : pas ? 'background:#EEF2F7;box-shadow:none' : ''}">
    <div style="display:flex;align-items:center;gap:20px"><span style="font-weight:800;font-size:34px;letter-spacing:.04em;color:${pas ? '#9AA5B5' : 'var(--navy)'}">${lab}</span>${hoy ? '<span class="chip" style="background:var(--navy);color:#fff;font-size:24px;padding:8px 18px">HOY</span>' : ''}</div>
    <span class="h ${hoy || pas ? '' : 'g'}" style="position:relative;font-size:84px;font-stretch:108%;color:${pas ? '#AEB8C6' : 'var(--navy)'}">${pct}${pas ? '<i style="position:absolute;left:-10px;right:-10px;top:50%;height:7px;border-radius:4px;background:var(--rojo);transform:rotate(-10deg)"></i>' : ''}</span>
  </div>`;
};
S['3-escalera'] = TOP('Velora Cyber') + `
<div style="position:absolute;left:72px;right:72px;top:400px">
  <div class="h" style="font-size:90px">El mejor<br>precio que<br>queda <span class="g">es hoy</span></div>
</div>
<div style="position:absolute;left:72px;right:72px;top:820px;display:grid;gap:28px">
  ${dia('LUN 2/11', '30%', 'pasado')}${dia('MAR 3/11', '20%', 'hoy')}${dia('MIÉ 4/11', '15%', '')}${dia('JUE 5/11', '10%', '')}
</div>
<div style="position:absolute;left:72px;right:72px;top:1520px;text-align:center;font-size:34px;font-weight:700;line-height:1.35;color:var(--gris)">Cada día a las 00:00 el descuento baja.<br><b style="color:var(--navy)">Mañana ya es 15%.</b></div>`;

// 4 · Reseña real + oferta
S['4-resena-20'] = TOP('Clientes reales') + `
<div style="position:absolute;left:72px;right:72px;top:400px">
  <div class="h" style="font-size:100px">Lo que dicen<br>nuestros<br><span class="g">clientes</span></div>
</div>
<img src="${COMENT}" style="position:absolute;left:68px;top:790px;width:944px;border-radius:44px">
<div class="card" style="position:absolute;left:72px;right:72px;top:1150px;padding:44px;text-align:center">
  <div style="font-weight:800;font-size:30px;letter-spacing:.08em;color:var(--violeta)">SOLO HOY · VELORA CYBER</div>
  <div class="h" style="margin-top:16px;font-size:78px">Probalo con<br><span class="g">20% OFF</span></div>
  <div style="margin-top:20px;font-size:30px;font-weight:700;color:var(--gris)">Garantía 30 días · Envío gratis · Atención por WhatsApp</div>
</div>
<div style="position:absolute;left:72px;right:72px;top:1515px"><div class="cta">Termina hoy 23:59 <span style="width:36px;height:36px">${ICON.flecha}</span></div></div>
<div class="foot" style="bottom:225px">Comentario real en nuestro Instagram</div>`;

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  for (const [n, body] of Object.entries(S)) {
    await p.setContent(BASE(body), { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(250);
    await p.screenshot({ path: path.join(OUT, `velora-historia-20off-${n}.png`) });
    console.log('ok', n);
  }
  await b.close();
})();
