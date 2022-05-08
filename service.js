const { startApolloServer,typeDefs,resolvers,app} = require('./src/index');
startApolloServer(app, typeDefs, resolvers);