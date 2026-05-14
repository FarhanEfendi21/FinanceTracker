# FlowLedger Design System

## Overview
FlowLedger adalah aplikasi pencatat keuangan harian berbasis PWA dengan pendekatan desain yang clean, modern, minimalist, dan premium. Design system ini dibuat untuk menjaga konsistensi visual, pengalaman pengguna, serta skalabilitas pengembangan aplikasi.

Pendekatan desain utama:
- Apple Human Interface Guidelines inspired
- Minimalist interface
- Spacious layout
- Smooth interaction
- Mobile-first experience
- Accessible typography
- Soft modern visual hierarchy

---

# Design Principles

## 1. Clarity
Setiap elemen harus memiliki tujuan yang jelas dan mudah dipahami.

## 2. Simplicity
Kurangi elemen visual yang tidak penting.

## 3. Consistency
Gunakan pola desain yang konsisten di seluruh aplikasi.

## 4. Depth
Gunakan layering, spacing, dan shadow lembut untuk memberikan hierarki.

## 5. Focused Experience
Fokus utama aplikasi adalah pencatatan transaksi cepat dan insight yang mudah dibaca.

---

# Brand Identity

## Brand Name
FlowLedger

## Brand Personality
- Modern
- Calm
- Elegant
- Lightweight
- Productive
- Trustworthy

## Brand Keywords
Finance • Minimal • Premium • Clean • Fast • Insightful

---

# Color System

## Primary Colors

### Primary
Digunakan untuk tombol utama, highlight, active state.

- Primary: #2563EB
- Primary Hover: #1D4ED8
- Primary Soft: #DBEAFE

### Success
Digunakan untuk pemasukan.

- Success: #16A34A
- Success Soft: #DCFCE7

### Danger
Digunakan untuk pengeluaran.

- Danger: #DC2626
- Danger Soft: #FEE2E2

---

# Neutral Palette

## Background
- Background Primary: #FFFFFF
- Background Secondary: #F8FAFC
- Background Tertiary: #F1F5F9

## Surface
- Surface Primary: #FFFFFF
- Surface Secondary: #F8FAFC

## Border
- Border Primary: #E2E8F0
- Border Soft: #F1F5F9

## Text
- Text Primary: #0F172A
- Text Secondary: #475569
- Text Tertiary: #94A3B8
- Text Inverse: #FFFFFF

---

# Gradient System

Gunakan gradient secara minimal.

## Primary Gradient
background: linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)

## Card Highlight Gradient
background: linear-gradient(180deg, rgba(255,255,255,0.9), rgba(248,250,252,1))

---

# Typography

## Typography Direction
Gunakan typography yang bersih, modern, dan memiliki readability tinggi.

## Recommended Fonts

### Primary Font
Inter

Alternatif:
- SF Pro Display
- Geist

### Monospace Font
JetBrains Mono

Digunakan untuk:
- angka nominal,
- statistik,
- analytics,
- debug data.

---

# Typography Scale

## Display
- Size: 48px
- Weight: 700
- Line Height: 120%

## Heading 1
- Size: 36px
- Weight: 700
- Line Height: 120%

## Heading 2
- Size: 30px
- Weight: 700
- Line Height: 125%

## Heading 3
- Size: 24px
- Weight: 600
- Line Height: 130%

## Heading 4
- Size: 20px
- Weight: 600
- Line Height: 140%

## Body Large
- Size: 18px
- Weight: 400
- Line Height: 160%

## Body Default
- Size: 16px
- Weight: 400
- Line Height: 160%

## Body Small
- Size: 14px
- Weight: 400
- Line Height: 150%

## Caption
- Size: 12px
- Weight: 500
- Line Height: 140%

---

# Spacing System

Gunakan spacing yang konsisten untuk menciptakan layout yang lega.

## Base Unit
4px

## Spacing Scale
- 4px
- 8px
- 12px
- 16px
- 20px
- 24px
- 32px
- 40px
- 48px
- 64px

---

# Radius System

## Radius Scale
- Small: 8px
- Medium: 12px
- Large: 16px
- XL: 20px
- 2XL: 24px
- Full: 999px

## Recommended Usage

### Card
16px

### Modal
24px

### Button
12px

### Input
12px

---

# Shadow System

Gunakan shadow lembut dan natural.

## Small Shadow
0 1px 2px rgba(15, 23, 42, 0.05)

## Medium Shadow
0 8px 24px rgba(15, 23, 42, 0.08)

## Large Shadow
0 20px 48px rgba(15, 23, 42, 0.12)

---

# Layout System

## Max Width
- Mobile: 100%
- Tablet: 768px
- Desktop Content: 1280px

## Container Padding
- Mobile: 16px
- Tablet: 24px
- Desktop: 32px

## Grid System
Gunakan grid fleksibel berbasis Tailwind.

### Dashboard
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 4 columns

---

# Component Guidelines

# Buttons

## Primary Button
Digunakan untuk CTA utama.

### Style
- Background: Primary
- Text: White
- Radius: 12px
- Height: 48px
- Padding Horizontal: 20px
- Font Weight: 600

### Interaction
- Hover: sedikit lebih gelap
- Active: scale 0.98
- Transition: 200ms ease

---

## Secondary Button
Digunakan untuk aksi pendukung.

### Style
- Background: White
- Border: Neutral Border
- Text: Primary Text

---

## Ghost Button
Digunakan untuk navigasi atau action ringan.

