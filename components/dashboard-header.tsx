'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LogOut, User, Settings } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

import { ThemeToggle } from '@/components/theme-toggle'
import { RealTimeClock } from '@/components/real-time-clock'
import BoringAvatar from 'boring-avatars'
import { StaggeredMenu } from '@/components/staggered-menu'
import Logo from './logo'

const navItems = [
  { label: 'Overview', href: '/dashboard' },
  { label: 'Transactions', href: '/dashboard/transactions' },
  { label: 'Analytics', href: '/dashboard/analytics' },
  { label: 'Categories', href: '/dashboard/categories' },
  { label: 'Settings', href: '/dashboard/settings' },
]

export default function DashboardHeader({ user }: { user?: any }) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 dark:border-white/5 bg-white/80 dark:bg-background/80 backdrop-blur-md transition-colors duration-500">
      <div className="flex items-center justify-between px-4 py-4 md:px-8">
        <div className="flex items-center gap-2.5 lg:hidden">
          <Logo iconSize={32} showBg={false} className="text-black dark:text-white" />
          <h1 className="text-base font-bold tracking-tight text-black dark:text-white">FlowLedger</h1>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <RealTimeClock />
          <ThemeToggle />
          {user && (
            <div className="lg:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:bg-black/5 dark:hover:bg-white/5 ring-offset-background transition-all active:scale-95">
                    <div className="h-10 w-10 overflow-hidden rounded-full border border-black/5 dark:border-white/5">
                      <BoringAvatar
                        size={40}
                        name={user.email || 'user'}
                        variant="beam"
                        colors={['#FFAD08', '#EDD75A', '#73B06F', '#0C8F8F', '#405059']}
                      />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 rounded-2xl p-2 dark:bg-popover dark:border-white/5" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-black dark:text-white">My Account</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-black/5 dark:bg-white/5" />
                  <DropdownMenuItem asChild className="rounded-xl focus:bg-black/5 dark:focus:bg-white/5 cursor-pointer">
                    <Link href="/dashboard/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-black/5 dark:bg-white/5" />
                  <DropdownMenuItem 
                    className="rounded-xl text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/30 focus:text-red-600 dark:focus:text-red-400 cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          <div className="lg:hidden">
            <StaggeredMenu
              position="right"
              isFixed={true}
              items={navItems.map(item => ({
                label: item.label,
                ariaLabel: `Go to ${item.label}`,
                link: item.href
              }))}
              displaySocials={false}
              displayItemNumbering={true}
              colors={['rgba(255, 255, 255, 0.05)', '#0f172a', '#020617']}
              accentColor="#3b82f6"
            />
          </div>
        </div>
      </div>
    </header>
  )
}

