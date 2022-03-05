const mongoose = require('mongoose');
const {
  Schema
} = mongoose;

const UserSchema = new Schema({
  uname: String,
  pwd: String,
  utoken: String,
  class: String,
  classNo: String,
  nickName: String,
  realName: String,
  avatarUrl: String,
  openId: String,
  isWxUser: Boolean,
  userType: Number,
  course: [Object],
  studyCourse:[Object],
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
});

UserSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updateAt = Date.now();
  } {
    this.meta.updateAt = Date.now();
  }
  this.course = [];
  next();
});

mongoose.model("User", UserSchema);