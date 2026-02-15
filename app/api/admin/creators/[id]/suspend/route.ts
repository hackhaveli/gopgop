import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { successResponse, errorResponse, handleError } from '@/lib/api-response';
import { requireAdmin } from '@/lib/auth-middleware';

/**
 * PUT /api/admin/creators/[id]/suspend
 * Suspend or reactivate a creator (admin only)
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Authenticate as admin
        const authResult = await requireAdmin(request);
        if ('error' in authResult) {
            return authResult.error;
        }

        const body = await request.json();
        const { suspend } = body;

        if (typeof suspend !== 'boolean') {
            return errorResponse('suspend field must be a boolean', 400, 'INVALID_INPUT');
        }

        const supabase = createAdminClient();

        // Get creator profile
        const { data: profile, error: fetchError } = await supabase
            .from('creator_profiles')
            .select('*')
            .eq('id', id)
            .single();

        if (fetchError || !profile) {
            return errorResponse('Creator not found', 404, 'NOT_FOUND');
        }

        // Update verification status to reflect suspension
        const newStatus = suspend ? 'rejected' : 'verified';

        const { data: updated, error: updateError } = await (supabase
            .from('creator_profiles') as any)
            .update({ verification_status: newStatus as string })
            .eq('id', id)
            .select()
            .single();

        if (updateError) {
            console.error('Update error:', updateError);
            return errorResponse('Failed to update status', 500, 'UPDATE_FAILED');
        }

        return successResponse({
            ...updated,
            message: suspend ? 'Creator suspended' : 'Creator reactivated',
        });
    } catch (error) {
        return handleError(error);
    }
}
