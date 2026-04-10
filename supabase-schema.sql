-- UpMind Feedback System - Supabase Schema
-- Run this in Supabase SQL Editor

-- Students table
create table if not exists students (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  subject text not null,
  grade int not null,
  parent_name text,
  parent_phone text,
  parent_zalo text,
  teacher_name text,
  total_sessions int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Feedback entries
create table if not exists feedbacks (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references students(id) on delete cascade not null,
  session_number int not null,
  session_date date not null default current_date,
  -- 5 criteria, each 1-5
  comprehension int not null check (comprehension between 1 and 5),
  independence int not null check (independence between 1 and 5),
  attitude int not null check (attitude between 1 and 5),
  attendance int not null check (attendance between 1 and 5),
  interaction int not null check (interaction between 1 and 5),
  -- Optional note
  note text,
  teacher_name text,
  created_at timestamptz default now()
);

-- Index for fast lookups
create index if not exists idx_feedbacks_student on feedbacks(student_id, session_date desc);
create index if not exists idx_students_active on students(is_active);

-- Enable RLS (Row Level Security) - allow all for now, tighten later
alter table students enable row level security;
alter table feedbacks enable row level security;

-- Policies: allow all authenticated + anon for now (simple setup)
create policy "Allow all on students" on students for all using (true) with check (true);
create policy "Allow all on feedbacks" on feedbacks for all using (true) with check (true);

-- Sample data for testing
insert into students (name, subject, grade, parent_name, parent_phone, teacher_name, total_sessions) values
  ('Nguyễn Minh Anh', 'Toán', 9, 'Chị Hương', '0901234567', 'Thầy Thiện', 24),
  ('Trần Thị Bích', 'Lý', 10, 'Anh Tuấn', '0912345678', 'Thầy Hanz', 18),
  ('Lê Hoàng Nam', 'Hóa', 12, 'Chị Mai', '0923456789', 'Cô Lan', 20),
  ('Phạm Gia Huy', 'Toán', 6, 'Chị Thảo', '0934567890', 'Thầy Thiện', 12),
  ('Đỗ Thanh Tâm', 'Tiếng Anh', 8, 'Anh Đức', '0945678901', 'Thầy Hanz', 16);
