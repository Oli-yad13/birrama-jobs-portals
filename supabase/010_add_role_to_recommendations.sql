-- Migration: Add role field to recommendations table
-- This migration adds role tracking to recommendations

-- 1. Add role column to recommendations table
ALTER TABLE recommendations ADD COLUMN IF NOT EXISTS role text;

-- 2. Add role validation constraint
ALTER TABLE recommendations DROP CONSTRAINT IF EXISTS recommendations_role_check;
ALTER TABLE recommendations ADD CONSTRAINT recommendations_role_check 
CHECK (role IN ('data', 'marketing', 'sales', 'frontend', 'backend', 'devops', 'security', 'mobile', 'fulltime', 'fulltime_manager'));

-- 3. Add comment for documentation
COMMENT ON COLUMN recommendations.role IS 'The role the person is being recommended for: data, marketing, sales, frontend, backend, devops, security, mobile, fulltime, fulltime_manager';

-- 4. Create a view for recommendations by role
CREATE OR REPLACE VIEW recommendations_by_role AS
SELECT 
    role,
    COUNT(*) as total_recommendations,
    COUNT(CASE WHEN recommended_linkedin IS NOT NULL THEN 1 END) as with_linkedin,
    MIN(created_at) as first_recommendation,
    MAX(created_at) as latest_recommendation
FROM recommendations
WHERE role IS NOT NULL
GROUP BY role
ORDER BY total_recommendations DESC;

-- 5. Create a comprehensive recommendations export view
CREATE OR REPLACE VIEW all_recommendations_export AS
SELECT 
    id,
    recommender_name,
    recommender_email,
    recommender_phone,
    recommended_name,
    recommended_email,
    recommended_phone,
    recommended_linkedin,
    role,
    created_at
FROM recommendations
ORDER BY role, created_at DESC;

-- 6. Add index for better performance
CREATE INDEX IF NOT EXISTS idx_recommendations_role ON recommendations(role);
CREATE INDEX IF NOT EXISTS idx_recommendations_role_created_at ON recommendations(role, created_at);

-- Migration completed successfully 