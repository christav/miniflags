'use strict'

const test = require('ava')

const { boolFlag, stringFlag, restFlag, requiredFlag, parseArgs } = require('../index')

test('multiple flags match multiple args in argv', t => {
  const tflag = boolFlag('-t')
  const sflag = stringFlag('-s', '--string-flag')

  parseArgs([tflag, sflag], ['-s', 's value', '-t'])

  t.true(tflag.value)
  t.true(tflag.matched)
  t.is(sflag.value, 's value')
  t.true(sflag.matched)
})

test('multiple flags can safely not match if not in argv', t => {
  const tflag = boolFlag('-t')
  const sflag = stringFlag(null, '--string-flag')
  parseArgs([tflag, sflag], ['a', '--string-flag', 'value', 'b'])

  t.false(tflag.matched)
  t.true(sflag.matched)
  t.is(sflag.value, 'value')
})

test('required flag that does not match argv fails', t => {
  const tflag = requiredFlag(boolFlag('-t'))

  parseArgs([tflag], ['-s'])
  t.is(tflag.error, 'Required flag \'-t\' not given')
})

test('Combo of required and optional flags match argv as expected', t => {
  const reqFlag = requiredFlag(stringFlag('-r', '--required-string'))
  const optFlag1 = boolFlag('-b')
  const optFlag2 = stringFlag('-s', '--opt-flag')

  parseArgs([reqFlag, optFlag1, optFlag2], ['-s', 'opt string', 'thing', '--required-string', 'rs'])

  t.is(reqFlag.value, 'rs')
  t.is(optFlag2.value, 'opt string')
  t.false(optFlag1.matched)
})

test('restFlag picks up all unmatched args', t => {
  const f1 = boolFlag('-v')
  const f2 = stringFlag('-f', '--file')
  const rest = restFlag()

  const argv = '-v z.js --file outfile.txt a.js b.js c.js'.split(' ')

  parseArgs([f1, f2, rest], argv)

  t.true(f1.matched)
  t.is(f2.value, 'outfile.txt')
  t.deepEqual(rest.value, 'z.js a.js b.js c.js'.split(' '))
})

test('rest flag matches empty array if no left over args', t => {
  const f1 = boolFlag('-v', '--verbose')
  const f2 = stringFlag('-f', '--file')
  const rest = restFlag()

  const argv = '-f outfile.txt --verbose'.split(' ')

  parseArgs([f1, f2, rest], argv)

  t.true(f1.matched)
  t.is(f2.value, 'outfile.txt')
  t.deepEqual(rest.value, [])

})