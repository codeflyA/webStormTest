<script setup lang="ts">
// import { ref, onMounted } from "vue";
import request from "@/request/index";
import crypto from "@/utils/crypto";
import { toAuth } from "@/utils/cloudAuth";
import { isWeb } from "@/utils/environment";
import { useUserLoginInfoStore } from "@/stores/userInfo";
import { handleUserRole } from "@/utils/userRole";

const isDisabled = ref(false);
const captcha = ref("");
const codeImg = ref("");
//是否需要验证码
const status = ref(1);
const checkStatus = ref(false);
const userInfo = ref({
  phone: "",
  name: "",
  idNumber: "",
});

const UserLoginInfo = useUserLoginInfoStore();
async function getUserInfo() {
  const { result } = await request.get("/app/user/info/get", {
    data: {
      id: UserLoginInfo.USER_ID,
    },
  });
  // UserLoginInfo.UserIdentificationInfo = result;
  userInfo.value.phone = result.phone;
  // if (res.idNumber) {
  //   status.value = 0;
  //   isDisabled.value = true;
  // } else {
  //   status.value = 1;
  //   isDisabled.value = false;
  // }
}

async function getCaptcha() {
  const { result } = await request.get("/app/user/info/randomImage", {
    data: {
      id: UserLoginInfo.USER_ID,
    },
  });
  codeImg.value = result;
}
// function edit() {
//   status.value = 1;
//   isDisabled.value = false;
//   userInfo.value = {};
//   captcha.value = "";
//   getCaptcha();
// }

function submit() {
  if (!checkStatus.value) {
    uni.showModal({
      content: "请点击勾选，同意隐私政策协议",
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          console.log("用户点击确定");
          checkStatus.value = true;
        } else if (res.cancel) {
          console.log("用户点击取消");
        }
      },
    });
    return;
  }
  if (!userInfo.value.name) {
    uni.showToast({
      title: "请输入姓名！",
      icon: "none",
      duration: 3000,
    });
    return;
  }
  if (!userInfo.value.idNumber) {
    uni.showToast({
      title: "请输入身份证！",
      icon: "none",
      duration: 3000,
    });
    return;
  }
  submitForm();
}

async function submitForm() {
  try {
    let res;
    if (!isWeb()) {
      res = await toAuth({
        name: userInfo.value.name,
        idNumber: userInfo.value.idNumber,
        id: UserLoginInfo.USER_ID,
        captcha: captcha.value,
      }).catch((err) => {
        console.log(err);
        res = false;
      });
    } else {
      res = true;
    }
    if (res) {
      console.log({
        ...userInfo.value,
        openid: UserLoginInfo.USER_ID,
        ts: new Date().getTime(),
      });
      //实名认证成功 保存用户信息
      await request.post(
        "/app/user/info/set",
        crypto(
          JSON.stringify({
            ...userInfo.value,
            id: UserLoginInfo.USER_ID,
            ts: new Date().getTime(),
          })
        )
      );
      console.log("实名认证成功");
      await handleUserRole(UserLoginInfo.USER_ID);
      // console.log(111);
      // uni.showModal({
      //   title: "实名认证成功!",
      //   icon: "success",
      //   confirmText: "确定",
      //   showCancel: false,
      //   success() {
      //     getUserRole(UserLoginInfo.USER_ID);
      //   },
      // });
    }
  } catch (e) {
    console.log(e, "error");
  }
}

onMounted(() => {
  getUserInfo();
  getCaptcha();
});
</script>

<template>
  <view class="RealNameAuthen">
    <up-form class="forms" labelWidth="20%">
      <up-form-item label="手机号码">
        <up-input
          v-model="userInfo.phone"
          placeholder="请输入手机号码"
          disabled
        />
      </up-form-item>

      <up-form-item label="姓名" required>
        <up-input
          v-model="userInfo.name"
          placeholder="请输入姓名"
          :disabled="isDisabled"
        />
      </up-form-item>

      <up-form-item label="身份证" required>
        <up-input
          v-model="userInfo.idNumber"
          placeholder="请输入身份证"
          :disabled="isDisabled"
        />
      </up-form-item>

      <view class="code" v-if="status === 1">
        <up-form-item label="验证码">
          <up-input v-model="captcha" placeholder="请输入验证码" />
          <image class="codeImgs" :src="codeImg" @click="getCaptcha" />
        </up-form-item>
      </view>
    </up-form>

    <view class="button-group">
      <!--      <up-button-->
      <!--        type="primary" -->
      <!--        @click="edit" -->
      <!--        v-if="status === 0"-->
      <!--        class="submit"-->
      <!--      >-->
      <!--        修改-->
      <!--      </up-button>-->

      <up-button
        type="primary"
        @click="submit"
        v-if="status === 1"
        class="submit"
      >
        提交
      </up-button>
    </view>

    <view class="declare">
      <up-checkbox
        label="根据瓯e学车APP的《用户协议》和《隐私协议》，瓯e学车APP收集您的实名信息用于数据监测，若您同意我们收集个人信息，请确认授权，若不同意请退出。"
        name="agree"
        usedAlone
        v-model:checked="checkStatus"
      >
      </up-checkbox>
      <!--      <view>-->
      <!--        根据瓯e学车APP的《用户协议》和《隐私协议》，瓯e学车APP收集您的实名信息用于数据监测，若您同意我们收集个人信息，请确认授权，若不同意请退出。-->
      <!--      </view>-->
    </view>
  </view>
</template>

<style lang="scss" scoped>
.RealNameAuthen {
  //min-height: 100%;

  :deep(.forms) {
    background-color: #fff;
    color: black;
    padding: 1rem 1rem 0;

    .up-form-item__label {
      width: 30% !important;
    }

    //.up-input__content {
    //  border: none;
    //  background-color: transparent !important;
    //}

    //.up-form-item {
    //  padding: 10px;
    //  border-bottom: 1px solid rgb(229, 229, 229);
    //  margin-bottom: 0;
    //  background-color: #fff;
    //}
  }

  .button-group {
    background-color: #fff;
    bottom: 0;
    width: 100%;
    padding: 10px 0;
    margin-top: 50px;

    .submit {
      width: 80%;
      border-radius: 25px;
      background-color: rgb(44, 140, 246) !important;
    }
  }

  //.code {
  //  :deep(.up-input__content) {
  //    padding-right: 7rem;
  //  }
  //}

  .codeImgs {
    //position: absolute;
    //right: 0px;
    //top: 0px;
    margin-left: 10px;
    width: 6rem;
    height: 35px;
  }

  :deep(.declare) {
    box-sizing: border-box;
    width: 100%;
    padding: 10px 20px;
    //position: absolute;
    //left: 10%;
    //bottom: 5%;
    //color: #333;
    //line-height: 1.5rem;
    //font-size: 0.8rem;
    display: flex;
    align-items: center;
    //align-items: baseline;
    .u-checkbox {
      .u-checkbox__icon-wrap {
        flex: 0 0 18px;
      }
      //flex: auto;
    }
    //view {
    //  width: 3.5rem;
    //  height: 0.8rem;
    //  margin-right: 0.8rem;
    //}
  }
}
</style>
<route>
{
"style": { "navigationBarTitleText": "实名认证" }
}
</route>
