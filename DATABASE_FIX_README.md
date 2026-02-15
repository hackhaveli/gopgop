# 🔧 DATABASE FIX REQUIRED - User Signup Issues

## Current Issues
1. ❌ **RLS Policy Error**: "new row violates row-level security policy for table 'users'"
2. ⚠️ **Email Rate Limit**: Temporary Supabase auth rate limiting (from testing)

## Solution Applied

### Changes Made:
1. **✅ Created Migration**: `supabase/migrations/004_fix_user_insert_policy.sql`
   - Fixes RLS policies to allow user signup
   - Adds database trigger for automatic user creation
   - Grants proper permissions to anon/authenticated roles

2. **✅ Updated Signup Route**: `app/api/auth/signup/route.ts`
   - Now uses trigger-based user creation
   - Handles rate limiting gracefully
   - Improved error messages

## How to Apply the Fix

### Option 1: Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**: Go to https://supabase.com/dashboard
2. **Navigate to your project**
3. **Go to SQL Editor** (left sidebar)
4. **Create a new query**
5. **Copy the SQL** from `supabase/migrations/004_fix_user_insert_policy.sql`
6. **Paste and Run** the SQL
7. **Verify**: You should see "Success. No rows returned"

### Option 2: Supabase CLI

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Link your project
npx supabase link --project-ref YOUR_PROJECT_REF

# Apply migration
npx supabase db push
```

### Option 3: Manual SQL Execution

Open your Supabase SQL Editor and run:

```sql
-- Fix User Insert RLS Policy
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Service role can manage users" ON public.users;
DROP POLICY IF EXISTS "Allow authenticated inserts" ON public.users;
DROP POLICY IF EXISTS "Users can insert own data" ON public.users;
DROP POLICY IF EXISTS "Anon can insert users" ON public.users;

-- Create new policies
CREATE POLICY "Users can view own data" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Allow signup inserts" ON public.users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own data" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Service role full access" ON public.users
    FOR ALL USING (auth.role() = 'service_role');

-- Create trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_role TEXT;
BEGIN
    user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'creator');
    
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

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.users TO anon, authenticated;
```

## Fixing Rate Limit Issue

The rate limit error is temporary and occurs from too many signup attempts. Wait 5-10 minutes before testing again, or:

1. **Clear your browser cache**
2. **Use a different email address**
3. **Wait for the rate limit to reset** (usually 1 hour)

## Testing After Fix

1. **Restart your dev server**:
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

2. **Try signing up** with a new email address

3. **Expected behavior**:
   - ✅ User created in `auth.users` table
   - ✅ User automatically created in `public.users` table (via trigger)
   - ✅ No RLS policy errors
   - ✅ Success response with session

## Verification Checklist

After applying the migration, verify:

- [ ] Can sign up with new email
- [ ] User appears in `auth.users` table
- [ ] User appears in `public.users` table with correct role
- [ ] No RLS policy errors in console
- [ ] Session is returned successfully

## Support

If issues persist:
1. Check Supabase logs in Dashboard → Logs
2. Verify all migrations are applied
3. Ensure environment variables are set correctly
4. Check that RLS is enabled but policies are permissive for signup

## Environment Variables Required

Make sure you have `.env.local` (create if missing):

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
