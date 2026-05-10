import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import axios from 'axios';
import API_URL from '../apiConfig';

const initialTestimonials = [
  {
    name: "Alex River",
    role: "Content Creator",
    text: "EDTXME transformed my raw footage into a cinematic masterpiece. The pacing and sound design are simply on another level.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop"
  }
];

const TestimonialsSection = () => {
  const [list, setList] = useState(initialTestimonials);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const fetch = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/testimonials`);
            if (res.data && res.data.length > 0) setList(res.data);
        } catch (e) {}
    };
    fetch();
  }, []);

  const next = () => setIndex((prev) => (prev + 1) % list.length);
  const prev = () => setIndex((prev) => (prev - 1 + list.length) % list.length);

  if (list.length === 0) return null;

  return (
    <section id="testimonials" className="bg-[#0C0C0C] py-32 px-6 md:px-10 overflow-hidden">
      <div className="max-w-5xl mx-auto relative">
        <div className="flex flex-col items-center mb-16">
           <Quote size={48} className="text-[#d4a373] opacity-20 mb-6" />
           <h2 className="hero-heading font-black uppercase text-[clamp(2rem,6vw,80px)] text-center leading-tight">Social Proof</h2>
        </div>

        <div className="relative min-h-[400px] flex items-center justify-center">
            <AnimatePresence mode="wait">
                <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: 50, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -50, scale: 0.9 }}
                    transition={{ duration: 0.6, ease: "circOut" }}
                    className="w-full bg-white/5 border border-white/10 rounded-[40px] p-10 md:p-16 flex flex-col items-center text-center gap-8 relative"
                >
                    <p className="text-[#D7E2EA] font-medium text-lg md:text-2xl leading-relaxed italic">
                        &quot;{list[index].text}&quot;
                    </p>
                    
                    <div className="flex flex-col items-center">
                        <img src={list[index].image} alt={list[index].name} className="w-16 h-16 rounded-full object-cover mb-4 border-2 border-[#d4a373]" />
                        <h4 className="font-bold uppercase tracking-widest">{list[index].name}</h4>
                        <p className="text-[10px] uppercase opacity-40 tracking-[0.2em]">{list[index].role}</p>
                    </div>

                    <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-4 md:-px-12 pointer-events-none">
                        <button onClick={prev} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#d4a373] hover:text-black transition-all pointer-events-auto">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={next} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#d4a373] hover:text-black transition-all pointer-events-auto">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
