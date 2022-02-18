const mongoose = require('mongoose');
const {
  Schema
} = mongoose;

const CourseSchema = new Schema({
  createrAvatarUrl: String,
  createrId: String,
  courseName: String,
  teacherName: String,
  invitationCode: String,
  students: [Object],
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

CourseSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updateAt = Date.now();
  } {
    this.meta.updateAt = Date.now();
  }
  next();
});

mongoose.model("Course", CourseSchema);