const fs = require('fs')
const Logger = require('./Logger')
const loadConfig = require('./config')
const Noiser = require('./Noiser')

class Timer {
  constructor() {
    this.logger = new Logger()
    this.config = loadConfig()
    this.state = 'STOPPED'
    this.mode = 'REST'
    this.cycle = 0
  }

  setState() {
    const lastRecord = this.parseEntry(this.logger.getLastEntry())

    if (lastRecord.datetime === null || ['start', 'restart'].includes(lastRecord.state)) {
      this.state = 'RUNNING'
    } else {
      this.state = 'STOPPED'
    }
  }

  setMode() {
    const lastRecord = this.parseEntry(this.logger.getLastEntry())

    if (lastRecord.datetime === null || lastRecord.mode === 'focus') {
      this.mode = 'FOCUS'
    } else {
      this.mode = 'REST'
    }
  }

  setStartTime(datetime) {
    this.logger.write(`${this.mode.toLowerCase()}-start-${datetime}`)
  }

  setStopTime(datetime) {
    this.logger.write(`${this.mode.toLowerCase()}-stop-${datetime}`)
  }

  setRestartTime(datetime) {
    this.logger.write(`${this.mode.toLowerCase()}-restart-${datetime}`)
  }

  getState() {
    return this.state
  }

  getMode() {
    return this.mode
  }

  getStartTimeOf(mode) {
    return this.logger.read('start')
  }

  getCurrentModeLength() {
    let length

    if (this.mode === 'FOCUS') {
      length = this.config.pomodoroLength
    } else {
      length = this.config.shortBreakLength
    }

    return parseInt(length) * 60
  }

  computeRemainingTime() {
    const lengthInSeconds = this.getCurrentModeLength()
    const lastTimestamp = (this.state === 'RUNNING') ? Date.now() : this.getLastTimestampOfType('stop')
    const elapsedSeconds = (lastTimestamp - this.getLastTimestampOfType('start') - this.getStoppedTime()) / 1000

    return Math.max(0, parseInt(lengthInSeconds - elapsedSeconds))
  }

  getStoppedTime() {
    const entries = this.logger.getTimestampLines()
    let lastStop = null
    let stoppedTime = 0

    for (const entry of entries) {
      const fields = this.parseEntry(entry)

      if (fields.type == 'stop') {
        lastStop = fields.datetime
      }

      if (fields.type == 'restart') {
        stoppedTime += fields.datetime - lastStop
      }
    }

    return stoppedTime
  }

  start() {
    if (this.state == 'CLEAN') {
      this.setStartTime(Date.now())
    } else if (this.state == 'STOPPED') {
      this.setRestartTime(Date.now())
    }

    this.setState()
  }

  stop() {
    if (this.state == 'RUNNING') {
      this.setStopTime(Date.now())
    }

    this.setState()
  }

  reset() {
    this.logger.clean()
  }

  // TODO: do not return string, move it to print method
  tick() {
    const remaining = this.computeRemainingTime()

    if (remaining === 0) {
      this.switchMode()

      if (this.mode === 'FOCUS') {
        this.updateCycle()
      }

      this.setStartTime(Date.now())
    }

    return `${this.formatStateToHuman()} - ${this.formatRemainingToHuman(remaining)} minutes left`
  }

  formatStateToHuman() {
    if (this.state === 'RUNNING' && this.mode === 'FOCUS') {
      return 'Focus'
    } else if (this.state == 'RUNNING' && this.mode === 'REST') {
      return 'Rest'
    } else if (this.state == 'STOPPED') {
      return 'Paused'
    }

    return 'Unkown'
  }

  getLastTimestamp() {
    return this.logger.getLastEntry().split('-')[1]
  }

  getLastTimestampOfType(type) {
    return this.parseEntry(this.logger.getLastEntryOfType(type)).datetime
  }

  parseEntry(entry) {
    if (!entry) {
      return {
        mode: null,
        type: null,
        datetime: null,
      }
    }

    const fields = entry.split('-')

    return {
      mode: fields[0],
      state: fields[1],
      datetime: fields[2],
    }
  }

  switchMode() {
    this.mode = this.mode === 'FOCUS' ? 'REST' : 'FOCUS'
    Noiser.playBell()
  }

  updateCycle() {
    if (this.cycle < this.config.cyclesLength) {
      this.cycle += 1
    } else {
      this.cycle = 1
    }
  }

  formatRemainingToHuman(totalSeconds) {
    const minutes = parseInt(totalSeconds / 60)
    const seconds = parseInt(totalSeconds % 60)
    const leadingZero = seconds < 10 ? '0' : ''

    return `${minutes}:${leadingZero}${seconds}`
  }
}

module.exports = Timer
