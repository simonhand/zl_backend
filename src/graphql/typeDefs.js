const { gql } = require('apollo-server-koa');
// zhangle dataType.
const typeDefs = gql`

  type User {
    _id:String,
    uname: String,
    pwd: String,
    utoken: String,
    class: String,
    classNo: String,
    nickName:String,
    avatarUrl: String,
    openid: String,
    isWxUser:Boolean,
  }

  type Book {
    title: String
    author: String
  }

  type Query {
    books: [Book]
    users:[User]
    loginuser(uname:String,pwd:String):User
    checkuser(uname:String,openId:String):User
    
  }

  type Mutation{
    setUser(post: UserInput): User
    updateUserInfo(post: UpdateUserInfoInput):User
  }

  input UserInput {
    uname: String,
    pwd: String,
    classNo: String,
    nickName:String,
    avatarUrl: String,
    openid: String,
    isWxUser:Boolean,
  }

  input UpdateUserInfoInput{
    _id: String!
    avatarUrl:String
  }
`;

module.exports = typeDefs;