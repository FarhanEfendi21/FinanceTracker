'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import DashboardHeader from '@/components/dashboard-header'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts'
import { TrendingUp, TrendingDown, Calendar, Info } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

function getDateRangeStart(period: string): Date {
  const now = new Date()
  if (period === '3m') {
    return new Date(now.getFullYear(), now.getMonth() - 2, 1)
  } else if (period === '6m') {
    return new Date(now.getFullYear(), now.getMonth() - 5, 1)
  } else {
    return new Date(now.getFullYear(), now.getMonth() - 11, 1)
  }
}

export default function AnalyticsPage() {
  const [user, setUser] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('6m')
  
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase])

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: true })
      if (!error) {
        setTransactions(data || [])
      }
      setLoading(false)
    }
    fetchTransactions()
  }, [supabase])

  const stats = useMemo(() => {
    const rangeStart = getDateRangeStart(period)
    
    // Filter by period
    const filtered = transactions.filter(t => new Date(t.date) >= rangeStart)

    const monthlyData: { [key: string]: { income: number; expenses: number; date: Date } } = {}
    const categories: { [key: string]: number } = {}
    
    filtered.forEach(t => {
      const date = new Date(t.date)
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expenses: 0, date }
      }
      
      const amount = parseFloat(t.amount)
      if (t.type === 'income') {
        monthlyData[monthKey].income += amount
      } else {
        monthlyData[monthKey].expenses += amount
        categories[t.category] = (categories[t.category] || 0) + amount
      }
    })

    const trendData = Object.entries(monthlyData)
      .sort((a, b) => a[1].date.getTime() - b[1].date.getTime())
      .map(([name, data]) => ({
        name,
        income: data.income,
        expenses: data.expenses,
        savings: data.income - data.expenses
      }))

    const categoryData = Object.entries(categories)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)

    const totalIncome = filtered.filter(t => t.type === 'income').reduce((sum, t) => sum + parseFloat(t.amount), 0)
    const totalExpenses = filtered.filter(t => t.type === 'expense').reduce((sum, t) => sum + parseFloat(t.amount), 0)
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0
    const monthCount = trendData.length || 1

    return { trendData, categoryData, totalIncome, totalExpenses, savingsRate, monthCount }
  }, [transactions, period])

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#f43f5e']

  const periodLabel = period === '3m' ? '3 Months' : period === '6m' ? '6 Months' : '1 Year'

  return (
    <div className="min-h-screen">
      <DashboardHeader user={user} />

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8 pb-24 lg:pb-8">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white">Analytics</h2>
            <p className="text-sm font-medium text-muted-foreground">
              Deep dive into your financial habits and trends.
            </p>
          </div>

          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="h-11 w-[180px] rounded-2xl border-black/5 dark:border-white/5 bg-white dark:bg-card font-bold">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-black/5 dark:border-white/5 dark:bg-card">
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-8">
          {/* Key Metrics */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-[2rem] border border-black/5 dark:border-white/5 bg-white dark:bg-card p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Savings Rate</p>
              <div className="mt-2 flex items-baseline gap-2">
                <h3 className="text-3xl font-bold text-black dark:text-white">{stats.savingsRate.toFixed(1)}%</h3>
                <span className={`text-xs font-medium flex items-center ${stats.savingsRate >= 20 ? 'text-emerald-600' : stats.savingsRate >= 0 ? 'text-amber-500' : 'text-rose-600'}`}>
                  {stats.savingsRate >= 20 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {stats.savingsRate >= 20 ? 'Great' : stats.savingsRate >= 0 ? 'Fair' : 'Deficit'}
                </span>
              </div>
              <div className="mt-4 space-y-3">
                <div className="h-2 w-full overflow-hidden rounded-full bg-black/5 dark:bg-white/5">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.3)]" 
                    style={{ width: `${Math.min(100, Math.max(0, stats.savingsRate))}%` }} 
                  />
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Saving {stats.savingsRate.toFixed(1)}% of income in the last {periodLabel}.
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-black/5 dark:border-white/5 bg-white dark:bg-card p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Top Expense</p>
              <div className="mt-2">
                <h3 className="text-2xl font-bold text-black dark:text-white truncate">{stats.categoryData[0]?.name || '—'}</h3>
              </div>
              <p className="mt-4 text-[10px] text-muted-foreground leading-relaxed">
                {stats.categoryData[0] 
                  ? `IDR ${stats.categoryData[0].value.toLocaleString('id-ID')} spent in this period.`
                  : 'No expense data for this period.'}
              </p>
            </div>

            <div className="rounded-[2rem] border border-black/5 dark:border-white/5 bg-white dark:bg-card p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Monthly Avg Spend</p>
              <div className="mt-2">
                <h3 className="text-2xl font-bold text-black dark:text-white">
                  IDR {Math.round(stats.totalExpenses / stats.monthCount).toLocaleString('id-ID')}
                </h3>
              </div>
              <p className="mt-4 text-[10px] text-muted-foreground leading-relaxed">
                Averaged over {stats.monthCount} {stats.monthCount === 1 ? 'month' : 'months'}.
              </p>
            </div>
          </div>

          {/* Large Area Chart */}
          <div className="rounded-[2.5rem] border border-black/5 dark:border-white/5 bg-white dark:bg-card p-10">
            <div className="mb-10 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-black dark:text-white">Income vs Expenses</h3>
                <p className="text-xs font-medium text-muted-foreground">Monthly cash flow — last {periodLabel}</p>
              </div>
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-black dark:text-white">Income</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-rose-500" />
                  <span className="text-xs font-bold text-black dark:text-white">Expenses</span>
                </div>
              </div>
            </div>
            
            <div className="h-[400px] w-full">
              {stats.trendData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.trendData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.08}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.08}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} horizontal={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#A1A1AA', fontSize: 11, fontWeight: 500 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#A1A1AA', fontSize: 11, fontWeight: 500 }} tickFormatter={(v) => v === 0 ? '' : `${(v/1000).toFixed(0)}k`} />
                    <Tooltip 
                      formatter={(value: any, name: string) => [`IDR ${value.toLocaleString('id-ID')}`, name.charAt(0).toUpperCase() + name.slice(1)]}
                      contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '16px', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                      itemStyle={{ color: 'var(--foreground)' }}
                    />
                    <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" />
                    <Area type="monotone" dataKey="expenses" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorExpenses)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center flex-col gap-3 text-muted-foreground">
                  <TrendingUp className="h-12 w-12 opacity-20" />
                  <p className="text-sm font-medium">No data for this period</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Category Pie */}
            <div className="rounded-[2.5rem] border border-black/5 dark:border-white/5 bg-white dark:bg-card p-8">
              <h3 className="mb-8 text-lg font-bold text-black dark:text-white">Expense by Category</h3>
              {stats.categoryData.length > 0 ? (
                <>
                  <div className="h-[260px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={stats.categoryData} cx="50%" cy="50%" innerRadius={75} outerRadius={95} paddingAngle={2} dataKey="value" stroke="none">
                          {stats.categoryData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: any) => `IDR ${value.toLocaleString('id-ID')}`} contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 space-y-2">
                    {stats.categoryData.slice(0, 5).map((cat, i) => (
                      <div key={cat.name} className="flex items-center gap-3">
                        <div className="h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="text-xs font-bold text-black dark:text-white uppercase truncate flex-1">{cat.name}</span>
                        <span className="text-xs font-bold text-black dark:text-white">IDR {cat.value.toLocaleString('id-ID')}</span>
                        <span className="text-[10px] font-medium text-muted-foreground w-8 text-right">
                          {((cat.value / stats.totalExpenses) * 100).toFixed(0)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex h-[260px] items-center justify-center flex-col gap-3 text-muted-foreground">
                  <p className="text-sm font-medium">No expense data for this period</p>
                </div>
              )}
            </div>

            {/* Savings Bar */}
            <div className="rounded-[2.5rem] border border-black/5 dark:border-white/5 bg-white dark:bg-card p-8">
              <h3 className="mb-8 text-lg font-bold text-black dark:text-white">Monthly Net Savings</h3>
              <div className="h-[260px]">
                {stats.trendData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.trendData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid vertical={false} horizontal={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#A1A1AA', fontSize: 11, fontWeight: 500 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#A1A1AA', fontSize: 11, fontWeight: 500 }} tickFormatter={(v) => v === 0 ? '' : `${(v/1000).toFixed(0)}k`} />
                      <Tooltip 
                        formatter={(value: any) => [`IDR ${value.toLocaleString('id-ID')}`, 'Net Savings']}
                        contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '16px', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                        itemStyle={{ color: 'var(--foreground)' }}
                      />
                      <Bar dataKey="savings" radius={[4, 4, 0, 0]} barSize={24}>
                        {stats.trendData.map((entry, index) => (
                          <Cell key={`bar-${index}`} fill={entry.savings >= 0 ? '#10b981' : '#f43f5e'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <p className="text-sm font-medium">No data for this period</p>
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-2xl bg-black/5 dark:bg-white/5 p-4">
                <Info className="h-4 w-4 flex-shrink-0 text-black/40 dark:text-white/40" />
                <p className="text-[10px] font-medium text-muted-foreground">
                  <span className="text-emerald-500 font-bold">Green</span> bars = positive savings. <span className="text-rose-600 font-bold">Red</span> bars = spending exceeded income.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
