const Config = require('./config')
const fs = require('fs')
const { EOL } = require('os')

class Logger {
  constructor() {
    this.config = (new Config()).get()
    this.buildStorageDirectory()
  }

  buildStorageDirectory(){
    if (! fs.existsSync(this.config.storagePath)){
      fs.mkdirSync(this.config.storagePath);
    }
  }

  write(message) {
    fs.appendFileSync(`${this.config.storagePath}/pomodoros`, `${message}${EOL}`)
  }

  clean() {
    fs.writeFileSync(`${this.config.storagePath}/pomodoros`, '')
  }

  getLastEntry() {
    const lines = fs.readFileSync(`${this.config.storagePath}/pomodoros`).toString().split(EOL)

    return lines[lines.length - 2]
  }

  getLastEntryOfType(type) {
    const lines = fs.readFileSync(`${this.config.storagePath}/pomodoros`).toString().split(EOL)
    const entries = lines.filter((line) => line.split('-')[0] == type)

    return entries[entries.length - 1]
  }

  getTimestampLines() {
    return fs.readFileSync(`${this.config.storagePath}/pomodoros`).toString().split(EOL).filter((line) => ['start', 'stop'].includes(line.split('-')[0]))
  }
}

module.exports = Logger
