const { exec } = require('child_process')
const fs = require('fs')
const loadConfig = require('./config')
const Noiser = require('./Noiser')

const POMODORO_MODE = 'POMODORO'
const SHORT_BREAK_MODE = 'SHORT_BREAK'
const LONG_BREAK_MODE = 'LONG_BREAK'

class Ticker {
  constructor() {
    this.config = loadConfig()
    this.running = true
    this.mode = POMODORO_MODE
    this.cycle = 1
    this.set = 0
    this.times = {
      pomodoro: this.config.pomodoroLength,
      shortBreak: this.config.shortBreakLength,
      longBreak: this.config.longBreakLength,
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

      if (this.cycle == this.config.pomodorosPerLongBreak) {
        this.mode = LONG_BREAK_MODE
        this.remaining = this.times.longBreak
      } else {
        this.mode = SHORT_BREAK_MODE
        this.remaining = this.times.shortBreak
      }

      return
    }

    if ([SHORT_BREAK_MODE, LONG_BREAK_MODE].includes(this.mode)) {
      exec(`notify-send "NODORO\nThat's enough! Back to work you sludge!"`)

      this.mode = POMODORO_MODE
      this.remaining = this.times.pomodoro
    }

    Noiser.playBell()
  }

  updateCycle() {
    if (this.cycle < this.config.pomodorosPerLongBreak) {
      this.cycle += 1
    } else {
      this.set += 1
      this.cycle = 1
    }
  }
}

module.exports = Ticker
