import request from "@/request/index";
import { useUserLoginInfoStore } from "@/stores/userInfo";
import crypto from "@/utils/crypto";
export async function autoLoginWithJump() {
  const UserLoginInfo = useUserLoginInfoStore();
  const appId = UserLoginInfo.appId;
  if (appId) {
    try {
      // console.log(
      //   {
      //     appId: appId,
      //     ts: new Date().getTime(),
      //   },
      //   123
      // );
      const { result } = await request.post(
        "/app/sms/remount",
        crypto(
          JSON.stringify({
            appId: appId,
            ts: new Date().getTime(),
          })
        )
      );
      console.log(result);
      UserLoginInfo.USER_ID = result.userInfo.id;
      // token续签
      UserLoginInfo.ACCESS_TOKEN = result.token;
      if (result.userInfo.haveReal === 0) {
        //没有实名认证
        uni.redirectTo({
          url: "/pages/login/RealNameAuthen",
        });
      } else {
        // 实名认证通过 已登录过一次
        return true;
        // uni.redirectTo({
        //   url: "/pages/StudentHome",
        // });
      }
    } catch (error) {
      UserLoginInfo.appId = "";
      console.log(error);
      uni.redirectTo({
        url: "/pages/login/index",
      });
    }
  } else {
    console.log("缺少appId");
    uni.redirectTo({
      url: "/pages/login/index",
    });
  }
}
export async function autoLogin() {
  const UserLoginInfo = useUserLoginInfoStore();
  const appId = UserLoginInfo.appId;
  if (appId) {
    try {
      // console.log(
      //   {
      //     appId: appId,
      //     ts: new Date().getTime(),
      //   },
      //   123
      // );
      const { result } = await request.post(
        "/app/sms/remount",
        crypto(
          JSON.stringify({
            appId: appId,
            ts: new Date().getTime(),
          })
        )
      );
      console.log(result);
      UserLoginInfo.USER_ID = result.userInfo.id;
      // token续签
      UserLoginInfo.ACCESS_TOKEN = result.token;
      if (result.userInfo.haveReal === 0) {
        //没有实名认证
        return "needRealNameAuthen";
        // uni.redirectTo({
        //   url: "/pages/login/RealNameAuthen",
        // });
      } else {
        // 实名认证通过 已登录过一次
        return true;
        // uni.redirectTo({
        //   url: "/pages/StudentHome",
        // });
      }
    } catch (error) {
      UserLoginInfo.appId = "";
      console.log(error);
      //没有注册
      return "needRegister";
      // uni.redirectTo({
      //   url: "/pages/login/index",
      // });
    }
  } else {
    //没有注册
    return "needRegister";
    // uni.redirectTo({
    //   url: "/pages/login/index",
    // });
  }
}
