import { Datastore } from '@google-cloud/datastore';

const STARTING_POINTS = 10;
const HIRING_COST = 1;
const GAME_ID = 'test';
const POINT_ADD = 1;

const datastore = new Datastore();

async function listPlayers(_, args) {
  const query = datastore.createQuery('Player');
  const [entities] = await datastore.runQuery(query);
  if (args.canInteractWith) {
    return entities.filter(e => e[Datastore.KEY].id !== args.canInteractWith)
      .filter(e => !e.history.includes(args.canInteractWith));
  }
  return entities;
}

async function registerPlayer(_, args) {
  const query = datastore.createQuery('Player')
    .filter('name', '=', args.name)
    .filter('secret', '=', args.secret);
  const [player] = await datastore.runQuery(query);
  if (player[0]) return player[0];

  const key = datastore.key('Player');
  const newPlayer = {
    key,
    data: {
      name: args.name,
      score: STARTING_POINTS,
      secret: args.secret,
      units: [0, 0, 0],
      history: [],
    },
  };
  await datastore.save(newPlayer);
  return { ...newPlayer.data, id: key.id };
}

async function getStatus(_, args) {
  const taskKey = datastore.key(['Player', Number(args.player)]);
  const [player] = await datastore.get(taskKey);
  const [game] = await datastore.get(datastore.key(['Game', GAME_ID]));
  if (!player) throw new Error('Not found');
  return { ...game, id: game[Datastore.KEY].name, player };
}

async function interact(_, { from, to, unit }) {
  if (from === to) throw new Error('Can\'t interact with yourself');

  const [fromPlayer] = await datastore.get(datastore.key(['Player', Number(from)]));
  const [toPlayer] = await datastore.get(datastore.key(['Player', Number(to)]));
  if (fromPlayer && toPlayer) {
    if (toPlayer.history.includes(from)) throw new Error('Already interacted with this player');

    if (toPlayer.pending && toPlayer.pending[0] === from && toPlayer.pending[1] === unit) {
      fromPlayer.pending = null;
      toPlayer.pending = null;
      fromPlayer.history.push(to);
      toPlayer.history.push(from);
      fromPlayer.units[unit] += 1;
      toPlayer.units[unit] += 1;
      fromPlayer.score -= HIRING_COST;
      toPlayer.score -= HIRING_COST;
      const transaction = datastore.transaction();
      await transaction.run();
      const [game] = await transaction.get(datastore.key(['Game', GAME_ID]));
      game.points[(unit + 1) % 3] += POINT_ADD;
      game.points[(unit + 2) % 3] += POINT_ADD;
      transaction.update(game);
      transaction.commit();
    } else {
      fromPlayer.pending = [toPlayer[Datastore.KEY].id, unit];
    }
    datastore.update(fromPlayer);
    datastore.update(toPlayer);
    return fromPlayer;
  }
  throw new Error('Players not found');
}

async function cancel(_, { from }) {
  const [player] = await datastore.get(datastore.key(['Player', Number(from)]));
  if (!player) throw new Error('Not found');
  player.pending = null;
  datastore.update(player);
  return player;
}

const resolvers = {
  Query: {
    players: listPlayers,
    status: getStatus,
  },

  Mutation: {
    signup: registerPlayer,
    interact,
    cancel,
  },

  Player: {
    id: (parent) => { if (parent.id) { return parent.id; } return parent[Datastore.KEY].id; },
    invite: parent => (parent.pending != null),
  },
};

export default resolvers;
