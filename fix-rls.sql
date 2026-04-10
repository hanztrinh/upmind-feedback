-- UpMind Feedback - Fix RLS policies
-- Chạy trong Supabase SQL Editor nếu không insert/update được

-- Drop existing policies
drop policy if exists "Allow all on students" on students;
drop policy if exists "Allow all on feedbacks" on feedbacks;

-- Recreate with explicit permissions for all operations
create policy "Enable read for all" on students for select using (true);
create policy "Enable insert for all" on students for insert with check (true);
create policy "Enable update for all" on students for update using (true) with check (true);
create policy "Enable delete for all" on students for delete using (true);

create policy "Enable read for all" on feedbacks for select using (true);
create policy "Enable insert for all" on feedbacks for insert with check (true);
create policy "Enable update for all" on feedbacks for update using (true) with check (true);
create policy "Enable delete for all" on feedbacks for delete using (true);
