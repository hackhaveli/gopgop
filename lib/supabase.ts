import { createBrowserClient as createSupabaseBrowserClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

import type { Database } from './database.types';

/**
 * GopGop Supabase Client Utilities
 * This file is for Client Components and generic utilities.
 * Server-only clients (createServerClient, createRouteClient) are moved to lib/supabase-server.ts
 */

// Client-side Supabase client (for use in Client Components)
export const createClient = () => {
    return createSupabaseBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
};

// Admin client with service role key (use with caution, only in server-side code)
// This can stay here as it doesn't use next/headers or cookies()
export const createAdminClient = () => {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
    }

    return createSupabaseClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    );
};
