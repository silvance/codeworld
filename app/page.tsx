import type { Metadata } from 'next'
import CodePlayground from '@/components/playground/CodePlayground'

export const metadata: Metadata = {
  title: 'Code Playground',
  description: 'Interactive Python, JavaScript, and Bash playground for cyber and TSCM tasks',
}

export default function PlaygroundPage() {
  return <CodePlayground />
}
