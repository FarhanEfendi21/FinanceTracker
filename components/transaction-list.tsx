'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

export default function TransactionList({
  transactions,
  loading,
  onUpdate,
}: {
  transactions: any[]
  loading: boolean
  onUpdate: () => void
}) {
  const supabase = createClient()

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id)
    if (!error) {
      onUpdate()
    }
  }

  if (loading) {
    return <div className="text-center text-muted-foreground">Loading transactions...</div>
  }

  if (transactions.length === 0) {
    return <div className="text-center text-muted-foreground">No transactions yet</div>
  }

  return (
    <div className="space-y-2">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between rounded-lg border border-border bg-background p-4 hover:bg-muted/50"
        >
          <div className="flex-1">
            <p className="font-medium text-foreground">{transaction.category}</p>
            {transaction.description && <p className="text-sm text-muted-foreground">{transaction.description}</p>}
            <p className="text-xs text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p
                className={`font-semibold ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {transaction.type === 'income' ? '+' : '-'}${parseFloat(transaction.amount).toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground capitalize">{transaction.type}</p>
            </div>
            <Button
              onClick={() => handleDelete(transaction.id)}
              variant="ghost"
              size="sm"
              className="text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
