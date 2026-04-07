'use client'
// ─────────────────────────────────────────────────────────────────────────────
// digifridge · components/tray/MagnetTray.tsx
// Slide-up drawer with all available magnet types, filterable by category.
// ─────────────────────────────────────────────────────────────────────────────

import { AnimatePresence, motion } from 'framer-motion'
import { useFridgeStore } from '@/store/fridge'
import {
  MAGNET_CATALOG,
  CATEGORY_ORDER,
  CATEGORY_LABELS,
  CATEGORY_ACCENT,
  getCatalogByCategory,
} from '@/lib/magnet-catalog'
import { TrayMagnet } from '@/components/magnets/Magnet'
import { MagnetCategory } from '@/types'

type FilterCat = MagnetCategory | 'all'

export function MagnetTray() {
  const { ui, setTrayOpen, setActiveCategory } = useFridgeStore()
  const { trayOpen, activeCategory } = ui

  const byCategory = getCatalogByCategory()
  const visibleMagnets =
    activeCategory === 'all'
      ? MAGNET_CATALOG
      : (byCategory[activeCategory as MagnetCategory] ?? [])

  return (
    <div className="relative" style={{ zIndex: 100 }}>
      {/* Toggle tab */}
      <div className="flex justify-center" style={{ background: '#b8bdc3' }}>
        <button
          onClick={() => setTrayOpen(!trayOpen)}
          className="flex items-center gap-2 px-5 py-2 transition-all"
          style={{
            background: 'var(--tray-bg)',
            border: '0.5px solid var(--tray-border)',
            borderBottom: 'none',
            borderRadius: '8px 8px 0 0',
            color: '#6b7280',
            fontFamily: 'var(--font-display)',
            fontSize: 10,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          <span>magnets</span>
          <motion.span
            animate={{ rotate: trayOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            style={{ display: 'inline-block', lineHeight: 1, fontSize: 9 }}
          >
            ▲
          </motion.span>
        </button>
      </div>

      {/* Tray panel */}
      <AnimatePresence>
        {trayOpen && (
          <motion.div
            className="tray"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'var(--tray-height)', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 36 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="flex flex-col h-full">
              {/* Category filter tabs */}
              <div
                className="flex items-center gap-1 px-3 py-2 overflow-x-auto shrink-0"
                style={{ borderBottom: '0.5px solid var(--tray-border)' }}
              >
                {/* "All" tab */}
                <CategoryTab
                  label="all"
                  accent="#64748b"
                  active={activeCategory === 'all'}
                  onClick={() => setActiveCategory('all')}
                />
                {CATEGORY_ORDER.map((cat) => (
                  <CategoryTab
                    key={cat}
                    label={CATEGORY_LABELS[cat]}
                    accent={CATEGORY_ACCENT[cat]}
                    active={activeCategory === cat}
                    onClick={() => setActiveCategory(cat)}
                  />
                ))}
              </div>

              {/* Magnet tiles */}
              <div
                className="flex flex-wrap gap-2 p-3 overflow-y-auto flex-1 content-start"
                style={{ scrollbarWidth: 'thin' }}
              >
                {visibleMagnets.map((def) => (
                  <TrayMagnet key={def.id} definition={def} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function CategoryTab({
  label, accent, active, onClick,
}: {
  label: string
  accent: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1 rounded text-xs whitespace-nowrap transition-all"
      style={{
        fontFamily: 'var(--font-mono)',
        background: active ? accent : 'transparent',
        color: active ? '#fff' : '#64748b',
        border: `0.5px solid ${active ? accent : 'transparent'}`,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      }}
    >
      {label}
    </button>
  )
}
