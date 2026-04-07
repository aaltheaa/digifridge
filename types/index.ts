// ─────────────────────────────────────────────────────────────────────────────
// digifridge · types/index.ts
// Central type definitions for the magnet coding system
// ─────────────────────────────────────────────────────────────────────────────

/** Semantic category of a magnet — used for tray filtering */
export type MagnetCategory =
  | 'event'     // START, triggers
  | 'output'    // print, return
  | 'variable'  // set, change
  | 'control'   // if, else, loop, while, end
  | 'function'  // define, call, return
  | 'operator'  // and, or, not, compare
  | 'other'     // ask, note/comment

/** A slot is an editable field embedded inside a magnet block */
export interface SlotDefinition {
  id: string
  /** Separator label rendered before this slot (e.g. "=" or "→"). Empty string for none. */
  sep: string
  placeholder: string
}

/** The definition (blueprint) of a magnet type — lives in the catalog */
export interface MagnetDefinition {
  id: string
  label: string          // Display label, e.g. "PRINT"
  category: MagnetCategory
  slots: SlotDefinition[]
  // Code template: use {{slotId}} as placeholders, e.g. "print({{value}})"
  codeTemplate: string
  description: string    // Tooltip / tray description
  emoji?: string         // Optional icon
}

/** A read-only output sticker that appears on the fridge after a successful run */
export interface OutputMagnet {
  id: string       // "out_0", "out_1" — index-stable within a run
  text: string     // captured print() value
  x: number
  y: number
  rotation: number // -3 to +3 deg
}

/** A live instance of a magnet placed on the fridge canvas */
export interface PlacedMagnet {
  instanceId: string       // Unique per placement
  definitionId: string     // References MagnetDefinition.id
  x: number                // Canvas-relative position
  y: number
  zIndex: number
  rotation: number         // Small random tilt in degrees (-4 to +4)
  slotValues: Record<string, string>  // slotId → current value
}

/** Output from the code generator */
export interface GeneratedCode {
  raw: string              // The full generated code string
  lines: CodeLine[]        // Structured lines for display
  hasErrors: boolean
  errors: string[]
}

export interface CodeLine {
  text: string
  indent: number
  magnetInstanceId?: string  // Which magnet produced this line
}

/** UI state for panels and layout */
export interface UIState {
  trayOpen: boolean
  codePanelOpen: boolean
  activeCategory: MagnetCategory | 'all'
  selectedMagnetId: string | null
}
