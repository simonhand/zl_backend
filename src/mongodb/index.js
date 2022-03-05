const mongoose = require('mongoose');
require("./schema/user");
require("./schema/course");
main().catch(err => console.log("err+zhangle", err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/zldb');
}