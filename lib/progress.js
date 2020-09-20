class Progress {
  constructor(terminal) {
    this.terminal = terminal
    this.progress = 0
    this.bar = null
    this.cycle = this.cycle.bind(this)
  }

  init() {
    this.initBar()
    this.cycle()
  }

  initBar() {
    this.bar = this.terminal.progressBar({
      width: 80,
      title: 'Running: ',
      percent: true
    })
  }

  cycle() {
    this.progress += 0.01
    this.bar.update(this.progress)

    if (this.progress >= 1) {
      // setTimeout(terminate, 200)
    } else {
      setTimeout(this.cycle, 1000)
    }
  }
}

module.exports = Progress
