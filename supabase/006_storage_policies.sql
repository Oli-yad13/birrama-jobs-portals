-- Migration: Storage RLS Policies
-- Enable RLS and create policies for the storage bucket

-- Enable RLS on the storage bucket
-- Note: This needs to be done in the Supabase Dashboard under Storage > Buckets > applicatns > Settings

-- Create storage policies for the applicatns bucket
-- Allow anyone to upload files (for job applications)
-- CREATE POLICY "Allow public uploads" ON storage.objects
-- FOR INSERT WITH CHECK (bucket_id = 'applicatns');

-- Allow anyone to read files (for downloading CVs/cover letters)
-- CREATE POLICY "Allow public reads" ON storage.objects
-- FOR SELECT USING (bucket_id = 'applicatns');

-- Allow anyone to update files (in case they want to replace their CV)
-- CREATE POLICY "Allow public updates" ON storage.objects
-- FOR UPDATE USING (bucket_id = 'applicatns');

-- Optional: Allow file deletion (uncomment if needed)
-- CREATE POLICY "Allow public deletes" ON storage.objects
-- FOR DELETE USING (bucket_id = 'applicatns'); 