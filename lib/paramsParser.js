const paramsParser = {
  parse: (params) => {
    return {
      command: params[0],
    }
  }
}

module.exports = paramsParser
