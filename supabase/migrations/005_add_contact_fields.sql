-- Add contact fields to creator_profiles
ALTER TABLE public.creator_profiles 
ADD COLUMN IF NOT EXISTS whatsapp TEXT,
ADD COLUMN IF NOT EXISTS contact_email TEXT;

-- Update RLS policies to reflect changes if necessary
-- (Existing policies for creator_profiles should cover these new columns)
