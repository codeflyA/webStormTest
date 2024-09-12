<script setup lang="ts">
import { scanningCodeAndTrainingForCoach } from "@/pages/coach/js/scanningCodeAndTrainingForCoach";
import { autoLogin } from "@/pages/login/autoLogin";
import request from "@/request";
import { getCoachInfo } from "@/request/getPeopleInfo";
import { useUserLoginInfoStore } from "@/stores/userInfo";

const userStatus = ref<number>();
const UserLoginInfo = useUserLoginInfoStore();
async function scanningCodeAndTrainingWrapper() {
  await scanningCodeAndTrainingForCoach();
}
async function forcedSignOut() {
  const { result } = await getCoachInfo();
  const { message: coachMandatoryFinishMessage, errorcode } =
    await request.postCrypto(
      `/zljp/coachMandatoryFinish?v=33031.0.0.e2&ts=${new Date().getTime()}`,
      {
        uuid: UserLoginInfo.USER_ID,
        certId: UserLoginInfo.USER_ID,
        coachnum: result.coachnum,
        city: "3303",
      }
    );
  uni.showToast({
    title: coachMandatoryFinishMessage,
    icon: "none",
    duration: 2000,
  });
}
async function isStudent() {
  uni.navigateTo({
    url: "/pages/student/StudentHome",
  });
}
</script>

<template>
  <view class="studentHome">
    <view class="head-banner">
      <!--      <div class="search-part">-->
      <!--        <uni-data-select-->
      <!--          class="topSelect"-->
      <!--          clearButton="none"-->
      <!--          cancelButton="none"-->
      <!--          :localdata="cityList"-->
      <!--          v-model="searchData.areaCode"-->
      <!--          :clear="false"-->
      <!--        />-->
      <!--        &lt;!&ndash; <img src="@/static/register/down.png" style="width: 10px;"></img> &ndash;&gt;-->
      <!--        <uni-search-bar-->
      <!--          placeholder="输入驾校名称"-->
      <!--          v-model="searchData.name"-->
      <!--          style="width: 75%"-->
      <!--          @confirm="handleSearch"-->
      <!--          @clear="handleSearch"-->
      <!--        ></uni-search-bar>-->
      <!--      </div>-->
      <!--      <div class="bannerfont">-->
      <!--        <div><img src="@/static/studentPage/bannerfont2.png" /></div>-->
      <!--        <div><img src="@/static/studentPage/bannerfont1.png" /></div>-->
      <!--      </div>-->
    </view>
    <view class="menus">
      <view class="grid-item-box" @click="scanningCodeAndTrainingWrapper">
        <!--        图片模板 https://zh.uniapp.dcloud.io/component/image.html-->
        <image
          src="./assets/imgs/personSign.png"
          style="width: 50%"
          mode="widthFix"
        />
        <p class="text">扫码培训</p>
      </view>
      <view class="grid-item-box" @click="forcedSignOut">
        <!--        图片模板 https://zh.uniapp.dcloud.io/component/image.html-->
        <image
          src="./assets/imgs/forcedSignOut.png"
          style="width: 50%"
          mode="widthFix"
        />
        <p class="text">强制签退</p>
      </view>
      <view class="grid-item-box" @click="isStudent">
        <!--        图片模板 https://zh.uniapp.dcloud.io/component/image.html-->
        <image
          src="./assets/imgs/isStudent.png"
          style="width: 50%"
          mode="widthFix"
        />
        <p class="text">我是学员</p>
      </view>
      <!--      <view class="grid-item-box" @click="PersonalCenter">-->
      <!--        <image-->
      <!--          src="./assets/imgs/person.png"-->
      <!--          style="width: 50%"-->
      <!--          mode="widthFix"-->
      <!--        />-->
      <!--        <p class="text">个人中心</p>-->
      <!--      </view>-->
    </view>
  </view>
</template>

<style scoped lang="scss">
.studentHome {
  .head-banner {
    background: url("./assets/imgs/homeBanner.png") no-repeat;
    background-size: 100% 100%;
    height: 30vh;
    //padding-top: 0.1px;
    ///deep/.uni-select {
    //  border: none;
    //  border-bottom: none;
    //  text-align: center;
    //}
    //
    ///deep/.uni-select__input-text {
    //  color: black;
    //}
    //
    ///deep/.uni-searchbar__box {
    //  border-style: none;
    //}
    //
    //.search-part {
    //  display: flex;
    //  background-color: #fff;
    //  margin-top: 8%;
    //  width: 90%;
    //  margin-left: 5%;
    //  border-radius: 5px;
    //  align-items: center;
    //  justify-content: center;
    //
    //  div {
    //    display: flex;
    //    align-items: center;
    //
    //    img {
    //      width: 0.8rem;
    //      height: 0.5rem;
    //      margin: 0.2rem 0.7rem 0 0.5rem;
    //    }
    //  }
    //
    //  /deep/.uni-searchbar__cancel {
    //    display: none;
    //  }
    //}
    //
    //.bannerfont {
    //  display: flex;
    //  width: 90%;
    //  margin: 8% auto;
    //
    //  div {
    //    width: 50%;
    //    text-align: center;
    //
    //    img {
    //      width: 75%;
    //    }
    //  }
    //}
  }
  .menus {
    width: 100%;
    background-color: #fff;
    //margin: 0 auto;
    margin-top: -7%;
    border-top-left-radius: 20rpx;
    border-top-right-radius: 20rpx;
    display: flex;
    flex-wrap: wrap;
    padding: 20rpx 0;
    color: #000000;
    .grid-item-box {
      text-align: center;
      width: 25%;
      margin-bottom: 20rpx;
      //img {
      //  width: 50%;
      //  margin-bottom: 10rpx;
      //}
    }
  }
}
</style>
<route>
{
  "style": { "navigationBarTitleText": "首页" }
}
</route>
