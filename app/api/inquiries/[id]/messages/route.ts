import { NextRequest } from 'next/server';
import { createRouteClient } from '@/lib/supabase-server';
import { successResponse, errorResponse, handleError } from '@/lib/api-response';
import { authenticate } from '@/lib/auth-middleware';

/**
 * GET /api/inquiries/[id]/messages
 * Get all messages for an inquiry
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = await createRouteClient();

        const { data: messages, error } = await supabase
            .from('messages')
            .select('*')
            .eq('inquiry_id', id)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Fetch messages error:', error);
            return errorResponse('Failed to fetch messages', 500, 'FETCH_FAILED');
        }

        return successResponse(messages || []);
    } catch (error) {
        return handleError(error);
    }
}

/**
 * POST /api/inquiries/[id]/messages
 * Send a new message
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
        const { content } = body;

        if (!content || content.trim() === '') {
            return errorResponse('Message content is required', 400, 'VALIDATION_ERROR');
        }

        const supabase = await createRouteClient();

        // Check if user is part of this inquiry
        const { data: inquiry, error: inqError } = await supabase
            .from('inquiries')
            .select(`
                id,
                brand:brand_profiles(user_id),
                creator:creator_profiles(user_id)
            `)
            .eq('id', id)
            .single();

        if (inqError || !inquiry) {
            return errorResponse('Inquiry not found', 404, 'NOT_FOUND');
        }

        const isBrandOwner = (inquiry.brand as any)?.user_id === user.id;
        const isCreatorOwner = (inquiry.creator as any)?.user_id === user.id;

        if (!isBrandOwner && !isCreatorOwner && user.role !== 'admin') {
            return errorResponse('Unauthorized', 403, 'FORBIDDEN');
        }

        // Insert message
        const { data: message, error: insertError } = await supabase
            .from('messages')
            .insert({
                inquiry_id: id,
                sender_id: user.id,
                content: content.trim()
            })
            .select()
            .single();

        if (insertError) {
            console.error('Insert message error:', insertError);
            return errorResponse('Failed to send message', 500, 'INSERT_FAILED');
        }

        return successResponse(message, 201);
    } catch (error) {
        return handleError(error);
    }
}
