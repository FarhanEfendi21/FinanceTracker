'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import DashboardHeader from '@/components/dashboard-header'
import { 
  Plus, 
  Trash2, 
  Tag, 
  Utensils, 
  Car, 
  Zap, 
  Film, 
  Heart, 
  ShoppingBag, 
  Briefcase, 
  Coins, 
  Gift, 
  Wallet
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

const iconOptions = [
  { name: 'Utensils', icon: Utensils },
  { name: 'Car', icon: Car },
  { name: 'Zap', icon: Zap },
  { name: 'Film', icon: Film },
  { name: 'Heart', icon: Heart },
  { name: 'ShoppingBag', icon: ShoppingBag },
  { name: 'Briefcase', icon: Briefcase },
  { name: 'Coins', icon: Coins },
  { name: 'Gift', icon: Gift },
  { name: 'Wallet', icon: Wallet },
  { name: 'Tag', icon: Tag },
]

export default function CategoriesPage() {
  const [user, setUser] = useState<any>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newCat, setNewCat] = useState({ name: '', type: 'expense', icon: 'Tag', color: '#000000' })
  
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase])

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true })

      if (!error) {
        setCategories(data || [])
      } else {
        console.warn('Categories table fetch error:', error)
        setCategories([])
      }
      setLoading(false)
    }

    fetchCategories()
  }, [supabase])

  const handleAddCategory = async () => {
    if (!newCat.name) return

    let currentUser = user
    if (!currentUser) {
      const { data: { user: fetchedUser } } = await supabase.auth.getUser()
      if (!fetchedUser) {
        toast.error('Authentication required. Please sign in.')
        return
      }
      currentUser = fetchedUser
      setUser(fetchedUser)
    }

    // Client-side check for duplicate
    const exists = categories.find(
      c => c.name.toLowerCase() === newCat.name.toLowerCase() && c.type === newCat.type
    )
    if (exists) {
      toast.error(`Category "${newCat.name}" already exists for ${newCat.type}`)
      return
    }

    const { data, error } = await supabase
      .from('categories')
      .insert([
        { ...newCat, user_id: currentUser.id }
      ])
      .select()

    if (!error) {
      setCategories([...categories, data[0]])
      setIsDialogOpen(false)
      setNewCat({ name: '', type: 'expense', icon: 'Tag', color: '#000000' })
      toast.success('Category created successfully')
    } else {
      if (error.code === '23505') {
        toast.error('Category with this name already exists')
      } else {
        toast.error(error.message)
      }
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error
      
      setCategories(categories.filter(c => c.id !== id))
      toast.success('Category deleted successfully')
    } catch (error: any) {
      console.error('Delete error:', error)
      toast.error(error.message || 'Failed to delete category')
    }
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader user={user} />

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8 pb-24 lg:pb-8">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white">Categories</h2>
            <p className="text-sm font-medium text-muted-foreground">
              Personalize your transaction categories with icons and colors.
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="h-11 rounded-2xl bg-black dark:bg-white font-bold text-white dark:text-black shadow-lg shadow-black/10 dark:shadow-white/5 transition-all hover:scale-[1.02] active:scale-[0.98]">
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-[2.5rem] border-black/5 dark:border-white/5 p-8 dark:bg-card">
              <DialogHeader className="mb-6">
                <DialogTitle className="text-xl font-bold">New Category</DialogTitle>
                <DialogDescription className="text-xs font-medium text-muted-foreground">
                  Create a custom category for your transactions.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Name</label>
                  <Input 
                    placeholder="e.g. Coffee, Rent, Side Project" 
                    className="h-12 rounded-2xl border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] focus-visible:ring-0"
                    value={newCat.name}
                    onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1 space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Type</label>
                    <Select value={newCat.type} onValueChange={(v) => setNewCat({ ...newCat, type: v })}>
                      <SelectTrigger className="h-12 rounded-2xl border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        <SelectItem value="expense">Expense</SelectItem>
                        <SelectItem value="income">Income</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Icon</label>
                    <Select value={newCat.icon} onValueChange={(v) => setNewCat({ ...newCat, icon: v })}>
                      <SelectTrigger className="h-12 rounded-2xl border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        {iconOptions.map(opt => (
                          <SelectItem key={opt.name} value={opt.name}>
                            <div className="flex items-center gap-2">
                              <opt.icon className="h-4 w-4" />
                              <span>{opt.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={handleAddCategory}
                  className="h-12 w-full rounded-2xl bg-black dark:bg-white text-xs font-bold uppercase tracking-[0.2em] text-white dark:text-black shadow-xl shadow-black/10 dark:shadow-white/5"
                >
                  Create Category
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-12">
          {(['income', 'expense'] as const).map((type) => {
            const filteredCats = categories.filter(c => c.type === type);
            const title = type === 'expense' ? 'Expense' : 'Income';
            
            return (
              <div key={type} className="space-y-6">
                <div className="flex items-center gap-2 px-2">
                  <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">{title}</h3>
                  <span className="rounded-full bg-black/5 dark:bg-white/5 px-3 py-1 text-[10px] font-sans font-bold tabular-nums text-muted-foreground">
                    {filteredCats.length}
                  </span>
                </div>
                
                {filteredCats.length === 0 && !loading ? (
                  <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-black/10 dark:border-white/10 py-12 text-center">
                    <p className="text-xs font-medium text-muted-foreground">No {type} categories</p>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredCats.map((cat) => {
                      const IconComponent = iconOptions.find(i => i.name === cat.icon)?.icon || Tag
                      const iconBgColor = type === 'expense' 
                        ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400' 
                        : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
                      
                      return (
                        <div 
                          key={cat.id} 
                          className="group relative flex items-center justify-between rounded-[2rem] border border-black/5 dark:border-white/5 bg-white dark:bg-card p-6 transition-all hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-white/5"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconBgColor}`}>
                              <IconComponent className="h-6 w-6" />
                            </div>
                            <div>
                              <h4 className="font-bold text-black dark:text-white">{cat.name}</h4>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{cat.type}</p>
                            </div>
                          </div>

                          <Button
                            onClick={() => handleDeleteCategory(cat.id)}
                            variant="ghost"
                            size="sm"
                            className="h-10 w-10 rounded-xl text-muted-foreground opacity-0 transition-opacity hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 dark:hover:text-rose-400 group-hover:opacity-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
