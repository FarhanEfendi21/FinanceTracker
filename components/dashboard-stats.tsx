'use client'

import { useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'

export default function DashboardStats({ transactions }: { transactions: any[] }) {
  const stats = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0)

    const expenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0)

    const balance = income - expenses

    // Category breakdown for expenses
    const expensesByCategory = transactions
      .filter((t) => t.type === 'expense')
      .reduce(
        (acc, t) => {
          const existing = acc.find((item) => item.name === t.category)
          if (existing) {
            existing.value += parseFloat(t.amount)
          } else {
            acc.push({ name: t.category, value: parseFloat(t.amount) })
          }
          return acc
        },
        [] as { name: string; value: number }[]
      )

    // Monthly trend
    const monthlyData: { [key: string]: { income: number; expenses: number } } = {}
    transactions.forEach((t) => {
      const month = new Date(t.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expenses: 0 }
      }
      const amount = parseFloat(t.amount)
      if (t.type === 'income') {
        monthlyData[month].income += amount
      } else {
        monthlyData[month].expenses += amount
      }
    })

    const monthlyTrend = Object.entries(monthlyData)
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .slice(-6)
      .map(([month, data]) => ({
        month,
        income: data.income,
        expenses: data.expenses,
      }))

    return { income, expenses, balance, expensesByCategory, monthlyTrend }
  }, [transactions])

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e', '#10b981', '#06b6d4', '#0ea5e9']

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Balance</p>
              <p className={`text-2xl font-bold ${stats.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${Math.abs(stats.balance).toFixed(2)}
              </p>
            </div>
            <Wallet className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Income</p>
              <p className="text-2xl font-bold text-green-600">${stats.income.toFixed(2)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Expenses</p>
              <p className="text-2xl font-bold text-red-600">${stats.expenses.toFixed(2)}</p>
            </div>
            <TrendingDown className="h-8 w-8 text-red-600" />
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Trend Chart */}
        {stats.monthlyTrend.length > 0 && (
          <Card className="p-6">
            <h3 className="mb-4 font-semibold text-foreground">Monthly Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
                <Legend />
                <Bar dataKey="income" fill="#10b981" />
                <Bar dataKey="expenses" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* Expenses by Category */}
        {stats.expensesByCategory.length > 0 && (
          <Card className="p-6">
            <h3 className="mb-4 font-semibold text-foreground">Expenses by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.expensesByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: $${value.toFixed(0)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.expensesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        )}
      </div>
    </div>
  )
}
