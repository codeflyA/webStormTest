<script setup lang="ts">
import { wenzhouCityList } from "@/constant/cityList";
import request from "@/request/index";
import { getLocation } from "@/utils/location";
import { addQueryParamsToUrl } from "@/utils/url";
import noImg from "./assets/imgs/noImg.png";

const cityList = ref(wenzhouCityList);
const trainTypeList = ref([
  { text: "A1", value: "A1" },
  { text: "A2", value: "A2" },
  { text: "A3", value: "A3" },
  { text: "B1", value: "B1" },
  { text: "B2", value: "B2" },
  { text: "C1", value: "C1" },
  { text: "C2", value: "C2" },
  { text: "C5", value: "C5" },
]);
// const tabData = ref([
//   { name: "推荐", value: 0 },
//   { name: "距离", value: 1 },
//   { name: "价格", value: 2 },
//   { name: "筛选", value: 3 },
// ]);
const tabAct = ref(0);

const dataList = ref<
  {
    id: number;
    //区县码
    district: string;
    //培训机构全称
    name: string;
    //培训机构简称
    shortname: string;
    //培训机构编号
    inscode: string;
    longitude: number;
    latitude: number;
    //距离
    distance: number;
    //累计评分
    totalFraction: number | null;
    //驾校信用分
    insTotalFraction: number;
    //信用等级
    creditLevel: string;
    //评价
    evaluates: string | null;
    //最低套餐名称
    className: string;
    //最低套餐价格
    price: string;
    phone: string;
    //驾校图片
    logo: string;
    //0重点关注，1重点监管,2 重点关注且重点监管
    supervise: number | null;
    //考试通过率
    examPassRate: number;
    //区县中文名称
    district_dictText: string;
    islock: boolean;
    riskNotice: string;
  }[]
>([]);
//z-paging 组件实例
const list = ref();
const searchData = reactive({
  //地区码
  areaCode: "",
  //车型
  trainType: "",
  //驾校名称
  name: "",
  //距离排序
  distanceSort: "",
  //价格排序
  priceSort: "",
  //经度
  lon: 120.209,
  //纬度
  lat: 30.2471,
  // type: 0,
});
// const uiStyle = ref("normal");
//选择的地区还是车型
const topTab = ref("area");

// onShow(() => {
//   ZWJSBridge.onReady(() => {
//     ZWJSBridge.setTitle({
//       title: "我要学车",
//     });
//     ZWJSBridge.getUiStyle().then((res: any) => {
//       if (res.uiStyle === "elder") {
//         uiStyle.value = "elder";
//       }
//     });
//   });
// });

onLoad((option: any) => {
  // if (option.areaCode) {
  //   searchData.areaCode = option.areaCode;
  // }
  // if (option.name) {
  //   searchData.name = option.name;
  // }
  if (!isWeb()) {
    //https://uniapp.dcloud.net.cn/api/location/location.html#getlocation
    //https://uniapp.dcloud.net.cn/tutorial/app-geolocation.html
  } else {
    // setTimeout(() => {
    //   list.value!.reload();
    // }, 100);
  }
});

function handleTopTab(tab: string) {
  topTab.value = tab;
  searchData.areaCode = "";
}

function showRickContent(content: string) {
  uni.showModal({
    content,
    showCancel: false,
  });
}

function handlePhone(phones: string) {
  if (phones) {
    uni.makePhoneCall({
      phoneNumber: phones, //手机号码
    });
  } else {
    uni.showToast({
      title: "暂无联系方式",
      icon: "none",
      duration: 2000,
    });
  }
  // if (phones) {
  //   ZWJSBridge.onReady(() => {
  //     ZWJSBridge.phoneCall({
  //       corpId: phones,
  //     })
  //       .then((result: any) => {
  //         console.log(result);
  //       })
  //       .catch((error: any) => {
  //         console.log(error);
  //       });
  //   });
  // } else {
  //   uni.showToast({
  //     title: "暂无联系方式",
  //     icon: "none",
  //     duration: 5000,
  //   });
  // }
}

function areaChange(e: any) {
  if (e) {
    list.value.reload();
  }
}

function handleSearch() {
  list.value.reload();
}

