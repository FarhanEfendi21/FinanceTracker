'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from './logo'
import { 
  LayoutDashboard, 
  PieChart, 
  Tag,
  Settings,
  History
} from 'lucide-react'
import { cn } from '@/lib/utils'
import BoringAvatar from 'boring-avatars'
import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'

const workspaceItems = [
  {
    label: 'Overview',
    href: '/dashboard',
    icon: LayoutDashboard
  },
  {
    label: 'Transactions',
    href: '/dashboard/transactions',
    icon: History
  },
  {
    label: 'Analytics',
    href: '/dashboard/analytics',
    icon: PieChart
  },
  {
    label: 'Categories',
    href: '/dashboard/categories',
    icon: Tag
  }
]

const preferenceItems = [
  {
    label: 'Settings',
    href: '/dashboard/settings',
    icon: Settings
  }
]

export default function Sidebar() {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase])

  const renderNavList = (items: typeof workspaceItems) => {
    return items.map((item) => {
      const isActive = pathname === item.href
      return (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13.5px] font-medium transition-all duration-200",
            isActive 
              ? "bg-blue-600/8 text-blue-600 dark:bg-blue-500/12 dark:text-blue-400 font-semibold" 
              : "text-muted-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:text-black dark:hover:text-white"
          )}
        >
          <item.icon className={cn(
            "h-[18px] w-[18px] stroke-[1.75] transition-transform duration-200 group-hover:scale-102",
            isActive 
              ? "text-blue-600 dark:text-blue-400" 
              : "text-muted-foreground group-hover:text-black dark:group-hover:text-white"
          )} />
          {item.label}
        </Link>
      )
    })
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r border-zinc-200/50 dark:border-zinc-800/40 bg-zinc-50/80 dark:bg-zinc-950/70 backdrop-blur-xl py-6 px-4 lg:flex transition-all duration-500">
        {/* Branding header */}
        <div className="mb-6 flex items-center gap-2.5 px-3">
          <Logo iconSize={32} showBg={false} className="text-black dark:text-white" />
          <div className="flex flex-col">
            <span className="text-[15px] font-bold tracking-tight text-black dark:text-white leading-none">
              FlowLedger
            </span>
            <span className="text-[9.5px] font-medium text-muted-foreground/80 tracking-wide mt-0.5 uppercase leading-none">
              Personal Ledger
            </span>
          </div>
        </div>

        <div className="flex-1 space-y-6">
          {/* Workspace Section */}
          <div>
            <div className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 tracking-wider uppercase px-3.5 mb-2.5 mt-2">
              Workspace
            </div>
            <nav className="space-y-1">
              {renderNavList(workspaceItems)}
            </nav>
          </div>

          {/* Preferences Section */}
          <div>
            <div className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 tracking-wider uppercase px-3.5 mb-2.5 mt-2">
              Preferences
            </div>
            <nav className="space-y-1">
              {renderNavList(preferenceItems)}
            </nav>
          </div>
        </div>

        {/* User Profile Section at Bottom */}
        {user && (
          <div className="mt-auto">
            <div className="my-4 h-px bg-zinc-200/50 dark:bg-zinc-800/50" />
            <Link 
              href="/dashboard/settings"
              className="flex items-center gap-3 rounded-xl p-2.5 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-all duration-200 group"
            >
              <div className="h-8 w-8 overflow-hidden rounded-full border border-black/5 dark:border-white/5 transition-transform duration-200 group-hover:scale-105 shrink-0">
                <BoringAvatar
                  size={32}
                  name={user.email || 'user'}
                  variant="beam"
                  colors={['#FFAD08', '#EDD75A', '#73B06F', '#0C8F8F', '#405059']}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-black dark:text-white truncate leading-snug">
                  {user.user_metadata?.full_name || user.email?.split('@')[0]}
                </p>
                <p className="text-[10.5px] font-normal text-muted-foreground truncate opacity-70 group-hover:opacity-100 transition-opacity leading-none mt-0.5">
                  {user.email}
                </p>
              </div>
            </Link>
          </div>
        )}
      </aside>
    </>
  )
}
