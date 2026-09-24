"""Erzeugt public/og-bild.png (1200x630) fuer Open Graph / Twitter-Card.

Aufruf im Repo-Wurzelverzeichnis:  uv run --with pillow python scripts/erzeuge-og-bild.py
Schriften: Arial Nova (Windows). Farben: brand-800/900, sand-50 aus globals.css.
"""
import os
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
from PIL import Image, ImageDraw, ImageFont
W, H = 1200, 630
BRAND = (0x7d, 0x38, 0x18); DARK = (0x5f, 0x2c, 0x14); SAND = (0xfd, 0xf8, 0xf0); SAND2 = (0xf2, 0xe2, 0xc8); ACCENT=(0xe5,0x84,0x3a)
im = Image.new("RGB", (W, H), SAND)
d = ImageDraw.Draw(im)
# linke Markenflaeche mit sanftem Verlauf
for x in range(440):
    t = x / 440
    c = tuple(int(BRAND[i] * (1 - t) + DARK[i] * t) for i in range(3))
    d.line([(x, 0), (x, H)], fill=c)
# feiner Akzentstreifen
d.rectangle([440, 0, 452, H], fill=ACCENT)
# Logo mittig links auf weisser Rundkarte
logo = Image.open(os.path.join(ROOT, "public", "schahed-logo.png")).convert("RGBA")
size = 300
logo = logo.resize((size, int(size * logo.height / logo.width)), Image.LANCZOS)
card = Image.new("RGBA", (size + 60, logo.height + 60), (255, 255, 255, 255))
mask = Image.new("L", card.size, 0)
ImageDraw.Draw(mask).rounded_rectangle([0, 0, card.width - 1, card.height - 1], radius=36, fill=255)
cx = (440 - card.width) // 2; cy = (H - card.height) // 2
im.paste(card, (cx, cy), mask)
im.paste(logo, (cx + 30, cy + 30), logo)
# Texte rechts
bold = lambda s: ImageFont.truetype("C:/Windows/Fonts/ArialNova-Bold.ttf", s)
reg = lambda s: ImageFont.truetype("C:/Windows/Fonts/ArialNova.ttf", s)
light = lambda s: ImageFont.truetype("C:/Windows/Fonts/ArialNova-Light.ttf", s)
x0 = 510
d.text((x0, 120), "AFGHANISCHES HILFSWERK", font=reg(30), fill=(0x9c, 0x45, 0x19))
d.text((x0, 165), "Schahed e.V.", font=bold(84), fill=BRAND)
d.line([(x0, 285), (x0 + 120, 285)], fill=ACCENT, width=6)
d.text((x0, 320), "Jedes Kind verdient", font=light(56), fill=DARK)
d.text((x0, 385), "eine Zukunft.", font=light(56), fill=DARK)
d.text((x0, 490), "Patenschaften · Bildung · Gesundheit", font=reg(28), fill=(0x6b, 0x4a, 0x33))
d.text((x0, 528), "schahed.com  ·  Hamburg, seit 2012", font=reg(28), fill=(0x6b, 0x4a, 0x33))
out = os.path.join(ROOT, "public", "og-bild.png")
im.save(out, optimize=True)
print(im.size, os.path.getsize(out))
