const players = [
  {
    id: 'A',
    name: 'A',
    score: 12,
    secret: 'secret',
    units: [1, 2, 3],
    invite: true,
  },
  { id: 'B', name: 'B', score: 5 },
  { id: 'C', name: 'C', score: 15 },
  { id: 'D', name: 'D', score: 3 },
];

const game = {
  id: 'test',
  nextTurn: 1000,
  points: [3, 4, 5],
  player: players[0],
};

const resolvers = {
  Query: {
    players: () => players,
    status: () => game,
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
    interact: (_, args) => { console.log(args); players[0].invite = true; return players[0]; },
    cancel: (_, { from }) => {
      const playerEntity = players.find(p => p.name === from);
      playerEntity.invite = false;
      return playerEntity;
    },
  },
};

export default resolvers;
