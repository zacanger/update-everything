#!/usr/bin/env node

const npm = require('npm')
const gp = require('global-packages')
const { createInterface } = require('readline')
const { log } = console
const query = `
  This will update ALL your globally installed modules.
  This may take quite a while. And some stuff might break.
  Are you sure you want to do this?
`

// adapted from create-react-app's prompt
const termPrompt = (question, isYesDefault) => {
  return new Promise(resolve => {
    const rlInterface = createInterface({
      input  : process.stdin
    , output : process.stdout
    })

    const hint = isYesDefault ? '[Y/n]' : '[y/N]'
    const message = `${question} ${hint}\n`

    rlInterface.question(message, answer => {
      rlInterface.close()

      const useDefault = answer.trim().length === 0
      if (useDefault) return resolve(isYesDefault)

      const isYes = answer.match(/^(yes|y)$/i)
      return resolve(isYes)
    })
  })
}

termPrompt(query).then((sure) => {
  if (sure) {
    gp().then((a) => {
      a.forEach((i) => {
        npm.load({ global: true }, (err, npm) => {
          if (err) return console.warn('Error!', err)
          console.log(`Installing ${i}`)
          npm.commands.install([i])
        })
      })
    })
  } else {
    log('Okay, see you next time!')
  }
})
