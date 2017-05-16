#!/usr/bin/env node

const { spawn } = require('child_process')
const { argv, stdin, stdout, env } = process
const { SHELL } = env
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

const maybeDoTheThing = (s) => {
  let f
  let c
  if (s && s.endsWith('sh')) {
    if (s.includes('\\')) {
      const z = s.split('\\')
      c = z[z.length - 1]
    } else {
      const z = s.split('/')
      c = z[z.length - 1]
    }
    f = [ 'if-unix.sh' ]
  } else {
    c = 'cmd.exe'
    f = [ '/c', 'if-win.cmd' ]
  }

  const sp = spawn(c, f)

  sp.stdout.on('data', (d) => {
    log(d.toString())
  })
  sp.stderr.on('data', (d) => {
    warn(d.toString())
  })
  sp.on('close', (c) => {
    log(c.toString())
  })
}

termPrompt(query).then((sure) => {
  if (sure) {
    try {
      maybeDoTheThing(SHELL)
    } catch (err) {
      error('Something went super wrong, sorry!', err)
    }
  } else {
    log('  Okay, see you next time!\n')
  }
})
