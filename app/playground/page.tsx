import type { Metadata } from 'next'
import CodePlayground from '@/components/playground/CodePlayground'

export const metadata: Metadata = {
  title: 'Code Playground',
  description: 'Interactive code playground supporting Python (Pyodide), JavaScript, Bash, Go, and Ruby. Pre-loaded with security-relevant snippets for hash analysis, encoding, subnet math, and forensic tasks.',
}

export default function PlaygroundPage() {
  return <CodePlayground />
}
