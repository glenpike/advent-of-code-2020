var fs = require('fs');

require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

var input = require("./input.txt");

const passes = input.split('\n')


const getPosition = (str) => {
  let position = 0
  let start = Math.pow(2, str.length)
  for(let i = 0;i < str.length;i++) {
    start = start >> 1
    const ch = str.charAt(i)
    if(ch === 'B' || ch === 'R') {
      position += start
    }
    // console.log(`${i}: ${start} ${ch} ${position}`)
  }
  return position
}

// Fancy pants way - 'if u cant reed this u2dumb'
const getPosition2 = (str) => str.split('').reduce((position, ch, index) => {
    if(ch === 'B' || ch === 'R') {
      position += Math.pow(2, str.length - (index + 1))
    }
    return position
  }, 0)

console.log('FBFBBFF = 44', getPosition('FBFBBFF') == 44)
console.log('FBFBBFF = 44', getPosition2('FBFBBFF') == 44)
console.log('BFFFBBF = 70', getPosition('BFFFBBF') == 70)
console.log('RLR = 5', getPosition('RLR') == 5)

const getSeatPosition = (str) => {
  const row = getPosition2(str.substr(0, 7))
  const col = getPosition2(str.substr(-3))
  return {
    str,
    row,
    col,
    
    id: row * 8 + col
  }
}

console.log('BFFFBBFRRR: row 70, column 7, seat ID 567', getSeatPosition('BFFFBBFRRR'))
console.log('FFFBBBFRRR: row 14, column 7, seat ID 119', getSeatPosition('FFFBBBFRRR'))
console.log('BBFFBBFRLL: row 102, column 4, seat ID 820', getSeatPosition('BBFFBBFRLL'))

const positions = passes.map((pass) => getSeatPosition(pass))

positions.sort((a, b) => b.id - a.id)
console.log('highestId ', positions[0])

for(let i = 0;i < positions.length - 1;i++) {
  const firstId = positions[i].id
  const secondId = positions[i + 1].id
  if(Math.abs(firstId - secondId) == 2) {
    console.log('positions ', firstId, secondId)
    console.log('your position ', Math.min(firstId, secondId) + 1)
  }
}
