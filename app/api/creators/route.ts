import { NextRequest } from 'next/server';
import { createRouteClient } from '@/lib/supabase-server';
import { successResponse, errorResponse, handleError } from '@/lib/api-response';
import { creatorProfileSchema } from '@/lib/validations';
import { authenticate, requireCreator } from '@/lib/auth-middleware';

/**
 * POST /api/creators
 * Create a new creator profile (authenticated creators only)
 */
export async function POST(request: NextRequest) {
    try {
        // Authenticate and check role
        const authResult = await requireCreator(request);
        if ('error' in authResult) {
            return authResult.error;
        }

        const { user } = authResult;
        const body = await request.json();

        // Validate input
        const validatedData = creatorProfileSchema.parse(body);

        const supabase = await createRouteClient();

        // Check if profile already exists
        const { data: existing } = await supabase
            .from('creator_profiles')
            .select('id')
            .eq('user_id', user.id)
            .single();

        if (existing) {
            return errorResponse(
                'Creator profile already exists',
                409,
                'PROFILE_EXISTS'
            );
        }

        // Check if username is taken
        const { data: usernameCheck } = await supabase
            .from('creator_profiles')
            .select('id')
            .eq('username', validatedData.username)
            .single();

        if (usernameCheck) {
            return errorResponse(
                'Username already taken',
                409,
                'USERNAME_TAKEN'
            );
        }

        // Create profile
        const { data: profile, error: insertError } = await supabase
            .from('creator_profiles')
            .insert({
                user_id: user.id,
                ...validatedData,
            })
            .select()
            .single();

        if (insertError) {
            console.error('Profile creation error:', insertError);
            return errorResponse(
                'Failed to create profile',
                500,
                'PROFILE_CREATION_FAILED'
            );
        }

        return successResponse(profile, 201);
    } catch (error) {
        return handleError(error);
    }
}

/**
 * GET /api/creators
 * List all verified creators with optional filters
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const niche = searchParams.get('niche');
        const city = searchParams.get('city');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
        const offset = (page - 1) * limit;

        const supabase = await createRouteClient();

        // Build query
        let query = supabase
            .from('creator_profiles')
            .select('*', { count: 'exact' })
            .in('verification_status', ['verified', 'pending'])
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        // Apply filters
        if (niche) {
            query = query.eq('niche', niche);
        }
        if (city) {
            query = query.eq('city', city);
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
