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
    <section id="testimonials" className="bg-[#0C0C0C] py-16 sm:py-32 px-4 sm:px-6 md:px-10 overflow-hidden">
      <div className="max-w-5xl mx-auto relative">
        <div className="flex flex-col items-center mb-8 sm:mb-16">
           <Quote size={36} className="text-[#d4a373] opacity-20 mb-4 sm:mb-6" />
           <h2 className="hero-heading font-black uppercase text-[clamp(1.8rem,6vw,80px)] text-center leading-tight">Social Proof</h2>
        </div>

        <div className="relative min-h-[320px] sm:min-h-[400px] flex items-center justify-center">
            <AnimatePresence mode="wait">
                <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: 50, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -50, scale: 0.9 }}
                    transition={{ duration: 0.6, ease: "circOut" }}
                    className="w-full bg-white/5 border border-white/10 rounded-[24px] sm:rounded-[40px] p-6 sm:p-10 md:p-16 flex flex-col items-center text-center gap-5 sm:gap-8 relative"
                >
                    <p className="text-[#D7E2EA] font-medium text-base sm:text-lg md:text-2xl leading-relaxed italic">
                        &quot;{list[index].text}&quot;
                    </p>
                    
                    <div className="flex flex-col items-center">
                        <img src={list[index].image?.replace('export=view', 'export=download')} alt={list[index].name} className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover mb-3 sm:mb-4 border-2 border-[#d4a373]" />
                        <h4 className="font-bold uppercase tracking-widest text-sm sm:text-base">{list[index].name}</h4>
                        <p className="text-[9px] sm:text-[10px] uppercase opacity-40 tracking-[0.2em]">{list[index].role}</p>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Desktop navigation arrows on sides */}
            <div className="hidden md:flex absolute top-1/2 left-0 right-0 -translate-y-1/2 justify-between px-4 pointer-events-none">
                <button onClick={prev} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#d4a373] hover:text-black transition-all pointer-events-auto">
                    <ChevronLeft size={20} />
                </button>
                <button onClick={next} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#d4a373] hover:text-black transition-all pointer-events-auto">
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>

        {/* Mobile navigation below card */}
        <div className="flex md:hidden justify-center gap-4 mt-6">
            <button onClick={prev} className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center active:bg-[#d4a373] active:text-black transition-all">
                <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-1.5">
              {list.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${index === i ? 'w-6 bg-[#d4a373]' : 'w-1.5 bg-white/20'}`} />
              ))}
            </div>
            <button onClick={next} className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center active:bg-[#d4a373] active:text-black transition-all">
                <ChevronRight size={18} />
            </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
