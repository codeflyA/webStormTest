<script setup lang="ts">
import noImg from "../../assets/imgs/noImg.png";

interface DataItem {
  name: string;
  overall: number;
  srvmanner: string;
  evaluatetime: string;
}

interface Props {
  dataList: DataItem[];
}

const props = defineProps<Props>();
</script>

<template>
  <view v-for="(item, index) in dataList" :key="index" class="lists__item">
    <view class="lists__item-left">
      <image :src="noImg" :radius="10" style="width: 100%" mode="widthFix" />
    </view>
    <view class="lists__item-right">
      <view class="lists__item-row-one">
        <text>{{ item.name }}</text>
        <up-rate v-model="item.overall" readonly />
      </view>
      <view class="lists__item-row-two">
        <text>{{ item.srvmanner }}</text>
      </view>
      <view class="lists__item-row-time">
        <text>{{ item.evaluatetime }}</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.lists {
  &__item {
    display: flex;
    align-items: flex-start;
    padding: 1rem;
    border-bottom: 1px solid rgba(132, 132, 132, 0.2);
    height: auto;
    color: grey;
    font-size: 0.9rem;

    &-left {
      width: 5rem;
      height: 5rem;
      border-radius: 50%;
      overflow: hidden;
    }

    &-right {
      width: calc(100% - 5rem);
      padding-left: 25rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 5rem;
    }

    &-row-one {
      font-size: 1.2rem;
      color: #333333;
      font-weight: bolder;
      display: flex;
      justify-content: space-between;

      :deep(.up-rate) {
        display: flex;
        align-items: center;
      }
    }

    &-row-two {
      font-size: 0.9rem;
      color: #333333;
    }

    &-row-time {
      display: flex;
      align-items: baseline;
      color: #999999;
      font-size: 0.9rem;
    }
  }
}

.elderLists {
  :deep(p) {
    font-size: 1.4rem !important;
  }
}
</style>
