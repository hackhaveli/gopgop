import { NextRequest } from 'next/server';
import { createRouteClient } from '@/lib/supabase-server';
import { successResponse, errorResponse, handleError } from '@/lib/api-response';
import { inquirySchema } from '@/lib/validations';
import { authenticate, requireBrand } from '@/lib/auth-middleware';

/**
 * POST /api/inquiries
 * Create an inquiry from brand to creator
 */
export async function POST(request: NextRequest) {
    try {
        // Authenticate as brand
        const authResult = await requireBrand(request);
        if ('error' in authResult) {
            return authResult.error;
        }

        const { user } = authResult;
        const body = await request.json();
        const validatedData = inquirySchema.parse(body);

        const supabase = await createRouteClient();

        // Get brand profile
        const { data: brandProfile, error: brandError } = await supabase
            .from('brand_profiles')
            .select('id')
            .eq('user_id', user.id)
            .single();

        if (brandError || !brandProfile) {
            return errorResponse('Brand profile not found', 404, 'PROFILE_NOT_FOUND');
        }

        // Verify creator exists
        const { data: creatorProfile, error: creatorError } = await supabase
            .from('creator_profiles')
            .select('id')
            .eq('id', validatedData.creator_id)
            .single();

        if (creatorError || !creatorProfile) {
            return errorResponse('Creator not found', 404, 'CREATOR_NOT_FOUND');
        }

        // Create inquiry
        const { data: inquiry, error: insertError } = await supabase
            .from('inquiries')
            .insert({
                brand_id: brandProfile.id,
                creator_id: validatedData.creator_id,
                message: validatedData.message,
                status: 'pending',
            })
            .select()
            .single();

        if (insertError) {
            console.error('Inquiry creation error:', insertError);
            return errorResponse('Failed to create inquiry', 500, 'INSERT_FAILED');
        }

        return successResponse(inquiry, 201);
    } catch (error) {
        return handleError(error);
    }
}

/**
 * GET /api/inquiries
 * Get user's inquiries (brand sees sent, creator sees received)
 */
export async function GET(request: NextRequest) {
    try {
        const authResult = await authenticate(request);
        if ('error' in authResult) {
            return authResult.error;
        }

        const { user } = authResult;
        const supabase = await createRouteClient();

        let inquiries = [];

        if (user.role === 'brand') {
            // Get brand's sent inquiries
            const { data: brandProfile } = await supabase
                .from('brand_profiles')
                .select('id')
                .eq('user_id', user.id)
                .single();

            if (brandProfile) {
                const { data } = await supabase
                    .from('inquiries')
                    .select(`
                        *,
                        creator:creator_profiles(*)
                    `)
                    .eq('brand_id', brandProfile.id)
                    .order('created_at', { ascending: false });

                inquiries = data || [];
            }
        } else if (user.role === 'creator') {
            // Get creator's received inquiries
            const { data: creatorProfile } = await supabase
                .from('creator_profiles')
                .select('id')
                .eq('user_id', user.id)
                .single();

            if (creatorProfile) {
                const { data } = await supabase
                    .from('inquiries')
                    .select(`
                        *,
                        brand:brand_profiles(*)
                    `)
                    .eq('creator_id', creatorProfile.id)
                    .order('created_at', { ascending: false });

                inquiries = data || [];
            }
        }

        return successResponse(inquiries);
    } catch (error) {
        return handleError(error);
    }
}

/**
 * PATCH /api/inquiries
 * Update inquiry status (for creators)
 */
export async function PATCH(request: NextRequest) {
    try {
        const authResult = await authenticate(request);
        if ('error' in authResult) {
            return authResult.error;
        }

        const { user } = authResult;
        if (user.role !== 'creator') {
            return errorResponse('Only creators can update inquiry status', 403);
        }

        const body = await request.json();
        const { inquiry_id, status } = body;

        if (!inquiry_id || !status) {
            return errorResponse('Missing inquiry_id or status', 400);
        }

        const supabase = await createRouteClient();

        // Get creator profile
        const { data: creatorProfile } = await supabase
            .from('creator_profiles')
            .select('id')
            .eq('user_id', user.id)
            .single();

        if (!creatorProfile) {
            return errorResponse('Creator profile not found', 404);
        }

        // Update inquiry
        // @ts-ignore - Database types may be out of sync with actual schema
        const { data, error } = await supabase
            .from('inquiries')
            .update({ status })
            .eq('id', inquiry_id)
            .eq('creator_id', creatorProfile.id) // Ensure ownership
            .select()
            .maybeSingle();

        if (error) {
            console.error('Inquiry update error:', error);
            return errorResponse('Failed to update inquiry', 500);
        }

        if (!data) {
            return errorResponse('Inquiry not found or unauthorized', 404);
        }

        return successResponse(data);
    } catch (error) {
        return handleError(error);
    }
}
