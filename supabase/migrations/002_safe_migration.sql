-- GopGop Database Schema - Safe Migration
-- This version safely handles existing objects

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Public can view verified creators" ON public.creator_profiles;
DROP POLICY IF EXISTS "Creators can manage own profile" ON public.creator_profiles;
DROP POLICY IF EXISTS "Public can view reels" ON public.creator_reels;
DROP POLICY IF EXISTS "Creators can manage own reels" ON public.creator_reels;
DROP POLICY IF EXISTS "Brands can manage own profile" ON public.brand_profiles;
DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Brands can manage own inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Creators can view inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Creators can manage own analytics" ON public.analytics_uploads;
DROP POLICY IF EXISTS "Brands can manage own shortlists" ON public.shortlists;

-- Users table (core authentication)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    role TEXT NOT NULL CHECK (role IN ('creator', 'brand', 'admin')),
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Creator profiles
CREATE TABLE IF NOT EXISTS public.creator_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    bio TEXT,
    niche TEXT,
    city TEXT,
    profile_image_url TEXT,
    instagram_handle TEXT,
    instagram_followers INTEGER,
    instagram_engagement_rate DECIMAL(5,2),
    youtube_handle TEXT,
    youtube_subscribers INTEGER,
    verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    plan_type TEXT DEFAULT 'free' CHECK (plan_type IN ('free', 'pro')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Creator reels
CREATE TABLE IF NOT EXISTS public.creator_reels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID REFERENCES public.creator_profiles(id) ON DELETE CASCADE NOT NULL,
    platform TEXT NOT NULL,
    reel_url TEXT NOT NULL,
    thumbnail_url TEXT,
    views INTEGER,
    likes INTEGER,
    comments INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Brand profiles
CREATE TABLE IF NOT EXISTS public.brand_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    company_name TEXT NOT NULL,
    industry TEXT,
    website_url TEXT,
    logo_url TEXT,
    plan_type TEXT DEFAULT 'trial' CHECK (plan_type IN ('trial', 'pro')),
    trial_ends_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    plan_id TEXT NOT NULL,
    status TEXT DEFAULT 'trial' CHECK (status IN ('active', 'cancelled', 'expired', 'trial')),
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    razorpay_subscription_id TEXT,
    razorpay_customer_id TEXT,
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inquiries (brand to creator)
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID REFERENCES public.brand_profiles(id) ON DELETE CASCADE NOT NULL,
    creator_id UUID REFERENCES public.creator_profiles(id) ON DELETE CASCADE NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'closed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics uploads
CREATE TABLE IF NOT EXISTS public.analytics_uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID REFERENCES public.creator_profiles(id) ON DELETE CASCADE NOT NULL,
    screenshot_url TEXT NOT NULL,
    upload_type TEXT,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shortlists (brands save creators)
CREATE TABLE IF NOT EXISTS public.shortlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID REFERENCES public.brand_profiles(id) ON DELETE CASCADE NOT NULL,
    creator_id UUID REFERENCES public.creator_profiles(id) ON DELETE CASCADE NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(brand_id, creator_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_creator_profiles_user_id ON public.creator_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_creator_profiles_username ON public.creator_profiles(username);
CREATE INDEX IF NOT EXISTS idx_creator_profiles_verification ON public.creator_profiles(verification_status);
CREATE INDEX IF NOT EXISTS idx_creator_profiles_niche ON public.creator_profiles(niche);
CREATE INDEX IF NOT EXISTS idx_creator_profiles_city ON public.creator_profiles(city);
CREATE INDEX IF NOT EXISTS idx_brand_profiles_user_id ON public.brand_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_brand_id ON public.inquiries(brand_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_creator_id ON public.inquiries(creator_id);
CREATE INDEX IF NOT EXISTS idx_shortlists_brand_id ON public.shortlists(brand_id);

-- Row Level Security (RLS) Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_reels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shortlists ENABLE ROW LEVEL SECURITY;

-- Users: Users can read their own data
CREATE POLICY "Users can view own data" ON public.users
    FOR SELECT USING (auth.uid() = id);

-- Creator profiles: Public can view verified creators, creators can manage their own
CREATE POLICY "Public can view verified creators" ON public.creator_profiles
    FOR SELECT USING (verification_status = 'verified');

CREATE POLICY "Creators can manage own profile" ON public.creator_profiles
    FOR ALL USING (auth.uid() = user_id);

-- Creator reels: Public can view, creators can manage their own
CREATE POLICY "Public can view reels" ON public.creator_reels
    FOR SELECT USING (true);

CREATE POLICY "Creators can manage own reels" ON public.creator_reels
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.creator_profiles
            WHERE id = creator_reels.creator_id AND user_id = auth.uid()
        )
    );

-- Brand profiles: Brands can manage their own
CREATE POLICY "Brands can manage own profile" ON public.brand_profiles
    FOR ALL USING (auth.uid() = user_id);

-- Subscriptions: Users can view their own
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- Inquiries: Brands and creators can view their own
CREATE POLICY "Brands can manage own inquiries" ON public.inquiries
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.brand_profiles
            WHERE id = inquiries.brand_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Creators can view inquiries" ON public.inquiries
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.creator_profiles
            WHERE id = inquiries.creator_id AND user_id = auth.uid()
        )
    );

-- Analytics uploads: Creators can manage their own
CREATE POLICY "Creators can manage own analytics" ON public.analytics_uploads
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.creator_profiles
            WHERE id = analytics_uploads.creator_id AND user_id = auth.uid()
        )
    );

-- Shortlists: Brands can manage their own
CREATE POLICY "Brands can manage own shortlists" ON public.shortlists
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.brand_profiles
            WHERE id = shortlists.brand_id AND user_id = auth.uid()
        )
    );

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
DROP TRIGGER IF EXISTS update_creator_profiles_updated_at ON public.creator_profiles;
DROP TRIGGER IF EXISTS update_brand_profiles_updated_at ON public.brand_profiles;
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON public.subscriptions;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creator_profiles_updated_at BEFORE UPDATE ON public.creator_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brand_profiles_updated_at BEFORE UPDATE ON public.brand_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
