import { NextRequest } from 'next/server';
import { createRouteClient } from '@/lib/supabase-server';
import { successResponse, errorResponse, handleError } from '@/lib/api-response';
import { creatorReelSchema } from '@/lib/validations';
import { authenticate } from '@/lib/auth-middleware';

/**
 * GET /api/creators/[id]/reels
 * Get all reels for a creator
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = await createRouteClient();

        const { data: reels, error } = await supabase
            .from('creator_reels')
            .select('*')
            .eq('creator_id', id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Fetch reels error:', error);
            return errorResponse('Failed to fetch reels', 500, 'FETCH_FAILED');
        }

        return successResponse(reels || []);
    } catch (error) {
        return handleError(error);
    }
}

/**
 * POST /api/creators/[id]/reels
 * Add a new reel (creator owner only)
 */
export async function POST(
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
        const { data: profile, error: fetchError } = await supabase
            .from('creator_profiles')
            .select('user_id')
            .eq('id', id)
            .single();

        if (fetchError || !profile) {
            return errorResponse('Creator not found', 404, 'NOT_FOUND');
        }

        if (profile.user_id !== user.id) {
            return errorResponse('Unauthorized', 403, 'FORBIDDEN');
        }

        const body = await request.json();
        const validatedData = creatorReelSchema.parse(body);

        // Insert reel
        const { data: reel, error: insertError } = await supabase
            .from('creator_reels')
            .insert({
                creator_id: id,
                ...validatedData,
            })
            .select()
            .single();

        if (insertError) {
            console.error('Insert reel error:', insertError);
            return errorResponse('Failed to add reel', 500, 'INSERT_FAILED');
        }

        return successResponse(reel, 201);
    } catch (error) {
        return handleError(error);
    }
}
/**
 * DELETE /api/creators/[id]/reels
 * Delete a reel
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const authResult = await authenticate(request);
        if ('error' in authResult) return authResult.error;

        const { user } = authResult;
        const supabase = await createRouteClient();

        // Check ownership
        const { data: profile } = await supabase
            .from('creator_profiles')
            .select('user_id')
            .eq('id', id)
            .single();

        if (profile?.user_id !== user.id) {
            return errorResponse('Unauthorized', 403, 'FORBIDDEN');
        }

        const { searchParams } = new URL(request.url);
        const reelId = searchParams.get('reelId');

        if (!reelId) {
            return errorResponse('reelId is required', 400, 'BAD_REQUEST');
        }

        const { error: deleteError } = await supabase
            .from('creator_reels')
            .delete()
            .eq('id', reelId)
            .eq('creator_id', id);

        if (deleteError) {
            return errorResponse('Failed to delete reel', 500, 'DELETE_FAILED');
        }

        return successResponse({ message: 'Reel deleted successfully' });
    } catch (error) {
        return handleError(error);
    }
}
