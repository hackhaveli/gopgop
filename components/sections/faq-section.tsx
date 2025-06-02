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
    question: "Is it beginner friendly?",
    answer:
      "Yes! Our tool is designed with a user-friendly interface that requires no coding knowledge. Simply upload your list of websites, and our system handles all the technical aspects of scraping and template generation.",
  },
  {
    question: "Can I resell the websites?",
    answer:
      "Absolutely! That's the main purpose of our tool. You retain 100% ownership of all generated templates and can sell them to businesses without any restrictions or royalty fees.",
  },
  {
    question: "Do I need coding knowledge?",
    answer:
      "No coding knowledge is required. The tool automatically extracts data and creates professional templates. However, if you wish to make custom adjustments, basic HTML/CSS knowledge can be helpful but not necessary.",
  },
  {
    question: "How do I get updates?",
    answer:
      "As a lifetime member, you'll receive all future updates for free. We regularly add new features, template designs, and improve our scraping algorithms based on user feedback.",
  },
  {
    question: "How many websites can I generate?",
    answer:
      "There are no limits on the number of websites you can generate. Our one-time purchase gives you unlimited usage without any hidden fees or charges.",
  },
  {
    question: "Is there a refund policy?",
    answer:
      "Yes, we offer a 30-day money-back guarantee. If you're not satisfied with the tool for any reason, contact our support team within 30 days of purchase for a full refund.",
  },
];

export function FaqSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px 0px" });

  return (
    <section id="faq" ref={sectionRef} className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-lg text-muted-foreground">
              Everything you need to know about our website generator
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-medium py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
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