'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { createClient } from '@/lib/supabase/client'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const supabase = createClient()

  React.useEffect(() => {
    setMounted(true)
    
    // Sync from DB on mount
    const syncThemeFromDB = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('user_settings').select('theme').eq('user_id', user.id).single()
        if (data && data.theme) {
          setTheme(data.theme)
        }
      }
    }
    syncThemeFromDB()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleToggle = async () => {
    try {
      const newTheme = theme === 'dark' ? 'light' : 'dark'
      setTheme(newTheme)
      
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { error } = await supabase.from('user_settings').upsert({
          user_id: user.id,
          theme: newTheme,
        }, { onConflict: 'user_id' })
        
        if (error) {
          console.error('Supabase theme sync error:', error.message)
        }
      }
    } catch (error) {
      console.error('Theme toggle error:', error)
    }
  }

  if (!mounted) {
    return (
      <button className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5 text-muted-foreground transition-colors">
        <span className="sr-only">Toggle theme</span>
      </button>
    )
  }

  return (
    <button
      onClick={handleToggle}
      className="relative flex h-10 w-10 items-center justify-center rounded-full bg-black/5 text-foreground transition-colors hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20"
    >
      <Sun className="h-5 w-5 scale-100 transition-all duration-300 dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-5 w-5 scale-0 transition-all duration-300 dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
