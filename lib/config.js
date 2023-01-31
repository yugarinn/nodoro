const fs = require('fs')
const homedir = require('os').homedir()

const configFileName = 'nodoro.config.json'

const loadConfig = () => {
  const defaultConfig = JSON.parse(fs.readFileSync(`${__dirname}/../${configFileName}`, 'utf8'))
  let userConfig

  try {
    userConfig = JSON.parse(fs.readFileSync(`${homedir}/.config/nodoro/${configFileName}`, 'utf8'))
  } catch {
    userConfig = {}
  }

  return Object.assign(userConfig, defaultConfig)
}

module.exports = loadConfig
