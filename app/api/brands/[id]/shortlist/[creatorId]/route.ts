import { NextRequest } from 'next/server';
import { createRouteClient } from '@/lib/supabase-server';
import { successResponse, errorResponse, handleError } from '@/lib/api-response';
import { authenticate } from '@/lib/auth-middleware';

/**
 * DELETE /api/brands/[id]/shortlist/[creatorId]
 * Remove creator from brand's shortlist
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; creatorId: string }> }
) {
    try {
        const { id, creatorId } = await params;

        // Authenticate
        const authResult = await authenticate(request);
        if ('error' in authResult) {
            return authResult.error;
        }

        const { user } = authResult;
        const supabase = await createRouteClient();

        // Verify ownership
        const { data: brandProfile, error: brandError } = await supabase
            .from('brand_profiles')
            .select('user_id')
            .eq('id', id)
            .single();

        if (brandError || !brandProfile) {
            return errorResponse('Brand not found', 404, 'NOT_FOUND');
        }

        if (brandProfile.user_id !== user.id && user.role !== 'admin') {
            return errorResponse('Unauthorized', 403, 'FORBIDDEN');
        }

        // Remove from shortlist
        const { error: deleteError } = await supabase
            .from('shortlists')
            .delete()
            .eq('brand_id', id)
            .eq('creator_id', creatorId);

        if (deleteError) {
            console.error('Shortlist delete error:', deleteError);
            return errorResponse('Failed to remove from shortlist', 500, 'DELETE_FAILED');
        }

        return successResponse({ message: 'Removed from shortlist successfully' });
    } catch (error) {
        return handleError(error);
    }
}
