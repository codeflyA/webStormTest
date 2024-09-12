<script setup lang="ts">
import { wenzhouCityList } from "@/constant/cityList";
import request from "@/request/index";
import { getLocation } from "@/utils/location";
import noImg from "../assets/imgs/noImg.png";
import type { IhospitalList } from "@/pages/learnDrive/physicalExamination/types";
const currentTab = ref<number>();
const dataList = ref<IhospitalList[]>([]);
// const uiStyle = ref("normal");
const searchParams = reactive({
  //默认经度
  lon: 120.209,
  //默认纬度
  lat: 30.2471,
  hospitalName: "",
  areaCode: "",
  type: "",
  score: "",
});

const cityList = ref(wenzhouCityList);

const list = ref();

async function handleLoad(pageNo: number, pageSize: number) {
  // if (searchParams.lon && !isWeb()) {
  //   const { result } = await request.get(
  //     `/zlb/baseZlbHospitalInfo/searchHospital`,
  //     {
  //       data: {
  //         ...searchParams,
  //         pageSize,
  //         pageNo,
  //       },
  //     }
  //   );
  //   list.value?.complete(result.records);
  // } else if (isWeb()) {
  //   const { result } = await request.get(
  //     `/zlb/baseZlbHospitalInfo/searchHospital`,
  //     {
  //       data: {
  //         ...searchParams,
  //         pageSize,
  //         pageNo,
  //       },
  //     }
  //   );
  //   list.value?.complete(result.records);
  // }
  const { result } = await request.get(
    `/zlb/baseZlbHospitalInfo/searchHospital`,
    {
      data: {
        ...searchParams,
        pageSize,
        pageNo,
      },
    }
  );
  list.value?.complete(result.records);
}

function handleTabChange(tab: number) {
  currentTab.value = tab;
  switch (tab) {
    case 0:
      searchParams.score = "";
      searchParams.type = "";
      break;
    case 1:
      searchParams.type = "1";
      searchParams.score = "";
      break;
    case 2:
      searchParams.type = "2";
      searchParams.score = "";
      break;
    // case 3:
    //   searchParams.score = "4";
    //   searchParams.type = "";
    //   break;
    default:
      break;
  }
  list.value?.reload();
}
function areaChange(value: string) {
  if (value) {
    list.value?.reload();
  }
}

function handleSearch() {
  console.log(searchParams);
  list.value?.reload();
}
function gotoHospitalDetail(id) {
  uni.navigateTo({
    url: `/pages/learnDrive/physicalExamination/hospitalDetail?id=${id}`,
  });
  // console.log(searchParams);
  // list.value?.reload();
}

onMounted(async () => {
  // Location logic here (simplified for brevity)
  // You may need to adjust this based on your specific requirements
  // uni.getLocation({
  //   type: "wgs84",
  //   success: (res) => {
  //     searchParams.lon = res.longitude;
  //     searchParams.lat = res.latitude;
  //     handleLoad(1, 5);
  //   },
  //   fail: () => {
  //     handleLoad(1, 5);
  //   },
  // });
  try {
    const res = await getLocation();
    searchParams.lon = res.longitude;
    searchParams.lat = res.latitude;
  } catch (error) {
    console.log(error);
  }
  handleLoad(1, 5);
});
</script>

