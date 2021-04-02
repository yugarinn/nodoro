const { exec } = require('child_process')
const loadConfig = require('./config')

class Noiser {
  constructor() {
    this.player = null
    this.config = loadConfig()
  }

  toggle() {
    if (this.isRunning()) {
      this.player.kill()
      this.player = null
    } else {
      this.player = exec('mplayer ./media/rain_thunder.mp3')
    }
  }

  play() {
    if (this.isRunning()) return

    this.player = exec('mplayer ./media/rain_thunder.mp3')
  }

  isRunning() {
    return !!this.player
  }

  static playBell() {
    exec('mplayer ./media/bell.ogg')
  }
}

module.exports = Noiser
