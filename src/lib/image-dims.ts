/**
 * Liest Breite und Hoehe aus den Bytes einer JPEG-, PNG- oder WebP-Datei,
 * ohne Bibliothek. Reicht fuer die Pruefung hochgeladener Fotos und fuer die
 * Bildliste der Redaktion (Startseitenbild).
 */
export type ImageInfo = { type: "jpeg" | "png" | "webp"; width: number; height: number };

export function readImageInfo(b: Uint8Array): ImageInfo | null {
  if (b.length < 30) return null;
  const dv = new DataView(b.buffer, b.byteOffset, b.byteLength);

  // PNG: 8 Byte Signatur, dann IHDR mit Breite und Hoehe (Big Endian)
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) {
    return { type: "png", width: dv.getUint32(16), height: dv.getUint32(20) };
  }

  // JPEG: Segmente bis zum ersten SOF-Marker durchlaufen
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i + 9 < b.length) {
      if (b[i] !== 0xff) return null;
      const marker = b[i + 1];
      if (marker === 0xff) { i += 1; continue; } // Fuellbyte
      if (marker === 0x01 || marker === 0xd8 || (marker >= 0xd0 && marker <= 0xd7)) { i += 2; continue; } // ohne Laenge
      if (marker === 0xd9 || marker === 0xda) return null; // Ende bzw. Bilddaten: kein SOF gefunden
      const isSof = marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
      if (isSof) return { type: "jpeg", height: dv.getUint16(i + 5), width: dv.getUint16(i + 7) };
      i += 2 + dv.getUint16(i + 2);
    }
    return null;
  }

  // WebP: "RIFF" .... "WEBP", dann Chunk VP8X / VP8 / VP8L
  const ascii = (o: number, n: number) => String.fromCharCode(...b.subarray(o, o + n));
  if (ascii(0, 4) === "RIFF" && ascii(8, 4) === "WEBP") {
    const tag = ascii(12, 4);
    if (tag === "VP8X") {
      return {
        type: "webp",
        width: 1 + (b[24] | (b[25] << 8) | (b[26] << 16)),
        height: 1 + (b[27] | (b[28] << 8) | (b[29] << 16)),
      };
    }
    if (tag === "VP8 ") {
      return { type: "webp", width: dv.getUint16(26, true) & 0x3fff, height: dv.getUint16(28, true) & 0x3fff };
    }
    if (tag === "VP8L") {
      const bits = b[21] | (b[22] << 8) | (b[23] << 16) | (b[24] << 24);
      return { type: "webp", width: (bits & 0x3fff) + 1, height: ((bits >>> 14) & 0x3fff) + 1 };
    }
  }
  return null;
}
