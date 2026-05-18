'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Trash2, ArrowUpRight, ArrowDownRight, Tag, Calendar, Pencil, Loader2, Utensils, Car, Zap, Film, Heart, ShoppingBag, Briefcase, Coins, Gift, Wallet } from 'lucide-react'
import { toast } from 'sonner'

const iconMap: Record<string, any> = {
  Utensils, Car, Zap, Film, Heart, ShoppingBag, Briefcase, Coins, Gift, Wallet, Tag
}

function EditTransactionModal({ 
  transaction, 
  open, 
  onClose, 
  onUpdate,
  categories
}: { 
  transaction: any
  open: boolean
  onClose: () => void
  onUpdate: () => void
  categories: any[]
}) {
  const [type, setType] = useState<'income' | 'expense'>(transaction.type)
  const [category, setCategory] = useState(transaction.category)
  const [amount, setAmount] = useState(String(transaction.amount))
  const [description, setDescription] = useState(transaction.description || '')
  const [date, setDate] = useState(transaction.date)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const filteredCategories = categories
    .filter(c => c.type === type)
    .filter((v, i, a) => a.findIndex(t => t.name === v.name) === i)

  const handleSave = async () => {
    if (!category || !amount) return
    setLoading(true)
    const { error } = await supabase
      .from('transactions')
      .update({ type, category, amount: parseFloat(amount), description, date })
      .eq('id', transaction.id)

    if (!error) {
      toast.success('Transaction updated successfully!')
      onUpdate()
      onClose()
    } else {
      toast.error('Failed to update transaction.')
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-[2.5rem] border-none p-8">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-xl font-bold">Edit Transaction</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Type Toggle */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setType('expense'); setCategory('') }}
              className={`flex-1 rounded-2xl py-3 text-xs font-bold uppercase tracking-widest transition-all ${
                type === 'expense' ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg shadow-black/10 dark:shadow-white/5' : 'bg-black/5 dark:bg-white/5 text-muted-foreground hover:bg-black/10 dark:hover:bg-white/10'
              }`}
            >Expense</button>
            <button
              type="button"
              onClick={() => { setType('income'); setCategory('') }}
              className={`flex-1 rounded-2xl py-3 text-xs font-bold uppercase tracking-widest transition-all ${
                type === 'income' ? 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-lg shadow-emerald-600/10' : 'bg-black/5 dark:bg-white/5 text-muted-foreground hover:bg-black/10 dark:hover:bg-white/10'
              }`}
            >Income</button>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-12 rounded-2xl border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-black/5 dark:border-white/5 p-2 dark:bg-card max-h-[300px]">
                {filteredCategories.map((cat) => {
                  const IconComponent = iconMap[cat.icon] || Tag
                  return (
                    <SelectItem key={cat.name} value={cat.name} className="rounded-xl focus:bg-black/5 dark:focus:bg-white/5">
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4" />
                        <span>{cat.name}</span>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">IDR</span>
              <Input
                type="number"
                min="1"
                className="h-12 rounded-2xl border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] pl-12 font-bold font-mono tabular-nums tracking-tight focus-visible:ring-0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Date</label>
              <Input type="date" className="h-12 rounded-2xl border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] focus-visible:ring-0" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Note</label>
              <Input type="text" placeholder="Optional" className="h-12 rounded-2xl border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] focus-visible:ring-0" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={loading}
            className="h-12 w-full rounded-2xl bg-black dark:bg-white text-xs font-bold uppercase tracking-[0.2em] text-white dark:text-black shadow-xl shadow-black/10 dark:shadow-white/5"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function TransactionList({
  transactions,
  loading,
  onUpdate,
}: {
  transactions: any[]
  loading: boolean
  onUpdate: () => void
}) {
  const [editingTransaction, setEditingTransaction] = useState<any>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [incomePage, setIncomePage] = useState(1)
  const [expensePage, setExpensePage] = useState(1)
  const itemsPerPage = 5
  const supabase = createClient()

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true })

      if (!error && data) {
        setCategories(data)
      }
    }
    fetchCategories()
  }, [supabase])

  const getCategoryIcon = (categoryName: string, type: string) => {
    const cat = categories.find(c => c.name === categoryName && c.type === type)
    const IconComp = cat ? (iconMap[cat.icon] || Tag) : (type === 'income' ? ArrowUpRight : ArrowDownRight)
    return <IconComp className="h-6 w-6" />
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    const { error } = await supabase.from('transactions').delete().eq('id', id)
    if (!error) {
      toast.success('Transaction deleted.')
      onUpdate()
    } else {
      toast.error('Failed to delete transaction.')
    }
    setDeletingId(null)
  }

  const incomeTransactions = transactions.filter(t => t.type === 'income')
  const expenseTransactions = transactions.filter(t => t.type === 'expense')

  const renderSection = (title: string, data: any[], currentPage: number, setCurrentPage: (p: number) => void, type: 'income' | 'expense') => {
    const totalPages = Math.ceil(data.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedData = data.slice(startIndex, startIndex + itemsPerPage)

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">{title}</h3>
          <span className="rounded-full bg-black/5 dark:bg-white/5 px-3 py-1 text-[10px] font-bold text-muted-foreground">
            {data.length} Total
          </span>
        </div>

        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-black/10 dark:border-white/10 py-10 text-center">
            <p className="text-xs font-medium text-muted-foreground">No {title.toLowerCase()} recorded</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {paginatedData.map((transaction) => (
                <div
                  key={transaction.id}
                  className="group flex items-center justify-between rounded-[1.5rem] border border-black/5 dark:border-white/5 bg-white dark:bg-card p-5 transition-all hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-white/5"
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                      type === 'income' ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400'
                    }`}>
                      {getCategoryIcon(transaction.category, transaction.type)}
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-black dark:text-white">{transaction.category}</span>
                      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {transaction.description && <span className="truncate max-w-[100px]">{transaction.description}</span>}
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(transaction.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right mr-2">
                      <p className={`text-sm font-bold font-mono tabular-nums tracking-tight ${type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-black dark:text-white'}`}>
                        {type === 'income' ? '+' : '-'} IDR {parseFloat(transaction.amount).toLocaleString('id-ID')}
                      </p>
                    </div>

                    <Button
                      onClick={() => setEditingTransaction(transaction)}
                      variant="ghost"
                      size="sm"
                      className="h-9 w-9 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:text-rose-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-[2rem]">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Transaction?</AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(transaction.id)}
                            className="rounded-xl bg-rose-600 text-white"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-2">
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                  Page {currentPage} / {totalPages}
                </p>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="h-8 rounded-lg text-[9px] font-bold uppercase"
                  >Prev</Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="h-8 rounded-lg text-[9px] font-bold uppercase"
                  >Next</Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 w-full animate-pulse rounded-2xl bg-black/[0.03]" />
        ))}
      </div>
    )
  }

  return (
    <>
      {/* Edit Modal */}
      {editingTransaction && (
        <EditTransactionModal
          transaction={editingTransaction}
          open={!!editingTransaction}
          onClose={() => setEditingTransaction(null)}
          onUpdate={onUpdate}
          categories={categories}
        />
      )}

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Income Section */}
        {renderSection('Income', incomeTransactions, incomePage, setIncomePage, 'income')}

        {/* Expense Section */}
        {renderSection('Expense', expenseTransactions, expensePage, setExpensePage, 'expense')}
      </div>
    </>
  )
}
