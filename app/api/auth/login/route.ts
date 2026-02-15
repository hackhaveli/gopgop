import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

import { createRouteClient } from '@/lib/supabase-server';
import { successResponse, errorResponse, handleError } from '@/lib/api-response';
import { loginSchema } from '@/lib/validations';

/**
 * POST /api/auth/login
 * Authenticate user with email and password
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate input
        const validatedData = loginSchema.parse(body);
        const { email, password } = validatedData;

        // Create Supabase client
        const supabase = await createRouteClient();

        // Sign in with email and password
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            console.error('Login error:', authError);
            return errorResponse('Invalid email or password', 401, 'INVALID_CREDENTIALS');
        }

        if (!authData.user || !authData.session) {
            return errorResponse('Login failed', 500, 'LOGIN_FAILED');
        }

        // Get user details from database
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('id, email, role, email_verified')
            .eq('id', authData.user.id)
            .single();

        if (userError || !user) {
            console.error('User fetch error:', userError);
            return errorResponse('User profile not found', 404, 'USER_NOT_FOUND');
        }

        return successResponse({
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                email_verified: user.email_verified,
            },
            session: authData.session,
        });
    } catch (error) {
        return handleError(error);
    }
}
