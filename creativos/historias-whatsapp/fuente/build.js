// 10 historias fijas: "escribinos por WhatsApp". Todas dejan libre la franja de abajo
// (y 1500–1680) para pegar el sticker de link a wa.me/5491133297608.
// Uso: node build.js [carpeta_salida]   ·   MOLDE=1 marca la zona del sticker.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = __dirname;
const OUT = process.argv[2] || path.join(D, '..');
const NUM = '+54 9 11 3329-7608';
const NUM_CORTO = '11 3329-7608';
const MOLDE = process.env.MOLDE === '1';
const b64 = (f, t) => `data:${t};base64,` + fs.readFileSync(path.join(D, f)).toString('base64');
const LOGO = b64('logo0.svg', 'image/svg+xml'), PROD = b64('prod.png', 'image/png'), COMENT = b64('comment_card.png', 'image/png');

const WA = '<svg viewBox="0 0 32 32"><path fill="currentColor" d="M16 3C8.8 3 3 8.7 3 15.8c0 2.5.7 4.9 2 6.9L3.2 29l6.5-1.7c1.9 1 4.1 1.6 6.3 1.6 7.2 0 13-5.7 13-12.8S23.2 3 16 3zm0 23.5c-2 0-3.9-.5-5.6-1.5l-.4-.2-3.9 1 1-3.7-.3-.4a10.4 10.4 0 0 1-1.6-5.6C5.2 10 10 5.3 16 5.3S26.8 10 26.8 15.8 22 26.5 16 26.5zm5.9-7.9c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.6.3-.5v-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.7s1.2 3.2 1.4 3.4c.2.2 2.4 3.6 5.8 5 .8.3 1.4.5 1.9.7.8.2 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z"/></svg>';
const I = {
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5 9-10"/></svg>',
  caja: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/></svg>',
  gota: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/></svg>',
  escudo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/></svg>',
  carro: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h3l2.6 12.4a2 2 0 0 0 2 1.6h8.3a2 2 0 0 0 2-1.5L22 7H6"/></svg>',
  flecha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M6 13l6 6 6-6"/></svg>',
  mano: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11V5a1.5 1.5 0 0 1 3 0v6M12 10V4a1.5 1.5 0 0 1 3 0v7M15 10.5V6a1.5 1.5 0 0 1 3 0v8a7 7 0 0 1-7 7h-.5a6 6 0 0 1-4.6-2.2L3.5 15.8a1.5 1.5 0 0 1 2.2-2L9 16V8a1.5 1.5 0 0 1 3 0"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
  rayo: '<svg viewBox="0 0 24 24"><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" fill="currentColor"/></svg>',
  tel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>',
  dobleCheck: '<svg viewBox="0 0 24 16" fill="none" stroke="#34B7F1" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m1 8 4 4 8-9M9 12l1 0 8-9"/></svg>',
};

