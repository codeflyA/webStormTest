import request from "@/request/index";
import authorizeUtils from "@/utils/authorizeUtils";
// #ifdef APP-PLUS
import { faceLivenessAndVerify } from "@/uni_modules/uni-bluetooth";
import crypto from "@/utils/crypto";
import { recordByOrderId } from "@/request/getPeopleInfo";

const baiduFacePlugin = uni.requireNativePlugin("BaiDuFaceVerifyModule");
// #endif
const isIos = uni.getSystemInfoSync().platform === "ios";
function initSdk(options) {
  if (isIos) {
    // #ifdef APP-PLUS
    baiduFacePlugin.initSdkConfig(options);
    // #endif
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      uni.hideLoading();
      resolve();
    }, 3000);
  });
}

/**
 *  人脸识别
 * @param certifyId 认证id
 */
export function verifyAuth(certifyId) {
  return new Promise((reject, resolve) => {
    if (isIos) {
      baiduFacePlugin.faceLivenessAndVerify(
        {
          orderId: certifyId,
        },
        (res) => {
          if (res.verifyResult) {
            reject(res);
          } else {
            resolve(res);
          }
        }
      );
    } else {
      console.log("进入Android人脸验证");
      faceLivenessAndVerify({
        licenseId: "zljp-face-android",
        livenessSize: 1,
        timeDetectModule: 8,
        zzId: certifyId,
        cid: "f1344e5c91da479f973bd4afbe760d18",
        success(res) {
          console.log(res, 999);
          if (res.code === 200) {
            // uni.showLoading({
            //   title: "实人认证成功",
            //   mask: true,
            // });
            reject(res);
          } else {
            resolve(res);
          }
        },
      });
    }
  });
}

/**
 * 实人认证
 */
export function toAuth(toAuthData, type = "") {
  return new Promise(async (resolve, reject) => {
    console.log(toAuthData);
    const authFlag = await authorizeUtils.showAuthTipModal(
      "android.permission.CAMERA"
    );
    if (!authFlag) {
      resolve(authFlag);
      return;
    }
    const authFlag2 = await authorizeUtils.showAuthTipModal(
      "android.permission.WRITE_EXTERNAL_STORAGE"
    );
    if (!authFlag2) {
      resolve(authFlag);
      return;
    }
    console.log("toAuthData");
    // const data = {
    //   name,
    //   idcard,
    //   type,
    // };
    //   data: crypto(JSON.stringify(toAuthData)),
    let certifyId;
    try {
      console.log(123);
      const faceAuthRecordRes = await request.post(
        "/app/face/getOrderId",
        crypto(JSON.stringify({ ...toAuthData, ts: new Date().getTime() }))
      );
      console.log(faceAuthRecordRes, 1);
      certifyId = faceAuthRecordRes.result.orderId;
      uni.showLoading({
        title: "正在发起实人认证请求",
        mask: true,
      });
    } catch (e) {
      console.error(e, 123);
      // uni.showToast({
      //   title: "认证请求失败",
      //   icon: "error",
      //   success() {
      //     reject(message);
      //   },
      // });
      reject(e);
      return;
    }
    // const faceAuthRecordRes = await that.$u.api.getCertifyId(data);
    // const certifyId = faceAuthRecordRes.orderId;
    // const { certifyId, passed } = faceAuthRecord;
    // if (passed) {
    //   resolve(certifyId);
    //   return;
    // }
    if (isIos) {
      await initSdk({
        livenessSize: 1,
        timeDetectModule: 8,
        licenseId: "zlbunify-face-ios",
        cid: "f1344e5c91da479f973bd4afbe760d18",
        orderId: certifyId,
      });
    }
    // uni.hideLoading();
    let error;
    try {
      const res = await verifyAuth(certifyId);
      console.log(res, "人脸认证成功");
    } catch (e) {
      console.log("人脸认证失败");
      console.log(e, "人脸认证失败");
      error = e.message || JSON.stringify(e);
      uni.showLoading({
        title: error,
        mask: true,
      });
      reject(e);
    }
    // uni.showLoading({
    //   title: "正在查询认证结果",
    //   mask: true,
    // });
    try {
      //人脸认证成功 后端可以根据数据certifyId 查到拍到的人脸图片 存进数据库
      await recordByOrderId(certifyId);
      uni.showLoading({
        title: "实人认证成功",
        mask: true,
      });
      resolve(true);
      // await that.$u.api.describeFaceVerify({
      //   certifyId,
      //   errorMessage: error || null,
      // });
    } finally {
      uni.hideLoading();
    }
  });
}
