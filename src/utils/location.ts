export function getLocation(): Promise<{
  type: string;
  altitude: number;
  latitude: number;
  longitude: number;
  speed: number;
  accuracy: number;
  errMsg: string;
}> {
  return new Promise((resolve, reject) => {
    uni.getLocation({
      //gcj02 系统原生定位不支持 必须第三方sdk例如百度
      type: "gcj02",
      highAccuracyExpireTime: 5000,
      accuracy: "best",
      isHighAccuracy: true,
      success(res) {
        // //查看 APP 授权设置
        const appAuthorizeSetting = uni.getAppAuthorizeSetting();
        console.log(appAuthorizeSetting);

        console.log(res, 666);
        resolve(res);
        // console.log("定位服务", res);
        // searchData.lon = res.longitude;
        // searchData.lat = res.latitude;
      },
      fail(e) {
        reject(e);
        console.log(e);
      },
    });
  });
}
