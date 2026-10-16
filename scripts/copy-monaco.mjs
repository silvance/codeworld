// Copies Monaco's prebuilt loader bundle into public/monaco/vs so the
// Playground editor works in air-gapped builds. In normal builds
// @monaco-editor/react pulls the same files from cdn.jsdelivr.net.
import { cpSync, existsSync, rmSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const src = path.join(root, 'node_modules', 'monaco-editor', 'min', 'vs')
const dest = path.join(root, 'public', 'monaco', 'vs')

if (!existsSync(src)) {
  console.error(`copy-monaco: ${src} not found — run npm ci first.`)
  process.exit(1)
}
rmSync(dest, { recursive: true, force: true })
cpSync(src, dest, { recursive: true })
console.log('copy-monaco: copied Monaco to public/monaco/vs')
