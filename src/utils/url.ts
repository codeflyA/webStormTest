//@ts-ignore
import { queryParams } from "uview-plus";
//https://uview-plus.jiangruyi.com/js/queryParams.html
//实测通过
export function addQueryParamsToUrl(url: string, object) {
  return `${url}${queryParams(object)}`;
}
//实测通过
export function parseUrlQueryParams() {
  // 获取当前页面栈
  const pages = getCurrentPages();
  // 数组中索引最大的页面就是当前页面
  const currentPage: any = pages[pages.length - 1];
  console.log(currentPage);
  // 获取页面传参 options 对象
  let rawOptions = currentPage.options;
  //在部分场景可能获取不到 根本不存在currentPage.options字段
  // 使用currentPage.$page.fullPath去获取
  if (!rawOptions) {
    rawOptions = currentPage.$page.fullPath;
  }
  //使用currentPage.$page.fullPath还是获取不到
  if (!rawOptions) {
    // 返回解码后的参数
    return {};
  }
  console.log(rawOptions);
  // 定义一个对象来存储解码后的参数
  const decodedOptions = {};
  if (typeof rawOptions === "string") {
    // 如果 options 是字符串，则尝试解析其中的参数
    // 如果 rawOptions 是字符串，则尝试解析其中的参数
    const paramPairs = rawOptions.split("?")[1]?.split("&") || [];
    paramPairs.forEach((pair) => {
      const [key, value] = pair.split("=");
      if (key && value) {
        try {
          decodedOptions[decodeURIComponent(key)] = decodeURIComponent(value);
        } catch (error) {
          console.error(`URL解码失败: ${key} = ${value}`, error);
          decodedOptions[key] = value;
        }
      }
    });
  } else {
    // 如果 options 是一个对象，则遍历其键值对，对每个值进行 URL 解码
    Object.keys(rawOptions).forEach((key) => {
      try {
        // 对每个参数进行 URL 解码，确保中文参数被正确解析
        decodedOptions[key] = decodeURIComponent(rawOptions[key]);
      } catch (error) {
        console.error(`URL解码失败: ${key} = ${rawOptions[key]}`, error);
        // 如果解码失败，保留原始值
        decodedOptions[key] = rawOptions[key];
      }
    });
  }

  // 返回解码后的参数
  return decodedOptions;
}
