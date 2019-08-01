"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const players = [{
  name: 'A',
  score: 1
}, {
  name: 'B',
  score: 5
}, {
  name: 'C',
  score: 15
}, {
  name: 'D',
  score: 3
}];
const resolvers = {
  Query: {
    players: () => players
  },
  Mutation: {
    interact: () => true
  }
};
var _default = resolvers;
exports.default = _default;