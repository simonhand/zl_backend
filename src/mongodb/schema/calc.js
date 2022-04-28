const mongoose = require('mongoose');
const {
  Schema
} = mongoose;

const CalcSchema = new Schema({
  userId: String,
  calcCount:Number,
  score:Number,
  timer:Object,
  calcList: [Object],
  calcType:String,
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

CalcSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updateAt = Date.now();
  } {
    this.meta.updateAt = Date.now();
  }
  next();
});


mongoose.model("Calc", CalcSchema);