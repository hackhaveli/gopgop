import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

import { createRouteClient } from '@/lib/supabase-server';
import { successResponse, errorResponse, handleError } from '@/lib/api-response';
import { userSchema } from '@/lib/validations';

/**
 * POST /api/auth/signup
 * Register a new user (creator, brand, or admin)
 * Uses database trigger to automatically create user record
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate input
        const validatedData = userSchema.parse(body);
        const { email, password, role } = validatedData;

        // Create Supabase client
        const supabase = await createRouteClient();

        // Sign up the user with Supabase Auth
        // The database trigger will automatically create the user record in public.users
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    role, // Store role in user metadata (trigger will use this)
                },
                emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
            },
        });

        if (authError) {
            console.error('Signup auth error:', authError);

            // Handle rate limit specifically
            if (authError.status === 429) {
                return errorResponse(
                    'Too many signup attempts. Please try again in a few minutes.',
                    429,
                    'RATE_LIMIT_EXCEEDED'
                );
            }

            return errorResponse(authError.message, 400, 'SIGNUP_FAILED');
        }

        if (!authData.user) {
            return errorResponse('Failed to create user', 500, 'SIGNUP_FAILED');
        }

        // Wait a moment for the trigger to complete
        await new Promise(resolve => setTimeout(resolve, 100));

        // Verify the user was created in our database
        const { data: userData, error: fetchError } = await supabase
            .from('users')
            .select('id, email, role')
            .eq('id', authData.user.id)
            .single();

        if (fetchError) {
            console.error('User verification error:', fetchError);
            // User was created in auth but not in our table - this shouldn't happen with trigger
            return errorResponse(
                'Account created but verification failed. Please try logging in.',
                500,
                'VERIFICATION_FAILED'
            );
        }

        return successResponse(
            {
                user: userData,
                session: authData.session,
                message: 'Account created successfully! Please check your email for verification.',
            },
            201
        );
    } catch (error) {
        return handleError(error);
    }
}
