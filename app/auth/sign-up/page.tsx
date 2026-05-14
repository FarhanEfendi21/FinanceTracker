'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Wallet, ArrowRight, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function Page() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: fullName,
          },
        },
      })
      if (error) throw error
      
      toast.success('Account created successfully! Please sign in.')
      router.push('/auth/login')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#F9F9F9] dark:bg-black p-6 md:p-10 transition-colors duration-500">
      <div className="w-full max-w-[400px] space-y-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black dark:bg-white text-white dark:text-black shadow-lg shadow-black/10 dark:shadow-white/5">
            <Wallet className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white">FlowLedger</h1>
          <p className="text-sm text-muted-foreground">
            Create an account to start tracking your finances.
          </p>
        </div>

        <div className="rounded-[2.5rem] border border-black/5 dark:border-white/5 bg-white dark:bg-card p-8 shadow-sm">
          <form onSubmit={handleSignUp} className="space-y-6">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="fullName" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  required
                  className="h-12 rounded-xl border-black/10 dark:border-white/10 bg-white dark:bg-black px-4 transition-all focus:border-black dark:focus:border-white focus:ring-0 text-black dark:text-white"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  className="h-12 rounded-xl border-black/10 dark:border-white/10 bg-white dark:bg-black px-4 transition-all focus:border-black dark:focus:border-white focus:ring-0 text-black dark:text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  className="h-12 rounded-xl border-black/10 dark:border-white/10 bg-white dark:bg-black px-4 transition-all focus:border-black dark:focus:border-white focus:ring-0 text-black dark:text-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="repeat-password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Confirm Password
                </Label>
                <Input
                  id="repeat-password"
                  type="password"
                  required
                  className="h-12 rounded-xl border-black/10 dark:border-white/10 bg-white dark:bg-black px-4 transition-all focus:border-black dark:focus:border-white focus:ring-0 text-black dark:text-white"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 dark:bg-red-950/20 p-3 text-center text-sm font-medium text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="group h-12 w-full rounded-xl bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90" 
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <span className="flex items-center justify-center gap-2 font-semibold">
                  Get Started <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link
              href="/auth/login"
              className="font-semibold text-black dark:text-white hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
        
        <p className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} FlowLedger. All rights reserved.
        </p>
      </div>
    </div>
  )
}

