// ─────────────────────────────────────────────────────────────────────────────
// digifridge · lib/magnet-catalog.ts
// All available magnet block definitions.
// To add a new magnet: append an entry to MAGNET_CATALOG.
// codeTemplate uses {{slotId}} placeholders filled at code-gen time.
// ─────────────────────────────────────────────────────────────────────────────

import { MagnetDefinition, MagnetCategory } from '@/types'

export const MAGNET_CATALOG: MagnetDefinition[] = [
  // ── EVENT ─────────────────────────────────────────────────────────────────
  {
    id: 'start',
    label: 'start',
    category: 'event',
    description: 'Mark the beginning of your program',
    slots: [],
    codeTemplate: '// ── program start ──',
  },

  // ── OUTPUT ────────────────────────────────────────────────────────────────
  {
    id: 'print',
    label: 'print',
    category: 'output',
    description: 'Display a value',
    slots: [{ id: 'val', sep: '', placeholder: '"hello world"' }],
    codeTemplate: 'print({{val}})',
  },

  // ── VARIABLE ──────────────────────────────────────────────────────────────
  {
    id: 'set',
    label: 'set',
    category: 'variable',
    description: 'Declare and assign a variable',
    slots: [
      { id: 'name', sep: '',  placeholder: 'x' },
      { id: 'val',  sep: '=', placeholder: '0' },
    ],
    codeTemplate: 'let {{name}} = {{val}}',
  },
  {
    id: 'change',
    label: 'change',
    category: 'variable',
    description: 'Update the value of an existing variable',
    slots: [
      { id: 'name', sep: '',   placeholder: 'x' },
      { id: 'val',  sep: 'to', placeholder: 'x + 1' },
    ],
    codeTemplate: '{{name}} = {{val}}',
  },

  // ── CONTROL ───────────────────────────────────────────────────────────────
  {
    id: 'repeat',
    label: 'repeat',
    category: 'control',
    description: 'Loop a fixed number of times',
    slots: [{ id: 'n', sep: '', placeholder: '3' }],
    codeTemplate: 'for (let i = 0; i < {{n}}; i++) {',
  },
  {
    id: 'while',
    label: 'while',
    category: 'control',
    description: 'Loop while a condition is true',
    slots: [{ id: 'cond', sep: '', placeholder: 'x > 0' }],
    codeTemplate: 'while ({{cond}}) {',
  },
  {
    id: 'if',
    label: 'if',
    category: 'control',
    description: 'Run the next block if a condition is true',
    slots: [{ id: 'cond', sep: '', placeholder: 'x > 0' }],
    codeTemplate: 'if ({{cond}}) {',
  },
  {
    id: 'else',
    label: 'else',
    category: 'control',
    description: 'Alternate branch for an if block',
    slots: [],
    codeTemplate: '} else {',
  },
  {
    id: 'end',
    label: 'end',
    category: 'control',
    description: 'Close a repeat, while, if, else, or define block',
    slots: [],
    codeTemplate: '}',
  },

  // ── FUNCTION ──────────────────────────────────────────────────────────────
  {
    id: 'define',
    label: 'define',
    category: 'function',
    description: 'Define a reusable function',
    slots: [
      { id: 'name', sep: '',  placeholder: 'myFn' },
      { id: 'args', sep: '(', placeholder: '' },
    ],
    codeTemplate: 'function {{name}}({{args}}) {',
  },
  {
    id: 'call',
    label: 'call',
    category: 'function',
    description: 'Call a function',
    slots: [
      { id: 'name', sep: '',  placeholder: 'myFn' },
      { id: 'args', sep: '(', placeholder: '' },
    ],
    codeTemplate: '{{name}}({{args}})',
  },
  {
    id: 'return',
    label: 'return',
    category: 'function',
    description: 'Return a value from a function',
    slots: [{ id: 'val', sep: '', placeholder: 'result' }],
    codeTemplate: 'return {{val}}',
  },

  // ── OPERATOR ──────────────────────────────────────────────────────────────
  {
    id: 'and',
    label: 'and',
    category: 'operator',
    description: 'True if both conditions are true',
    slots: [
      { id: 'a', sep: '',   placeholder: 'x > 0' },
      { id: 'b', sep: '&&', placeholder: 'y < 10' },
    ],
    codeTemplate: '{{a}} && {{b}}',
  },
  {
    id: 'or',
    label: 'or',
    category: 'operator',
    description: 'True if either condition is true',
    slots: [
      { id: 'a', sep: '',   placeholder: 'x > 0' },
      { id: 'b', sep: '||', placeholder: 'y < 10' },
    ],
    codeTemplate: '{{a}} || {{b}}',
  },
  {
    id: 'not',
    label: 'not',
    category: 'operator',
    description: 'Invert a condition',
    slots: [{ id: 'val', sep: '', placeholder: 'x > 0' }],
    codeTemplate: '!({{val}})',
  },

  // ── OTHER ─────────────────────────────────────────────────────────────────
  {
    id: 'ask',
    label: 'ask',
    category: 'other',
    description: 'Prompt the user for input',
    slots: [
      { id: 'name', sep: '',  placeholder: 'answer' },
      { id: 'q',    sep: '→', placeholder: '"question?"' },
    ],
    codeTemplate: 'let {{name}} = prompt({{q}})',
  },
  {
    id: 'note',
    label: '//',
    category: 'other',
    description: 'Leave a comment or note',
    slots: [{ id: 'text', sep: '', placeholder: 'a note' }],
    codeTemplate: '// {{text}}',
  },
]

/** Look up a magnet definition by ID */
export function getMagnetDef(id: string): MagnetDefinition | undefined {
  return MAGNET_CATALOG.find((m) => m.id === id)
}

/** Group catalog by category for the tray UI */
export function getCatalogByCategory(): Partial<Record<MagnetCategory, MagnetDefinition[]>> {
  const groups: Partial<Record<MagnetCategory, MagnetDefinition[]>> = {}
  for (const magnet of MAGNET_CATALOG) {
    if (!groups[magnet.category]) groups[magnet.category] = []
    groups[magnet.category]!.push(magnet)
  }
  return groups
}

/** Ordered list of categories for the tray tabs */
export const CATEGORY_ORDER: MagnetCategory[] = [
  'event', 'output', 'variable', 'control', 'function', 'operator', 'other',
]

export const CATEGORY_LABELS: Record<MagnetCategory, string> = {
  event:    'events',
  output:   'output',
  variable: 'variables',
  control:  'control',
  function: 'functions',
  operator: 'operators',
  other:    'other',
}

/** Accent color per category — used only in the tray tab UI, not on magnet tiles */
export const CATEGORY_ACCENT: Record<MagnetCategory, string> = {
  event:    '#a78bfa',
  output:   '#4ade80',
  variable: '#60a5fa',
  control:  '#fb923c',
  function: '#f472b6',
  operator: '#c084fc',
  other:    '#94a3b8',
}
