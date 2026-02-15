-- Fix RLS Policy for Users Table
-- This allows the service role to insert users during signup

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Service role can insert users" ON public.users;

-- Create policies that allow:
-- 1. Users to view their own data
-- 2. Service role (backend) to insert new users during signup
-- 3. Service role to manage all users

CREATE POLICY "Users can view own data" ON public.users
    FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Service role can manage users" ON public.users
    FOR ALL
    USING (auth.role() = 'service_role');

-- Also ensure authenticated users can be inserted by the service role
CREATE POLICY "Allow authenticated inserts" ON public.users
    FOR INSERT
    WITH CHECK (true);
