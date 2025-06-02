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
    <section ref={sectionRef} className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Users Say
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-lg text-muted-foreground">
              Join hundreds of satisfied developers and agency owners
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-5xl mx-auto"
        >
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 p-2">
                  <div className="h-full">
                    <Card className="h-full p-6 transition-all duration-300 hover:shadow-md hover:border-primary/20">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{testimonial.name}</h3>
                            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                          </div>
                        </div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground">{testimonial.content}</p>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-8">
              <CarouselPrevious className="static transform-none mr-2" />
              <CarouselNext className="static transform-none ml-2" />
            </div>
          </Carousel>
        </motion.div>
      </div>
    </section>
  );
}