// ─────────────────────────────────────────────────────────────────────────────
// digifridge · lib/code-generator.ts
// Converts an ordered array of placed magnets into executable JS-like code.
// Sorting is top-to-bottom by Y position on the canvas.
// ─────────────────────────────────────────────────────────────────────────────

import { PlacedMagnet, GeneratedCode, CodeLine } from '@/types'
import { getMagnetDef } from './magnet-catalog'

/** 
 * Generate code from the current fridge state.
 * Magnets are sorted top-to-bottom (ascending Y) to determine execution order.
 */
export function generateCode(magnets: PlacedMagnet[]): GeneratedCode {
  // Sort by Y position (top of canvas = first line of code)
  const sorted = [...magnets].sort((a, b) => a.y - b.y)

  const lines: CodeLine[] = []
  const errors: string[] = []
  let indentLevel = 0

  for (const magnet of sorted) {
    const def = getMagnetDef(magnet.definitionId)
    if (!def) {
      errors.push(`Unknown magnet type: ${magnet.definitionId}`)
      continue
    }

    // Build the code line by filling slot templates
    let codeLine = def.codeTemplate
    for (const slot of def.slots) {
      const value = magnet.slotValues[slot.id] || slot.placeholder
      codeLine = codeLine.replace(`{{${slot.id}}}`, value)
    }

    // Adjust indent BEFORE for closing braces
    if (codeLine.trim() === '}' || codeLine.trim().startsWith('} else')) {
      indentLevel = Math.max(0, indentLevel - 1)
    }

    lines.push({
      text: codeLine,
      indent: indentLevel,
      magnetInstanceId: magnet.instanceId,
    })

    // Adjust indent AFTER for opening braces
    if (codeLine.endsWith('{')) {
      indentLevel++
    }
  }

  // Unclosed braces warning
  if (indentLevel > 0) {
    errors.push(`${indentLevel} block(s) left unclosed — add END LOOP or END IF magnets`)
  }

  // Render raw code string with indentation
  const raw = lines
    .map((line) => '  '.repeat(line.indent) + line.text)
    .join('\n')

  return {
    raw,
    lines,
    hasErrors: errors.length > 0,
    errors,
  }
}

/**
 * Execute generated code in a sandboxed context.
 * Returns an array of console output lines.
 * EXTENSION POINT: Replace with a proper sandbox (e.g., iframe, web worker)
 */
export function executeCode(raw: string): { output: string[]; error?: string } {
  const output: string[] = []

  // Override print() to capture output
  const printFn = (val: unknown) => {
    output.push(String(val))
  }

  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function('print', raw)
    const returnVal = fn(printFn)
    // If the program used `return` and produced no print() output, show the return value
    if (returnVal !== undefined && output.length === 0) {
      output.push(String(returnVal))
    }
    return { output }
  } catch (err) {
    return {
      output,
      error: err instanceof Error ? err.message : String(err),
    }
  }
}
