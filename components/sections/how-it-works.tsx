"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { UserPlus, Video, Send, Handshake, Search, Bookmark, Mail, CheckCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

const creatorSteps = [
  {
    icon: UserPlus,
    number: 1,
    title: "Sign Up",
    description: "Create your account in seconds with basic details",
  },
  {
    icon: Video,
    number: 2,
    title: "Add Reels",
    description: "Paste Instagram reel URLs to showcase your work",
  },
  {
    icon: Send,
    number: 3,
    title: "Publish Media Kit",
    description: "Get your professional creator page live instantly",
  },
  {
    icon: Handshake,
    number: 4,
    title: "Get Brand Deals",
    description: "Brands discover you and reach out directly",
  },
];

const brandSteps = [
  {
    icon: Search,
    number: 1,
    title: "Apply Filters",
    description: "Search by niche, city, views range & more",
  },
  {
    icon: Video,
    number: 2,
    title: "Discover Creators",
    description: "See real reels, stats & proof screenshots",
  },
  {
    icon: Bookmark,
    number: 3,
    title: "Shortlist",
    description: "Save your favorite creators to a list",
  },
  {
    icon: Mail,
    number: 4,
    title: "Contact & Close",
    description: "Reach out via WhatsApp/Email and close deals",
  },
];

export function HowItWorksSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px 0px" });
  const [activeTab, setActiveTab] = useState("creators");

  return (
    <section id="how-it-works" ref={sectionRef} className="py-24 md:py-32 bg-white dark:bg-slate-950 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-black mb-6 tracking-tight"
          >
            How It Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-muted-foreground font-medium"
          >
            Simple, automated steps for both creators and brands on <span className="text-violet-600 dark:text-violet-400 font-bold">GopGop</span>.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-6xl mx-auto"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-center mb-16">
              <TabsList className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-sm h-auto">
                <TabsTrigger value="creators" className="rounded-xl py-3 font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm">
                  For Creators
                </TabsTrigger>
                <TabsTrigger value="brands" className="rounded-xl py-3 font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm">
                  For Brands
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="creators" className="mt-0 outline-none">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {creatorSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={activeTab === "creators" ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="p-8 h-full border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl transition-all duration-300 hover:border-violet-500/50">
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-6 relative">
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-violet-600"
                          >
                            <step.icon className="h-8 w-8" />
                          </motion.div>
                          <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-violet-600 text-white text-xs font-black flex items-center justify-center border-2 border-white dark:border-slate-900">
                            {step.number}
                          </div>
                        </div>
                        <h3 className="text-xl font-bold mb-3 tracking-tight">{step.title}</h3>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">{step.description}</p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="brands" className="mt-0 outline-none">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {brandSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={activeTab === "brands" ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="p-8 h-full border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl transition-all duration-300 hover:border-blue-500/50">
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-6 relative">
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-blue-600"
                          >
                            <step.icon className="h-8 w-8" />
                          </motion.div>
                          <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-black flex items-center justify-center border-2 border-white dark:border-slate-900">
                            {step.number}
                          </div>
                        </div>
                        <h3 className="text-xl font-bold mb-3 tracking-tight">{step.title}</h3>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">{step.description}</p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
}
