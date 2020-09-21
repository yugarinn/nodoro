const readline = require('readline')
const { EOL } = require('os')
const Timer = require('./lib/Timer')
const timer = new Timer()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
})

timer.reset()
timer.start()

const loop = () => {
  process.stdout.write('\x1Bc')
  console.log(timer.status())
}

setInterval(loop, 1000)

rl.on('line', (input) => {
  if (input == 's' && timer.getStatus() == 'RUNNING') {
    timer.stop()
  } else if (input == 's' && timer.getStatus() == 'STOPPED') {
    timer.start()
  }

  if (input == 'r') {
    timer.reset()
  }
})
