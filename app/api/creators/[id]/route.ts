import { NextRequest } from 'next/server';
import { createRouteClient } from '@/lib/supabase-server';
import { successResponse, errorResponse, handleError } from '@/lib/api-response';
import { updateCreatorProfileSchema } from '@/lib/validations';
import { authenticate } from '@/lib/auth-middleware';

/**
 * GET /api/creators/[id]
 * Get a specific creator profile
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = await createRouteClient();

        const { data: profile, error } = await supabase
            .from('creator_profiles')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !profile) {
            return errorResponse('Creator not found', 404, 'NOT_FOUND');
        }

        // Only show verified profiles to non-owners
        const authResult = await authenticate(request);
        const isOwner = 'user' in authResult && authResult.user.id === profile.user_id;

        if (profile.verification_status !== 'verified' && !isOwner) {
            return errorResponse('Creator not found', 404, 'NOT_FOUND');
        }

        // Get reels
        const { data: reels } = await supabase
            .from('creator_reels')
            .select('*')
            .eq('creator_id', id)
            .order('created_at', { ascending: false });

        return successResponse({
            ...profile,
            reels: reels || [],
        });
    } catch (error) {
        return handleError(error);
    }
}

/**
 * PUT /api/creators/[id]
 * Update creator profile (owner only)
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
            .from('creator_profiles')
            .select('user_id')
            .eq('id', id)
            .single();

        if (fetchError || !existing) {
            return errorResponse('Creator not found', 404, 'NOT_FOUND');
        }

        if (existing.user_id !== user.id && user.role !== 'admin') {
            return errorResponse('Unauthorized', 403, 'FORBIDDEN');
        }

        const body = await request.json();
        const validatedData = updateCreatorProfileSchema.parse(body);

        // If updating username, check if it's available
        if (validatedData.username) {
            const { data: usernameCheck } = await supabase
                .from('creator_profiles')
                .select('id')
                .eq('username', validatedData.username)
                .neq('id', id)
                .single();

            if (usernameCheck) {
                return errorResponse('Username already taken', 409, 'USERNAME_TAKEN');
            }
        }

        // Update profile
        const { data: profile, error: updateError } = await supabase
            .from('creator_profiles')
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

/**
 * DELETE /api/creators/[id]
 * Delete creator profile (owner only)
 */
export async function DELETE(
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
            .from('creator_profiles')
            .select('user_id')
            .eq('id', id)
            .single();

        if (fetchError || !existing) {
            return errorResponse('Creator not found', 404, 'NOT_FOUND');
        }

        if (existing.user_id !== user.id && user.role !== 'admin') {
            return errorResponse('Unauthorized', 403, 'FORBIDDEN');
        }

        // Delete profile (cascades to reels, analytics, etc.)
        const { error: deleteError } = await supabase
            .from('creator_profiles')
            .delete()
            .eq('id', id);

        if (deleteError) {
            console.error('Delete error:', deleteError);
            return errorResponse('Failed to delete profile', 500, 'DELETE_FAILED');
        }

        return successResponse({ message: 'Profile deleted successfully' });
    } catch (error) {
        return handleError(error);
    }
}
