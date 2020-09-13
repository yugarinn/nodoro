#! /usr/bin/env node

const Timer = require('../lib/timer')
const paramsParser = require('../lib/paramsParser')

const params = paramsParser.parse(process.argv.slice(2))
const timer = new Timer()

if (params.command === 'start') {
  timer.start()
} else if (params.command === 'stop') {
  timer.stop()
} else if (params.command === 'reset') {
  timer.reset()
} else if (params.command === 'config') {
  console.info('configuring...')
} else if (params.command === 'status') {
  console.info(timer.status())
} else {
  console.erro
}
