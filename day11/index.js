const fs = require('fs');
const { runInContext } = require('vm');

require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8')
};

// Trim input because editor adds empty line at end...
const input = require("./input.txt").trim()
const inputWidth = input.indexOf('\n')
const inputStr = input.replace(/\n/g, '')

const testInput = `
L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL`.trim()

const testWidth = testInput.indexOf('\n')
const testStr = testInput.replace(/\n/g, '')

const getNextSeatState = (prevState, numCols, col, row) => {
  const currentSeatState = prevState.charAt(row * numCols + col)
  if(currentSeatState === '.') {
    return '.'
  }
  const startRow = Math.max(row - 1, 0)
  const startCol = Math.max(col - 1, 0)
  const lastRow = Math.ceil(prevState.length / numCols) - 1
  const maxRow = Math.min(row + 1, lastRow)
  const maxCol = Math.min(col + 1, numCols - 1)

  let numOccupied = 0
  loop:
  for(let i = startRow;i <= maxRow;i++) {
    for(let j = startCol;j <= maxCol;j++) {
      if(i === row && j === col) {
        continue
      }
      const prevChar = prevState.charAt(i * numCols + j)
      // console.log(`[${i}, ${j}] = ${prevChar} (${numOccupied})`)
  
      if(prevChar === '#') {
        numOccupied++
        if(numOccupied >= 4) {
          break loop;
        }
      }
    }
  }
  // console.log(`[${row}, ${col}] = ${currentSeatState} (${numOccupied}) min: [${startRow},${startCol}] max: [${maxRow},${maxCol}]`)
  if(currentSeatState === 'L' && numOccupied === 0) {
    return '#'
  } else if(currentSeatState === '#' && numOccupied >= 4) {
    return 'L'
  } else {
    return currentSeatState
  }
}

const getNextState = (prevState, numCols) => {
  let nextState = ''
  const numRows = Math.floor(prevState.length / numCols)
  for(let row = 0;row < numRows;row++) {
    for(let col = 0;col < numCols;col++) {
      nextState += getNextSeatState(prevState, numCols, col, row)
    }
  }
  return nextState
}

let nextState
// const start1 = `
// LLL
// LLL
// LLL
// `.trim().replace(/\n/g, '')

// const start2 = `
// ###
// ###
// ###
// `.trim().replace(/\n/g, '')

// const start3 = `
// ...
// ...
// ...
// `.trim().replace(/\n/g, '')

// nextState = getNextState(start1, 3)
// console.log('all unoccupied -> ', nextState === start2)
// nextState = getNextState(start2, 3)
// console.log('all occupied -> ', nextState === '#L#LLL#L#')
// nextState = getNextState(start3, 3)
// console.log('all floor ', nextState === start3)

const compareStr = `
#.##.##.##
#######.##
#.#.#..#..
####.##.##
#.##.##.##
#.#####.##
..#.#.....
##########
#.######.#
#.#####.##`.trim().replace(/\n/g, '')

nextState = getNextState(testStr, testWidth)

console.log('first round ', nextState)
console.log('compare ', compareStr === nextState)

for(let i = 0;i < 4;i++) {
  nextState = getNextState(nextState, testWidth)
}

let stableStr = `
#.#L.L#.##
#LLL#LL.L#
L.#.L..#..
#L##.##.L#
#.#L.LL.LL
#.#L#L#.##
..L.L.....
#L#L##L#L#
#.LLLLLL.L
#.#L#L#.##`.trim().replace(/\n/g, '')

console.log('after 4 more rounds ', nextState)
console.log('compare ', stableStr === nextState)

const getOccupiedSeats = (state) => state.split('').reduce((acc, char) => {
    if(char === '#') {
      acc++
    }
    return acc
  }, 0)

let numOccupied = getOccupiedSeats(nextState)
console.log('test ', numOccupied)

nextState = inputStr
let lastState = ''
while(lastState !== nextState) {
  lastState = nextState
  nextState = getNextState(lastState, inputWidth)
}

numOccupied = getOccupiedSeats(nextState)
console.log('part1 ', numOccupied)


const findFirstVisibleSeatState = (prevState, numCols, startCol, startRow, vector) => {
  const [xDir, yDir] = vector
  let col = startCol
  let row = startRow
  // Always assuming vector is -1 <= n <= 1
  col += xDir * 1
  row += yDir * 1
  let char = '.'
  let index
  const numRows = Math.ceil(prevState.length / numCols)
  while(row >= 0 && col >= 0 && row < numRows && col < numCols && char === '.') {
    index = row * numCols + col
    char = prevState.charAt(index)
    // console.log(`char ${char} @ [${col}, ${row}] index ${index}, vector ${vector}`)
    col += xDir * 1
    row += yDir * 1
  }
  // console.log(`result char ${char} @ [${col}, ${row}] index ${index}, vector ${vector}`)
  return char
}

