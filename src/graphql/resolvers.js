const mongoose = require('mongoose'); 
const UserModle = mongoose.model('User');
const WxUserModle = mongoose.model('WxUser');
// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.

const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
  },
];


const resolvers = {
  Query: {
    books: () => books,
    users: async (parent, args, context, info) => {
      console.log('args: ', args);
      const res = await UserModle.find({});
      return res;
    },
    loginuser: async (parent, args, context, info) => {
      console.log('args: ', typeof(args));
      const res = await UserModle.findOne(args);
      return res;
    },
    checkuser: async (parent, args, context, info) => {
      console.log('args: ', typeof(args));
      const res = await UserModle.findOne(args);
      return res;
    },
  },
  Mutation:{
    setUser:(parent,args,context) => {
      const { uname, pwd,classNo,openid,avatarUrl,isWxUser,nickName} = args.post;
      return UserModle.create( { uname, pwd ,classNo,openid,avatarUrl,isWxUser,nickName });
    },
    updateUserInfo:async (parent,args,context) => {
      const { avatarUrl,_id } = args.post;
      return await UserModle.updateOne(
        {_id}, // 查询条件
        {avatarUrl} // 变更字段
      )
    }
  }
};

module.exports = resolvers;