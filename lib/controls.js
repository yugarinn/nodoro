class Controls {
  constructor(terminal) {
    this.terminal = terminal
    this.options = [ 'start', 'stop', 'reset', 'exit' ]
  }

  init() {
    this.terminal.singleColumnMenu(this.options, (error, response) => {
      console.log(response)
    })
  }
}

module.exports = Controls
