const persistence = require('./persistence');
const winConditions = require('./winConditions');

const allPossibleMoves = [1,2,3,4,5,6,7,8,9];

function flipCoin() {
  return (Math.floor(Math.random() * 2) === 0) ? 'heads' : 'tails';
};

function checkForWin(currentGame, movesKey) {
  const winningCondition = winConditions.WIN_CONDITIONS_LINEAR.find(winningComboMoves =>
    winningComboMoves.every(move => currentGame[movesKey].includes(move))
  );
  return !!winningCondition;
};


function checkForStalemate(currentGame) {
  return (currentGame.xMoves.length + currentGame.oMoves.length) === 9;
};

function playMoveAndSeeIfWinner(currentGame, user, move) {
  const movesKey = (user === currentGame.xUser) ? 'xMoves' : 'oMoves';
  const previousMoves = currentGame[movesKey];
  previousMoves.push(move);
  const updatedMoves = previousMoves.sort();
  currentGame[movesKey] = updatedMoves;
  if (updatedMoves.length >= 3) {
    const isWinner = checkForWin(currentGame, movesKey);
    currentGame.winner = isWinner ? user : null;
    
    if (!currentGame.winner) {
      const isStalemate = checkForStalemate(currentGame);
      currentGame.winner = isStalemate ? 'stalemate' : null;
    }
  }
  
  return persistence.updateGame(currentGame);
};

function findAvailableChoices(currentGame) {
  const alreadyMadeChoices = currentGame.xMoves.concat(currentGame.oMoves);
  const remainingChoices = allPossibleMoves.filter(i => !alreadyMadeChoices.includes(i));
  return remainingChoices;
};

function playAIMove(currentGame) {
  const availableChoices = findAvailableChoices(currentGame);
  const randomChoice = availableChoices[Math.floor(Math.random() * availableChoices.length)];
  return playMoveAndSeeIfWinner(currentGame, 'AI', randomChoice);
};

function isValidUserMove(currentGame, userId, move) {
  if (currentGame.winner) return false;

  const userIsX = userId === currentGame.xUser;
  const userIsO = userId === currentGame.oUser;
  const userIsPartOfGame = userIsX || userIsO;
  if (!userIsPartOfGame) return false;

  const xAlreadyPlayedMove = currentGame.xMoves.includes(move);
  const oAlreadyPlayedMove = currentGame.oMoves.includes(move);
  if (xAlreadyPlayedMove || oAlreadyPlayedMove) return false;

  const isXTurn = currentGame.xMoves.length === currentGame.oMoves.length;
  const isOTurn = currentGame.xMoves.length === (currentGame.oMoves.length + 1);
  if (userIsX && isXTurn) return true;
  if (userIsO && isOTurn) return true;
  
  return false;
};

function userCanViewGame(game, userId) {
  return (game.xUser === userId) || (game.oUser === userId);
};

function startNewGame(creatingUserId, opponentId) {
  const creatingUserIsX = flipCoin() === 'heads';
  const opponent = opponentId || 'AI';

  const newGame = creatingUserIsX
    ? persistence.createGame(creatingUserId, opponent)
    : persistence.createGame(opponent, creatingUserId);

  const gameBeforeNextUserMove = (newGame.xUser === 'AI') ? playAIMove(newGame) : newGame;
  return {
    game: gameBeforeNextUserMove,
    error: null,
  };
};

function submitUserMove(gameId, userId, userMove) {
  const currentGame = persistence.readGame(gameId);
  if (!currentGame) {
    return {
      game: null,
      error: {
        type: 'Not Found',
        description: 'No game with that ID found.',
      }
    };
  };
  const userIsPlayingAI = (currentGame.xUser === 'AI') || (currentGame.oUser === 'AI');

  if (isValidUserMove(currentGame, userId, userMove)) {
    const gameAfterUserMove = playMoveAndSeeIfWinner(currentGame, userId, userMove);
    if (userIsPlayingAI && !gameAfterUserMove.winner) {
      const gameAfterAIMove = playAIMove(currentGame);
      return {
        game: gameAfterAIMove,
        error: null,
      };
    } else {
      return {
        game: gameAfterUserMove,
        error: null,
      };
    }

  } else {
    return {
      game: currentGame,
      error: {
        type: 'Conflict',
        description: 'You are not currently allowed to play a move in this game.',
      }
    };
  }
};

function getGame(gameId, userId) {
  const currentGame = persistence.readGame(gameId);
  if (!currentGame) {
    return {
      game: null,
      error: {
        type: 'Not Found',
        description: 'No game with that ID found.',
      }
    };
  }

  if (userCanViewGame(currentGame, userId)) {
    return {
      game: currentGame,
      error: null,
    };
  } else {
    return {
      game: null,
      error: {
        type: 'Forbidden',
        description: 'Only participants can view this game.',
      }
    };
  }
};

module.exports = {
  startNewGame,
  submitUserMove,
  getGame,
};
