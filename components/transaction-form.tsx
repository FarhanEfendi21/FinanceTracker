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
import { PlusCircle, Loader2, Utensils, Car, Zap, Film, Heart, ShoppingBag, Briefcase, Coins, Gift, Wallet, Tag } from 'lucide-react'
import { toast } from 'sonner'

const iconMap: Record<string, any> = {
  Utensils, Car, Zap, Film, Heart, ShoppingBag, Briefcase, Coins, Gift, Wallet, Tag
}

export default function TransactionForm({ onTransactionAdded }: { onTransactionAdded: () => void }) {
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [categories, setCategories] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null)
    })

    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true })

      if (!error && data && data.length > 0) {
        setCategories(data)
      } else {
        setCategories([])
      }
    }
    fetchCategories()
  }, [supabase])

  const filteredCategories = categories
    .filter(c => c.type === type)
    .filter((v, i, a) => a.findIndex(t => t.name === v.name) === i)

  const handleTypeChange = (newType: 'income' | 'expense') => {
    setType(newType)
    setCategory('') // Reset category when type changes
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!category || !amount) {
      toast.error('Please fill in all required fields.')
      return
    }

    const parsedAmount = parseFloat(amount)
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error('Please enter a valid amount.')
      return
    }

    if (!userId) {
      toast.error('You must be logged in to save transactions.')
      return
    }

    setLoading(true)
    const { error } = await supabase.from('transactions').insert({
      user_id: userId,
      type,
      category,
      amount: parsedAmount,
      description,
      date,
    })

    if (!error) {
      setCategory('')
      setAmount('')
      setDescription('')
      setDate(new Date().toISOString().split('T')[0])
      onTransactionAdded()
      toast.success(`${type === 'income' ? 'Income' : 'Expense'} recorded successfully!`)
    } else {
      console.error('Insert error:', error)
      toast.error(`Failed to save: ${error.message}`)
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => handleTypeChange('expense')}
          className={`flex-1 rounded-2xl py-3 text-xs font-bold uppercase tracking-widest transition-all ${
            type === 'expense' 
              ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg shadow-black/10 dark:shadow-white/5' 
              : 'bg-black/5 dark:bg-white/5 text-muted-foreground hover:bg-black/10 dark:hover:bg-white/10'
          }`}
        >
          Expense
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange('income')}
          className={`flex-1 rounded-2xl py-3 text-xs font-bold uppercase tracking-widest transition-all ${
            type === 'income' 
              ? 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-lg shadow-emerald-600/10' 
              : 'bg-black/5 dark:bg-white/5 text-muted-foreground hover:bg-black/10 dark:hover:bg-white/10'
          }`}
        >
          Income
        </button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Category</label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-12 rounded-2xl border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] focus:ring-0 focus:ring-offset-0">
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
              placeholder="0"
              min="1"
              className="h-12 rounded-2xl border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] pl-12 font-bold focus-visible:ring-0 focus-visible:ring-offset-0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Date</label>
            <Input
              type="date"
              className="h-12 rounded-2xl border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] focus-visible:ring-0 focus-visible:ring-offset-0"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Note</label>
            <Input
              type="text"
              placeholder="Optional"
              className="h-12 rounded-2xl border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] focus-visible:ring-0 focus-visible:ring-offset-0"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Button 
        type="submit" 
        className="h-12 w-full rounded-2xl bg-black dark:bg-white text-xs font-bold uppercase tracking-[0.2em] text-white dark:text-black shadow-xl shadow-black/10 dark:shadow-white/5 transition-all hover:scale-[1.02] active:scale-[0.98]" 
        disabled={loading}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirm Transaction'}
      </Button>
    </form>
  )
}
