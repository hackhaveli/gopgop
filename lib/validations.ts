import { z } from 'zod';

// User schemas
export const userSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    role: z.enum(['creator', 'brand', 'admin']),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

const optionalUrl = z.union([z.string().url(), z.literal(''), z.null()]).optional().transform(v => (v === '' || v === null) ? undefined : v);

// Creator profile schemas
export const creatorProfileSchema = z.object({
    display_name: z.string().min(2, 'Display name must be at least 2 characters').max(100),
    username: z.string().min(3, 'Username must be at least 3 characters').max(50).regex(/^[a-z0-9_]+$/, 'Username can only contain lowercase letters, numbers, and underscores'),
    bio: z.string().max(500).optional(),
    niche: z.string().max(50).optional(),
    city: z.string().max(100).optional(),
    profile_image_url: optionalUrl,
    instagram_handle: z.string().max(100).optional(),
    instagram_followers: z.number().int().min(0).optional(),
    instagram_engagement_rate: z.number().min(0).max(100).optional(),
    youtube_handle: z.string().max(100).optional(),
    youtube_subscribers: z.number().int().min(0).optional(),
    whatsapp: z.string().max(20).optional(),
    contact_email: z.string().email().or(z.literal('')).optional(),
});

export const updateCreatorProfileSchema = creatorProfileSchema.partial();

// Creator reel schemas
export const creatorReelSchema = z.object({
    platform: z.string().min(1, 'Platform is required'),
    reel_url: z.string().min(1, 'Reel URL is required').refine(
        (val) => {
            // Accept any string that looks like a URL or social media link
            return val.trim().length > 0 && (
                val.startsWith('http://') ||
                val.startsWith('https://') ||
                val.startsWith('www.') ||
                val.includes('instagram.com') ||
                val.includes('youtube.com') ||
                val.includes('youtu.be')
            );
        },
        { message: 'Please enter a valid social media URL' }
    ),
    thumbnail_url: optionalUrl,
    views: z.number().int().min(0).optional(),
    likes: z.number().int().min(0).optional(),
    comments: z.number().int().min(0).optional(),
    shares: z.number().int().min(0).optional(),
    title: z.string().max(200).optional(),
});

// Brand profile schemas
export const brandProfileSchema = z.object({
    company_name: z.string().min(2, 'Company name must be at least 2 characters').max(200),
    industry: z.string().max(100).optional(),
    website_url: optionalUrl,
    logo_url: optionalUrl,
    contact_email: z.string().email().or(z.literal('')).optional(),
});

export const updateBrandProfileSchema = brandProfileSchema.partial();

// Inquiry schema
export const inquirySchema = z.object({
    creator_id: z.string().uuid('Invalid creator ID'),
    message: z.string().max(1000).optional(),
});

// Search/filter schemas
export const searchCreatorsSchema = z.object({
    niche: z.string().optional(),
    city: z.string().optional(),
    min_followers: z.number().int().min(0).optional(),
    max_followers: z.number().int().min(0).optional(),
    min_engagement: z.number().min(0).max(100).optional(),
    verification_status: z.enum(['pending', 'verified', 'rejected']).optional(),
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(100).default(20),
});

// Subscription schemas
export const createSubscriptionSchema = z.object({
    plan_id: z.string().min(1, 'Plan ID is required'),
});

// Analytics upload schema
export const analyticsUploadSchema = z.object({
    screenshot_url: z.string().url('Invalid screenshot URL'),
    upload_type: z.string().max(50).optional(),
});

// Type exports
export type UserInput = z.infer<typeof userSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreatorProfileInput = z.infer<typeof creatorProfileSchema>;
export type UpdateCreatorProfileInput = z.infer<typeof updateCreatorProfileSchema>;
export type CreatorReelInput = z.infer<typeof creatorReelSchema>;
export type BrandProfileInput = z.infer<typeof brandProfileSchema>;
export type UpdateBrandProfileInput = z.infer<typeof updateBrandProfileSchema>;
export type InquiryInput = z.infer<typeof inquirySchema>;
export type SearchCreatorsInput = z.infer<typeof searchCreatorsSchema>;
export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;
export type AnalyticsUploadInput = z.infer<typeof analyticsUploadSchema>;
