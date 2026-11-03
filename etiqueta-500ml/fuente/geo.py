# Genera los contornos de la etiqueta (troquel, sangrado y zona segura) en unidades de diseño.
# 1 unidad = 1 px de la foto 14.webp. Se escala a mm cuando tengamos la medida real.
import json, pathlib
from shapely.geometry import Polygon

D = pathlib.Path(__file__).parent
exec((D / "die.py").read_text())
X0, Y0 = 259, 648
die = Polygon([(x - X0, y - Y0) for x, y in POLY]).buffer(0)
die = die.simplify(0.4)


def path(poly, mirror=False, W=600):
    pts = list(poly.exterior.coords)
    if mirror:
        pts = [(W - x, y) for x, y in pts]
    return "M" + " L".join(f"{x:.2f},{y:.2f}" for x, y in pts) + " Z"


out = {}
for lado, m in (("frente", False), ("dorso", True)):
    out[lado] = {
        "troquel": path(die, m),
        "sangrado": path(die.buffer(14, join_style=1), m),
        "segura": path(die.buffer(-12, join_style=1), m),
    }
minx, miny, maxx, maxy = die.bounds
out["bounds"] = [minx, miny, maxx, maxy]
(D / "geo.json").write_text(json.dumps(out))
print("ok", [round(v, 1) for v in die.bounds])

# Bordes superior e inferior (para la banda y el texto curvo)
loc = [(x - X0, y - Y0) for x, y in POLY]
top = loc[0:61]                 # de izquierda-abajo a derecha-arriba
bottom = list(reversed(loc[130:201]))  # de izquierda a derecha
def pl(pts, mirror=False, W=600):
    if mirror:
        pts = [(W - x, y) for x, y in reversed(pts)]
    return "M" + " L".join(f"{x:.2f},{y:.2f}" for x, y in pts)
for lado, m in (("frente", False), ("dorso", True)):
    out[lado]["arriba"] = pl(top, m)
    out[lado]["abajo"] = pl(bottom, m)
(D / "geo.json").write_text(json.dumps(out))
print("bordes ok", top[0], top[-1], bottom[0], bottom[-1])
