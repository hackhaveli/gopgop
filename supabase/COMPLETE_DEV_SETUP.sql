-- 🔧 IMPROVED DEVELOPMENT SETUP
-- Auto-confirms email AND creates profiles for both Creators and Brands

-- 1. Auto-confirm function
CREATE OR REPLACE FUNCTION public.auto_confirm_user()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.email_confirmed_at IS NULL THEN
        NEW.email_confirmed_at := NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Improved user profile trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_role TEXT;
    target_username TEXT;
BEGIN
    user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'creator');
    
    -- Insert into public.users
    INSERT INTO public.users (id, email, role, email_verified, created_at, updated_at)
    VALUES (NEW.id, NEW.email, user_role, true, NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET email_verified = true, updated_at = NOW();

    -- Create Creator Profile if role is creator
    IF user_role = 'creator' THEN
        -- Generate a simple username from email if not provided
        target_username := COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1) || '_' || floor(random()*1000)::text);
        
        INSERT INTO public.creator_profiles (user_id, display_name, username, verification_status, plan_type, created_at, updated_at)
        VALUES (NEW.id, target_username, target_username, 'pending', 'free', NOW(), NOW())
        ON CONFLICT (user_id) DO NOTHING;
    END IF;

    -- Create Brand Profile if role is brand
    IF user_role = 'brand' THEN
        INSERT INTO public.brand_profiles (user_id, company_name, plan_type, created_at, updated_at)
        VALUES (NEW.id, NEW.email, 'trial', NOW(), NOW())
        ON CONFLICT (user_id) DO NOTHING;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-apply triggers
DROP TRIGGER IF EXISTS auto_confirm_new_users ON auth.users;
CREATE TRIGGER auto_confirm_new_users
    BEFORE INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.auto_confirm_user();

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 3. FIX FOR EXISTING USER (coderrohit2927@gmail.com)
DO $$
DECLARE
    target_id UUID;
    target_email TEXT := 'coderrohit2927@gmail.com';
BEGIN
    -- Get user ID
    SELECT id INTO target_id FROM auth.users WHERE email = target_email;

    IF target_id IS NOT NULL THEN
        -- Confirm auth email
        UPDATE auth.users SET email_confirmed_at = NOW() WHERE id = target_id;

        -- Ensure public.users entry
        INSERT INTO public.users (id, email, role, email_verified, created_at, updated_at)
        VALUES (target_id, target_email, 'creator', true, NOW(), NOW())
        ON CONFLICT (id) DO UPDATE SET email_verified = true;

        -- Ensure creator_profiles entry
        INSERT INTO public.creator_profiles (user_id, display_name, username, verification_status, plan_type, bio, niche, city, whatsapp, contact_email, created_at, updated_at)
        VALUES (target_id, 'Rohit Kumar', 'rohit', 'verified', 'pro', 'Professional fashion creator and tech enthusiast. Helping brands reach the right audience.', 'Fashion & Tech', 'Delhi', '+91 99999 88888', 'rohit@example.com', NOW(), NOW())
        ON CONFLICT (user_id) DO UPDATE SET 
            verification_status = 'verified',
            bio = EXCLUDED.bio,
            whatsapp = EXCLUDED.whatsapp,
            contact_email = EXCLUDED.contact_email;
    END IF;
END $$;

-- 4. RLS Policy Fixes
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.users TO anon, authenticated;
GRANT ALL ON public.creator_profiles TO anon, authenticated;
GRANT ALL ON public.brand_profiles TO anon, authenticated;

DROP POLICY IF EXISTS "Allow signup inserts" ON public.users;
CREATE POLICY "Allow signup inserts" ON public.users FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Creators can manage own profile" ON public.creator_profiles;
CREATE POLICY "Creators can manage own profile" ON public.creator_profiles FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Brands can manage own profile" ON public.brand_profiles;
CREATE POLICY "Brands can manage own profile" ON public.brand_profiles FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Public can view verified creators" ON public.creator_profiles;
CREATE POLICY "Public can view verified creators" ON public.creator_profiles FOR SELECT USING (true);
