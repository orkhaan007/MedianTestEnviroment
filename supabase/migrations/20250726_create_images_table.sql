-- Create images table for gallery
CREATE TABLE IF NOT EXISTS images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS (Row Level Security) policies
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to view all images
CREATE POLICY "Anyone can view images"
  ON images FOR SELECT
  USING (true);

-- Policy to allow authenticated users to insert their own images
CREATE POLICY "Authenticated users can insert their own images"
  ON images FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update their own images
CREATE POLICY "Users can update their own images"
  ON images FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy to allow users to delete their own images
CREATE POLICY "Users can delete their own images"
  ON images FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS images_user_id_idx ON images(user_id);
CREATE INDEX IF NOT EXISTS images_created_at_idx ON images(created_at DESC);
