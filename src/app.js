const Koa = require('koa');
const KoaStatic = require('koa-static');
const routerMap = require('./router');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const { ApolloServer } = require('apollo-server-koa');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
const http = require('http');
const {
  typeDefs,
  resolvers
} = require('./graphql/schema');
require('./mongodb')



const router = new Router;
router.use(routerMap.routes());

const app = new Koa;
app.use(KoaStatic(`${__dirname}/static`));
app.use(router.routes()).use(router.allowedMethods());

async function startApolloServer(app,typeDefs, resolvers) {
  const httpServer = http.createServer();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();
  server.applyMiddleware({ app });
  httpServer.on('request', app.callback());
  await new Promise(resolve => httpServer.listen({ port: 3000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:3000${server.graphqlPath}`);
  return { server, app };
}

startApolloServer(app,typeDefs,resolvers);

// app.listen(3000,()=> {
//   console.log("http://localhost:3000");
// })