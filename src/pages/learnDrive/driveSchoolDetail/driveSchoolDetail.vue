<script setup lang="ts">
// import { onLoad, onShow, onHide, onPageScroll } from "@dcloudio/uni-app";
import request from "@/request/index";
import useZPaging from "@/uni_modules/z-paging/components/z-paging/js/hooks/useZPaging.js";
import { parseUrlQueryParams } from "@/utils/url";
// 必须导入需要用到的页面生命周期（即使在当前页面上没有直接使用到）
import { onPageScroll, onReachBottom } from "@dcloudio/uni-app";
import type {
  carTypeList,
  ISchoolDetail,
} from "@/pages/learnDrive/driveSchoolDetail/type";
import noImg from "../assets/imgs/noImg.png";

import phone from "../assets/imgs/phone.png";
import CarType from "./component/carType.vue";
import Coach from "./component/Coach.vue";
import Comment from "./component/Comment.vue";
import Introduce from "./component/introduce.vue";
import Site from "./component/site.vue";
// const uiStyle = ref("normal");
const tabData = ref([
  { name: "车型", value: 0 },
  { name: "场地", value: 1 },
  { name: "教练", value: 2 },
  { name: "评价", value: 3 },
  { name: "简介", value: 4 },
]);
const tabAct = ref(0);
const schoolId = ref("");
const schoolDetail = ref<ISchoolDetail>();
//五种类型 车型 场地 教练 评价 简介
const dataList = ref<any[]>([]);
const infos = ref({
  longitude: "",
  latitude: "",
  // supervise: "",
  // islock: "",
  // address: "",
});
const searchUrl = ref("/zlb/tmc/tMInstitutionClass/list");
const listRef = ref<ZPagingInstance>();
// 类似mixins，如果是页面滚动务必要写这一行，并传入当前ref绑定的paging，注意此处是paging，而非paging.value
useZPaging(listRef);
function callPhone(phones: string | undefined) {
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
  //     ZWJSBridge.phoneCall({ corpId: phones })
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
//调用导航
function guide() {
  if (!infos.value.longitude || !infos.value.latitude) {
    uni.showToast({
      title: "未获取到该驾校定位信息!",
      icon: "none",
      duration: 2000,
    });
  }

  // infos.value.parkingName = schoolDetail.value.name;
  // infos.value.address = schoolDetail.value.address;

  // 根据不同平台使用不同的导航方式
  // if (isDtDreamApp()) {
  //   ZWJSBridge.onReady(() => {
  //     ZWJSBridge.getLocation()
  //       .then(() => {
  //         ZWJSBridge.openLink({
  //           url: `zwfw://openThirdMap?longitude=${infos.value.longitude}&latitude=${infos.value.latitude}&locationName=${infos.value.parkingName}`,
  //         })
  //           .then((result: any) => {
  //             console.log(result);
  //           })
  //           .catch((error: any) => {
  //             console.log(error);
  //           });
  //       })
  //       .catch((error: any) => {
  //         uni.showModal({
  //           title: "定位服务未开启",
  //           content: '请在"设置->应用权限"中打开的位置权限，以便获取您的位置。',
  //           showCancel: false,
  //           confirmText: "我知道了",
  //         });
  //       });
  //   });
  // } else if (isWeixin()) {
  //   window.wx.openLocation({
  //     longitude: parseFloat(infos.value.longitude),
  //     latitude: parseFloat(infos.value.latitude),
  //     name: infos.value.parkingName,
  //     address: infos.value.address || "",
  //   });
  // } else {
  //   my.openLocation({
  //     longitude: infos.value.longitude,
  //     latitude: infos.value.latitude,
  //     name: infos.value.parkingName,
  //     address: infos.value.address || "",
  //   });
  // }
}

async function getSchoolDetail() {
  const { result } = await request.get(
    "/zlb/tim/tMInstitution/getInstitutionDetails",
    {
      data: { inscode: schoolId.value },
    }
  );
  schoolDetail.value = result;
  // schoolDetail.value.evaluate = result.evaluate ? res.evaluate.split(",") : [];
  // uni.showToast({
  //   title: "未找到该驾校相关信息!",
  //   icon: "none",
  //   duration: 5000,
  // });
}

function tab(val: number) {
  tabAct.value = val;
  switch (val) {
    case 0:
      //车型
      searchUrl.value = "/zlb/tmc/tMInstitutionClass/list";
      break;
    case 1:
      //场地
      searchUrl.value = "/gzpt/region/district";
      break;
    case 2:
      //教练
      searchUrl.value = "/zlb/tmc/tMCoach/list2";
      break;
    case 3:
      //评价
      searchUrl.value = "/gzpt/tMEvaluation/zlb/list";
      break;
    case 4:
      //简介
      searchUrl.value = "/gzpt/institutionDetails/append";
      break;
  }
  (listRef.value as any).reload();
}

async function handleLoad(pageNo: number, pageSize: number) {
  const { result } = await request.get(searchUrl.value, {
    data: {
      inscode: schoolId.value,
      pageSize,
      pageNo,
    },
  });
  listRef.value?.complete(result.records);
}

// onLoad((options) => {
//   infos.value.longitude = options?.longitude;
//   infos.value.latitude = options?.longitude;
//   // infos.value.supervise = option.supervise ? option.supervise : "";
//   infos.value.islock = options?.islock;
//   schoolId.value = options?.id;
// });
onMounted(() => {
  const urlObj: any = parseUrlQueryParams();
  const { longitude, latitude, inscode } = urlObj;
  infos.value.longitude = longitude;
  infos.value.latitude = latitude;
  // infos.value.islock = islock;
  schoolId.value = inscode;
  getSchoolDetail();
});

// function isWeixin() {
//   return /micromessenger/i.test(navigator.userAgent);
// }
//
// function isDtDreamApp() {
//   return isWeixin() || /ZWJSBridge/i.test(navigator.userAgent);
// }
</script>

<template>
  <view class="driveSchoolDetail">
    <z-paging
      ref="listRef"
      v-model="dataList"
      class="list-wrapper"
      :default-page-size="5"
      @query="handleLoad"
    >
      <template #top>
        <view class="head-banner">
          <up-swiper
            v-if="schoolDetail?.logoList?.[0]"
            height="400rpx"
            :list="schoolDetail.logoList"
            indicator
            indicatorMode="line"
            circular
          />
          <image v-else :src="noImg" style="height: 400rpx; width: 100%" />
        </view>
        <view class="schoolInfo">
          <view class="top">
            <view class="left">
              <view class="school">
                <p>
                  <span class="title">{{ schoolDetail?.name }}</span>
                </p>
              </view>
            </view>
            <view class="right" @click="callPhone(schoolDetail?.phone)">
              <image style="width: 50rpx" mode="widthFix" :src="phone" />
            </view>
          </view>
          <view>
            <view>
              <p class="otherInfo">
                近期学员考试通过率:<span>{{ schoolDetail?.rate }}%</span>
              </p>
            </view>
            <view class="bottom" @click="guide">
              <view class="left">
                <span class="one">地址：{{ schoolDetail?.address }}</span>
              </view>
            </view>
          </view>
        </view>
        <view class="tab">
          <view
            v-for="(item, index) in tabData"
            :key="index"
            class="tabs"
            @click="tab(index)"
          >
            <p :class="{ active: tabAct === index }">{{ item.name }}</p>
          </view>
        </view>
      </template>

      <CarType v-if="tabAct === 0" :dataList="dataList" />
      <Site v-if="tabAct === 1" :dataList="dataList" />
      <Coach v-if="tabAct === 2" :dataList="dataList" />
      <Comment v-if="tabAct === 3" :dataList="dataList" />
      <Introduce v-if="tabAct === 4" :instro="dataList" />
    </z-paging>
  </view>
</template>

<style scoped lang="scss">
.driveSchoolDetail {
  height: 100vh;
  width: 100%;
  .head-banner {
    z-index: -1;
    img {
      width: 100%;
      height: 100%;
    }
  }
  :deep(.schoolInfo) {
    background-color: #fff;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    margin-top: -5px;
    .top {
      display: flex;
      justify-content: space-between;
      padding: 10px 15px 5px;
      .left {
        font-size: 0.8rem;
        width: 85%;
        .school {
          p {
            display: flex;
            .title {
              font-size: 1rem;
              color: black;
              font-weight: bold;
              width: 100%;
              display: inline-block;
            }
          }
        }
      }
      .right {
        text-align: right;
        width: 15%;
        img {
          width: 53%;
        }
      }
    }
    .otherInfo {
      padding: 2px 15px;
      color: #777777;
      font-size: 0.85rem;
      span {
        color: #f84e26;
        margin-left: 5px;
      }
    }
    .bottom {
      margin-top: 4px;
      padding: 10px 15px;
      border-top: 1px solid #f6f6f6;
      font-size: 0.85rem;
      .left {
        display: flex;
        align-items: center;
        .one {
          color: #121212;
          margin: 0 0 5px;
        }
      }
    }
  }
  .tab {
    display: flex;
    background-color: #fff;
    border-bottom: 1px solid #eee;
    margin-top: 0.5rem;
    .tabs {
      width: 20%;
      p {
        text-align: center;
        width: 60%;
        margin-left: 20%;
        padding: 0.6rem 0;
      }
      .active {
        border-bottom: 3px solid #528bfc;
      }
    }
  }
  .chooseContent {
    background-color: #fff;
  }
}
</style>
<route>
{
"style": { "navigationBarTitleText": "驾校详情" }
}
</route>
