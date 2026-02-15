import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
                <p className="text-muted-foreground mb-8">Last updated: January 27, 2026</p>

                <Card className="p-8 space-y-6">
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
                        <p className="text-muted-foreground mb-3">
                            gopgop collects only information that users voluntarily submit:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>Name, email, phone number (for account creation)</li>
                            <li>Instagram username (user-submitted, not scraped)</li>
                            <li>Reel URLs (user-submitted links)</li>
                            <li>City, niche, and stats ranges</li>
                            <li>Uploaded proof screenshots</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">2. No Scraping Policy</h2>
                        <p className="text-muted-foreground">
                            <strong>IMPORTANT:</strong> gopgop does NOT scrape data from Instagram or any platform.
                            All content is user-submitted. We comply with Instagram's Terms of Service and do not
                            use automated tools to extract data.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>To create and display your media kit page</li>
                            <li>To enable brand discovery (if you opt-in)</li>
                            <li>To send service-related communications</li>
                            <li>To improve our platform</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">4. Data Sharing</h2>
                        <p className="text-muted-foreground mb-3">
                            We do NOT sell your data. Your information is only visible:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>On your public media kit (if you choose to publish)</li>
                            <li>To brands searching our platform (username, stats, public info only)</li>
                            <li>Contact info (email/WhatsApp) only if YOU add it to your media kit</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>Request data deletion anytime</li>
                            <li>Edit your media kit</li>
                            <li>Unpublish your profile</li>
                            <li>Export your data</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">6. Cookies</h2>
                        <p className="text-muted-foreground">
                            We use essential cookies for login functionality. No third-party tracking cookies.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">7. Contact</h2>
                        <p className="text-muted-foreground">
                            For privacy concerns, email us at:{" "}
                            <a href="mailto:privacy@gopgop.in" className="text-violet-600 hover:underline">
                                privacy@gopgop.in
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
