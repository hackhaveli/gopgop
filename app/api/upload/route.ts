import { NextRequest } from 'next/server';
import { createRouteClient } from '@/lib/supabase-server';
import { successResponse, errorResponse, handleError } from '@/lib/api-response';
import { authenticate } from '@/lib/auth-middleware';

/**
 * POST /api/upload
 * Upload files to Supabase Storage
 * Supports: profile images, analytics screenshots, reel thumbnails
 */
export async function POST(request: NextRequest) {
    try {
        // Authenticate user
        const authResult = await authenticate(request);
        if ('error' in authResult) {
            return authResult.error;
        }

        const { user } = authResult;
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const fileType = formData.get('type') as string; // 'profile', 'analytics', 'thumbnail'

        if (!file) {
            return errorResponse('No file provided', 400, 'NO_FILE');
        }

        if (!fileType || !['profile', 'analytics', 'thumbnail'].includes(fileType)) {
            return errorResponse(
                'Invalid file type. Must be: profile, analytics, or thumbnail',
                400,
                'INVALID_TYPE'
            );
        }

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            return errorResponse('File too large. Maximum size is 10MB', 400, 'FILE_TOO_LARGE');
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return errorResponse(
                'Invalid file format. Allowed: JPEG, PNG, WebP',
                400,
                'INVALID_FORMAT'
            );
        }

        const supabase = await createRouteClient();

        // Generate unique filename
        const timestamp = Date.now();
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}_${timestamp}.${fileExt}`;
        const bucket = fileType === 'profile' ? 'profiles' : fileType === 'analytics' ? 'analytics' : 'thumbnails';
        const filePath = `${user.id}/${fileName}`;

        // Convert File to ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        // Upload to Supabase Storage
        const { data, error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePath, buffer, {
                contentType: file.type,
                upsert: false,
            });

        if (uploadError) {
            console.error('Upload error:', uploadError);
            return errorResponse('Failed to upload file', 500, 'UPLOAD_FAILED');
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return successResponse({
            fileName: fileName,
            filePath: filePath,
            url: publicUrlData.publicUrl,
            bucket: bucket,
            size: file.size,
            type: file.type,
        }, 201);
    } catch (error) {
        return handleError(error);
    }
}

/**
 * DELETE /api/upload
 * Delete a file from Supabase Storage
 */
export async function DELETE(request: NextRequest) {
    try {
        // Authenticate user
        const authResult = await authenticate(request);
        if ('error' in authResult) {
            return authResult.error;
        }

        const { user } = authResult;
        const { searchParams } = new URL(request.url);
        const filePath = searchParams.get('path');
        const bucket = searchParams.get('bucket');

        if (!filePath || !bucket) {
            return errorResponse('Missing file path or bucket', 400, 'MISSING_PARAMS');
        }

        // Verify user owns this file (path should start with user ID)
        if (!filePath.startsWith(user.id)) {
            return errorResponse('Unauthorized', 403, 'FORBIDDEN');
        }

        const supabase = await createRouteClient();

        // Delete file
        const { error: deleteError } = await supabase.storage
            .from(bucket)
            .remove([filePath]);

        if (deleteError) {
            console.error('Delete error:', deleteError);
            return errorResponse('Failed to delete file', 500, 'DELETE_FAILED');
        }

        return successResponse({ message: 'File deleted successfully' });
    } catch (error) {
        return handleError(error);
    }
}
