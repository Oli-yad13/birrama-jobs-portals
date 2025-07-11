-- Migration: Add performance indexes
-- Add indexes for better query performance

-- Indexes for fellowship_applicants
CREATE INDEX IF NOT EXISTS idx_fellowship_applicants_email ON fellowship_applicants(email);
CREATE INDEX IF NOT EXISTS idx_fellowship_applicants_created_at ON fellowship_applicants(created_at);
CREATE INDEX IF NOT EXISTS idx_fellowship_applicants_role ON fellowship_applicants(role);

-- Indexes for fulltime_applicants  
CREATE INDEX IF NOT EXISTS idx_fulltime_applicants_email ON fulltime_applicants(email);
CREATE INDEX IF NOT EXISTS idx_fulltime_applicants_created_at ON fulltime_applicants(created_at);
CREATE INDEX IF NOT EXISTS idx_fulltime_applicants_role ON fulltime_applicants(role);

-- Indexes for recommendations
CREATE INDEX IF NOT EXISTS idx_recommendations_recommender_email ON recommendations(recommender_email);
CREATE INDEX IF NOT EXISTS idx_recommendations_recommended_email ON recommendations(recommended_email);
CREATE INDEX IF NOT EXISTS idx_recommendations_created_at ON recommendations(created_at); 