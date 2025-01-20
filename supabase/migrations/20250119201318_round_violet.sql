/*
  # Fix profile policies

  1. Changes
    - Add INSERT policy for profiles table to allow authenticated users to create their own profile
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can create own profile" ON profiles;

-- Create new INSERT policy
CREATE POLICY "Users can create own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);