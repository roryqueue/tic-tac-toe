const allGames = {}

function genPseudorandomId() {
  return Math.random().toString(36).substring(2,14);
};

function readGame(gameId) {
  return allGames[gameId];
};

function createGame(xUser, oUser) {
  const gameId = genPseudorandomId();

  const newGame = {
    gameId,
    xUser,
    oUser,
    xMoves: [],
    oMoves: [],
    winner: null,
  };
  allGames[gameId] = newGame;
  return readGame(gameId);
};

function updateGame(updatedGame) {
  allGames[updatedGame.gameId] = updatedGame;
  return readGame(updatedGame.gameId);
};

module.exports = {
  readGame,
  createGame,
  updateGame,
};
