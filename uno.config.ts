import { defineConfig, presetIcons, presetUno } from "unocss";
import presetShadcn from "unocss-preset-shadcn";

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
    presetShadcn({
      color: "zinc",
    }),
  ],
});
