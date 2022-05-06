const mongoose = require('mongoose');
const {
  Schema
} = mongoose;

const ExerciseSchema = new Schema({
  createrAvatarUrl: String,
  createrId: String,
  course_id:String,
  courseName: String,
  teacherName: String,
  invitationCode: String,
  exerciseName:String,
  exerciseList:[Object],
  doneStudent:[String], // 这里存在做完测试的学生id
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

ExerciseSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updateAt = Date.now();
  } {
    this.meta.updateAt = Date.now();
  }
  next();
});


mongoose.model("Exercise", ExerciseSchema);