'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export default function DashboardHeader({ user }: { user?: any }) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <header className="border-b border-border bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">FlowLedger</h1>
          <p className="text-sm text-muted-foreground">Personal Finance Manager</p>
        </div>

        <div className="flex items-center gap-4">
          {user && <p className="text-sm text-muted-foreground">{user.email}</p>}
          <Button onClick={handleLogout} variant="outline" size="sm" className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
