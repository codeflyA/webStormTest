<script setup lang="ts">
import { ref } from "vue";
import request from "@/request/index";
import crypto from "@/utils/crypto";
import { isWeb } from "@/utils/environment";
import { useUserLoginInfoStore } from "@/stores/userInfo";
import { handleUserRole } from "@/utils/userRole";

// async function ifIsWebHandleLogin() {
//   if (!isWeb()) {
//     console.log("app端");
//     const res = await request.post("/app/defaultLogin?type=student");
//     uni.setStorageSync("ACCESS_TOKEN", res.token);
//     const USER_ID = res.userInfo.id;
//     uni.setStorageSync("USER_ID", res.userInfo.id);
//     uni.setStorageSync("userInfo", res.userInfo);
//     const res2 = await request(`/app/getPersonInfo?id=${USER_ID}`, {
//       method: "get",
//     });
//     if (res2.roleType === "student") {
//       uni.navigateTo({
//         url: "/pages/StudentHome",
//       });
//     }
//   }
// }

async function checkPermissions() {
  // 权限检查逻辑
}

checkPermissions();

const userInfo = ref<{
  phone: string;
  code: string;
  agreeValue: boolean;
}>({
  phone: "",
  code: "",
  agreeValue: false, // 这里改为数组类型
});
const show = ref(false);
const title = ref("协议确认");
const content = ref("查看并同意《产品使用协议》和《隐私政策》");
const isCheckboxSelected = ref(false);
const isGetVerifyCode = ref(false);

async function getVerifyCode() {
  isGetVerifyCode.value = true;
  if (!userInfo.value.agreeValue) {
    //用户没有勾选 我已查看并同意《产品使用协议》和《隐私政策》
    show.value = true;
  } else {
    const res = await request.post(
      "/app/sms/send",
      crypto(
        JSON.stringify({
          mobile: userInfo.value.phone,
          ts: new Date().getTime(),
        })
      )
    );
  }
}

//确认勾选协议
async function handleConfirm() {
  show.value = false;
  userInfo.value.agreeValue = true;
  isCheckboxSelected.value = false;
  //需要加密
  const res = await request.post(
    "/app/sms/send",
    crypto(
      JSON.stringify({
        mobile: userInfo.value.phone,
        ts: new Date().getTime(),
      })
    )
  );
}

function handleCancel() {
  show.value = false;
}

// function handleCheckboxChange(value: any) {
//   userInfo.value.agreeValue = value;
// }

async function confirm() {
  if (userInfo.value.phone === "") {
    uni.showToast({ title: "请输入手机号", icon: "none" });
    return;
  }
  if (userInfo.value.code === "") {
    uni.showToast({ title: "请输入验证码", icon: "none" });
    return;
  }
  if (!userInfo.value.agreeValue) {
    uni.showToast({
      title: "请查看并同意《产品使用协议》和《隐私政策》",
      icon: "none",
    });
    return;
  }

  const res = await request.post(
    "/app/sms/login",
    crypto(
      JSON.stringify({
        mobile: userInfo.value.phone,
        smsCode: userInfo.value.code,
        ts: new Date().getTime(),
      })
    )
  );
  const UserLoginInfo = useUserLoginInfoStore();
  UserLoginInfo.appId = res.result.userInfo.appId;
  UserLoginInfo.USER_ID = res.result.userInfo.id;
  UserLoginInfo.ACCESS_TOKEN = res.result.token;
  // uni.setStorageSync("appId", res.userInfo.appId);
  // uni.setStorageSync("USER_ID", res.userInfo.id);
  // uni.setStorageSync("ACCESS_TOKEN", res.token);
  if (res.result.userInfo.haveReal === 0) {
    // 没有实名认证
    uni.redirectTo({
      url: "/pages/login/RealNameAuthen",
    });
  } else {
    //实名认证了 获取用户信息是学员还是教练
    await handleUserRole(res.result.userInfo.id);
    // const personInfoRes = await request.get(
    //   `/app/getPersonInfo?id=${res.result.userInfo.id}`
    // );
    // if (personInfoRes.result.roleType === "student") {
    //   uni.redirectTo({
    //     url: "/pages/student/StudentHome",
    //   });
    // } else if (personInfoRes.result.roleType === "coach") {
    //   // 如果是教练，跳转到教练主页
    //   uni.redirectTo({
    //     url: "/pages/CoachHome",
    //   });
    // }
  }
}
</script>

