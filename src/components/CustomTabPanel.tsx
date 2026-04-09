import React, { useState } from 'react'
import { Card, CardContent } from './ui/card'

export interface TabItem {
  label: string
  content: React.ReactNode
}

interface CustomTabPanelProps {
  tabs: TabItem[]
  title?: string
}

// ISSUE-054: Tab buttons only handle onClick — no onKeyDown is attached.
//
// The WAI-ARIA 1.1 "Tabs" pattern requires keyboard support:
//   ArrowRight / ArrowLeft  → move focus to next / previous tab
//   Home                    → move focus to first tab
//   End                     → move focus to last tab
//   Enter / Space           → activate the focused tab
//
// Without these handlers keyboard-only users can Tab into the tablist but
// cannot move between tabs at all — they are permanently stuck on whichever
// tab happens to receive focus first.
const CustomTabPanel = ({ tabs, title }: CustomTabPanelProps) => {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <Card>
      {title && (
        <div className="px-4 pt-4 pb-1 font-semibold text-sm">{title}</div>
      )}
      <CardContent className="pt-3">
        <div
          role="tablist"
          aria-label={title ?? 'Tabbed panel'}
          className="flex border-b mb-3"
        >
          {tabs.map((tab, i) => (
            <button
              key={i}
              role="tab"
              id={`ctab-${i}`}
              aria-selected={activeIndex === i}
              aria-controls={`ctabpanel-${i}`}
              tabIndex={activeIndex === i ? 0 : -1}
              onClick={() => setActiveIndex(i)}
              // BUG ISSUE-054: No onKeyDown handler.
              // ArrowLeft, ArrowRight, Home, End are all unhandled.
              // A keyboard user focused on this tablist cannot switch tabs.
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                activeIndex === i
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div
          role="tabpanel"
          id={`ctabpanel-${activeIndex}`}
          aria-labelledby={`ctab-${activeIndex}`}
          tabIndex={0}
        >
          {tabs[activeIndex]?.content}
        </div>
      </CardContent>
    </Card>
  )
}

export default CustomTabPanel
