# digifridge

> A digital fridge where coding blocks are word magnets — drag them onto the steel surface, arrange top-to-bottom, and watch your program come to life.

The interface is a three-panel layout inspired by Scratch: the **magnet drawer** lives permanently on the left, the **fridge canvas** fills the center, and the **code output panel** sits always-visible on the right.

Built with Next.js 14, Zustand, dnd-kit, and Framer Motion.

---

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## What It Is

digifridge is a visual programming toy inspired by fridge poetry magnets. Instead of words, each magnet is a **code statement** — a variable assignment, a loop, a print call. You arrange them on a stainless steel fridge surface in reading order (top to bottom), and the app generates executable JavaScript from their positions in real time.

It's designed for learning the shape of programs: what a loop looks like, how conditionals nest, what it means to call a function. The physical metaphor — sticking things on a fridge, rearranging them — keeps it tactile and approachable.

**What you can build:** simple sequential programs — FizzBuzz, count to ten, basic calculators, number guessing games. Anything that fits in a screen of readable code and uses print() for output.

**What it's not:** a full IDE. There are no arrays, no imports, no external libraries, no graphics output. That's by design — the constraint is the point.

---

## How It Works

### The Fridge Surface

The main canvas is a droppable stainless steel surface with a subtle vertical guide line on the left. Magnets are positioned absolutely using x/y coordinates. The guide line is a visual hint that top-to-bottom ordering determines execution order — not left-to-right, not proximity.

