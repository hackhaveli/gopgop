import { NextRequest } from 'next/server';
import { createRouteClient } from '@/lib/supabase-server';
import { successResponse, errorResponse, handleError } from '@/lib/api-response';
import { updateBrandProfileSchema } from '@/lib/validations';
import { authenticate } from '@/lib/auth-middleware';

/**
 * GET /api/brands/[id]
 * Get a specific brand profile
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = await createRouteClient();

        const { data: profile, error } = await supabase
            .from('brand_profiles')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !profile) {
            return errorResponse('Brand not found', 404, 'NOT_FOUND');
        }

        // Check if user has permission to view
        const authResult = await authenticate(request);
        const isOwner = 'user' in authResult && authResult.user.id === profile.user_id;
        const isAdmin = 'user' in authResult && authResult.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            return errorResponse('Unauthorized', 403, 'FORBIDDEN');
        }

        return successResponse(profile);
    } catch (error) {
        return handleError(error);
    }
}

/**
 * PUT /api/brands/[id]
 * Update brand profile (owner only)
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Authenticate
        const authResult = await authenticate(request);
        if ('error' in authResult) {
            return authResult.error;
        }

        const { user } = authResult;
        const supabase = await createRouteClient();

        // Check ownership
        const { data: existing, error: fetchError } = await supabase
            .from('brand_profiles')
            .select('user_id')
            .eq('id', id)
            .single();

        if (fetchError || !existing) {
            return errorResponse('Brand not found', 404, 'NOT_FOUND');
        }

        if (existing.user_id !== user.id && user.role !== 'admin') {
            return errorResponse('Unauthorized', 403, 'FORBIDDEN');
        }

        const body = await request.json();
        const validatedData = updateBrandProfileSchema.parse(body);

        // Update profile
        const { data: profile, error: updateError } = await supabase
            .from('brand_profiles')
            .update(validatedData)
            .eq('id', id)
            .select()
            .single();

        if (updateError) {
            console.error('Update error:', updateError);
            return errorResponse('Failed to update profile', 500, 'UPDATE_FAILED');
        }

        return successResponse(profile);
    } catch (error) {
        return handleError(error);
    }
}
