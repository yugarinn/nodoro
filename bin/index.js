#! /usr/bin/env node

const { EOL } = require('os')

const config = require('../lib/config')()
const Logger = require('../lib/Logger')
const Timer = require('../lib/Timer')
const Noiser = require('../lib/Noiser')

const logger = new Logger()
const timer = new Timer(logger)
const noiser = new Noiser()
const stdin = process.openStdin()

let timerAndNoiserAreBinded = false

stdin.setRawMode(true)
stdin.resume();
stdin.setEncoding( 'utf8' );

timer.reset()
timer.start()

if (config.autoplay) {
  noiser.toggle()
  timerAndNoiserAreBinded = true
}

const loop = () => {
  const muteString = noiser.isRunning() ? 'mute' : 'unmute'

  process.stdout.write('\x1Bc')
  process.stdout.write(timer.tick())
  process.stdout.write(`${EOL}${EOL}s: pause/resume | r: restart | m: ${muteString} | Ctrl-c: exit`)
}

stdin.on('data', (input) => {
  if (input === '\u0003') {
    logger.clean()
    process.exit();
  }

  if (input === '\u0073' && timer.getState() === 'RUNNING') {
    timer.stop()
    if (timerAndNoiserAreBinded) noiser.stop()
  } else if (input === '\u0073' && timer.getState() === 'STOPPED') {
    timer.start()
    if (timerAndNoiserAreBinded) noiser.play()
  }

  if (input === '\u0072') {
    timer.reset()
  }

  if (input === '\u006D') {
    noiser.toggle()
  }
})

setInterval(loop, 100)
