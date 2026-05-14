import Sidebar from '@/components/sidebar'
import { Toaster } from 'sonner'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-muted/30 dark:bg-background transition-colors duration-500">
      <Sidebar />
      <div className="flex-1 lg:pl-64">
        {children}
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
