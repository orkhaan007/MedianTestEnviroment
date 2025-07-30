-- Create forms table
CREATE TABLE IF NOT EXISTS forms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_full_name TEXT NOT NULL,
  is_solved BOOLEAN DEFAULT FALSE,
  is_edited BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create form_replies table
CREATE TABLE IF NOT EXISTS form_replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  form_id UUID NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_full_name TEXT NOT NULL,
  is_edited BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS (Row Level Security) policies for forms
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to view all forms
CREATE POLICY "Anyone can view forms"
  ON forms FOR SELECT
  USING (true);

-- Policy to allow authenticated users to insert their own forms
CREATE POLICY "Authenticated users can insert their own forms"
  ON forms FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update their own forms
CREATE POLICY "Users can update their own forms"
  ON forms FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy to allow users to delete their own forms
CREATE POLICY "Users can delete their own forms"
  ON forms FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add RLS (Row Level Security) policies for form_replies
ALTER TABLE form_replies ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to view all form replies
CREATE POLICY "Anyone can view form replies"
  ON form_replies FOR SELECT
  USING (true);

-- Policy to allow authenticated users to insert their own replies
CREATE POLICY "Authenticated users can insert their own replies"
  ON form_replies FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update their own replies
CREATE POLICY "Users can update their own replies"
  ON form_replies FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy to allow users to delete their own replies
CREATE POLICY "Users can delete their own replies"
  ON form_replies FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS forms_user_id_idx ON forms(user_id);
CREATE INDEX IF NOT EXISTS forms_created_at_idx ON forms(created_at DESC);
CREATE INDEX IF NOT EXISTS form_replies_form_id_idx ON form_replies(form_id);
CREATE INDEX IF NOT EXISTS form_replies_created_at_idx ON form_replies(created_at DESC);
