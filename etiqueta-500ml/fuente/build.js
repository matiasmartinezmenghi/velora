// Etiqueta Velora 500 ml · frente y dorso con la forma del envase.
// Unidades: 1 = 1 px de la foto del envase. MM_POR_U pasa a milímetros reales.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = __dirname, OUT = process.argv[2] || path.join(D, 'out');
const MM_POR_U = parseFloat(process.argv[3] || '0.15'); // estimado: 600 u = 90 mm de ancho
fs.mkdirSync(OUT, { recursive: true });
const G = JSON.parse(fs.readFileSync(path.join(D, 'geo.json')));
const b64 = (f, t) => `data:${t};base64,` + fs.readFileSync(path.join(D, f)).toString('base64');
const LOGO = b64('logo0.svg', 'image/svg+xml');
const W = 600, H = 717, PAD = 30;

const ICON = {
  check: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#1E5BD6"/><path d="m7 12.5 3.2 3.2L17 9" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  si: '<svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="#1E5BD6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  no: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="#C62828" stroke-width="3" stroke-linecap="round"/></svg>',
  aviso: '<svg viewBox="0 0 24 24"><path d="M12 3 2 20h20z" fill="#FFD21F" stroke="#0B2A5B" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 9v5" stroke="#0B2A5B" stroke-width="2.2" stroke-linecap="round"/><circle cx="12" cy="17" r="1.2" fill="#0B2A5B"/></svg>',
};

// Azulejos del antes / después (vector, sin fotos)
function azulejos(x, y, w, h, sucio, seed) {
  let s = seed; const r = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  const t = 34; let out = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${sucio ? '#E9E6DF' : '#FBFCFE'}"/>`;
  for (let gx = x; gx <= x + w; gx += t) out += `<rect x="${gx - 1.5}" y="${y}" width="3" height="${h}" fill="${sucio ? '#2B2A28' : '#D9E2EC'}"/>`;
  for (let gy = y; gy <= y + h; gy += t) out += `<rect x="${x}" y="${gy - 1.5}" width="${w}" height="3" fill="${sucio ? '#2B2A28' : '#D9E2EC'}"/>`;
  if (sucio) for (let i = 0; i < 260; i++) { const rr = r() * 2.6 + 0.6; out += `<circle cx="${(x + r() * w).toFixed(1)}" cy="${(y + r() * h).toFixed(1)}" r="${rr.toFixed(1)}" fill="rgba(25,24,22,${(0.35 + r() * 0.5).toFixed(2)})"/>`; }
  return out;
}

const PH = (t) => `<span class="ph">${t}</span>`; // dato a completar antes de imprimir

const BASE = (lado, cuerpo, svgFondo, opts) => `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:ital,wdth,wght@1,100..125,800..900&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=IBM+Plex+Mono:wght@500;600&display=block">
<style>
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W + PAD * 2}px;height:${H + PAD * 2}px;background:${opts.transparente ? 'transparent' : '#E7EAEE'};overflow:hidden}
.st{position:absolute;left:${PAD}px;top:${PAD}px;width:${W}px;height:${H}px}
.arte{position:absolute;inset:0;clip-path:path('${opts.clip}');background:#fff;font-family:"Plus Jakarta Sans",sans-serif;color:#0B2A5B}
.arte>*{position:absolute}
.h{font-family:Archivo,sans-serif;font-style:italic;font-weight:900;font-stretch:112%;line-height:.92;letter-spacing:-.01em;text-transform:uppercase;white-space:nowrap}
.mono{font-family:"IBM Plex Mono",monospace}
.ph{color:#B23AE0;border-bottom:1px dashed #B23AE0}
.chk{display:flex;align-items:center;gap:8px;font-size:15px;font-weight:600;white-space:nowrap}
.chk svg{width:18px;height:18px;flex:none}
.chk b{font-weight:800}
.paso{display:flex;align-items:center;gap:10px;font-size:14.5px;font-weight:600;white-space:nowrap}
.paso i{flex:none;width:26px;height:26px;border-radius:50%;background:#1E5BD6;color:#fff;font:italic 900 15px/26px Archivo,sans-serif;text-align:center}
.caja{border-radius:14px;padding:12px 14px;background:#EEF3FA}
.caja h4{font-size:11px;font-weight:800;letter-spacing:.12em;margin-bottom:7px}
.caja li{list-style:none;display:flex;align-items:center;gap:6px;font-size:13px;font-weight:600;line-height:1.55}
.caja li svg{width:14px;height:14px;flex:none}
.legal{font-size:10.5px;line-height:1.45;font-weight:500;color:#33475F}
.legal b{font-weight:800;color:#0B2A5B}
</style></head><body><div class="st">
<div class="arte">
<svg style="left:-${PAD}px;top:-${PAD}px;overflow:visible" width="${W + PAD * 2}" height="${H + PAD * 2}" viewBox="-${PAD} -${PAD} ${W + PAD * 2} ${H + PAD * 2}">
<defs>
 <linearGradient id="g1" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0B2A5B"/><stop offset="1" stop-color="#1E5BD6"/></linearGradient>
 <path id="pAbajo" d="${G[lado].abajo}" transform="translate(0,-19)"/>
</defs>
<path d="${G[lado].arriba}" fill="none" stroke="url(#g1)" stroke-width="44"/>
<path d="${G[lado].arriba}" transform="translate(0,27)" fill="none" stroke="#3FA9F5" stroke-width="4"/>
${svgFondo}
<path d="${G[lado].abajo}" fill="none" stroke="#0B2A5B" stroke-width="64"/>
<text font-family="Plus Jakarta Sans" font-weight="800" font-size="12.5" letter-spacing="1.4" fill="#fff"><textPath href="#pAbajo" startOffset="50%" text-anchor="middle">${opts.textoAbajo}</textPath></text>
</svg>
${cuerpo}
</div>
${opts.troquel ? `<svg style="position:absolute;left:-${PAD}px;top:-${PAD}px;overflow:visible" width="${W + PAD * 2}" height="${H + PAD * 2}" viewBox="-${PAD} -${PAD} ${W + PAD * 2} ${H + PAD * 2}">
 <path d="${G[lado].sangrado}" fill="none" stroke="#9AA5B5" stroke-width="1" stroke-dasharray="2 3"/>
 <path d="${G[lado].troquel}" fill="none" stroke="#E5007E" stroke-width="1.6"/>
 <path d="${G[lado].segura}" fill="none" stroke="#00A3E0" stroke-width="1" stroke-dasharray="5 4"/>
