const fs = require('fs')

class Config {
  get() {
    return JSON.parse(fs.readFileSync('./config.json', 'utf8'))
  }
}

module.exports = Config
