const app = getApp()
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
Page({
  showPopup() {
    this.setData({
      show: true
    });
  },
  onClose() {
    this.setData({
      show: false
    });
  },
  onConfirm(event) {
    const {
      value,
      index
    } = event.detail;
    this.setData({
      typeValue: value,
      show: false
    })
    this.typeIndex = index
  },
  typeIndex: 0,
  filePath: "",
  data: {
    columns: ['万物识别', '动物识别', '植物识别', '菜品识别', '果蔬识别',
      '车型识别', '地标识别', '货币识别', 'LOGO识别'
    ],
    typeValue: "",
    tempFilePaths: "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-b1ebbd3c-ca49-405b-957b-effe60782276/63d137ab-0d87-4105-b6c3-748a094b0250.jpg",
    show: false,
    disabled: true
  },
  onLoad: function (options) {
    let {
      typeIndex
    } = options;
    this.typeIndex = parseInt(typeIndex)
  },
  onReady() {
    const picker = this.selectComponent('.picker1') //获取组件实例
    picker.setIndexes([this.typeIndex]) //setIndexes()中的参数是一个数组
    this.setData({
      typeValue: this.data.columns[this.typeIndex]
    })
  },
  doUpload: function () {
    var _this = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        const tempFilePaths = res.tempFilePaths
        _this.setData({
          tempFilePaths,
          disabled: false
        })
        _this.filePath = res.tempFilePaths[0];
      },
    })
  },
  doCloud() {
    Toast.loading({
      message: '玩命识别中...',
      forbidClick: true,
      duration: 10000,
      mask: true
    });
    let filePath = this.filePath
    var _this = this
    const cloudPath = `img-detect/${Date.now()}${filePath.match(/\.[^.]+?$/)}`
    wx.cloud.uploadFile({
      cloudPath,
      filePath,
      success: res => {
        let fileID = res.fileID
        let typeIndex = _this.typeIndex
        wx.cloud.callFunction({
          name: "imgDetect",
          data: {
            fileID: fileID,
            typeIndex: typeIndex,
          },
          success: res => {
            let result = res.result.info
            //图片路径存入对象中
            result['filePath'] = filePath
            result['typeIndex'] = typeIndex
            result = JSON.stringify(res.result.info)
            wx.navigateTo({
              url: '../showDetail/showDetail?result=' + result
            })
            Toast.clear()
          },
          fail: res => {
            Toast.clear()
            Toast.fail('识别失败了，换张图片再试试吧！');
          }
        })
      }
    })
  },
  onShareAppMessage: function () {
    return {
      title: '推荐你一个手机里的百科全书，专注于AI图像识别。',
      path: '../index/index',
      imageUrl: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1831786074,397249294&fm=15&gp=0.jpg',
    }
  },
  onShareTimeline: function () {
    return {
      title: '推荐你一个手机里的百科全书，专注于AI图像识别。',
      imageUrl: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1831786074,397249294&fm=15&gp=0.jpg',
    }
  }
})