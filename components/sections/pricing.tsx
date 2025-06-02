"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, Shield, DollarSign, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function PricingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px 0px" });

  const features = [
    "Unlimited website scraping",
    "Multiple template designs",
    "Email outreach tools",
    "FTP deployment",
    "Offline usage",
    "Free updates for life",
  ];

  return (
    <section id="pricing" ref={sectionRef} className="py-20 md:py-28 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-lg text-muted-foreground">
              No subscriptions, no hidden fees. Just a one-time purchase.
            </p>
          </motion.div>
        </div>

        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="relative overflow-hidden border-2 border-primary/20">
              {/* Popular tag */}
              <div className="absolute -right-12 top-6 rotate-45 bg-primary text-primary-foreground px-10 py-1 text-sm font-medium">
                Limited Offer
              </div>
              
              <div className="p-6 md:p-8 text-center">
                <div className="mb-4 flex items-center justify-center">
                  <Package className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Lifetime Deal</h3>
                <div className="flex items-center justify-center mb-6">
                  <span className="text-4xl font-bold">₹1499</span>
                  <span className="text-muted-foreground ml-2">/ $19 one-time</span>
                </div>
                <div className="space-y-3 text-left mb-8">
                  {features.map((feature, i) => (
                    <div key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-3 mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Button className="w-full" size="lg">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Buy Now
                </Button>
                
                <div className="mt-6 flex items-center justify-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-1" />
                    <span>30-day guarantee</span>
                  </div>
                  <div>100+ downloads</div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}