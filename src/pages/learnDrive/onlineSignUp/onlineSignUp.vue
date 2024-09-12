<script setup lang="ts">
// import { USER_INFOS, USER_INFO, ACCESS_TOKEN } from "@/common/util/constants";
import request from "@/request/index";
// import CryptoJS from "crypto-js";
import { useUserLoginInfoStore } from "@/stores/userInfo";
import { API } from "@/constant";
import type { carTypeList } from "@/pages/learnDrive/driveSchoolDetail/type";
import type { ICoachInfo } from "@/pages/learnDrive/onlineSignUp/types";
import crypto from "@/utils/crypto";
const baseForm = ref(null);
const popup = ref(null);

const baseFormData = ref<any>({
  //业务类型
  busitype: "0",
  //是否为跨地市转校(至少学完科目一)
  iscrosscity: "2",
  claprice: "",
  classname: "",
  classno: "",
  //驾校编号
  inscode: "",
  name: "",
  //学驾车型
  traintype: "",
  //驾校名称
  insname: "",
  //教练名称
  coachname: "",
  homeaddress: "",
  drilicnum: "",
  fromarea: "",
  crossType: "",
});

const rules = {
  busitype: { required: true, message: "业务类型不能为空!" },
  iscrosscity: { required: true, message: "是否为跨地市转校不能为空!" },
};

const businessType = [
  { text: "初领", value: "0" },
  { text: "增驾", value: "1" },
];

const crossTypeOptions = [
  { text: "科目二和科目三", value: 1 },
  { text: "科目二", value: 2 },
  { text: "科目三", value: 3 },
];

// const userInfo = ref({});
const picUrl = ref("");
const uploadFileUrl = "/oss/imgUpload";
const homeAddress = ref("");
const busitype = ref("");
const userInfo = ref<{
  name: string;
  sex: string;
  idNumber: string;
  [key: string]: any;
}>({
  name: "",
  sex: "",
  idNumber: "",
});
const UserLoginInfo = useUserLoginInfoStore();
// userInfo.value = UserLoginInfo.userClass!;
async function getUserInfo() {
  const { result } = await request.get("/app/user/info/get", {
    data: {
      id: UserLoginInfo.USER_ID,
    },
  });
  userInfo.value = result;
  // console.log(userInfo);
}
getUserInfo();
onLoad((option) => {
  // userInfo.value = uni.getStorageSync(USER_INFOS);
  const {
    claprice,
    classname,
    classno,
    inscode,
    inscode_dictText: insname,
    traintype,
  } = option as carTypeList;
  baseFormData.value = {
    ...baseFormData.value,
    claprice,
    classname,
    classno,
    inscode,
    insname,
    traintype,
  };
  getCoach();
  // baseFormData.value.insname = baseFormData.value.name;

  // if (option.coachnum) {
  //   const objs = uni.getStorageSync("inputData");
  //   picUrl.value = objs.picUrl;
  //   baseFormData.busitype = objs.busitype;
  //   busitype.value = objs.busitype;
  //   baseFormData.homeaddress = objs.homeaddress;
  //   baseFormData.coachnum = option.coachnum;
  //   baseFormData.drilicnum = objs.drilicnum;
  // }
  //
  // baseFormData.coachname = option.coachname || "";
});
const showCoachList = ref(false);
const coachColumns = ref<ICoachInfo[]>([
  // {
  //   label: "雪月夜",
  //   // 其他属性值
  //   id: 2021,
  //   // ...
  // },
  // {
  //   label: "冷夜雨",
  //   id: 804,
  // },
]);
const showPopup = ref(false);
async function showCoach() {
  showCoachList.value = true;
}
async function getCoach() {
  const { result } = await request.get("/zlb/tmc/tMCoach/selectcoach", {
    data: {
      inscode: baseFormData.value.inscode,
      traintype: baseFormData.value.traintype,
      page: 1,
      pageSize: 999,
    },
  });
  coachColumns.value[0] = result.records.map((item, index) => {
    return { ...item, id: index };
  });
  console.log(coachColumns.value);
  // uni.setStorageSync("inputData", {
  //   picUrl: picUrl.value,
  //   homeaddress: baseFormData.homeaddress,
  //   busitype: baseFormData.busitype,
  //   drilicnum: baseFormData.drilicnum,
  // });
  // uni.navigateTo({
  //   url: `/pages/onlineRegist/coachList?inscode=${baseFormData.inscode}&traintype=${baseFormData.traintype}`,
  // });
}
function confirmSelectCoach(e) {
  console.log(e.value[0]);
  baseFormData.value.coachname = e.value[0].name;
  showCoachList.value = false;
}
// getCoach();
function upLoadPhoto() {
  uni.chooseImage({
    count: 1,
    sizeType: ["compressed"],
    sourceType: ["album", "camera"],
    extension: ["png", "jpg"],
    success: (res) => {
      const path = res.tempFilePaths[0];
      uni.showLoading({ title: "上传中..." });
      uni.uploadFile({
        url: API + uploadFileUrl,
        name: "file",
        filePath: path,
        header: { "X-Access-Token": UserLoginInfo.ACCESS_TOKEN },
        success: (res) => {
          uni.hideLoading();
          picUrl.value = JSON.parse(res.data).message;
          if (!picUrl.value) {
            uni.showToast({
              title: "上传失败，请稍后再试。。。",
              icon: "error",
            });
          }
        },
        fail: () => uni.hideLoading(),
      });
    },
  });
}
const popupInfo = computed(() => ({
  真实姓名: userInfo.value.name || "",
  证件号码: userInfo.value.idNumber || "",
  报名驾校: baseFormData.value.insname || "",
  学驾车型: baseFormData.value.traintype || "",
  班型: baseFormData.value.classname || "",
  教练: baseFormData.value.coachname || "",
  业务类型:
    busitype.value === "0"
      ? "初领"
      : busitype.value === "1"
      ? "业务增驾"
      : "其他",
  地址: homeAddress.value,
  是否跨地市: baseFormData.value.iscrosscity === "2" ? "否" : "是",
  转入前地市:
    baseFormData.value.iscrosscity !== "2" ? baseFormData.value.fromarea : "",
  转校后科目:
    baseFormData.value.iscrosscity !== "2"
      ? baseFormData.value.crossType === "1"
        ? "科目二和科目三"
        : baseFormData.value.crossType === "2"
        ? "科目二"
        : "科目三"
      : "",
}));
function submit() {
  // let res = baseForm!.value?.validate();
  // if (!baseFormData.value.busitype && baseFormData.value.busitype !== "0") {
  //   uni.showToast({ title: "业务类型不能为空!", icon: "error" });
  //   return;
  // }
  if (baseFormData.value.busitype === "1" && !baseFormData.value.drilicnum) {
    uni.showToast({ title: "驾驶证号不能为空!", icon: "none" });
    return;
  }
  if (baseFormData.value.iscrosscity === "1" && !baseFormData.value.fromarea) {
    uni.showToast({ title: "转入地市不能为空!", icon: "none" });
    return;
  }
  if (baseFormData.value.iscrosscity === "1" && !baseFormData.value.crossType) {
    uni.showToast({ title: "转校后学习科目不能为空!", icon: "none" });
    return;
  }
  //上传到oss的图片地址赋值
  baseFormData.value.headpicture = picUrl.value;
  homeAddress.value = baseFormData.value.homeaddress;
  busitype.value = baseFormData.value.busitype;
  showPopup.value = true;
  console.log(popupInfo.value);
}

