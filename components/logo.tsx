'use client'

import React from 'react'

interface LogoProps {
  className?: string
  iconSize?: number
  variant?: 'icon' | 'full'
  showBg?: boolean
}

export default function Logo({
  className = '',
  iconSize = 24,
  variant = 'icon',
  showBg = false,
}: LogoProps) {
  const logoMark = (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="select-none"
    >
      <defs>
        {/* Core theme gradients */}
        <linearGradient id="flowGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="50%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
        <linearGradient id="ledgerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0F172A" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#0F172A" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="ledgerGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.25" />
        </linearGradient>
        <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Decorative Glow */}
      <circle cx="50" cy="50" r="30" fill="url(#glowGrad)" filter="blur(8px)" />

      {/* Ledger background blocks (Isometric Grid layout representing columns/stability) */}
      {/* Column 1 (Left) */}
      <rect
        x="28"
        y="25"
        width="12"
        height="50"
        rx="6"
        className="fill-slate-900/10 dark:fill-white/10"
        stroke="currentColor"
        strokeOpacity="0.08"
        strokeWidth="1"
      />
      {/* Column 2 (Right) */}
      <rect
        x="48"
        y="35"
        width="12"
        height="40"
        rx="6"
        className="fill-slate-900/20 dark:fill-white/20"
        stroke="currentColor"
        strokeOpacity="0.12"
        strokeWidth="1"
      />

      {/* Flow line - Beautiful ribbon curve representing fluid cash flow/transactions */}
      {/* First layered shadow wave */}
      <path
        d="M 18 70 C 22 70, 24 30, 38 30 C 52 30, 48 60, 62 60 C 72 60, 76 46, 82 46"
        stroke="#2563EB"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.15"
        className="dark:opacity-20"
      />
      {/* Primary elegant flow line */}
      <path
        d="M 18 70 C 22 70, 24 30, 38 30 C 52 30, 48 60, 62 60 C 72 60, 76 46, 82 46"
        stroke="url(#flowGrad)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Minimalist foreground dots representing ledger data entry points */}
      <circle cx="38" cy="30" r="3.5" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2" />
      <circle cx="62" cy="60" r="3.5" fill="#FFFFFF" stroke="#06B6D4" strokeWidth="2" />
    </svg>
  )

  if (variant === 'full') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div
          className={`flex items-center justify-center shrink-0 rounded-2xl transition-all duration-300 ${
            showBg
              ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg p-2.5'
              : 'text-black dark:text-white'
          }`}
          style={{ width: iconSize, height: iconSize }}
        >
          {logoMark}
        </div>
        <span className="text-xl font-bold tracking-tight text-black dark:text-white">
          FlowLedger
        </span>
      </div>
    )
  }

  return (
    <div
      className={`flex items-center justify-center rounded-2xl transition-all duration-300 ${
        showBg
          ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg p-2.5'
          : 'text-black dark:text-white'
      } ${className}`}
      style={{ width: iconSize, height: iconSize }}
    >
      {logoMark}
    </div>
  )
}
