/*
  # Add INSERT policy for profiles table

  1. Security Changes
    - Add policy for authenticated users to create their own profile
*/

CREATE POLICY "Users can create own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);