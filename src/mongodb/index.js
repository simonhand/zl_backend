const mongoose = require('mongoose');
require("./schema/user");
require("./schema/course");
require("./schema/exercise")
require("./schema/exerciseRecord")
require("./schema/notify")
require("./schema/calc")
main().then((res) => {
  console.log("链接成功",res);
}).catch(err => console.log("err+zhangle", err));

async function main() {
  console.log("连接远程数据库");
  await mongoose.connect('mongodb://43.138.63.218:27018/zldb');
  // await mongoose.connect('mongodb://127.0.0.1:27017/zldb');
}