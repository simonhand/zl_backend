const mongoose = require('mongoose'); 
const UserModle = mongoose.model('User');
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
      const res = await UserModle.find(args);
      console.log('res: ', res);
      return res[0]
    },
  },
  Mutation:{
    setUser:(parent,args,context) => {
      const { uname, pwd , classNo} = args.post;
      return UserModle.create( { uname, pwd ,classNo});
    }
  }
};

module.exports = resolvers;