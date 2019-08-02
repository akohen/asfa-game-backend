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
};

const resolvers = {
  Query: {
    players: () => players,
    status: (_, { player }) => {
      const playerEntity = players.find(p => p.id === player);
      if (!playerEntity) throw new Error('Player Unknown');
      return { ...game, player: playerEntity };
    },
  },

  Mutation: {
    signup: (_, args) => {
      const newPlayer = {
        id: Math.random().toString(36).substring(2),
        name: args.name,
        score: 0,
        secret: args.secret,
        units: [0, 2, 5],
        invite: false,
      };
      players.push(newPlayer);
      return newPlayer;
    },

    interact: (_, args) => {
      const playerEntity = players.find(p => p.id === args.from);
      if (!playerEntity) throw new Error('Player Unknown');
      console.log(args);
      playerEntity.invite = true; return playerEntity;
    },

    cancel: (_, { from }) => {
      const playerEntity = players.find(p => p.id === from);
      if (!playerEntity) throw new Error('Player Unknown');
      playerEntity.invite = false;
      return playerEntity;
    },
  },
};

export default resolvers;
