import { NextRequest } from 'next/server';
import { createRouteClient } from '@/lib/supabase-server';
import { successResponse, errorResponse, handleError } from '@/lib/api-response';
import { creatorReelSchema } from '@/lib/validations';
import { authenticate } from '@/lib/auth-middleware';

/**
 * PUT /api/creators/[id]/reels/[reelId]
 * Update a specific reel
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; reelId: string }> }
) {
    try {
        const { id, reelId } = await params;

        // Authenticate
        const authResult = await authenticate(request);
        if ('error' in authResult) {
            return authResult.error;
        }

        const { user } = authResult;
        const supabase = await createRouteClient();

        // Check ownership via creator profile
        const { data: profile } = await supabase
            .from('creator_profiles')
            .select('user_id')
            .eq('id', id)
            .single();

        if (!profile || profile.user_id !== user.id) {
            return errorResponse('Unauthorized', 403, 'FORBIDDEN');
        }

        const body = await request.json();
        const validatedData = creatorReelSchema.partial().parse(body);

        // Update reel
        const { data: reel, error: updateError } = await supabase
            .from('creator_reels')
            .update(validatedData)
            .eq('id', reelId)
            .eq('creator_id', id)
            .select()
            .single();

        if (updateError || !reel) {
            console.error('Update reel error:', updateError);
            return errorResponse('Failed to update reel', 500, 'UPDATE_FAILED');
        }

        return successResponse(reel);
    } catch (error) {
        return handleError(error);
    }
}

/**
 * DELETE /api/creators/[id]/reels/[reelId]
 * Delete a specific reel
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; reelId: string }> }
) {
    try {
        const { id, reelId } = await params;

        // Authenticate
        const authResult = await authenticate(request);
        if ('error' in authResult) {
            return authResult.error;
        }

        const { user } = authResult;
        const supabase = await createRouteClient();

        // Check ownership via creator profile
        const { data: profile } = await supabase
            .from('creator_profiles')
            .select('user_id')
            .eq('id', id)
            .single();

        if (!profile || profile.user_id !== user.id) {
            return errorResponse('Unauthorized', 403, 'FORBIDDEN');
        }

        // Delete reel
        const { error: deleteError } = await supabase
            .from('creator_reels')
            .delete()
            .eq('id', reelId)
            .eq('creator_id', id);

        if (deleteError) {
            console.error('Delete reel error:', deleteError);
            return errorResponse('Failed to delete reel', 500, 'DELETE_FAILED');
        }

        return successResponse({ message: 'Reel deleted successfully' });
    } catch (error) {
        return handleError(error);
    }
}
