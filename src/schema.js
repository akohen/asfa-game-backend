import { gql } from 'apollo-server';

const typeDefs = gql`
type Player {
  name: String
  score: Int
  secret: String
}

type Game {
  id: String
}

type Query {
  players: [Player]
}

type Mutation {
  interact( from: String!, to: String!, unit: Int!): Player
  signup(name: String) : Player
}
`;

export default typeDefs;
