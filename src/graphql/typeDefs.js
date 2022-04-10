const {
  gql
} = require('apollo-server-koa');

// zhangle dataType.
const typeDefs = gql `

  type UserCourse{
    invitationCode:String
  }
  type meta {
    createdAt:String,
    updateAt:String
  }
  type User {
    _id:String,
    uname: String,
    pwd: String,
    utoken: String,
    class: String,
    classNo: String,
    nickName:String,
    avatarUrl: String,
    realName:String,
    openId: String,
    userType:Int,
    isWxUser:Boolean,
    gender:String,
    grade:String,
    phone:String,
    age:String,
    course:[UserCourse]
  }
  type Key{
    keyIndex:String
    keyValue:String
    trueKey:Boolean
  }
  type Exercises{
    iscorrectExerciseType:Boolean,
    textArea:String,
    imgList:[String],
    keyList:[Key],
    exercisesType:Int,
    exercisesIndex:String
  }
  type CreateExercisesList{
    _id:String,
    createrAvatarUrl: String,
    createrId: String,
    course_id:String,
    courseName: String,
    teacherName: String,
    invitationCode: String,
    exerciseList:[Exercises]
    meta:meta
  }
  type ExerciseRecord{
    userId: String,
  }
  type Course{
    _id:String,
    createrAvatarUrl: String,
    createrId: String,
    courseName: String,
    teacherName:String,
    invitationCode:String,
    students:[User],
    studentsNumber:Int,
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
    examIndex(invitationCodeList:[String]):[CreateExercisesList]
    loginuser(uname:String,pwd:String):User
    checkuser(uname:String,openId:String):User
    queryCourse(createrId:String!):[Course]
    queryStudentCourse(_id:String!):[Course]
    getExam(id:String):CreateExercisesList
    addCourse(invitationCode:String!,_id:String!):Course
    deleteCourse(userId:String!,userType:Int!,courseId:String!,invitationCode:String!):QueryResult
    updateUserInfomation(_id:String!, avatarUrl:String,realName:String,nickName:String,age:String grade:String,gender:String,phone:String,userType:Int):User
    createExercise(createrAvatarUrl: String!,createrId: String!,course_id:String,courseName: String,teacherName: String,invitationCode: String,exerciseList:String):CreateExercisesList
    submitExercise(exerciseId:String!,courseName:String!,createrId:String!,createrAvatarUrl:String,userId:String,course_id:String,exercisesScoreRecord:Int,exercisesCorrectRecord:String,userInputKeyList:String):CreateExercisesList
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
    openId: String,
    isWxUser:Boolean,
    realName:String,
    age:String,
    grade:String,
    gender:String,
    phone:String
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
  input KeyInput{
    keyIndex:String
    keyValue:String
    trueKey:Boolean
  }
  input ExercisesInput {
    iscorrectExerciseType:Boolean,
    textArea:String,
    imgList:[String],
    keyList:[KeyInput],
    exercisesType:Int,
    exercisesIndex:String
  }
`;

module.exports = typeDefs;