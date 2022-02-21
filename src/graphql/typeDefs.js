const {
  gql
} = require('apollo-server-koa');
const {
  studentsCourse
} = require('./graphqlType')
// zhangle dataType.
const typeDefs = gql `

  # type studentsCourse{
  #   invitationCode:String
  # }

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
    course:[String]
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

  type QueryResult{
    acknowledged: Int,
    modifiedCount: Int,
    upsertedId: String,
    upsertedCount: Int,
    matchedCount: Int
  }

  type Query {
    users:[User]
    loginuser(uname:String,pwd:String):User
    checkuser(uname:String,openId:String):User
    queryCourse(createrId:String!):[Course]
    addCourse(invitationCode:String!,_id:String!):Course
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