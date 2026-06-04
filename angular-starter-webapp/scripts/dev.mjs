import { spawn } from 'node:child_process'

const DEFAULT_CLIENT_PORT = '4200'
const HOST = '127.0.0.1'

const clientPort = process.env.VITE_CLIENT_PORT || process.env.NG_PORT || DEFAULT_CLIENT_PORT
const codeStudioPath = process.env[`DKU_CODE_STUDIO_BROWSER_PATH_${clientPort}`]
const pnpmCommand = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'

const args = [
  'ng',
  'serve',
  '--host',
  HOST,
  '--port',
  clientPort,
  '--proxy-config',
  'proxy.conf.json',
]

if (codeStudioPath) {
  const servePath = codeStudioPath.endsWith('/') ? codeStudioPath : `${codeStudioPath}/`
  args.push('--serve-path', servePath)

  console.log(`Starting Angular dev server for Code Studios at ${servePath}`)
} else {
  console.log(`Starting Angular dev server at http://${HOST}:${clientPort}/`)
}

const child = spawn(pnpmCommand, args, {
  stdio: 'inherit',
  env: process.env,
})

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }

  process.exit(code ?? 0)
})

child.on('error', (error) => {
  console.error(error)
  process.exit(1)
})
