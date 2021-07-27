'use strict'

const annotatedFlag = (flagFn, shortFlag, longFlag, usage) => {
  flagFn.shortFlag = shortFlag
  flagFn.longFlag = longFlag
  flagFn.usage = usage
  return flagFn
}

const defaultFlagState = (flagFn, unmatchedValue) => {
  flagFn.value = unmatchedValue
  flagFn.matched = false
  flagFn.error = null
}

const argErrorName = (flag) =>
  [].concat(!!flag.shortFlag ? [flag.shortFlag] : [], !!flag.longFlag ? [flag.longFlag]: []).join('|')

const setFlagError = (flag, messageFn) => {
  flag.value = null
  flag.matched = false
  flag.error = messageFn(argErrorName(flag))
}

const boolFlag = (shortFlag, longFlag = null, usage = '') => {
    const boolFlagFn = annotatedFlag((argv) => {
    defaultFlagState(boolFlagFn, false)
    return argv.reduce((acc, item) => {
      if (item === shortFlag || item === longFlag) {
        if (!boolFlagFn.matched && !boolFlagFn.error) {
          boolFlagFn.value = true
          boolFlagFn.matched = true
          return acc
        } else {
          // Match has already happened, single error and stop
          setFlagError(boolFlagFn, as => `Exclusive flag '${as}' appears multiple times in the arguments`)
          return argv
        }
      } else {
        return [...acc, item]
      }
    }, [])
  }, shortFlag, longFlag, usage)
  
  return boolFlagFn
}

const stringFlag = (shortFlag, longFlag = null, usage = '') => {
  const fn = (argv) => {
    defaultFlagState(fn, null)
    const nargs = argv.length
    let result = []
    for(let i = 0; i < nargs; ++i) {
      if (argv[i] === shortFlag || argv[i] === longFlag) {
        if (i < nargs - 1 && !fn.matched && !fn.error) {
          fn.value = argv[i + 1]
          fn.matched = true
          i++
        } else if (i >= nargs - 1) {
          setFlagError(fn, as => `Argument '${as}' was given without an argument`)
        } else {
          // Match has already happened, signal error and stop
          setFlagError(fn, as => `Exclusive flag '${as}' appears multiple times in the arguments`)
        }
      } else {
        result = result.concat(argv[i])
      }
    }
    return result
  }

  return annotatedFlag(fn, shortFlag, longFlag, usage)
}

const restFlag = (name = '<args>', usage = '') => {
  const fn = argv => {
    defaultFlagState(fn, null)
    fn.matched = true
    fn.value = [...argv]
    return []
  }
  
  return annotatedFlag(fn, name, null, usage)
}

const requiredFlag = flag => {
  const fn = argv => {
    const newArgs = flag(argv)
    if (!flag.error && !flag.matched) {
      setFlagError(fn, as => `Required flag '${as}' not given`)
    }
    else {
      fn.value = flag.value
      fn.matched = flag.matched
      fn.error = flag.error
    }
    return newArgs
  }
  return annotatedFlag(fn, flag.shortFlag, flag.longFlag, flag.usage)
}

const parseArgs = (flags, args) => {
  let currentArgs = args
  for(let flag of flags) {
    currentArgs = flag(currentArgs)
  }
}

module.exports = {
  boolFlag,
  stringFlag,
  restFlag,
  requiredFlag,
  parseArgs
}
