import { Wallet, Mail, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function Page() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#F9F9F9] p-6 md:p-10">
      <div className="w-full max-w-[400px] space-y-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white shadow-lg">
            <Wallet className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-black">FlowLedger</h1>
        </div>

        <div className="rounded-3xl border border-black/5 bg-white p-8 shadow-sm text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
              <Mail className="h-8 w-8" />
            </div>
          </div>
          
          <h2 className="mb-2 text-2xl font-bold text-black">Check your email</h2>
          <p className="mb-8 text-sm text-muted-foreground">
            We've sent a confirmation link to your email address. Please click the link to activate your account.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3 text-left rounded-xl bg-blue-50/50 p-4 border border-blue-100/50">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-blue-600 shrink-0" />
              <p className="text-xs leading-relaxed text-blue-900">
                If you don't see the email, check your <strong>spam</strong> or <strong>junk</strong> folder.
              </p>
            </div>

            <Link 
              href="/auth/login" 
              className="flex h-12 w-full items-center justify-center rounded-xl bg-black font-semibold text-white hover:bg-black/90 transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </div>
        
        <p className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} FlowLedger. All rights reserved.
        </p>
      </div>
    </div>
  )
}

