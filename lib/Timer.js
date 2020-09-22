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
    const lastTimestamp = (status === 'RUNNING') ? Date.now() : this.getLastTimestampOfType('stop')
    const elapsedSeconds = (lastTimestamp - this.getLastTimestampOfType('start') - this.getStoppedTime()) / 1000

    return parseInt(lengthInSeconds - elapsedSeconds)
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
      return 'Pause'
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
