import { NextRequest } from 'next/server';
import { createRouteClient } from '@/lib/supabase-server';
import { successResponse, errorResponse, handleError } from '@/lib/api-response';
import { authenticate } from '@/lib/auth-middleware';
import { updateBrandProfileSchema } from '@/lib/validations';

/**
 * GET /api/brands/me
 * Get the currently logged-in brand's profile
 */
export async function GET(request: NextRequest) {
    try {
        const authResult = await authenticate(request);
        if ('error' in authResult) {
            return authResult.error;
        }

        const { user } = authResult;

        if (user.role !== 'brand') {
            return errorResponse('Only brands can access this endpoint', 403, 'FORBIDDEN');
        }

        const supabase = await createRouteClient();

        const { data: profile, error } = await supabase
            .from('brand_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (error || !profile) {
            return errorResponse('Brand profile not found. Please complete your registration.', 404, 'NOT_FOUND');
        }

        return successResponse(profile);
    } catch (error) {
        return handleError(error);
    }
}

/**
 * PATCH /api/brands/me
 * Update the currently logged-in brand's profile
 */
export async function PATCH(request: NextRequest) {
    try {
        const authResult = await authenticate(request);
        if ('error' in authResult) {
            return authResult.error;
        }

        const { user } = authResult;

        if (user.role !== 'brand') {
            return errorResponse('Only brands can access this endpoint', 403, 'FORBIDDEN');
        }

        const body = await request.json();
        const validatedData = updateBrandProfileSchema.parse(body);

        const supabase = await createRouteClient();

        // Update profile
        // @ts-ignore - Database types may be out of sync with actual schema
        const { data: profile, error } = await supabase
            .from('brand_profiles')
            .update({
                ...validatedData,
                updated_at: new Date().toISOString(),
            })
            .eq('user_id', user.id)
            .select()
            .single();

        if (error || !profile) {
            console.error('Update brand profile error:', error);
            return errorResponse('Failed to update brand profile', 500, 'UPDATE_FAILED');
        }

        return successResponse(profile);
    } catch (error) {
        return handleError(error);
    }
}
