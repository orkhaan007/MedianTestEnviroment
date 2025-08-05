-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  age INTEGER NOT NULL,
  discord_nick TEXT NOT NULL,
  discord_id TEXT NOT NULL,
  steam_profile TEXT NOT NULL,
  fivem_hours INTEGER NOT NULL,
  why_median TEXT NOT NULL,
  accept_warning_system BOOLEAN NOT NULL,
  accept_ck_possibility BOOLEAN NOT NULL,
  accept_hierarchy BOOLEAN NOT NULL,
  southside_meaning TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, accepted, rejected
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  admin_notes TEXT
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS applications_user_id_idx ON applications(user_id);
CREATE INDEX IF NOT EXISTS applications_status_idx ON applications(status);

-- Add RLS policies
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own applications
CREATE POLICY "Users can insert their own applications"
  ON applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to view their own applications
CREATE POLICY "Users can view their own applications"
  ON applications FOR SELECT
  USING (auth.uid() = user_id);

-- Allow admins to view all applications
CREATE POLICY "Admins can view all applications"
  ON applications FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM admin_users
    WHERE email = auth.jwt() ->> 'email'
  ));

-- Allow admins to update any application
CREATE POLICY "Admins can update any application"
  ON applications FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM admin_users
    WHERE email = auth.jwt() ->> 'email'
  ));
