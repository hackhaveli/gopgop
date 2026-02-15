export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    email: string
                    password_hash: string | null
                    role: 'creator' | 'brand' | 'admin'
                    email_verified: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    email: string
                    password_hash?: string | null
                    role: 'creator' | 'brand' | 'admin'
                    email_verified?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    password_hash?: string | null
                    role?: 'creator' | 'brand' | 'admin'
                    email_verified?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            creator_profiles: {
                Row: {
                    id: string
                    user_id: string
                    display_name: string
                    username: string
                    bio: string | null
                    niche: string | null
                    city: string | null
                    profile_image_url: string | null
                    instagram_handle: string | null
                    instagram_followers: number | null
                    instagram_engagement_rate: number | null
                    youtube_handle: string | null
                    youtube_subscribers: number | null
                    verification_status: 'pending' | 'verified' | 'rejected'
                    plan_type: 'free' | 'pro'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    display_name: string
                    username: string
                    bio?: string | null
                    niche?: string | null
                    city?: string | null
                    profile_image_url?: string | null
                    instagram_handle?: string | null
                    instagram_followers?: number | null
                    instagram_engagement_rate?: number | null
                    youtube_handle?: string | null
                    youtube_subscribers?: number | null
                    verification_status?: 'pending' | 'verified' | 'rejected'
                    plan_type?: 'free' | 'pro'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    display_name?: string
                    username?: string
                    bio?: string | null
                    niche?: string | null
                    city?: string | null
                    profile_image_url?: string | null
                    instagram_handle?: string | null
                    instagram_followers?: number | null
                    instagram_engagement_rate?: number | null
                    youtube_handle?: string | null
                    youtube_subscribers?: number | null
                    verification_status?: 'pending' | 'verified' | 'rejected'
                    plan_type?: 'free' | 'pro'
                    created_at?: string
                    updated_at?: string
                }
            }
            creator_reels: {
                Row: {
                    id: string
                    creator_id: string
                    platform: string
                    reel_url: string
                    thumbnail_url: string | null
                    views: number | null
                    likes: number | null
                    comments: number | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    creator_id: string
                    platform: string
                    reel_url: string
                    thumbnail_url?: string | null
                    views?: number | null
                    likes?: number | null
                    comments?: number | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    creator_id?: string
                    platform?: string
                    reel_url?: string
                    thumbnail_url?: string | null
                    views?: number | null
                    likes?: number | null
                    comments?: number | null
                    created_at?: string
                }
            }
            brand_profiles: {
                Row: {
                    id: string
                    user_id: string
                    company_name: string
                    industry: string | null
                    website_url: string | null
                    logo_url: string | null
                    plan_type: 'trial' | 'pro'
                    trial_ends_at: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    company_name: string
                    industry?: string | null
                    website_url?: string | null
                    logo_url?: string | null
                    plan_type?: 'trial' | 'pro'
                    trial_ends_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    company_name?: string
                    industry?: string | null
                    website_url?: string | null
                    logo_url?: string | null
                    plan_type?: 'trial' | 'pro'
                    trial_ends_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            subscriptions: {
                Row: {
                    id: string
                    user_id: string
                    plan_id: string
                    status: 'active' | 'cancelled' | 'expired' | 'trial'
                    amount: number
                    currency: string
                    razorpay_subscription_id: string | null
                    razorpay_customer_id: string | null
                    current_period_start: string | null
                    current_period_end: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    plan_id: string
                    status?: 'active' | 'cancelled' | 'expired' | 'trial'
                    amount: number
                    currency?: string
                    razorpay_subscription_id?: string | null
                    razorpay_customer_id?: string | null
                    current_period_start?: string | null
                    current_period_end?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    plan_id?: string
                    status?: 'active' | 'cancelled' | 'expired' | 'trial'
                    amount?: number
                    currency?: string
                    razorpay_subscription_id?: string | null
                    razorpay_customer_id?: string | null
                    current_period_start?: string | null
                    current_period_end?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            inquiries: {
                Row: {
                    id: string
                    brand_id: string
                    creator_id: string
                    message: string | null
                    status: 'pending' | 'contacted' | 'closed'
                    created_at: string
                }
                Insert: {
                    id?: string
                    brand_id: string
                    creator_id: string
                    message?: string | null
                    status?: 'pending' | 'contacted' | 'closed'
                    created_at?: string
                }
                Update: {
                    id?: string
                    brand_id?: string
                    creator_id?: string
                    message?: string | null
                    status?: 'pending' | 'contacted' | 'closed'
                    created_at?: string
                }
            }
            analytics_uploads: {
                Row: {
                    id: string
                    creator_id: string
                    screenshot_url: string
                    upload_type: string | null
                    verified: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    creator_id: string
                    screenshot_url: string
                    upload_type?: string | null
                    verified?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    creator_id?: string
                    screenshot_url?: string
                    upload_type?: string | null
                    verified?: boolean
                    created_at?: string
                }
            }
            shortlists: {
                Row: {
                    id: string
                    brand_id: string
                    creator_id: string
                    notes: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    brand_id: string
                    creator_id: string
                    notes?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    brand_id?: string
                    creator_id?: string
                    notes?: string | null
                    created_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}
