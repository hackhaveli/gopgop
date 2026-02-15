"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How is GopGop different from other influencer platforms?",
    answer:
      "GopGop focuses on micro-influencers with proof-based discovery. We show real reels, actual views (not just followers), and verified work. No fake stats, no middlemen.",
  },
  {
    question: "Do you scrape Instagram data?",
    answer:
      "No. All data is user-submitted. Creators voluntarily add their reel URLs and stats. We don't scrape or violate any platform policies.",
  },
  {
    question: "Can creators really get brand deals?",
    answer:
      "Yes! Professional media kits significantly increase your chances. Brands prefer creators who look professional and have easy-to-share portfolios.",
  },
  {
    question: "What if Instagram embeds fail to load?",
    answer:
      "If Instagram blocks embeds (rare), we show a clickable link card instead. Your media kit page will never break.",
  },
  {
    question: "Is there a free option for creators?",
    answer:
      "Yes! Free plan includes 3 reel embeds and a basic media kit page. Perfect to test the platform before upgrading to Starter plan.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Absolutely. No contracts, no lock-ins. Cancel anytime from your dashboard. Your media kit stays live until the current billing period ends.",
  },
  {
    question: "How do brands contact creators?",
    answer:
      "Creators add WhatsApp number and/or email on their media kit. Brands can reach out directly. No commission, no middlemen.",
  },
  {
    question: "What about privacy and data security?",
    answer:
      "We don't sell your data. Your email and phone are only visible to brands when you choose to display them. You control what's public on your media kit.",
  },
];

export function FaqSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px 0px" });

  return (
    <section id="faq" ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
              Frequently Asked Questions
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-lg text-muted-foreground font-medium">
              Got questions? We've got answers to help you get started with <span className="text-violet-600 dark:text-violet-400 font-bold">GopGop</span>.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-slate-200 dark:border-slate-800 rounded-2xl px-6 bg-slate-50/50 dark:bg-slate-900/50 transition-colors hover:border-violet-500/30">
                <AccordionTrigger className="text-left text-lg font-bold py-6 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm md:text-base font-medium pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
