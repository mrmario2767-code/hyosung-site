-- (주)효성중전기 사이트 — Supabase 초기 설정 SQL
-- Supabase 대시보드 → SQL Editor 에 붙여넣고 Run 하면 됩니다.

-- 1) 테이블
create table if not exists notices (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text,
  created_at timestamptz default now()
);

create table if not exists faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text,
  sort int default 0,
  created_at timestamptz default now()
);

create table if not exists resources (
  id uuid primary key default gen_random_uuid(),
  category text not null,          -- manual-hv / manual-lv / manual-gm / spec-lv / spec-gm / etc
  title text not null,
  lang text default '한국어',
  file_url text not null,
  file_path text,
  created_at timestamptz default now()
);

create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  product text,
  message text,
  file_url text,
  created_at timestamptz default now()
);

-- 2) RLS (보안 규칙)
alter table notices enable row level security;
alter table faqs enable row level security;
alter table resources enable row level security;
alter table inquiries enable row level security;

-- 누구나 읽기 (공지/FAQ/자료실)
create policy "public read notices"   on notices   for select using (true);
create policy "public read faqs"      on faqs      for select using (true);
create policy "public read resources" on resources for select using (true);

-- 견적문의: 누구나 등록 가능, 읽기·삭제는 관리자만
create policy "public insert inquiries" on inquiries for insert with check (true);
create policy "admin read inquiries"    on inquiries for select using (auth.role() = 'authenticated');
create policy "admin delete inquiries"  on inquiries for delete using (auth.role() = 'authenticated');

-- 관리자(로그인 사용자)는 공지/FAQ/자료실 쓰기 가능
create policy "admin write notices"   on notices   for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write faqs"      on faqs      for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write resources" on resources for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- 3) 스토리지 버킷 (public)
insert into storage.buckets (id, name, public) values ('files','files', true)
on conflict (id) do nothing;

create policy "public read files" on storage.objects for select using (bucket_id = 'files');
create policy "anyone upload inquiries" on storage.objects for insert with check (bucket_id = 'files' and (storage.foldername(name))[1] = 'inquiries');
create policy "admin upload files" on storage.objects for insert with check (bucket_id = 'files' and auth.role() = 'authenticated');
create policy "admin delete files" on storage.objects for delete using (bucket_id = 'files' and auth.role() = 'authenticated');
