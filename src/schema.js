import { gql } from 'apollo-server-express';

const typeDefs = gql`
type Player {
  id: String!
  name: String
  score: Int
  units: [Int]
  invite: Boolean
}

type Game {
  id: String!
  points: [Int]
  nextRound: String
  lastRound: LastRound
  player: Player
}

type LastRound {
  units: [Int]
  unitWorth: [Int]
}

type Query {
  players(canInteractWith: String): [Player]
  status(player: String!): Game
}

type Mutation {
  interact(from: String!, to: String!, unit: Int!) : Player
  cancel(from: String!) : Player
  signup(name: String!, secret: String!) : Player
}
`;

export default typeDefs;
