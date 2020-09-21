const fs = require('fs')
const Logger = require('./logger')
const Config = require('./config')

class Timer {
  constructor() {
    this.logger = new Logger()
    this.config = (new Config()).get()
  }

  start() {
    if (this.getStatus() == 'RUNNING') {
      return
    }

    this.setStartTime(Date.now())
  }

  stop() {
    if (this.getStatus() == 'STOPPED') {
      console.info('already nodoro')
      return
    }

    this.setEndTime(Date.now())
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

  getStartTime() {
    return this.logger.read('start')
  }

  setEndTime(datetime) {
    this.logger.write(`stop-${datetime}`)
  }

  getEndTime() {
    return this.endTime
  }

  getRemainingTime() {
    const status = this.getStatus()
    const lengthInSeconds = parseInt(this.config.pomodoroLenght) * 60
    let elapsedSeconds

    const runningTime = this.getRunningTime()

    if (status === 'RUNNING') {
      elapsedSeconds = (Date.now() - this.getLastTimestampOfType('start')) / 1000
    } else {
      elapsedSeconds = (this.getLastTimestampOfType('stop') - this.getLastTimestampOfType('start')) / 1000
    }

    return parseInt(lengthInSeconds - elapsedSeconds)
  }

  getStatus() {
    const lastRecord = this.logger.getLastEntry()

    if (lastRecord && lastRecord.split('-')[0] == 'start') {
      return 'RUNNING'
    } else {
      return 'STOPPED'
    }
  }

  getPrettyStatus(status) {
    if (status == 'RUNNING') {
      return 'Running'
    } else {
      return 'Stopped'
    }
  }

  getLastTimestamp() {
   return this.logger.getLastEntry().split('-')[1]
  }

  getLastTimestampOfType(type) {
   return this.logger.getLastEntryOfType(type).split('-')[1]
  }

  getRunningTime() {
    const timestamps = this.logger.getTimestampLines()
    let lastStopTimestamp = null
    let stoppedTime = 0

    for (const index in timestamps) {
      const timestamp = this.parseEntry(timestamps[index])

      if (timestamp.type == 'start' && lastStopTimestamp) {
        stoppedTime += timestamp.datetime - lastStopTimestamp
      } else if (timestamp.type == 'stop') {
        lastStopTimestamp = timestamp.datetime
      }
    }
  }

  parseEntry(entry) {
    const fields = entry.split('-')

    return {
      type: fields[0],
      datetime: fields[1],
    }
  }

  formatRemainingToHuman(seconds) {
    return `${parseInt(seconds / 60)}:${parseInt(seconds % 60)}`
  }
}

module.exports = Timer
