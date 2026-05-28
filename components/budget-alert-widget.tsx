'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AlertTriangle, TrendingUp, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function BudgetAlertWidget() {
  const supabase = createClient()
  const now = new Date()
  const month = now.getMonth() + 1
  const year  = now.getFullYear()

  const [budgets, setBudgets]       = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [loaded, setLoaded]         = useState(false)

  useEffect(() => {
    const fetch = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const [b, t] = await Promise.all([
        supabase.from('budgets').select('*').eq('month', month).eq('year', year),
        supabase.from('transactions').select('category,amount,type').eq('type','expense')
          .gte('date', `${year}-${String(month).padStart(2,'0')}-01`)
          .lte('date', `${year}-${String(month).padStart(2,'0')}-31`),
      ])
      setBudgets(b.data || [])
      setTransactions(t.data || [])
      setLoaded(true)
    }
    fetch()
  }, [supabase, month, year])

  const alerts = useMemo(() => {
    const spending: Record<string, number> = {}
    transactions.forEach(tx => { spending[tx.category] = (spending[tx.category] || 0) + parseFloat(tx.amount) })
    return budgets
      .map(b => ({
        ...b,
        spent: spending[b.category] || 0,
        pct: ((spending[b.category] || 0) / parseFloat(b.amount_limit)) * 100,
      }))
      .filter(b => b.pct >= 70)
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 3)
  }, [budgets, transactions])

  if (!loaded || alerts.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[2rem] border border-amber-200/60 dark:border-amber-800/30 bg-amber-50/60 dark:bg-amber-950/20 p-6"
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <span className="text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">
            Budget Alerts
          </span>
        </div>
        <Link
          href="/dashboard/budget"
          className="flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-400 hover:underline"
        >
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Alert rows */}
      <div className="space-y-3">
        {alerts.map(alert => (
          <div key={alert.id} className="flex items-center gap-4">
            {/* Bar */}
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-black dark:text-white">{alert.category}</span>
                <span className={cn(
                  'text-[11px] font-sans font-bold tabular-nums',
                  alert.pct >= 100 ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'
                )}>
                  {alert.pct >= 100 ? 'Over!' : `${alert.pct.toFixed(0)}%`}
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                <motion.div
                  className={cn('h-full rounded-full', alert.pct >= 100 ? 'bg-rose-500' : 'bg-amber-400')}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(alert.pct, 100)}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground font-sans">
                IDR {alert.spent.toLocaleString('id-ID')} / IDR {parseFloat(alert.amount_limit).toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
