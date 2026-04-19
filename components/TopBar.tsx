'use client'

import Link from 'next/link'

interface TopBarProps {
  title?: string
  showBack?: boolean
  backHref?: string
  rightContent?: React.ReactNode
}

export default function TopBar({ title = 'Health Sanctuary', showBack, backHref = '/', rightContent }: TopBarProps) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/30">
      <div className="flex items-center gap-3">
        {showBack && (
          <Link href={backHref} className="p-2 -ml-2 rounded-full hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-on-surface">arrow_back</span>
          </Link>
        )}
        <span className="text-xl font-extrabold tracking-tighter text-on-surface">{title}</span>
      </div>
      <div className="flex items-center gap-3">
        {rightContent || (
          <>
            <button className="p-2 rounded-full bg-surface-container hover:bg-surface-variant transition-colors">
              <span className="material-symbols-outlined text-on-surface text-xl">notifications</span>
            </button>
            <Link href="/profile">
              <div className="w-9 h-9 rounded-full overflow-hidden bg-surface-container-high border-2 border-primary/20">
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-sm">person</span>
                </div>
              </div>
            </Link>
          </>
        )}
      </div>
    </header>
  )
}
