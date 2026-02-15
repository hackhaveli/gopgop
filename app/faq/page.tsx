import { FaqSection } from "@/components/sections/faq-section";
import Link from "next/link";

export default function FAQPage() {
    return (
        <div className="min-h-screen pt-24">
            <FaqSection />
            <div className="container mx-auto px-4 pb-16 text-center">
                <p className="text-muted-foreground mb-4">
                    Still have questions?
                </p>
                <Link
                    href="mailto:support@gopgop.in"
                    className="text-violet-600 hover:underline font-medium"
                >
                    Contact Support →
                </Link>
            </div>
        </div>
    );
}
