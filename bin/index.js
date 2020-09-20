#! /usr/bin/env node

const Timer = require('../lib/Timer')
const Ui = require('../lib/Ui')

const timer = new Timer()
const ui = new Ui(timer)

ui.boot()
