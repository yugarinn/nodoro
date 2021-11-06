const { exec } = require('child_process')
const loadConfig = require('./config')
const mediaPath = '~/code/nodoro/media'

class Noiser {
  constructor() {
    this.player = null
    this.config = loadConfig()
  }

  toggle() {
    this.isRunning() ? this.stop() : this.play()
  }

  play() {
    if (this.isRunning()) return

    this.player = exec(`mplayer ${mediaPath}/rain.mp3 -loop 0`, { maxBuffer: 2048 * 2048 })
  }

  stop() {
    if (!this.isRunning()) return

    this.player.kill()
    this.player = null
  }

  isRunning() {
    return !!this.player
  }

  static playBell() {
    exec(`mplayer ${mediaPath}/bell.ogg`)
  }
}

module.exports = Noiser
