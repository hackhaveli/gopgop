-- GopGop Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  role VARCHAR(20) NOT NULL CHECK (role IN ('creator', 'brand', 'admin')),
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Creator Profiles table
CREATE TABLE IF NOT EXISTS creator_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  display_name VARCHAR(100) NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  bio TEXT,
  niche VARCHAR(50),
  city VARCHAR(100),
  profile_image_url TEXT,
  instagram_handle VARCHAR(100),
  instagram_followers INTEGER,
  instagram_engagement_rate DECIMAL(5,2),
  youtube_handle VARCHAR(100),
  youtube_subscribers INTEGER,
  verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  plan_type VARCHAR(20) DEFAULT 'free' CHECK (plan_type IN ('free', 'pro')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Creator Reels table
CREATE TABLE IF NOT EXISTS creator_reels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES creator_profiles(id) ON DELETE CASCADE,
  platform VARCHAR(20) NOT NULL,
  reel_url TEXT NOT NULL,
  thumbnail_url TEXT,
  views INTEGER,
  likes INTEGER,
  comments INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Brand Profiles table
CREATE TABLE IF NOT EXISTS brand_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  company_name VARCHAR(200) NOT NULL,
  industry VARCHAR(100),
  website_url TEXT,
  logo_url TEXT,
  plan_type VARCHAR(20) DEFAULT 'trial' CHECK (plan_type IN ('trial', 'pro')),
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  plan_id VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'trial')),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  razorpay_subscription_id VARCHAR(100),
  razorpay_customer_id VARCHAR(100),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inquiries table
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID REFERENCES brand_profiles(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES creator_profiles(id) ON DELETE CASCADE,
  message TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics Uploads table
CREATE TABLE IF NOT EXISTS analytics_uploads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES creator_profiles(id) ON DELETE CASCADE,
  screenshot_url TEXT NOT NULL,
  upload_type VARCHAR(50),
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shortlists table
CREATE TABLE IF NOT EXISTS shortlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID REFERENCES brand_profiles(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES creator_profiles(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(brand_id, creator_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_creator_profiles_user_id ON creator_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_creator_profiles_username ON creator_profiles(username);
CREATE INDEX IF NOT EXISTS idx_creator_profiles_niche ON creator_profiles(niche);
CREATE INDEX IF NOT EXISTS idx_creator_profiles_city ON creator_profiles(city);
CREATE INDEX IF NOT EXISTS idx_creator_profiles_verification_status ON creator_profiles(verification_status);

CREATE INDEX IF NOT EXISTS idx_creator_reels_creator_id ON creator_reels(creator_id);

CREATE INDEX IF NOT EXISTS idx_brand_profiles_user_id ON brand_profiles(user_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

CREATE INDEX IF NOT EXISTS idx_inquiries_brand_id ON inquiries(brand_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_creator_id ON inquiries(creator_id);

CREATE INDEX IF NOT EXISTS idx_shortlists_brand_id ON shortlists(brand_id);
CREATE INDEX IF NOT EXISTS idx_shortlists_creator_id ON shortlists(creator_id);

-- Row Level Security (RLS) Policies
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_reels ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE shortlists ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Creator profiles policies
CREATE POLICY "Anyone can view verified creator profiles" ON creator_profiles
  FOR SELECT USING (verification_status = 'verified' OR user_id = auth.uid());

CREATE POLICY "Creators can insert their own profile" ON creator_profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Creators can update their own profile" ON creator_profiles
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Creators can delete their own profile" ON creator_profiles
  FOR DELETE USING (user_id = auth.uid());

-- Creator reels policies
CREATE POLICY "Anyone can view reels of verified creators" ON creator_reels
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM creator_profiles 
      WHERE creator_profiles.id = creator_reels.creator_id 
      AND creator_profiles.verification_status = 'verified'
    )
  );

CREATE POLICY "Creators can manage their own reels" ON creator_reels
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM creator_profiles 
      WHERE creator_profiles.id = creator_reels.creator_id 
      AND creator_profiles.user_id = auth.uid()
    )
  );

-- Brand profiles policies
CREATE POLICY "Brands can view their own profile" ON brand_profiles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Brands can insert their own profile" ON brand_profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Brands can update their own profile" ON brand_profiles
  FOR UPDATE USING (user_id = auth.uid());

-- Subscriptions policies
CREATE POLICY "Users can view their own subscriptions" ON subscriptions
  FOR SELECT USING (user_id = auth.uid());

-- Inquiries policies
CREATE POLICY "Brands and creators can view their own inquiries" ON inquiries
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM brand_profiles WHERE brand_profiles.id = inquiries.brand_id AND brand_profiles.user_id = auth.uid())
    OR
    EXISTS (SELECT 1 FROM creator_profiles WHERE creator_profiles.id = inquiries.creator_id AND creator_profiles.user_id = auth.uid())
  );

CREATE POLICY "Brands can create inquiries" ON inquiries
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM brand_profiles WHERE brand_profiles.id = inquiries.brand_id AND brand_profiles.user_id = auth.uid())
  );

-- Shortlists policies
CREATE POLICY "Brands can manage their own shortlists" ON shortlists
  FOR ALL USING (
    EXISTS (SELECT 1 FROM brand_profiles WHERE brand_profiles.id = shortlists.brand_id AND brand_profiles.user_id = auth.uid())
  );

-- Analytics uploads policies
CREATE POLICY "Creators can view their own analytics" ON analytics_uploads
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM creator_profiles WHERE creator_profiles.id = analytics_uploads.creator_id AND creator_profiles.user_id = auth.uid())
  );

CREATE POLICY "Creators can upload their own analytics" ON analytics_uploads
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM creator_profiles WHERE creator_profiles.id = analytics_uploads.creator_id AND creator_profiles.user_id = auth.uid())
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creator_profiles_updated_at BEFORE UPDATE ON creator_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brand_profiles_updated_at BEFORE UPDATE ON brand_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
