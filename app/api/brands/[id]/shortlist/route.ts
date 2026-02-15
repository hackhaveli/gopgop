import { NextRequest } from 'next/server';
import { createRouteClient } from '@/lib/supabase-server';
import { successResponse, errorResponse, handleError } from '@/lib/api-response';
import { authenticate } from '@/lib/auth-middleware';

/**
 * GET /api/brands/[id]/shortlist
 * Get brand's shortlisted creators
 */
export async function GET(
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

        // Get shortlist with creator details
        const { data: shortlist, error } = await supabase
            .from('shortlists')
            .select(`
                id,
                creator_id,
                notes,
                created_at,
                creator:creator_profiles(*)
            `)
            .eq('brand_id', id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Fetch shortlist error:', error);
            return errorResponse('Failed to fetch shortlist', 500, 'FETCH_FAILED');
        }

        return successResponse(shortlist || []);
    } catch (error) {
        return handleError(error);
    }
}

/**
 * POST /api/brands/[id]/shortlist
 * Add creator to brand's shortlist
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
        const body = await request.json();
        const { creator_id, notes } = body;

        if (!creator_id) {
            return errorResponse('creator_id is required', 400, 'VALIDATION_ERROR');
        }

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

        if (brandProfile.user_id !== user.id) {
            return errorResponse('Unauthorized', 403, 'FORBIDDEN');
        }

        // Verify creator exists
        const { data: creator, error: creatorError } = await supabase
            .from('creator_profiles')
            .select('id')
            .eq('id', creator_id)
            .single();

        if (creatorError || !creator) {
            return errorResponse('Creator not found', 404, 'CREATOR_NOT_FOUND');
        }

        // Add to shortlist (or update if already exists)
        const { data: shortlistItem, error: insertError } = await supabase
            .from('shortlists')
            .upsert({
                brand_id: id,
                creator_id,
                notes: notes || null,
            })
            .select()
            .single();

        if (insertError) {
            console.error('Shortlist insert error:', insertError);
            return errorResponse('Failed to add to shortlist', 500, 'INSERT_FAILED');
        }

        return successResponse(shortlistItem, 201);
    } catch (error) {
        return handleError(error);
    }
}

/**
 * DELETE /api/brands/[id]/shortlist
 * Remove creator from brand's shortlist via body
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
        const body = await request.json();
        const { creator_id } = body;

        if (!creator_id) {
            return errorResponse('creator_id is required', 400, 'VALIDATION_ERROR');
        }

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

        if (brandProfile.user_id !== user.id) {
            return errorResponse('Unauthorized', 403, 'FORBIDDEN');
        }

        // Remove from shortlist
        const { error: deleteError } = await supabase
            .from('shortlists')
            .delete()
            .eq('brand_id', id)
            .eq('creator_id', creator_id);

        if (deleteError) {
            console.error('Shortlist delete error:', deleteError);
            return errorResponse('Failed to remove from shortlist', 500, 'DELETE_FAILED');
        }

        return successResponse({ message: 'Removed from shortlist successfully' });
    } catch (error) {
        return handleError(error);
    }
}
