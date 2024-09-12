import CryptoJS from "crypto-js";
//字段加密
export default function (str) {
  const key = CryptoJS.enc.Utf8.parse("2341DEF32A14B13C"); // 密钥：一个常量，前后端协定后一个字符串即可
  const iv = CryptoJS.enc.Utf8.parse("F2341B12E34A1CD3"); // 偏移量：一个常量，前后端协定后一个字符串，前后端一致即可
  const srcs = CryptoJS.enc.Utf8.parse(str);
  const encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CTR, // mode 与后台一致。有多个模式可选
    padding: CryptoJS.pad.Pkcs7, //
  });
  // 需要返回base64格式的加密结果，使用此句
  return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);

  // 需要返回hex格式的加密结果，使用此句
  // return encrypted.ciphertext.toString().toUpperCase();
}
