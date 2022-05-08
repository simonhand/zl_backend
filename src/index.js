require('./mongodb')
const Koa = require('koa');
const KoaStatic = require('koa-static');
const routerMap = require('./router');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const {
  ApolloServer
} = require('apollo-server-koa');
const {
  ApolloServerPluginDrainHttpServer
} = require('apollo-server-core');
const http = require('http');
const {
  typeDefs,
  resolvers
} = require('./graphql/schema');


console.log("zhangle>>>>>");

const router = new Router;
router.use(routerMap.routes());

const app = new Koa;
app.use(KoaStatic(`${__dirname}/static`));
app.use(router.routes()).use(router.allowedMethods());

async function startApolloServer(app, typeDefs, resolvers) {
  const httpServer = http.createServer();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({
      httpServer
    })],
  });

  await server.start();
  server.applyMiddleware({
    app
  });
  httpServer.on('request', app.callback());
  await new Promise(resolve => httpServer.listen({
    url:"43.138.63.218",
    // url: "192.168.0.3",
    // url: "192.168.1.103",
    port: 3636
  }, resolve));
  console.log(`🚀 Server ready at http://localhost:3000${server.graphqlPath}`);
  console.log(`🚀 Server ready at http://192.168.2.110:3636${server.graphqlPath}`);
  return {
    server,
    app
  };
}

module.exports = {startApolloServer,app,typeDefs,resolvers }