// function encrypt(data) {
//   const key = CryptoJS.enc.Utf8.parse("2341DEF32A14B13C");
//   const iv = CryptoJS.enc.Utf8.parse("F2341B12E34A1CD3");
//   const srcs = CryptoJS.enc.Utf8.parse(data);
//   const encrypted = CryptoJS.AES.encrypt(srcs, key, {
//     iv: iv,
//     mode: CryptoJS.mode.CTR,
//     padding: CryptoJS.pad.ZeroPadding,
//   });
//   return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
// }

async function submitForm() {
  baseFormData.value.id = UserLoginInfo.USER_ID;
  const res = await request.post(
    "/zlb/studentEnter/saveStudentInfo",
    crypto(JSON.stringify(baseFormData.value))
  );
  showPopup.value = false;
  if (res.success) {
    uni.showModal({
      title: "预报名成功!",
      icon: "success",
      confirmText: "确定",
      showCancel: false,
      success: () => {
        uni.navigateTo({
          url: `/pages/learnDrive/volumeUp/volumeUp?name=${baseFormData.value.classname}&price=${baseFormData.value.claprice}`,
        });
      },
    });
  }
  // uni.removeStorageSync("inputData");
}

function close() {
  showPopup.value = false;
  // popup.value.close();
  // ZWJSBridge.onReady(() => {
  //   ZWJSBridge.setTitle({ title: "驾校详情" });
  // });
}

function busitypeChange(e) {
  baseFormData.value.busitype = e;
  busitype.value = e;
}
</script>

