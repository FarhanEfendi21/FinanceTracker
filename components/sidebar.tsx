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

const navItems = [
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
  },
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

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r border-black/5 dark:border-white/5 bg-white dark:bg-card p-6 lg:flex transition-colors duration-500">
        <div className="mb-10 flex items-center gap-3 px-2">
          <Logo iconSize={40} showBg={true} className="rounded-xl shadow-black/20 dark:shadow-white/5" />
          <span className="text-xl font-bold tracking-tight text-black dark:text-white">FlowLedger</span>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-all",
                  isActive 
                    ? "bg-black dark:bg-white text-white dark:text-black shadow-lg shadow-black/10 dark:shadow-white/5" 
                    : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User Profile Section at Bottom */}
        {user && (
          <div className="mt-auto pt-6">
            <Link 
              href="/dashboard/settings"
              className="flex items-center gap-3 rounded-[2rem] p-4 bg-black/[0.03] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 hover:bg-black/[0.06] dark:hover:bg-white/[0.06] transition-all group"
            >
              <div className="h-10 w-10 overflow-hidden rounded-full border border-black/5 dark:border-white/5 transition-transform group-hover:scale-105">
                <BoringAvatar
                  size={40}
                  name={user.email || 'user'}
                  variant="beam"
                  colors={['#FFAD08', '#EDD75A', '#73B06F', '#0C8F8F', '#405059']}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-black dark:text-white truncate">
                  {user.user_metadata?.full_name || user.email?.split('@')[0]}
                </p>
                <p className="text-[10px] font-medium text-muted-foreground truncate opacity-70 group-hover:opacity-100 transition-opacity">
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
