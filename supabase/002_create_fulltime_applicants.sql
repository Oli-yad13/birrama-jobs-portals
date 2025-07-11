-- Migration: Rename cv_url to cv_link and coverletter_url to coverletter_link if not exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='fulltime_applicants' AND column_name='cv_url') THEN
    EXECUTE 'ALTER TABLE fulltime_applicants RENAME COLUMN cv_url TO cv_link';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='fulltime_applicants' AND column_name='coverletter_url') THEN
    EXECUTE 'ALTER TABLE fulltime_applicants RENAME COLUMN coverletter_url TO coverletter_link';
  END IF;
END $$;
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
  cv_link text,
  coverletter_link text
); 