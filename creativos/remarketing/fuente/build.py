import base64, pathlib, sys

D = pathlib.Path(__file__).parent
OUT = pathlib.Path(sys.argv[1])
OUT.mkdir(parents=True, exist_ok=True)

def b64(p):
    return "data:image/png;base64," + base64.b64encode((D / p).read_bytes()).decode()

PROD = b64("prod.png")

ICON = {
    "shield": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>',
    "truck": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
    "spark": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.9 5.8L20 10l-6.1 1.2L12 17l-1.9-5.8L4 10l6.1-1.2z"/></svg>',
    "chat": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.4A8 8 0 1 1 21 12z"/></svg>',
    "check": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5 9-10"/></svg>',
}

BASE = """
<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:ital,wdth,wght@0,100..125,700..900;1,100..125,700..900&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=block">
<style>
*{box-sizing:border-box;margin:0;padding:0}
:root{--navy:#0B2A5B;--blue:#1E5BD6;--sky:#3FA9F5;--mist:#EEF3FA;--yellow:#FFD21F;--red:#E2342B}
body{width:1080px;height:1350px;overflow:hidden;font-family:"Plus Jakarta Sans",sans-serif;color:var(--navy);background:#fff}
.c{position:relative;width:1080px;height:1350px;overflow:hidden}
.h{font-family:Archivo,sans-serif;font-style:italic;font-weight:900;font-stretch:112%;line-height:.95;letter-spacing:-.01em;text-transform:uppercase}
.sub{font-weight:700;color:var(--blue)}
.photo{position:absolute;overflow:hidden;border-radius:36px;box-shadow:0 24px 60px rgba(11,42,91,.18)}
.photo img{width:100%;height:100%;object-fit:cover;display:block}
.badge{position:absolute;background:var(--navy);border-radius:28px;color:#fff;text-align:center;padding:18px 30px 16px;box-shadow:0 14px 34px rgba(11,42,91,.3)}
.badge b{display:block;font-family:Archivo;font-style:italic;font-weight:900;font-size:110px;line-height:.9;color:var(--yellow)}
.badge span{font-weight:800;font-size:27px;letter-spacing:.02em;display:flex;align-items:center;gap:8px;justify-content:center}
.badge svg{width:30px;height:30px}
.band{position:absolute;left:0;right:0;bottom:0;height:118px;background:var(--navy);display:flex;align-items:center;justify-content:space-around;color:#fff;font-weight:800;font-size:27px}
.band div{display:flex;align-items:center;gap:12px}
.band svg{width:34px;height:34px;color:var(--sky)}
.band i{width:2px;height:46px;background:rgba(255,255,255,.25)}
.card{position:absolute;background:#fff;border-radius:28px;box-shadow:0 18px 44px rgba(11,42,91,.2);padding:26px 34px}
.seal{position:absolute;width:210px;height:210px;border-radius:50%;background:var(--blue);color:#fff;display:grid;place-items:center;text-align:center;border:8px solid #fff;box-shadow:0 14px 34px rgba(11,42,91,.3)}
.seal small{display:block;font-weight:800;font-size:20px;letter-spacing:.12em}
.seal b{display:block;font-family:Archivo;font-weight:900;font-size:86px;line-height:.9}
.pill{display:inline-block;border-radius:99px;font-weight:800;font-size:24px;letter-spacing:.12em;text-transform:uppercase;padding:10px 22px}
</style></head><body><div class="c">%s</div></body></html>
"""

def band(items):
    parts = []
    for i, (ic, t) in enumerate(items):
        if i: parts.append("<i></i>")
        parts.append(f'<div>{ICON[ic]}{t}</div>')
    return f'<div class="band">{"".join(parts)}</div>'

BAND = band([("shield", "Garantía 30 días"), ("truck", "Envío gratis"), ("spark", "Sin fregar")])
BADGE = f'<div class="badge" style="top:60px;right:56px"><b>2x1</b><span>+ ENVÍO GRATIS {ICON["truck"]}</span></div>'

S = {}

