'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import TransactionForm from '@/components/transaction-form'
import TransactionList from '@/components/transaction-list'
import DashboardHeader from '@/components/dashboard-header'
import { Search, Download, Plus, SlidersHorizontal, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from 'sonner'

export default function TransactionsPage() {
  const [user, setUser] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
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
        .order('date', { ascending: false })

      if (!error) {
        setTransactions(data || [])
      }
      setLoading(false)
    }
    fetchTransactions()
  }, [refreshKey, supabase])

  // Client-side filtering
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = !searchQuery || 
        t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesType = typeFilter === 'all' || t.type === typeFilter
      
      const txDate = new Date(t.date)
      const matchesFrom = !dateFrom || txDate >= new Date(dateFrom)
      const matchesTo = !dateTo || txDate <= new Date(dateTo)

      return matchesSearch && matchesType && matchesFrom && matchesTo
    })
  }, [transactions, searchQuery, typeFilter, dateFrom, dateTo])

  const handleTransactionAdded = () => {
    setRefreshKey(prev => prev + 1)
    setIsDialogOpen(false)
  }

  const hasActiveFilters = typeFilter !== 'all' || dateFrom || dateTo

  const clearFilters = () => {
    setTypeFilter('all')
    setDateFrom('')
    setDateTo('')
  }

  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) {
      toast.error('No transactions to export.')
      return
    }

    const headers = ['Date', 'Type', 'Category', 'Amount (IDR)', 'Note']
    const rows = filteredTransactions.map(t => [
      new Date(t.date).toLocaleDateString('id-ID'),
      t.type,
      t.category,
      parseFloat(t.amount).toFixed(2),
      t.description || ''
    ])

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `flowledger-transactions-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success(`Exported ${filteredTransactions.length} transactions to CSV.`)
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader user={user} />

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8 pb-24 lg:pb-8">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white">Transactions</h2>
            <p className="text-sm font-medium text-muted-foreground">
              Manage and track all your financial activities.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={handleExportCSV}
              className="h-11 rounded-2xl border-black/5 dark:border-white/5 bg-white dark:bg-card font-bold hover:bg-black/5 dark:hover:bg-white/5"
            >
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="h-11 rounded-2xl bg-black dark:bg-white font-bold text-white dark:text-black shadow-lg shadow-black/10 dark:shadow-white/5 transition-all hover:scale-[1.02] active:scale-[0.98]">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Transaction
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] rounded-[2.5rem] border-none p-8">
                <DialogHeader className="mb-4">
                  <DialogTitle className="text-xl font-bold">Add Transaction</DialogTitle>
                  <DialogDescription className="text-xs font-medium text-muted-foreground">
                    Create a new record of your income or expense.
                  </DialogDescription>
                </DialogHeader>
                <TransactionForm onTransactionAdded={handleTransactionAdded} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="space-y-8">
          {/* Search and Filters */}
          <div className="flex flex-col gap-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by category or note..."
                  className="h-12 w-full rounded-2xl border-black/5 dark:border-white/5 bg-white dark:bg-card pl-12 focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className={`h-12 rounded-2xl border-black/5 px-6 font-bold transition-all ${
                  hasActiveFilters 
                    ? 'bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90' 
                    : 'bg-white dark:bg-card hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filter
                {hasActiveFilters && (
                  <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-white/20 dark:bg-black/20 text-[10px] font-sans font-bold tabular-nums">
                    {[typeFilter !== 'all', !!dateFrom, !!dateTo].filter(Boolean).length}
                  </span>
                )}
              </Button>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="flex flex-wrap items-end gap-4 rounded-2xl border border-black/5 dark:border-white/5 bg-white dark:bg-card p-5">
                <div className="min-w-[160px] space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Type</label>
                  <Select value={typeFilter} onValueChange={(v: any) => setTypeFilter(v)}>
                    <SelectTrigger className="h-11 rounded-xl border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">From</label>
                  <Input
                    type="date"
                    className="h-11 rounded-xl border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] focus-visible:ring-0"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">To</label>
                  <Input
                    type="date"
                    className="h-11 rounded-xl border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] focus-visible:ring-0"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </div>
                {hasActiveFilters && (
                  <Button 
                    variant="ghost" 
                    onClick={clearFilters}
                    className="h-11 rounded-xl text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Clear Filters
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* List */}
          <div className="rounded-[2.5rem] border border-black/5 dark:border-white/5 bg-white dark:bg-card p-8">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-widest text-black dark:text-white">History</h3>
              <span className="rounded-full bg-black/5 dark:bg-white/5 px-3 py-1 text-xs font-bold text-black dark:text-white">
                <span className="font-sans tabular-nums">{filteredTransactions.length}</span> {filteredTransactions.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <TransactionList 
              transactions={filteredTransactions} 
              loading={loading} 
              onUpdate={() => setRefreshKey(prev => prev + 1)} 
            />
          </div>
        </div>
      </main>
    </div>
  )
}
