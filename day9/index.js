const fs = require('fs')

require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8')
};

// Trim input because editor adds empty line at end...
const input = require("./input.txt").trim()
const inputArray = input.split('\n')

const testInput = `
35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576`.trim()

const testInputArray = testInput.split('\n')

const anyTermsForSum = (sum, numbersToCheck) => {
  for(let i = 0;i < numbersToCheck.length;i++) {
    const firstNumber = Number(numbersToCheck[i])
    for(let j = 0;j < numbersToCheck.length;j++) {
      const secondNumber = Number(numbersToCheck[j])
      if(sum === firstNumber + secondNumber && firstNumber != secondNumber) {
        return true
      }
    }
  }
  return false
}

console.log('anyTermsForSum : 40, [35, 20, 15, 25, 47]', anyTermsForSum(40, [35, 20, 15, 25, 47]))
console.log('anyTermsForSum : 127, [95, 102, 117, 150, 182]', anyTermsForSum(127, [95, 102, 117, 150, 182]))

const findSumWithNoTerms = (numbers, preamble) => {
  let sum = -1;
  for(let i = preamble;i < numbers.length;i++) {
    sum = Number(numbers[i])
    const numbersToCheck = numbers.slice(i-preamble, i)
    const result = anyTermsForSum(sum, numbersToCheck)
    // console.log(`${i} sum: ${sum} - to check ${numbersToCheck} result: ${result}`)
    if(result === false) {
      return sum
    }
  }
  return -1
}

const testSumWithNoTerms = findSumWithNoTerms(testInputArray, 5)
console.log('testInput: ', testSumWithNoTerms)

const sumWithNoTerms = findSumWithNoTerms(inputArray, 25)
console.log('input: ', sumWithNoTerms)


// Part 2

const findRangeEqualsSum = (numbers, sum) => {
  let startIndex = currentIndex = 0;
  for(let i = 0; i < numbers.length;i++) {
    let acc = Number(numbers[i])
    // console.log(`starting next loop at ${i}: ${acc}`)
    for(let j = i + 1;j < numbers.length;j++) {
      acc += Number(numbers[j])
      if(acc > sum) {
        // console.log(`exceeds sum at ${j}: ${acc}`)
        break
      } else if(acc === sum) {
        return [i, j]
      }
    }
  }
  return [-1, -1]
}

const addFirstAndLastInRange = (range, numbers) => {
  const contiguousNums = numbers.slice(range[0], range[1] + 1).sort()
  // console.log(`range ${range}, first ${contiguousNums[0]} last ${contiguousNums[contiguousNums.length -1]}`)
  return +contiguousNums[0] + +contiguousNums[contiguousNums.length -1]
}

const testRange = findRangeEqualsSum(testInputArray, testSumWithNoTerms)
console.log('testRange ', testRange)
console.log('addFirstAndLastInRange ', addFirstAndLastInRange(testRange, testInputArray))

const range = findRangeEqualsSum(inputArray, sumWithNoTerms)
console.log('range ', range)
console.log('addFirstAndLastInRange ', addFirstAndLastInRange(range, inputArray))


