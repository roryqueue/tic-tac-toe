const express = require('express');
const router = express.Router();
const gameplay = require('./gameplay');

function getErrorStatusCode(error) {
  const specificStatusCodes = {
    'Forbidden': 403,
    'Not Found': 404,
    'Conflict': 409,
  };
  return specificStatusCodes[error.type] || 400;
};

router.get('/users/:userId/games/:gameId', function(req, res) {
  const gameId = req.params.gameId;
  const userId = req.params.userId;

  const gameReadResult = gameplay.getGame(gameId, userId);
  const statusCode = gameReadResult.error ? getErrorStatusCode(gameReadResult.error) : 200;
  res.status(statusCode).json(gameReadResult);
});

router.post('/users/:userId/games', (req, res) => {
  const userId = req.params.userId;
  const opponentId = req.body.opponentId || null;

  const gameCreateResult = gameplay.startNewGame(userId, opponentId);
  const statusCode = gameCreateResult.error ? getErrorStatusCode(gameCreateResult.error) : 201;
  res.status(statusCode).json(gameCreateResult);
});

router.patch('/users/:userId/games/:gameId/move/:userMove', (req, res) => {
  const gameId = req.params.gameId;
  const userId = req.params.userId;
  const userMove = parseInt(req.params.userMove);

  const gameUpdateResult = gameplay.submitUserMove(gameId, userId, userMove);
  const statusCode = gameUpdateResult.error ? getErrorStatusCode(gameUpdateResult.error) : 200;

  res.status(statusCode).json(gameUpdateResult);
});

module.exports = router;
