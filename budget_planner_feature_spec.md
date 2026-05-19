# Budget Planner Feature Specification
**FlowLedger - Fitur Budget Planner Kompleks**

---

## 1. Overview

Budget Planner = fitur untuk set limit pengeluaran per kategori/periode, track progress real-time, alert otomatis, dan insight prediktif.

**Tujuan:**
- User kontrol spending lebih baik
- Cegah overspending
- Bantu capai financial goals
- Insight kebiasaan belanja

---

## 2. Core Features

### 2.1 Budget Creation & Management

**Budget Types:**
1. **Category Budget** - limit per kategori (Food, Transport, Entertainment, dll)
2. **Total Budget** - limit total pengeluaran periode tertentu
3. **Flexible Budget** - rollover sisa budget ke periode berikutnya
4. **Zero-Based Budget** - alokasi setiap rupiah income ke kategori spesifik

**Budget Periods:**
- Daily
- Weekly  
- Monthly (default)
- Quarterly
- Yearly
- Custom range

**Budget Properties:**
```typescript
interface Budget {
  id: string
  user_id: string
  name: string
  type: 'category' | 'total' | 'flexible' | 'zero_based'
  category?: string // null jika type = 'total'
  amount: number // limit amount
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom'
  start_date: Date
  end_date?: Date // null = recurring
  rollover_enabled: boolean // sisa budget carry over?
  alert_threshold: number // % untuk trigger alert (default 80%)
  is_active: boolean
  created_at: Date
  updated_at: Date
}
```

### 2.2 Real-Time Tracking

**Dashboard Budget Cards:**
- Progress bar visual (spent vs limit)
- Percentage spent
- Remaining amount
- Days left in period
- Spending velocity (rata-rata per hari)
- Projected overspend warning

**Color Coding:**
- Green: < 50% spent
- Yellow: 50-80% spent  
- Orange: 80-100% spent
- Red: > 100% (overspent)

### 2.3 Smart Alerts & Notifications

**Alert Triggers:**
1. **Threshold Alert** - saat spending capai X% dari budget (default 80%)
2. **Overspend Alert** - saat exceed budget limit
3. **Daily Digest** - summary spending harian
4. **Weekly Summary** - recap mingguan
5. **Velocity Alert** - jika spending rate tinggi, warn bakal overspend sebelum periode habis

**Alert Channels:**
- In-app notification
- Email (optional)
- Push notification (PWA)

### 2.4 Budget Analytics

**Insights:**
1. **Spending Patterns**
   - Kategori mana paling sering overspend
   - Hari/waktu spending tertinggi
   - Trend spending month-over-month

2. **Budget Performance**
   - Success rate (berapa kali stay within budget)
   - Average overspend amount
   - Best performing categories

3. **Predictive Analysis**
   - Forecast spending end of period based on current velocity
   - Suggest budget adjustment based on historical data
   - Identify anomaly spending

4. **Comparison Views**
   - Budget vs Actual (bar chart)
   - Period over period comparison
   - Category breakdown (pie chart)

### 2.5 Budget Templates

**Pre-built Templates:**
- 50/30/20 Rule (50% needs, 30% wants, 20% savings)
- Zero-Based Budget
- Envelope System
- Custom templates user bisa save & reuse

### 2.6 Budget Goals Integration

**Link budget dengan goals:**
- Saving goal (target tabungan)
- Debt payoff goal
- Emergency fund goal
- Investment goal

Track progress toward goals bersamaan dengan budget tracking.

---

## 3. Database Schema

### 3.1 New Tables

