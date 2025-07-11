-- Migration: Create recommendations table
create table if not exists recommendations (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamp with time zone default now(),
  recommender_name text not null,
  recommender_email text not null,
  recommender_phone text not null,
  recommended_name text not null,
  recommended_email text not null,
  recommended_phone text not null,
  recommended_linkedin text
); 