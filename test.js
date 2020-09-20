const Timer = require('./lib/Timer')
const timer = new Timer()
const { EOL } = require('os')

let data = null

timer.reset()
timer.start()

const loop = () => {
  process.stdout.write('\x1Bc')
  console.log(timer.status())
  console.log('data: ', data)
}

setInterval(loop, 1000)

process.stdin.setEncoding('utf8');
process.stdin.on('readable', () => {
  const chunk = process.stdin.read()

  chunk
    .split(EOL)
    .forEach((input) => {
      if (input === null || !input.length) {
        return
      }

      data = input

      if (input == 's' && timer.getStatus() == 'RUNNING') {
        timer.stop()
      } else if (input == 's' && timer.getStatus() == 'STOPPED') {
        timer.start()
      }

      if (input == 'r') {
        timer.reset()
      }
    })
})
