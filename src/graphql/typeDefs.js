const {
  gql
} = require('apollo-server-koa');
// zhangle dataType.
const typeDefs = gql `

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

  type Course{
    _id:String,
    createrAvatarUrl: String,
    createrId: String,
    courseName: String,
    teacherName:String,
    invitationCode:String,
    students:[String],
  }

  type Query {
    users:[User]
    loginuser(uname:String,pwd:String):User
    checkuser(uname:String,openId:String):User
    queryCourse(createrId:String!):[Course]
  }

  type Mutation{
    setUser(post: UserInput): User
    updateUserInfo(post: UpdateUserInfoInput):User
    createCourse(post: CourseInput):Course
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

  input CourseInput {
    createrAvatarUrl: String,
    createrId: String,
    courseName: String,
    teacherName:String,
    invitationCode:String,
  }
`;

module.exports = typeDefs;