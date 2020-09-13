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

    console.log('starting timer...')
    this.setStartTime(Date.now())
  }

  stop() {
    if (this.getStatus() == 'STOPPED') {
      console.info('already stopped')
      return
    }

    console.log('stopping timer...')
    this.setEndTime(Date.now())
  }

  reset() {
    console.log('resetting timer...')
    this.logger.clean()
  }

  status() {
    return `${this.getStatus()} - ${this.getRemainingTime()} minutes left`
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
    return parseInt(Math.max(1, 45 - (Date.now() / 60000 - this.getLastTimestamp() / 60000)))
  }

  getStatus() {
    const lastRecord = this.logger.getLastEntry()

    if (lastRecord && lastRecord.split('-')[0] == 'start') {
      return 'RUNNING'
    } else {
      return 'STOPPED'
    }
  }

  getLastTimestamp() {
   return this.logger.getLastEntry().split('-')[1]
  }
}

module.exports = Timer
