-- Migration: Drop old fellowship views and function if they exist to avoid column/type errors
DROP VIEW IF EXISTS data_fellowship_applications CASCADE;
DROP VIEW IF EXISTS marketing_fellowship_applications CASCADE;
DROP VIEW IF EXISTS sales_fellowship_applications CASCADE;
DROP VIEW IF EXISTS frontend_fellowship_applications CASCADE;
DROP VIEW IF EXISTS backend_fellowship_applications CASCADE;
DROP VIEW IF EXISTS devops_fellowship_applications CASCADE;
DROP VIEW IF EXISTS security_fellowship_applications CASCADE;
DROP VIEW IF EXISTS mobile_fellowship_applications CASCADE;
DROP VIEW IF EXISTS all_fellowship_applications_export CASCADE;
DROP VIEW IF EXISTS fellowship_summary_by_role CASCADE;
DROP FUNCTION IF EXISTS export_role_applications(text);

-- Migration: Create role-specific views for easy Excel exports and filtering
-- This migration creates separate views for each fellowship role to make Excel exports cleaner

-- 1. Create view for Data Analysis & Insights Fellow applications
CREATE OR REPLACE VIEW data_fellowship_applications AS
SELECT 
    id,
    name,
    email,
    phone,
    answers->>'education' as education,
    answers->>'major' as major,
    answers->>'experience' as experience,
    answers->>'interest' as interest,
    answers->>'linkedin' as linkedin,
    cv_link,
    answers->>'coverletter' as coverletter_link,
    answers,
    created_at
FROM fellowship_applicants 
WHERE role = 'data'
ORDER BY created_at DESC;

-- 2. Create view for Marketing and Digital Growth Fellow applications
CREATE OR REPLACE VIEW marketing_fellowship_applications AS
SELECT 
    id,
    name,
    email,
    phone,
    answers->>'education' as education,
    answers->>'major' as major,
    answers->>'experience' as experience,
    answers->>'interest' as interest,
    answers->>'portfolio' as portfolio,
    answers->>'linkedin' as linkedin,
    cv_link,
    answers,
    created_at
FROM fellowship_applicants 
WHERE role = 'marketing'
ORDER BY created_at DESC;

-- 3. Create view for Sales and Market Outreach Fellow applications
CREATE OR REPLACE VIEW sales_fellowship_applications AS
SELECT 
    id,
    name,
    email,
    phone,
    answers->>'education' as education,
    answers->>'major' as major,
    answers->>'experience' as experience,
    answers->>'interest' as interest,
    answers->>'linkedin' as linkedin,
    cv_link,
    answers,
    created_at
FROM fellowship_applicants 
WHERE role = 'sales'
ORDER BY created_at DESC;

-- 4. Create view for Frontend Developer Fellow applications
CREATE OR REPLACE VIEW frontend_fellowship_applications AS
SELECT 
    id,
    name,
    email,
    phone,
    answers->>'education' as education,
    answers->>'major' as major,
    answers->>'experience' as experience,
    answers->>'interest' as interest,
    answers->>'portfolio' as portfolio,
    answers->>'other' as other,
    answers->>'linkedin' as linkedin,
    cv_link,
    answers,
    created_at
FROM fellowship_applicants 
WHERE role = 'frontend'
ORDER BY created_at DESC;

-- 5. Create view for Backend Developer Fellow applications
CREATE OR REPLACE VIEW backend_fellowship_applications AS
SELECT 
    id,
    name,
    email,
    phone,
    answers->>'education' as education,
    answers->>'major' as major,
    answers->>'experience' as experience,
    answers->>'interest' as interest,
    answers->>'portfolio' as portfolio,
    answers->>'other' as other,
    answers->>'linkedin' as linkedin,
    cv_link,
    answers,
    created_at
FROM fellowship_applicants 
WHERE role = 'backend'
ORDER BY created_at DESC;

-- 6. Create view for DevOps Fellow applications
CREATE OR REPLACE VIEW devops_fellowship_applications AS
SELECT 
    id,
    name,
    email,
    phone,
    answers->>'education' as education,
    answers->>'major' as major,
    answers->>'experience' as experience,
    answers->>'interest' as interest,
    answers->>'portfolio' as portfolio,
    answers->>'other' as other,
    answers->>'linkedin' as linkedin,
    cv_link,
    answers,
    created_at
FROM fellowship_applicants 
WHERE role = 'devops'
ORDER BY created_at DESC;

-- 7. Create view for Cybersecurity Fellow applications
CREATE OR REPLACE VIEW security_fellowship_applications AS
SELECT 
    id,
    name,
    email,
    phone,
    answers->>'education' as education,
    answers->>'major' as major,
    answers->>'experience' as experience,
    answers->>'interest' as interest,
    answers->>'portfolio' as portfolio,
    answers->>'other' as other,
    answers->>'linkedin' as linkedin,
    cv_link,
    answers,
    created_at
