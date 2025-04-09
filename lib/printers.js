const stateToHuman = (ticker) => {
  const states = {
    POMODORO: 'Focus',
    SHORT_BREAK: 'Rest',
    LONG_BREAK: 'Long Rest',
  }

  let state = `${states[ticker.mode]} ${ticker.cycle}/${ticker.config.pomodorosPerLongBreak} (${ticker.set})`

  if (! ticker.running) {
    state += ' (paused)'
  }

  return state
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
