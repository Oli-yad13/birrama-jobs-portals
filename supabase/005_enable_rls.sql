-- Migration: Enable Row Level Security (RLS)
-- Enable RLS for data protection

-- Enable RLS on all tables
ALTER TABLE fellowship_applicants ENABLE ROW LEVEL SECURITY;
ALTER TABLE fulltime_applicants ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert (for job applications)
CREATE POLICY "Allow insert for applications" ON fellowship_applicants
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow insert for applications" ON fulltime_applicants
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow insert for recommendations" ON recommendations
FOR INSERT WITH CHECK (true);

-- Policy: Allow authenticated users to read their own data (optional)
-- Uncomment if you want users to view their own applications
-- CREATE POLICY "Allow users to read own data" ON fellowship_applicants
-- FOR SELECT USING (auth.uid()::text = email);

-- CREATE POLICY "Allow users to read own data" ON fulltime_applicants  
-- FOR SELECT USING (auth.uid()::text = email);

-- Note: For admin access, you'll need to create admin policies or use service role
-- This is a basic setup - adjust based on your security requirements 