const BASE = (body, oscuro) => `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@100..125,800..900&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=block">
<style>
*{box-sizing:border-box;margin:0;padding:0}
:root{--navy:#0B2A5B;--azul:#1E5BD6;--celeste:#3FA9F5;--gris:#5B6B82;--wa:#25D366;--wa2:#128C4A}
body{width:1080px;height:1920px;overflow:hidden;font-family:"Plus Jakarta Sans",sans-serif;color:var(--navy)}
.c{position:relative;width:1080px;height:1920px;overflow:hidden;background:linear-gradient(135deg,#F5F7FA 0%,#F5F7FA 45%,#E6EEFA 80%,#DDE8F8 100%)}
.c::after{content:"";position:absolute;right:-220px;bottom:-260px;width:760px;height:760px;border-radius:50%;background:radial-gradient(closest-side,rgba(63,169,245,.16),transparent);pointer-events:none}
.c.dark{background:radial-gradient(120% 70% at 85% 10%,#1E5BD6 0%,#0B2A5B 55%,#071B3D 100%);color:#fff}
.c.dark::after{background:radial-gradient(closest-side,rgba(37,211,102,.20),transparent)}
.top{position:absolute;left:72px;right:72px;top:236px;display:flex;justify-content:space-between;align-items:center}
.top img{height:88px;display:block}
.dark .top img{background:#fff;padding:14px 24px;border-radius:24px;height:112px}
.pill{display:inline-flex;align-items:center;gap:12px;background:#fff;color:var(--navy);border-radius:999px;padding:16px 28px;font-weight:800;font-size:27px;box-shadow:0 10px 30px rgba(11,42,91,.10);border:1px solid #E6EBF3}
.pill svg{width:30px;height:30px;color:var(--wa)}
.h{font-family:Archivo,sans-serif;font-weight:900;font-stretch:118%;line-height:.94;letter-spacing:-.01em;text-transform:uppercase}
.g{background:linear-gradient(90deg,var(--azul),var(--celeste));-webkit-background-clip:text;background-clip:text;color:transparent}
.gw{background:linear-gradient(90deg,var(--wa),#7EF0A8);-webkit-background-clip:text;background-clip:text;color:transparent}
.card{background:#fff;color:var(--navy);border-radius:44px;box-shadow:0 24px 60px rgba(11,42,91,.10);border:1px solid #E9EEF5}
.sub{font-size:38px;font-weight:700;line-height:1.35;color:var(--gris)}
.dark .sub{color:rgba(255,255,255,.78)}
.num{display:flex;align-items:center;gap:26px;border-radius:40px;padding:30px 36px;background:linear-gradient(90deg,var(--wa2),var(--wa));color:#fff;box-shadow:0 22px 48px rgba(18,140,74,.32)}
.num .ic{width:92px;height:92px;flex:none;border-radius:50%;background:rgba(255,255,255,.18);display:grid;place-items:center}
.num .ic svg{width:58px;height:58px}
.num small{display:block;font-size:26px;font-weight:700;opacity:.92}
.num b{display:block;font-family:Archivo,sans-serif;font-weight:900;font-stretch:104%;font-size:58px;line-height:1.08;white-space:nowrap}
.ok{display:flex;gap:14px;align-items:center;font-size:30px;font-weight:800}
.ok span{width:32px;height:32px;color:var(--wa2);flex:none}
.hint{position:absolute;left:0;right:0;top:1440px;display:flex;justify-content:center;align-items:center;gap:12px;font-weight:800;font-size:30px;color:var(--azul)}
.dark .hint{color:#7EF0A8}
.hint svg{width:34px;height:34px}
.zona{position:absolute;left:150px;right:150px;top:1500px;height:180px;border:3px dashed rgba(229,57,53,.6);border-radius:30px;display:grid;place-items:center;font-weight:800;font-size:26px;color:rgba(229,57,53,.8)}
</style></head><body><div class="c ${oscuro ? 'dark' : ''}">${body}</div></body></html>`;

const TOP = (txt) => `<div class="top"><img src="${LOGO}" alt="Velora"><span class="pill">${WA}${txt}</span></div>`;
const NUMERO = (top, label = 'Escribinos al') => `<div style="position:absolute;left:72px;right:72px;top:${top}px"><div class="num"><div class="ic">${WA}</div><div><small>${label}</small><b>${NUM}</b></div></div></div>`;
// Indicación + zona libre para el sticker de link
const LINK = (txt = 'Tocá el link y escribinos') => `<div class="hint">${I.mano}${txt}</div>` + (MOLDE ? '<div class="zona">zona del sticker de link</div>' : '');

const S = {};

// 01 · Aviso principal: la atención es por WhatsApp
S['01-atencion'] = [TOP('Aviso importante') + `
<div style="position:absolute;left:72px;right:72px;top:420px">
  <div class="h" style="font-size:104px">Nuestra<br>atención es<br><span class="gw">por WhatsApp</span></div>
  <div class="sub" style="margin-top:36px">Por el momento, todas las consultas,<br>pedidos y seguimientos los<br>respondemos por WhatsApp.</div>
</div>
<div style="position:absolute;left:72px;right:72px;top:1060px;display:flex;gap:16px;flex-wrap:wrap">
  ${['Consultas', 'Pedidos', 'Envíos', 'Garantía'].map(t => `<span style="display:inline-flex;align-items:center;gap:10px;padding:14px 24px;border-radius:999px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.22);font-weight:800;font-size:28px"><span style="width:26px;height:26px;color:var(--wa)">${I.check}</span>${t}</span>`).join('')}
</div>
${NUMERO(1200)}${LINK()}`, true];

