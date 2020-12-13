const fs = require('fs')

require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8')
};

// Trim input because editor adds empty line at end...
const input = require("./input.txt").trim()
const inputArray = input.split('\n')

const testInput = `
16
10
15
5
1
11
7
19
6
12
4`.trim()

const testInputArray = testInput.split('\n')

const countDifferenceValues = (values) => {
  const sorted = values.map((value) => Number(value)).sort((a, b) => a - b)
  let current = 0
  const differences = sorted.reduce((acc, value) => {
    const difference = value - current
    if(!acc[difference]) {
      acc[difference] = 0
    }
    // console.log(`value: ${value}, ${current}, difference: ${difference} acc: ${acc[difference]}`)
    acc[difference] += 1
    current = value
    return acc
  }, {})
  if(!differences[3]) {
    differences[3] = 0
  }
  differences[3]++
  return differences
}

const testDifferences = countDifferenceValues(testInputArray)
console.log('testDifferences: ', testDifferences)

const testInput2 = `
28
33
18
42
31
14
46
20
48
47
24
23
49
45
19
38
39
11
1
32
25
35
8
17
7
9
4
2
34
10
3`.trim()

const testInputArray2 = testInput2.split('\n')

const testDifferences2 = countDifferenceValues(testInputArray2)
console.log('testDifferences2: ', testDifferences2)

const differences = countDifferenceValues(inputArray)
console.log('differences: ', differences)
const result = differences[1] * differences[3]
console.log('result: ', result)

//Part 2...
// Helped by this thread: https://www.reddit.com/r/adventofcode/comments/kbc4x0/2020_day_10_part_2_help_needed_to_clarify_logic/

// We loop through and find 'runs' where the next number is current + 1 and count the lengths of these
// e.g. [4, 5, 6, 7] has a run of 3 after the current number
// We cheat a little and find the longest run in our input which is actually 4
// Knowing this, we can map out how many paths that a run will result in
// https://www.reddit.com/r/adventofcode/comments/kbc9vp/2020_day_10_part_2_does_your_joltage_data_set_do/
// This number will either be 1, 2, 4 or 7
// We can store the path total for each run (we ignore runs of 1 (isolated number which is +/- 3 of the ones either side))
// The product of each of these totals is our value
// We could recurse this of course.
// I didn't really understand this https://math.stackexchange.com/questions/2844818/coin-tossing-problem-where-three-tails-come-in-a-row
const findDifferentPaths = (values) => {
  const sorted = values.map((value) => +value).sort((a, b) => a - b)
  console.log('findDifferentPaths ', sorted)
  sorted.unshift(0)
  sorted.push(sorted[sorted.length - 1] + 3)
  let current = sorted[0]
  // let maxRunLength = 0
  const runPaths = {
    1: 1,
    2: 2,
    3: 4,
    4: 7,
  }
  const runValues = []
  for(let i = 1;i < sorted.length;i++) {
    let next = sorted[i]
    let runLength = 0
    while(next - current === 1) {
      runLength++
      // console.log(`${i}, current: ${current}, next: ${next}, runLength: ${runLength}`)
      i++
      current = next
      next = sorted[i]
    }
    
    if(runLength > 1) {
      const variations = runPaths[runLength]
      runValues.push(variations)
      // console.log(`found branches: ${runLength} = ${variations}, ${runValues}`)
    }
    // if(runLength > maxRunLength) {
    //   maxRunLength = runLength
    // }
    current = next
  }
  return runValues.reduce((acc, value) => acc * value, 1)
  // return maxRunLength
}

const testTotal = findDifferentPaths(testInputArray)
console.log('testTotal ', testTotal)

const testTotal2 = findDifferentPaths(testInputArray2)
console.log('testTotal2 ', testTotal2)

const total = findDifferentPaths(inputArray)
console.log('total ', total)
