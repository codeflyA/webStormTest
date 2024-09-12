import request from "@/request";
import { getCoachInfo, recordByOrderId } from "@/request/getPeopleInfo";
import { useUserLoginInfoStore } from "@/stores/userInfo";
import authorizeUtils from "@/utils/authorizeUtils";
import { verifyAuth } from "@/utils/cloudAuth";
import crypto from "@/utils/crypto";
import type { IQRcodeDataJsonObj } from "@/types/IScanningCodeAndTraining";
let coachInfo;
let USER_ID;

export async function getQRcodeDataJsonObj() {
  const { result: qrcode } = await uniScanCode();
  const {
    data: QRcodeDataJsonString,
    message,
    errorcode,
  } = await request.post(
    `/zljp/getQRcodeContent?v=33031.0.0.e2&ts=${new Date().getTime()}`,
    {
      qrcode,
    }
  );
  console.log(QRcodeDataJsonString, message, errorcode);
  if (errorcode === 1) {
    uni.showToast({
      title: message,
      icon: "none",
    });
    return false;
  }
  const QRcodeDataJsonObj: IQRcodeDataJsonObj =
    JSON.parse(QRcodeDataJsonString);
  return QRcodeDataJsonObj;
}

export async function scanningCodeAndTrainingForCoach() {
  USER_ID = useUserLoginInfoStore().USER_ID;
  const { result: coachInfo1 } = await getCoachInfo();
  coachInfo = coachInfo1;
  console.log(coachInfo, 999);
  const QRcodeDataJsonObj = await getQRcodeDataJsonObj();
  console.log(QRcodeDataJsonObj, "QRcodeDataJsonObj");
  if (!QRcodeDataJsonObj) {
    return false;
  }
  if (
    QRcodeDataJsonObj.eventtype !== "1" &&
    QRcodeDataJsonObj.eventtype !== "4"
  ) {
    uni.showToast({
      title: "您扫描的是学员码，请重新扫描正确二维码！",
      icon: "none",
      duration: 5000,
    });
    return false;
  }

  const judgerangeRes = await judgerange(QRcodeDataJsonObj);
  const rangeAndFaceResult = await handleRangeAndFaceRecognition(judgerangeRes);
  if (!rangeAndFaceResult) {
    return false;
  }
  await handleEventtype(QRcodeDataJsonObj);
}
//作弊判断
async function judgerange({
  subject,
  imei,
  log,
  lat,
  eventtype,
  type,
}): Promise<{
  data: {
    isuseface: string;
    livenessSize: number;
  };
  errorcode: number;
  message: string;
}> {
  const position = await getLocation();
  const res = await request.postCrypto(
    `/zljp/judgerange?v=33031.0.0.e2&ts=${new Date().getTime()}`,
    {
      // uuid: USER_ID,
      certId: USER_ID,
      lat: position.latitude, //个人手机端纬度
      lng: position.longitude, //个人手机端经度
      subject: subject, //当前培训科目参数 -- 在1.解析二维码接口中 subject 字段
      //这里其实不用传
      traintype: "c1", //培训车型 -- 在选择的学员信息中返回
      devImei: imei, //终端imei号 -- 在1.解析二维码接口中 imei 字段
      devLog: log, //终端Log参数 -- 在1.解析二维码接口中 log 字段
      devLat: lat, //终端Log参数 -- 在1.解析二维码接口中 lat 字段
      eventtype: eventtype, //终端Log参数 -- 在1.解析二维码接口中 eventtype 字段
      type: type, //培训类型type参数 -- 在1.解析二维码接口中 type 字段
      roletype: 1, //0:学员 1:教练 2:考核员
      inscode: coachInfo.inscode, //培训机构统一编号参数 -- 在选择的学员信息中返回
      stunum: "111", //学员编号 -- 在选择的学员信息中返回
      coachnum: coachInfo.coachnum, //教练员编号 -- 在登陆后详情接口获取
      city: "3303",
    }
  );
  console.log(res, "judgerange");
  return res;
}
export async function handleEventtype({
  subject,
  eventtype,
  type,
  imei,
  classid,
}) {
  console.log(eventtype, "eventtype");
  if (eventtype === "1") {
    // 1：教练员签到；
    //   上传教练员签到验证通过接口
    //   http://zlb.aptstu.com/coachpassed
    //       传参：{"imei":"199ZK9HYS","coachnum":"6652111212302415","city":"3306","type":"3"}
    //   出参：{"data":null,"message":"执行成功!!","errorcode":0}
    const { message, errorcode } = await request.postCrypto(
      `/zljp/coachpassed?v=33031.0.0.e2&ts=${new Date().getTime()}`,
      {
        subject,
        certId: USER_ID,
        imei,
        coachnum: coachInfo.coachnum,
        city: "3303",
        type,
      }
    );
    uni.showToast({
      title: message,
      icon: "none",
    });
  } else if (eventtype === "2") {
    // 2：学员签到；
    //http://zlb.aptstu.com/coachpassed
    // 传参：{"city":"3306","classid":"28408","imei":"1990SDBYS","stunum":"6750068165402010","type":"3"}
    // 出参：{"data":{"classid":"28408","imei":"1990SDBYS","stunum":"6750068165402010","type":"3","idcard":"330622196909026929","name":"刘巧凤","loginkey":"d1ce72ffe66c4705a24cd267c09a61714e349a62af7f0f35e63fde3e9ab212e8"},"message":"执行成功!!","errorcode":0}
    // const { message, errorcode } = await request.postCrypto(
    //   `/zljp/coachpassed?v=33031.0.0.e2&ts=${new Date().getTime()}`,
    //   {
    //     certId: USER_ID,
    //     imei,
    //     classid,
    //     stunum: "111",
    //     coachnum: coachInfo.coachnum,
    //     city: "3303",
    //     type,
    //   }
    // );
    // uni.showToast({
    //   title: message,
    //   icon: "none",
    // });
  } else if (eventtype === "3") {
    // 3：学员签退；
    //   http://zlb.aptstu.com/studentfinish
    //       传参：{"city":"3306","classid":"28384","imei":"X9PSH64KS","stunum":"3650345390252872","type":"3"}
    //   出参：{"data":{"classid":"28384","imei":"X9PSH64KS","stunum":"3650345390252872","type":"3","logoutkey":"da7cfab2834ec1b32a1fe0b4bdb7c44c651cc9631868dd47aa0e343e15e21ac1"},"message":"学员签退成功!!","errorcode":0}
    // const { message, errorcode } = await request.postCrypto(
    //   `/zljp/coachfinish?v=33031.0.0.e2&ts=${new Date().getTime()}`,
    //   {
    //     certId: USER_ID,
    //     imei,
    //     classid,
    //     stunum: "111",
    //     coachnum: coachInfo.coachnum,
    //     city: "3303",
    //     type,
    //   }
    // );
    // uni.showToast({
    //   title: message,
    //   icon: "none",
    // });
  } else if (eventtype === "4") {
    //4：教练签退
    //   http://zlb.aptstu.com/coachfinish
    //       传参：{"imei":"199ZK9HYS","coachnum":"6652111212302415","city":"3306"}
    //   出参：{"data":null,"message":"执行成功!!","errorcode":0}
    const { message, errorcode } = await request.postCrypto(
      `/zljp/coachfinish?v=33031.0.0.e2&ts=${new Date().getTime()}`,
      {
        subject,
        certId: USER_ID,
        imei,
        coachnum: coachInfo.coachnum,
        city: "3303",
      }
    );
    uni.showToast({
      title: message,
      icon: "none",
    });
  }
}
export function uniScanCode(): Promise<UniApp.ScanCodeSuccessRes> {
  return new Promise((resolve, reject) => {
    uni.scanCode({
      scanType: ["qrCode"],
      success(res) {
        console.log(res);
        // {
        //   "scanType": "QR_CODE",
        //     "path": "",
        //     "charSet": "ISO8859_1",
        //     "result": "H4sIAAAAAAAAAE2OSw7CMAxE75I1QrZj58M5uEA/ESpqC1JK1YK4OzZs2M14Rs/zcnV2JweMHiG7g1uqWowkWTiDMKAe66O9lm7RhNQNUxlUphApEDBHBCGr9WWdH5NFUSAFEUmCXnww7n4vRlY53i6mPBwlcwhI4FkwiEWNPdEEBDzmxKSUyAYoa5mXP0o3NrUO/Xct6FIhBj0/x/b8K9Vt3zr3/gDBUCdx4gAAAA==",
        //     "errMsg": "scanCode:ok"
        // }
        resolve(res);
        // if (res.result) {
        //   // 扫描成功，处理二维码内容
        //   console.log("扫描结果：", res.result);
        //   // 这里可以进行后续操作，如跳转页面、显示信息等
        // } else {
        //   // 扫描失败
        //   uni.showToast({
        //     title: "扫描失败",
        //     icon: "none",
        //   });
        // }
      },
      fail(e) {
        console.log(e);
        reject(e);
        // 调用相机失败
        // uni.showToast({
        //   title: "调用相机失败",
        //   icon: "none",
        // });
      },
    });
  });
}
export async function handleFaceRecognition() {
  //扫码培训-获取人脸识别订单流水号
  const faceAuthRecordRes = await request.postCrypto(
    `/app/face/getTrainOrderId`,
    {
      id: useUserLoginInfoStore().USER_ID,
      ts: new Date().getTime(),
    }
  );
  console.log(faceAuthRecordRes, 1);
  const certifyId = faceAuthRecordRes.result.orderId;
  const authFlag = await authorizeUtils.showAuthTipModal(
    "android.permission.CAMERA"
  );
  if (!authFlag) {
    return;
  }
  const authFlag2 = await authorizeUtils.showAuthTipModal(
    "android.permission.WRITE_EXTERNAL_STORAGE"
  );
  if (!authFlag2) {
    return;
  }
  const verifyAuthRes = await verifyAuth(certifyId);
  console.log(verifyAuthRes, 777);
  //人脸认证成功 后端可以根据数据certifyId 查到拍到的人脸图片 存进数据库
  const res = await recordByOrderId(certifyId);
  console.log(res, "000");
  return res;
}
export async function handleRangeAndFaceRecognition(judgerangeRes) {
  if (judgerangeRes.errorcode !== 0) {
    // 定位范围认证失败
    uni.showToast({
      title: "定位范围认证失败",
      icon: "none",
      duration: 2000,
    });
    return false;
  }

  if (judgerangeRes.data.isuseface === "3") {
    // 需要人脸识别
    const faceRes = await handleFaceRecognition();
    if (faceRes?.success === false) {
      uni.showToast({
        title: faceRes.message,
        icon: "none",
        duration: 2000,
      });
      return false;
    }
  }

  return true;
}
