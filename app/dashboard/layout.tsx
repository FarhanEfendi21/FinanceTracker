'use client'

import Sidebar from '@/components/sidebar'
import { Toaster } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-muted/30 dark:bg-background transition-colors duration-500">
      <Sidebar />
      <div className="flex-1 lg:pl-72 min-w-0">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
      <Toaster 
        position="bottom-right"
        toastOptions={{
          className: "bg-white dark:bg-card border border-black/5 dark:border-white/5 text-black dark:text-white rounded-2xl shadow-lg",
          style: {
            fontSize: '13px',
            fontWeight: '600',
          }
        }}
      />
    </div>
  )
}
