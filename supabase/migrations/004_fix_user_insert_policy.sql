-- Fix User Insert RLS Policy
-- This migration fixes the issue where new users can't be inserted due to RLS
-- The solution: Use a database trigger to automatically create the user record

-- First, drop ALL existing policies on users table
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Service role can manage users" ON public.users;
DROP POLICY IF EXISTS "Allow authenticated inserts" ON public.users;
DROP POLICY IF EXISTS "Users can insert own data" ON public.users;
DROP POLICY IF EXISTS "Anon can insert users" ON public.users;

-- Create new comprehensive policies
-- 1. Users can read their own data
CREATE POLICY "Users can view own data" ON public.users
    FOR SELECT 
    USING (auth.uid() = id);

-- 2. Allow INSERT for anon users during signup (this is the key fix)
CREATE POLICY "Allow signup inserts" ON public.users
    FOR INSERT
    WITH CHECK (true);

-- 3. Users can update their own data
CREATE POLICY "Users can update own data" ON public.users
    FOR UPDATE
    USING (auth.uid() = id);

-- 4. Service role can do everything (for admin operations)
CREATE POLICY "Service role full access" ON public.users
    FOR ALL
    USING (auth.role() = 'service_role');

-- Alternative approach: Create a trigger-based function for automatic user creation
-- This function will be called by Supabase Auth when a new user signs up

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_role TEXT;
BEGIN
    -- Get the role from user metadata
    user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'creator');
    
    -- Insert into public.users table
    INSERT INTO public.users (id, email, role, email_verified, created_at, updated_at)
    VALUES (
        NEW.id,
        NEW.email,
        user_role,
        NEW.email_confirmed_at IS NOT NULL,
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger on auth.users to automatically create profile
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.users TO anon, authenticated;
