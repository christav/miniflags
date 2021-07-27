'use strict'

const test = require('ava')

const { boolFlag, stringFlag, restFlag, requiredFlag, parseArgs } = require('../index')

test('required bool flag has expected error if not present', t => {
  const bflag = boolFlag('-t', '--test')
  const reqFlag = requiredFlag(bflag)

  parseArgs([reqFlag], ['-a', '-b'])

  t.is(reqFlag.error, "Required flag '-t|--test' not given")
})

test('required bool flag does not error if present', t => {
  const bflag = boolFlag('-t', null)
  const reqFlag = requiredFlag(bflag)

  parseArgs([reqFlag], ['-t'])

  t.falsy(reqFlag.error)
  t.true(reqFlag.matched)
})
