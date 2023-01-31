#! /usr/bin/env node

const { EOL } = require('os')

const config = require('../lib/config')()
const { stateToHuman, remainingToHuman, noiserStateToHuman } = require('../lib/printers')
const Ticker = require('../lib/Ticker')
const Noiser = require('../lib/Noiser')

const sButton = '\u0073'
const rButton = '\u0072'
const mButton = '\u006D'
const ctrlCButton = '\u0003'

const ticker = new Ticker()
const noiser = new Noiser()
const stdin = process.openStdin()

stdin.setRawMode(true)
stdin.resume()
stdin.setEncoding('utf8')

if (config.autoplay) noiser.play()

const printTickerState = (ticker) => `${stateToHuman(ticker)} - ${remainingToHuman(ticker)} minutes left`

const loop = () => {
  ticker.tick()

  process.stdout.write('\x1Bc')
  process.stdout.write(printTickerState(ticker))
  process.stdout.write(`${EOL}${EOL}s: pause/resume | r: restart | m: ${noiserStateToHuman(noiser)} | Ctrl-c: exit`)
}

stdin.on('data', (input) => {
  if (input === sButton) ticker.toggle()
  if (input === mButton) noiser.toggle()
  if (input === rButton) ticker.reset()
  if (input === ctrlCButton) process.exit()
})

setInterval(loop, 1000)
