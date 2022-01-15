const { gql } = require('apollo-server-koa');
// zhangle dataType.
const typeDefs = gql`

  type User {
    uname: String,
    pwd: String,
    utoken: String,
    class: String,
    classNo: String,
  }

  type Book {
    title: String
    author: String
  }

  type Query {
    books: [Book]
    users:[User]
    loginuser(uname:String!,pwd:String!):User
  }

  type Mutation{
    setUser(post: UserInput): User
  }

  input UserInput {
    uname: String,
    pwd: String,
    classNo: String,
  }
`;

module.exports = typeDefs;