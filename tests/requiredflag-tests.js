'use strict'

const test = require('ava')

const { boolFlag, stringFlag, restFlag, requiredFlag, parseArgs } = require('../index')

test('required bool flag has expected error if not present', t => {
  const bflag = boolFlag('-t', '--test')
  const reqFlag = requiredFlag(bflag)

  parseArgs([reqFlag], ['-a', '-b'])

  t.is(reqFlag.error, "Required flag '-t|--test' not given")
})
