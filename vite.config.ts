import Uni from "@dcloudio/vite-plugin-uni";
import UniHelperComponents from "@uni-helper/vite-plugin-uni-components";
import UniHelperPages from "@uni-helper/vite-plugin-uni-pages";
import { codeInspectorPlugin } from "code-inspector-plugin";
import AutoImport from "unplugin-auto-import/vite";
import { defineConfig, loadEnv } from "vite";
// https://vitejs.dev/config/
export default async ({ mode }) => {
  const UnoCSS = (await import("unocss/vite")).default;
  const root = process.cwd();
  const viteEnv = loadEnv(mode, root);
  // console.log(process.env);
  console.log(process.env.NODE_ENV);
  console.log(process.env.UNI_PLATFORM);
  //实测在这里无法使用https://blog.csdn.net/u014582342/article/details/139664102
  //console.log(import.meta.env, 333);
  //  { VITE_CJS_IGNORE_WARNING: 'true',
  //  VITE_ROOT_DIR: 'E:\\核心\\浙江综合交通大数据中心\\开发代码\\交科科技\\温州驾培\\温州驾培app\\newApp',
  //  VITE_USER_NODE_ENV: 'development'
  // }
  console.log(viteEnv);
  return defineConfig({
    plugins: [
      codeInspectorPlugin({
        bundler: "vite",
        hideConsole: true,
        editor: "idea",
        // showSwitch: true,
      }),
      // https://github.com/uni-helper/vite-plugin-uni-manifest
      // UniHelperManifest(),
      // https://github.com/uni-helper/vite-plugin-uni-pages
      UniHelperPages({
        dts: "src/uni-pages.d.ts",
      }),
      // https://github.com/uni-helper/vite-plugin-uni-layouts
      // UniHelperLayouts(),
      // https://github.com/uni-helper/vite-plugin-uni-components
      // UniHelperComponents({
      //   dts: 'src/components.d.ts',
      //   directoryAsNamespace: true,
      // }),
      Uni(),
      // https://github.com/antfu/unplugin-auto-import

      AutoImport({
        imports: ["vue", "@vueuse/core", "uni-app"],
        dts: "src/auto-imports.d.ts",
        dirs: ["src/composables", "src/stores", "src/utils"],
        vueTemplate: true,
      }),
      // https://github.com/antfu/unocss
      // see unocss.config.ts for config
      UnoCSS(),
    ],
    build: {
      minify: "terser",
      //https://uniapp.dcloud.net.cn/collocation/vite-config.html#%E5%8F%91%E5%B8%83%E6%97%B6%E5%88%A0%E9%99%A4%20console
      terserOptions: {
        compress: {
          drop_console: true,
        },
      },
    },
    esbuild:
      process.env.NODE_ENV !== "development"
        ? {
            // 仅删除debugger语句和console.log、console.info，其他console不进行删除(保留console.error)
            drop: ["debugger"],
            //用于指定哪些函数是 "纯" 函数，即它们没有副作用，只根据输入参数返回结果。在配置中，pure 的值是一个数组，数组中的每个元素都是一个字符串，表示被认为是 "纯" 函数的函数名。例如，pure: ['console.log', 'console.info'] 表示 console.log 和 console.info 被认为是 "纯" 函数。当 esbuild 在压缩代码时，如果发现这些 "纯" 函数的调用结果没有被使用，就会将这些调用语句删除。
            //pure: ['console.log', 'console.info'] 表示如果 console.log 和 console.info 的调用结果没有被使用，就删除这些调用语句。
            pure: ["console.log", "console.info"],
          }
        : {},
  });
};
