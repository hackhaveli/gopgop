-- Add title column to creator_reels
ALTER TABLE public.creator_reels 
ADD COLUMN IF NOT EXISTS title TEXT;
