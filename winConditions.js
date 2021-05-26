// Win conditions for 2d board representation
// [row, col]
//
//   0,0 | 0,1 | 0,2
//   ---------------
//   1,0 | 1,1 | 1,2
//   ---------------
//   2,0 | 2,1 | 2,2
//
const WIN_CONDITIONS_2D = [
  //Horizontals
  [[0,0], [0,1], [0,2]],
  [[1,0], [1,1], [1,2]],
  [[2,0], [2,1], [2,2]],
  //Verticals
  [[0,0], [0,1], [0,2]],
  [[1,0], [1,1], [1,2]],
  [[2,0], [2,1], [2,2]],
  //Diagonals
  [[0,0], [1,1], [2,2]],
  [[0,2], [1,1], [2,0]],
]

// Win conditions for a linear board representation
// each integer represents a board spot:
//
//   1 | 2 | 3
//   ---------
//   4 | 5 | 6
//   ---------
//   7 | 8 | 9
//

const WIN_CONDITIONS_LINEAR = [
  //Horizontals
  [1,2,3],
  [4,5,6],
  [7,8,9],
  //Verticals
  [1,4,7],
  [2,5,8],
  [3,6,9],
  //Diagonals
  [1,5,9],
  [3,5,7]
]

module.exports = {
  WIN_CONDITIONS_2D,
  WIN_CONDITIONS_LINEAR
}
