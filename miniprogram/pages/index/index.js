Page({
  data: {},
  toUpload: function (e) {
    //dataset里的KEY都是小写
    let typeIndex = e.currentTarget.dataset.typeindex
    wx.navigateTo({
      url: `../toUpload/toUpload?typeIndex=${typeIndex}`
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