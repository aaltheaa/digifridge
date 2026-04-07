# digifridge 🧲

> A digital fridge where coding blocks are magnets you drag to write programs.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Architecture

```
src/
├── types/
│   └── index.ts              # All TypeScript interfaces
├── lib/
│   ├── magnet-catalog.ts     # Available magnet definitions + colors
│   └── code-generator.ts     # Magnet arrangement → code string + executor
├── store/
│   └── fridge.ts             # Zustand global state
├── components/
│   ├── magnets/
│   │   └── Magnet.tsx        # TrayMagnet + PlacedMagnetBlock
│   ├── fridge/
│   │   └── FridgeCanvas.tsx  # Droppable canvas surface
│   ├── tray/
│   │   └── MagnetTray.tsx    # Slide-up drawer with all magnet types
│   └── output/
│       └── CodePanel.tsx     # Slide-in code + run output panel
└── app/
    ├── page.tsx              # DnD context + fridge shell layout
    ├── layout.tsx
    └── globals.css           # Design tokens, fridge/magnet styles
```

## Core Concepts

### Coding Paradigm
Magnets are **statement blocks** placed on the fridge surface. They're sorted
**top-to-bottom** by Y position to determine execution order. Each magnet has a
`codeTemplate` with `{{slotId}}` placeholders that get filled by inline inputs.

### Adding New Magnets
Edit `src/lib/magnet-catalog.ts` — add a new entry to `MAGNET_CATALOG`:

```ts
{
  id: 'while',
  label: 'WHILE',
  category: 'control',
  emoji: '🔄',
  description: 'Loop while a condition is true',
  slots: [{ id: 'condition', label: 'while', placeholder: 'x > 0', type: 'text' }],
  codeTemplate: 'while ({{condition}}) {',
}
```

### Code Generation
`src/lib/code-generator.ts` → `generateCode(magnets)` returns `GeneratedCode`
with structured lines and indentation. `executeCode(raw)` runs it in a sandboxed
`new Function()` context with a custom `print()` function.

## Extension Points (for Claude Code)

- [ ] **Snap-to-grid**: Add grid snapping on the canvas for alignment
- [ ] **Block nesting**: Visual grouping for LOOP/IF blocks (indented visually)
- [ ] **Language targets**: Add Python, Scratch JSON export in `code-generator.ts`
- [ ] **Persistence**: Save fridge state to `localStorage` in the Zustand store
- [ ] **Share**: Serialize magnet state to URL params for sharing programs
- [ ] **More magnet types**: Functions, arrays, strings, math, DOM manipulation
- [ ] **Execution sandbox**: Replace `new Function()` with an iframe or web worker
- [ ] **Magnet animations**: Spring physics on placement via Framer Motion
- [ ] **Fridge decorations**: Non-code magnets (alphabet letters, emoji stickers)

## Design System

See `src/app/globals.css` for all CSS custom properties (`--*`).
Category colors are defined in `src/lib/magnet-catalog.ts` → `CATEGORY_COLORS`.

| Category  | Color  | Purpose               |
|-----------|--------|-----------------------|
| output    | green  | print, return         |
| variable  | blue   | set, update           |
| control   | orange | if, loop, else        |
| operator  | purple | math, comparisons     |
| decorator | yellow | comments, notes       |
