-- Migration: Create fulltime_applicants table
create table if not exists fulltime_applicants (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamp with time zone default now(),
  name text not null,
  email text not null,
  phone text,
  role text,
  q1 text,
  q2 text,
  q3 text,
  q4 text,
  q5 text,
  q6 text,
  q7 text,
  q8 text,
  q9 text,
  q10 text,
  q11 text,
  q12 text,
  q13 text,
  cv_url text,
  coverletter_url text
); 