const graphql = require('graphql');
const {
  GraphQLObjectType
} = require('graphql');
const studentsCourse = new GraphQLObjectType({
  name: 'studentsCourse',
  fields: {
    invitationCode: {
      type: graphql.GraphQLString
    }
  }
})


module.exports = {
  studentsCourse
}