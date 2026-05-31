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
  Plus, Pencil, Trash2, Coins, Plane, Laptop, Car, Home, ShieldAlert, Target,
  TrendingUp, Calendar, Sparkles, CheckCircle2, Info, AlertTriangle, Tag
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

// ── Category Config ──────────────────────────────────────────────────
const categoryConfig: Record<string, { icon: any; color: string; bg: string; text: string }> = {
  Savings: { icon: Coins, color: '#10b981', bg: 'rgba(16,185,129,0.08)', text: 'Savings' },
  Travel: { icon: Plane, color: '#0ea5e9', bg: 'rgba(14,165,233,0.08)', text: 'Travel & Trips' },
  Tech: { icon: Laptop, color: '#6366f1', bg: 'rgba(99,102,241,0.08)', text: 'Tech & Gadgets' },
  Vehicle: { icon: Car, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', text: 'Vehicle' },
  Home: { icon: Home, color: '#f43f5e', bg: 'rgba(244,63,94,0.08)', text: 'Home & Property' },
  Emergency: { icon: ShieldAlert, color: '#ef4444', bg: 'rgba(239,68,68,0.08)', text: 'Emergency Fund' },
  General: { icon: Target, color: '#3b82f6', bg: 'rgba(59,130,246,0.08)', text: 'General Goal' },
}

// Helper to format currency
const formatCurrency = (val: number) => {
  return 'IDR ' + val.toLocaleString('en-US')
}

// ── Goal Edit/Add Modal ───────────────────────────────────────────────
function GoalModal({
  open, onClose, onSave, editing
}: {
  open: boolean
  onClose: () => void
  onSave: (data: { name: string; target_amount: number; current_amount: number; target_date: string; category: string }) => Promise<void>
  editing: any | null
}) {
  const [name, setName]                 = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [currentAmount, setCurrentAmount] = useState('')
  const [targetDate, setTargetDate]     = useState('')
  const [category, setCategory]         = useState('General')
  const [saving, setSaving]             = useState(false)

  useEffect(() => {
    if (editing) {
      setName(editing.name || '')
      setTargetAmount(String(editing.target_amount))
      setCurrentAmount(String(editing.current_amount))
      setTargetDate(editing.target_date || '')
      setCategory(editing.category || 'General')
    } else {
      setName('')
      setTargetAmount('')
      setCurrentAmount('0')
      // Default to 1 year from now
      const oneYearFromNow = new Date()
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1)
      setTargetDate(oneYearFromNow.toISOString().split('T')[0])
      setCategory('General')
    }
  }, [editing, open])

  const handleSave = async () => {
    if (!name.trim() || !targetAmount || isNaN(Number(targetAmount)) || Number(targetAmount) <= 0) {
      toast.error('Please enter a valid goal name and target amount')
      return
    }
    if (isNaN(Number(currentAmount)) || Number(currentAmount) < 0) {
      toast.error('Please enter a valid current savings amount')
      return
    }
    if (!targetDate) {
      toast.error('Please select a target date')
      return
    }

    setSaving(true)
    await onSave({
      name: name.trim(),
      target_amount: parseFloat(targetAmount),
      current_amount: parseFloat(currentAmount || '0'),
      target_date: targetDate,
      category
    })
    setSaving(false)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[460px] rounded-[2.5rem] border-black/5 dark:border-white/5 p-8 dark:bg-card">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-xl font-bold font-sans">
            {editing ? 'Edit Financial Goal' : 'Create New Goal'}
          </DialogTitle>
          <p className="text-xs font-medium text-muted-foreground mt-1 font-sans">
            Define your financial target and start tracking its progress visually.
          </p>
        </DialogHeader>

        <div className="space-y-5">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1 font-sans">Goal Name</label>
            <Input
              placeholder="e.g. Emergency Fund, New Macbook Pro"
              className="h-12 rounded-2xl border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] font-semibold focus-visible:ring-0"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1 font-sans">Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-12 rounded-2xl border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] font-semibold">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-black/5 dark:border-white/5 p-2 dark:bg-card">
                {Object.keys(categoryConfig).map(key => {
                  const Icon = categoryConfig[key].icon
                  return (
                    <SelectItem key={key} value={key} className="rounded-xl focus:bg-black/5 dark:focus:bg-white/5 font-semibold">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" style={{ color: categoryConfig[key].color }} />
                        <span>{categoryConfig[key].text}</span>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Target Amount */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1 font-sans">Target Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">IDR</span>
                <Input
                  type="number"
                  placeholder="0"
                  className="h-12 rounded-2xl border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] pl-12 font-bold font-sans tabular-nums focus-visible:ring-0"
                  value={targetAmount}
                  onChange={e => setTargetAmount(e.target.value)}
                />
              </div>
            </div>

            {/* Current Amount */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1 font-sans">Current Savings</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">IDR</span>
                <Input
                  type="number"
                  placeholder="0"
                  className="h-12 rounded-2xl border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] pl-12 font-bold font-sans tabular-nums focus-visible:ring-0"
                  value={currentAmount}
                  onChange={e => setCurrentAmount(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Target Date */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1 font-sans">Target Date</label>
            <div className="relative">
              <Input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                className="h-12 rounded-2xl border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] font-bold font-sans focus-visible:ring-0"
                value={targetDate}
                onChange={e => setTargetDate(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSave()}
              />
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={saving || !name || !targetAmount || !targetDate}
            className="h-12 w-full rounded-2xl bg-black dark:bg-white text-xs font-bold uppercase tracking-[0.2em] text-white dark:text-black shadow-xl shadow-black/10 dark:shadow-white/5 disabled:opacity-40 mt-2 transition-all active:scale-95 cursor-pointer font-sans"
          >
            {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Goal'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ── Deposit / Contribute Modal ───────────────────────────────────────
function DepositModal({
  open, onClose, onDeposit, goal
}: {
  open: boolean
  onClose: () => void
  onDeposit: (amount: number) => Promise<void>
  goal: any | null
}) {
  const [amount, setAmount]   = useState('')
  const [saving, setSaving]   = useState(false)

  useEffect(() => {
    setAmount('')
  }, [goal, open])

  const handleSave = async (customVal?: number) => {
    const val = customVal || parseFloat(amount)
    if (isNaN(val) || val === 0) {
      toast.error('Please enter a valid amount')
      return
    }

    setSaving(true)
    await onDeposit(val)
    setSaving(false)
  }

  if (!goal) return null

  const remaining = Math.max(0, goal.target_amount - goal.current_amount)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px] rounded-[2.5rem] border-black/5 dark:border-white/5 p-8 dark:bg-card">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold font-sans">Contribute / Withdraw</DialogTitle>
          <p className="text-xs font-semibold text-muted-foreground mt-1 font-sans">
            Manage your savings allocation for &ldquo;{goal.name}&rdquo;.
          </p>
        </DialogHeader>

        {/* Current status display */}
        <div className="rounded-2xl border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01] p-4 text-xs font-sans space-y-2 mb-2">
          <div className="flex justify-between font-medium">
            <span className="text-muted-foreground">Saved</span>
            <span className="font-bold text-black dark:text-white tabular-nums">{formatCurrency(goal.current_amount)}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span className="text-muted-foreground">Remaining</span>
            <span className="font-bold text-blue-500 dark:text-blue-400 tabular-nums">{formatCurrency(remaining)}</span>
          </div>
        </div>

        <div className="space-y-5">
          {/* Input Amount */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1 font-sans">Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">IDR</span>
              <Input
                type="number"
                placeholder="Enter amount"
                className="h-12 rounded-2xl border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] pl-12 font-bold font-sans tabular-nums focus-visible:ring-0"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSave()}
              />
            </div>
          </div>

          {/* Quick preset buttons */}
          <div className="grid grid-cols-3 gap-2">
            {[100000, 500000, 1000000].map(val => (
              <button
                key={val}
                type="button"
                onClick={() => setAmount(String(val))}
                className="py-2.5 rounded-xl border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01] hover:bg-black/5 dark:hover:bg-white/5 text-[11px] font-bold font-sans transition-all active:scale-95 cursor-pointer text-black dark:text-white"
              >
                +{val >= 1000000 ? `${val/1000000}M` : `${val/1000}k`}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 mt-2 font-sans">
            <Button
              onClick={() => handleSave(Math.abs(parseFloat(amount)) * -1)}
              disabled={saving || !amount}
              variant="outline"
              className="h-12 rounded-2xl text-xs font-bold uppercase tracking-[0.15em] hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/20 transition-all active:scale-95 cursor-pointer"
            >
              Withdraw
            </Button>
            <Button
              onClick={() => handleSave()}
              disabled={saving || !amount}
              className="h-12 rounded-2xl bg-black dark:bg-white text-xs font-bold uppercase tracking-[0.15em] text-white dark:text-black shadow-xl shadow-black/10 dark:shadow-white/5 disabled:opacity-40 transition-all active:scale-95 cursor-pointer"
            >
              {saving ? 'Processing…' : 'Contribute'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ── Main Page Component ──────────────────────────────────────────────
export default function GoalsPage() {
  const supabase = createClient()

  const [user, setUser]               = useState<any>(null)
  const [goals, setGoals]             = useState<any[]>([])
  const [loading, setLoading]         = useState(true)
  const [filter, setFilter]           = useState<'all' | 'active' | 'completed'>('all')

  // Modals state
  const [goalModalOpen, setGoalModalOpen]       = useState(false)
  const [depositModalOpen, setDepositModalOpen] = useState(false)
  const [selectedGoal, setSelectedGoal]         = useState<any | null>(null)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        await fetchGoals(user.id)
      } else {
        setLoading(false)
      }
    }
    init()
  }, [supabase])

  const fetchGoals = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId)
        .order('target_date', { ascending: true })

      if (error) throw error
      setGoals(data || [])
    } catch (err: any) {
      console.error('Error fetching goals:', err)
      toast.error('Failed to fetch goals')
    } finally {
      setLoading(false)
    }
  }

  // Add / Edit goal
  const handleSaveGoal = async (data: any) => {
    if (!user) return

    try {
      if (selectedGoal) {
        // Update
        const { error } = await supabase
          .from('goals')
          .update(data)
          .eq('id', selectedGoal.id)
          .eq('user_id', user.id)

        if (error) throw error
        toast.success('Financial goal updated successfully')
      } else {
        // Insert
        const { error } = await supabase
          .from('goals')
          .insert([{ ...data, user_id: user.id }])

        if (error) throw error
        toast.success('Financial goal created successfully')
      }
      setGoalModalOpen(false)
      setSelectedGoal(null)
      await fetchGoals(user.id)
    } catch (err: any) {
      console.error('Error saving goal:', err)
      toast.error('Failed to save financial goal')
    }
  }

  // Quick Deposit / Contribute
  const handleDeposit = async (amount: number) => {
    if (!user || !selectedGoal) return

    const newAmount = Math.max(0, selectedGoal.current_amount + amount)

    try {
      const { error } = await supabase
        .from('goals')
        .update({ current_amount: newAmount })
        .eq('id', selectedGoal.id)
        .eq('user_id', user.id)

      if (error) throw error
      
      if (amount > 0) {
        toast.success(`Successfully added ${formatCurrency(amount)} to your goal`)
      } else {
        toast.success(`Successfully withdrew ${formatCurrency(Math.abs(amount))} from your goal`)
      }

      setDepositModalOpen(false)
      setSelectedGoal(null)
      await fetchGoals(user.id)
    } catch (err: any) {
      console.error('Error updating amount:', err)
      toast.error('Failed to process goal transaction')
    }
  }

  // Delete goal
  const handleDeleteGoal = async (goalId: string) => {
    if (!user) return
    const isConfirmed = confirm('Are you sure you want to delete this financial goal?')
    if (!isConfirmed) return

    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', goalId)
        .eq('user_id', user.id)

      if (error) throw error
      toast.success('Financial goal deleted successfully')
      await fetchGoals(user.id)
    } catch (err: any) {
      console.error('Error deleting goal:', err)
      toast.error('Failed to delete financial goal')
    }
  }

  // Filtered goals memo
  const filteredGoals = useMemo(() => {
    return goals.filter(g => {
      const completed = g.current_amount >= g.target_amount
      if (filter === 'active') return !completed
      if (filter === 'completed') return completed
      return true
    })
  }, [goals, filter])

  // Aggregate stats
  const stats = useMemo(() => {
    const totalTarget = goals.reduce((acc, curr) => acc + Number(curr.target_amount), 0)
    const totalSaved  = goals.reduce((acc, curr) => acc + Number(curr.current_amount), 0)
    const averageProgress = goals.length > 0 
      ? goals.reduce((acc, curr) => acc + Math.min(100, (Number(curr.current_amount) / Number(curr.target_amount)) * 100), 0) / goals.length 
      : 0
    const completedGoalsCount = goals.filter(g => Number(g.current_amount) >= Number(g.target_amount)).length

    return { totalTarget, totalSaved, averageProgress, completedGoalsCount }
  }, [goals])

  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-background transition-colors duration-500 font-sans pb-16">
      <DashboardHeader user={user} />

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8 space-y-8">
        
        {/* Title Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-black dark:text-white font-sans">
              Financial Goals
            </h2>
            <p className="text-sm font-medium text-muted-foreground mt-1.5 font-sans">
              Set, manage, and track your financial targets in one place.
            </p>
          </div>
          <Button
            onClick={() => {
              setSelectedGoal(null)
              setGoalModalOpen(true)
            }}
            className="h-12 px-6 rounded-2xl bg-black dark:bg-white text-xs font-bold uppercase tracking-[0.2em] text-white dark:text-black shadow-xl shadow-black/10 dark:shadow-white/5 transition-all hover:scale-[1.02] active:scale-95 shrink-0 flex items-center gap-2 cursor-pointer font-sans"
          >
            <Plus className="h-4 w-4" />
            New Goal
          </Button>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 rounded-[2rem] border border-black/5 dark:border-white/5 bg-white dark:bg-card p-8 animate-pulse flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                  <div className="h-4 w-48 bg-zinc-100 dark:bg-zinc-800/60 rounded-full" />
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-full bg-zinc-150 dark:bg-zinc-800 rounded-full" />
                  <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Top Metrics Cards */}
            {goals.length > 0 && (
              <div className="grid gap-5 md:grid-cols-3">
                {/* Total Saved Card */}
                <div className="relative overflow-hidden rounded-[2rem] border border-black/5 dark:border-white/5 bg-white dark:bg-card p-8 shadow-sm">
                  <div className="absolute top-6 right-6 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500">
                    <Coins className="h-6 w-6" />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground font-sans">Total Saved</p>
                  <p className="text-2xl font-bold text-black dark:text-white mt-3 font-sans tabular-nums tracking-tight">
                    {formatCurrency(stats.totalSaved)}
                  </p>
                  <p className="text-xs font-semibold text-muted-foreground mt-2 font-sans opacity-70">
                    Of target total {formatCurrency(stats.totalTarget)}
                  </p>
                </div>

                {/* Average Progress Card */}
                <div className="relative overflow-hidden rounded-[2rem] border border-black/5 dark:border-white/5 bg-white dark:bg-card p-8 shadow-sm">
                  <div className="absolute top-6 right-6 p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground font-sans">Average Progress</p>
                  <p className="text-2xl font-bold text-black dark:text-white mt-3 font-sans tabular-nums tracking-tight">
                    {stats.averageProgress.toFixed(0)}%
                  </p>
                  <div className="mt-3.5 h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
                      style={{ width: `${stats.averageProgress}%` }}
                    />
                  </div>
                </div>

                {/* Completed Goals Banner Card */}
                <div className="relative overflow-hidden rounded-[2rem] border border-black/5 dark:border-white/5 bg-white dark:bg-card p-8 shadow-sm">
                  <div className="absolute top-6 right-6 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/20 text-amber-500">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground font-sans">Goals Achieved</p>
                  <p className="text-2xl font-bold text-black dark:text-white mt-3 font-sans tabular-nums tracking-tight">
                    {stats.completedGoalsCount} <span className="text-sm font-bold text-muted-foreground">/ {goals.length}</span>
                  </p>
                  <p className="text-xs font-semibold text-muted-foreground mt-2 font-sans opacity-70">
                    {goals.length - stats.completedGoalsCount} active goals remaining
                  </p>
                </div>
              </div>
            )}

            {goals.length === 0 ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center text-center p-12 py-20 rounded-[2rem] border border-black/5 dark:border-white/5 bg-white dark:bg-card shadow-sm space-y-6">
                <div className="relative h-20 w-20 rounded-[2rem] bg-gradient-to-tr from-blue-500 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/10">
                  <Target className="h-10 w-10" />
                  <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-amber-300 animate-pulse" />
                </div>
                <div className="max-w-md space-y-2">
                  <h3 className="text-xl font-bold font-sans text-black dark:text-white">Create Your First Goal</h3>
                  <p className="text-sm font-medium text-muted-foreground font-sans leading-relaxed">
                    Whether it is for an emergency fund, a dream vacation, a new gadget, or saving for your first home, set your target and reach your dreams.
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setSelectedGoal(null)
                    setGoalModalOpen(true)
                  }}
                  className="h-12 px-8 rounded-2xl bg-black dark:bg-white text-xs font-bold uppercase tracking-[0.2em] text-white dark:text-black shadow-xl shadow-black/10 dark:shadow-white/5 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer font-sans"
                >
                  Create Goal Now
                </Button>
              </div>
            ) : (
              <>
                {/* Filters */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex gap-2 p-1 rounded-2xl bg-zinc-255/50 dark:bg-zinc-800/40 border border-black/5 dark:border-white/5 w-fit">
                    {(['all', 'active', 'completed'] as const).map(f => (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer font-sans",
                          filter === f
                            ? "bg-white dark:bg-card text-black dark:text-white shadow-sm font-extrabold"
                            : "text-muted-foreground hover:text-black dark:hover:text-white"
                        )}
                      >
                        {f === 'all' ? 'All' : f === 'active' ? 'Active' : 'Completed'}
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-muted-foreground font-sans uppercase tracking-widest">
                    Showing {filteredGoals.length} {filteredGoals.length === 1 ? 'Target' : 'Targets'}
                  </span>
                </div>

                {/* Goals Grid */}
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  <AnimatePresence mode="popLayout">
                    {filteredGoals.map((goal, i) => {
                      const progress = goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0
                      const isCompleted = progress >= 100
                      const remaining = Math.max(0, goal.target_amount - goal.current_amount)

                      // Calculate remaining months & required saving rate
                      const targetDate = new Date(goal.target_date)
                      const today = new Date()
                      const diffYears = targetDate.getFullYear() - today.getFullYear()
                      const diffMonths = targetDate.getMonth() - today.getMonth()
                      const monthsLeft = Math.max(1, diffYears * 12 + diffMonths)
                      const requiredSavingsMonthly = isCompleted ? 0 : remaining / monthsLeft

                      const config = categoryConfig[goal.category] || categoryConfig.General
                      const CategoryIcon = config.icon

                      return (
                        <motion.div
                          layout
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: i * 0.04 }}
                          key={goal.id}
                          className={cn(
                            "group relative rounded-[2rem] border border-black/5 dark:border-white/5 bg-white dark:bg-card p-6 shadow-sm hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-white/5 transition-all flex flex-col justify-between"
                          )}
                        >
                          {/* Inner Header */}
                          <div className="space-y-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div
                                  className="flex h-12 w-12 items-center justify-center rounded-2xl shrink-0"
                                  style={{
                                    backgroundColor: config.bg,
                                    color: config.color
                                  }}
                                >
                                  <CategoryIcon className="h-6 w-6" />
                                </div>
                                <div>
                                  <h3 className="font-bold text-black dark:text-white line-clamp-1">{goal.name}</h3>
                                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground font-sans">
                                    {config.text}
                                  </p>
                                </div>
                              </div>

                              {/* Status Badge */}
                              <div className={cn(
                                "flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold font-sans",
                                isCompleted 
                                  ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400" 
                                  : "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400"
                              )}>
                                {isCompleted ? (
                                  <>
                                    <CheckCircle2 className="h-3 w-3" />
                                    <span>Done</span>
                                  </>
                                ) : (
                                  <>
                                    <TrendingUp className="h-3 w-3" />
                                    <span className="tabular-nums">{progress.toFixed(0)}%</span>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Remaining Info & Target Date */}
                            <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground font-sans">
                              <div className="flex items-center gap-1.5 shrink-0">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>
                                  {new Date(goal.target_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                </span>
                              </div>
                              <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700 shrink-0" />
                              <div className="truncate">
                                {isCompleted ? (
                                  <span className="text-emerald-500 font-bold">Completed!</span>
                                ) : (
                                  <span>{monthsLeft} {monthsLeft === 1 ? 'month' : 'months'} left</span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Progress track */}
                          <div className="my-5 space-y-2">
                            <div className="h-2.5 w-full rounded-full bg-black/5 dark:bg-white/5 overflow-hidden">
                              <motion.div
                                className={cn(
                                  "h-full rounded-full transition-colors duration-500",
                                  isCompleted ? "bg-emerald-500" : "bg-blue-500"
                                )}
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, progress)}%` }}
                                transition={{ duration: 0.7, ease: 'easeOut', delay: i * 0.04 + 0.1 }}
                              />
                            </div>
                          </div>

                          {/* Amounts */}
                          <div className="flex items-end justify-between font-sans">
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Saved</p>
                              <p className={cn('text-lg font-bold tabular-nums', isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-black dark:text-white')}>
                                {formatCurrency(goal.current_amount)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Target</p>
                              <p className="text-lg font-bold text-muted-foreground tabular-nums">
                                {formatCurrency(goal.target_amount)}
                              </p>
                            </div>
                          </div>

                          {/* Projections info or Achieved status */}
                          <div className="mt-4 pt-4 border-t border-black/5 dark:border-white/5 space-y-4">
                            {!isCompleted ? (
                              <div className="flex items-start gap-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-black/5 dark:border-white/5 p-3 text-[11px] font-sans">
                                <Info className="h-4 w-4 text-blue-500 dark:text-blue-400 shrink-0 mt-0.5" />
                                <div className="space-y-0.5">
                                  <p className="font-bold text-black dark:text-white">Recommended Monthly Saving</p>
                                  <p className="font-medium text-muted-foreground">
                                    Save <span className="font-bold text-blue-500 dark:text-blue-400 tabular-nums">{formatCurrency(requiredSavingsMonthly)}</span> monthly to reach your target on time.
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/10 p-3 text-[11px] font-sans text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="h-4 w-4 shrink-0" />
                                <span className="font-bold">Excellent! You have achieved this financial target!</span>
                              </div>
                            )}

                            <Button
                              onClick={() => {
                                setSelectedGoal(goal)
                                setDepositModalOpen(true)
                              }}
                              className={cn(
                                "w-full h-11 rounded-2xl text-[11px] font-bold uppercase tracking-wider transition-all active:scale-95 cursor-pointer font-sans",
                                isCompleted 
                                  ? "bg-zinc-150 dark:bg-zinc-800/80 text-black dark:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-800/40" 
                                  : "bg-black dark:bg-white text-white dark:text-black shadow-lg shadow-black/5 dark:shadow-white/5 hover:scale-[1.01]"
                              )}
                            >
                              {isCompleted ? 'Adjust Balance' : 'Contribute / Withdraw'}
                            </Button>
                          </div>

                          {/* Hover Actions */}
                          <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                setSelectedGoal(goal)
                                setGoalModalOpen(true)
                              }}
                              className="flex h-8 w-8 items-center justify-center rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
                              title="Edit Goal"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteGoal(goal.id)}
                              className="flex h-8 w-8 items-center justify-center rounded-xl bg-black/5 dark:bg-white/5 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Delete Goal"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>

                  {/* Add more goal card */}
                  {goals.length > 0 && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => {
                        setSelectedGoal(null)
                        setGoalModalOpen(true)
                      }}
                      className="flex flex-col items-center justify-center gap-3 rounded-[2rem] border border-dashed border-black/10 dark:border-white/10 p-6 text-muted-foreground hover:border-black/20 dark:hover:border-white/20 hover:text-black dark:hover:text-white transition-all group cursor-pointer"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] group-hover:bg-black/[0.06] dark:group-hover:bg-white/[0.06] transition-colors">
                        <Plus className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest font-sans">New Goal</span>
                    </motion.button>
                  )}
                </div>
              </>
            )}
          </>
        )}

      </main>

      {/* Add / Edit modal */}
      <GoalModal
        open={goalModalOpen}
        onClose={() => {
          setGoalModalOpen(false)
          setSelectedGoal(null)
        }}
        onSave={handleSaveGoal}
        editing={selectedGoal}
      />

      {/* Quick Deposit modal */}
      <DepositModal
        open={depositModalOpen}
        onClose={() => {
          setDepositModalOpen(false)
          setSelectedGoal(null)
        }}
        onDeposit={handleDeposit}
        goal={selectedGoal}
      />
    </div>
  )
}
