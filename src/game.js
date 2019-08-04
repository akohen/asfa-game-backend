/* eslint-disable no-param-reassign */
import { Datastore } from '@google-cloud/datastore';

const datastore = new Datastore();

function getMax(units) {
  if (units[0] > units[1] && units[0] > units[2]) return 0;
  if (units[1] > units[0] && units[1] > units[2]) return 1;
  if (units[2] > units[0] && units[2] > units[1]) return 2;
  return null;
}

export default async function (req, res, next) {
  console.log(`Running game tick for ${req.params.game}`);
  const transaction = datastore.transaction();
  const gameKey = datastore.key(['Game', req.params.game]);
  const units = [0, 0, 0];
  try {
    await transaction.run();
    const [players] = await datastore.runQuery(datastore.createQuery('Player').hasAncestor(gameKey));
    const [game] = await transaction.get(gameKey);

    if (!game) throw new Error('Game not found');
    if (req.params.secret !== game.secret) throw new Error('Incorrect secret');

    players.forEach((p) => {
      const max = getMax(p.units);
      if (max !== null) { units[max] += p.units[max]; }
    });

    const unitWorth = [
      (units[0] > 0) ? Math.floor(game.points[0] / units[0]) : 0,
      (units[1] > 0) ? Math.floor(game.points[1] / units[1]) : 0,
      (units[2] > 0) ? Math.floor(game.points[2] / units[2]) : 0,
    ];

    players.forEach((p) => {
      const max = getMax(p.units);
      if (max !== null) {
        p.score += p.units[max] * unitWorth[max];
      } else {
        p.score -= game.scorePenalty;
      }
      p.units = [0, 0, 0];
    });

    game.points = [
      (game.points[0] - units[0] * unitWorth[0]) + game.pointsPerRound[0],
      (game.points[1] - units[1] * unitWorth[1]) + game.pointsPerRound[1],
      (game.points[2] - units[2] * unitWorth[2]) + game.pointsPerRound[2],
    ];
    game.nextRound = new Date(Date.now() + game.roundDuration * 1000);

    transaction.update(players);
    transaction.update(game);
    transaction.commit();
    res.status(200);
    res.send({ units, unitWorth });
  } catch (err) {
    transaction.rollback();
    next(err);
  }
}
