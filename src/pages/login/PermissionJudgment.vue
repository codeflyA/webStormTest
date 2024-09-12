<script setup lang="ts">
import { autoLogin } from "@/pages/login/autoLogin";
import { handleUserRole } from "@/utils/userRole";
import { useUserLoginInfoStore } from "@/stores/userInfo";
async function PermissionJudgment() {
  const UserLoginInfo = useUserLoginInfoStore();
  const res = await autoLogin();
  if (res === true) {
    await handleUserRole(UserLoginInfo.USER_ID);
  } else {
    uni.reLaunch({ url: "/pages/student/StudentHome" });
    // console.log("登录失败");
  }
}
PermissionJudgment();
</script>

<template>
  <view class="PermissionJudgment">身份验证中...</view>
</template>

<style scoped lang="scss"></style>
<!-- 使用 type="home" 属性设置首页 -->
<route type="home">
{
"style": { "navigationBarTitleText": "" }
}
</route>
