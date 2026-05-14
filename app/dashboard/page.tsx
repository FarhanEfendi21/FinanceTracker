'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import DashboardHeader from '@/components/dashboard-header'
import TransactionForm from '@/components/transaction-form'
import TransactionList from '@/components/transaction-list'
import DashboardStats from '@/components/dashboard-stats'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }
      setUser(user)
    }
    getUser()
  }, [supabase, router])

  useEffect(() => {
    if (!user) return
    const fetchTransactions = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false })
      if (!error) setTransactions(data || [])
      setLoading(false)
    }
    fetchTransactions()
  }, [user, refreshKey, supabase])

  const handleTransactionAdded = () => {
    setRefreshKey((prev) => prev + 1)
    setIsDialogOpen(false)
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader user={user} />

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8 pb-24 lg:pb-8">
        {/* Page Header */}
        <div className="mb-10 flex items-end justify-between">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white">
              Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : user?.email ? `, ${user.email.split('@')[0]}` : ''}
            </h2>
            <p className="text-sm font-medium text-muted-foreground">
              Here's what's happening with your finances today.
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="h-11 rounded-2xl bg-black dark:bg-white font-bold text-white dark:text-black shadow-lg shadow-black/10 dark:shadow-white/5 transition-all hover:scale-[1.02] active:scale-[0.98]">
                <Plus className="mr-2 h-4 w-4" />
                Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-[2.5rem] border border-black/5 dark:border-white/5 bg-white dark:bg-card p-8">
              <DialogHeader className="mb-4">
                <DialogTitle className="text-xl font-bold">Add Transaction</DialogTitle>
                <DialogDescription className="text-xs font-medium text-muted-foreground">
                  Record a new income or expense entry.
                </DialogDescription>
              </DialogHeader>
              <TransactionForm onTransactionAdded={handleTransactionAdded} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-12">
          {/* Stats Section */}
          <DashboardStats transactions={transactions} />

          {/* Recent Activity */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-bold uppercase tracking-widest text-black dark:text-white">Recent Activity</h3>
              <span className="text-xs font-medium text-muted-foreground">
                {transactions.length} {transactions.length === 1 ? 'entry' : 'entries'}
              </span>
            </div>
            <TransactionList
              transactions={transactions.slice(0, 10)}
              loading={loading}
              onUpdate={handleTransactionAdded}
            />
          </div>
        </div>
      </main>

      {/* Mobile FAB */}
      <button
        className="fixed bottom-24 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-black dark:bg-white text-white dark:text-black shadow-2xl shadow-black/20 dark:shadow-white/5 lg:hidden z-40 transition-transform hover:scale-105 active:scale-95"
        onClick={() => setIsDialogOpen(true)}
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  )
}