function tab(val: number) {
  tabAct.value = val;
  // searchData.type = val;
  if (val === 1) {
    searchData.distanceSort =
      searchData.distanceSort === "asc" ? "desc" : "asc";
    searchData.priceSort = "";
  } else if (val === 2) {
    searchData.priceSort = searchData.priceSort === "asc" ? "desc" : "asc";
    searchData.distanceSort = "";
  } else {
    searchData.priceSort = "";
    searchData.distanceSort = "";
  }
  list.value.reload();
}
function gotoDriveSchoolDetail(item) {
  //大坑 app端需要删除className 不然会被注入到下一页的根元素的class属性中。原来的被覆盖
  delete item.className;
  const url = addQueryParamsToUrl(
    "/pages/learnDrive/driveSchoolDetail/driveSchoolDetail",
    item
  );
  uni.navigateTo({
    url,
  });
}
// function check(type: number) {
//   searchData.score = type;
//   list.value.reload();
//   // (this.$refs.popup as any).close();
// }

async function handleLoad(pageNo: number, pageSize: number) {
  if (topTab.value === "trainType") {
    //地区
    searchData.areaCode = "";
  } else if (topTab.value === "area") {
    //车型
    searchData.trainType = "";
  }
  if (!isWeb()) {
    const locationRes = await getLocation();
    searchData.lon = locationRes.longitude;
    searchData.lat = locationRes.latitude;
  }

  const { result } = await request.get("/zlb/applyOnline/searchInstitution", {
    data: {
      ...searchData,
      pageSize,
      pageNo,
    },
  });
  result.records.forEach((item: any, index: number) => {
    result.records[index].evaluates = item.evaluates
      ? item.evaluates.split(",")
      : [];
  });
  list.value.complete(result.records);
}
</script>
<template>
  <view class="learnDriveHome">
    <z-paging
      ref="list"
      v-model="dataList"
      class="list-wrapper"
      default-page-size="5"
      @query="handleLoad"
    >
      <template #top>
        <view class="head-banner">
          <view class="top-tab">
            <text
              :class="topTab === 'area' ? 'checked' : 'uncheched'"
              @click="handleTopTab('area')"
            >
              地区
            </text>
            <text
              :class="topTab === 'trainType' ? 'checked' : 'uncheched'"
              @click="handleTopTab('trainType')"
            >
              车型
            </text>
          </view>
          <view class="search-part">
            <uni-data-select
              v-if="topTab === 'area'"
              v-model="searchData.areaCode"
              class="topSelect"
              clearButton="none"
              cancelButton="none"
              :localdata="cityList"
              :clear="false"
              @change="areaChange"
            />
            <uni-data-select
              v-if="topTab === 'trainType'"
              v-model="searchData.trainType"
              class="topSelect"
              clearButton="none"
              cancelButton="none"
              :localdata="trainTypeList"
              :clear="false"
              @change="areaChange"
            />
            <uni-search-bar
              v-model="searchData.name"
              placeholder="请输入"
              style="width: 75%"
              @confirm="handleSearch"
              @clear="handleSearch"
            />
          </view>
        </view>
        <view class="tabs">
          <view class="tab-item" @click="tab(0)">
            <p :class="{ active: tabAct === 0 }">推荐</p>
          </view>
          <view class="tab-item" @click="tab(1)">
            <p :class="{ active: tabAct === 1 }">
              距离
              <image
                v-if="searchData.distanceSort === ''"
                style="width: 30%"
                mode="widthFix"
                src="./assets/imgs/sort.png"
              />
              <image
                v-if="searchData.distanceSort === 'desc'"
                style="width: 30%"
                mode="widthFix"
                src="./assets/imgs/sort1.png"
              />
              <image
                v-if="searchData.distanceSort === 'asc'"
                style="width: 30%"
                mode="widthFix"
                src="./assets/imgs/sort2.png"
              />
            </p>
          </view>
          <view class="tab-item" @click="tab(2)">
            <p :class="{ active: tabAct === 2 }">
              价格
              <image
                v-if="searchData.priceSort === ''"
                style="width: 30%"
                mode="widthFix"
                src="./assets/imgs/sort.png"
              />
              <image
                v-if="searchData.priceSort === 'desc'"
                style="width: 30%"
                mode="widthFix"
                src="./assets/imgs/sort1.png"
              />
              <image
                v-if="searchData.priceSort === 'asc'"
                style="width: 30%"
                mode="widthFix"
                src="./assets/imgs/sort2.png"
              />
            </p>
          </view>
        </view>
      </template>

      <view
        v-for="(item, index) in dataList"
        :key="index"
        class="listsItem"
        :class="{
          gray:
            item.supervise === 0 ||
            item.supervise === 1 ||
            item.supervise === 2 ||
            item.islock ||
            item.riskNotice,
        }"
        @click="gotoDriveSchoolDetail(item)"
      >
        <view class="left">
          <image :src="item.logo || noImg" />
          <p class="grade">评分：{{ item.insTotalFraction || "--" }}</p>
        </view>
        <view class="right">
          <view class="right1">
            <p>{{ item.shortname }}</p>
            <image
              style="width: 32px"
              mode="widthFix"
              src="./assets/imgs/phone.png"
              @click.stop="handlePhone(item.phone)"
            />
          </view>
          <!--          <view class="right2" :class="{ colors: item.supervise === 1 }">-->
          <!--            <view v-for="(i, averageIndex) in item.average" :key="averageIndex">-->
          <!--              <p>{{ i.trainType }}:</p>-->
          <!--              <p>￥{{ i.averageCost || 5000 }}</p>-->
          <!--            </view>-->
          <!--          </view>-->
          <!--          <p v-if="item.average.length > 0" class="small">-->
          <!--            (近一个月报名学员<br />的合同价格平均值)-->
          <!--          </p>-->
          <!--          <view class="right3">-->
          <!--            <p>{{ item.district_dictText }} {{ item.distance || " " }}km</p>-->
          <!--            <view-->
          <!--              v-if="item.flag"-->
          <!--              style="-->
          <!--                margin-top: -1rem;-->
          <!--                color: rgb(248, 78, 38);-->
          <!--                font-size: 0.8rem;-->
          <!--                text-align: center;-->
          <!--              "-->
          <!--            >-->
          <!--              五星驾校-->
          <!--              <up-rate :value="5" readonly :size="16" :margin="-3" />-->
          <!--            </view>-->
          <!--          </view>-->
          <view class="right4">
            <p v-if="item.supervise === 0" class="monitor">
              <uni-icons
                type="info"
                color="#FABE29"
                size="14"
                style="margin-right: 0.2rem"
              />
              重点关注
            </p>
            <p v-if="item.supervise === 1" class="monitor">
              <uni-icons
                type="info"
                color="#FABE29"
                size="14"
                style="margin-right: 0.2rem"
              />
              重点监管
            </p>
            <p v-if="item.islock" class="monitor">
              <uni-icons
                type="info"
                color="#FABE29"
                size="14"
                style="margin-right: 0.2rem"
              />
              报名锁定
            </p>
            <p
              v-if="item.riskNotice"
              class="risk"
              @click.stop="showRickContent(item.riskNotice)"
            >
              风险提示：1条
            </p>
          </view>
        </view>
      </view>
      <!--      <uni-popup ref="popup" type="center" background-color="#fff">-->
      <!--        <view class="popup-content">-->
      <!--          <p>品质筛选</p>-->
      <!--          <view class="checkList">-->
      <!--            <p @click="check(5)">5星好评</p>-->
      <!--            <p @click="check(4)">4星以上</p>-->
      <!--          </view>-->
      <!--        </view>-->
      <!--      </uni-popup>-->
    </z-paging>
  </view>