</svg>` : ''}
</div></body></html>`;

// ---------- FRENTE ----------
const frenteFondo = `
<rect x="-40" y="300" width="680" height="42" fill="#3FA9F5"/>
<clipPath id="pan"><rect x="22" y="354" width="556" height="128" rx="14"/></clipPath>
<g clip-path="url(#pan)">${azulejos(22, 354, 278, 128, true, 7)}${azulejos(300, 354, 278, 128, false, 3)}<rect x="298.5" y="354" width="3" height="128" fill="#fff"/></g>`;
const frente = `
<img src="${LOGO}" style="left:292px;top:90px;width:216px" alt="">
<div class="h" style="right:58px;top:170px;font-size:49px;text-align:right">Removedor</div>
<div class="h" style="right:52px;top:224px;font-size:49px;text-align:right">de moho</div>
<div style="left:0;right:0;top:300px;height:42px;display:flex;align-items:center;justify-content:center;padding-left:40px;font-weight:800;font-size:19px;letter-spacing:.06em">SACA EL MOHO SIN FREGAR</div>
<span style="left:34px;top:366px;background:#0B2A5B;color:#fff;font-weight:800;font-size:11px;letter-spacing:.1em;padding:5px 10px;border-radius:999px">ANTES</span>
<span style="right:34px;top:366px;background:#1E5BD6;color:#fff;font-weight:800;font-size:11px;letter-spacing:.1em;padding:5px 10px;border-radius:999px">DESPUÉS</span>
<div style="left:256px;top:374px;width:88px;height:88px;border-radius:50%;background:#1E5BD6;border:4px solid #fff;box-shadow:0 4px 12px rgba(11,42,91,.3);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1">
  <span style="font-size:8.5px;font-weight:800;letter-spacing:.12em">GARANTÍA</span><span style="font:900 32px/1 Archivo,sans-serif;margin:2px 0">30</span><span style="font-size:8.5px;font-weight:800;letter-spacing:.12em">DÍAS</span></div>
<div style="left:26px;top:494px;display:grid;gap:7px">
  <div class="chk">${ICON.check}<span><b>Juntas y silicona:</b> donde la lavandina no llega</span></div>
  <div class="chk">${ICON.check}<span><b>Paredes, techos</b> y azulejos</span></div>
  <div class="chk">${ICON.check}<span><b>Sin fregar:</b> rociás, esperás y pasás un paño</span></div>
  <div class="chk">${ICON.check}<span><b>Antes de pintar</b> o cambiar la silicona, probalo</span></div>
</div>
<div class="h" style="left:26px;top:604px;font-size:34px;font-style:normal;font-stretch:100%">500<span style="font-size:20px;text-transform:none"> ml</span></div>
<div style="left:132px;top:603px;font-size:10px;line-height:1.35;font-weight:700;color:#33475F"><b style="font-weight:800;letter-spacing:.1em;color:#0B2A5B">USO DOMÉSTICO</b><br>Ventilá y usá guantes<br>Precauciones al dorso</div>`;

