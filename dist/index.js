"use strict";

var _apolloServer = require("apollo-server");

var _schema = _interopRequireDefault(require("./schema"));

var _resolvers = _interopRequireDefault(require("./resolvers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const server = new _apolloServer.ApolloServer({
  typeDefs: _schema.default,
  resolvers: _resolvers.default
});
const port = process.env.PORT || 8080;
server.listen({
  port
}).then(({
  url
}) => {
  console.log(`🚀  Server ready at ${url}`);
});