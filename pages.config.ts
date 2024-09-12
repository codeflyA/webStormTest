import { defineUniPages } from "@uni-helper/vite-plugin-uni-pages";

export default defineUniPages({
  pages: [],
  subPackages: [
    {
      root: "devTools/page",
      name: "devToolsPage",
      pages: [
        {
          path: "index",
          style: {
            navigationStyle: "custom",
            // #ifdef APP-PLUS
            softinputMode: "adjustResize",
            backgroundColor: "transparent",
            animationDuration: 1,
            animationType: "none",
            popGesture: "none",
            bounce: "none",
            titleNView: false,
            // #endif
          },
        },
      ],
    },
  ],
  easycom: {
    autoscan: true,
    // 注意一定要放在custom里，否则无效，https://ask.dcloud.net.cn/question/131175
    custom: {
      "^u--(.*)": "uview-plus/components/u-$1/u-$1.vue",
      "^up-(.*)": "uview-plus/components/u-$1/u-$1.vue",
      "^u-([^-].*)": "uview-plus/components/u-$1/u-$1.vue",
    },
  },
  globalStyle: {
    // https://uniapp.dcloud.net.cn/collocation/pages.html#globalstyle
    pageOrientation: "portrait",
    navigationBarTitleText: "温州学考一件事",
    //导航栏标题颜色及状态栏前景颜色，仅支持 black/white
    navigationBarTextStyle: "black",
    //导航栏背景颜色（同状态栏背景色）
    navigationBarBackgroundColor: "#ffffff",
    //窗口的背景色
    backgroundColor: "#ffffff",
    //顶部窗口的背景色（bounce回弹区域）
    backgroundColorTop: "#F4F5F6",
    //底部窗口的背景色（bounce回弹区域）
    backgroundColorBottom: "#F4F5F6",
  },
  // tabBar: {
  //   backgroundColor: "@tabBgColor",
  //   borderStyle: "@tabBorderStyle",
  //   color: "@tabFontColor",
  //   selectedColor: "@tabSelectedColor",
  // },
});
