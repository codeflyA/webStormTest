const isIos = uni.getSystemInfoSync().platform === 'ios'
export default class authorizeUtils {
  /**
   * 授权前告知用户使用意图
   * @param content
   * @returns
   */
  static showAuthTipModal = async (authorize) => {
    // #ifdef H5
    if (1 === 1) {
      return true
    }

    // #endif
    // ios端在manifest.json配置权限使用说明，以下权限判断仅在安卓端可用
    if (isIos)
      return true
    const compat = plus.android.importClass('androidx.core.content.ContextCompat')
    const context = plus.android.runtimeMainActivity()
    const result = compat.checkSelfPermission(context, authorize)
    console.log('result===', result)
    if (result === 0)
      return true
    // // 如果已经授权直接返回
    const contentData = {
      'android.permission.ACCESS_FINE_LOCATION': {
        title: '定位权限说明',
        describe: '便于您使用该功能根据您的位置检索附近的驾校、体检点，请您确认授权，否则无法使用该功能',
      },
      'android.permission.READ_EXTERNAL_STORAGE': {
        title: '相册权限说明',
        describe: '便于您使用该功能上传您的头像照片、学员报名照片及用户实名认证信息，请您确认授权，否则无法使用该功能',
      },
      'android.permission.CAMERA': {
        title: '拍摄权限说明',
        describe: '便于您使用该功能扫描二维码、拍摄头像照片、学员报名照片及用户实名认证信息，请您确认授权，否则无法使用该功能',
      },
      'android.permission.CALL_PHONE': {
        title: '拨打电话权限说明',
        describe: '便于您使用该功能拨咨询、投诉电话、校长电话，请您确认授权，否则无法使用该功能',
      },
      'android.permission.WRITE_EXTERNAL_STORAGE': {
        title: '申请存储权限权限说明',
        describe: '便于您使用该功用户实名认证信息，请您确认授权，否则无法使用该功能',
      },
    }
    return new Promise((resolve) => {
      uni.showModal({
        title: contentData[authorize].title,
        content: contentData[authorize].describe,
        success: (res) => {
          resolve(!!res.confirm)
        },
        fail: () => {

        },
      })
    })
  }

  /**
   * 用户拒绝授权提示手动授权
   */
  static showManualAuth = async (authorize) => {
    if (isIos)
      return true
    const contentData = {
      'android.permission.ACCESS_FINE_LOCATION': '获取定位权限失败，请手动打开授权或检查系统定位开关',
      'android.permission.READ_EXTERNAL_STORAGE': '获取相册权限失败，请手动打开授权',
      'android.permission.CAMERA': '获取拍摄权限失败，请手动打开授权',
      'android.permission.CALL_PHONE': '获取拨打电话权限失败，请手动打开授权',
    }
    uni.showModal({
      title: '提示',
      content: contentData[authorize],
      confirmText: '去设置',
      success: (res) => {
        if (res.confirm) {
          uni.openAppAuthorizeSetting({
            success(res) {
              console.log(res)
            },
          })
        }
        if (res.cancel) {
          console.log('用户点击取消')
        }
      },
    })
  }
}