```sql
-- =============================================
-- TABLE: budgets
-- =============================================
create table if not exists public.budgets (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid references auth.users(id) on delete cascade not null,
  name              text not null,
  type              text check (type in ('category', 'total', 'flexible', 'zero_based')) not null,
  category          text, -- null if type = 'total'
  amount            numeric(15, 2) not null check (amount > 0),
  period            text check (period in ('daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'custom')) not null,
  start_date        date not null,
  end_date          date, -- null = recurring
  rollover_enabled  boolean default false,
  alert_threshold   numeric(5, 2) default 80.0 check (alert_threshold between 0 and 100),
  is_active         boolean default true,
  created_at        timestamptz default now() not null,
  updated_at        timestamptz default now() not null
);

-- RLS
alter table public.budgets enable row level security;

create policy "Users can manage their own budgets"
  on public.budgets for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Indexes
create index budgets_user_id_idx on public.budgets(user_id);
create index budgets_period_idx on public.budgets(period);
create index budgets_active_idx on public.budgets(is_active) where is_active = true;

-- Trigger
drop trigger if exists budgets_updated_at on public.budgets;
create trigger budgets_updated_at
  before update on public.budgets
  for each row execute function public.set_updated_at();


-- =============================================
-- TABLE: budget_history
-- =============================================
-- Track budget performance per period
create table if not exists public.budget_history (
  id              uuid primary key default gen_random_uuid(),
  budget_id       uuid references public.budgets(id) on delete cascade not null,
  user_id         uuid references auth.users(id) on delete cascade not null,
  period_start    date not null,
  period_end      date not null,
  budgeted_amount numeric(15, 2) not null,
  spent_amount    numeric(15, 2) default 0,
  remaining       numeric(15, 2) generated always as (budgeted_amount - spent_amount) stored,
  rollover_from   numeric(15, 2) default 0, -- amount carried over from previous period
  status          text check (status in ('active', 'completed', 'overspent')) default 'active',
  created_at      timestamptz default now() not null,
  updated_at      timestamptz default now() not null
);

alter table public.budget_history enable row level security;

create policy "Users can view their own budget history"
  on public.budget_history for select
  using (auth.uid() = user_id);

create index budget_history_budget_id_idx on public.budget_history(budget_id);
create index budget_history_user_id_idx on public.budget_history(user_id);
create index budget_history_period_idx on public.budget_history(period_start, period_end);


-- =============================================
-- TABLE: budget_alerts
-- =============================================
create table if not exists public.budget_alerts (
  id          uuid primary key default gen_random_uuid(),
  budget_id   uuid references public.budgets(id) on delete cascade not null,
  user_id     uuid references auth.users(id) on delete cascade not null,
  alert_type  text check (alert_type in ('threshold', 'overspend', 'velocity', 'daily_digest', 'weekly_summary')) not null,
  message     text not null,
  is_read     boolean default false,
  created_at  timestamptz default now() not null
);

alter table public.budget_alerts enable row level security;

create policy "Users can manage their own alerts"
  on public.budget_alerts for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index budget_alerts_user_id_idx on public.budget_alerts(user_id);
create index budget_alerts_read_idx on public.budget_alerts(is_read) where is_read = false;


-- =============================================
-- TABLE: budget_goals
-- =============================================
create table if not exists public.budget_goals (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users(id) on delete cascade not null,
  name            text not null,
  goal_type       text check (goal_type in ('saving', 'debt_payoff', 'emergency_fund', 'investment')) not null,
  target_amount   numeric(15, 2) not null check (target_amount > 0),
  current_amount  numeric(15, 2) default 0,
  deadline        date,
  linked_budget_id uuid references public.budgets(id) on delete set null,
  is_completed    boolean default false,
  created_at      timestamptz default now() not null,
  updated_at      timestamptz default now() not null
);

alter table public.budget_goals enable row level security;

create policy "Users can manage their own goals"
  on public.budget_goals for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index budget_goals_user_id_idx on public.budget_goals(user_id);
create index budget_goals_completed_idx on public.budget_goals(is_completed) where is_completed = false;

drop trigger if exists budget_goals_updated_at on public.budget_goals;
create trigger budget_goals_updated_at
  before update on public.budget_goals
  for each row execute function public.set_updated_at();
```

### 3.2 Database Functions

