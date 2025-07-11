-- Migration: Fix schema issues
-- This migration adds role validation and data cleanup
-- Note: Storage policies should be updated manually in Supabase Dashboard

-- 1. Clean up existing invalid data before adding constraints
-- Update any rows with 'fellowship' role to 'data' (or delete them if you prefer)
UPDATE fellowship_applicants 
SET role = 'data' 
WHERE role = 'fellowship' OR role IS NULL OR role NOT IN ('data', 'marketing', 'sales', 'frontend', 'backend', 'devops', 'security', 'mobile');

-- Update any rows with invalid fulltime roles
UPDATE fulltime_applicants 
SET role = 'fulltime' 
WHERE role IS NULL OR role NOT IN ('fulltime', 'fulltime_manager');

-- 2. Add role validation for fellowship_applicants table
-- First, drop any existing constraint if it exists
ALTER TABLE fellowship_applicants DROP CONSTRAINT IF EXISTS fellowship_applicants_role_check;

-- Add CHECK constraint to ensure only valid roles are accepted
ALTER TABLE fellowship_applicants ADD CONSTRAINT fellowship_applicants_role_check 
CHECK (role IN ('data', 'marketing', 'sales', 'frontend', 'backend', 'devops', 'security', 'mobile'));

-- 3. Add role validation for fulltime_applicants table
ALTER TABLE fulltime_applicants DROP CONSTRAINT IF EXISTS fulltime_applicants_role_check;

-- Add CHECK constraint for fulltime roles
ALTER TABLE fulltime_applicants ADD CONSTRAINT fulltime_applicants_role_check 
CHECK (role IN ('fulltime', 'fulltime_manager'));

-- 4. Add comments for documentation
COMMENT ON COLUMN fellowship_applicants.role IS 'The specific fellowship role: data, marketing, sales, frontend, backend, devops, security, mobile';
COMMENT ON COLUMN fulltime_applicants.role IS 'The specific fulltime role: fulltime, fulltime_manager';
COMMENT ON COLUMN fellowship_applicants.answers IS 'JSONB field for storing role-specific application answers in a flexible format';

-- 5. Create a function to validate role-specific data
CREATE OR REPLACE FUNCTION validate_fellowship_role_data()
RETURNS TRIGGER AS $$
BEGIN
    -- Ensure the role field is not null
    IF NEW.role IS NULL THEN
        RAISE EXCEPTION 'Role cannot be null for fellowship applications';
    END IF;
    
    -- Ensure answers is a valid JSONB object
    IF NEW.answers IS NOT NULL AND jsonb_typeof(NEW.answers) != 'object' THEN
        RAISE EXCEPTION 'Answers must be a valid JSONB object';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Create trigger to validate fellowship application data
DROP TRIGGER IF EXISTS validate_fellowship_data_trigger ON fellowship_applicants;
CREATE TRIGGER validate_fellowship_data_trigger
    BEFORE INSERT OR UPDATE ON fellowship_applicants
    FOR EACH ROW
    EXECUTE FUNCTION validate_fellowship_role_data();

-- Migration completed successfully

-- Note: To fix storage bucket name, manually update the storage policies in Supabase Dashboard:
-- 1. Go to Storage > Buckets > applicants (or create if it doesn't exist)
-- 2. Update policies to use 'applicants' instead of 'applicatns'
-- 3. Or update the bucket name from 'applicatns' to 'applicants' 