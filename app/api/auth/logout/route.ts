import { NextRequest } from 'next/server';
import { createRouteClient } from '@/lib/supabase-server';
import { successResponse, errorResponse, handleError } from '@/lib/api-response';

/**
 * POST /api/auth/logout
 * Sign out the current user
 */
export async function POST(request: NextRequest) {
    try {
        const supabase = await createRouteClient();

        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error('Logout error:', error);
            return errorResponse('Logout failed', 500, 'LOGOUT_FAILED');
        }

        return successResponse({ message: 'Logged out successfully' });
    } catch (error) {
        return handleError(error);
    }
}
