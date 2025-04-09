const loadConfig = require('./config')
const fs = require('fs')
const homedir = require('os').homedir()
const { EOL } = require('os')

class Logger {
  constructor() {
    this.config = loadConfig()
    this.storagePath = this.config.storagePath.replace('~', homedir)
    this.buildStorageDirectory()
  }

  buildStorageDirectory() {
    if (! fs.existsSync(this.storagePath)){
      fs.mkdirSync(this.storagePath.replace('~', homedir));
    }
  }

  write(message) {
    fs.appendFileSync(`${this.storagePath}/pomodoros`, `${message}${EOL}`)
  }

  clean() {
    fs.writeFileSync(`${this.storagePath}/pomodoros`, '')
  }

  getLastEntry() {
    const lines = fs.readFileSync(`${this.storagePath}/pomodoros`).toString().split(EOL)

    return lines[lines.length - 2]
  }

  getLastEntryOfType(type) {
    const lines = fs.readFileSync(`${this.storagePath}/pomodoros`).toString().split(EOL)
    const entries = lines.filter((line) => line.split('-')[1] == type)

    return entries[entries.length - 1]
  }

  getTimestampLines() {
    const timestampIdentifiers = ['restart', 'start', 'stop']

    return fs.readFileSync(`${this.storagePath}/pomodoros`).toString().split(EOL).filter((line) => timestampIdentifiers.includes(line.split('-')[1]))
  }
}

module.exports = Logger
