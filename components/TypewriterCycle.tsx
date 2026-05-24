'use client'

import { useEffect, useState } from 'react'

type Phase = 'typing' | 'pausing' | 'deleting'

const TYPE_MS = 60
const DELETE_MS = 30
const HOLD_MS = 1500
const GAP_MS = 350

export default function TypewriterCycle({
  prompt = '~',
  items,
  className = '',
}: {
  prompt?: string
  items: string[]
  className?: string
}) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [phase, setPhase] = useState<Phase>('typing')

  useEffect(() => {
    const target = items[index % items.length]
    let timer: ReturnType<typeof setTimeout>

    if (phase === 'typing') {
      if (text.length < target.length) {
        timer = setTimeout(() => setText(target.slice(0, text.length + 1)), TYPE_MS)
      } else {
        timer = setTimeout(() => setPhase('pausing'), HOLD_MS)
      }
    } else if (phase === 'pausing') {
      timer = setTimeout(() => setPhase('deleting'), GAP_MS)
    } else {
      if (text.length > 0) {
        timer = setTimeout(() => setText(text.slice(0, -1)), DELETE_MS)
      } else {
        timer = setTimeout(() => {
          setIndex(i => (i + 1) % items.length)
          setPhase('typing')
        }, GAP_MS)
      }
    }

    return () => clearTimeout(timer)
  }, [text, phase, index, items])

  return (
    <div className={`font-mono text-xs text-zinc-500 ${className}`} aria-hidden="true">
      <span className="text-emerald-500/80">{prompt}</span>
      <span className="text-zinc-600 mx-1.5">$</span>
      <span className="text-zinc-300">{text}</span>
      <span className="cursor-blink text-emerald-400">▌</span>
    </div>
  )
}
