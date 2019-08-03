/* eslint-disable no-param-reassign */
import { Datastore } from '@google-cloud/datastore';

const SCORE_PENALTY = 5;
const datastore = new Datastore();
function getMax(units) {
  let max = -1;
  if (units[0] > units[1] && units[0] > units[2]) max = 0;
  if (units[1] > units[0] && units[1] > units[2]) max = 1;
  if (units[2] > units[0] && units[2] > units[1]) max = 2;
  if (max > -1) return max;
  return null;
}

export default async function (req, res, next) {
  console.log(`Running game tick for ${req.params.game}`);
  const transaction = datastore.transaction();
  const units = [0, 0, 0];
  try {
    const [players] = await datastore.runQuery(datastore.createQuery('Player'));

    await transaction.run();
    const gameKey = datastore.key(['Game', req.params.game]);
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
        p.score -= SCORE_PENALTY;
      }
      p.units = [0, 0, 0];
    });

    game.points = [
      (game.points[0] - units[0] * unitWorth[0]) + game.pointsPerRound[0],
      (game.points[1] - units[1] * unitWorth[1]) + game.pointsPerRound[1],
      (game.points[2] - units[2] * unitWorth[2]) + game.pointsPerRound[2],
    ];
    game.nextRound = new Date(Date.now() + 1795000);

    transaction.update(players);
    transaction.update(game);
    transaction.commit();
    res.status(200);
    res.send('Tick OK');
  } catch (err) {
    transaction.rollback();
    next(err);
  }
}
