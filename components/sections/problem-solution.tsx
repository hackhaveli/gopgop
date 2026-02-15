"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { X, Check, Clock, FileQuestion, BadgeCheck, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

const problems = [
    {
        title: "Hours Wasted",
        description: "Brands waste hours finding the right creators manually",
    },
    {
        title: "Unprofessional Pitch",
        description: "Creators look unprofessional without a structured media kit",
    },
    {
        title: "No Trust or Proof",
        description: "Lack of structure and verified proof of past work performance",
    },
];

const solutions = [
    {
        title: "Professional Media Kits",
        description: "Ready-to-share creator pages with all professional details",
    },
    {
        title: "Verified Reel Embeds",
        description: "Show actual work performance with embedded reels and views",
    },
    {
        title: "Proof-Based Discovery",
        description: "Find creators with verified stats and real performance proof",
    },
];

export function ProblemSolution() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px 0px" });

    return (
        <section ref={sectionRef} className="relative py-20 md:py-28 overflow-hidden bg-white dark:bg-slate-950">
            <div className="container mx-auto px-4 relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
                        The Problem We Solve
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
                        Traditional influencer marketing is fragmented. <span className="text-violet-600 dark:text-violet-400">GopGop</span> simplifies the connection.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
                    {/* Problems */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 font-bold uppercase tracking-wider text-xs border border-red-500/20"
                        >
                            Before GopGop
                        </motion.div>
                        <div className="space-y-4">
                            {problems.map((problem, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                                    whileHover={{ x: 5 }}
                                    className="group relative p-6 rounded-3xl border border-red-100 dark:border-red-900/30 bg-white/50 dark:bg-red-950/5 hover:border-red-500/30 transition-all duration-300"
                                >
                                    <div className="flex items-center gap-4">
                                        <motion.div
                                            whileHover={{ rotate: 180, scale: 1.2 }}
                                            className="shrink-0"
                                        >
                                            <X className="h-7 w-7 text-red-500" strokeWidth={3} />
                                        </motion.div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-lg mb-1">{problem.title}</h4>
                                            <p className="text-sm text-muted-foreground font-medium">{problem.description}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Solutions */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 font-bold uppercase tracking-wider text-xs border border-green-500/20"
                        >
                            With GopGop
                        </motion.div>
                        <div className="space-y-4">
                            {solutions.map((solution, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                                    whileHover={{ x: 5 }}
                                    className="group relative p-6 rounded-3xl border border-green-100 dark:border-green-900/30 bg-white/50 dark:bg-green-950/5 hover:border-green-500/30 transition-all duration-300"
                                >
                                    <div className="flex items-center gap-4">
                                        <motion.div
                                            whileHover={{ scale: 1.3, rotate: -10 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                            className="shrink-0"
                                        >
                                            <Check className="h-7 w-7 text-green-500" strokeWidth={3} />
                                        </motion.div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-lg mb-1">{solution.title}</h4>
                                            <p className="text-sm text-muted-foreground font-medium">{solution.description}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