</template>

<style scoped lang="scss">
.learnDriveHome {
  min-height: 100vh;
  width: 100%;

  .head-banner {
    background: url("./assets/imgs/banner.png") no-repeat;
    background-size: 100% 100%;
    height: 16rem;
    padding-top: 0.1px;

    //:deep(.uni-data-select) {
    //  border: none;
    //  border-bottom: none;
    //  text-align: center;
    //}
    //
    //:deep(.uni-data-select__input-text) {
    //  color: black;
    //}
    //
    //:deep(.uni-search-bar__box) {
    //  border-style: none;
    //}

    .top-tab {
      position: absolute;
      top: 2rem;
      left: 5%;
      z-index: 0;
      height: 2.5rem;
      display: flex;

      text:nth-child(1) {
        border-top-left-radius: 1rem;
      }

      text:nth-child(2) {
        border-top-right-radius: 1rem;
      }

      .checked {
        height: 2.5rem;
        background-color: #fff;
        color: #528bfc;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 0.5rem;
      }

      .uncheched {
        height: 2.5rem;
        background-color: #528bfc;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 0.5rem;
      }
    }

    .search-part {
      display: flex;
      background-color: #fff;
      margin-top: 4.5rem;
      width: 90%;
      margin-left: 5%;
      border-radius: 5px;
      border-top-left-radius: 0;
      align-items: center;
      justify-content: center;

      view {
        display: flex;
        align-items: center;

        //img {
        //  width: 0.8rem;
        //  height: 0.5rem;
        //  margin: 0.2rem 0.7rem 0 0.5rem;
        //}
      }

      :deep(.uni-select) {
        border: none;
      }

      //:deep(.up-search-bar__cancel) {
      //  display: none;
      //}
    }
  }

  .content {
    margin-top: 20rpx;
  }

  .tabs {
    display: flex;
    background-color: #fff;
    border-bottom: 1px solid #eee;
    margin-top: 0.5rem;

    .tab-item {
      width: 33%;

      p {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 60%;
        margin-left: 20%;
        padding: 0.6rem 0;

        //img {
        //  width: 16px;
        //}
      }

      .active {
        border-bottom: 3px solid #528bfc;
      }
    }
  }

  .list-wrapper {
    background-color: #fff;

    .listsItem {
      display: flex;
      align-items: center;
      padding: 1rem;
      border-bottom: 1px solid rgba(132, 132, 132, 0.2);
      height: auto;
      color: #999;
      font-size: 0.9rem;

      .left {
        width: 7rem;
        height: 7rem;

        image {
          width: 80%;
          height: 80%;
          border-radius: 0.5rem;
        }

        .grade {
          color: rgb(248, 78, 38);
        }
      }

      .right {
        width: calc(100% - 7rem);

        .right1 {
          display: flex;
          justify-content: space-between;
          align-items: end;
          margin-bottom: 0.4rem;

          //img {
          //  width: 1.5rem;
          //  height: 1.5rem;
          //}

          p:nth-child(1) {
            font-size: 1.2rem;
            color: black;
            align-items: baseline;
            font-weight: 550;
          }
        }

        .right2 {
          display: flex;
          align-items: baseline;

          view {
            display: flex;
            margin-right: 0.7rem;
            align-items: center;
            color: rgb(5, 190, 128);
          }
        }

        .colors {
          view {
            color: #999;
          }
        }

        .small {
          font-size: 0.8rem;
        }

        .right3 {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.4rem;

          p:nth-child(1) {
            color: #999;
          }
        }

        .right4 {
          display: flex;
          flex-wrap: wrap;

          p {
            border-radius: 2px;
            padding: 1px 10px;
            margin-right: 10px;
            margin-bottom: 3px;
            font-size: 14px;
          }

          .monitor {
            background-color: rgba(250, 190, 41, 0.3);
            color: #fabe29;
          }

          .risk {
            background-color: rgba(248, 78, 38, 0.3);
            color: rgb(248, 78, 38);
          }
        }
      }
    }

    .gray {
      background-color: #f9f9f9;

      .right {
        .right1 {
          p:nth-child(1) {
            color: #999;
          }
        }

        .right3 {
          p:nth-child(1) {
            color: #999;
          }
        }
      }
    }
  }

  .popup-content {
    height: 100px;
    width: 300px;
    border-radius: 10px;
    padding: 5%;
    color: rgb(117, 118, 119);

    .checkList {
      display: flex;
      margin-top: 4%;

      p {
        background-color: rgba(117, 118, 119, 0.1);
        padding: 3px 10px;
        margin-right: 5px;
        border-radius: 5px;
      }
    }
  }
}

.elderMainContainer {
  p,
  .tabs {
    font-size: 1.4rem !important;
    margin-right: 0 !important;
  }

  .right1 {
    p:nth-child(1) {
      font-size: 1.6rem !important;
    }
  }

  :deep(.up-search-bar__box-search-input) {
    font-size: 1.4rem !important;
  }

  :deep(.up-data-select__input-text) {
    font-size: 1.4rem !important;
  }
}

:deep(.up-data-select__selector-scroll) {
  max-height: 300px !important;
}

:deep(.up-data-select__selector) {
  z-index: 999;
}

:deep(.up-data-select__selector-item),
:deep(.up-data-select__input-placeholder) {
  font-size: 1rem !important;
}
</style>