// 02 · ¿Tenés una consulta? con chat
S['02-consulta'] = [TOP('Atención Velora') + `
<div style="position:absolute;left:72px;right:72px;top:420px">
  <div class="h" style="font-size:112px;color:var(--navy)">¿Tenés una<br><span class="g">consulta?</span></div>
  <div class="sub" style="margin-top:30px">Escribinos por WhatsApp y te<br>respondemos personalmente.</div>
</div>
<div style="position:absolute;left:72px;right:72px;top:870px;display:grid;gap:22px">
  <div class="card" style="justify-self:start;max-width:740px;padding:26px 32px;border-radius:36px 36px 36px 10px;font-size:31px;font-weight:600;line-height:1.35">Hola! ¿Cómo uso el Antimoho en las juntas? 🙌</div>
  <div style="justify-self:end;max-width:760px;padding:26px 32px;border-radius:36px 36px 10px 36px;background:#DCF8C6;font-size:31px;font-weight:600;line-height:1.35;box-shadow:0 16px 40px rgba(18,140,74,.14)">¡Hola! Rociás, esperás 15 minutos y pasás un paño 😊</div>
</div>
${NUMERO(1240)}${LINK()}`];

// 03 · En qué te ayudamos
const item = (ic, t, d) => `<div style="display:flex;gap:24px;align-items:center;padding:26px 32px">
  <div style="width:80px;height:80px;flex:none;border-radius:24px;background:#EAF1FD;color:var(--azul);display:grid;place-items:center"><span style="width:42px;height:42px;display:block">${ic}</span></div>
  <div><div style="font-size:34px;font-weight:800">${t}</div><div style="font-size:27px;font-weight:600;color:var(--gris);margin-top:4px">${d}</div></div></div>`;
const sep = '<div style="height:1px;background:#EEF2F7;margin:0 32px"></div>';
S['03-te-ayudamos'] = [TOP('Consultas por WhatsApp') + `
<div style="position:absolute;left:72px;right:72px;top:420px">
  <div class="h" style="font-size:80px;color:var(--navy)">Te ayudamos<br><span class="g">por WhatsApp</span></div>
</div>
<div class="card" style="position:absolute;left:72px;right:72px;top:660px;padding:8px 0">
  ${item(I.caja, 'Seguimiento de tu pedido', 'Te decimos dónde está tu envío')}${sep}
  ${item(I.gota, 'Cómo usar Velora', 'Paso a paso para cada superficie')}${sep}
  ${item(I.carro, 'Ayuda con tu compra', 'Packs, pagos y envíos')}${sep}
  ${item(I.escudo, 'Garantía 30 días', 'Cualquier problema, lo resolvemos')}
</div>
${NUMERO(1240)}${LINK()}`];

// 04 · Ícono grande + número protagonista
S['04-estamos'] = [TOP('Velora') + `
<div style="position:absolute;left:72px;right:72px;top:430px;text-align:center">
  <div style="width:210px;height:210px;margin:0 auto;border-radius:58px;background:linear-gradient(135deg,var(--wa),var(--wa2));color:#fff;display:grid;place-items:center;box-shadow:0 28px 60px rgba(18,140,74,.30)"><span style="width:136px;height:136px;display:block">${WA}</span></div>
  <div class="h" style="font-size:100px;margin-top:60px;color:var(--navy)">Estamos en<br><span class="g">WhatsApp</span></div>
  <div class="sub" style="margin-top:28px">Consultas, pedidos y seguimiento:<br>escribinos directo.</div>
</div>
<div class="card" style="position:absolute;left:72px;right:72px;top:1130px;padding:40px;text-align:center">
  <div style="font-size:28px;font-weight:700;color:var(--gris)">Nuestro número</div>
  <div class="h" style="font-size:74px;font-stretch:104%;margin-top:12px;white-space:nowrap"><span class="g">${NUM}</span></div>
  <div style="display:flex;justify-content:center;gap:30px;margin-top:22px">
    <div class="ok" style="font-size:25px"><span>${I.check}</span>Respuesta personalizada</div>
    <div class="ok" style="font-size:25px"><span>${I.check}</span>Envíos a todo el país</div>
  </div>
</div>
${LINK()}`];

