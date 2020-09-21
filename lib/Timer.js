const fs = require('fs')
const Logger = require('./logger')
const Config = require('./config')

class Timer {
  constructor() {
    this.logger = new Logger()
    this.config = (new Config()).get()
  }

  start() {
    const status = this.getStatus()

    if (this.getStatus() == 'CLEAN') {
      this.setStartTime(Date.now())
    } else if (status == 'STOPPED') {
      this.setRestartTime(Date.now())
    }
  }

  stop() {
    const status = this.getStatus()

    if (this.getStatus() == 'RUNNING') {
      this.setStopTime(Date.now())
    }
  }

  reset() {
    this.logger.clean()
  }

  status() {
    return `${this.getPrettyStatus(this.getStatus())} - ${this.formatRemainingToHuman(this.getRemainingTime())} minutes left`
  }

  setStartTime(datetime) {
    this.logger.write(`start-${datetime}`)
  }

  setStopTime(datetime) {
    this.logger.write(`stop-${datetime}`)
  }

  setRestartTime(datetime) {
    this.logger.write(`restart-${datetime}`)
  }

  getStartTime() {
    return this.logger.read('start')
  }

  getRemainingTime() {
    const status = this.getStatus()
    const lengthInSeconds = parseInt(this.config.pomodoroLenght) * 60
    let elapsedSeconds

    // TODO: take into consideration total stopped seconds for RUNNING elapsedSeconds calc
    if (status === 'RUNNING') {
      elapsedSeconds = (Date.now() - this.getLastTimestampOfType('start')) / 1000
    } else {
      elapsedSeconds = (this.getLastTimestampOfType('stop') - this.getLastTimestampOfType('start')) / 1000
    }

    return parseInt(lengthInSeconds - elapsedSeconds)
  }

  getStatus() {
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

  getPrettyStatus(status) {
    if (status == 'RUNNING') {
      return 'Focus'
    } else if (status == 'CLEAN') {
      return 'Clean'
    } else if (status == 'STOPPED') {
      return 'Stopped'
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

  formatRemainingToHuman(seconds) {
    // TODO: proper seconds formatting
    return `${parseInt(seconds / 60)}:${parseInt(seconds % 60)}`
  }
}

module.exports = Timer
