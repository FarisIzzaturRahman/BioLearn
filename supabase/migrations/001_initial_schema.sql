-- PROFILES
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  role text default 'student' check (role in ('student', 'admin')),
  created_at timestamptz default now()
);

-- COURSES
create table public.courses (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  description text,
  cover_image text,
  level text check (level in ('Beginner', 'Intermediate', 'Advanced')),
  estimated_hours integer,
  published boolean default false,
  created_at timestamptz default now()
);

-- MODULES
create table public.modules (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references public.courses(id) on delete cascade,
  title text not null,
  slug text not null,
  content_markdown text,
  order_index integer not null,
  duration_minutes integer,
  created_at timestamptz default now(),
  unique(course_id, slug)
);

-- ENROLLMENTS
create table public.enrollments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  course_id uuid references public.courses(id) on delete cascade,
  enrolled_at timestamptz default now(),
  completed_at timestamptz,
  unique(user_id, course_id)
);

-- MODULE COMPLETIONS
create table public.module_completions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  module_id uuid references public.modules(id) on delete cascade,
  completed_at timestamptz default now(),
  unique(user_id, module_id)
);

-- RLS POLICIES
alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.modules enable row level security;
alter table public.enrollments enable row level security;
alter table public.module_completions enable row level security;

-- Profiles: user bisa baca/update profile sendiri
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Courses: semua user bisa baca published courses, admin bisa semua
create policy "Anyone can view published courses" on public.courses for select using (published = true);
create policy "Admin can manage courses" on public.courses for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Modules: bisa dibaca kalau course-nya published
create policy "Anyone can view modules of published courses" on public.modules for select using (
  exists (select 1 from public.courses where id = course_id and published = true)
);
create policy "Admin can manage modules" on public.modules for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Enrollments: user hanya lihat/buat enrollment sendiri
create policy "Users can view own enrollments" on public.enrollments for select using (auth.uid() = user_id);
create policy "Users can enroll" on public.enrollments for insert with check (auth.uid() = user_id);

-- Module completions: user hanya lihat/buat completion sendiri
create policy "Users can view own completions" on public.module_completions for select using (auth.uid() = user_id);
create policy "Users can mark complete" on public.module_completions for insert with check (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
