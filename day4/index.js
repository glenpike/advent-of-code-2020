var fs = require('fs');

require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

var input = require("./input.txt");

const required = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid']

const simpleValidator = (keys, expected) =>
  expected.every((key) => {
    if(keys.indexOf(key) === -1) {
      return false
    }
    return true
  })

const passports = input.split('\n\n')

const numValid = passports.reduce((acc, passport) => {
  const fields = passport.replace(/\n/g, ' ').trim().split(' ')
  const keys = fields.reduce((str, data) => str += data.substr(0, 3), '')
  // console.log('keys ', keys, fields)
  const valid = simpleValidator(keys, required)
  if(valid) {
    acc += 1
  }
  return acc
}, 0)

console.log('valid ', numValid)

const makeYearValidator = (min, max) =>
  (input) => {
    const year = Number(input)
    return !isNaN(year) && year >= min && year <= max
  }

const heightValidator = (input) => {
  try {
    const [, height, unit] = input.match(/([0-9]{2,})(cm|in)/)
    if(unit === 'cm') {
      return +height >= 150 && +height <= 193
    } else {
      return +height >= 59 && +height <= 76
    }  
  } catch {
    return false
  }
}

const hclValidator = (input) => !!input.match(/#[0-9a-f]{6}/)
const eclValidator = (input) => ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].indexOf(input) !== -1
const pidValidator = (input) => !!input.match(/^[0-9]{9}$/)

const validators = {
  byr: makeYearValidator(1920, 2002),
  iyr: makeYearValidator(2010, 2020),
  eyr: makeYearValidator(2020, 2030),
  hgt: heightValidator,
  hcl: hclValidator,
  ecl: eclValidator,
  pid: pidValidator,
  cid: () => true,
}

expectedNumFields = Object.keys(validators).length

const checkPassport = (acc, passport) => {
  const fields = passport.replace(/\n/g, ' ').trim().split(' ')
  let keyStr = ''
  let valid = fields.every((field) => {
    const [key, value] = field.split(':')
    keyStr += key
    const validField = validators[key](value)
    return validField
  })
  if(!simpleValidator(keyStr, required)) {
    valid = false
  }

  if(valid) {
    // console.log('valid passport ', fields.filter((field) => !~field.indexOf('cid')).sort().join(', '))  
    acc += 1
  }
  return acc
}

const numValid2 = passports.reduce(checkPassport, 0)

console.log('numValid 2', numValid2)


// Testing
// const invalidPassports = `eyr:1972 cid:100
// hcl:#18171d ecl:amb hgt:170 pid:186cm iyr:2018 byr:1926

// iyr:2019
// hcl:#602927 eyr:1967 hgt:170cm
// ecl:grn pid:012533040 byr:1946

// hcl:dab227 iyr:2012
// ecl:brn hgt:182cm pid:021572410 eyr:2020 byr:1992 cid:277

// hgt:59cm ecl:zzz
// eyr:2038 hcl:74454a iyr:2023
// pid:3556412378 byr:2007`.split('\n\n')

// const validPassports = `pid:087499704 hgt:74in ecl:grn iyr:2012 eyr:2030 byr:1980
// hcl:#623a2f

// eyr:2029 ecl:blu cid:129 byr:1989
// iyr:2014 pid:896056539 hcl:#a97842 hgt:165cm

// hcl:#888785
// hgt:164cm byr:2001 iyr:2015 cid:88
// pid:545766238 ecl:hzl
// eyr:2022

// iyr:2010 hgt:158cm hcl:#b6652a ecl:blu byr:1944 eyr:2021 pid:093154719`.split('\n\n')

// console.log('test invalid passports: ', invalidPassports.reduce(checkPassport, 0) == 0)
// console.log('test valid passports: ', validPassports.reduce(checkPassport, 0) == validPassports.length)
// console.log('byr valid:   2002 ', makeYearValidator(1920, 2002)(2002) == true)
// console.log('byr invalid:   2003 ', makeYearValidator(1920, 2002)(2003) == false)
// console.log('byr invalid:   1919 ', makeYearValidator(1920, 2002)(1919) == false)
// console.log('hgt valid:   60in ', heightValidator('60in') == true)
// console.log('hgt valid:   190cm ', heightValidator('190cm') == true)
// console.log('hgt invalid:   190in ', heightValidator('190in') == false)
// console.log('hgt invalid:   149cm ', heightValidator('149cm') == false)
// console.log('hgt invalid:   194cm ', heightValidator('194cm') == false)
// console.log('hgt invalid:   58in ', heightValidator('58in') == false)
// console.log('hgt invalid:   78in ', heightValidator('78in') == false)
// console.log('hgt invalid:   190 ', heightValidator('190') == false)

// console.log('hcl valid:   #123abc ', hclValidator('#123abc') == true)
// console.log('hcl invalid:   #123abz ', hclValidator('#123abz') == false)
// console.log('hcl invalid:   123abc ', hclValidator('123abc') == false)

// console.log('ecl valid:   brn ', eclValidator('brn') == true)
// console.log('ecl invalid:   wat ', eclValidator('wat') == false)

// console.log('pid valid:   000000001 ', pidValidator('000000001') == true)
// console.log('pid invalid: 0123456789 ', pidValidator('0123456789') == false)