// 05 · Mockup de celular con el chat de Velora
S['05-chat'] = [TOP('Hablá con nosotros') + `
<div style="position:absolute;left:72px;right:72px;top:400px;text-align:center">
  <div class="h" style="font-size:84px;color:var(--navy)">Hablá con una<br><span class="g">persona real</span></div>
</div>
<div style="position:absolute;left:150px;right:150px;top:620px;height:740px;border-radius:64px;background:#0B2A5B;padding:18px;box-shadow:0 40px 80px rgba(11,42,91,.28)">
  <div style="height:100%;border-radius:50px;overflow:hidden;background:#ECE5DD;display:flex;flex-direction:column">
    <div style="background:#075E54;color:#fff;padding:30px 30px 24px;display:flex;align-items:center;gap:20px">
      <div style="width:76px;height:76px;border-radius:50%;background:#fff;display:grid;place-items:center;overflow:hidden"><img src="${LOGO}" style="width:70px"></div>
      <div><div style="font-size:32px;font-weight:800">Velora Argentina</div><div style="font-size:23px;opacity:.85">${NUM}</div></div>
    </div>
    <div style="flex:1;padding:28px 26px;display:flex;flex-direction:column;gap:18px;font-size:27px;font-weight:600;line-height:1.35">
      <div style="align-self:flex-end;max-width:84%;background:#DCF8C6;padding:18px 22px;border-radius:24px 24px 6px 24px">Hola! Quiero saber de mi pedido 📦</div>
      <div style="align-self:flex-start;max-width:84%;background:#fff;padding:18px 22px;border-radius:24px 24px 24px 6px">¡Hola! Pasanos tu número de pedido y te decimos dónde está 😊</div>
      <div style="align-self:flex-end;max-width:84%;background:#DCF8C6;padding:18px 22px;border-radius:24px 24px 6px 24px;display:flex;align-items:flex-end;gap:10px">¡Genial, gracias! <span style="width:30px;height:20px;display:inline-block">${I.dobleCheck}</span></div>
    </div>
  </div>
</div>
${LINK()}`];

// 06 · 3 pasos
const paso = (n, t, d) => `<div class="card" style="display:flex;gap:28px;align-items:center;padding:30px 36px">
  <div class="h" style="width:96px;height:96px;flex:none;border-radius:30px;background:linear-gradient(135deg,var(--azul),var(--celeste));color:#fff;display:grid;place-items:center;font-size:54px">${n}</div>
  <div><div style="font-size:36px;font-weight:800">${t}</div><div style="font-size:28px;font-weight:600;color:var(--gris);margin-top:4px">${d}</div></div></div>`;
S['06-pasos'] = [TOP('Así de fácil') + `
<div style="position:absolute;left:72px;right:72px;top:420px">
  <div class="h" style="font-size:92px;color:var(--navy)">Escribinos<br>en <span class="g">3 pasos</span></div>
</div>
<div style="position:absolute;left:72px;right:72px;top:690px;display:grid;gap:26px">
  ${paso(1, 'Tocá el link de abajo', 'Se abre nuestro WhatsApp')}
  ${paso(2, 'Contanos tu consulta', 'Pedido, uso, envío o lo que necesites')}
  ${paso(3, 'Te respondemos', 'Una persona del equipo Velora')}
</div>
<div style="position:absolute;left:72px;right:72px;top:1290px;text-align:center;font-weight:800;font-size:32px;color:var(--navy);display:flex;justify-content:center;align-items:center;gap:12px"><span style="width:36px;height:36px;color:var(--wa)">${WA}</span>${NUM}</div>
${LINK('Paso 1: tocá acá')}`];

// 07 · Reseña real + atención
S['07-resena'] = [TOP('Clientes reales') + `
<div style="position:absolute;left:72px;right:72px;top:420px">
  <div class="h" style="font-size:96px;color:var(--navy)">Te atendemos<br><span class="g">como se debe</span></div>
  <div class="sub" style="margin-top:28px">Lo que nos dicen nuestros clientes:</div>
</div>
<div class="card" style="position:absolute;left:72px;right:72px;top:820px;padding:14px;overflow:hidden">
  <img src="${COMENT}" style="width:100%;display:block;border-radius:30px">
</div>
<div style="position:absolute;left:72px;right:72px;top:1160px;font-weight:800;font-size:32px;color:var(--navy);text-align:center">Tu consulta, por WhatsApp 👇</div>
${NUMERO(1240)}${LINK()}`];

// 08 · ¿Ya compraste? Seguimiento
const etapa = (t, on) => `<div style="display:flex;flex-direction:column;align-items:center;gap:14px;flex:1">
  <div style="width:64px;height:64px;border-radius:50%;display:grid;place-items:center;${on ? 'background:var(--wa);color:#fff' : 'background:#EEF2F7;color:#9AA5B5'}"><span style="width:32px;height:32px">${I.check}</span></div>
  <div style="font-size:24px;font-weight:800;color:${on ? 'var(--navy)' : '#9AA5B5'};text-align:center">${t}</div></div>`;
