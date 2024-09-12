<script setup lang="ts">
// import { onLoad } from "@dcloudio/uni-app";

// const uiStyle = ref("normal");
const name = ref("");
const price = ref("");

const infoText1 =
  "您的学费将由第三方银行资金监管账户进行资金监管，学车过程中提供详细的学时明细记录，请放心学车。";
const infoText2 =
  "请认准正规渠道报名学车，谨慎在其他报名平台缴费，以免造成损失！";
const infoText3 = "请先耐心等待驾校相关人员联系...";

onLoad((option) => {
  name.value = option!.name || "";
  price.value = option!.price || "";
});

onMounted(() => {
  // ZWJSBridge.onReady(() => {
  //   ZWJSBridge.setTitle({
  //     title: "班型详情",
  //   });
  //
  //   ZWJSBridge.getUiStyle().then((res) => {
  //     uiStyle.value = res.uiStyle === "elder" ? "elder" : "normal";
  //   });
  // });
});

function back() {
  uni.navigateTo({
    url: "/pages/student/StudentHome",
  });
}
</script>

<template>
  <view class="volumeUp">
    <view class="info-text">{{ infoText1 }}</view>
    <view class="info-text">{{ infoText2 }}</view>
    <view class="info-text">{{ infoText3 }}</view>

    <view class="line-info">
      <view>班型名称</view>
      <view>{{ name }}</view>
    </view>

    <view class="line-info">
      <view>班型学费</view>
      <view>{{ `￥${price}元` }}</view>
    </view>

    <view class="btn-back" @click="back">返回主页</view>
  </view>
</template>

<style lang="scss" scoped>
.volumeUp {
  height: 100vh;
  width: 100%;
  box-sizing: border-box;
  background-color: #fff;
  padding: 10px;
  .line-info {
    margin-top: 40rpx;
    display: flex;
    justify-content: space-between;
  }
  .btn-back {
    margin-top: 40rpx;
    background-color: #007aff;
    color: #fff;
    font-size: 40rpx;
    padding: 10rpx;
    border-radius: 5rpx;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
