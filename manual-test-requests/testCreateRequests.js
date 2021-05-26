const makeRequest = require('./makeRequest')

makeRequest('POST', '/users/userOne/games')
makeRequest('POST', '/users/userOne/games', { opponentId: 'userTwo'})
