const fs = require('fs')
const Logger = require('./logger')
const loadConfig = require('./config')
const Noiser = require('./Noiser')

/*
 * Where you left of:
 *
 * - You were implementing the focus/rest cycle. You called them 'modes' (focus mode and rest mode).
 * - You were refactoring the time setters to accept the mode and write entries in the logger accordingly.
 * - You were thinking about anoher, cleaner mode. Maybe state and status?
 * - You were thinking about how this might affect a future aggregated statistics.
 */

class Timer {
  constructor() {
    this.logger = new Logger()
    this.config = loadConfig()
    this.state = null
    this.mode = null
    this.cycle = 1
  }

  setState() {
    const lastRecord = this.parseEntry(this.logger.getLastEntry())

    if (lastRecord.datetime === null || ['start', 'restart'].includes(lastRecord.type)) {
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

  getRemainingTime() {
    const lengthInSeconds = parseInt(this.config.pomodoroLenght) * 60
    const lastTimestamp = (this.state === 'RUNNING') ? Date.now() : this.getLastTimestampOfType('stop')
    const elapsedSeconds = (lastTimestamp - this.getLastTimestampOfType('start') - this.getStoppedTime()) / 1000

    console.log(this.cycle, this.mode, this.state, lastTimestamp, elapsedSeconds)

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
    this.setState()
    this.setMode()

    if (this.state == 'CLEAN') {
      this.setStartTime(Date.now())
    } else if (this.state == 'STOPPED') {
      this.setRestartTime(Date.now())
    }

    this.setState()
    this.setMode()
  }

  stop() {
    if (this.state == 'RUNNING') {
      this.setStopTime(Date.now())
    }

    this.setState()
    this.setMode()
  }

  reset() {
    this.logger.clean()
  }

  // TODO: do not return string, move it to print method
  tick() {
    const remaining = this.getRemainingTime()

    if (remaining == 0) {
      this.switchMode()
      this.updateCycle()
      this.setStartTime(Date.now())
    }

    return `${this.formatStateToHuman()} - ${this.formatRemainingToHuman(remaining)} minutes left`
  }

  formatStateToHuman() {
    if (this.state === 'RUNNING' && this.mode === 'focus') {
      return 'Focus'
    } else if (this.state == 'RUNNING' && this.mode === 'rest') {
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
    this.mode = this.mode === 'focus' ? 'rest' : 'focus'
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
