"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _apolloServer = require("apollo-server");

const typeDefs = _apolloServer.gql`
type Player {
  id: String!
  name: String
  score: Int
  secret: String
  units: [Int]
  invite: Boolean
}

type Game {
  id: String!
  nextTurn: Int
  points: [Int]
  player: Player
}

type Query {
  players(canTradeWith: String): [Player]
  status(player: String): Game
}

type Mutation {
  interact(from: String!, to: String!, unit: Int!) : Player
  cancel(from: String!) : Player
  signup(name: String) : Player
}
`;
var _default = typeDefs;
exports.default = _default;