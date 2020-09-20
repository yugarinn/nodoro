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
      console.info('already started')
      return
    }

    console.info('starting nodoro...')
    this.setStartTime(Date.now())
  }

  stop() {
    if (this.getStatus() == 'STOPPED') {
      console.info('already nodoro')
      return
    }

    console.info('stopping timer...')
    this.setEndTime(Date.now())
  }

  reset() {
    console.info('resetting nodoro...')
    this.logger.clean()
  }

  status() {
    return `${this.getPrettyStatus(this.getStatus())} - ${this.getRemainingTime()} minutes left`
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
    const length = this.config.pomodoroLenght + 1

    const runningTime = this.getRunningTime()

    if (status === 'RUNNING') {
      return parseInt(Math.max(1, length - (Date.now() / 60000 - this.getLastTimestampOfType('start') / 60000)))
    } else {
      return parseInt(Math.max(1, length - (this.getLastTimestampOfType('stop') / 60000 - this.getLastTimestampOfType('start') / 60000)))
    }
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

      console.log(stoppedTime)
    }
  }

  parseEntry(entry) {
    const fields = entry.split('-')

    return {
      type: fields[0],
      datetime: fields[1],
    }
  }
}

module.exports = Timer
