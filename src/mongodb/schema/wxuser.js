const mongoose = require('mongoose');
const { Schema } = mongoose;

const WxUserSchema = new Schema({
  avatarUrl: String,
  openid: String,
  class: String,
  classNo: String,
  nickName:String,
  meta: {
    createdAt:{
      type:Date,
      default:Date.now()
    },
    updateAt:{
      type:Date,
      default:Date.now()
    }
  }
});

WxUserSchema.pre('save',function(next) {
  if(this.isNew){
    this.meta.createdAt = this.meta.updateAt = Date.now();
  }{
    this.meta.updateAt = Date.now();
  }
  next();
});

mongoose.model("WxUser",WxUserSchema);
