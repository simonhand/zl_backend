const mongoose = require('mongoose');
const UserModle = mongoose.model('User');
const CourseModle = mongoose.model('Course');
// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.


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
      const res = await UserModle.findOne(args);
      return res;
    },
    queryCourse: async (parent, args, context) => {
      console.log('args: ', args);
      const res = await CourseModle.find({
        ...args
      });
      console.log("res", res);
      return res;
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
      await UserModle.updateOne({
        _id
      }, {
        $push: {
          course: {
            invitationCode: args.invitationCode
          }
        }
      })
      const CourseRes = await CourseModle.updateOne({
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
        }
      })
      const addRes = await CourseModle.findOne({
        invitationCode: args.invitationCode
      })
      return addRes;
    }
  },
  Mutation: {
    setUser: (parent, args, context) => {
      const {
        uname,
        pwd,
        classNo,
        openid,
        avatarUrl,
        isWxUser,
        nickName
      } = args.post;
      if (isWxUser) {
        return UserModle.create({
          uname: nickName,
          pwd,
          classNo,
          openid,
          avatarUrl,
          isWxUser,
          nickName
        });
      }
      return UserModle.create({
        uname,
        pwd,
        classNo,
        openid,
        avatarUrl,
        isWxUser,
        nickName
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
    }
  }
};

module.exports = resolvers;