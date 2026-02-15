import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function TermsOfService() {
    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
                <p className="text-muted-foreground mb-8">Last updated: January 27, 2026</p>

                <Card className="p-8 space-y-6">
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                        <p className="text-muted-foreground">
                            By using gopgop.in, you agree to these Terms of Service. If you don't agree,
                            please don't use our platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">2. User-Submitted Content</h2>
                        <p className="text-muted-foreground mb-3">
                            <strong>IMPORTANT:</strong> All content on gopgop is user-submitted. We are NOT
                            responsible for:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>Accuracy of stats or follower counts</li>
                            <li>Quality of collaborations</li>
                            <li>Disputes between creators and brands</li>
                            <li>False or misleading information</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">3. No Affiliation with Instagram</h2>
                        <p className="text-muted-foreground">
                            gopgop is NOT affiliated with, endorsed by, or sponsored by Instagram or Meta.
                            Instagram is a trademark of Meta Platforms, Inc.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">4. No Data Scraping</h2>
                        <p className="text-muted-foreground">
                            We do NOT scrape data from Instagram or any platform. Users manually submit their
                            Instagram reel URLs. We comply with all platform terms of service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">5. Prohibited Activities</h2>
                        <p className="text-muted-foreground mb-3">You may NOT:</p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>Submit false or misleading information</li>
                            <li>Impersonate another creator</li>
                            <li>Use scraped or stolen content</li>
                            <li>Harass other users</li>
                            <li>Violate third-party rights</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">6. Content Takedown</h2>
                        <p className="text-muted-foreground">
                            If you believe content violates your rights, email{" "}
                            <a href="mailto:takedown@gopgop.in" className="text-violet-600 hover:underline">
                                takedown@gopgop.in
                            </a>{" "}
                            with proof of ownership. We'll respond within 48 hours.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">7. Payment & Refunds</h2>
                        <p className="text-muted-foreground mb-2">
                            <strong>Creator Subscriptions:</strong> Monthly subscriptions. Cancel anytime. No partial refunds.
                        </p>
                        <p className="text-muted-foreground">
                            <strong>Brand Plans:</strong> 7-day trial with full refund if requested within trial period.
                            Monthly plans non-refundable after activation.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">8. Account Termination</h2>
                        <p className="text-muted-foreground">
                            We reserve the right to suspend or terminate accounts that violate these Terms,
                            submit fraudulent content, or engage in prohibited activities.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
                        <p className="text-muted-foreground">
                            gopgop is a marketplace platform. We are NOT responsible for deals, payments,
                            or disputes between creators and brands. All transactions are between users.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">10. Changes to Terms</h2>
                        <p className="text-muted-foreground">
                            We may update these Terms. Continued use after changes means acceptance.
                            Major changes will be communicated via email.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">11. Contact</h2>
                        <p className="text-muted-foreground">
                            Questions? Email:{" "}
                            <a href="mailto:legal@gopgop.in" className="text-violet-600 hover:underline">
                                legal@gopgop.in
                            </a>
                        </p>
                    </section>
                </Card>

                <div className="mt-8 text-center">
                    <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
