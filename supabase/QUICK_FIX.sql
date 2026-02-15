-- ⚡ QUICK FIX FOR EXISTING USER
-- Run this in Supabase SQL Editor to fix login immediately

-- 1. Confirm email for existing user
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email = 'coderrohit2927@gmail.com';

-- 2. Create user profile in public.users table
INSERT INTO public.users (id, email, role, email_verified, created_at, updated_at)
SELECT 
    id,
    email,
    COALESCE(raw_user_meta_data->>'role', 'creator') as role,
    true as email_verified,
    created_at,
    NOW() as updated_at
FROM auth.users 
WHERE email = 'coderrohit2927@gmail.com'
ON CONFLICT (id) DO UPDATE SET 
    email_verified = true,
    updated_at = NOW();

-- 3. Verify the fix
SELECT 'auth.users' as table_name, id, email, email_confirmed_at 
FROM auth.users 
WHERE email = 'coderrohit2927@gmail.com'
UNION ALL
SELECT 'public.users' as table_name, id, email, email_verified::text as email_confirmed_at
FROM public.users 
WHERE email = 'coderrohit2927@gmail.com';

-- Expected: You should see 2 rows (one from auth.users, one from public.users)
