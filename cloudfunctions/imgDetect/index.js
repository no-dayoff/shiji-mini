// 云函数入口文件
const cloud = require('wx-server-sdk')
var AipImageClassifyClient = require("baidu-aip-sdk").imageClassify;

// 设置APPID/AK/SK
var APP_ID = "";
var API_KEY = "";
var SECRET_KEY = "";

// 新建一个对象，建议只保存一个对象调用服务接口
var client = new AipImageClassifyClient(APP_ID, API_KEY, SECRET_KEY);
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const { fileID ,typeIndex } = event;
  const res = await cloud.downloadFile({
    fileID:fileID
  })
const buffer = res.fileContent;
let image = buffer.toString("base64");
switch(typeIndex){
  case 0:
  var info = await client.advancedGeneral(image,{baike_num:5})
  break;
  case 1:
  var info = await client.animalDetect(image,{baike_num:5});
  break;
  case 2:
    var info = await client.plantDetect(image,{baike_num:5});
    break;
  case 3:
    var options = {};
    options["top_num"] = "3";
    options["filter_threshold"] = "0.7";
    options["baike_num"] = "1";
    var info = await client.dishDetect(image, options)
  break;
  case 4:
  var info = await client.ingredient(image)
  break;
  case 5:
    var info = await client.carDetect(image,{baike_num:5})
  break;
  case 6:
  var info = await client.landmark(image)
  break;
  case 7:
  var info = await client.currency(image)
  break;
  case 8:
  var info = await client.logoSearch(image)
  break;
}
return {
  info
};

  
};