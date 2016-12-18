#!/usr/bin/env node
/* eslint-disable no-unused-vars */
const { execFile, execFileSync } = require('child_process')
const { argv, stdin, stdout, platform } = process
const { createInterface } = require('readline')
const { error, log, warn } = console
const yes = argv[2] === '-y'
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

const maybeDoTheThing = () => {
  if (['linux', 'sunos', 'freebsd', 'darwin'].includes(platform)) {
    // execFileSync('./if-unix.sh', { stdio: [0, 1, 2] })
    execFile('./if-unix.sh', (err, stdout, stderr) => {
      if (err) return error('Error!', err)
      log('stdout:', stdout)
      warn('stderr:', stderr)
    })
    /*
  } else if (platform === 'win32') {
    execFile('./if-win.cmd', (err, stdout, stderr) => {
      if (err) return error('Error!', err)
      log('stdout:', stdout)
      warn('stderr:', stderr)
    })
    */
  } else {
    return warn(`Sorry, not yet implemented for ${platform}!`)
  }
}

termPrompt(query).then((sure) => {
  if (sure) {
    try {
      maybeDoTheThing()
    } catch (err) {
      error('Something went super wrong, sorry!', err)
    }
  } else {
    log('  Okay, see you next time!\n')
  }
})
