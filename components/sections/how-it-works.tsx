"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Upload, Database, Layers, Download } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: Upload,
    title: "Upload Website List",
    description:
      "Simply upload a list of business URLs you want to scrape and analyze.",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    gradient: "from-blue-500/20 to-blue-500/0",
  },
  {
    icon: Database,
    title: "Collect Data",
    description:
      "Our scraper automatically extracts email, services, logos, colors, and more.",
    color: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
    gradient: "from-green-500/20 to-green-500/0",
  },
  {
    icon: Layers,
    title: "Generate Templates",
    description:
      "Multiple website templates are auto-generated based on the extracted data.",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
    gradient: "from-purple-500/20 to-purple-500/0",
  },
  {
    icon: Download,
    title: "Download & Sell",
    description:
      "Download the templates and sell them directly to the businesses.",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    gradient: "from-amber-500/20 to-amber-500/0",
  },
];

export function HowItWorksSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px 0px" });

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="py-20 md:py-28 overflow-hidden"
    >
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            How It Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Four simple steps to automate your website creation workflow
          </motion.p>
        </div>

        <div className="relative">
          {/* Progress Line */}
          <div className="absolute left-[50%] top-0 bottom-0 w-px bg-border hidden lg:block">
            <motion.div
              initial={{ height: "0%" }}
              animate={isInView ? { height: "100%" } : { height: "0%" }}
              transition={{ duration: 1.5, delay: 0.2 }}
              className="w-full bg-primary"
            />
          </div>

          <div className="space-y-12 lg:space-y-24 relative">
            {steps.map((step, index) => (
              <div
                key={index}
                className={cn(
                  "flex flex-col lg:flex-row items-center gap-8 lg:gap-16",
                  index % 2 === 1 && "lg:flex-row-reverse"
                )}
              >
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="flex-1 w-full"
                >
                  <div className="relative group">
                    <div className={cn(
                      "w-full aspect-[4/3] rounded-2xl bg-gradient-to-br",
                      step.gradient
                    )}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <step.icon className="w-16 h-16 opacity-20" />
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <p className="text-lg font-medium">{step.description}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                  transition={{ duration: 0.6, delay: index * 0.2 + 0.2 }}
                  className="flex-1 text-center lg:text-left"
                >
                  <div className="relative">
                    <div
                      className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto lg:mx-0 mb-6",
                        step.color
                      )}
                    >
                      <step.icon size={32} />
                      <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary flex items-center justify-center rounded-full text-primary-foreground font-bold text-sm">
                        {index + 1}
                      </div>
                    </div>
                    <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
                    <p className="text-muted-foreground text-lg">{step.description}</p>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}