FROM fellowship_applicants 
WHERE role = 'security'
ORDER BY created_at DESC;

-- 8. Create view for Mobile App Developer Fellow applications
CREATE OR REPLACE VIEW mobile_fellowship_applications AS
SELECT 
    id,
    name,
    email,
    phone,
    answers->>'education' as education,
    answers->>'major' as major,
    answers->>'experience' as experience,
    answers->>'interest' as interest,
    answers->>'portfolio' as portfolio,
    answers->>'other' as other,
    answers->>'linkedin' as linkedin,
    cv_link,
    answers,
    created_at
FROM fellowship_applicants 
WHERE role = 'mobile'
ORDER BY created_at DESC;

-- 9. Create a comprehensive export view with role information
CREATE OR REPLACE VIEW all_fellowship_applications_export AS
SELECT 
    id,
    name,
    email,
    phone,
    role,
    answers->>'education' as education,
    answers->>'major' as major,
    answers->>'experience' as experience,
    answers->>'interest' as interest,
    answers->>'portfolio' as portfolio,
    answers->>'other' as other,
    answers->>'linkedin' as linkedin,
    cv_link,
    answers->>'coverletter' as coverletter_link,
    created_at,
    -- Extract specific answers from JSONB for easier Excel viewing
    answers->>'education' as education_answer,
    answers->>'major' as major_answer,
    answers->>'experience' as experience_answer,
    answers->>'interest' as interest_answer,
    answers->>'portfolio' as portfolio_answer,
    answers->>'other' as other_answer,
    answers->>'linkedin' as linkedin_answer
FROM fellowship_applicants 
ORDER BY role, created_at DESC;

-- 10. Create a summary view for quick overview
CREATE OR REPLACE VIEW fellowship_summary_by_role AS
SELECT 
    role,
    COUNT(*) as total_applications,
    COUNT(CASE WHEN cv_link IS NOT NULL THEN 1 END) as with_cv,
    COUNT(CASE WHEN answers->>'coverletter' IS NOT NULL THEN 1 END) as with_coverletter,
    COUNT(CASE WHEN answers->>'linkedin' IS NOT NULL THEN 1 END) as with_linkedin,
    MIN(created_at) as first_application,
    MAX(created_at) as latest_application,
    AVG(EXTRACT(EPOCH FROM (NOW() - created_at))/86400) as avg_days_since_application
FROM fellowship_applicants
GROUP BY role
ORDER BY total_applications DESC;

-- 11. Create a function to export specific role data
CREATE OR REPLACE FUNCTION export_role_applications(role_name TEXT)
RETURNS TABLE (
    id UUID,
    name TEXT,
    email TEXT,
    phone TEXT,
    education TEXT,
    major TEXT,
    experience TEXT,
    interest TEXT,
    portfolio TEXT,
    other TEXT,
    linkedin TEXT,
    cv_link TEXT,
    coverletter_link TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        fa.id,
        fa.name,
        fa.email,
        fa.phone,
        fa.answers->>'education' as education,
        fa.answers->>'major' as major,
        fa.answers->>'experience' as experience,
        fa.answers->>'interest' as interest,
        fa.answers->>'portfolio' as portfolio,
        fa.answers->>'other' as other,
        fa.answers->>'linkedin' as linkedin,
        fa.cv_link,
        fa.answers->>'coverletter' as coverletter_link,
        fa.created_at
    FROM fellowship_applicants fa
    WHERE fa.role = role_name
    ORDER BY fa.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- 12. Add comments for documentation
COMMENT ON VIEW data_fellowship_applications IS 'View for Data Analysis & Insights Fellow applications only';
COMMENT ON VIEW marketing_fellowship_applications IS 'View for Marketing and Digital Growth Fellow applications only';
COMMENT ON VIEW sales_fellowship_applications IS 'View for Sales and Market Outreach Fellow applications only';
COMMENT ON VIEW frontend_fellowship_applications IS 'View for Frontend Developer Fellow applications only';
COMMENT ON VIEW backend_fellowship_applications IS 'View for Backend Developer Fellow applications only';
COMMENT ON VIEW devops_fellowship_applications IS 'View for DevOps Fellow applications only';
COMMENT ON VIEW security_fellowship_applications IS 'View for Cybersecurity Fellow applications only';
COMMENT ON VIEW mobile_fellowship_applications IS 'View for Mobile App Developer Fellow applications only';
COMMENT ON VIEW all_fellowship_applications_export IS 'Comprehensive view of all fellowship applications with flattened JSONB data for Excel export';

-- Migration completed successfully 