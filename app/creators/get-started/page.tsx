"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GetStartedRedirect() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to the onboarding page
        router.replace('/creators/onboarding');
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
            <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-violet-600 border-r-transparent mb-4"></div>
                <p className="text-slate-600 dark:text-slate-400 font-medium">Redirecting to onboarding...</p>
            </div>
        </div>
    );
}
