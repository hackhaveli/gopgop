"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  FileText, Video, Search, Filter,
  Bookmark, IndianRupee, Zap, MessageCircle
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: FileText,
    title: "Creator Media Kit Page",
    description: "Professional pages with all creator details, stats & proof",
    color: "text-violet-600",
  },
  {
    icon: Video,
    title: "Instagram Reel Embeds",
    description: "Show actual work with embedded reels on media kit",
    color: "text-pink-600",
  },
  {
    icon: Search,
    title: "Proof-Based Discovery",
    description: "Find creators with verified stats & proof screenshots",
    color: "text-blue-600",
  },
  {
    icon: Filter,
    title: "Smart Filters",
    description: "Filter by niche, city, views range & engagement",
    color: "text-emerald-600",
  },
  {
    icon: Bookmark,
    title: "Shortlist & Export",
    description: "Save your favorite creators and export contact details",
    color: "text-amber-600",
  },
  {
    icon: IndianRupee,
    title: "₹99 Starter for Creators",
    description: "Affordable pricing to get started with professional kit",
    color: "text-cyan-600",
  },
];

export function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px 0px" });

  return (
    <section id="features" ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
              Everything You Need
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-lg text-muted-foreground leading-relaxed font-medium">
              Powerful tools designed to make Indian influencer marketing
              <span className="text-violet-600 dark:text-violet-400 font-bold mx-1">Transparent</span> &
              <span className="text-blue-600 dark:text-blue-400 font-bold mx-1">Fast</span>.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Card className="relative h-full p-8 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 hover:border-violet-500/50 rounded-3xl">
                {/* Simple Icon Presentation */}
                <div className="mb-6">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700",
                      feature.color
                    )}
                  >
                    <feature.icon className="h-6 w-6" />
                  </motion.div>
                </div>

                <h3 className="text-xl font-bold mb-3 tracking-tight group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
