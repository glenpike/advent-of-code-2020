const fs = require('fs');

require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

// Trim input because editor adds empty line at end...
const input = require("./input.txt").trim();

const getQuestionsForLine = (line, questions = {}) =>
  line.split('').reduce((store, letter) => {
    if(!store[letter]) {
      store[letter] = 0
    }
    store[letter] += 1
    return store
  }, questions)


console.log('drsleaqghypbtinmfuo', getQuestionsForLine('drsleaqghypbtinmfuo'))

const getQuestionsForGroup = (people) =>
  people.reduce((questions, person) => {
    return getQuestionsForLine(person, questions)
  }, {})

const testGroup = `o
c
na
qku`
console.log('getQuestionsForGroup ', getQuestionsForGroup(testGroup.split('\n')))

const countQuestionsPerGroup = (groups) =>
  groups.map((group) => {
    const letters = getQuestionsForGroup(group.split('\n'))
    return Object.keys(letters).length
  })

console.log('testGroup = 7 questions per group', countQuestionsPerGroup([testGroup]) == 7)

const groups = input.split('\n\n')
const result = countQuestionsPerGroup(groups).reduce((total, groupTotal) => total + groupTotal, 0)

console.log('result ', result)

// Part 2

const countQuestionsEveryoneAnswered = (groups) =>
  groups.map((group) => {
    const people = group.split('\n')
    const questions = getQuestionsForGroup(people)
    const groupTotal = Object.values(questions).reduce((total, value) => {
      if(value >= people.length) {
        total += 1
      }
      return total
    }, 0)
    // console.log('group totals: ', group, groupTotal, questions)
    return groupTotal
  })

const testInput = `abc

a
b
c

ab
ac

a
a
a
a

b`.split('\n\n')

console.log('(testInput) everyone answered 6 questions ', countQuestionsEveryoneAnswered(testInput).reduce((total, groupTotal) => total + groupTotal, 0) == 6)

const properResult = countQuestionsEveryoneAnswered(input.split('\n\n')).reduce((total, groupTotal) => total + groupTotal, 0)
console.log('properResult: ', properResult)
