import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { successResponse, errorResponse, handleError } from '@/lib/api-response';
import { requireAdmin } from '@/lib/auth-middleware';

/**
 * GET /api/admin/brands
 * List all brands (admin only)
 */
export async function GET(request: NextRequest) {
    try {
        // Authenticate as admin
        const authResult = await requireAdmin(request);
        if ('error' in authResult) {
            return authResult.error;
        }

        const { searchParams } = new URL(request.url);

        const planType = searchParams.get('plan_type'); // trial, pro
        const page = parseInt(searchParams.get('page') || '1');
        const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
        const offset = (page - 1) * limit;

        const supabase = createAdminClient();

        // Build query
        let query = supabase
            .from('brand_profiles')
            .select('*, user:users(email)', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        // Apply plan filter
        if (planType) {
            query = query.eq('plan_type', planType);
        }

        const { data: brands, error, count } = await query;

        if (error) {
            console.error('Fetch brands error:', error);
            return errorResponse('Failed to fetch brands', 500, 'FETCH_FAILED');
        }

        return successResponse({
            brands: brands || [],
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
