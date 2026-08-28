const hexes = {
  canvas: "#F9F9FB",
  panel: "#F4F4F5",
  surface: "#FFFFFF",
  fg: "#18181B",
  fgMuted: "#71717A",
  border: "#E8E8EC",
  hover: "#F1F1F3",
  primary: "#18181B",
  destructive: "#E5484D",
  ring: "#A1A1AA",
  chart1: "#5E6AD2",
  chart2: "#26A69A",
  chart3: "#F2994A",
  chart4: "#EB5757",
  chart5: "#9B51E0",
};

const srgbToLin = (c) => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
};

function hexToOklch(hex) {
  const r = srgbToLin(parseInt(hex.slice(1, 3), 16));
  const g = srgbToLin(parseInt(hex.slice(3, 5), 16));
  const b = srgbToLin(parseInt(hex.slice(5, 7), 16));

  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);

  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;

  const C = Math.sqrt(A * A + B * B);
  let H = (Math.atan2(B, A) * 180) / Math.PI;
  if (H < 0) H += 360;

  return `${L.toFixed(3)} ${C.toFixed(3)} ${H.toFixed(1)}`;
}

for (const [key, hex] of Object.entries(hexes)) {
  console.log(key.padEnd(12), hex, "->", hexToOklch(hex));
}
