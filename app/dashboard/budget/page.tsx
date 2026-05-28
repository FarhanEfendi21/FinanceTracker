'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import DashboardHeader from '@/components/dashboard-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Pencil, Trash2, ChevronLeft, ChevronRight,
  Wallet2, TrendingUp, AlertTriangle, CheckCircle2,
  Tag, Utensils, Car, Zap, Film, Heart, ShoppingBag,
  Briefcase, Coins, Gift, Wallet,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

// ── Icon map ────────────────────────────────────────────────────
const iconMap: Record<string, any> = {
  Utensils, Car, Zap, Film, Heart, ShoppingBag,
  Briefcase, Coins, Gift, Wallet, Tag,
}

// ── Month helpers ────────────────────────────────────────────────
const MONTH_NAMES = [
  'Januari','Februari','Maret','April','Mei','Juni',
  'Juli','Agustus','September','Oktober','November','Desember'
]

function getProgressColor(pct: number) {
  if (pct >= 100) return { bar: 'bg-rose-500', text: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/30' }
  if (pct >= 70)  return { bar: 'bg-amber-400', text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/30' }
  return { bar: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30' }
}

// ── Add/Edit Modal ───────────────────────────────────────────────
function BudgetModal({
  open, onClose, onSave, categories, editing, month, year
}: {
  open: boolean
  onClose: () => void
  onSave: (data: { category: string; amount_limit: number }) => Promise<void>
  categories: any[]
  editing: any | null
  month: number
  year: number
}) {
  const [category, setCategory] = useState(editing?.category || '')
  const [limit, setLimit]       = useState(editing ? String(editing.amount_limit) : '')
  const [saving, setSaving]     = useState(false)

  useEffect(() => {
    setCategory(editing?.category || '')
    setLimit(editing ? String(editing.amount_limit) : '')
  }, [editing, open])

  const handleSave = async () => {
    if (!category || !limit || isNaN(Number(limit))) return
    setSaving(true)
    await onSave({ category, amount_limit: parseFloat(limit) })
    setSaving(false)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px] rounded-[2.5rem] border-black/5 dark:border-white/5 p-8 dark:bg-card">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-xl font-bold">
            {editing ? 'Edit Budget' : 'Set Budget'}
          </DialogTitle>
          <p className="text-xs font-medium text-muted-foreground mt-1">
            {MONTH_NAMES[month - 1]} {year}
          </p>
        </DialogHeader>

        <div className="space-y-5">
          {/* Category */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Category</label>
            <Select value={category} onValueChange={setCategory} disabled={!!editing}>
              <SelectTrigger className="h-12 rounded-2xl border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02]">
                <SelectValue placeholder="Select expense category" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-black/5 dark:border-white/5 p-2 dark:bg-card">
                {categories.map(cat => {
                  const Icon = iconMap[cat.icon] || Tag
                  return (
                    <SelectItem key={cat.name} value={cat.name} className="rounded-xl focus:bg-black/5 dark:focus:bg-white/5">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span>{cat.name}</span>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Limit amount */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Monthly Limit</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">IDR</span>
              <Input
                type="number"
                min="1"
                placeholder="0"
                className="h-12 rounded-2xl border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] pl-12 font-bold font-sans tabular-nums focus-visible:ring-0"
                value={limit}
                onChange={e => setLimit(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSave()}
              />
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={saving || !category || !limit}
            className="h-12 w-full rounded-2xl bg-black dark:bg-white text-xs font-bold uppercase tracking-[0.2em] text-white dark:text-black shadow-xl shadow-black/10 dark:shadow-white/5 disabled:opacity-40"
          >
            {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Budget'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ── Main page ────────────────────────────────────────────────────
export default function BudgetPage() {
  const supabase = createClient()
  const now = new Date()

  const [user, setUser]               = useState<any>(null)
  const [budgets, setBudgets]         = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [categories, setCategories]   = useState<any[]>([])
  const [loading, setLoading]         = useState(true)
  const [month, setMonth]             = useState(now.getMonth() + 1)
  const [year, setYear]               = useState(now.getFullYear())
  const [modalOpen, setModalOpen]     = useState(false)
  const [editing, setEditing]         = useState<any>(null)

  // Fetch user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [supabase])

  // Fetch data
  useEffect(() => {
    if (!user) return
    const fetch = async () => {
      setLoading(true)
      const [budgetsRes, txRes, catRes] = await Promise.all([
        supabase.from('budgets').select('*').eq('month', month).eq('year', year).order('category'),
        supabase.from('transactions').select('*').eq('type', 'expense')
          .gte('date', `${year}-${String(month).padStart(2,'0')}-01`)
          .lte('date', `${year}-${String(month).padStart(2,'0')}-31`),
        supabase.from('categories').select('*').eq('type', 'expense').order('name'),
      ])
      setBudgets(budgetsRes.data || [])
      setTransactions(txRes.data || [])
      setCategories(catRes.data || [])
      setLoading(false)
    }
    fetch()
  }, [user, month, year, supabase])

  // Compute spending per category
  const spending = useMemo(() => {
    const map: Record<string, number> = {}
    transactions.forEach(tx => {
      map[tx.category] = (map[tx.category] || 0) + parseFloat(tx.amount)
    })
    return map
  }, [transactions])

  // Summary stats
  const totalLimit = budgets.reduce((s, b) => s + parseFloat(b.amount_limit), 0)
  const totalSpent = budgets.reduce((s, b) => s + (spending[b.category] || 0), 0)
  const totalRemaining = Math.max(0, totalLimit - totalSpent)
  const overallPct = totalLimit > 0 ? Math.min((totalSpent / totalLimit) * 100, 100) : 0
  const overBudgetCount = budgets.filter(b => (spending[b.category] || 0) > parseFloat(b.amount_limit)).length

  // Month navigation
  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }
  const isCurrentMonth = month === now.getMonth() + 1 && year === now.getFullYear()
  const isFuture = new Date(year, month - 1) > new Date(now.getFullYear(), now.getMonth())

  // Expense categories without existing budgets (for add modal)
  const availableCategories = categories.filter(
    cat => !budgets.some(b => b.category === cat.name) || editing
  )

  const handleSave = async ({ category, amount_limit }: { category: string; amount_limit: number }) => {
    if (editing) {
      const { error } = await supabase.from('budgets').update({ amount_limit }).eq('id', editing.id)
      if (error) { toast.error('Failed to update budget'); return }
      setBudgets(prev => prev.map(b => b.id === editing.id ? { ...b, amount_limit } : b))
      toast.success('Budget updated!')
    } else {
      const { data, error } = await supabase.from('budgets')
        .insert({ category, amount_limit, month, year, user_id: user.id })
        .select().single()
      if (error) {
        if (error.code === '23505') toast.error('Budget for this category already exists')
        else toast.error('Failed to create budget')
        return
      }
      setBudgets(prev => [...prev, data].sort((a,b) => a.category.localeCompare(b.category)))
      toast.success('Budget created!')
    }
    setModalOpen(false)
    setEditing(null)
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('budgets').delete().eq('id', id)
    if (error) { toast.error('Failed to delete budget'); return }
    setBudgets(prev => prev.filter(b => b.id !== id))
    toast.success('Budget removed.')
  }

  const openEdit = (budget: any) => {
    setEditing(budget)
    setModalOpen(true)
  }

  const openAdd = () => {
    setEditing(null)
    setModalOpen(true)
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader user={user} />

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8 pb-24 lg:pb-10">

        {/* ── Page header ── */}
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white">Budget</h2>
            <p className="text-sm font-medium text-muted-foreground">
              Set monthly spending limits per category and track your progress.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Month navigator */}
            <div className="flex items-center gap-1 rounded-2xl border border-black/5 dark:border-white/5 bg-white dark:bg-card p-1">
              <button onClick={prevMonth} className="flex h-8 w-8 items-center justify-center rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-3 text-sm font-bold min-w-[120px] text-center">
                {MONTH_NAMES[month - 1]} {year}
              </span>
              <button
                onClick={nextMonth}
                disabled={isFuture}
                className="flex h-8 w-8 items-center justify-center rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <Button
              onClick={openAdd}
              disabled={availableCategories.length === 0}
              className="h-10 rounded-2xl bg-black dark:bg-white font-bold text-white dark:text-black shadow-lg shadow-black/10 dark:shadow-white/5 hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              <Plus className="mr-1.5 h-4 w-4" />
              Add Budget
            </Button>
          </div>
        </div>

        {/* ── Summary strip ── */}
        {budgets.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded-[2rem] border border-black/5 dark:border-white/5 bg-white dark:bg-card p-6 shadow-sm"
          >
            <div className="grid gap-6 sm:grid-cols-3 mb-5">
              {/* Total Budget */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Total Budget</p>
                <p className="text-2xl font-bold font-sans tabular-nums">IDR {totalLimit.toLocaleString('id-ID')}</p>
              </div>
              {/* Total Spent */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Total Spent</p>
                <p className={cn('text-2xl font-bold font-sans tabular-nums', totalSpent > totalLimit ? 'text-rose-600 dark:text-rose-400' : 'text-black dark:text-white')}>
                  IDR {totalSpent.toLocaleString('id-ID')}
                </p>
              </div>
              {/* Remaining */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                  {totalSpent > totalLimit ? 'Over Budget' : 'Remaining'}
                </p>
                <p className={cn('text-2xl font-bold font-sans tabular-nums',
                  totalSpent > totalLimit ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                )}>
                  IDR {Math.abs(totalLimit - totalSpent).toLocaleString('id-ID')}
                </p>
              </div>
            </div>

            {/* Overall progress bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Overall Progress
                </span>
                <div className="flex items-center gap-2">
                  {overBudgetCount > 0 && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-rose-500">
                      <AlertTriangle className="h-3 w-3" />
                      {overBudgetCount} over limit
                    </span>
                  )}
                  <span className="text-[10px] font-sans font-bold tabular-nums text-muted-foreground">
                    {overallPct.toFixed(0)}%
                  </span>
                </div>
              </div>
              <div className="h-2 w-full rounded-full bg-black/5 dark:bg-white/5 overflow-hidden">
                <motion.div
                  className={cn('h-full rounded-full', getProgressColor(overallPct).bar)}
                  initial={{ width: 0 }}
                  animate={{ width: `${overallPct}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Budget cards ── */}
        {loading ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 rounded-[2rem] bg-zinc-100 dark:bg-zinc-800/50 animate-pulse" />
            ))}
          </div>
        ) : budgets.length === 0 ? (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-black/10 dark:border-white/10 py-20 text-center"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-black/[0.03] dark:bg-white/[0.03]">
              <Wallet2 className="h-8 w-8 text-muted-foreground/40" />
            </div>
            <h3 className="text-base font-bold text-black dark:text-white mb-1">No budgets set</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-[280px]">
              {isFuture
                ? 'Planning ahead? Set budgets for this month.'
                : `Set spending limits for ${MONTH_NAMES[month-1]} ${year} to track your expenses.`}
            </p>
            <Button
              onClick={openAdd}
              disabled={availableCategories.length === 0}
              className="h-11 rounded-2xl bg-black dark:bg-white font-bold text-white dark:text-black shadow-lg shadow-black/10"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create First Budget
            </Button>
            {availableCategories.length === 0 && (
              <p className="mt-3 text-xs text-muted-foreground">
                Add expense categories first in the Categories page.
              </p>
            )}
          </motion.div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {budgets.map((budget, i) => {
                const spent = spending[budget.category] || 0
                const limit = parseFloat(budget.amount_limit)
                const pct   = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0
                const raw   = limit > 0 ? (spent / limit) * 100 : 0
                const color = getProgressColor(raw)
                const cat   = categories.find(c => c.name === budget.category)
                const Icon  = cat ? (iconMap[cat.icon] || Tag) : Tag
                const remaining = limit - spent

                return (
                  <motion.div
                    key={budget.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.04 }}
                    className="group relative rounded-[2rem] border border-black/5 dark:border-white/5 bg-white dark:bg-card p-6 shadow-sm hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-white/5 transition-all"
                  >
                    {/* Header */}
                    <div className="mb-5 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-12 w-12 items-center justify-center rounded-2xl shrink-0"
                          style={
                            cat?.color && cat.color !== '#000000'
                              ? { backgroundColor: `${cat.color}18`, color: cat.color }
                              : { backgroundColor: 'rgba(244,63,94,0.08)', color: '#f43f5e' }
                          }
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-black dark:text-white">{budget.category}</h3>
                          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                            {isCurrentMonth ? 'This month' : `${MONTH_NAMES[month-1]}`}
                          </p>
                        </div>
                      </div>

                      {/* Status badge */}
                      <div className={cn('flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold', color.bg, color.text)}>
                        {raw >= 100
                          ? <><AlertTriangle className="h-3 w-3" /> Over</>
                          : raw >= 70
                          ? <><TrendingUp className="h-3 w-3" /> <span className="font-sans tabular-nums">{raw.toFixed(0)}%</span></>
                          : <><CheckCircle2 className="h-3 w-3" /> <span className="font-sans tabular-nums">{raw.toFixed(0)}%</span></>
                        }
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-4 space-y-2">
                      <div className="h-2.5 w-full rounded-full bg-black/5 dark:bg-white/5 overflow-hidden">
                        <motion.div
                          className={cn('h-full rounded-full transition-colors duration-500', color.bar)}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.7, ease: 'easeOut', delay: i * 0.04 + 0.1 }}
                        />
                      </div>
                    </div>

                    {/* Amounts */}
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Spent</p>
                        <p className={cn('text-lg font-bold font-sans tabular-nums', color.text)}>
                          IDR {spent.toLocaleString('id-ID')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                          {remaining < 0 ? 'Over by' : 'Remaining'}
                        </p>
                        <p className={cn('text-lg font-bold font-sans tabular-nums',
                          remaining < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-muted-foreground'
                        )}>
                          IDR {Math.abs(remaining).toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>

                    <div className="mt-1 flex items-center justify-end">
                      <p className="text-[10px] text-muted-foreground/60 font-sans">
                        Limit: IDR {limit.toLocaleString('id-ID')}
                      </p>
                    </div>

                    {/* Actions — appear on hover */}
                    <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEdit(budget)}
                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(budget.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-black/5 dark:bg-white/5 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>

            {/* Add more card */}
            {availableCategories.length > 0 && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={openAdd}
                className="flex flex-col items-center justify-center gap-3 rounded-[2rem] border border-dashed border-black/10 dark:border-white/10 p-6 text-muted-foreground hover:border-black/20 dark:hover:border-white/20 hover:text-black dark:hover:text-white transition-all group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] group-hover:bg-black/[0.06] dark:group-hover:bg-white/[0.06] transition-colors">
                  <Plus className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest">Add Budget</span>
              </motion.button>
            )}
          </div>
        )}
      </main>

      {/* Modal */}
      <BudgetModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null) }}
        onSave={handleSave}
        categories={editing ? categories.filter(c => c.type === 'expense') : availableCategories}
        editing={editing}
        month={month}
        year={year}
      />
    </div>
  )
}
