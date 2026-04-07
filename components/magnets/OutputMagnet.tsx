'use client'
// ─────────────────────────────────────────────────────────────────────────────
// digifridge · components/magnets/OutputMagnet.tsx
// Read-only receipt-style sticker showing one line of print() output.
// ─────────────────────────────────────────────────────────────────────────────

import { OutputMagnet } from '@/types'

export function OutputMagnetBlock({ magnet }: { magnet: OutputMagnet }) {
  return (
    <div
      className="output-magnet"
      style={{
        position: 'absolute',
        left: magnet.x,
        top: magnet.y,
        rotate: `${magnet.rotation}deg`,
        zIndex: 200,
      }}
    >
      <span className="output-magnet-text">{magnet.text}</span>
    </div>
  )
}
