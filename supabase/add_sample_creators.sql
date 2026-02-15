-- 📊 Sample Creator Data - Add More Creators to Your Platform
-- Run this in Supabase SQL Editor to populate with realistic test data

-- Note: This assumes you have users created through signup
-- For demo purposes, we'll use the actual user_ids from existing creators and modify them slightly

-- First, let's see what users we have
-- SELECT id, email FROM auth.users LIMIT 5;

-- Method 1: Create more sample data using existing user_ids (for testing only)
-- WARNING: This creates profiles that won't have corresponding auth users
-- Only use this for visual testing of the brands dashboard

-- Get an existing user_id to use as template
DO $$
DECLARE
  sample_user_id uuid;
BEGIN
  -- Get first creator's user_id
  SELECT user_id INTO sample_user_id FROM creator_profiles LIMIT 1;
  
  -- Insert sample creators (they won't be able to login, but will show in dashboard)
  INSERT INTO creator_profiles (
    user_id,
    display_name,
    username,
    bio,
    niche,
    city,
    instagram_followers,
    instagram_engagement_rate,
    contact_email,
    whatsapp,
    verification_status
  ) VALUES 
  -- Creator 1: Fashion Influencer
  (
    gen_random_uuid(),  -- Random UUID (won't match real user)
    'Priya Malhotra',
    'priya_fashion_' || floor(random() * 1000),  -- Unique username
    'Fashion stylist and lifestyle blogger. Sharing daily outfit inspiration and beauty tips for modern Indian women.',
    'Fashion & Beauty',
    'Mumbai',
    85000,
    5.8,
    'priya' || floor(random() * 1000) || '@example.com',
    '+91 98765 11111',
    'verified'
  ),
  -- Creator 2: Food Blogger
  (
    gen_random_uuid(),
    'Arjun Khanna',
    'arjun_foodie_' || floor(random() * 1000),
    'Food enthusiast exploring street food gems across India. Restaurant reviews and cooking tutorials.',
    'Food & Cooking',
    'Delhi',
    120000,
    6.2,
    'arjun' || floor(random() * 1000) || '@example.com',
    '+91 98765 22222',
    'verified'
  ),
  -- Creator 3: Tech Reviewer
  (
    gen_random_uuid(),
    'Neha Verma',
    'neha_tech_' || floor(random() * 1000),
    'Tech reviewer and gadget expert. Honest reviews, unboxings, and tech tutorials in Hindi and English.',
    'Tech & Gadgets',
    'Bangalore',
    95000,
    4.7,
    'neha' || floor(random() * 1000) || '@example.com',
    '+91 98765 33333',
    'verified'
  ),
  -- Creator 4: Fitness Coach
  (
    gen_random_uuid(),
    'Vikram Singh',
    'vikram_fit_' || floor(random() * 1000),
    'Certified fitness trainer. Helping you achieve your health goals with home workouts and nutrition tips.',
    'Fitness & Health',
    'Pune',
    67000,
    7.1,
    'vikram' || floor(random() * 1000) || '@example.com',
    '+91 98765 44444',
    'verified'
  ),
  -- Creator 5: Travel Vlogger
  (
    gen_random_uuid(),
    'Ananya Rao',
    'ananya_travels_' || floor(random() * 1000),
    'Travel content creator exploring hidden gems of India. Budget travel tips and adventure stories.',
    'Travel',
    'Hyderabad',
    145000,
    5.3,
    'ananya' || floor(random() * 1000) || '@example.com',
    '+91 98765 55555',
    'verified'
  ),
  -- Creator 6: Beauty Guru
  (
    gen_random_uuid(),
    'Simran Kaur',
    'simran_beauty_' || floor(random() * 1000),
    'Makeup artist and beauty influencer. Tutorials, product reviews, and skincare routines for all skin types.',
    'Fashion & Beauty',
    'Delhi',
    78000,
    6.5,
    'simran' || floor(random() * 1000) || '@example.com',
    '+91 98765 66666',
    'verified'
  ),
  -- Creator 7: Tech Entrepreneur  
  (
    gen_random_uuid(),
    'Rahul Nair',
    'rahul_techie_' || floor(random() * 1000),
    'Software engineer turned content creator. Coding tutorials, career advice, and startup stories.',
    'Tech & Gadgets',
    'Mumbai',
    55000,
    4.2,
    'rahul' || floor(random() * 1000) || '@example.com',
    '+91 98765 77777',
    'verified'
  ),
  -- Creator 8: Cooking Expert
  (
    gen_random_uuid(),
    'Kavya Reddy',
    'kavya_kitchen_' || floor(random() * 1000),
    'Home chef sharing authentic South Indian recipes. Quick and easy cooking videos for busy people.',
    'Food & Cooking',
    'Bangalore',
    92000,
    5.9,
    'kavya' || floor(random() * 1000) || '@example.com',
    '+91 98765 88888',
    'verified'
  ),
  -- Creator 9: Finance Advisor
  (
    gen_random_uuid(),
    'Amit Patel',
    'amit_finance_' || floor(random() * 1000),
    'Personal finance expert. Investment tips, tax planning, and money management for millennials.',
    'Tech & Gadgets',
    'Mumbai',
    72000,
    4.9,
    'amit' || floor(random() * 1000) || '@example.com',
    '+91 98765 99999',
    'verified'
  ),
  -- Creator 10: Lifestyle Blogger
  (
    gen_random_uuid(),
    'Divya Joshi',
    'divya_lifestyle_' || floor(random() * 1000),
    'Lifestyle blogger sharing daily vlogs, home decor inspiration, and parenting tips.',
    'Fashion & Beauty',
    'Pune',
    61000,
    5.4,
    'divya' || floor(random() * 1000) || '@example.com',
    '+91 98765 00000',
    'verified'
  );
  
  RAISE NOTICE 'Successfully created 10 sample creators!';
END $$;

-- Verify the creators were added
SELECT COUNT(*) as verified_creators 
FROM creator_profiles 
WHERE verification_status = 'verified';

-- See all creators
SELECT 
  display_name, 
  username, 
  niche, 
  city, 
  instagram_followers,
  instagram_engagement_rate
FROM creator_profiles 
WHERE verification_status = 'verified'
ORDER BY instagram_followers DESC
LIMIT 15;
