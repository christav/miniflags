'use strict'

const test = require('ava')

const { restFlag } = require('../index')

test('rest flag matches empty argv', t => {
  const f = restFlag()
  f([])
  t.true(f.matched)
  t.deepEqual(f.value, [])
})

test('rest flag matches entire argv', t => {
  const f = restFlag()
  const argv = ['a', 'bc', '-t', 'd']
  const leftOvers = f(argv)
  t.is(leftOvers.length, 0)
  t.true(f.matched)
  t.deepEqual(f.value, argv)
})
