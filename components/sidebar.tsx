'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Logo from './logo'
import { 
  LayoutDashboard, 
  PieChart, 
  Tag,
  Settings,
  History,
  LogOut,
  Wallet2,
  Target
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
    label: 'Budget',
    href: '/dashboard/budget',
    icon: Wallet2
  },
  {
    label: 'Goals',
    href: '/dashboard/goals',
    icon: Target
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
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const renderNavList = (items: typeof workspaceItems) => {
    return items.map((item) => {
      const isActive = pathname === item.href
      return (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "group relative flex items-center gap-3 rounded-2xl px-4 py-3 text-[13.5px] font-medium transition-all duration-300 ease-out border border-transparent",
            isActive 
              ? "bg-white dark:bg-zinc-900/80 text-black dark:text-white border-zinc-200/60 dark:border-zinc-800/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.3)] font-semibold scale-[1.02]" 
              : "text-muted-foreground hover:bg-zinc-200/30 dark:hover:bg-zinc-800/30 hover:text-black dark:hover:text-white"
          )}
        >
          <item.icon className={cn(
            "h-[18px] w-[18px] stroke-[1.75] transition-all duration-300 group-hover:scale-110",
            isActive 
              ? "text-blue-500 dark:text-blue-400" 
              : "text-muted-foreground group-hover:text-black dark:group-hover:text-white"
          )} />
          {item.label}
          {isActive && (
            <span className="absolute right-4 h-1.5 w-1.5 rounded-full bg-blue-500 dark:bg-blue-400 animate-pulse" />
          )}
        </Link>
      )
    })
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed left-4 top-4 bottom-4 hidden w-60 flex-col border border-zinc-200/40 dark:border-zinc-800/40 bg-zinc-50/70 dark:bg-zinc-950/60 backdrop-blur-2xl py-6 px-4 lg:flex rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.04)] transition-all duration-300 z-30 overflow-hidden">
        {/* Dark mode ambient glow — top radial */}
        <div className="pointer-events-none absolute inset-0 rounded-[24px] opacity-0 dark:opacity-100 transition-opacity duration-500"
          style={{ background: 'radial-gradient(ellipse 120% 40% at 50% -5%, rgba(59,130,246,0.07) 0%, transparent 70%)' }}
        />
        {/* Light mode subtle top highlight */}
        <div className="pointer-events-none absolute inset-0 rounded-[24px] opacity-100 dark:opacity-0 transition-opacity duration-500"
          style={{ background: 'radial-gradient(ellipse 120% 30% at 50% 0%, rgba(255,255,255,0.8) 0%, transparent 60%)' }}
        />
        {/* Branding header */}
        <div className="mb-8 flex items-center gap-3 px-3">
          <div className="relative group/logo">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-lg opacity-0 group-hover/logo:opacity-30 transition-opacity duration-500" />
            <Logo iconSize={34} showBg={false} className="relative text-black dark:text-white transition-transform duration-500 ease-out group-hover/logo:rotate-6 group-hover/logo:scale-105" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-[16px] font-extrabold tracking-tight text-black dark:text-white leading-none">
              FlowLedger
            </span>
            <span className="text-[9.5px] font-semibold text-muted-foreground/60 tracking-wider mt-1.5 uppercase leading-none">
              Personal Ledger
            </span>
          </div>
        </div>

        <div className="flex-1 space-y-6">
          {/* Workspace Section */}
          <div>
            <div className="text-[11px] font-medium text-zinc-400/70 dark:text-zinc-500/70 tracking-wider uppercase px-4 mb-2">
              Workspace
            </div>
            <nav className="space-y-1">
              {renderNavList(workspaceItems)}
            </nav>
          </div>

          {/* Preferences Section */}
          <div>
            <div className="text-[11px] font-medium text-zinc-400/70 dark:text-zinc-500/70 tracking-wider uppercase px-4 mb-2">
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
            <div className="group relative flex items-center gap-3 rounded-2xl border border-zinc-200/40 dark:border-zinc-800/40 bg-zinc-100/30 dark:bg-zinc-900/20 p-3 hover:border-zinc-300 dark:hover:border-zinc-700/60 transition-all duration-300">
              <Link 
                href="/dashboard/settings"
                className="flex items-center gap-3 flex-1 min-w-0"
              >
                <div className="h-9 w-9 overflow-hidden rounded-full border border-black/5 dark:border-white/5 transition-transform duration-300 group-hover:scale-105 shrink-0">
                  <BoringAvatar
                    size={36}
                    name={user.email || 'user'}
                    variant="beam"
                    colors={['#FFAD08', '#EDD75A', '#73B06F', '#0C8F8F', '#405059']}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-black dark:text-white truncate leading-none">
                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </p>
                  <p className="text-[10px] font-medium text-muted-foreground truncate leading-none mt-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                    {user.email}
                  </p>
                </div>
              </Link>
              <button 
                onClick={handleLogout}
                className="p-2 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200 shrink-0 cursor-pointer hover:scale-105 active:scale-95"
                title="Log out"
              >
                <LogOut className="h-4 w-4 stroke-[1.8]" />
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}
