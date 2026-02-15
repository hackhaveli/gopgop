# GopGop Backend Setup Guide

## Phase 1 Completed ✅

The backend foundation has been set up with the following components:

### Installed Dependencies
- `@supabase/supabase-js` - Supabase JavaScript client
- `@supabase/auth-helpers-nextjs` - Next.js auth helpers
- `zod` - Schema validation

### Created Files

#### 1. Database & Types
- **`lib/database.types.ts`** - TypeScript type definitions for all database tables
- **`lib/supabase.ts`** - Supabase client utilities for different contexts
- **`supabase/schema.sql`** - Complete database schema with RLS policies

#### 2. Validation & API Utilities
- **`lib/validations.ts`** - Zod schemas for all API inputs
- **`lib/api-response.ts`** - Standardized API response helpers
- **`lib/auth-middleware.ts`** - Authentication & authorization middleware

#### 3. Configuration
- **`.env.local`** - Environment variables template
- **`.gitignore`** - Updated to exclude env files

---

## Next Steps: Configure Supabase

### Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in details:
   - **Name**: gopgop (or your choice)
   - **Database Password**: (save this securely)
   - **Region**: Choose closest to India (Asia Pacific - Singapore recommended)
5. Wait for project to initialize (~2 minutes)

### Step 2: Get API Keys

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`, ⚠️ keep this secret!)

### Step 3: Update Environment Variables

Open `.env.local` and update:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### Step 4: Run Database Migration

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `supabase/schema.sql`
4. Paste into the SQL editor
5. Click **Run** (or press F5)
6. Verify all tables are created in **Table Editor**

Expected tables:
- ✅ users
- ✅ creator_profiles
- ✅ creator_reels
- ✅ brand_profiles
- ✅ subscriptions
- ✅ inquiries
- ✅ analytics_uploads
- ✅ shortlists

### Step 5: Configure Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider (enabled by default)
3. Optional: Enable social providers (Google, Instagram, etc.)
4. Go to **Authentication** → **URL Configuration**
5. Add site URL: `http://localhost:3000` (for development)

### Step 6: Verify Setup

Restart your Next.js development server:

```bash
npm run dev
```

The backend foundation is now ready!

---

## What's Next?

We'll build API endpoints in this order:

1. **Phase 2**: Authentication endpoints (signup, login, logout)
2. **Phase 3**: Creator profile management
3. **Phase 4**: Brand features and search
4. **Phase 5**: Subscriptions with Razorpay
5. **Phase 6**: Admin panel backend
6. **Phase 7**: File upload and storage
7. **Phase 8**: Testing and security
8. **Phase 9**: Deployment

---

## Troubleshooting

### "Missing environment variables" error
- Ensure `.env.local` has all required values
- Restart dev server after updating `.env.local`

### Database connection errors
- Verify Supabase project is not paused
- Check API keys are correct
- Ensure SQL migration ran successfully

### Type errors
- Run `npm install` to ensure all dependencies are installed
- Check that `lib/database.types.ts` matches your schema

---

## Database Schema Overview

```
users (auth & roles)
├── creator_profiles (creator data)
│   ├── creator_reels (content)
│   └── analytics_uploads (verification)
└── brand_profiles (brand data)
    ├── inquiries (brand→creator contact)
    └── shortlists (saved creators)

subscriptions (payments)
```

All tables have Row Level Security (RLS) enabled for data protection.
