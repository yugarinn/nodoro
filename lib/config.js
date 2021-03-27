const fs = require('fs')
const homedir = require('os').homedir();

const loadConfig = () => {
  const defaultConfig = JSON.parse(fs.readFileSync('./config.json', 'utf8'))
  let userConfig

  try {
    userConfig = JSON.parse(fs.readFileSync(`${homedir}/.config/nodoro/config.json`, 'utf8'))
  } catch {
    userConfig = {}
  }

  return Object.assign(defaultConfig, userConfig)
}

module.exports = loadConfig
