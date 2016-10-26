#!/usr/bin/env node

const npm = require('npm')
const gp = require('global-packages')

gp().then((a) => {
  a.forEach((i) => {
    npm.load({ global: true }, (err, npm) => {
      if (err) return console.warn('Error!', err)
      npm.commands.install([i])
    })
  })
})
