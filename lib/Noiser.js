const { exec } = require('child_process')

class Noiser {
    constructor() {
        this.player = null
    }

    toggle() {
        if (this.isRunning()) {
            this.player.kill()
            this.player = null
        } else {
            this.player = exec('mplayer ./media/rain_thunder.mp3')
        }
    }

    isRunning() {
        return !!this.player
    }
}

module.exports = Noiser