When you drag a magnet from the tray and drop it on the fridge, it lands exactly where you release it (using the drag ghost's final translated bounding rect for precision). You can drag placed magnets around to reorder your program.

### The Tray

The magnet tray is a permanent sidebar on the left side of the fridge. Magnets are organized by category with colored filter tabs at the top:

| Category | Color | Magnets |
|---|---|---|
| events | purple | `start` |
| output | green | `print` |
| variables | blue | `set`, `change` |
| control | orange | `repeat`, `while`, `if`, `else`, `end` |
| functions | pink | `define`, `call`, `return` |
| operators | purple | `and`, `or`, `not` |
| other | slate | `ask`, `//` |

Drag any magnet from the tray directly onto the fridge canvas. The tray scrolls vertically when the list is long.

### Slots

Most magnets have **editable slots** — inline `contentEditable` fields embedded in the tile. Click a slot to type into it. Slots grow horizontally up to the magnet's max width, then wrap vertically. The separator label between slots (like `=`, `to`, `→`, `&&`) is part of the magnet definition, not a slot.

Examples:
- `set` has two slots: variable name and value, separated by `=`
- `change` has two slots separated by `to`
- `if` has one slot for the condition

### Code Generation

Every time you place, move, remove, or edit a magnet, the code generator runs automatically. It:

1. Sorts all placed magnets by Y position (top = first line)
2. Fills each magnet's `codeTemplate` with current slot values (or placeholder text if a slot is empty)
3. Tracks indentation by counting opening `{` and closing `}` braces
4. Validates brace balance and reports unclosed blocks as errors

The generated code is JavaScript-like, using `print()` as the output function (mapped to `console.log` at execution time). Control structures use standard JS syntax (`for`, `while`, `if/else`, `function`).

### The Code Panel

The code panel is a permanent sidebar on the right side of the fridge, always showing the generated code as you work — no toggle needed. Syntax highlighting:

- Keywords (`for`, `while`, `if`, `let`, etc.) in pink
- `print()` calls in green
- Comments in dark gray, italic
- Everything else in light slate

If there are unclosed blocks, a red warning appears below the code and the **run** button is disabled.

### Running Code

When the code is valid, click **▶ run** in the code panel header. The code executes in a sandboxed `new Function()` context with a custom `print()` function that captures output. The run button is disabled if there are validation errors.

### Output Magnets

After a successful run, each line of `print()` output appears on the fridge as a **receipt-style sticker** — a mint-green label with a dashed perforation line at the top and monospace text, visually distinct from the handwritten-style code magnets.

Output magnets disappear instantly the moment you touch anything — move a magnet, edit a slot, add or remove a block. They reappear only after the next successful run. This gives you immediate feedback that your program state has changed and needs to be re-run.

---

## Magnet Reference

| Magnet | Slots | Generated Code |
|---|---|---|
| `start` | — | `// ── program start ──` |
| `print` | value | `print(value)` |
| `set` | name `=` value | `let name = value` |
| `change` | name `to` value | `name = value` |
| `repeat` | n | `for (let i = 0; i < n; i++) {` |
| `while` | condition | `while (condition) {` |
| `if` | condition | `if (condition) {` |
| `else` | — | `} else {` |
| `end` | — | `}` |
| `define` | name `(` args | `function name(args) {` |
| `call` | name `(` args | `name(args)` |
| `return` | value | `return value` |
| `and` | a `&&` b | `a && b` |
| `or` | a `\|\|` b | `a \|\| b` |
| `not` | value | `!(value)` |
| `ask` | name `→` question | `let name = prompt(question)` |
| `//` | text | `// text` |

**Tip:** Block magnets (`repeat`, `while`, `if`, `define`) must be closed with an `end` magnet. The `else` magnet goes between an `if` block and its `end`.

---

## Example Programs

**Count to 5:**
```
set  i = 1
repeat  5
  print  i
  change  i to i + 1
end
```

**FizzBuzz (simplified):**
```
set  i = 1
repeat  15
  if  i % 3 === 0
    print  "Fizz"
  else
  end  ← closes the if
  change  i to i + 1
end
```

**Simple function:**
```
define  greet ( name
  print  "Hello, " + name
end
call  greet ( "world"
```

---

## Project Structure

```
digifridge/
├── app/
│   ├── globals.css           # Design tokens, magnet styles, layout
│   ├── layout.tsx            # Root layout and metadata
│   └── page.tsx              # DnD context, fridge shell, drag handlers
├── components/
│   ├── fridge/
│   │   └── FridgeCanvas.tsx  # Droppable steel surface, renders all magnets
│   ├── magnets/
│   │   ├── Magnet.tsx        # TrayMagnet + PlacedMagnetBlock + SlotField
│   │   └── OutputMagnet.tsx  # Receipt-style output stickers
│   ├── output/
│   │   └── CodePanel.tsx     # Code display, run button, output section
│   └── tray/
│       └── MagnetTray.tsx    # Permanent left sidebar with category filter tabs
├── lib/
│   ├── code-generator.ts     # generateCode() + executeCode()
│   └── magnet-catalog.ts     # All magnet definitions, category helpers
├── store/
│   └── fridge.ts             # Zustand store: magnets, UI, output state
└── types/
    └── index.ts              # TypeScript interfaces for everything
```

---

## Adding a New Magnet

Open `lib/magnet-catalog.ts` and add an entry to `MAGNET_CATALOG`:

```ts
{
  id: 'log',
  label: 'log',
  category: 'output',
  description: 'Log a labeled value',
  slots: [
    { id: 'label', sep: '',   placeholder: '"x"' },
    { id: 'val',   sep: '→', placeholder: 'x' },
  ],
  codeTemplate: 'print({{label}} + ": " + {{val}})',
}
```

- `id` — unique identifier, used as the React key and for code generation
- `label` — text displayed on the magnet tile
- `category` — which tray tab it appears under
- `slots` — array of editable fields; `sep` is the separator text rendered before each slot
- `codeTemplate` — JavaScript template with `{{slotId}}` placeholders
- `description` — tooltip shown in the tray

For block-opening magnets (loops, conditionals), end `codeTemplate` with `{`. For block-closing, use `}` or `} else {`.

---

## State Architecture

All app state lives in a single Zustand store (`store/fridge.ts`):

```
FridgeStore
├── magnets: PlacedMagnet[]        — code magnets on the canvas
├── outputMagnets: OutputMagnet[]  — receipt stickers from last run (cleared on any mutation)
├── generatedCode: GeneratedCode   — auto-updated on every canvas change
└── ui: UIState                    — active category filter, selected magnet
```

`runCodeGeneration()` is called automatically by every magnet mutation (place, move, remove, edit slot). `setOutputMagnets()` is called explicitly from the run button in CodePanel.

---

## Design Tokens

All visual constants live in `app/globals.css` as CSS custom properties:

| Token | Value | Used for |
|---|---|---|
| `--magnet-bg` | `#f7f5ef` | Warm cream — code magnet background |
| `--font-magnet` | Special Elite | Handwritten serif — magnet labels |
| `--font-mono` | DM Mono | Code panel, output magnets, tray tabs |
| `--font-display` | Syne | UI labels, brand text |
| `--tray-width` | 210px | Width of the left magnet tray sidebar |
| `--panel-width` | 290px | Width of the right code panel sidebar |
| `--bg-kitchen` | `#1a1c20` | Dark background behind the fridge |

---

## Tech Stack

| Package | Role |
|---|---|
| Next.js 14 (App Router) | Framework |
| React 18 | UI |
| Zustand | Global state |
| dnd-kit | Drag and drop |
| Framer Motion | Tray + panel animations |
| Tailwind CSS | Utility classes |
| TypeScript | Type safety |
