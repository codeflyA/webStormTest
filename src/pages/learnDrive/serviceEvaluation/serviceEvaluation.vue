<script setup lang="ts">
import { wenzhouCityList } from "@/constant/cityList";
import request from "@/request/index";
import dayjs from "dayjs";
import serviceBanner from "../assets/imgs/serviceBanner.png";
// const grades = {
//   AA: "蓝码",
//   A: "蓝码",
//   B: "黄码",
//   C: "橙码",
//   D: "橙码",
// };
//
// const uiStyle = ref("normal");
const rankList = ref([]);
const currentDate = ref("");
const searchData = reactive({
  areaCode: "",
});
const serviceBannerBK = computed(() => {
  return `url(${serviceBanner}) no-repeat`;
});
const cityList = ref(wenzhouCityList);

const list = ref(null);

onMounted(() => {
  currentDate.value = dayjs().format("YYYY/MM/DD");
});
function areaChange(e: string) {
  if (e) {
    list.value?.reload();
  }
}

async function handleLoad(pageNo: number, pageSize: number) {
  const { result } = await request.get(
    `/gzpt/institutionCredit/list`,
    {
      data: {
        pageNo,
        pageSize,
        district: searchData.areaCode,
      },
    },
    1
  );
  list.value?.complete(result.records);
}
</script>

<template>
  <view class="serviceEvaluation">
    <z-paging
      ref="list"
      v-model="rankList"
      class="list-wrapper"
      :default-page-size="100"
      @query="handleLoad"
    >
      <template #top>
        <view class="head-banner">
          <view class="title">
            <p>驾校排名</p>
            <p>更新时间：{{ currentDate }}</p>
            <view class="search-part">
              <uni-data-select
                v-model="searchData.areaCode"
                class="topSelect"
                clearButton="none"
                cancelButton="none"
                :localdata="cityList"
                :clear="false"
                @change="areaChange"
              />
            </view>
          </view>
        </view>
      </template>
      <view class="table">
        <view class="tr th">
          <view class="td wper15">序号</view>
          <view class="td wper55">培训机构</view>
          <view class="td wper30">评分</view>
        </view>
        <view class="tbody">
          <view v-for="(item, index) in rankList" :key="index" class="tr">
            <view class="td wper15">{{ index + 1 }}</view>
            <view class="td wper55">{{ item.inscode_dictText }}</view>
            <view class="td wper30">{{ item.fraction }}</view>
          </view>
        </view>
      </view>
    </z-paging>
  </view>
</template>

<style lang="scss" scoped>
.serviceEvaluation {
  height: 100vh;
  width: 100%;
  background-color: #fff;

  :deep(.head-banner) {
    background: v-bind(serviceBannerBK);
    background-size: 100% 100%;
    height: 22%;
    padding-top: 0.1px;
    color: white;
    .uni-select__selector-item {
      color: #333;
    }
    //:deep(.up-select__selector) {
    //  z-index: 20;
    //  color: #333;
    //}

    //:deep(.up-select__selector-scroll) {
    //  max-height: 300px !important;
    //  z-index: 999;
    //}

    //:deep(.up-select__selector-item),
    //:deep(.up-select__input-placeholder) {
    //  font-size: 1rem !important;
    //}

    .title {
      margin-top: 8%;
      margin-left: 5%;

      p:nth-child(1) {
        font-size: 3vh;
        font-weight: 550;
        margin-bottom: 10px;
        letter-spacing: 1.5px;
      }

      p:nth-child(2) {
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }

  .table {
    width: 100%;
    .wper15 {
      width: 15%;
    }
    .wper20 {
      width: 20%;
    }
    .wper30 {
      width: 30%;
    }
    .wper45 {
      width: 45%;
    }
    .wper55 {
      width: 55%;
    }

    .th {
      background-color: rgb(228, 235, 255);
    }

    .tr {
      display: flex;
      padding: 10px 0;

      .td {
        text-align: center;
        //overflow: hidden;
        //white-space: nowrap;
        //text-overflow: ellipsis;
      }
    }

    .tbody {
      .tr:nth-child(2n) {
        background-color: rgb(247, 247, 247);
      }
    }
  }
}

.search-part {
  display: flex;
  background-color: #fff;
  margin-top: 5px;
  width: 30%;
  border-radius: 5px;
  align-items: center;
  justify-content: center;

  view {
    display: flex;
    align-items: center;

    img {
      width: 0.8rem;
      height: 0.5rem;
      margin: 0.2rem 0.7rem 0 0.5rem;
    }
  }
}
</style>
