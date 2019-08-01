"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _apolloServer = require("apollo-server");

const typeDefs = _apolloServer.gql`
type Player {
  name: String
  score: Int
}

type Query {
  players: [Player]
}

type Mutation {
  interact( from: String!, to: String!, unit: Int!): Boolean
}
`;
var _default = typeDefs;
exports.default = _default;