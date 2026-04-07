// ─────────────────────────────────────────────────────────────────────────────
// digifridge · store/fridge.ts
// Global state: placed magnets, UI panels, generated code output
// ─────────────────────────────────────────────────────────────────────────────

import { create } from 'zustand'
import { PlacedMagnet, OutputMagnet, UIState, GeneratedCode, MagnetCategory } from '@/types'
import { generateCode } from '@/lib/code-generator'

interface FridgeStore {
  // ── Magnet State ───────────────────────────────────────────────────────────
  magnets: PlacedMagnet[]
  placeMagnet: (definitionId: string, x: number, y: number) => void
  moveMagnet: (instanceId: string, x: number, y: number) => void
  removeMagnet: (instanceId: string) => void
  updateSlot: (instanceId: string, slotId: string, value: string) => void
  clearAll: () => void

  // ── UI State ───────────────────────────────────────────────────────────────
  ui: UIState
  setTrayOpen: (open: boolean) => void
  setCodePanelOpen: (open: boolean) => void
  setActiveCategory: (cat: MagnetCategory | 'all') => void
  setSelectedMagnet: (id: string | null) => void

  // ── Generated Code ─────────────────────────────────────────────────────────
  generatedCode: GeneratedCode | null
  runCodeGeneration: () => void

  // ── Output Magnets ─────────────────────────────────────────────────────────
  outputMagnets: OutputMagnet[]
  setOutputMagnets: (magnets: OutputMagnet[]) => void
}

let nextZIndex = 1

function newInstanceId() {
  return `m_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

export const useFridgeStore = create<FridgeStore>((set, get) => ({
  // ── Magnets ────────────────────────────────────────────────────────────────
  magnets: [],

  placeMagnet: (definitionId, x, y) => {
    const rotation = parseFloat(((Math.random() * 8) - 4).toFixed(1))
    const newMagnet: PlacedMagnet = {
      instanceId: newInstanceId(),
      definitionId,
      x,
      y,
      zIndex: nextZIndex++,
      rotation,
      slotValues: {},
    }
    set((state) => ({ magnets: [...state.magnets, newMagnet], outputMagnets: [] }))
    get().runCodeGeneration()
  },

  moveMagnet: (instanceId, x, y) => {
    set((state) => ({
      magnets: state.magnets.map((m) =>
        m.instanceId === instanceId
          ? { ...m, x, y, zIndex: nextZIndex++ }
          : m
      ),
      outputMagnets: [],
    }))
    get().runCodeGeneration()
  },

  removeMagnet: (instanceId) => {
    set((state) => ({
      magnets: state.magnets.filter((m) => m.instanceId !== instanceId),
      outputMagnets: [],
    }))
    get().runCodeGeneration()
  },

  updateSlot: (instanceId, slotId, value) => {
    set((state) => ({
      magnets: state.magnets.map((m) =>
        m.instanceId === instanceId
          ? { ...m, slotValues: { ...m.slotValues, [slotId]: value } }
          : m
      ),
      outputMagnets: [],
    }))
    get().runCodeGeneration()
  },

  clearAll: () => {
    set({ magnets: [], generatedCode: null, outputMagnets: [] })
  },

  // ── UI ─────────────────────────────────────────────────────────────────────
  ui: {
    trayOpen: false,
    codePanelOpen: false,
    activeCategory: 'all',
    selectedMagnetId: null,
  },

  setTrayOpen: (open) =>
    set((state) => ({ ui: { ...state.ui, trayOpen: open } })),

  setCodePanelOpen: (open) =>
    set((state) => ({ ui: { ...state.ui, codePanelOpen: open } })),

  setActiveCategory: (cat) =>
    set((state) => ({ ui: { ...state.ui, activeCategory: cat } })),

  setSelectedMagnet: (id) =>
    set((state) => ({ ui: { ...state.ui, selectedMagnetId: id } })),

  // ── Output Magnets ─────────────────────────────────────────────────────────
  outputMagnets: [],

  setOutputMagnets: (magnets) => set({ outputMagnets: magnets }),

  // ── Code Generation ────────────────────────────────────────────────────────
  generatedCode: null,

  runCodeGeneration: () => {
    const { magnets } = get()
    if (magnets.length === 0) {
      set({ generatedCode: null })
      return
    }
    const result = generateCode(magnets)
    set({ generatedCode: result })
  },
}))
