import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { successResponse, errorResponse, handleError } from '@/lib/api-response';
import { requireAdmin } from '@/lib/auth-middleware';

/**
 * PUT /api/admin/creators/[id]/verify
 * Verify or reject a creator (admin only)
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
        const { status } = body; // 'verified' or 'rejected'

        if (!status || !['verified', 'rejected'].includes(status)) {
            return errorResponse(
                'Invalid status. Must be "verified" or "rejected"',
                400,
                'INVALID_STATUS'
            );
        }

        const supabase = createAdminClient();

        // Update verification status
        const { data: profile, error: updateError } = await (supabase
            .from('creator_profiles') as any)
            .update({ verification_status: status as string })
            .eq('id', id)
            .select()
            .single();

        if (updateError || !profile) {
            console.error('Update error:', updateError);
            return errorResponse('Failed to update verification status', 500, 'UPDATE_FAILED');
        }

        return successResponse({
            ...profile,
            message: `Creator ${status === 'verified' ? 'verified' : 'rejected'} successfully`,
        });
    } catch (error) {
        return handleError(error);
    }
}