<template>
  <view class="hospitalList">
    <z-paging
      ref="list"
      v-model="dataList"
      class="list-wrapper"
      :default-page-size="5"
      bg-color="#F8F8F8"
      :auto="false"
      @query="handleLoad"
    >
      <template #top>
        <view class="header-banner">
          <view class="search-part">
            <!-- @vue-ignore -->
            <uni-data-select
              v-model="searchParams.areaCode"
              class="topSelect"
              clearButton="none"
              cancelButton="none"
              :localdata="cityList"
              :clear="false"
              @change="areaChange"
            />
            <!-- <img src="@/static/register/down.png" style="width: 10px;"></img> -->
            <uni-search-bar
              v-model="searchParams.hospitalName"
              placeholder="输入医院名称"
              style="width: 75%"
              @confirm="handleSearch"
              @clear="handleSearch"
            />
          </view>
        </view>
        <view class="tabs">
          <view class="tab-item" @click="handleTabChange(0)">
            <text :class="{ checked: currentTab === 0 }">推荐</text>
          </view>
          <view class="tab-item" @click="handleTabChange(1)">
            <text :class="{ checked: currentTab === 1 }">距离</text>
          </view>
          <view class="tab-item" @click="handleTabChange(2)">
            <text :class="{ checked: currentTab === 2 }">价格</text>
          </view>
        </view>
      </template>

      <view
        v-for="item in dataList"
        :key="item.id"
        class="list-item"
        @click="gotoHospitalDetail(item.id)"
      >
        <view class="left">
          <image :src="item.logo || noImg" />
          <view class="info">
            <text class="name">{{ item.name }}</text>
            <text class="address">{{ item.address }}</text>
            <text class="fee">￥{{ item.price }}</text>
          </view>
        </view>
        <view class="right">
          <text>{{ item.distance || "" }}KM</text>
        </view>
      </view>
    </z-paging>
  </view>
</template>

<style lang="scss" scoped>
.hospitalList {
  background-color: #f8f8f8;
  min-height: 100vh;
  padding-top: 0.1px;
  position: relative;

  //:deep(.up-select__selector-scroll) {
  //  max-height: 300px !important;
  //}
  //
  //:deep(.up-select__selector) {
  //  z-index: 999;
  //}
  //
  //:deep(.up-select__selector-item),
  //:deep(.up-select__input-placeholder) {
  //  font-size: 1rem !important;
  //}

  .header-banner {
    background: url("../assets/imgs/examBanner.png") no-repeat;
    background-size: 100% 100%;
    height: 22%;
    padding-top: 0.1px;

    //:deep(.up-select) {
    //  border: none;
    //  border-bottom: none;
    //  text-align: center;
    //}
    //
    //:deep(.up-select__input-text) {
    //  color: black;
    //}
    //
    //:deep(.up-search-bar__box) {
    //  border-style: none;
    //}

    .search-part {
      display: flex;
      background-color: #fff;
      margin-top: 8%;
      width: 90%;
      margin-left: 5%;
      border-radius: 5px;
      align-items: center;
      justify-content: center;
      .uni-select {
        border: none;
      }
      //:deep(.up-search-bar__cancel) {
      //  display: none;
      //}
    }
  }

  .tabs {
    display: flex;
    background-color: #fff;
    border-bottom: 1px solid #eee;
    margin-top: 0.5rem;

    .tab-item {
      width: 33%;

      text {
        text-align: center;
        width: 60%;
        margin-left: 20%;
        padding: 0.6rem 0;
        display: inline-block;

        &.checked {
          border-bottom: 3px solid #528bfc;
        }
      }
    }
  }

  .list-wrapper {
    background-color: #fff;

    .list-item {
      display: flex;
      justify-content: space-between;
      padding: 1rem;
      border-bottom: 1px solid #eee;
      background-color: #fff;

      .left {
        display: flex;
        align-items: center;

        image {
          width: 7rem;
          height: 6rem;
          margin-right: 0.8rem;
        }

        .info {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          width: calc(100% - 7rem);

          .name {
            color: #333333;
            font-size: 1.1rem;
            font-weight: bold;
          }

          .address {
            color: #777777;
            font-size: 0.9rem;
          }

          .fee {
            color: #f84e26;
            font-size: 1rem;
          }
        }
      }

      .right {
        display: flex;
        align-items: center;
        color: #777777;
        font-size: 1rem;
      }
    }
  }
}

.elder-main-container {
  text {
    font-size: 1.4rem !important;
  }

  .name {
    font-size: 1.6rem !important;
  }
}
</style>
