import {
  defineConfig,
  presetIcons,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";

import { presetUni } from "@uni-helper/unocss-preset-uni";
//https://github.com/uni-helper/unocss-preset-uni
//https://unocss.jiangruyi.com/presets/uno
export default defineConfig({
  presets: [
    presetUni(),
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        display: "inline-block",
        "vertical-align": "middle",
      },
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
});
