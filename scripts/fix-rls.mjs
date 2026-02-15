/**
 * Quick Migration Fix Script
 * Applies the user insert policy fix directly to Supabase
 */

import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('❌ Missing environment variables! Create a .env.local file with:');
    console.error('   NEXT_PUBLIC_SUPABASE_URL=your_url');
    console.error('   SUPABASE_SERVICE_ROLE_KEY=your_service_key');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function fixRLSPolicies() {
    console.log('🔧 Fixing RLS Policies for User Signup...\n');

    try {
        // Test connection
        const { data: testData, error: testError } = await supabase
            .from('users')
            .select('count')
            .limit(1);

        if (testError) {
            console.error('❌ Connection failed:', testError.message);
            console.error('\nPlease ensure:');
            console.error('1. Your Supabase project is running');
            console.error('2. The environment variables are correct');
            console.error('3. The users table exists');
            return;
        }

        console.log('✅ Connected to Supabase successfully\n');
        console.log('📋 To apply the migration, you need to:');
        console.log('\n1. Go to your Supabase Dashboard');
        console.log('2. Navigate to SQL Editor');
        console.log('3. Copy and paste the SQL from:');
        console.log('   supabase/migrations/004_fix_user_insert_policy.sql');
        console.log('\n4. Or use Supabase CLI:');
        console.log('   npx supabase db push\n');

        console.log('📄 Migration SQL Preview:');
        console.log('─'.repeat(60));
        console.log(`
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Service role can manage users" ON public.users;
DROP POLICY IF EXISTS "Allow authenticated inserts" ON public.users;

-- Create new comprehensive policies
CREATE POLICY "Users can view own data" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Allow signup inserts" ON public.users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own data" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Service role full access" ON public.users
    FOR ALL USING (auth.role() = 'service_role');

-- Create trigger for automatic user creation
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.users TO anon, authenticated;
        `);
        console.log('─'.repeat(60));

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

fixRLSPolicies();
