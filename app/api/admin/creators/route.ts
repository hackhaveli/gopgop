import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { successResponse, errorResponse, handleError } from '@/lib/api-response';
import { requireAdmin } from '@/lib/auth-middleware';

/**
 * GET /api/admin/creators
 * List all creators with filters (admin only)
 */
export async function GET(request: NextRequest) {
    try {
        // Authenticate as admin
        const authResult = await requireAdmin(request);
        if ('error' in authResult) {
            return authResult.error;
        }

        const { searchParams } = new URL(request.url);

        const status = searchParams.get('status'); // pending, verified, rejected
        const page = parseInt(searchParams.get('page') || '1');
        const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
        const offset = (page - 1) * limit;

        const supabase = createAdminClient();

        // Build query
        let query = supabase
            .from('creator_profiles')
            .select('*, user:users(email)', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        // Apply status filter
        if (status) {
            query = query.eq('verification_status', status);
        }

        const { data: creators, error, count } = await query;

        if (error) {
            console.error('Fetch creators error:', error);
            return errorResponse('Failed to fetch creators', 500, 'FETCH_FAILED');
        }

        return successResponse({
            creators: creators || [],
            pagination: {
                page,
                limit,
                total: count || 0,
                totalPages: Math.ceil((count || 0) / limit),
            },
        });
    } catch (error) {
        return handleError(error);
    }
}
