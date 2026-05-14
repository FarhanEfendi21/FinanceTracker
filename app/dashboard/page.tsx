'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import DashboardHeader from '@/components/dashboard-header'
import TransactionForm from '@/components/transaction-form'
import TransactionList from '@/components/transaction-list'
import DashboardStats from '@/components/dashboard-stats'
import { Card } from '@/components/ui/card'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
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

      if (!error) {
        setTransactions(data || [])
      }
      setLoading(false)
    }

    fetchTransactions()
  }, [user, refreshKey, supabase])

  const handleTransactionAdded = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} />

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="space-y-8">
          <DashboardStats transactions={transactions} />

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <Card className="p-6">
                <h2 className="mb-4 text-lg font-semibold">Add Transaction</h2>
                <TransactionForm onTransactionAdded={handleTransactionAdded} />
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card className="p-6">
                <h2 className="mb-4 text-lg font-semibold">Recent Transactions</h2>
                <TransactionList transactions={transactions} loading={loading} onUpdate={handleTransactionAdded} />
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
