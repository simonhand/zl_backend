const mongoose = require('mongoose');
console.log("hahahah");
require("./schema/user")
main().catch(err => console.log("err+zhangle",err));
async function main() {
  await mongoose.connect('mongodb://localhost:27017/zldb');
}