const mongoose = require('mongoose');
const {
  Schema
} = mongoose;

const exerciseRecordSchema = new Schema({
  createrAvatarUrl: String,
  createrId: String,
  courseName: String,
  userId: String,
  course_id:String,
  exerciseId:String,
  exercisesScoreRecord: Number,
  exercisesCorrectRecord:[Boolean],
  userInputKeyList: [Object],
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

exerciseRecordSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updateAt = Date.now();
  } {
    this.meta.updateAt = Date.now();
  }
  next();
});


mongoose.model("ExerciseRecord", exerciseRecordSchema);