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

// const testInputArray = testInput.split('\n')
const testWidth = testInput.indexOf('\n')
const testStr = testInput.replace(/\n/g, '')

const getNextSeatState = (prevState, numCols, row, col) => {
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

const getNextSeatsState = (prevState, numCols) => {
  let nextState = ''
  const numRows = Math.floor(prevState.length / numCols)
  for(let row = 0;row < numRows;row++) {
    for(let col = 0;col < numCols;col++) {
      nextState += getNextSeatState(prevState, numCols, row, col)
    }
  }
  return nextState
}

let nextState
const start1 = `
LLL
LLL
LLL
`.trim().replace(/\n/g, '')

const start2 = `
###
###
###
`.trim().replace(/\n/g, '')

const start3 = `
...
...
...
`.trim().replace(/\n/g, '')

nextState = getNextSeatsState(start1, 3)
console.log('all unoccupied -> ', nextState === start2)
nextState = getNextSeatsState(start2, 3)
console.log('all occupied -> ', nextState === '#L#LLL#L#')
nextState = getNextSeatsState(start3, 3)
console.log('all floor ', nextState === start3)

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

nextState = getNextSeatsState(testStr, testWidth)

console.log('first round ', nextState)
console.log('compare ', compareStr === nextState)

for(let i = 0;i < 4;i++) {
  nextState = getNextSeatsState(nextState, testWidth)
}

const stableStr = `
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

let numOccupied = nextState.split('').reduce((acc, char) => {
  if(char === '#') {
    acc++
  }
  return acc
}, 0)
console.log('test ', numOccupied)

nextState = inputStr
let lastState = ''
while(lastState !== nextState) {
  lastState = nextState
  nextState = getNextSeatsState(lastState, inputWidth)
}

numOccupied = nextState.split('').reduce((acc, char) => {
  if(char === '#') {
    acc++
  }
  return acc
}, 0)

console.log('part1 ', numOccupied)
