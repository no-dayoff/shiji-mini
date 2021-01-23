// pages/showDetail/showDetail.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
Page({
  data: {
    imgUrl: "",
    result: "",
    color_result: "",
    imgUrls: [],
    keywordArr: [],
    activeNames: [],
    percentage: 0,
    typeIndex: 0,
    description: "暂无描述",
    tips: "暂无",
    landmark: "识别失败"
  },
  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },
  goDialog() {
    Dialog.alert({
      message: '请您确认：1.识别主体位于图片中间 2.图片周围没有太多杂物',
    }).then(() => {
      Notify({
        type: 'success',
        message: '相信我！换张图片再试试吧！',
        duration: 2500,
      });
    });
  },
  goHome() {
    wx.navigateTo({
      url: '../index/index'
    })
  },
  onLoad: function (options) {
    //接受传来的json字符串
    let data = JSON.parse(options.result);
    let {
      filePath,
      result,
      color_result,
      typeIndex
    } = data
    if (!color_result) {
      color_result = false
    }
    this.setData({
      imgUrl: filePath,
      typeIndex,
      result,
      color_result,
    })
    //识别进度条
    if (typeIndex != 0 && typeIndex != 6 && typeIndex != 7) {
      let percentage = result[0].score ? result[0].score : result[0].probability
      percentage = Math.round((percentage) * 100)
      this.setData({
        percentage
      })
    }
    //轮播图与描述信息
    if (typeIndex <= 3 || typeIndex == 5) {
      //轮播图 
      let imgArr = []
      imgArr.push(filePath)
      for (let i = 0; i < result.length; i++) {
        if (result[i].score > 0.3 || result[i].probability > 0.3) {
          imgArr.push(result[i].baike_info.image_url)
        }
      }
      //去掉假，空数据
      imgArr = imgArr.filter(Boolean)
      this.setData({
        imgUrls: imgArr
      })
      //描述信息
      let description = result[0].baike_info.description
      if (description) {
        this.setData({
          tips: "查看",
          description
        })
      }
    }
    //万物识别 关键词
    if (typeIndex == 0) {
      let keywordArr = []
      for (let i = 0; i < result.length; i++) {
        if (result[i].score > 0.3) {
          keywordArr.push(result[i].keyword)
        }
      }
      this.setData({
        keywordArr
      })
    }
    // 地标识别
    if (typeIndex == 6) {
      if (result.landmark) {
        this.setData({
          landmark: result.landmark
        })
      } else {
        Toast.fail('换张图片再试试吧！')
      }
    }
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