S['08-seguimiento'] = [TOP('¿Ya compraste?') + `
<div style="position:absolute;left:72px;right:72px;top:420px">
  <div class="h" style="font-size:92px;color:var(--navy)">¿Dónde está<br><span class="g">mi pedido?</span></div>
  <div class="sub" style="margin-top:28px">Mandanos tu número de pedido<br>por WhatsApp y te contamos.</div>
</div>
<div class="card" style="position:absolute;left:72px;right:72px;top:840px;padding:40px 30px">
  <div style="font-size:26px;font-weight:700;color:var(--gris);padding:0 10px 26px">Pedido #1234 · ejemplo</div>
  <div style="position:relative;display:flex">
    <div style="position:absolute;left:12%;right:12%;top:31px;height:4px;background:linear-gradient(90deg,var(--wa) 66%,#EEF2F7 66%)"></div>
    ${etapa('Confirmado', true)}${etapa('Despachado', true)}${etapa('En camino', true)}${etapa('Entregado', false)}
  </div>
</div>
${NUMERO(1240, 'Seguimiento al')}${LINK()}`];

// 09 · Producto + compra por WhatsApp
S['09-producto'] = [TOP('Atención Velora') + `
<div style="position:absolute;left:72px;right:72px;top:420px">
  <div class="h" style="font-size:90px;color:var(--navy)">Comprá o<br>consultá por<br><span class="g">WhatsApp</span></div>
</div>
<div class="card" style="position:absolute;left:72px;right:72px;top:790px;height:420px;overflow:hidden;display:flex">
  <img src="${PROD}" style="width:400px;height:100%;object-fit:cover;object-position:50% 40%">
  <div style="flex:1;padding:36px;display:flex;flex-direction:column;justify-content:center;gap:20px">
    <div class="h" style="font-size:44px;font-stretch:112%">Velora<br>Antimoho</div>
    <div style="font-size:27px;font-weight:600;color:var(--gris)">Sacá el moho sin fregar</div>
    <div style="display:grid;gap:10px">
      <div class="ok" style="font-size:26px"><span>${I.check}</span>Envío gratis</div>
      <div class="ok" style="font-size:26px"><span>${I.check}</span>Garantía 30 días</div>
    </div>
  </div>
</div>
${NUMERO(1250, 'Pedí el tuyo al')}${LINK()}`];

// 10 · Agendanos (tarjeta de contacto), versión oscura
S['10-agendanos'] = [TOP('Guardá el número') + `
<div style="position:absolute;left:72px;right:72px;top:420px">
  <div class="h" style="font-size:100px">Agendanos<br><span class="gw">en WhatsApp</span></div>
  <div class="sub" style="margin-top:30px">Así nos encontrás siempre<br>que nos necesites.</div>
</div>
<div class="card" style="position:absolute;left:72px;right:72px;top:860px;padding:44px 44px 40px">
  <div style="display:flex;align-items:center;gap:28px">
    <div style="width:130px;height:130px;flex:none;border-radius:50%;background:#F5F7FA;border:1px solid #E6EBF3;display:grid;place-items:center"><img src="${LOGO}" style="width:112px"></div>
    <div><div style="font-size:42px;font-weight:800">Velora Argentina</div><div style="font-size:27px;font-weight:600;color:var(--gris);margin-top:6px">Atención al cliente</div></div>
  </div>
  <div style="height:1px;background:#EEF2F7;margin:34px 0"></div>
  <div style="display:flex;align-items:center;gap:22px">
    <div style="width:76px;height:76px;flex:none;border-radius:22px;background:linear-gradient(135deg,var(--wa),var(--wa2));color:#fff;display:grid;place-items:center"><span style="width:46px;height:46px;display:block">${WA}</span></div>
    <div><div style="font-size:24px;font-weight:700;color:var(--gris)">WhatsApp</div><div class="h" style="font-size:56px;font-stretch:104%;white-space:nowrap;color:var(--navy)">${NUM}</div></div>
  </div>
</div>
${LINK('Tocá y escribinos ahora')}`, true];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  for (const [k, [body, dark]] of Object.entries(S)) {
    await p.setContent(BASE(body, dark), { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    // control: ningún bloque debe meterse en la zona del sticker
    const choque = await p.evaluate(() => [...document.querySelectorAll('.c > *:not(.hint):not(.zona)')]
      .filter(e => getComputedStyle(e).position === 'absolute').map(e => Math.round(e.getBoundingClientRect().bottom)).filter(y => y > 1430));
    const f = path.join(OUT, `velora-historia-whatsapp-${k}.png`);
    await p.screenshot({ path: f });
    console.log(k, choque.length ? 'CHOCA ' + choque : 'ok');
  }
  await b.close();
})();