### Style
- Transparent background
- Hover background soft neutral

---

# Inputs

## Input Field

### Style
- Height: 48px
- Radius: 12px
- Border: Neutral Border
- Background: White
- Padding: 16px

### Focus State
- Border Primary
- Soft blue glow
- No harsh outline

---

# Cards

## Financial Summary Card
Digunakan untuk:
- total balance,
- income,
- expense,
- analytics.

### Style
- Background: White
- Radius: 20px
- Padding: 20px
- Soft shadow
- Border subtle

### Content Hierarchy
1. Label
2. Amount
3. Additional info

---

# Navigation

## Desktop Navigation
- Sticky top navbar
- Transparent blur background
- Minimal navigation items

### Navbar Items
- Dashboard
- Transactions
- Reports
- Settings

---

## Mobile Navigation
Gunakan bottom navigation.

### Structure
- Dashboard
- Transactions
- Add
- Reports
- Profile

### Style
- Floating glassmorphism feel
- Rounded full
- Soft blur background

---

# Modal Design

## Style
- Rounded 24px
- Spacious layout
- Smooth animation
- Focus centered interaction

## Animation
- Fade in
- Slight scale up
- Duration: 250ms

---

# Motion System

## Animation Philosophy
Subtle and meaningful.

Hindari animasi berlebihan.

---

## Recommended Transitions

### Standard
transition-all duration-200 ease-out

### Smooth
transition-all duration-300 ease-in-out

---

## Motion Examples

### Button Press
scale: 0.98

### Card Hover
translateY(-2px)

### Modal
opacity + scale

### Page Transition
soft fade

---

# Iconography

## Icon Library
Gunakan Lucide React.

## Recommended Icons
- Wallet
- CreditCard
- TrendingUp
- TrendingDown
- Calendar
- Plus
- Settings
- PieChart

## Icon Style
- Stroke width ringan
- Rounded edges
- Consistent size

---

# Data Visualization

## Charts
Gunakan Recharts.

## Chart Principles
- Clean
- Minimal grid
- Soft tooltip
- Focus on readability

## Recommended Charts
- Line chart
- Bar chart
- Donut chart

---

# Empty States

Setiap halaman harus memiliki empty state.

## Empty State Structure
- Illustration/icon
- Title
- Description
- CTA button

## Example
"Belum ada transaksi"
"Mulai catat pemasukan atau pengeluaran pertama Anda"

---

# Loading States

## Skeleton Loading
Gunakan skeleton daripada spinner jika memungkinkan.

## Skeleton Style
- Soft neutral color
- Rounded edges
- Subtle shimmer animation

---

# Accessibility

## Requirements
- Kontras warna memadai
- Fokus keyboard jelas
- Target sentuh minimal 44x44px
- Typography mudah dibaca
- Hindari teks terlalu kecil

---

# PWA Design Considerations

## Mobile App Feel
Aplikasi harus terasa seperti native app.

## Recommended Features
- Splash screen
- Install prompt
- Offline cache basic
- Smooth loading
- Fullscreen feel

## Safe Area Support
Perhatikan padding untuk:
- notch,
- bottom safe area,
- iOS spacing.

---

# Dashboard Design Direction

## Layout Priority
1. Balance summary
2. Quick add transaction
3. Recent transactions
4. Financial insight

## Dashboard Sections

### Header
- Greeting
- Date
- User avatar

### Summary Cards
- Total balance
- Income
- Expense
- Monthly trend

### Quick Action
Floating add transaction button.

### Recent Transactions
List dengan spacing nyaman.

### Analytics Preview
Mini chart dan category breakdown.

---

# Transaction List Design

## Transaction Item

### Left Side
- Category icon
- Transaction title
- Date

### Right Side
- Amount
- Income/Expense color

## Interaction
- Swipe actions mobile
- Hover desktop
- Click for detail

---

# Settings Page

## Sections
- Profile
- Appearance
- Notifications
- Export data
- Logout

## Layout
Gunakan grouped settings cards.

---

# Tailwind Design Tokens

## Example Color Tokens

```js
colors: {
  primary: '#2563EB',
  success: '#16A34A',
  danger: '#DC2626',
  background: '#FFFFFF',
  surface: '#F8FAFC',
  border: '#E2E8F0',
  text: '#0F172A'
}
```

---

# Recommended Tech Integration

## Frontend
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Lucide React
- Recharts

## Backend
- Supabase Auth
- Supabase Database
- Supabase Storage

## Deployment
- Vercel

---

# Recommended Folder Structure

```txt
src/
 ├── app/
 ├── components/
 │    ├── ui/
 │    ├── dashboard/
 │    ├── transactions/
 │    └── charts/
 ├── lib/
 ├── hooks/
 ├── services/
 ├── store/
 ├── types/
 └── styles/
```

---

# UI Inspiration Direction

## Visual References
Inspirasi visual:
- Apple Wallet
- Apple Fitness
- Linear
- Notion
- Arc Browser
- Monzo
- Revolut

## Desired Feel
- Calm
- Fast
- Elegant
- Spacious
- Lightweight
- Native-like

---

# Final Design Direction

FlowLedger harus terasa seperti aplikasi finansial modern yang:
- ringan,
- cepat,
- tidak membingungkan,
- nyaman digunakan setiap hari,
- dan memiliki kualitas visual premium.

Fokus utama bukan hanya fitur, tetapi pengalaman penggunaan yang bersih, intuitif, dan menyenangkan.