<template>
  <view class="onlineSignUp">
    <up-form
      labelWidth="100"
      ref="baseForm"
      :model="baseFormData"
      :rules="rules"
      class="forms"
    >
      <up-form-item label="姓名">
        <up-input v-model="userInfo.name" placeholder="请输入姓名" disabled />
      </up-form-item>
      <up-form-item label="性别">
        <up-input v-model="userInfo.sex" disabled />
      </up-form-item>
      <up-form-item label="头像">
        <image
          v-if="picUrl"
          :src="picUrl"
          width="35px"
          height="35px"
          @click="upLoadPhoto"
        />
        <view v-else @click="upLoadPhoto">点击上传</view>
      </up-form-item>
      <up-form-item label="证件号码">
        <up-input v-model="userInfo.idNumber" placeholder="请输入" disabled />
      </up-form-item>
      <up-form-item label="驾校名称" prop="name">
        <up-input v-model="baseFormData.insname" disabled />
      </up-form-item>
      <up-form-item label="学驾车型" prop="traintype">
        <up-input v-model="baseFormData.traintype" disabled />
      </up-form-item>
      <up-form-item label="班型" prop="classname">
        <up-input v-model="baseFormData.classname" disabled />
      </up-form-item>
      <up-form-item label="教练" prop="coachname" @click="showCoach">
        <up-input
          v-model="baseFormData.coachname"
          style="pointer-events: none"
          disabled
        />
        <up-picker
          :show="showCoachList"
          :columns="coachColumns"
          keyName="name"
          @confirm="confirmSelectCoach"
        />
      </up-form-item>
      <up-form-item label="金额" prop="claprice">
        <up-input v-model="baseFormData.claprice" disabled />
      </up-form-item>
      <up-form-item label="业务类型" required prop="busitype">
        <up-radio-group
          v-model="baseFormData.busitype"
          @change="busitypeChange"
        >
          <up-radio
            v-for="item in businessType"
            :key="item.value"
            :label="item.text"
            :name="item.value"
          >
          </up-radio>
        </up-radio-group>
      </up-form-item>
      <up-form-item
        v-if="busitype === '1'"
        label="驾驶证号"
        required
        prop="drilicnum"
      >
        <up-input
          v-model="baseFormData.drilicnum"
          placeholder="请输入驾驶证号"
        />
      </up-form-item>
      <up-form-item label="地址" prop="homeaddress">
        <up-input v-model="baseFormData.homeaddress" placeholder="请输入地址" />
      </up-form-item>
      <up-form-item
        labelWidth="150"
        label="是否为跨地市转校(至少学完科目一)"
        required
        prop="iscrosscity"
      >
        <up-radio-group v-model="baseFormData.iscrosscity">
          <up-radio label="是" name="1"></up-radio>
          <up-radio label="否" name="2"></up-radio>
        </up-radio-group>
      </up-form-item>
      <up-form-item
        v-if="baseFormData.iscrosscity === '1'"
        label="外地转入前所在地市"
        required
        prop="fromarea"
      >
        <up-input
          v-model="baseFormData.fromarea"
          placeholder="请输入转入前所在地市  如：杭州市"
        />
      </up-form-item>
      <up-form-item
        v-if="baseFormData.iscrosscity === '1'"
        label="转校后学习科目"
        required
        prop="crossType"
      >
        <uni-data-select
          v-model="baseFormData.crossType"
          :localdata="crossTypeOptions"
          :clear="false"
        />
      </up-form-item>
    </up-form>
    <view class="button-group">
      <up-button type="primary" class="submit" @click="submit">
        我要报名
      </up-button>
    </view>
    <up-popup
      ref="popup"
      mode="center"
      round="10"
      :show="showPopup"
      @close="close"
    >
      <view class="popup-content">
        <up-text class="title">您的报名信息如下:请确定无误后提交</up-text>
        <view v-for="(value, key) in popupInfo" :key="key" class="line-info">
          <view>{{ key }}</view>
          <view>{{ value }}</view>
        </view>
        <up-button type="primary" class="btn" @click="submitForm">
          确认信息无误，下一步
        </up-button>
        <up-button type="info" plain class="btn" @click="close">
          返回修改
        </up-button>
      </view>
    </up-popup>
  </view>
</template>

<style lang="scss" scoped>
.onlineSignUp {
  padding: 20rpx 20rpx;
  min-height: 100%;
  .u-radio-group {
    .u-radio {
      margin-right: 20rpx;
    }
  }
  .button-group {
    background-color: #fff;
    width: 100%;
    padding: 10px 0;
    margin-top: 50rpx;

    .submit {
      width: 80%;
      border-radius: 25px;
      background-color: rgb(44, 140, 246) !important;
    }
  }

  .popup-content {
    padding: 15px;
    width: 85vw;
    //height: 100vh;

    .title {
      text-align: center;
      color: #007aff;
      margin: 3px 0 10px 0;
    }

    .line-info {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
    }

    .btn {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 10px 0;
      border-radius: 2rem;
    }
  }
}
</style>