// const testVectors = `
// ..L.
// ..#.
// L...
// .#L#
// `.trim().replace(/\n/g, '')
// console.log('# ? ', findFirstVisibleSeatState(testVectors, 4, 0, 0, [1, 1]))
// console.log('L ? ', findFirstVisibleSeatState(testVectors, 4, 0, 0, [1, 0]))
// console.log('L ? ', findFirstVisibleSeatState(testVectors, 4, 0, 0, [0, 1]))
// console.log('. ? ', findFirstVisibleSeatState(testVectors, 4, 0, 0, [-1, 0]))
// console.log('. ? ', findFirstVisibleSeatState(testVectors, 4, 0, 0, [0, -1]))
// console.log('. ? ', findFirstVisibleSeatState(testVectors, 4, 3, 1, [0, -1]))
// console.log('. ? ', findFirstVisibleSeatState(testVectors, 4, 3, 1, [1, -1]))
// console.log('. ? ', findFirstVisibleSeatState(testVectors, 4, 3, 1, [1, 0]))
// console.log('. ? ', findFirstVisibleSeatState(testVectors, 4, 3, 1, [1, 1]))
// console.log('# ? ', findFirstVisibleSeatState(testVectors, 4, 3, 1, [0, 1]))
// console.log('# ? ', findFirstVisibleSeatState(testVectors, 4, 3, 1, [-1, 1]))
// console.log('# ? ', findFirstVisibleSeatState(testVectors, 4, 3, 1, [-1, 0]))
// console.log('L ? ', findFirstVisibleSeatState(testVectors, 4, 3, 1, [-1, -1]))


const getNextSeatStatePart2 = (prevState, numCols, col, row) => {
  const currentSeatState = prevState.charAt(row * numCols + col)
  if(currentSeatState === '.') {
    return '.'
  }
  const vectors = [
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
    [-1, -1],
  ]
  let numOccupied = 0
  loop:
  for(let i = 0;i < vectors.length;i++) {
    const vector = vectors[i]
    const firstVisibleSeat = findFirstVisibleSeatState(prevState, numCols, col, row, vector)
    if(firstVisibleSeat === '#') {
      numOccupied++
      if(numOccupied >= 5) {
        break loop;
      }
    }
  }
  // console.log(`[${row}, ${col}] = ${currentSeatState} (${numOccupied})`)
  if(currentSeatState === 'L' && numOccupied === 0) {
    return '#'
  } else if(currentSeatState === '#' && numOccupied >= 5) {
    return 'L'
  } else {
    return currentSeatState
  }
}

const getNextStatePart2 = (prevState, numCols) => {
  let nextState = ''
  const numRows = Math.floor(prevState.length / numCols)
  for(let row = 0;row < numRows;row++) {
    for(let col = 0;col < numCols;col++) {
      nextState += getNextSeatStatePart2(prevState, numCols, col, row)
    }
  }
  return nextState
}

const part2Round2 = `
#.##.##.##
#######.##
#.#.#..#..
####.##.##
#.##.##.##
#.#####.##
..#.#.....
##########
#.######.#
#.#####.##`.trim()

nextState = getNextStatePart2(testStr, testWidth)
console.log('part2Round1 ', nextState == part2Round2.replace(/\n/g, ''))

const debug = (round, state, width) => {
  console.log(`round ${round}`)
  const numRows = Math.ceil(state.length / width)
  let index = 0
  for(let i = 0;i < numRows;i++) {
    const substr = state.substr(index, width)
    index += width
    console.log(substr)
  }
  console.log('')
}

nextState = testStr
lastState = ''
let round = 0
while(lastState !== nextState) {
  lastState = nextState
  nextState = getNextStatePart2(lastState, testWidth)
  // debug(round, nextState, testWidth)
  round++
}

stableStr = `
#.L#.L#.L#
#LLLLLL.LL
L.L.L..#..
##L#.#L.L#
L.L#.LL.L#
#.LLLL#.LL
..#.L.....
LLL###LLL#
#.LLLLL#.L
#.L#LL#.L#`.trim().replace(/\n/g, '')

console.log('stabilised testInput ', nextState == stableStr)

console.log('part2 test: numOccupied ', getOccupiedSeats(nextState))

nextState = inputStr
lastState = ''
while(lastState !== nextState) {
  lastState = nextState
  nextState = getNextStatePart2(lastState, inputWidth)
}

numOccupied = nextState.split('').reduce((acc, char) => {
  if(char === '#') {
    acc++
  }
  return acc
}, 0)

console.log('part2 numOccupied ', getOccupiedSeats(nextState))
