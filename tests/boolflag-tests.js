'use strict'

const test = require('ava')

const { boolFlag } = require('../index')

const createFlag = (t, shortFlag = '-t', longFlag = null) => {
  t.context.flag = boolFlag(shortFlag, longFlag)
}

const runMatch = (t, argsToMatch) => {
  t.context.afterMatch = t.context.flag(argsToMatch)
}

test('short flag name matches if only one in argv', t => {
  createFlag(t)
  runMatch(t, ['-t'])
  t.true(t.context.flag.value)
})

test('short flag match consumes matched flag from argv', t => {
  createFlag(t)
  runMatch(t, ['-t'])
  t.is(t.context.afterMatch.length, 0)
})

test('short flag match does not mark error', t => {
  createFlag(t)
  runMatch(t, ['-t'])
  t.is(t.context.flag.error, null)
})

test('short flag was matched when in argv', t => {
  createFlag(t)
  runMatch(t, ['-t'])
  t.true(t.context.flag.matched)
})

test('short flag is not matched if not in argv', t => {
  createFlag(t)
  runMatch(t, ['-v'])
  t.false(t.context.flag.matched)
})

test('short flag does not remove unmatched flags from argv', t => {
  createFlag(t)
  runMatch(t, ['-a', '-b'])
  t.deepEqual(t.context.afterMatch, ['-a', '-b'])
})

test('short flag matches if in the middle of argv', t => {
  createFlag(t)
  runMatch(t, ['-a', '-t', '-b'])
  t.true(t.context.flag.value)
  t.deepEqual(t.context.afterMatch, ['-a', '-b'])
})

test('by default multiple short flags is an error', t => {
  createFlag(t)
  runMatch(t, ['-a', '-t', '-t'])
  t.false(t.context.flag.matched)
  t.is(t.context.flag.error, 'Exclusive flag \'-t\' appears multiple times in the arguments')
})

test('flag with long flag matches if in argv', t => {
  createFlag(t, null, '--test')
  runMatch(t, ['-a', '--test'])
  t.true(t.context.flag.matched)
})

test('flag with short and long flag match with either in argv', t => {
  createFlag(t, '-t', '--test')
  runMatch(t, ['-t'])
  t.true(t.context.flag.matched)

  runMatch(t, ['--test'])
  t.true(t.context.flag.matched)
})
