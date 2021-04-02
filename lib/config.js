const fs = require('fs')
const homedir = require('os').homedir()

const loadConfig = () => {
  const defaultConfig = JSON.parse(fs.readFileSync(`${__dirname}/../config.json`, 'utf8'))
  let userConfig

  try {
    userConfig = JSON.parse(fs.readFileSync(`${homedir}/.config/nodoro/config.json`, 'utf8'))
  } catch {
    userConfig = {}
  }

  return Object.assign(userConfig, defaultConfig)
}

module.exports = loadConfig
