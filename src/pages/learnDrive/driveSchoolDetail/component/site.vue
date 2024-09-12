<script setup lang="ts">
import noImg from "../../assets/imgs/noImg.png";
import type { siteTypeList } from "@/pages/learnDrive/driveSchoolDetail/type";
interface Props {
  dataList: siteTypeList[];
}
const props = withDefaults(defineProps<Props>(), {
  dataList: () => [],
});

// const siteList = ref([]);
// const currentPage = ref(0);

// 如果需要其他方法,可以在这里定义
</script>

<template>
  <view class="list-item" v-for="(item, index) in dataList" :key="index">
    <view class="left">
      <image :src="noImg" :radius="10" style="width: 100%" mode="widthFix" />
    </view>
    <view class="right">
      <view class="right1">{{ item.name }}</view>
      <view class="right2">{{ item.address }}</view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.list-item {
  display: flex;
  align-items: center;
  height: auto;
  color: grey;
  font-size: 0.9rem;

  .left {
    width: 5rem;
    height: 5rem;
    border-radius: 0.5rem;
    overflow: hidden;
  }

  .right {
    flex: 1;
    padding-left: 25rpx;

    .right1 {
      margin-bottom: 0.4rem;
      font-size: 1.2rem;
      color: #333;
      align-items: baseline;
      font-weight: 550;
    }

    .right2 {
      margin-bottom: 0.4rem;
      color: #999999;
      font-size: 0.9rem;
    }
  }
}
</style>
