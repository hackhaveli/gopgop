"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Check, Sparkles, Zap, Star, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";

const creatorPlans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "Try before you commit",
    features: [
      "3 reel embeds",
      "Basic media kit page",
      "Public profile URL",
      "Community support",
    ],
    cta: "Start Free",
    href: "/creators/get-started",
    popular: false,
    color: "violet"
  },
  {
    name: "Starter",
    price: "₹99",
    period: "/month",
    description: "Perfect for most creators",
    features: [
      "10 reel embeds",
      "Featured reels section",
      "Custom CTA button",
      "WhatsApp/Email integration",
      "Priority support",
      "Verified badge",
    ],
    cta: "Get Started",
    href: "/creators/get-started?plan=starter",
    popular: true,
    color: "violet"
  },
];

const brandPlans = [
  {
    name: "Trial",
    price: "₹499",
    period: "/ 7 days",
    description: "Test the platform",
    features: [
      "50 creator profiles view",
      "Basic filters",
      "5 shortlists",
      "Community support",
    ],
    cta: "Start Trial",
    href: "/brands/get-started?plan=trial",
    popular: false,
    color: "blue"
  },
  {
    name: "Starter",
    price: "₹999",
    period: "/month",
    description: "Best for small businesses",
    features: [
      "Unlimited creator discovery",
      "Advanced filters",
      "Unlimited shortlists",
      "Export contact details",
      "Priority support",
      "Campaign analytics",
    ],
    cta: "Subscribe Now",
    href: "/brands/get-started?plan=starter",
    popular: true,
    color: "blue"
  },
];

export function PricingSection() {
  const [activeTab, setActiveTab] = useState<"creators" | "brands">("creators");
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px 0px" });

  const currentPlans = activeTab === "creators" ? creatorPlans : brandPlans;

  return (
    <section id="pricing" ref={sectionRef} className="relative py-20 md:py-28 overflow-hidden bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
              Simple, Transparent Pricing
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-lg text-muted-foreground mb-8 font-medium">
              Empowering creators and brands with proof-based <span className="text-violet-600 dark:text-violet-400 font-bold">GopGop</span> kits.
            </p>
          </motion.div>

          {/* Premium Animated Switcher */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="relative p-1 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 inline-flex">
              <button
                onClick={() => setActiveTab("creators")}
                className={cn(
                  "relative px-8 py-3 rounded-xl text-sm font-bold transition-colors duration-200 z-10",
                  activeTab === "creators" ? "text-white" : "text-muted-foreground hover:text-foreground"
                )}
              >
                For Creators
              </button>
              <button
                onClick={() => setActiveTab("brands")}
                className={cn(
                  "relative px-8 py-3 rounded-xl text-sm font-bold transition-colors duration-200 z-10",
                  activeTab === "brands" ? "text-white" : "text-muted-foreground hover:text-foreground"
                )}
              >
                For Brands
              </button>

              <motion.div
                layoutId="pricing-switcher"
                className={cn(
                  "absolute inset-y-1 rounded-xl z-0",
                  activeTab === "creators" ? "bg-violet-600" : "bg-blue-600"
                )}
                initial={false}
                animate={{
                  x: activeTab === "creators" ? 0 : "100%",
                }}
                style={{
                  width: "calc(50% - 4px)",
                  left: "4px"
                }}
                transition={{
                  type: "spring",
                  bounce: 0.2,
                  stiffness: 150,
                  damping: 18,
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* Dynamic Pricing Plans */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
            >
              {currentPlans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  whileHover={{ y: -5 }}
                  className="h-full"
                >
                  <Card className={cn(
                    "relative overflow-hidden p-10 h-full flex flex-col transition-all duration-300 rounded-[2.5rem]",
                    plan.popular
                      ? activeTab === "creators" ? "border-2 border-violet-500 bg-white dark:bg-slate-900" : "border-2 border-blue-500 bg-white dark:bg-slate-900"
                      : "border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50"
                  )}>
                    {plan.popular && (
                      <div className={cn(
                        "absolute top-6 right-6 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-sm",
                        activeTab === "creators" ? "bg-violet-600" : "bg-blue-600"
                      )}>
                        Recommended
                      </div>
                    )}

                    <div className="mb-10">
                      <h4 className="text-xl font-bold mb-4 tracking-tight opacity-70 uppercase text-xs">{plan.name}</h4>
                      <div className="flex items-baseline mb-4">
                        <span className="text-6xl font-black tracking-tighter">{plan.price}</span>
                        <span className="text-muted-foreground ml-2 font-bold text-lg">{plan.period}</span>
                      </div>
                      <p className="text-sm text-muted-foreground font-bold leading-relaxed">{plan.description}</p>
                    </div>

                    <div className="space-y-5 mb-10 flex-grow">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-4 group/feat">
                          <motion.div
                            whileHover={{ scale: 1.2, rotate: 10 }}
                            className={cn(
                              "mt-1 shrink-0",
                              activeTab === "creators" ? "text-violet-600" : "text-blue-600"
                            )}
                          >
                            <Check className="h-5 w-5" strokeWidth={3} />
                          </motion.div>
                          <span className="text-sm font-bold tracking-tight text-foreground/80 group-hover/feat:text-foreground transition-colors leading-relaxed">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Link href={plan.href} className="block mt-auto">
                      <Button
                        size="lg"
                        className={cn(
                          "w-full py-8 text-lg font-black transition-all duration-300 rounded-2xl",
                          plan.popular
                            ? activeTab === "creators" ? "bg-violet-600 hover:bg-violet-700" : "bg-blue-600 hover:bg-blue-700"
                            : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90"
                        )}
                        variant={plan.popular ? "default" : "outline"}
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
