import { NextRequest } from 'next/server';
import { createRouteClient } from '@/lib/supabase-server';
import { successResponse, errorResponse, handleError } from '@/lib/api-response';
import { searchCreatorsSchema } from '@/lib/validations';

/**
 * POST /api/search/creators
 * Advanced creator search with multiple filters
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validatedData = searchCreatorsSchema.parse(body);

        const {
            niche,
            city,
            min_followers,
            max_followers,
            min_engagement,
            verification_status,
            page,
            limit,
        } = validatedData;

        const offset = (page - 1) * limit;
        const supabase = await createRouteClient();

        // Build query
        let query = supabase
            .from('creator_profiles')
            .select('*', { count: 'exact' })
            .eq('verification_status', verification_status || 'verified')
            .order('instagram_followers', { ascending: false })
            .range(offset, offset + limit - 1);

        // Apply filters
        if (niche) {
            query = query.eq('niche', niche);
        }
        if (city) {
            query = query.eq('city', city);
        }
        if (min_followers !== undefined) {
            query = query.gte('instagram_followers', min_followers);
        }
        if (max_followers !== undefined) {
            query = query.lte('instagram_followers', max_followers);
        }
        if (min_engagement !== undefined) {
            query = query.gte('instagram_engagement_rate', min_engagement);
        }

        const { data: creators, error, count } = await query;

        if (error) {
            console.error('Search error:', error);
            return errorResponse('Search failed', 500, 'SEARCH_FAILED');
        }

        return successResponse({
            creators: creators || [],
            filters: {
                niche,
                city,
                min_followers,
                max_followers,
                min_engagement,
                verification_status,
            },
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

/**
 * GET /api/search/creators
 * Simple search with query parameters
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const filters = {
            niche: searchParams.get('niche') || undefined,
            city: searchParams.get('city') || undefined,
            min_followers: searchParams.get('min_followers')
                ? parseInt(searchParams.get('min_followers')!)
                : undefined,
            max_followers: searchParams.get('max_followers')
                ? parseInt(searchParams.get('max_followers')!)
                : undefined,
            min_engagement: searchParams.get('min_engagement')
                ? parseFloat(searchParams.get('min_engagement')!)
                : undefined,
            verification_status: searchParams.get('verification_status') as any,
            page: parseInt(searchParams.get('page') || '1'),
            limit: Math.min(parseInt(searchParams.get('limit') || '20'), 100),
        };

        const validatedData = searchCreatorsSchema.parse(filters);
        const { page, limit } = validatedData;
        const offset = (page - 1) * limit;

        const supabase = await createRouteClient();

        // Build query (same logic as POST)
        let query = supabase
            .from('creator_profiles')
            .select('*', { count: 'exact' })
            .eq('verification_status', validatedData.verification_status || 'verified')
            .order('instagram_followers', { ascending: false })
            .range(offset, offset + limit - 1);

        // Apply filters
        if (validatedData.niche) query = query.eq('niche', validatedData.niche);
        if (validatedData.city) query = query.eq('city', validatedData.city);
        if (validatedData.min_followers !== undefined) {
            query = query.gte('instagram_followers', validatedData.min_followers);
        }
        if (validatedData.max_followers !== undefined) {
            query = query.lte('instagram_followers', validatedData.max_followers);
        }
        if (validatedData.min_engagement !== undefined) {
            query = query.gte('instagram_engagement_rate', validatedData.min_engagement);
        }

        const { data: creators, error, count } = await query;

        if (error) {
            console.error('Search error:', error);
            return errorResponse('Search failed', 500, 'SEARCH_FAILED');
        }

        return successResponse({
            creators: creators || [],
            filters: validatedData,
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