```sql
-- =============================================
-- FUNCTION: Calculate budget spent amount
-- =============================================
create or replace function get_budget_spent(
  p_budget_id uuid,
  p_start_date date,
  p_end_date date
)
returns numeric as $$
declare
  v_spent numeric;
  v_category text;
  v_type text;
begin
  -- Get budget details
  select category, type into v_category, v_type
  from public.budgets
  where id = p_budget_id;

  -- Calculate spent based on budget type
  if v_type = 'category' then
    select coalesce(sum(amount), 0) into v_spent
    from public.transactions
    where user_id = (select user_id from public.budgets where id = p_budget_id)
      and type = 'expense'
      and category = v_category
      and date between p_start_date and p_end_date;
  else
    -- Total budget
    select coalesce(sum(amount), 0) into v_spent
    from public.transactions
    where user_id = (select user_id from public.budgets where id = p_budget_id)
      and type = 'expense'
      and date between p_start_date and p_end_date;
  end if;

  return v_spent;
end;
$$ language plpgsql;


-- =============================================
-- FUNCTION: Check budget and create alert
-- =============================================
create or replace function check_budget_threshold()
returns trigger as $$
declare
  v_budget record;
  v_spent numeric;
  v_percentage numeric;
begin
  -- Loop through active budgets for this user
  for v_budget in
    select * from public.budgets
    where user_id = new.user_id
      and is_active = true
      and (category = new.category or type = 'total')
      and new.date between start_date and coalesce(end_date, '9999-12-31'::date)
  loop
    -- Calculate current spent
    v_spent := get_budget_spent(
      v_budget.id,
      v_budget.start_date,
      coalesce(v_budget.end_date, current_date)
    );

    v_percentage := (v_spent / v_budget.amount) * 100;

    -- Create threshold alert
    if v_percentage >= v_budget.alert_threshold and v_percentage < 100 then
      insert into public.budget_alerts (budget_id, user_id, alert_type, message)
      values (
        v_budget.id,
        new.user_id,
        'threshold',
        format('Budget "%s" has reached %s%% (%s of %s)',
          v_budget.name,
          round(v_percentage, 1),
          v_spent,
          v_budget.amount
        )
      )
      on conflict do nothing;
    end if;

    -- Create overspend alert
    if v_percentage >= 100 then
      insert into public.budget_alerts (budget_id, user_id, alert_type, message)
      values (
        v_budget.id,
        new.user_id,
        'overspend',
        format('Budget "%s" exceeded! Spent %s of %s budget',
          v_budget.name,
          v_spent,
          v_budget.amount
        )
      );
    end if;
  end loop;

  return new;
end;
$$ language plpgsql;

-- Trigger on transaction insert/update
drop trigger if exists check_budget_on_transaction on public.transactions;
create trigger check_budget_on_transaction
  after insert or update on public.transactions
  for each row
  when (new.type = 'expense')
  execute function check_budget_threshold();
```

---

## 4. UI/UX Design

### 4.1 Budget Dashboard Page

