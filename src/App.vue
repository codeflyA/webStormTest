<script setup lang="ts">
import { onError, onLaunch } from "@dcloudio/uni-app";
onError((err) => {
  //https://dev.api0.cn/guide/use
  try {
    // 挂载devTools全局报错拦截
    uni.$dev.errorReport(err, "at App.vue onError", "oe");
  } catch (error) {}
});
onLaunch((ctx) => {
  //https://dev.api0.cn/guide/use
  try {
    // 挂载APP启动日志提交
    uni.$dev.logReport(`appOnLaunch>${JSON.stringify(ctx)}`);
  } catch (error) {}
});
</script>
<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import "uview-plus/index.scss";
uni-page-body {
  height: 100%;
}
</style>
