const fs = require('fs')

require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8')
};

// Trim input because editor adds empty line at end...
const input = require("./input.txt").trim()

const testInput = `
nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6`.trim()

const runInstruction = (line, counter, lineNumber) => {
  let nextInstruction = 0
  const [, instruction, amount] = line.match(/([a-z]{3})\s((\+|-)[0-9]+)/)
  // console.log(`'${instruction}' = ${Number(amount)} (${lineNumber})`)
  switch(instruction) {
    case 'acc':
      counter += Number(amount)
      nextInstruction = lineNumber + 1
      break
    case 'jmp':
      nextInstruction = lineNumber + Number(amount)
      break
    case 'nop':
    default:
      nextInstruction = lineNumber + 1
      break
  }
  return {
    nextInstruction,
    counter
  }
}

// console.log('acc +1', runInstruction('acc +1', 0, 0).nextInstruction == 1)
// console.log('acc +1', runInstruction('acc +1', 0, 0).counter == 1)
// console.log('jmp -3, 1, 10', runInstruction('jmp -3', 1, 10))
// console.log('nop +0', runInstruction('nop +0', 2, 3))

const runProgramme = (lines) => {
  const linesExecuted = []
  let done = false
  let line = 0
  let counter = 0
  let terminated = false
  while(!done) {
    const str = lines[line]
    const result = runInstruction(str, counter, line)
    linesExecuted.push(line)
    if(linesExecuted.indexOf(result.nextInstruction) === -1) {
      counter = result.counter
      line = result.nextInstruction
      if(line >= lines.length) {
        terminated = true
        done = true
      }
    } else {
      // console.log('infinite loop ', line, counter, linesExecuted.length, str, result.nextInstruction)
      done = true
    }
    // console.log(`str ${str} nextInstruction ${result.nextInstruction} counter ${counter} nextLine ${line} linesExecuted: ${linesExecuted}`)
  }
  return {
    counter,
    linesExecuted,
    terminated,
  }
}

const testLines = testInput.split('\n')
console.log('runProgramme ', runProgramme(testLines))

const lines = input.split('\n')
const programmeResult = runProgramme(lines)

// Part 2
const testFixedProgramme = `
nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
nop -4
acc +6`.trim()

console.log('runProgramme ', runProgramme(testFixedProgramme.split('\n')))

//Brute force it.
for(let i = 0;i < lines.length;i++) {
  const fixedProgramme = lines.slice(0)
  const line = fixedProgramme[i]
  if(line.indexOf('jmp') === 0) {
    fixedProgramme[i] = line.replace('jmp', 'nop')
  } else if(line.indexOf('nop') === 0) {
    fixedProgramme[i] = line.replace('nop', 'jmp')
  }
  const fixedResult = runProgramme(fixedProgramme)
  if(fixedResult.terminated) {
    console.log('fixedProgramme in ', i, fixedResult.counter, fixedResult.linesExecuted.slice(-1))
    break
  }
}

//Faster?
programmeResult.linesExecuted.reverse().every((lineToCheck, i) => {
  const fixedProgramme = lines.slice(0)
  const line = fixedProgramme[lineToCheck]
  if(line.indexOf('jmp') === 0) {
    fixedProgramme[lineToCheck] = line.replace('jmp', 'nop')
  } else if(line.indexOf('nop') === 0) {
    fixedProgramme[lineToCheck] = line.replace('nop', 'jmp')
  }
  const fixedResult = runProgramme(fixedProgramme)
  if(fixedResult.terminated) {
    console.log('fixedProgramme in ', i, fixedResult.counter, fixedResult.linesExecuted.slice(-1))
    return false
  }
  return true
})
