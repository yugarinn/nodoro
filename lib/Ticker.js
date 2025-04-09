const { exec } = require('child_process')
const fs = require('fs')
const loadConfig = require('./config')
const Noiser = require('./Noiser')

const POMODORO_MODE = 'POMODORO'
const BREAK_MODE = 'BREAK'

class Ticker {
  constructor(logger) {
    this.config = loadConfig()
    this.running = true
    this.mode = POMODORO_MODE
    this.cycle = 0
    this.times = {
      pomodoro: this.config.pomodoroLength,
      break: this.config.shortBreakLength,
    }
    this.remaining = this.times.pomodoro
  }

  tick() {
    if (this.running) this.remaining--

    if (this.remaining === 0) {
      this.switchMode()
      if (this.mode === POMODORO_MODE) this.updateCycle()
    }
  }

  toggle() {
    this.running = !this.running
  }

  reset() {
    if (this.mode == POMODORO_MODE) this.remaining = this.times.pomodoro
    if (this.mode == BREAK_MODE) this.remaining = this.times.break
  }

  switchMode() {
    if (this.mode == POMODORO_MODE) {
      exec(`notify-send "NODORO\nGood effort! Take a breather now you handsome beast :)"`)

      this.mode = BREAK_MODE
      this.remaining = this.times.break
    } else {
      exec(`notify-send "NODORO\nThat's enough! Back to work you sludge!"`)

      this.mode = POMODORO_MODE
      this.remaining = this.times.pomodoro
    }

    Noiser.playBell()
  }

  updateCycle() {
    if (this.cycle < this.config.cyclesLength) {
      this.cycle += 1
    } else {
      this.cycle = 1
    }
  }
}

module.exports = Ticker
