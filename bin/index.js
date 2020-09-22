#! /usr/bin/env node

const { EOL } = require('os')
const Timer = require('../lib/Timer')
const timer = new Timer()

const stdin = process.openStdin()
stdin.setRawMode(true)
stdin.resume();
stdin.setEncoding( 'utf8' );

timer.reset()
timer.start()

const loop = () => {
  process.stdout.write('\x1Bc')
  process.stdout.write(timer.status())
  process.stdout.write(`${EOL}${EOL}s: pause/resume | r: restart`)
}

stdin.on('data', (input) => {
  if (input === '\u0003') {
    process.exit();
  }

  if (input === '\u0073' && timer.getStatus() == 'RUNNING') {
    timer.stop()
  } else if (input === '\u0073' && ['STOPPED', 'CLEAN'].includes(timer.getStatus())) {
    timer.start()
  }

  if (input === '\u0072') {
    timer.reset()
  }
})

setInterval(loop, 100)
