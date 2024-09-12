<script setup lang="ts">
// import dayjs from "dayjs";
import request from "@/request/index";

// 定义数据
const dataSource = ref({
  name: "",
  address: "",
  hospitalType: 1,
  level: "",
  phone: "",
  detail: "",
  latitude: 0,
  longitude: 0,
});
const markers = ref<any[]>([]);
// 初始化加载数据
const hospitalId = ref("");
// 地图弹窗引用
// const mapPopup = ref(null);
const showMap = ref(false);
// 获取医院数据
async function getData() {
  const { result } = await request.get("/zlb/baseZlbHospitalInfo/queryById", {
    params: {
      id: hospitalId.value,
      pageSize: 1,
      pageNo: 1,
    },
  });
  dataSource.value = result;
  markers.value = [
    {
      id: 1,
      latitude: result.latitude,
      longitude: result.longitude,
      iconPath: "../../static/location@3x.png",
      callout: {
        display: "ALWAYS",
        content: result.name,
        borderRadius: 10,
      },
    },
  ];
}

async function openMapPopup() {
  showMap.value = true;
}
async function closeMapPopup() {
  showMap.value = false;
}
// 拨打电话
function callPhone(phone: string) {
  if (phone) {
    uni.makePhoneCall({
      phoneNumber: phone, //手机号码
    });
  } else {
    uni.showToast({
      title: "暂无联系方式",
      icon: "error",
    });
  }
}

onLoad((option) => {
  if (option?.id) {
    hospitalId.value = option.id;
    getData();
  }
});
</script>

<template>
  <view class="hospitalDetail">
    <image
      class="banner"
      src="../assets/imgs/exam-banner.png"
      mode="widthFix"
    />

    <view class="hospital-info">
      <view class="hospital-info-item">
        <view class="flex-shrink-0 flex-grow-0 basis-20 font-bold">
          名 称：
        </view>
        <view>{{ dataSource.name }}</view>
      </view>

      <view class="hospital-info-item">
        <view class="flex-shrink-0 flex-grow-0 basis-20 font-bold">
          地 址：
        </view>
        <view @click="openMapPopup">
          {{ dataSource.address }}
        </view>
        <image
          style="width: 40px; height: 40px; margin-left: 5px"
          class="flex-shrink-0 flex-grow-0"
          src="../assets/imgs/location.png"
          mode="widthFix"
        />
      </view>

      <view class="hospital-info-item">
        <view class="flex-shrink-0 flex-grow-0 basis-20 font-bold">
          {{ dataSource.hospitalType === 2 ? "合作医院" : "医院等级" }}
        </view>
        <view @click="openMapPopup">{{ dataSource.level }} </view>
      </view>

      <view class="hospital-info-item">
        <view class="flex-shrink-0 flex-grow-0 basis-20 font-bold">
          公开电话：
        </view>
        <view @click="callPhone(dataSource.phone)">
          {{ dataSource.phone }}
        </view>
      </view>

      <view class="hospital-info-item">
        <view class="flex-basis-20 font-bold">医院介绍：</view>
        <view>{{ dataSource.detail }} </view>
      </view>
    </view>

    <up-popup :show="showMap">
      <view class="popup-wrapper">
        <view class="popup-title">
          <p>地址位置</p>
          <icon name="close" :size="24" @click="closeMapPopup" />
        </view>
        <!--        <map-->
        <!--          v-if="dataSource.latitude"-->
        <!--          :latitude="dataSource.latitude"-->
        <!--          :longitude="dataSource.longitude"-->
        <!--          :markers="markers"-->
        <!--          style="width: 100%; height: 300px"-->
        <!--        >-->
        <!--          <cover-view #="callout">-->
        <!--            <cover-view marker-id="1" />-->
        <!--          </cover-view>-->
        <!--        </map>-->
      </view>
    </up-popup>
  </view>
</template>

<style lang="scss" scoped>
.hospitalDetail {
  background-color: #f8f8f8;
  //min-height: 100vh;
  padding-top: 0.1px;
  position: relative;

  .banner {
    width: 100%;
  }

  .hospital-info {
    background-color: #fff;
    padding: 10px 10px;
    > .hospital-info-item {
      width: 100%;
      display: flex;
      margin-bottom: 20px;
    }
  }

  .popup-wrapper {
    border-radius: 0.3rem;
    overflow: hidden;
  }

  .popup-title {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem;
    border-top-left-radius: 0.3rem;
    border-top-right-radius: 0.3rem;
    background-color: #fff;
  }
}
</style>
