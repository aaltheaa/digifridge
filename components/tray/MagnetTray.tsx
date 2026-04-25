'use client'

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

export function MagnetTray() {
  const { ui, setActiveCategory } = useFridgeStore()
  const { activeCategory } = ui

  const byCategory = getCatalogByCategory()
  const visibleMagnets =
    activeCategory === 'all'
      ? MAGNET_CATALOG
      : (byCategory[activeCategory as MagnetCategory] ?? [])

  return (
    <div
      className="tray flex flex-col shrink-0"
      style={{
        width: 'var(--tray-width)',
        borderRight: '0.5px solid var(--tray-border)',
        zIndex: 100,
      }}
    >
      {/* Category filter tabs */}
      <div
        className="flex flex-wrap gap-1 px-2 py-2 shrink-0"
        style={{ borderBottom: '0.5px solid var(--tray-border)' }}
      >
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
        className="flex flex-wrap gap-2 p-2 overflow-y-auto flex-1 content-start"
        style={{ scrollbarWidth: 'thin' }}
      >
        {visibleMagnets.map((def) => (
          <TrayMagnet key={def.id} definition={def} />
        ))}
      </div>
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
      className="px-2 py-0.5 rounded text-xs whitespace-nowrap transition-all"
      style={{
        fontFamily: 'var(--font-mono)',
        background: active ? accent : 'transparent',
        color: active ? '#fff' : '#64748b',
        border: `0.5px solid ${active ? accent : 'transparent'}`,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        fontSize: 9,
      }}
    >
      {label}
    </button>
  )
}
