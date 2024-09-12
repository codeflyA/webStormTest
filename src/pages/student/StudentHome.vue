<script setup lang="ts">
import { autoLogin, autoLoginWithJump } from "@/pages/login/autoLogin";
import { scanningCodeAndTrainingForStudent } from "@/pages/student/assets/js/scanningCodeAndTrainingForStudent";
import request from "@/request";
import { getStudentInfo } from "@/request/getPeopleInfo";
import { useUserLoginInfoStore } from "@/stores/userInfo";
// const userStatus = ref<number>();
const UserLoginInfo = useUserLoginInfoStore();
async function learnDrive() {
  const autoLoginRes = await autoLoginWithJump();
  if (autoLoginRes === true) {
    uni.redirectTo({
      url: "/pages/learnDrive/index",
    });
  }
}
async function PersonalCenter() {
  const autoLoginRes = await autoLoginWithJump();
  console.log(autoLoginRes);
  if (autoLoginRes === true) {
    const { result } = await getStudentInfo();
    // userStatus.value = result;
    if (result?.page?.records?.length > 0) {
      UserLoginInfo.userClass = result.page.records[0];
    }
  }
}
async function scanningCodeAndTrainingWrapper() {
  const autoLoginRes = await autoLoginWithJump();
  await scanningCodeAndTrainingForStudent();
}
async function drivingSchoolRankings() {
  // const autoLoginRes = await autoLoginWithJump();
  // await scanningCodeAndTrainingForStudent();
  uni.redirectTo({
    url: "/pages/learnDrive/serviceEvaluation/serviceEvaluation",
  });
}
async function physicalExamination() {
  // const autoLoginRes = await autoLoginWithJump();
  // await scanningCodeAndTrainingForStudent();
  uni.redirectTo({
    url: "/pages/learnDrive/physicalExamination/hospitalList",
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
      <view class="grid-item-box" @click="learnDrive">
        <image
          src="./assets/imgs/studyCar.png"
          style="width: 50%"
          mode="widthFix"
        />
        <p class="text">我要学车</p>
      </view>
      <view class="grid-item-box" @click="PersonalCenter">
        <image
          src="./assets/imgs/person.png"
          style="width: 50%"
          mode="widthFix"
        />
        <p class="text">个人中心</p>
      </view>
      <view class="grid-item-box" @click="scanningCodeAndTrainingWrapper">
        <image
          src="./assets/imgs/personSign.png"
          style="width: 50%"
          mode="widthFix"
        />
        <p class="text">扫码培训</p>
      </view>
      <view class="grid-item-box" @click="drivingSchoolRankings">
        <image
          src="./assets/imgs/drivingSchoolRankings.png"
          style="width: 50%"
          mode="widthFix"
        />
        <p class="text">驾校排名</p>
      </view>
      <view class="grid-item-box" @click="physicalExamination">
        <image
          src="./assets/imgs/physicalExamination.png"
          style="width: 50%"
          mode="widthFix"
        />
        <p class="text">我要体检</p>
      </view>
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
<!-- 使用 type="home" 属性设置首页 -->
<route>
{
  "style": { "navigationBarTitleText": "首页" }
}
</route>
