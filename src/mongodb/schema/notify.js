const mongoose = require('mongoose');
const {
  Schema
} = mongoose;

const NotifySchema = new Schema({
  createrAvatarUrl: String,
  createrId: String,
  course_id:String,
  courseName: String,
  teacherName: String,
  invitationCode: String,
  textArea:String,
  imgList:[String],
  readStudent:[String], // 这里已读消息的学生id
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

NotifySchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updateAt = Date.now();
  } {
    this.meta.updateAt = Date.now();
  }
  next();
});


mongoose.model("Notify", NotifySchema);