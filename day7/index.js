const fs = require('fs');

require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

// Trim input because editor adds empty line at end...
const input = require("./input.txt").trim();

const parseRule = (str) => {
  const [, name, ruleStrings] = str.match(/(.+)\scontain\s(.+)\./)
  const rules = ruleStrings.split(',').reduce((ruleObj, rule) => {
    if(rule != 'no other bags') {
      let [, count, bagType] = rule.match(/([0-9]+)\s(.+)/)
      bagType = bagType.replace('bags', 'bag')
      ruleObj[bagType] = +count  
    }
    return ruleObj
  }, {})
  return {
    [name.replace('bags', 'bag')]: rules
  }
}

const testRules = [
  'wavy indigo bags contain 3 shiny cyan bags, 5 light orange bags.',
  'muted olive bags contain 4 mirrored lavender bags.',
  'bright white bags contain no other bags.'
]
// console.log('testRules[0] ', parseRule(testRules[0])['wavy indigo bag']['shiny cyan bag'] == 3)

const parseRules = (rules) =>
  rules.reduce((ruleStore, ruleStr) => {
    const rule = parseRule(ruleStr)
    rulesStore = Object.assign(ruleStore, rule)
    return ruleStore
  }, {})

// console.log('testRules? ', parseRules(testRules))

const rulesObj = parseRules(input.split('\n'))
// console.log('rulesObj? ', rulesObj)

const testInput2 = `
light red bags contain 1 bright white bag, 2 muted yellow bags.
dark orange bags contain 3 bright white bags, 4 muted yellow bags.
bright white bags contain 1 shiny gold bag.
muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
dark olive bags contain 3 faded blue bags, 4 dotted black bags.
vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
faded blue bags contain no other bags.
dotted black bags contain no other bags.
`.trim()

const testRulesObj2 = parseRules(testInput2.split('\n'))
// console.log('testRulesObj2? ', testRulesObj2)

const everyBagContaining = (bagName, rulesObj, results = []) => {
  const tmpResults = []
  for(const bag in rulesObj) {
    if(rulesObj[bag][bagName]) {
      tmpResults.push(bag)
    }
  }
  let nestedResults = []
  tmpResults.forEach((tmpResult) => {
    nestedResults = nestedResults.concat(everyBagContaining(tmpResult, rulesObj, []))
  })
  const onlyUnique = (value, index, self) => {
    return self.indexOf(value) === index
  }

  results = results.concat(nestedResults, tmpResults).filter(onlyUnique)

  return results
}

const testGoldBags = everyBagContaining('shiny gold bag', testRulesObj2, [])
// console.log('testGoldBags ', testGoldBags)

console.log('everyBagContaining a shiny gold one: ', everyBagContaining('shiny gold bag', rulesObj, []).length)

const countBagsInside = (bagName, rulesObj, multiplier = 1) => {
  const contents = rulesObj[bagName]
  let count = 0
  for(const bag in contents) {
    const tmp = countBagsInside(bag, rulesObj, contents[bag])
    // console.log('countBagsInside ', bag, ' = ', tmp, contents[bag])
    count += tmp + contents[bag]
  }
  return count * multiplier
}

const testInput3 = `
shiny gold bags contain 2 dark red bags.
dark red bags contain 2 dark orange bags.
dark orange bags contain 2 dark yellow bags.
dark yellow bags contain 2 dark green bags.
dark green bags contain 2 dark blue bags.
dark blue bags contain 2 dark violet bags.
dark violet bags contain no other bags.`.trim()

const testRulesObj3 = parseRules(testInput3.split('\n'))
// console.log('testRulesObj3 ', testRulesObj3)

// console.log('test countBagsInside: ', countBagsInside('shiny gold bag', testRulesObj3, 1) == 126)

console.log('countBagsInside: ', countBagsInside('shiny gold bag', rulesObj, 1))
