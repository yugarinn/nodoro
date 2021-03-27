const fs = require('fs')
const Logger = require('./logger')
const loadConfig = require('./config')

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
  }

  start() {
    const state = this.getState()

    if (state == 'CLEAN') {
      this.setStartTime(Date.now())
    } else if (state == 'STOPPED') {
      this.setRestartTime(Date.now())
    }
  }

  stop() {
    const state = this.getState()

    if (state == 'RUNNING') {
      this.setStopTime(Date.now())
    }
  }

  reset() {
    this.logger.clean()
  }

  tick() {
    const state = this.getState()
    const remaining = this.getRemainingTime()

    if (remaining == 0) {
      this.switchState()
    }

    return `${this.formatStateToHuman(state)} - ${this.formatRemainingToHuman(remaining)} minutes left`
  }

  setStartTime(datetime, mode) {
    this.logger.write(`${mode}-start-${datetime}`)
  }

  setStopTime(datetime, mode) {
    this.logger.write(`${mode}-stop-${datetime}`)
  }

  setRestartTime(datetime, mode) {
    this.logger.write(`${mode}-restart-${datetime}`)
  }

  getStartTimeOf(mode) {
    return this.logger.read('start')
  }

  getRemainingTimeOf(mode) {
    const state = this.getState()
    const lengthInSeconds = parseInt(this.config.pomodoroLenght) * 60
    const lastTimestamp = (state === 'RUNNING') ? Date.now() : this.getLastTimestampOfType('stop')
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

  getState() {
    const lastRecord = this.logger.getLastEntry()

    if (!lastRecord) {
      return 'CLEAN'
    }

    if (['start', 'restart'].includes(lastRecord.split('-')[0])) {
      return 'RUNNING'
    } else {
      return 'STOPPED'
    }
  }

  formatStateToHuman(state) {
    if (state == 'RUNNING') {
      return 'Focus'
    } else if (state == 'CLEAN') {
      return 'Idle'
    } else if (state == 'STOPPED') {
      return 'Pause'
    } else if (state == 'REST') {
      return 'Rest'
    }

    return 'Unkown'
  }

  getLastTimestamp() {
   return this.logger.getLastEntry().split('-')[1]
  }

  getLastTimestampOfType(type) {
    const entry = this.logger.getLastEntryOfType(type)

    if (entry) {
      return entry.split('-')[1]
    }

   return null
  }

  parseEntry(entry) {
    const fields = entry.split('-')

    return {
      type: fields[0],
      datetime: fields[1],
    }
  }

  switchState() {
    if
  }

  formatRemainingToHuman(totalSeconds) {
    const minutes = parseInt(totalSeconds / 60)
    const seconds = parseInt(totalSeconds % 60)
    const leadingZero = seconds < 10 ? '0' : ''

    return `${minutes}:${leadingZero}${seconds}`
  }
}

module.exports = Timer
