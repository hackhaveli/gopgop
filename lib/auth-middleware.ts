import { NextRequest } from 'next/server';
import { createRouteClient } from './supabase-server';
import { errorResponse } from './api-response';

export interface AuthUser {
    id: string;
    email: string;
    role: 'creator' | 'brand' | 'admin';
}

/**
 * Middleware to authenticate API requests
 * Returns the authenticated user or an error response
 */
export async function authenticate(
    request: NextRequest
): Promise<{ user: AuthUser } | { error: Response }> {
    try {
        const supabase = await createRouteClient();

        // Get the user from Supabase
        const {
            data: { user: authUser },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !authUser) {
            return {
                error: errorResponse('Unauthorized', 401, 'UNAUTHORIZED'),
            };
        }

        // Get user details from database
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('id, email, role')
            .eq('id', authUser.id)
            .single();

        if (userError || !user) {
            return {
                error: errorResponse('User not found', 404, 'USER_NOT_FOUND'),
            };
        }

        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role as 'creator' | 'brand' | 'admin',
            },
        };
    } catch (error) {
        console.error('Authentication error:', error);
        return {
            error: errorResponse('Authentication failed', 500, 'AUTH_ERROR'),
        };
    }
}

/**
 * Middleware to check if user has specific role
 */
export async function requireRole(
    request: NextRequest,
    allowedRoles: Array<'creator' | 'brand' | 'admin'>
): Promise<{ user: AuthUser } | { error: Response }> {
    const authResult = await authenticate(request);

    if ('error' in authResult) {
        return authResult;
    }

    if (!allowedRoles.includes(authResult.user.role)) {
        return {
            error: errorResponse(
                'Insufficient permissions',
                403,
                'FORBIDDEN'
            ),
        };
    }

    return authResult;
}

/**
 * Middleware for admin-only routes
 */
export async function requireAdmin(
    request: NextRequest
): Promise<{ user: AuthUser } | { error: Response }> {
    return requireRole(request, ['admin']);
}

/**
 * Middleware for creator-only routes
 */
export async function requireCreator(
    request: NextRequest
): Promise<{ user: AuthUser } | { error: Response }> {
    return requireRole(request, ['creator']);
}

/**
 * Middleware for brand-only routes
 */
export async function requireBrand(
    request: NextRequest
): Promise<{ user: AuthUser } | { error: Response }> {
    return requireRole(request, ['brand']);
}
