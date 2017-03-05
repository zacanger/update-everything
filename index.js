#!/usr/bin/env node

const { spawn } = require('child_process')
const { argv, stdin, stdout, platform } = process
const { createInterface } = require('readline')
const { error, log, warn } = console
const yes = argv[2] === '-y'
const query = `
  Update Everything:
  ------------------
  This will update ALL your globally installed modules.
  This may take quite a while. And some stuff might break.
  (To update Node itself, 'npm i -g n && n latest'.)
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

const maybeDoTheThing = (p) => {
  let f
  let c
  const ps = [ 'linux', 'freebsd', 'sunos', 'darwin' ]
  if (ps.includes(p)) {
    c = 'sh'
    f = [ 'if-unix.sh' ]
  } else if (p === 'win32') {
    c = 'cmd.exe'
    f = [ '/c', 'if-win.cmd' ]
  } else {
    return warn(`Sorry, not yet implemented for ${p}!`)
  }

  const s = spawn(c, f)

  s.stdout.on('data', (d) => {
    log(d.toString())
  })
  s.stderr.on('data', (d) => {
    warn(d.toString())
  })
  s.on('close', (c) => {
    log(c.toString())
  })
}

termPrompt(query).then((sure) => {
  if (sure) {
    try {
      maybeDoTheThing(platform)
    } catch (err) {
      error('Something went super wrong, sorry!', err)
    }
  } else {
    log('  Okay, see you next time!\n')
  }
})
