-- Add email column to user_profiles if it doesn't exist
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS email TEXT NOT NULL UNIQUE DEFAULT '';

-- Update existing rows to have a default email if needed
UPDATE user_profiles SET email = 'user_' || id::text || '@example.com' WHERE email = '';

-- Add NOT NULL constraint if needed
ALTER TABLE user_profiles
ALTER COLUMN email SET NOT NULL;

-- Create unique index on email
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