**Layout:**
```
┌─────────────────────────────────────────┐
│  Budget Overview                    [+] │
├─────────────────────────────────────────┤
│  ┌─────────────────────────────────┐   │
│  │ Total Budget This Month         │   │
│  │ Rp 5,000,000 / Rp 6,000,000    │   │
│  │ ████████████░░░░ 83%            │   │
│  │ Rp 1,000,000 remaining          │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Active Budgets                         │
│  ┌─────────────────────────────────┐   │
│  │ 🍔 Food & Dining                │   │
│  │ Rp 1,200,000 / Rp 1,500,000    │   │
│  │ ████████████░░░░ 80%            │   │
│  │ 12 days left                    │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 🚗 Transportation               │   │
│  │ Rp 850,000 / Rp 800,000        │   │
│  │ ████████████████ 106% ⚠️        │   │
│  │ Over budget by Rp 50,000        │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Budget Insights                        │
│  ┌─────────────────────────────────┐   │
│  │ 📊 Spending Velocity            │   │
│  │ You're spending Rp 250k/day     │   │
│  │ At this rate, you'll exceed     │   │
│  │ your budget by Rp 500k          │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### 4.2 Create Budget Modal

**Form Fields:**
- Budget Name (text)
- Budget Type (select: Category / Total / Flexible / Zero-Based)
- Category (select, conditional on type)
- Amount (number)
- Period (select: Daily / Weekly / Monthly / etc)
- Start Date (date picker)
- Recurring? (toggle)
- Rollover unused budget? (toggle)
- Alert at (slider: 50-100%, default 80%)

### 4.3 Budget Detail Page

**Sections:**
1. **Header** - budget name, period, status
2. **Progress Card** - visual progress, stats
3. **Spending Timeline** - chart showing daily spending in period
4. **Transaction List** - filtered transactions for this budget
5. **Insights** - AI-generated tips
6. **Actions** - Edit, Pause, Delete budget

### 4.4 Budget Analytics Page

**Charts:**
1. **Budget vs Actual** (bar chart, all budgets)
2. **Spending Trend** (line chart, month-over-month)
3. **Category Breakdown** (pie chart)
4. **Success Rate** (gauge chart)
5. **Forecast** (line chart with projection)

---

## 5. Implementation Phases

### Phase 1: Core Budget (Week 1-2)
- [ ] DB migration (budgets table)
- [ ] Create budget API routes
- [ ] Budget CRUD UI
- [ ] Basic budget tracking
- [ ] Simple progress display

### Phase 2: Real-Time Tracking (Week 3)
- [ ] Auto-calculate spent amount
- [ ] Progress bars & color coding
- [ ] Budget dashboard page
- [ ] Filter transactions by budget

### Phase 3: Alerts & Notifications (Week 4)
- [ ] Alert system (DB + functions)
- [ ] Threshold detection
- [ ] In-app notification UI
- [ ] Alert preferences

### Phase 4: Analytics & Insights (Week 5)
- [ ] Budget history tracking
- [ ] Analytics page
- [ ] Charts (Chart.js / Recharts)
- [ ] Spending velocity calculation
- [ ] Predictive forecast

### Phase 5: Advanced Features (Week 6)
- [ ] Budget templates
- [ ] Goals integration
- [ ] Rollover logic
- [ ] Zero-based budget mode
- [ ] Export budget reports

### Phase 6: Polish & Optimization (Week 7)
- [ ] Performance optimization
- [ ] Mobile UX refinement
- [ ] Empty states
- [ ] Onboarding flow
- [ ] Documentation

---

## 6. Technical Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Recharts / Chart.js (visualizations)
- Framer Motion (animations)
- React Hook Form + Zod (forms)

**Backend:**
- Supabase (PostgreSQL)
- Supabase Functions (serverless)
- Row Level Security (RLS)

**State Management:**
- React Context / Zustand (optional)
- SWR / React Query (data fetching)

---

## 7. Key Considerations

### 7.1 Performance
- Index DB queries properly
- Cache budget calculations
- Lazy load analytics charts
- Optimize real-time updates

### 7.2 UX
- Quick budget creation (< 30 seconds)
- Clear visual feedback
- Mobile-first design
- Smooth animations
- Empty states for new users

### 7.3 Data Accuracy
- Atomic transactions
- Proper date range handling
- Timezone considerations
- Currency precision (2 decimals)

### 7.4 Scalability
- Support multiple budgets per user
- Handle large transaction volumes
- Efficient aggregation queries
- Archive old budget periods

---

## 8. Success Metrics

**Adoption:**
- % users who create at least 1 budget
- Average budgets per user
- Budget creation completion rate

**Engagement:**
- Daily active budget users
- Budget check frequency
- Alert interaction rate

**Effectiveness:**
- % users staying within budget
- Average overspend reduction
- Budget adjustment frequency

---

## 9. Future Enhancements

**V2 Features:**
- Shared budgets (family/couples)
- Budget recommendations (AI)
- Integration with bank accounts
- Automated categorization
- Budget challenges/gamification
- Social comparison (anonymous)
- Budget coaching/tips
- Seasonal budget adjustments

**V3 Features:**
- Multi-currency support
- Investment tracking
- Net worth calculation
- Financial health score
- Tax planning integration

---

## 10. Rekomendasi Implementasi

**Prioritas Tinggi (Must Have):**
1. ✅ Category-based budgets
2. ✅ Monthly period support
3. ✅ Real-time progress tracking
4. ✅ Threshold alerts (80%)
5. ✅ Budget dashboard

**Prioritas Medium (Should Have):**
6. ✅ Multiple period types
7. ✅ Budget analytics page
8. ✅ Spending velocity
9. ✅ Budget history
10. ✅ Rollover feature

**Prioritas Rendah (Nice to Have):**
11. ⭕ Budget templates
12. ⭕ Goals integration
13. ⭕ Zero-based mode
14. ⭕ Predictive forecast
15. ⭕ Email notifications

**Mulai dari mana:**
1. Buat DB schema (budgets table)
2. Implement CRUD API
3. Build budget creation form
4. Add budget cards ke dashboard
5. Implement real-time tracking
6. Add alert system
7. Build analytics page

---

## Kesimpulan

Budget Planner kompleks ini bakal:
- **Differentiate** FlowLedger dari expense tracker biasa
- **Add value** signifikan untuk users
- **Showcase** advanced full-stack skills
- **Scalable** untuk future enhancements

Fokus V1: Core budgeting + real-time tracking + basic alerts.
Sisanya iterasi bertahap based on user feedback.

**Estimasi development time:** 6-7 minggu (solo developer, part-time)
**Complexity level:** Medium-High
**Portfolio impact:** High 🚀
