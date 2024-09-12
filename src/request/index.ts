//uni-network.netlify.app/guide/installation.html
import { API } from "@/constant/index";
import { useUserLoginInfoStore } from "@/stores/userInfo";
import crypto from "@/utils/crypto";
import { un, type UnConfig } from "@uni-helper/uni-network";
const http = un.create({
  baseUrl: API,
  // timeout: 10 * 1000,
});
// 添加请求拦截器
http.interceptors.request.use(
  (config) => {
    console.log("发起请求", config);
    const UserLoginInfo = useUserLoginInfoStore();
    // 在发送请求之前做些什么
    config.headers = {
      "X-Access-Token": UserLoginInfo.ACCESS_TOKEN || "",
    };
    return config;
  },
  (error) => {
    console.log(error);
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
http.interceptors.response.use(
  // @ts-ignore
  (response) => {
    console.log("请求返回", response?.config?.url, response);
    // @ts-ignore
    if (response?.data?.success === false) {
      uni.showToast({
        // @ts-ignore
        title: response?.data?.message || "请求失败",
        icon: "none",
      });
    }
    // 2xx 范围内的状态码都会触发该函数
    // 对响应数据做点什么
    return response.data;
  },
  (error) => {
    console.log(error);
    // 超出 2xx 范围的状态码都会触发该函数
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);
type PostFunction = typeof http.post;
type ThirdParam = Parameters<PostFunction>[2];
/* 导出封装的请求方法 */
const request = {
  get<T = any>(url: string, config?: ThirdParam): Promise<T> {
    //query请求写在config.params
    //body请求写在config.data
    return http.get(url, config);
  },
  delete<T = any>(url: string, config?: ThirdParam): Promise<T> {
    return http.delete(url, config);
  },
  post<T = any>(url: string, data?: object, config?: ThirdParam): Promise<T> {
    return http.post(url, data, config);
  },
  postCrypto<T = any>(
    url: string,
    data?: object,
    config?: ThirdParam
  ): Promise<T> {
    const newData = crypto(JSON.stringify(data));
    return http.post(url, newData, config);
  },
  put<T = any>(url: string, data?: object, config?: ThirdParam): Promise<T> {
    return http.put(url, data, config);
  },
};
export default request;
