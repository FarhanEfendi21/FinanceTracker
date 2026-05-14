'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import DashboardHeader from '@/components/dashboard-header'
import { Button } from '@/components/ui/button'
import { LogOut, Mail, Calendar, Shield, KeyRound, Loader2, User } from 'lucide-react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import BoringAvatar from 'boring-avatars'

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase])

  const handlePasswordReset = async () => {
    if (!user?.email) return
    setPasswordLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    })
    if (!error) {
      toast.success('Password reset email sent! Please check your inbox.')
    } else {
      toast.error('Failed to send reset email. Please try again.')
    }
    setPasswordLoading(false)
  }

  const handleLogout = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    toast.success('You have been signed out.')
    router.push('/auth/login')
  }

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : '—'

  return (
    <div className="min-h-screen">
      <DashboardHeader user={user} />

      <main className="mx-auto max-w-2xl px-4 py-8 md:px-8 pb-24 lg:pb-8">
        <div className="mb-10 space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white">Settings</h2>
          <p className="text-sm font-medium text-muted-foreground">
            Manage your account preferences and security.
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Card */}
          <div className="rounded-[2.5rem] border border-black/5 dark:border-white/5 bg-white dark:bg-card p-8">
            <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-muted-foreground">Profile</h3>
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-full overflow-hidden border border-black/5 dark:border-white/5 shadow-lg shadow-black/10 dark:shadow-white/5">
                <BoringAvatar
                  size={64}
                  name={user?.email || 'user'}
                  variant="beam"
                  colors={['#FFAD08', '#EDD75A', '#73B06F', '#0C8F8F', '#405059']}
                />
              </div>
              <div>
                <p className="text-lg font-bold text-black dark:text-white">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/5 dark:bg-white/5">
                  <Mail className="h-4 w-4 text-black/60 dark:text-white/60" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Email</p>
                  <p className="text-sm font-semibold text-black dark:text-white">{user?.email || '—'}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/5 dark:bg-white/5">
                  <Calendar className="h-4 w-4 text-black/60 dark:text-white/60" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Member Since</p>
                  <p className="text-sm font-semibold text-black dark:text-white">{memberSince}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/5 dark:bg-white/5">
                  <Shield className="h-4 w-4 text-black/60 dark:text-white/60" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Account Status</p>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <p className="text-sm font-semibold text-black dark:text-white">Active</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Card */}
          <div className="rounded-[2.5rem] border border-black/5 dark:border-white/5 bg-white dark:bg-card p-8">
            <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-muted-foreground">Security</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/5 dark:bg-white/5">
                  <KeyRound className="h-4 w-4 text-black/60 dark:text-white/60" />
                </div>
                <div>
                  <p className="text-sm font-bold text-black dark:text-white">Password</p>
                  <p className="text-xs text-muted-foreground">Send a reset link to your email</p>
                </div>
              </div>
              <Button
                onClick={handlePasswordReset}
                disabled={passwordLoading}
                variant="outline"
                className="h-10 rounded-xl border-black/5 dark:border-white/5 font-bold hover:bg-black/5 dark:hover:bg-white/5"
              >
                {passwordLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Reset Password'}
              </Button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="rounded-[2.5rem] border border-rose-100 dark:border-rose-900/30 bg-white dark:bg-card p-8">
            <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-rose-400">Danger Zone</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-950/30">
                  <LogOut className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-black dark:text-white">Sign Out</p>
                  <p className="text-xs text-muted-foreground">Log out of your account on this device</p>
                </div>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    disabled={loading}
                    className="h-10 rounded-xl border-rose-100 dark:border-rose-900/30 font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-700 dark:hover:text-rose-300"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign Out'}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-[2rem] border-black/5 dark:border-white/5 dark:bg-card">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-bold">Sign out of FlowLedger?</AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground">
                      You will be redirected to the login page. Your data will remain safely stored.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl border-black/5 dark:border-white/5">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleLogout}
                      className="rounded-xl bg-rose-600 text-white hover:bg-rose-700"
                    >
                      Sign Out
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
