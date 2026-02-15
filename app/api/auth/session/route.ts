import { NextRequest } from 'next/server';
import { createRouteClient } from '@/lib/supabase-server';
import { successResponse, errorResponse, handleError } from '@/lib/api-response';

/**
 * GET /api/auth/session
 * Get the current user's session and profile
 */
export async function GET(request: NextRequest) {
    try {
        const supabase = await createRouteClient();

        // Get current session
        const {
            data: { session },
            error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
            console.error('Session error:', sessionError);
            return errorResponse('Failed to get session', 500, 'SESSION_ERROR');
        }

        if (!session) {
            return errorResponse('No active session', 401, 'NO_SESSION');
        }

        // Get user details from database
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('id, email, role, email_verified, created_at')
            .eq('id', session.user.id)
            .single();

        if (userError || !user) {
            console.error('User fetch error:', userError);
            return errorResponse('User not found', 404, 'USER_NOT_FOUND');
        }

        // Get profile based on role
        let profile = null;

        if (user.role === 'creator') {
            const { data } = await supabase
                .from('creator_profiles')
                .select('*')
                .eq('user_id', user.id)
                .single();
            profile = data;
        } else if (user.role === 'brand') {
            const { data } = await supabase
                .from('brand_profiles')
                .select('*')
                .eq('user_id', user.id)
                .single();
            profile = data;
        }

        return successResponse({
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                email_verified: user.email_verified,
                created_at: user.created_at,
            },
            profile,
            session,
        });
    } catch (error) {
        return handleError(error);
    }
}
