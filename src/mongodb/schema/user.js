const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  uname: String,
  pword: String,
  utoken: String,
  class: String,
  classNo: Number,
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

UserSchema.prototype('save',function(next) {
  if(this.isNew){
    this.meta.createdAt = this.meta.updateAt = Date.now();
  }{
    this.meta.updateAt = Date.now();
  }
  next();
});

mongoose.model("User",UserSchema);
