'use client'
// ─────────────────────────────────────────────────────────────────────────────
// digifridge · app/page.tsx
// Root page: assembles the full fridge interface with DnD context.
// DragOverlay renders the "ghost" magnet while dragging.
// ─────────────────────────────────────────────────────────────────────────────

import { useRef, useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  rectIntersection,
} from '@dnd-kit/core'
import { useFridgeStore } from '@/store/fridge'
import { getMagnetDef, MAGNET_CATALOG } from '@/lib/magnet-catalog'
import { FridgeCanvas } from '@/components/fridge/FridgeCanvas'
import { MagnetTray } from '@/components/tray/MagnetTray'
import { CodePanel } from '@/components/output/CodePanel'
import { TrayMagnet } from '@/components/magnets/Magnet'
import { MagnetDefinition } from '@/types'

export default function Home() {
  const { placeMagnet, moveMagnet } = useFridgeStore()
  const canvasRef = useRef<HTMLDivElement>(null)

  // Track which magnet is being dragged for the DragOverlay
  const [activeDef, setActiveDef] = useState<MagnetDefinition | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    })
  )

  function handleDragStart(event: DragStartEvent) {
    const { data } = event.active
    const defId =
      data.current?.source === 'tray'
        ? data.current.definitionId
        : useFridgeStore.getState().magnets.find(
            (m) => m.instanceId === event.active.id
          )?.definitionId

    if (defId) {
      setActiveDef(getMagnetDef(defId) ?? null)
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveDef(null)
    const { active, over, delta } = event

    // Must drop onto the fridge canvas
    if (!over || over.id !== 'fridge-canvas') return

    const source = active.data.current?.source

    if (source === 'tray') {
      // ── New magnet from tray ─────────────────────────────────────────────
      const defId = active.data.current?.definitionId as string
      if (!defId) return

      // Use the ghost's final translated position for accurate drop placement
      const canvas = canvasRef.current?.querySelector('.fridge-surface') as HTMLElement
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const finalRect = event.active.rect.current.translated
      if (!finalRect) return
      const x = Math.max(0, finalRect.left - rect.left)
      const y = Math.max(0, finalRect.top - rect.top)

      placeMagnet(defId, x, y)
    } else if (source === 'canvas') {
      // ── Move existing magnet ─────────────────────────────────────────────
      const instanceId = active.data.current?.instanceId as string
      const existing = useFridgeStore.getState().magnets.find(
        (m) => m.instanceId === instanceId
      )
      if (!existing) return

      const newX = Math.max(0, existing.x + delta.x)
      const newY = Math.max(0, existing.y + delta.y)
      moveMagnet(instanceId, newX, newY)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* ── Kitchen background ──────────────────────────────────────────────── */}
      <div className="kitchen-bg w-screen h-screen flex items-center justify-center overflow-hidden">

        {/* ── Fridge outer shell ──────────────────────────────────────────── */}
        <div
          ref={canvasRef}
          className="relative flex flex-col"
          style={{
            width: 'min(680px, 90vw)',
            height: 'min(860px, 92vh)',
            // Fridge outer casing
            background: 'linear-gradient(160deg, #b0b5bb 0%, #9aa0a8 50%, #b8bdc5 100%)',
            borderRadius: 16,
            padding: 6,
            boxShadow:
              '0 30px 80px rgba(0,0,0,0.6), 0 8px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
          }}
        >
          {/* Inner fridge door */}
          <div
            className="flex flex-col flex-1 overflow-hidden relative"
            style={{
              borderRadius: 12,
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.15)',
            }}
          >
            {/* ── Handle ──────────────────────────────────────────────────── */}
            <div className="flex justify-center pt-4 pb-2 shrink-0" style={{ background: '#c8cdd3' }}>
              <div
                className="fridge-handle"
                style={{ width: 140, height: 12 }}
              />
            </div>

            {/* ── Brand wordmark ──────────────────────────────────────────── */}
            <div
              className="text-center pb-1 shrink-0"
              style={{ background: '#c8cdd3' }}
            >
              <span
                className="text-xs tracking-[0.3em] uppercase"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'rgba(80,90,100,0.5)',
                  fontSize: 9,
                }}
              >
                digifridge
              </span>
            </div>

            {/* ── Canvas + Code Panel ─────────────────────────────────────── */}
            <div className="relative flex-1 overflow-hidden flex flex-col">
              <FridgeCanvas />
              <CodePanel />
            </div>

            {/* ── Tray ────────────────────────────────────────────────────── */}
            <MagnetTray />
          </div>
        </div>
      </div>

      {/* ── Drag Ghost Overlay ──────────────────────────────────────────────── */}
      <DragOverlay dropAnimation={{ duration: 180, easing: 'cubic-bezier(0.18,0.67,0.6,1.22)' }}>
        {activeDef && <TrayMagnet definition={activeDef} />}
      </DragOverlay>
    </DndContext>
  )
}
