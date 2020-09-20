const terminal = require('terminal-kit').terminal
const Progress = require('./progress')
const Controls = require('./controls')

class Ui {
  constructor(timer) {
    this.timer = timer
    this.terminal = terminal
    this.progress = new Progress(this.terminal)
    this.controls = new Controls(this.terminal)
  }

  boot() {
    this.progress.init()
    this.controls.init()
  }
}

module.exports = Ui
