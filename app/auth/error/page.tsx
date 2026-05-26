import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
import Logo from '@/components/logo'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>
}) {
  const params = await searchParams

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#F9F9F9] p-6 md:p-10">
      <div className="w-full max-w-[400px] space-y-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Logo iconSize={48} showBg={true} className="rounded-2xl shadow-lg" />
          <h1 className="text-3xl font-bold tracking-tight text-black">FlowLedger</h1>
        </div>

        <div className="rounded-3xl border border-black/5 bg-white p-8 shadow-sm text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
              <AlertCircle className="h-8 w-8" />
            </div>
          </div>
          
          <h2 className="mb-2 text-2xl font-bold text-black">Something went wrong</h2>
          <div className="mb-8 rounded-xl bg-red-50/50 p-4 border border-red-100/50">
            {params?.error ? (
              <p className="text-sm font-medium text-red-900">
                Error: {params.error}
              </p>
            ) : (
              <p className="text-sm font-medium text-red-900">
                An unspecified error occurred.
              </p>
            )}
          </div>

          <Link 
            href="/auth/login" 
            className="flex h-12 w-full items-center justify-center rounded-xl bg-black font-semibold text-white hover:bg-black/90 transition-colors"
          >
            Try Again
          </Link>
        </div>
        
        <p className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} FlowLedger. All rights reserved.
        </p>
      </div>
    </div>
  )
}

