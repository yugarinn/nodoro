const stateToHuman = (ticker) => {
  const mode = ticker.mode == 'POMODORO' ? 'Focus' : 'Rest'

  if (ticker.running) {
    return mode
  } else {
    return `${mode} (paused)`
  }

  return ''
}

const remainingToHuman = (ticker) => {
  const minutes = parseInt(ticker.remaining / 60)
  const seconds = parseInt(ticker.remaining % 60)
  const leadingZero = seconds < 10 ? '0' : ''

  return `${minutes}:${leadingZero}${seconds}`
}

const noiserStateToHuman = (noiser) => {
  if (noiser.isRunning()) return 'mute'

  return 'unmute'
}

module.exports = { stateToHuman, remainingToHuman, noiserStateToHuman }
