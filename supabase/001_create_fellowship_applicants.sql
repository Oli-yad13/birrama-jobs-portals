-- Migration: Create fellowship_applicants table
create table if not exists fellowship_applicants (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamp with time zone default now(),
  name text not null,
  email text not null,
  phone text,
  role text,
  answers jsonb,
  cv_url text
); 