import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

// Standard API response types
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: {
        message: string;
        code?: string;
        details?: any;
    };
}

// Success response helper
export function successResponse<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
    return NextResponse.json(
        {
            success: true,
            data,
        },
        { status }
    );
}

// Error response helper
export function errorResponse(
    message: string,
    status = 400,
    code?: string,
    details?: any
): NextResponse<ApiResponse> {
    return NextResponse.json(
        {
            success: false,
            error: {
                message,
                code,
                details,
            },
        },
        { status }
    );
}

// Handle Zod validation errors
export function handleZodError(error: ZodError): NextResponse<ApiResponse> {
    const issues = error.issues || (error as any).errors || [];
    const formattedErrors = issues.map((err: any) => ({
        path: err.path ? err.path.join('.') : 'unknown',
        message: err.message || 'Validation error',
    }));

    return errorResponse(
        'Validation failed',
        400,
        'VALIDATION_ERROR',
        formattedErrors
    );
}

// Handle database errors
export function handleDatabaseError(error: any): NextResponse<ApiResponse> {
    console.error('Database error:', error);

    // Handle unique constraint violations
    if (error.code === '23505') {
        return errorResponse(
            'A record with this value already exists',
            409,
            'DUPLICATE_RECORD'
        );
    }

    // Handle foreign key violations
    if (error.code === '23503') {
        return errorResponse(
            'Referenced record does not exist',
            400,
            'INVALID_REFERENCE'
        );
    }

    return errorResponse(
        'Database operation failed',
        500,
        'DATABASE_ERROR'
    );
}

// Generic error handler
export function handleError(error: unknown): NextResponse<ApiResponse> {
    console.error('API error:', error);

    if (error instanceof ZodError) {
        return handleZodError(error);
    }

    if (error instanceof Error) {
        return errorResponse(error.message, 500, 'INTERNAL_ERROR');
    }

    return errorResponse('An unexpected error occurred', 500, 'UNKNOWN_ERROR');
}
