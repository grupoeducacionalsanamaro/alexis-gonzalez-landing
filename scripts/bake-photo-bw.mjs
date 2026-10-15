/**
 * Hornea en el archivo el mismo tratamiento que `.photo-bw`
 * (grayscale(0.9) sepia(0.08) contrast(1.05)) para el retrato del hero.
 * Un `filter` CSS sobre el elemento LCP retrasa ~1s el primer frame en Chrome mobile.
 *
 * Uso: node scripts/bake-photo-bw.mjs public/img/alexis-hero.webp public/img/alexis-hero-bw.webp
 */
import sharp from "sharp";

const [input, output] = process.argv.slice(2);
if (!input || !output) {
  console.error("Uso: node scripts/bake-photo-bw.mjs <entrada> <salida.webp>");
  process.exit(1);
}

// Matrices de la spec de Filter Effects (espacio sRGB, como las aplica Chrome)
const grayscale = (a) => {
  const k = 1 - a;
  return [
    [0.2126 + 0.7874 * k, 0.7152 - 0.7152 * k, 0.0722 - 0.0722 * k],
    [0.2126 - 0.2126 * k, 0.7152 + 0.2848 * k, 0.0722 - 0.0722 * k],
    [0.2126 - 0.2126 * k, 0.7152 - 0.7152 * k, 0.0722 + 0.9278 * k],
  ];
};
const sepia = (a) => {
  const k = 1 - a;
  return [
    [0.393 + 0.607 * k, 0.769 - 0.769 * k, 0.189 - 0.189 * k],
    [0.349 - 0.349 * k, 0.686 + 0.314 * k, 0.168 - 0.168 * k],
    [0.272 - 0.272 * k, 0.534 - 0.534 * k, 0.131 + 0.869 * k],
  ];
};
const mul = (a, b) => a.map((row) => b[0].map((_, j) => row.reduce((s, v, i) => s + v * b[i][j], 0)));

const contrast = 1.05;
await sharp(input)
  .recomb(mul(sepia(0.08), grayscale(0.9))) // primero grayscale, luego sepia
  .linear(contrast, 255 * (0.5 - 0.5 * contrast))
  .webp({ quality: 88 })
  .toFile(output);
console.log("OK →", output);
