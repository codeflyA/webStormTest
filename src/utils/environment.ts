export function isWeb() {
  const res = uni.getSystemInfoSync();
  return res.uniPlatform === "web";
}

export function isIos() {
  const res = uni.getSystemInfoSync();
  return res.uniPlatform === "ios";
}

export function isAndroid() {
  const res = uni.getSystemInfoSync();
  return res.uniPlatform === "android";
}
