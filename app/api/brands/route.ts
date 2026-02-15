import { NextRequest } from 'next/server';
import { createRouteClient } from '@/lib/supabase-server';
import { successResponse, errorResponse, handleError } from '@/lib/api-response';
import { brandProfileSchema } from '@/lib/validations';
import { requireBrand } from '@/lib/auth-middleware';

/**
 * POST /api/brands
 * Create a new brand profile (authenticated brands only)
 */
export async function POST(request: NextRequest) {
    try {
        // Authenticate and check role
        const authResult = await requireBrand(request);
        if ('error' in authResult) {
            return authResult.error;
        }

        const { user } = authResult;
        const body = await request.json();

        // Validate input
        const validatedData = brandProfileSchema.parse(body);

        const supabase = await createRouteClient();

        // Check if profile already exists
        const { data: existing } = await supabase
            .from('brand_profiles')
            .select('id')
            .eq('user_id', user.id)
            .single();

        if (existing) {
            return errorResponse(
                'Brand profile already exists',
                409,
                'PROFILE_EXISTS'
            );
        }

        // Create profile with trial period (7 days from now)
        const trialEndsAt = new Date();
        trialEndsAt.setDate(trialEndsAt.getDate() + 7);

        const { data: profile, error: insertError } = await supabase
            .from('brand_profiles')
            .insert({
                user_id: user.id,
                ...validatedData,
                plan_type: 'trial',
                trial_ends_at: trialEndsAt.toISOString(),
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
