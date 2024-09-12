import { createPinia } from "pinia";
import { createPersistedState } from "pinia-plugin-persistedstate";
import uviewPlus from "uview-plus";
import { createSSRApp } from "vue";
import App from "./App.vue";
//UniDevTools调试插件代码
import devToolsConfig from "./devTools/config.js";
import mpDevBubble from "./devTools/core/components/mpDevBubble.vue";
import devToolsVueMixin from "./devTools/core/proxy/vueMixin.js";
import devTools from "./devTools/index.js";
//https://dev.api0.cn/guide/use
import "uno.css";
const pinia = createPinia();
//UniDevTools调试插件代码结束
/**
 * @description 自定义pinia持久化api储存方式为 unisetStorageSync
 * @returns
 */
function customStorage() {
  return createPersistedState({
    storage: {
      getItem(key: string) {
        return uni.getStorageSync(key);
      },
      setItem(key: string, value: any) {
        uni.setStorageSync(key, value);
      },
    },
  });
}
pinia.use(customStorage());
export function createApp() {
  const app = createSSRApp(App).use(pinia).use(uviewPlus);
  //UniDevTools调试插件代码
  //https://dev.api0.cn/guide/use
  //混入DevTools生命周期监听
  app.mixin(devToolsVueMixin);
  //挂载Devtools
  app.use(devTools, devToolsConfig);
  //注册小程序端专用的拖动浮标组件
  app.component("mpDevBubble", mpDevBubble);
  //UniDevTools调试插件代码结束
  return {
    app,
  };
}
