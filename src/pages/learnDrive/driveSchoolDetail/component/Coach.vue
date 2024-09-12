<script setup lang="ts">
import noImg from "../../assets/imgs/noImg.png";
import star from "../../assets/imgs/star.png";
import type { CoachTypeList } from "@/pages/learnDrive/driveSchoolDetail/type";
interface Props {
  dataList: CoachTypeList[];
}

const props = withDefaults(defineProps<Props>(), {
  dataList: () => [],
});
</script>

<template>
  <view v-for="(item, index) in dataList" :key="index" class="lists-item">
    <view class="left">
      <image
        :src="item.photourl || noImg"
        style="width: 100%"
        mode="widthFix"
        radius="10"
      />
    </view>
    <view class="right">
      <view class="row-one">
        <view class="coach-info">
          <view>{{ item.name }}</view>
          <image
            :src="star"
            style="width: 40rpx"
            mode="widthFix"
            :style="{ margin: '0 5px 0 10px' }"
          />
          <view class="grade">{{ item.mark || 5.0 }}分</view>
        </view>
        <view class="car-type">准教车型:{{ item.dripermitted }}(向下兼容)</view>
      </view>
      <!--      <view class="row-two">-->
      <!--        <div v-if="item.label" class="label-container">-->
      <!--          <up-tag-->
      <!--            v-for="(i, labelIndex) in item.label.split('、')"-->
      <!--            :key="labelIndex"-->
      <!--            :text="i"-->
      <!--            plain-->
      <!--            type="primary"-->
      <!--            size="mini"-->
      <!--            shape="circle"-->
      <!--            :customStyle="{ marginRight: '5px' }"-->
      <!--          />-->
      <!--        </div>-->
      <!--        <p v-if="item.auth" class="monitor">-->
      <!--          <up-icon-->
      <!--            name="info-circle"-->
      <!--            color="#FABE29"-->
      <!--            size="14"-->
      <!--            :customStyle="{ marginRight: '0.2rem' }"-->
      <!--          />-->
      <!--          重点关注-->
      <!--        </p>-->
      <!--      </view>-->
    </view>
  </view>
</template>

<style lang="scss" scoped>
.lists-item {
  display: flex;
  align-items: center;
  padding: 1rem 0.5rem;
  border-bottom: 1px solid rgba(132, 132, 132, 0.2);
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
    width: calc(100% - 5rem);
    padding-left: 25rpx;

    .row-one {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .coach-info {
        display: flex;
        align-items: center;

        text {
          font-size: 1rem;
          color: #333;
          align-items: center;
          font-weight: 550;
          display: flex;
        }

        .grade {
          color: #f84e26;
          font-size: 0.8rem;
        }
      }

      .car-type {
        color: #777777;
        font-size: 0.8rem;
      }
    }

    //.row-two {
    //  margin-top: 0.4rem;
    //  color: #333;
    //
    //  .label-container {
    //    display: flex;
    //    flex-wrap: wrap;
    //    padding: 0.4rem 1rem 0 0;
    //  }
    //}
  }
}
</style>
