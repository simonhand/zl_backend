const { gql } = require('apollo-server-koa');
const mongoose = require('mongoose');

const UserModle = mongoose.model('User');
// zhangle data.
const typeDefs = gql`
  type user {
    uname: String,
    pword: String,
    utoken: String,
    class: String,
    classNo: Int,
    meta: {
      createdAt:{
        type:Date,
        default:Date.now()
      },
      updateAt:{
        type:Date,
        default:Date.now()
      }
    }
  }
  type Book {
    title: String
    author: String
  }
  type Query {
    books: [Book]
    users:[user]
  }

  type Mutation{
    setUser(post: UserInput):user
  }

  input UserInput {
    uname:String,
    pwd:String,
  }
`;

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

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    books: () => books,
    user: async (parent, args, context, info) => {
      const res = await UserModle.find({});
      return res;
    } ,
  },
  Mutation:{
    setUser:(parent,args,context) => {
      const { uname, pword } = args.post;
      return UserModle.create( { uname, pword });
    }
  }
};

module.exports = {
  typeDefs,
  resolvers
}