# 2 · Miedo a que no funcione
S["2-garantia"] = f"""
<div style="position:absolute;inset:0;background:linear-gradient(180deg,#fff 0%,var(--mist) 100%)"></div>
<div style="position:absolute;left:64px;top:70px;width:640px">
  <span class="pill" style="background:var(--navy);color:#fff">Garantía Velora</span>
  <div class="h" style="font-size:78px;margin-top:24px">¿Y si no<br>te funciona?</div>
  <div class="sub" style="font-size:42px;margin-top:18px;line-height:1.15">Te devolvemos la plata.</div>
</div>
{BADGE}
<div class="photo" style="left:64px;top:500px;width:600px;height:620px"><img src="{PROD}"></div>
<div class="seal" style="left:560px;top:440px"><div><small>GARANTÍA</small><b>30</b><small>DÍAS</small></div></div>
<div style="position:absolute;left:712px;top:690px;width:320px;display:grid;gap:30px">
  <div style="display:grid;grid-template-columns:58px 1fr;gap:16px;align-items:center"><div style="width:58px;height:58px;border-radius:50%;background:var(--blue);color:#fff;display:grid;place-items:center;font:900 30px Archivo">1</div><div style="font-weight:700;font-size:28px;line-height:1.2">Lo probás en tu casa</div></div>
  <div style="display:grid;grid-template-columns:58px 1fr;gap:16px;align-items:center"><div style="width:58px;height:58px;border-radius:50%;background:var(--blue);color:#fff;display:grid;place-items:center;font:900 30px Archivo">2</div><div style="font-weight:700;font-size:28px;line-height:1.2">Si no te sirve, nos escribís</div></div>
  <div style="display:grid;grid-template-columns:58px 1fr;gap:16px;align-items:center"><div style="width:58px;height:58px;border-radius:50%;background:var(--blue);color:#fff;display:grid;place-items:center;font:900 30px Archivo">3</div><div style="font-weight:700;font-size:28px;line-height:1.2">Te devolvemos la plata</div></div>
</div>
{band([("shield","Garantía 30 días"),("truck","Envío gratis"),("chat","Atención por WhatsApp")])}
"""

# 3 · Precio
S["3-precio"] = f"""
<div style="position:absolute;inset:0;background:#fff"></div>
<div style="position:absolute;left:0;right:0;top:0;height:520px;background:var(--navy)"></div>
<div style="position:absolute;left:64px;top:76px;width:620px;color:#fff">
  <div style="font-weight:800;font-size:28px;letter-spacing:.14em;color:var(--sky)">LLEVÁS 2 SPRAYS</div>
  <div class="h" style="font-size:118px;margin-top:14px;color:#fff">$24.995</div>
  <div class="h" style="font-size:58px;color:var(--yellow);margin-top:6px">cada uno</div>
</div>
<div class="badge" style="top:76px;right:56px;background:var(--yellow)"><b style="color:var(--navy)">2x1</b><span style="color:var(--navy)">+ ENVÍO GRATIS {ICON["truck"]}</span></div>
<div class="photo" style="left:64px;top:430px;width:952px;height:560px"><img src="{PROD}" style="object-position:50% 35%"></div>
<div style="position:absolute;left:64px;right:64px;top:1030px;text-align:center">
  <div class="h" style="font-size:52px">Antes de pintar o cambiar<br>la silicona, probalo.</div>
  <div class="sub" style="font-size:30px;margin-top:16px">2 sprays por $49.990 · Garantía 30 días</div>
</div>
{BAND}
"""

# 4 · Cómo se usa
step = lambda n, t, s: f'<div style="background:#fff;border-radius:26px;padding:24px 22px;box-shadow:0 12px 30px rgba(11,42,91,.12);text-align:center"><div style="width:72px;height:72px;margin:0 auto 14px;border-radius:50%;background:var(--blue);color:#fff;display:grid;place-items:center;font:italic 900 40px Archivo">{n}</div><div class="h" style="font-size:40px">{t}</div><div style="font-weight:600;font-size:22px;margin-top:8px;color:#4B5A6E">{s}</div></div>'
S["4-como-se-usa"] = f"""
<div style="position:absolute;inset:0;background:var(--mist)"></div>
<div style="position:absolute;left:64px;top:70px;width:620px">
  <span class="pill" style="background:#fff;color:var(--blue)">Así de fácil</span>
  <div class="h" style="font-size:118px;margin-top:22px">Sin<br>fregar.</div>
</div>
{BADGE}
<div class="photo" style="left:64px;top:400px;width:952px;height:520px"><img src="{PROD}" style="object-position:50% 30%"></div>
<div style="position:absolute;left:64px;right:64px;top:950px;display:grid;grid-template-columns:repeat(3,1fr);gap:22px">
  {step(1,"Rociás","sobre la mancha")}{step(2,"Esperás","15 minutos")}{step(3,"Pasás","un paño húmedo")}
</div>
{band([("check","Juntas y silicona"),("check","Paredes y techos"),("check","Azulejos")])}
"""

