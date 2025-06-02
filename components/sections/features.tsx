"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { 
  Brain, Paintbrush, Laptop, Mail, Globe, Rocket,
  Zap, Star, ShieldCheck, Smile, Lock, Database
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Brain,
    title: "Smart Scraping",
    description: "AI-powered data extraction that identifies key business information automatically.",
    color: "text-blue-500 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950",
  },
  {
    icon: Paintbrush,
    title: "Multiple Template Designs",
    description: "Generate various design options to choose from for each business.",
    color: "text-purple-500 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-950",
  },
  {
    icon: Laptop,
    title: "Works Offline",
    description: "Download and run the tool locally without needing constant internet connection.",
    color: "text-gray-700 dark:text-gray-300",
    bgColor: "bg-gray-50 dark:bg-gray-900",
  },
  {
    icon: Mail,
    title: "Email Outreach Built-In",
    description: "Automated email templates to contact businesses with your proposals.",
    color: "text-red-500 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950",
  },
  {
    icon: Globe,
    title: "FTP Deployment Support",
    description: "Deploy finished websites directly to hosting with built-in FTP tools.",
    color: "text-teal-500 dark:text-teal-400",
    bgColor: "bg-teal-50 dark:bg-teal-950",
  },
  {
    icon: Rocket,
    title: "Fast & Lightweight",
    description: "Optimized performance for quick template generation without lag.",
    color: "text-amber-500 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950",
  },
  {
    icon: Zap,
    title: "One-Click Generation",
    description: "Create complete websites with a single click after configuration.",
    color: "text-yellow-500 dark:text-yellow-400",
    bgColor: "bg-yellow-50 dark:bg-yellow-950",
  },
  {
    icon: Lock,
    title: "Secure Processing",
    description: "All data is processed locally with no external uploads for maximum privacy.",
    color: "text-emerald-500 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-950",
  },
];

export function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px 0px" });

  return (
    <section id="features" ref={sectionRef} className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Features
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-lg text-muted-foreground">
              Everything you need to automate your website creation workflow
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
            >
              <Card className="h-full p-6 transition-all duration-300 hover:shadow-md hover:border-primary/50">
                <div className="flex flex-col h-full">
                  <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mb-4", feature.bgColor)}>
                    <feature.icon className={cn("h-6 w-6", feature.color)} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground flex-grow">{feature.description}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}