// ---------- DORSO ----------
const pasos = [
  ['Abrí la ventana y ponete guantes.', 100],
  ['Rociá a 20 cm, hasta cubrir la mancha.', 86],
  ['Esperá 15 minutos. No hace falta fregar.', 74],
  ['Pasá un paño húmedo y dejá ventilar.', 63],
];
const dorsoFondo = '';
const dorso = `
<div class="h" style="left:122px;top:116px;font-size:28px">Cómo se usa</div>
${pasos.map(([t, x], i) => `<div class="paso" style="left:${x}px;top:${162 + i * 38}px"><i>${i + 1}</i>${t}</div>`).join('')}
<div class="caja" style="left:22px;top:322px;width:262px;height:138px"><h4 style="color:#1E5BD6">DÓNDE USARLO</h4><ul>
 <li>${ICON.si}Paredes y techos</li><li>${ICON.si}Azulejos y juntas</li><li>${ICON.si}Silicona de baño y cocina</li><li>${ICON.si}Marcos de ventana</li></ul></div>
<div class="caja" style="left:294px;top:336px;width:236px;height:126px;background:#FDF0F0"><h4 style="color:#C62828">NO USAR EN</h4><ul>
 <li>${ICON.no}Mármol</li><li>${ICON.no}Madera</li><li>${ICON.no}Telas de color</li></ul>
 <p style="margin-top:6px;font-size:11px;font-weight:600;color:#7A4A4A;line-height:1.35">Probalo antes en una zona oculta.</p></div>
<div class="legal" style="left:150px;top:474px;width:428px;display:flex;gap:8px;font-size:9.6px;line-height:1.42"><span style="flex:none;width:22px;height:22px">${ICON.aviso}</span><p>
 <b>PRECAUCIONES.</b> Contiene hipoclorito de sodio. Irritante para ojos y piel. <b>No mezclar con otros limpiadores ni ácidos.</b> Mantener fuera del alcance de los niños. Usar con ventilación y guantes. No ingerir.
 <b>PRIMEROS AUXILIOS:</b> contacto con ojos o piel, lavar con abundante agua 15 min. Ingestión: no provocar el vómito y consultar al médico. Centro de intoxicaciones: ${PH('[teléfono]')}</p></div>
<div class="legal" style="right:24px;top:566px;text-align:right;font-size:9.6px;line-height:1.5">
 <p><b>Elaborado por:</b> ${PH('[razón social y dirección]')}</p>
 <p><b>Composición:</b> ${PH('[completar]')}</p>
 <p><b>Reg. ANMAT/RNPUD N.º</b> ${PH('[completar]')}</p>
 <p class="mono" style="font-size:9.6px">Lote ______ · Venc. __/____</p>
 <p><b>Cont. neto 500 ml</b></p></div>`;

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: W + PAD * 2, height: H + PAD * 2 }, deviceScaleFactor: 3 });
  const casos = [
    ['frente', frente, frenteFondo, 'velorargentina.com  ·  Garantía 30 días  ·  Envío a todo el país'],
    ['dorso', dorso, dorsoFondo, `Garantía 30 días  ·  WhatsApp ${'[número]'}  ·  velorargentina.com`],
  ];
  for (const [lado, cuerpo, fondo, txt] of casos) {
    for (const v of ['troquel', 'limpio', 'mockup', 'imprenta']) {
      const opts = { textoAbajo: txt, troquel: v === 'troquel', transparente: v === 'mockup' || v === 'imprenta',
        clip: v === 'imprenta' ? G[lado].sangrado : G[lado].troquel };
      await p.setContent(BASE(lado, cuerpo, fondo, opts), { waitUntil: 'networkidle' });
      await p.evaluate(() => document.fonts.ready);
      await p.waitForTimeout(200);
      if (v === 'imprenta') {
        const wmm = ((W + PAD * 2) * MM_POR_U).toFixed(2), hmm = ((H + PAD * 2) * MM_POR_U).toFixed(2);
        await p.emulateMedia({ media: 'screen' });
        await p.addStyleTag({ content: `@page{size:${wmm}mm ${hmm}mm;margin:0} html,body{zoom:${(MM_POR_U * 96 / 25.4).toFixed(5)}}` });
        await p.pdf({ path: path.join(OUT, `etiqueta-${lado}-imprenta.pdf`), width: wmm + 'mm', height: hmm + 'mm', printBackground: true, pageRanges: '1' });
      } else {
        await p.screenshot({ path: path.join(OUT, `etiqueta-${lado}-${v}.png`), omitBackground: v === 'mockup' });
      }
      console.log('ok', lado, v);
    }
  }
  await b.close();
})();
