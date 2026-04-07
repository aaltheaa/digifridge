'use client'
// ─────────────────────────────────────────────────────────────────────────────
// digifridge · components/magnets/Magnet.tsx
//
// Two exports:
//   TrayMagnet       — source tile in the tray drawer (draggable, no slots)
//   PlacedMagnetBlock — tile on the fridge canvas (draggable + editable slots)
//
// Slot inputs use contenteditable <span> so they grow horizontally up to
// max-width then wrap vertically — no clipping ever.
// ─────────────────────────────────────────────────────────────────────────────

import { useRef, useCallback } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { MagnetDefinition, PlacedMagnet } from '@/types'
import { useFridgeStore } from '@/store/fridge'

// ── Tray Magnet ───────────────────────────────────────────────────────────────
interface TrayMagnetProps {
  definition: MagnetDefinition
}

export function TrayMagnet({ definition }: TrayMagnetProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `tray::${definition.id}`,
    data: { source: 'tray', definitionId: definition.id },
  })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="tray-tile"
      style={{ opacity: isDragging ? 0.35 : 1 }}
      title={definition.description}
    >
      {definition.label}
    </div>
  )
}

// ── Placed Magnet ─────────────────────────────────────────────────────────────
interface PlacedMagnetProps {
  magnet: PlacedMagnet
  definition: MagnetDefinition
}

export function PlacedMagnetBlock({ magnet, definition }: PlacedMagnetProps) {
  const { updateSlot, removeMagnet } = useFridgeStore()

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: magnet.instanceId,
    data: { source: 'canvas', instanceId: magnet.instanceId },
  })

  const style: React.CSSProperties = {
    position: 'absolute',
    left: magnet.x,
    top: magnet.y,
    zIndex: isDragging ? 9999 : magnet.zIndex,
    transform: CSS.Translate.toString(transform),
    rotate: `${magnet.rotation ?? 0}deg`,
    touchAction: 'none',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`magnet ${isDragging ? 'dragging' : ''}`}
    >
      {/* Drag handle — the label row */}
      <div
        className="magnet-label-row"
        {...listeners}
        {...attributes}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <span className="magnet-label">{definition.label}</span>
        <button
          className="magnet-delete"
          onClick={(e) => { e.stopPropagation(); removeMagnet(magnet.instanceId) }}
          onPointerDown={(e) => e.stopPropagation()}
          title="Remove"
        >
          ×
        </button>
      </div>

      {/* Slot row — contenteditable fields */}
      {definition.slots.length > 0 && (
        <div className="magnet-slots">
          {definition.slots.map((slot) => (
            <SlotField
              key={slot.id}
              sep={slot.sep}
              placeholder={slot.placeholder}
              value={magnet.slotValues[slot.id] ?? ''}
              onChange={(val) => updateSlot(magnet.instanceId, slot.id, val)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Slot Field (contenteditable) ──────────────────────────────────────────────
interface SlotFieldProps {
  sep: string
  placeholder: string
  value: string
  onChange: (val: string) => void
}

function SlotField({ sep, placeholder, value, onChange }: SlotFieldProps) {
  const ref = useRef<HTMLSpanElement>(null)

  // Sync external value into DOM without disturbing cursor position
  const setRef = useCallback((node: HTMLSpanElement | null) => {
    (ref as React.MutableRefObject<HTMLSpanElement | null>).current = node
    if (node && node.textContent !== value) {
      node.textContent = value
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function handleInput() {
    const text = ref.current?.textContent ?? ''
    onChange(text)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    // Block newlines — slots stay single-logical-line
    if (e.key === 'Enter') e.preventDefault()
  }

  return (
    <>
      {sep && <span className="slot-sep">{sep}</span>}
      <span
        ref={setRef}
        className="slot-editable"
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onPointerDown={(e) => e.stopPropagation()}
      />
    </>
  )
}
