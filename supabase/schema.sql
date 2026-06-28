-- FitForge AI — Postgres schema (Supabase)
-- Run in the Supabase SQL editor or via `supabase db push`.
-- Row Level Security is enabled on every user-owned table so a user can only
-- read/write their own rows.

-- ---------------------------------------------------------------------------
-- Profiles (1:1 with auth.users)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text,
  age int,
  height_cm numeric,
  weight_kg numeric,
  gender text,
  goal text check (goal in ('lose_fat', 'build_muscle', 'recomp', 'maintain', 'get_stronger')),
  experience text check (experience in ('beginner', 'intermediate', 'advanced')),
  training_location text check (training_location in ('gym', 'home', 'both')),
  equipment text[] default '{}',
  workout_days int,
  dietary_preference text,
  injuries text[] default '{}',
  level int default 1,
  xp int default 0,
  streak_days int default 0,
  is_premium boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- Exercise library (shared, read-only for users)
-- ---------------------------------------------------------------------------
create table if not exists public.exercises (
  id text primary key,
  name text not null,
  primary_muscle text not null,
  secondary_muscles text[] default '{}',
  equipment text not null,
  difficulty text not null,
  default_sets int default 3,
  default_reps text default '8-12',
  notes text,
  alternatives text[] default '{}',
  media_url text
);

-- ---------------------------------------------------------------------------
-- Workout templates
-- ---------------------------------------------------------------------------
create table if not exists public.workouts (
  id text primary key,
  title text not null,
  category text not null,
  duration_min int,
  difficulty text,
  focus text[] default '{}',
  exercise_ids text[] default '{}',
  accent text,
  is_template boolean default true,
  owner_id uuid references auth.users (id) on delete cascade
);

-- ---------------------------------------------------------------------------
-- Logged workout sessions + sets
-- ---------------------------------------------------------------------------
create table if not exists public.workout_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  workout_id text references public.workouts (id),
  started_at timestamptz default now(),
  completed_at timestamptz,
  total_volume_kg numeric default 0
);

create table if not exists public.set_logs (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.workout_sessions (id) on delete cascade,
  exercise_id text not null references public.exercises (id),
  set_index int not null,
  weight_kg numeric,
  reps int,
  rpe numeric,
  is_pr boolean default false,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- Nutrition
-- ---------------------------------------------------------------------------
create table if not exists public.foods (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  barcode text,
  calories numeric,
  protein numeric,
  carbs numeric,
  fat numeric,
  fiber numeric,
  serving text
);

create table if not exists public.food_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  food_id uuid references public.foods (id),
  meal text check (meal in ('breakfast', 'lunch', 'dinner', 'snack')),
  servings numeric default 1,
  logged_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- Progress: measurements, photos, habits
-- ---------------------------------------------------------------------------
create table if not exists public.measurements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  taken_at date default current_date,
  weight_kg numeric,
  body_fat numeric,
  chest_cm numeric,
  waist_cm numeric,
  arms_cm numeric,
  legs_cm numeric,
  neck_cm numeric,
  hips_cm numeric
);

create table if not exists public.progress_photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  storage_path text not null,
  taken_at date default current_date
);

create table if not exists public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  habit text not null,
  done boolean default false,
  log_date date default current_date,
  unique (user_id, habit, log_date)
);

-- ---------------------------------------------------------------------------
-- AI coach conversations
-- ---------------------------------------------------------------------------
create table if not exists public.coach_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  role text check (role in ('user', 'coach')),
  content text not null,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.workout_sessions enable row level security;
alter table public.set_logs enable row level security;
alter table public.food_logs enable row level security;
alter table public.measurements enable row level security;
alter table public.progress_photos enable row level security;
alter table public.habit_logs enable row level security;
alter table public.coach_messages enable row level security;

-- Generic "owner can do everything to their own rows" policy.
create policy "own profile" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "own sessions" on public.workout_sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own set logs" on public.set_logs
  for all using (
    auth.uid() = (select user_id from public.workout_sessions s where s.id = session_id)
  );

create policy "own food logs" on public.food_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own measurements" on public.measurements
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own photos" on public.progress_photos
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own habits" on public.habit_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own messages" on public.coach_messages
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Shared catalogs are readable by any authenticated user.
alter table public.exercises enable row level security;
alter table public.foods enable row level security;
create policy "read exercises" on public.exercises for select using (true);
create policy "read foods" on public.foods for select using (true);
