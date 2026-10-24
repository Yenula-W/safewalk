create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  lat double precision not null,
  lng double precision not null,
  category text not null check (category in (
    'lighting','crossing','sidewalk','traffic','speeding','dogs',
    'flooding','construction','isolated','unsafe_feeling','other'
  )),
  severity int not null check (severity between 1 and 5),
  note text default '' check (char_length(note) <= 280),
  created_at timestamptz not null default now()
);

alter table reports enable row level security;
create policy "anyone can read reports" on reports for select using (true);
create policy "anyone can add reports" on reports for insert with check (true);

-- If you created the table before the category list grew, run this instead:
-- alter table reports drop constraint reports_category_check;
-- alter table reports add constraint reports_category_check check (category in (
--   'lighting','crossing','sidewalk','traffic','speeding','dogs',
--   'flooding','construction','isolated','unsafe_feeling','other'));
