'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from './logo'

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // Check if splash screen was already shown in this browser session
    const hasShown = sessionStorage.getItem('flowledger_splash_shown')
    if (!hasShown) {
      setIsMounted(true)
      setIsVisible(true)
      
      const timer = setTimeout(() => {
        setIsVisible(false)
        sessionStorage.setItem('flowledger_splash_shown', 'true')
      }, 2000) // Play splash screen for 2 seconds

      const mountTimer = setTimeout(() => {
        setIsMounted(false)
      }, 2600) // Unmount after exit animation completes (600ms duration)

      return () => {
        clearTimeout(timer)
        clearTimeout(mountTimer)
      }
    }
  }, [])

  if (!isMounted) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            y: -20,
            transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-[#121212] select-none"
        >
          <div className="flex flex-col items-center gap-6">
            {/* Elegant logo container */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                transition: { 
                  delay: 0.15, 
                  duration: 0.8, 
                  ease: [0.16, 1, 0.3, 1] 
                } 
              }}
              className="relative flex items-center justify-center w-24 h-24 rounded-[2rem] bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/40 dark:border-zinc-800/40 shadow-xl shadow-black/[0.02] dark:shadow-white/[0.01]"
            >
              {/* Logo mark */}
              <Logo iconSize={56} showBg={false} className="text-black dark:text-white" />
              
              {/* Ambient glow behind logo */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-blue-500/10 to-cyan-500/10 blur-xl rounded-full" />
            </motion.div>

            {/* Typography */}
            <div className="flex flex-col items-center text-center">
              <motion.h1
                initial={{ opacity: 0, y: 8 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { 
                    delay: 0.4, 
                    duration: 0.6, 
                    ease: [0.16, 1, 0.3, 1] 
                  } 
                }}
                className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
              >
                FlowLedger
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, letterSpacing: '0.05em' }}
                animate={{ 
                  opacity: 0.6, 
                  letterSpacing: '0.15em',
                  transition: { 
                    delay: 0.6, 
                    duration: 0.8, 
                    ease: [0.16, 1, 0.3, 1] 
                  } 
                }}
                className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 mt-1.5 uppercase"
              >
                Personal Finance Manager
              </motion.p>
            </div>
          </div>

          {/* Micro loading indicator at bottom */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 0.4,
              transition: { delay: 0.8, duration: 0.5 }
            }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-1.5"
          >
            <div className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-bounce [animation-delay:-0.3s]" />
            <div className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-bounce [animation-delay:-0.15s]" />
            <div className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-bounce" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
