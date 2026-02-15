import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { successResponse, errorResponse, handleError } from '@/lib/api-response';
import { requireAdmin } from '@/lib/auth-middleware';

/**
 * GET /api/admin/stats
 * Get platform statistics (admin only)
 */
export async function GET(request: NextRequest) {
    try {
        // Authenticate as admin
        const authResult = await requireAdmin(request);
        if ('error' in authResult) {
            return authResult.error;
        }

        const supabase = createAdminClient();

        // Get creator statistics
        const { count: totalCreators } = await supabase
            .from('creator_profiles')
            .select('*', { count: 'exact', head: true });

        const { count: verifiedCreators } = await supabase
            .from('creator_profiles')
            .select('*', { count: 'exact', head: true })
            .eq('verification_status', 'verified');

        const { count: pendingCreators } = await supabase
            .from('creator_profiles')
            .select('*', { count: 'exact', head: true })
            .eq('verification_status', 'pending');

        const { count: proCreators } = await supabase
            .from('creator_profiles')
            .select('*', { count: 'exact', head: true })
            .eq('plan_type', 'pro');

        // Get brand statistics
        const { count: totalBrands } = await supabase
            .from('brand_profiles')
            .select('*', { count: 'exact', head: true });

        const { count: trialBrands } = await supabase
            .from('brand_profiles')
            .select('*', { count: 'exact', head: true })
            .eq('plan_type', 'trial');

        const { count: proBrands } = await supabase
            .from('brand_profiles')
            .select('*', { count: 'exact', head: true })
            .eq('plan_type', 'pro');

        // Get inquiry statistics
        const { count: totalInquiries } = await supabase
            .from('inquiries')
            .select('*', { count: 'exact', head: true });

        const { count: pendingInquiries } = await supabase
            .from('inquiries')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending');

        // Get subscription statistics
        const { count: activeSubscriptions } = await supabase
            .from('subscriptions')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'active');

        // Calculate revenue (sum of all active subscriptions)
        const { data: revenueData } = await supabase
            .from('subscriptions')
            .select('amount')
            .eq('status', 'active');

        const monthlyRevenue = (revenueData as any[] | null)?.reduce((sum, sub: any) => sum + (sub.amount || 0), 0) || 0;

        // Get recent activity (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { count: newCreatorsLast30Days } = await supabase
            .from('creator_profiles')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', thirtyDaysAgo.toISOString());

        const { count: newBrandsLast30Days } = await supabase
            .from('brand_profiles')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', thirtyDaysAgo.toISOString());

        return successResponse({
            creators: {
                total: totalCreators || 0,
                verified: verifiedCreators || 0,
                pending: pendingCreators || 0,
                pro: proCreators || 0,
                newLast30Days: newCreatorsLast30Days || 0,
            },
            brands: {
                total: totalBrands || 0,
                trial: trialBrands || 0,
                pro: proBrands || 0,
                newLast30Days: newBrandsLast30Days || 0,
            },
            inquiries: {
                total: totalInquiries || 0,
                pending: pendingInquiries || 0,
            },
            subscriptions: {
                active: activeSubscriptions || 0,
                monthlyRevenue: monthlyRevenue,
            },
            generated_at: new Date().toISOString(),
        });
    } catch (error) {
        return handleError(error);
    }
}
