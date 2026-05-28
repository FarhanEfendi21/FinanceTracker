'use client'

import { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts'
import { Wallet, ArrowUpRight, ArrowDownRight, TrendingDown, PiggyBank } from 'lucide-react'
import { motion } from 'framer-motion'
import { DashboardSkeleton } from '@/components/skeletons'

const COLORS = ['#0d9488', '#2563eb', '#d97706', '#7c3aed', '#e11d48']

// ── Mini Sparkline ──────────────────────────────────────────────────
function MiniSparkline({ data, stroke }: { data: { v: number }[], stroke: string }) {
  if (!data || data.length < 2) return null
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
        <defs>
          <linearGradient id={`spark-${stroke.replace('#','')}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={stroke} stopOpacity={0.3} />
            <stop offset="100%" stopColor={stroke} stopOpacity={1} />
          </linearGradient>
        </defs>
        <Line
          type="monotone"
          dataKey="v"
          stroke={`url(#spark-${stroke.replace('#','')})`}
          strokeWidth={1.8}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

const MonthlyTrendTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="relative z-[9999] backdrop-blur-md bg-white/90 dark:bg-card/90 border border-black/5 dark:border-white/10 rounded-[1.5rem] p-4 shadow-xl shadow-black/5 dark:shadow-white/5 space-y-2 pointer-events-none">
        {label && <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>}
        <div className="space-y-1.5">
          {payload.map((item: any, index: number) => {
            const color = item.name === 'Income' ? '#10b981' : '#f43f5e'
            return (
              <div key={index} className="flex items-center gap-4 justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-xs font-semibold text-muted-foreground">{item.name}</span>
                </div>
                <span className="text-xs font-bold font-sans tabular-nums tracking-tight text-black dark:text-white">
                  IDR {item.value.toLocaleString('id-ID')}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
  return null
}

const CategoryBreakdownTooltip = ({ active, payload, total }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0]
    const color = item.payload?.color || '#0d9488'
    const percentage = total > 0 ? ((item.value / total) * 100).toFixed(0) : '0'
    return (
      <div className="relative z-[9999] backdrop-blur-md bg-white/90 dark:bg-card/90 border border-black/5 dark:border-white/10 rounded-[1.5rem] p-4 shadow-xl shadow-black/5 dark:shadow-white/5 space-y-2 pointer-events-none">
        <div className="flex items-center gap-3">
          <div className="h-2.5 w-2.5 rounded-full shadow-sm" style={{ backgroundColor: color }} />
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {item.name}
          </span>
        </div>
        <div className="pt-1.5 border-t border-black/5 dark:border-white/5 flex flex-col gap-0.5">
          <p className="text-sm font-bold font-sans tabular-nums text-black dark:text-white">
            IDR {item.value.toLocaleString('id-ID')}
          </p>
          <p className="text-[10px] text-muted-foreground font-sans">
            {percentage}% of monthly spend
          </p>
        </div>
      </div>
    )
  }
  return null
}

export default function DashboardStats({ transactions, loading }: { transactions: any[], loading?: boolean }) {
  const stats = useMemo(() => {

    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear

    // This month's transactions
    const thisMonthTx = transactions.filter(t => {
      const d = new Date(t.date)
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear
    })

    // Last month's transactions
    const lastMonthTx = transactions.filter(t => {
      const d = new Date(t.date)
      return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear
    })

    const income = thisMonthTx
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0)

    const expenses = thisMonthTx
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0)

    const lastMonthIncome = lastMonthTx
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0)

    const lastMonthExpenses = lastMonthTx
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0)

    // All-time balance
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + parseFloat(t.amount), 0)
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + parseFloat(t.amount), 0)
    const balance = totalIncome - totalExpenses

    // % change vs last month
    const incomeChange = lastMonthIncome > 0 ? ((income - lastMonthIncome) / lastMonthIncome) * 100 : null
    const expensesChange = lastMonthExpenses > 0 ? ((expenses - lastMonthExpenses) / lastMonthExpenses) * 100 : null

    // Category breakdown for this month's expenses
    const expensesByCategory = thisMonthTx
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        const existing = acc.find((item: any) => item.name === t.category)
        if (existing) {
          existing.value += parseFloat(t.amount)
        } else {
          acc.push({ name: t.category, value: parseFloat(t.amount) })
        }
        return acc
      }, [] as { name: string; value: number }[])
      .map((item, index) => ({
        ...item,
        color: COLORS[index % COLORS.length]
      }))

    // Monthly trend (last 6 months)
    const monthlyData: { [key: string]: { income: number; expenses: number; sortKey: number } } = {}
    for (let i = 5; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - i, 1)
      const key = d.toLocaleDateString('en-US', { month: 'short' })
      monthlyData[key] = { income: 0, expenses: 0, sortKey: d.getTime() }
    }

    transactions.forEach(t => {
      const d = new Date(t.date)
      const key = d.toLocaleDateString('en-US', { month: 'short' })
      // Only include last 6 months
      const monthsAgo = (currentYear - d.getFullYear()) * 12 + (currentMonth - d.getMonth())
      if (monthsAgo >= 0 && monthsAgo <= 5) {
        if (!monthlyData[key]) {
          monthlyData[key] = { income: 0, expenses: 0, sortKey: d.getTime() }
        }
        const amount = parseFloat(t.amount)
        if (t.type === 'income') {
          monthlyData[key].income += amount
        } else {
          monthlyData[key].expenses += amount
        }
      }
    })

    const monthlyTrend = Object.entries(monthlyData)
      .sort((a, b) => a[1].sortKey - b[1].sortKey)
      .map(([month, data]) => ({ month, income: data.income, expenses: data.expenses }))

    // Savings rate this month
    const savingsRate = income > 0 ? Math.max(0, ((income - expenses) / income) * 100) : 0
    const lastMonthSavingsRate = lastMonthIncome > 0 ? Math.max(0, ((lastMonthIncome - lastMonthExpenses) / lastMonthIncome) * 100) : 0
    const savingsRateChange = lastMonthSavingsRate > 0 ? savingsRate - lastMonthSavingsRate : null

    // Sparkline arrays (last 6 months)
    let runningBalance = 0
    const balanceSparkline = monthlyTrend.map(m => {
      runningBalance += m.income - m.expenses
      return { v: runningBalance }
    })
    const incomeSparkline = monthlyTrend.map(m => ({ v: m.income }))
    const expensesSparkline = monthlyTrend.map(m => ({ v: m.expenses }))
    const savingsSparkline = monthlyTrend.map(m => ({
      v: m.income > 0 ? Math.max(0, ((m.income - m.expenses) / m.income) * 100) : 0
    }))

    return { income, expenses, balance, incomeChange, expensesChange, expensesByCategory, monthlyTrend, savingsRate, savingsRateChange, balanceSparkline, incomeSparkline, expensesSparkline, savingsSparkline }
  }, [transactions])

  const formatChange = (change: number | null) => {
    if (change === null) return null
    const sign = change >= 0 ? '+' : ''
    return `${sign}${change.toFixed(1)}% vs last month`
  }

  if (loading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="space-y-8">
      {/* Summary Cards — 2 cols on md, 4 cols on xl */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {/* Balance Card */}
        <motion.div
          className="group relative overflow-hidden rounded-[2rem] border border-black/5 dark:border-white/5 bg-white dark:bg-card p-7 cursor-default shadow-sm"
          whileHover={{ y: -5, scale: 1.015, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.06)' }}
          whileTap={{ scale: 0.985 }}
          transition={{ type: 'spring', stiffness: 350, damping: 18 }}
        >
          <div className="relative z-10 flex flex-col h-full">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-black dark:bg-white text-white dark:text-black shadow-lg shadow-black/20 dark:shadow-white/5">
              <Wallet className="h-5 w-5" />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">Total Balance</p>
            <div className="mt-1 flex-1">
              <h2 className={`text-2xl font-bold font-sans tabular-nums tracking-tight ${stats.balance >= 0 ? 'text-black dark:text-white' : 'text-rose-600 dark:text-rose-400'}`}>
                IDR {Math.abs(stats.balance).toLocaleString('id-ID')}
              </h2>
              {stats.balance < 0
                ? <p className="mt-1.5 text-[10px] font-bold text-rose-500">Deficit</p>
                : <p className="mt-1.5 text-[10px] font-semibold text-muted-foreground/60">All-time net</p>
              }
            </div>
          </div>
          {/* Sparkline bottom-right */}
          <div className="absolute bottom-5 right-4 h-10 w-24 opacity-30 group-hover:opacity-60 transition-opacity duration-300">
            <MiniSparkline data={stats.balanceSparkline} stroke={stats.balance >= 0 ? '#000000' : '#f43f5e'} />
          </div>
        </motion.div>

        {/* Income Card */}
        <motion.div
          className="group relative overflow-hidden rounded-[2rem] border border-black/5 dark:border-white/5 bg-white dark:bg-card p-7 cursor-default shadow-sm"
          whileHover={{ y: -5, scale: 1.015, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.06)' }}
          whileTap={{ scale: 0.985 }}
          transition={{ type: 'spring', stiffness: 350, damping: 18 }}
        >
          <div className="relative z-10 flex flex-col h-full">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight className="h-5 w-5" />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">This Month's Income</p>
            <div className="mt-1 flex-1">
              <h2 className="text-2xl font-bold font-sans tabular-nums tracking-tight text-black dark:text-white">
                IDR {stats.income.toLocaleString('id-ID')}
              </h2>
              {stats.incomeChange !== null && (
                <p className={`mt-1.5 text-[10px] font-sans font-bold tabular-nums ${stats.incomeChange >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'}`}>
                  {stats.incomeChange >= 0 ? '+' : ''}{stats.incomeChange.toFixed(1)}% vs last mo.
                </p>
              )}
            </div>
          </div>
          <div className="absolute bottom-5 right-4 h-10 w-24 opacity-30 group-hover:opacity-60 transition-opacity duration-300">
            <MiniSparkline data={stats.incomeSparkline} stroke="#10b981" />
          </div>
        </motion.div>

        {/* Expenses Card */}
        <motion.div
          className="group relative overflow-hidden rounded-[2rem] border border-black/5 dark:border-white/5 bg-white dark:bg-card p-7 cursor-default shadow-sm"
          whileHover={{ y: -5, scale: 1.015, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.06)' }}
          whileTap={{ scale: 0.985 }}
          transition={{ type: 'spring', stiffness: 350, damping: 18 }}
        >
          <div className="relative z-10 flex flex-col h-full">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400">
              <ArrowDownRight className="h-5 w-5" />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">This Month's Expenses</p>
            <div className="mt-1 flex-1">
              <h2 className="text-2xl font-bold font-sans tabular-nums tracking-tight text-black dark:text-white">
                IDR {stats.expenses.toLocaleString('id-ID')}
              </h2>
              {stats.expensesChange !== null && (
                <p className={`mt-1.5 text-[10px] font-sans font-bold tabular-nums ${stats.expensesChange <= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'}`}>
                  {stats.expensesChange >= 0 ? '+' : ''}{stats.expensesChange.toFixed(1)}% vs last mo.
                </p>
              )}
            </div>
          </div>
          <div className="absolute bottom-5 right-4 h-10 w-24 opacity-30 group-hover:opacity-60 transition-opacity duration-300">
            <MiniSparkline data={stats.expensesSparkline} stroke="#f43f5e" />
          </div>
        </motion.div>

        {/* Savings Rate Card */}
        <motion.div
          className="group relative overflow-hidden rounded-[2rem] border border-black/5 dark:border-white/5 bg-white dark:bg-card p-7 cursor-default shadow-sm"
          whileHover={{ y: -5, scale: 1.015, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.06)' }}
          whileTap={{ scale: 0.985 }}
          transition={{ type: 'spring', stiffness: 350, damping: 18 }}
        >
          <div className="relative z-10 flex flex-col h-full">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400">
              <PiggyBank className="h-5 w-5" />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">Savings Rate</p>
            <div className="mt-1 flex-1">
              <h2 className={`text-2xl font-bold font-sans tabular-nums tracking-tight ${
                stats.savingsRate >= 20 ? 'text-violet-600 dark:text-violet-400'
                : stats.savingsRate > 0 ? 'text-black dark:text-white'
                : 'text-rose-500 dark:text-rose-400'
              }`}>
                {stats.savingsRate.toFixed(1)}<span className="text-lg ml-0.5">%</span>
              </h2>
              {stats.savingsRateChange !== null ? (
                <p className={`mt-1.5 text-[10px] font-sans font-bold tabular-nums ${
                  stats.savingsRateChange >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'
                }`}>
                  {stats.savingsRateChange >= 0 ? '+' : ''}{stats.savingsRateChange.toFixed(1)}pp vs last mo.
                </p>
              ) : (
                <p className="mt-1.5 text-[10px] font-semibold text-muted-foreground/60">of monthly income</p>
              )}
            </div>
          </div>
          <div className="absolute bottom-5 right-4 h-10 w-24 opacity-30 group-hover:opacity-60 transition-opacity duration-300">
            <MiniSparkline data={stats.savingsSparkline} stroke="#8b5cf6" />
          </div>
        </motion.div>

      </div>

      {/* Charts */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Monthly Trend */}
        <div className="rounded-[2.5rem] border border-black/5 dark:border-white/5 bg-white dark:bg-card p-8">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="text-lg font-bold text-black dark:text-white">6-Month Overview</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-medium text-muted-foreground">Income</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-rose-500" />
                <span className="text-xs font-medium text-muted-foreground">Expenses</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthlyTrend} margin={{ top: 10, right: 0, left: -20, bottom: 0 }} barGap={3}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.85} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.25} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.85} />
                    <stop offset="100%" stopColor="#f43f5e" stopOpacity={0.25} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="rgba(161, 161, 170, 0.08)" strokeDasharray="4 4" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'rgba(161, 161, 170, 0.7)', fontSize: 11, fontWeight: 500 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(161, 161, 170, 0.7)', fontSize: 11, fontWeight: 500 }} tickFormatter={(v) => v === 0 ? '' : `${(v/1000).toFixed(0)}k`} />
                <Tooltip 
                  cursor={{ fill: 'rgba(0, 0, 0, 0.015)', radius: 8 }}
                  content={<MonthlyTrendTooltip />}
                  wrapperStyle={{ zIndex: 1000 }}
                />
                <Bar dataKey="income" name="Income" fill="url(#incomeGrad)" radius={[4, 4, 0, 0]} barSize={12} />
                <Bar dataKey="expenses" name="Expenses" fill="url(#expenseGrad)" radius={[4, 4, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Pie */}
        <div className="rounded-[2.5rem] border border-black/5 dark:border-white/5 bg-white dark:bg-card p-8">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="text-lg font-bold text-black dark:text-white">Category Breakdown</h3>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">This Month</span>
          </div>
          
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr),minmax(0,1.2fr)] items-center">
            <div className="relative h-[280px] w-full flex items-center justify-center">
              {stats.expensesByCategory.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <defs>
                        <linearGradient id="pieGrad0" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#0d9488" stopOpacity={0.95} />
                          <stop offset="100%" stopColor="#14b8a6" stopOpacity={0.65} />
                        </linearGradient>
                        <linearGradient id="pieGrad1" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#2563eb" stopOpacity={0.95} />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.65} />
                        </linearGradient>
                        <linearGradient id="pieGrad2" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#d97706" stopOpacity={0.95} />
                          <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.65} />
                        </linearGradient>
                        <linearGradient id="pieGrad3" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.95} />
                          <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.65} />
                        </linearGradient>
                        <linearGradient id="pieGrad4" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#e11d48" stopOpacity={0.95} />
                          <stop offset="100%" stopColor="#f43f5e" stopOpacity={0.65} />
                        </linearGradient>
                      </defs>
                      <Pie 
                        data={stats.expensesByCategory} 
                        cx="50%" 
                        cy="50%" 
                        innerRadius={85} 
                        outerRadius={110} 
                        paddingAngle={4} 
                        dataKey="value" 
                        stroke="none"
                        animationBegin={0}
                        animationDuration={1200}
                      >
                        {stats.expensesByCategory.map((_: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={`url(#pieGrad${index % 5})`} />
                        ))}
                      </Pie>
                      <Tooltip 
                        content={<CategoryBreakdownTooltip total={stats.expenses} />} 
                        wrapperStyle={{ zIndex: 1000 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Centered Total */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">Total</p>
                    <p className="text-2xl font-bold font-sans tabular-nums tracking-tight text-black dark:text-white">
                      IDR {stats.expenses.toLocaleString('id-ID')}
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-2 text-center">
                  <div className="rounded-full bg-black/5 dark:bg-white/5 p-4 text-muted-foreground">
                    <TrendingDown className="h-8 w-8" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">No expenses this month</p>
                </div>
              )}
            </div>

            {/* List Legend */}
            <div className="space-y-5">
              {stats.expensesByCategory.length > 0 ? (
                stats.expensesByCategory.slice(0, 5).map((cat: any, i: number) => (
                  <div key={cat.name} className="flex items-center justify-between group cursor-default">
                    <div className="flex items-center gap-4">
                      <div className="h-3 w-3 rounded-full shadow-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-black dark:text-white uppercase tracking-tight group-hover:text-emerald-500 transition-colors">{cat.name}</span>
                        <span className="text-[10px] font-sans font-bold tabular-nums text-muted-foreground">
                          {((cat.value / stats.expenses) * 100).toFixed(0)}% of total
                        </span>
                      </div>
                    </div>
                    <span className="text-sm font-bold font-sans tabular-nums tracking-tight text-black dark:text-white group-hover:translate-x-[-4px] transition-transform">
                      IDR {cat.value.toLocaleString('id-ID')}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-[10px] text-center text-muted-foreground italic">Add transactions to see breakdown</p>
              )}
              {stats.expensesByCategory.length > 5 && (
                <div className="pt-4 flex justify-center border-t border-black/5 dark:border-white/5">
                  <p className="px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                    + {stats.expensesByCategory.length - 5} more categories
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
