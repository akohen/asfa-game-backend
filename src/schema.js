import { gql } from 'apollo-server';

const typeDefs = gql`
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

export default typeDefs;