# 5 · Carrito
S["5-carrito"] = f"""
<div style="position:absolute;inset:0;background:linear-gradient(180deg,var(--mist) 0%,#fff 60%)"></div>
<div style="position:absolute;left:64px;top:72px;width:640px">
  <div style="display:flex;align-items:center;gap:14px;font-weight:800;font-size:26px;letter-spacing:.1em;color:var(--blue)"><svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1.5"/><circle cx="19" cy="21" r="1.5"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>TE GUARDAMOS EL CARRITO</div>
  <div class="h" style="font-size:80px;margin-top:22px">Tu Velora<br>sigue acá.</div>
</div>
{BADGE}
<div class="photo" style="left:64px;top:410px;width:952px;height:560px"><img src="{PROD}" style="object-position:50% 35%"></div>
<div class="card" style="left:64px;right:64px;top:1000px;display:flex;align-items:center;justify-content:space-between;gap:20px;padding:24px 30px">
  <div><div style="font-weight:800;font-size:30px">Pagá 1, llevá 2</div><div class="sub" style="font-size:24px;margin-top:4px">$49.990 · $24.995 cada uno</div></div>
  <div style="background:var(--blue);color:#fff;border-radius:18px;padding:22px 32px;font-weight:800;font-size:28px;white-space:nowrap">Terminá tu compra →</div>
</div>
{BAND}
"""

# 6 · Cyber día 1
S["6-cyber-dia1"] = f"""
<div style="position:absolute;inset:0;background:radial-gradient(120% 80% at 50% 0%,#14408A 0%,var(--navy) 60%)"></div>
<div style="position:absolute;left:64px;right:64px;top:64px;color:#fff">
  <div style="display:flex;justify-content:space-between;align-items:center">
    <div class="h" style="font-size:60px">Velora <span style="color:var(--yellow)">Cyber</span></div>
    <span class="pill" style="background:var(--yellow);color:var(--navy)">Lunes 2/11</span>
  </div>
  <div class="h" style="font-size:84px;margin-top:40px">Te quedaste<br>mirando.</div>
  <div class="h" style="font-size:84px;color:var(--yellow);margin-top:8px">Hoy está 20%<br>más barato.</div>
</div>
<div class="photo" style="left:64px;top:560px;width:600px;height:540px;box-shadow:0 24px 60px rgba(0,0,0,.35)"><img src="{PROD}"></div>
<div style="position:absolute;left:690px;right:64px;top:560px;display:grid;gap:18px">
  <div class="card" style="position:relative;padding:22px 26px"><div style="font-weight:800;font-size:24px">Llevá 2</div><div style="font-size:22px;color:#6B7684;text-decoration:line-through">$49.990</div><div class="h" style="font-size:54px;color:var(--blue)">$39.992</div></div>
  <div class="card" style="position:relative;padding:22px 26px;outline:5px solid var(--yellow)"><div style="font-weight:800;font-size:24px">Llevá 5 · el mejor precio</div><div style="font-size:22px;color:#6B7684;text-decoration:line-through">$79.990</div><div class="h" style="font-size:54px;color:var(--blue)">$63.992</div><div style="font-weight:800;font-size:22px;margin-top:4px">$12.798 c/u</div></div>
</div>
<div style="position:absolute;left:64px;right:64px;top:1160px;color:#fff;font-weight:700;font-size:30px;text-align:center">Mañana baja a 15% · Envío gratis · Garantía 30 días</div>
"""

for name, body in S.items():
    (OUT / f"velora-remarketing-{name}.html").write_text(BASE.replace("%s", body), encoding="utf-8")
    print("html", name)
