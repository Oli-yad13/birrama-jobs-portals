-- Migration: Rename cv_url to cv_link and add coverletter_link if not exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='fellowship_applicants' AND column_name='cv_url') THEN
    EXECUTE 'ALTER TABLE fellowship_applicants RENAME COLUMN cv_url TO cv_link';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='fellowship_applicants' AND column_name='coverletter_link') THEN
    EXECUTE 'ALTER TABLE fellowship_applicants ADD COLUMN coverletter_link text';
  END IF;
END $$;
-- Migration: Create fellowship_applicants table
create table if not exists fellowship_applicants (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamp with time zone default now(),
  name text not null,
  email text not null,
  phone text,
  role text,
  answers jsonb,
  cv_link text,
  coverletter_link text
); 