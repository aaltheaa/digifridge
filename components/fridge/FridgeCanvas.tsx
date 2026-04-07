'use client'
// ─────────────────────────────────────────────────────────────────────────────
// digifridge · components/fridge/FridgeCanvas.tsx
// The droppable stainless steel surface where magnets are placed.
// Renders all placed magnets and handles the drop zone.
// ─────────────────────────────────────────────────────────────────────────────

import { useDroppable } from '@dnd-kit/core'
import { useFridgeStore } from '@/store/fridge'
import { getMagnetDef } from '@/lib/magnet-catalog'
import { PlacedMagnetBlock } from '@/components/magnets/Magnet'
import { OutputMagnetBlock } from '@/components/magnets/OutputMagnet'

export function FridgeCanvas() {
  const { magnets, outputMagnets, setSelectedMagnet } = useFridgeStore()

  const { setNodeRef, isOver } = useDroppable({
    id: 'fridge-canvas',
  })

  return (
    <div
      ref={setNodeRef}
      className="fridge-surface relative flex-1 overflow-hidden"
      style={{
        // Subtle highlight when a magnet is being dragged over
        transition: 'box-shadow 0.2s ease',
        boxShadow: isOver
          ? 'inset 0 0 0 2px rgba(148, 163, 184, 0.4), inset 0 0 60px rgba(148,163,184,0.08)'
          : undefined,
      }}
      onClick={() => setSelectedMagnet(null)}
    >
      {/* Empty state hint */}
      {magnets.length === 0 && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          style={{ zIndex: 2 }}
        >
          <div
            className="text-center space-y-2"
            style={{ color: 'rgba(100,116,139,0.6)' }}
          >
            <div className="text-5xl mb-4">🧲</div>
            <p
              className="text-sm tracking-widest uppercase"
              style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.15em' }}
            >
              drag magnets onto the fridge
            </p>
            <p
              className="text-xs opacity-60"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              arrange top-to-bottom to write code
            </p>
          </div>
        </div>
      )}

      {/* Render all placed magnets */}
      {magnets.map((magnet) => {
        const def = getMagnetDef(magnet.definitionId)
        if (!def) return null
        return (
          <PlacedMagnetBlock
            key={magnet.instanceId}
            magnet={magnet}
            definition={def}
          />
        )
      })}

      {/* Output magnets — receipt-style stickers from last run */}
      {outputMagnets.map((om) => (
        <OutputMagnetBlock key={om.id} magnet={om} />
      ))}

      {/* Sort order guide — subtle vertical line on left side */}
      <div
        className="absolute left-8 top-6 bottom-6 pointer-events-none"
        style={{
          width: 1,
          background: 'linear-gradient(180deg, transparent, rgba(100,116,139,0.15) 20%, rgba(100,116,139,0.15) 80%, transparent)',
          zIndex: 2,
        }}
      />
      <div
        className="absolute left-6 top-6 pointer-events-none"
        style={{
          color: 'rgba(100,116,139,0.3)',
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          letterSpacing: '0.1em',
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
        }}
      >
        TOP → FIRST LINE
      </div>
    </div>
  )
}
