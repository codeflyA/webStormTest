<script setup lang="ts">
import type { carTypeList } from "@/pages/learnDrive/driveSchoolDetail/type";
import noImg from "../../assets/imgs/noImg.png";
import { addQueryParamsToUrl } from "@/utils/url";
interface Props {
  dataList: carTypeList[];
}

const props = withDefaults(defineProps<Props>(), {
  dataList: () => [],
});

function signUp(item: carTypeList) {
  // if (props.islock) {
  //   uni.showModal({
  //     title: "提示",
  //     content: "该驾校报名已锁定，暂停报名",
  //     showCancel: false,
  //   });
  //   return;
  // }
  // uni.setStorageSync("chooseSchoolInfo", item);

  const url = addQueryParamsToUrl(
    "/pages/learnDrive/onlineSignUp/onlineSignUp",
    item
  );
  uni.navigateTo({
    url,
  });
}

onMounted(() => {
  // 组件挂载后的逻辑
  // console.log(props.dataList);
  // setTimeout(() => {
  //   console.log(props.dataList);
  // }, 3000);
});
</script>

<template>
  <view v-for="(item, index) in dataList" :key="index" class="carType">
    <view class="list-item">
      <view class="left">
        <up-image
          :src="item.photopath || noImg"
          width="150rpx"
          height="150rpx"
          radius="10rpx"
        />
      </view>
      <view class="right">
        <view class="right1">
          <view class="right1Item1">{{ item.classname }}</view>
          <view class="right1Item2">￥{{ item.claprice }}</view>
          <!--              <up-text :text="item.classname" size="30" bold />-->
          <!--              <up-text :text="`￥${item.claprice}`" color="#F84E26" size="26" />-->
        </view>
        <view class="right2">
          <view class="right2Item1">{{ item.classintro }}</view>
          <!--              <up-text :text="item.classintro" color="#999" size="24" />-->
        </view>
        <view class="right3">
          <view class="right3Item1">{{ item.claremark }}</view>
          <view class="right3Item2" @click="signUp(item)">在线报名</view>
          <!--              <up-text :text="item.claremark" color="#999" size="24" />-->
          <!--              <up-button text="在线报名" size="mini" @click="signUp(item)" />-->
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.carType {
  :deep(.list-item) {
    display: flex;
    align-items: center;
    padding: 20rpx;
    border-bottom: 1px solid rgba(132, 132, 132, 0.2);
    color: grey;

    .left {
      width: 150rpx;
      height: 150rpx;
      border-radius: 10rpx;
      overflow: hidden;
    }

    .right {
      flex: 1;
      padding-left: 25rpx;

      .right1 {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        margin-bottom: 10rpx;
        .right1Item1 {
          color: #333;
          font-size: 52rpx;
          font-weight: bold;
        }

        .right1Item2 {
          color: #f84e26;
          font-size: 46rpx;
        }
      }

      .right2 {
        display: flex;
        margin-bottom: 10rpx;
        justify-content: space-between;
        align-items: center;
        .right2Item1 {
          font-size: 36rpx;
          color: rgba(134, 146, 154, 0.89);
        }
        //.up-text {
        //  flex: 1;
        //  margin-right: 20rpx;
        //}
        //
        //.up-button {
        //  flex-shrink: 0;
        //}
      }

      .right3 {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10rpx;
        .right3Item1 {
          font-size: 36rpx;
          color: rgba(134, 146, 154, 0.89);
        }
        .right3Item2 {
          font-size: 32rpx;
          background-color: #fabe29;
          color: #ffffff;
          border: 1px solid #fabe29;
          border-radius: 20rpx;
          padding: 10rpx 10rpx;
        }
        //.up-text {
        //  flex: 1;
        //}
      }
    }
  }
}
</style>
