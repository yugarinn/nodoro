#! /usr/bin/env node

const { EOL } = require('os')

const config = require('../lib/config')()
const Timer = require('../lib/Timer')
const Noiser = require('../lib/Noiser')

const timer = new Timer()
const noiser = new Noiser()
const stdin = process.openStdin()

stdin.setRawMode(true)
stdin.resume();
stdin.setEncoding( 'utf8' );

timer.reset()
timer.start()

if (config.autoplay) noiser.toggle()

const loop = () => {
  process.stdout.write('\x1Bc')
  process.stdout.write(timer.print())
  process.stdout.write(`${EOL}${EOL}s: pause/resume | r: restart | m: mute/unmute | Ctrl-c: exit`)
}

stdin.on('data', (input) => {
  if (input === '\u0003') {
    process.exit();
  }

  if (input === '\u0073' && timer.getState() == 'RUNNING') {
    timer.stop()
  } else if (input === '\u0073' && ['STOPPED', 'CLEAN'].includes(timer.getState())) {
    timer.start()
  }

  if (input === '\u0072') {
    timer.reset()
  }

  if (input === '\u006D') {
    noiser.toggle()
  }
})

setInterval(loop, 100)
