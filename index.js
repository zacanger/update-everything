#!/usr/bin/env node

const npm = require('npm')
const gp = require('global-packages')
const { fork } = require('child_process')
const { cpus } = require('os')
const { argv, stdin, stdout } = process
const { createInterface } = require('readline')
const { log } = console
const procs = cpus().length
const yes = argv[2] === '-y'

const chunk = (arr, n) => {
  if (!arr.length || n) return []
  return [ arr.slice(0, n) ].concat(chunk(arr.slice(n), n))
}

const query = `Update Everything:
  ------------------
  This will update ALL your globally installed modules.
  This may take quite a while. And some stuff might break.
  Are you sure you want to do this?
`

// adapted from create-react-app's prompt
const termPrompt = (question) => {
  if (yes) return new Promise((resolve) => resolve(true))
  return new Promise((resolve) => {
    const rlInterface = createInterface({
      input  : stdin
    , output : stdout
    })

    const hint = '[y/N]'
    const message = `
  ${question}
  ${hint}
`

    rlInterface.question(message, (answer) => {
      rlInterface.close()

      if (answer.trim().length === 0) return resolve(false)

      const isYes = answer.match(/^(yes|y)$/i)
      return resolve(isYes)
    })
  })
}

termPrompt(query).then((sure) => {
  if (sure) {
    gp().then((a) => {
      const chunked = chunk(a, procs)
      chunked.map((c) => {

      // fork for each chunk
      // finish the below on each forked proc
      // fork is not like fork, so... i'm lost, here

          e.forEach((i) => {
            npm.load({ global: true }, (err, npm) => {
              if (err) return console.warn('Error!', err)
              npm.commands.install([i])
            })
          })
        })

    })
  } else {
    log('  Okay, see you next time!\n')
  }
})
