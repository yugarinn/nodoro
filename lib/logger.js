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
}

module.exports = Logger
