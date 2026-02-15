"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Alex Johnson",
    role: "Web Developer",
    avatar: "AJ",
    content:
      "This tool saved me hundreds of hours. I built 15 websites in a single day for local businesses and closed 8 deals worth $12,000 in total.",
  },
  {
    name: "Sarah Martinez",
    role: "Agency Owner",
    avatar: "SM",
    content:
      "Our agency has tripled our output since using this tool. The templates look professional and save us a ton of time on the initial design phase.",
  },
  {
    name: "Michael Chang",
    role: "Freelancer",
    avatar: "MC",
    content:
      "As a solo freelancer, this has completely changed my business. I can now take on 5x more clients with the same amount of time investment.",
  },
  {
    name: "Jessica Lee",
    role: "Marketing Consultant",
    avatar: "JL",
    content:
      "My clients love how quickly I can deliver websites for them. This has become an essential part of my service offering.",
  },
];

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px 0px" });

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
              What Our Users Say
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-lg text-muted-foreground font-medium">
              Join hundreds of creators and brands using <span className="text-violet-600 dark:text-violet-400 font-bold">GopGop</span> kits.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-6xl mx-auto"
        >
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <motion.div whileHover={{ y: -5 }} className="h-full">
                    <Card className="h-full p-8 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-[2rem] transition-all duration-300 hover:border-violet-500/50">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center">
                          <Avatar className="h-12 w-12 mr-4 border-2 border-slate-100 dark:border-slate-800">
                            <AvatarFallback className="font-bold">{testimonial.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-bold tracking-tight">{testimonial.name}</h3>
                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{testimonial.role}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-violet-500 text-violet-500 mr-0.5" />
                        ))}
                      </div>
                      <p className="text-muted-foreground font-medium leading-relaxed italic">
                        "{testimonial.content}"
                      </p>
                    </Card>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-12 gap-4">
              <CarouselPrevious className="static transform-none h-12 w-12 rounded-2xl border-2" />
              <CarouselNext className="static transform-none h-12 w-12 rounded-2xl border-2" />
            </div>
          </Carousel>
        </motion.div>
      </div>
    </section>
  );
}