<template>
  <view class="login">
    <view class="header">鸥e学车</view>
    <view class="form">
      <up-form>
        <u-form-item label="手机号">
          <up-input
            v-model="userInfo.phone"
            placeholder="请输入手机号码"
            :disabled="false"
            :clearable="true"
          />
        </u-form-item>

        <u-form-item label="验证码" class="code">
          <up-input
            v-model="userInfo.code"
            placeholder="请输入验证码"
            :disabled="false"
            :clearable="true"
          />
          <view
            class="getCode"
            :class="{ disabled: isGetVerifyCode }"
            @click="getVerifyCode"
            >获取验证码</view
          >
        </u-form-item>
      </up-form>
    </view>

    <!-- 协议复选框 -->
    <view class="agreement">
      <!--      单选框模板-->
      <up-checkbox
        label=""
        name="agree"
        usedAlone
        v-model:checked="userInfo.agreeValue"
      >
      </up-checkbox>
      <view class="agreementText">
        我已查看并同意
        <navigator url="/pages/login/termsUse" class="link"
          >《产品使用协议》</navigator
        >
        和
        <navigator url="/pages/login/privacy" class="link"
          >《隐私政策》</navigator
        >
      </view>
    </view>

    <view class="buttons">
      <up-button
        type="primary"
        class="btn confirm"
        text="确定"
        @click="confirm"
      ></up-button>
    </view>

    <u-modal
      v-model:show="show"
      :title="title"
      :content="content"
      confirm-text="确认勾选"
      cancel-text="取消"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
  </view>
</template>

<style scoped lang="scss">
.login {
  box-sizing: border-box;
  text-align: center;
  background: linear-gradient(to bottom, #67cdf0, #a3e1f1);
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 100px;

  .header {
    font-size: 24px;
    color: #fff;
    margin-bottom: 20px;
  }

  :deep(.form) {
    width: 90%;

    .u-form-item {
      display: flex;
      align-items: center;
      background-color: #fff;
      border-radius: 50px;
      padding-left: 30rpx;
      //padding: 5px 20px;
      margin-bottom: 20px;
      .u-form-item__body {
        width: 100%;
        .u-form-item__body__left {
          width: 120rpx !important;
          .u-form-item__body__left__content__label {
            font-size: 36rpx;
          }
        }
      }

      .u-label {
        color: #000;
        font-size: 16px;
      }
      .u-input {
        border: none;
        .uni-input-wrapper {
          font-size: 36rpx;
        }
      }
    }
    .code {
      .getCode {
        font-size: 32rpx;
        width: 200rpx;
        margin-right: 10px;
        color: #1c92ff;
      }
      .disabled {
        color: #ccc;
      }
    }
  }

  .agreement {
    display: flex;
    align-items: center;
    padding: 0 20px;
    margin-bottom: 20px;

    .agreementText {
      display: flex;
      align-items: center;
      font-size: 28rpx;
      color: #666;

      .link {
        font-size: 28rpx;
        color: #1c92ff;
        text-decoration: underline;
      }
    }
  }
  :deep(.buttons) {
    display: flex;
    justify-content: space-around;
    width: 100%;
    padding: 0px 20px;

    .u-button {
      height: 40px;
      //display: flex;
      //justify-content: center;
      //align-items: center;
      width: 300rpx;
      padding: 10px 0;
      border-radius: 50px;
      //background-color: #5bb8ff;
      color: #fff;
      .u-button__text {
        font-size: 40rpx !important;
      }
    }
  }
}
</style>
<route>
{
"style": { "navigationBarTitleText": "手机登录" }
}
</route>
