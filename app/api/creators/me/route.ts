import { NextRequest } from 'next/server';
import { createRouteClient } from '@/lib/supabase-server';
import { successResponse, errorResponse, handleError } from '@/lib/api-response';
import { authenticate } from '@/lib/auth-middleware';

/**
 * GET /api/creators/me
 * Get the currently logged-in creator's profile
 */
export async function GET(request: NextRequest) {
    try {
        const authResult = await authenticate(request);
        if ('error' in authResult) {
            return authResult.error;
        }

        const { user } = authResult;

        if (user.role !== 'creator') {
            return errorResponse('Only creators can access this endpoint', 403, 'FORBIDDEN');
        }

        const supabase = await createRouteClient();

        const { data: profile, error } = await supabase
            .from('creator_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (error || !profile) {
            return errorResponse('Creator profile not found. Please complete your registration.', 404, 'NOT_FOUND');
        }

        return successResponse(profile);
    } catch (error) {
        return handleError(error);
    }
}
