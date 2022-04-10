const {
  zlDecodeList
} = require('../utils/utils')
const mongoose = require('mongoose');
const UserModle = mongoose.model('User');
const CourseModle = mongoose.model('Course');
const ExerciseModle = mongoose.model('Exercise');
const ExerciseRecordModle = mongoose.model("ExerciseRecord");
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
        invitationCode
      } = args;
      const realExerciseList = zlDecodeList(args.exerciseList);
      return ExerciseModle.create({
        createrAvatarUrl,
        createrId,
        course_id,
        courseName,
        teacherName,
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
        $or: queryList
      })
      return realRes
    },
    getExam: async (parent, args, context) => {
      const {
        id
      } = args
      const res = await ExerciseModle.findOne({
        _id: ObjectId(id)
      })

      return res;
    },
    submitExercise: async (parent, args, context) => {
      const {
        courseName,
        course_id,
        createrAvatarUrl,
        createrId,
        exerciseId,
        exercisesCorrectRecord,
        exercisesScoreRecord,
        userInputKeyList,
        userId
      } = args;
      let res;
      ExerciseRecordModle.create({
        courseName,
        course_id,
        createrAvatarUrl,
        createrId,
        exerciseId,
        exercisesCorrectRecord:zlDecodeList(exercisesCorrectRecord),
        exercisesScoreRecord,
        userInputKeyList: zlDecodeList(userInputKeyList),
        userId
      }).then(
        (_res) => {
          console.log('_res: ', _res);
          res = _res
        }
      ).catch(e => {
        console.log(":eeee",e);
      })
      return res
    },
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