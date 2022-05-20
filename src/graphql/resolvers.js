const {
  zlDecodeList,
  zlEncodeList
} = require('../utils/utils')
const mongoose = require('mongoose');
const UserModle = mongoose.model('User');
const CourseModle = mongoose.model('Course');
const ExerciseModle = mongoose.model('Exercise');
const ExerciseRecordModle = mongoose.model("ExerciseRecord");
const NotifyModdle = mongoose.model("Notify");
const CalcModdle = mongoose.model("Calc");
// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const ObjectId = mongoose.Types.ObjectId

const resolvers = {
  Query: {
    users: async (parent, args, context, info) => {
      const res = await UserModle.find({});
      return res;
    },
    loginuser: async (parent, args, context, info) => {
      const res = await UserModle.findOne(args);
      return res;
    },
    checkuser: async (parent, args, context, info) => {
      let condition;
      if (!args.uname) {
        condition = {
          openId: args.openId
        }
      } else {
        condition = {
          ...args
        }
      }
      const res = await UserModle.findOne(condition);
      return res;
    },
    queryCourse: async (parent, args, context) => {

      const res = await CourseModle.find({
        ...args
      });
      return res;
    },
    queryStudentCourse: async (parent, args, context) => {
      const res = await CourseModle.find({
        'students': {
          $elemMatch: {
            _id: ObjectId(args._id)
          }
        }
      })

      return res
    },
    addCourse: async (parent, args, context, info) => {
      const {
        _id,
        uname,
        avatarUrl,
        nickName,
        realname = ""
      } = await UserModle.findOne({
        _id: args._id
      });

      const addRes = await CourseModle.findOne({
        invitationCode: args.invitationCode
      })
      // addRes如果有该课程就继续更新user表
      if (addRes) {
        await UserModle.updateOne({
          _id
        }, {
          $push: {
            course: {
              invitationCode: args.invitationCode
            }
          }
        })
      }
      const {
        studentsNumber
      } = addRes;
      CourseModle.updateOne({
        invitationCode: args.invitationCode
      }, {
        $push: {
          students: {
            _id,
            uname,
            avatarUrl,
            nickName,
            realname
          }
        },
        studentsNumber: (studentsNumber + 1)
      }, (e, r) => {

      })
      return addRes;
    },
    deleteCourse: async (parent, args, context, info) => {
      const {
        userId,
        userType,
        courseId,
        invitationCode
      } = args;
      let res1;
      let res2;

      if (userType) {
        // 这里处理学生退出课程
        res1 = await CourseModle.updateOne({
          _id: ObjectId(courseId)
        }, {
          $pull: {
            students: {
              _id: ObjectId(userId)
            }
          },
          $inc: {
            studentsNumber: -1
          }
        })
        res2 = await UserModle.updateOne({
          _id: ObjectId(userId)
        }, {
          $pull: {
            course: {
              invitationCode: invitationCode
            }
          }
        })
      } else {
        // 这里处理教师解散课程
        res1 = await CourseModle.remove({
          _id: ObjectId(courseId)
        })
        res2 = await UserModle.update({
          course: {
            invitationCode
          }
        }, {
          $pull: {
            course: {
              invitationCode
            }
          }
        })
      }
      return {}
    },
    // 变更用户基本资料
    updateUserInfomation: async (parent, args, context, info) => {
      const {
        _id,
        avatarUrl,
        realName,
        nickName,
        age,
        grade,
        gender,
        phone,
        userType
      } = args;
      const res = await UserModle.updateOne({
        _id
      }, {
        $set: {
          avatarUrl,
          realName,
          nickName,
          age,
          grade,
          gender,
          phone,
          userType
        }
      }, {
        upsert: true
      });
      return UserModle.findOne({
        _id
      });
    },
    createExercise: (parent, args, context) => {
      const {
        createrAvatarUrl,
        createrId,
        course_id,
        courseName,
        teacherName,
        exerciseName,
        invitationCode
      } = args;
      const realExerciseList = zlDecodeList(args.exerciseList);
      return ExerciseModle.create({
        createrAvatarUrl,
        createrId,
        course_id,
        courseName,
        teacherName,
        exerciseName,
        invitationCode,
        exerciseList: realExerciseList
      })
    },
    examIndex: async (parent, args, context) => {
      const queryList = args.invitationCodeList.map((item) => {
        return {
          invitationCode: item
        }
      })
      const realRes = await ExerciseModle.find({
        $or: queryList,
        doneStudent: {
          $nin: [args.userId]
        }
      })
      if (args.from === "index") {
        return [{
          exerciseCount: realRes.length
        }]
      }
      return realRes
    },
    getExam: async (parent, args, context) => {
      const {
        id,
        from
      } = args
      console.log('args: ', args);
      let res
      if (from === 'record') {
        const res1 = await ExerciseModle.findOne({
          _id: ObjectId(id)
        })
        const res2 = await ExerciseRecordModle.findOne({
          exerciseId: id
        })
        res2.userInputKeyList
        res = {
          exerciseList: res1.exerciseList,
          ...res2._doc,
          userInputKeyList: zlEncodeList(res2._doc.userInputKeyList)
        }
      } else {
        res = await ExerciseModle.findOne({
          _id: ObjectId(id)
        })
      }
      console.log('res: ', res);
      return res;

    },
    submitExercise: async (parent, args, context) => {
      const {
        courseName,
        course_id,
        createrAvatarUrl,
        createrId,
        exerciseName,
        exerciseId,
        exercisesCorrectRecord,
        exercisesScoreRecord,
        userInputKeyList,
        userId
      } = args;
      let res;
      ExerciseModle.updateOne({
        _id: exerciseId
      }, {
        $push: {
          doneStudent: args.userId
        }
      }).then((res) => {
        console.log(res);
      })
      ExerciseRecordModle.create({
        courseName,
        course_id,
        createrAvatarUrl,
        createrId,
        exerciseId,
        exerciseName,
        exercisesCorrectRecord: zlDecodeList(exercisesCorrectRecord),
        exercisesScoreRecord,
        userInputKeyList: zlDecodeList(userInputKeyList),
        userId
      }).then(
        (_res) => {
          res = _res
        }
      ).catch(e => {
        console.log(":eeee", e);
      })
      return res
    },
    createNotify: async (parent, args, context) => {
      const {
        createrAvatarUrl,
        createrId,
        course_id,
        courseName,
        teacherName,
        invitationCode,
        textArea
      } = args;
      const realimgList = zlDecodeList(args.imgList);
      return NotifyModdle.create({
        createrAvatarUrl,
        createrId,
        course_id,
        courseName,
        teacherName,
        invitationCode,
        textArea,
        imgList: realimgList
      })
    },
    getNotify: async (_, args) => {
      const queryList = args.invitationCodeList.map((item) => {
        return {
          invitationCode: item
        }
      })
      let res
      if (args.from === "record") {
        // 学生
        if (args.userType) {
          res = await NotifyModdle.find({
            $or: queryList,
            readStudent: {
              $in: [args.userId]
            }
          }).sort([
            ['_id', -1]
          ]).skip(args.skip).limit(6)
        } else {
          res = await NotifyModdle.find({
            createrId: args.userId
          }).sort([
            ['_id', -1]
          ]).skip(args.skip).limit(6)
        }
      } else {
        res = await NotifyModdle.find({
          $or: queryList,
          readStudent: {
            $nin: [args.userId]
          }
        }).sort([
          ['_id', -1]
        ])
      }
      if (args.from === "index") {
        return [{
          NotifyCount: res.length
        }]
      }
      const newRes = res.map((item, index) => {
        return {
          ...item._doc,
          imgList: zlEncodeList(item.imgList)
        }
      })
      return newRes
    },
    readNotify: async (_, args) => {
      const {
        notifyId,
        userId
      } = args;
      NotifyModdle.updateOne({
        _id: notifyId
      }, {
        $push: {
          readStudent: userId
        }
      }).then((res) => {
        console.log(res);
      })
      return {
        _id: notifyId
      }
    },
    submitCalc(_, args) {
      const {
        calcList,
        score,
        calcCount,
        timer,
        userId,
        calcType
      } = args
      const realcalcList = zlDecodeList(calcList)
      const realTimer = zlDecodeList(timer)
      CalcModdle.create({
        calcList: realcalcList,
        timer: realTimer,
        score,
        calcType,
        calcCount,
        userId
      })
      return {
        userId
      }
    },
    getTabTotal: async (_, args) => {
      const {
        userId,
        userType
      } = args;
      let exerciseCount;
      let notifyCount;
      // 学生
      if (userType) {
        exerciseCount = await ExerciseRecordModle.find({
          userId
        }).count(true);
        notifyCount = await NotifyModdle.find({
          readStudent: {
            $in: [args.userId]
          }
        }).count();
      } else {
        exerciseCount = await ExerciseModle.find({
          createrId: userId
        }).count(true);
        notifyCount = await NotifyModdle.find({
          createrId: userId
        }).count();
      }
      const calcCount = await CalcModdle.find({
        userId
      }).count();
      return {
        exerciseCount,
        notifyCount,
        calcCount
      }
    },
    getExerciseRecord: async (_, args) => {
      const {
        userId,
        skip,
        userType
      } = args
      let res;
      if (userType) {
        res = await ExerciseRecordModle.find({
          userId
        }).sort([
          ['_id', -1]
        ]).skip(skip).limit(6)
      } else {
        res = await ExerciseModle.find({
          createrId: userId
        }).sort([
          ['_id', -1]
        ]).skip(skip).limit(6)
      }
      return res
    },
    getCalcRecord: async (_, args) => {
      const {
        userId,
        skip
      } = args
      const res = await CalcModdle.find({
        userId
      }).sort([
        ['_id', -1]
      ]).skip(skip).limit(6)
      const realRes = res.map((item) => {
        return {
          ...item._doc,
          calcList: zlEncodeList(item.calcList),
          timer: zlEncodeList(item.timer)
        };
      })
      return realRes
    },
    deleteCalcRecord: async (_, args) => {
      await CalcModdle.deleteOne({
        _id: args.calcId
      })
      return {
        _id: args.calcId
      }
    },
    getDoneExerciseStudents: async (_, args) => {
      const {
        exerciseRecordId
      } = args;
      console.log('args: ', args);

      const res1 = await ExerciseRecordModle.find({
        exerciseId: exerciseRecordId,
      })
      const realRes = [];
      for (const item of res1) {
        realRes.push(await UserModle.findOne({
          _id: ObjectId(item.userId)
        }))
      }
      console.log(realRes);
      return realRes
    },
    getReadNotifyStudents: async (_, args) => {
      const {
        notifyId
      } = args
      console.log(args);
      const res1 = await NotifyModdle.findOne({
        _id:ObjectId(notifyId)
      })
      const realRes = []
      for (const item of res1.readStudent) {
        console.log('item: ', item);
        realRes.push(await UserModle.findOne({_id:ObjectId(item)}))
      }
      return realRes
    }
  },
  Mutation: {
    setUser: (parent, args, context) => {
      const {
        uname,
        pwd,
        classNo,
        openId,
        avatarUrl,
        isWxUser,
        nickName,
        realName,
        age,
        grade,
        gender,
        phone
      } = args.post;
      if (isWxUser) {
        return UserModle.create({
          uname: nickName,
          pwd,
          classNo,
          openId,
          avatarUrl,
          isWxUser,
          nickName,
          realName,
          age,
          grade,
          gender,
          phone
        });
      }
      return UserModle.create({
        uname,
        pwd,
        classNo,
        openId,
        avatarUrl,
        isWxUser,
        nickName,
        realName,
        age,
        grade,
        gender,
        phone
      });
    },
    updateUserInfo: async (parent, args, context) => {
      const {
        avatarUrl,
        _id
      } = args.post;
      return await UserModle.updateOne({
          _id
        }, // 查询条件
        {
          avatarUrl
        } // 变更字段
      )
    },
    createCourse: (parent, args, context) => {
      const {
        createrAvatarUrl,
        createrId,
        courseName,
        teacherName,
        invitationCode,
      } = args.post;
      return CourseModle.create({
        createrAvatarUrl,
        createrId,
        courseName,
        teacherName,
        invitationCode,
      });
    },

  }
};

module.exports = resolvers;