'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', label: 'Dashboard', icon: 'dashboard' },
  { href: '/timeline', label: 'Timeline', icon: 'history_edu' },
  { href: '/add', label: 'Add', icon: 'add_circle', isCta: true },
  { href: '/reports', label: 'Reports', icon: 'folder_open' },
  { href: '/meds', label: 'Meds', icon: 'alarm' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white/95 backdrop-blur-xl border-t border-outline-variant/30"
      style={{ boxShadow: '0 -8px 30px rgba(0,0,0,0.08)' }}>
      {navItems.map(({ href, label, icon, isCta }) => {
        const isActive = pathname === href
        if (isCta) {
          return (
            <Link key={href} href={href}
              className="flex flex-col items-center justify-center -mt-6 transition-transform active:scale-95">
              <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg text-white"
                style={{ background: 'linear-gradient(135deg, #00458f, #005cbb)' }}>
                <span className="material-symbols-outlined material-symbols-filled text-2xl">{icon}</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary mt-1">{label}</span>
            </Link>
          )
        }
        return (
          <Link key={href} href={href}
            className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-xl transition-all duration-200 ${
              isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
            }`}>
            {isActive ? (
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-0.5">
                <span className="material-symbols-outlined material-symbols-filled text-xl">{icon}</span>
              </div>
            ) : (
              <span className="material-symbols-outlined text-xl mb-0.5">{icon}</span>
            )}
            <span className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? 'text-primary' : ''}`}>
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
