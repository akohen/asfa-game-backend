const players = [
  { name: 'A', score: 1 },
  { name: 'B', score: 5 },
  { name: 'C', score: 15 },
  { name: 'D', score: 3 },
];

const resolvers = {
  Query: {
    players: () => players,
  },
  Mutation: {
    signup: (_, args) => {
      const newPlayer = {
        name: args.name,
        score: 0,
        secret: Math.random().toString(36).substring(7),
      };
      players.push(newPlayer);
      return newPlayer;
    },
    interact: () => true,
  },
};

export default resolvers;
