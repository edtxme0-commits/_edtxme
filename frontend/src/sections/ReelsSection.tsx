import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import API_URL from '../apiConfig';
import { motion, AnimatePresence } from 'framer-motion';

const HoverVideo = ({ src, isActive }: { src: string, isActive: boolean }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isActive]);

  return (
    <video 
      ref={videoRef}
      src={src} 
      className="w-full h-full object-cover"
      muted 
      loop 
      playsInline
    />
  );
};

const ReelsSection = () => {
  const [reels, setReels] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/videos`);
        const verticalReels = res.data.filter((v: any) => v.isReel);
        setReels(verticalReels);
      } catch (e) {}
    };
    fetchReels();
  }, []);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const scrollLeft = containerRef.current.scrollLeft;
    const width = containerRef.current.offsetWidth;
    const index = Math.round(scrollLeft / width);
    setActiveIndex(index);
  };

  if (reels.length === 0) return null;

  return (
    <section className="bg-[#0C0C0C] py-12 sm:py-20 overflow-hidden">
      <div className="px-4 sm:px-6 md:px-10 mb-6 sm:mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 sm:gap-6 max-w-7xl mx-auto">
         <div>
            <h2 className="hero-heading font-black uppercase text-[clamp(1.5rem,6vw,80px)] leading-none">Social Reels</h2>
            <p className="text-[10px] uppercase tracking-[0.3em] opacity-40 mt-2">Mobile-First Cinematic Storytelling</p>
         </div>
         <div className="flex gap-2">
            {reels.map((_, i) => (
               <div key={i} className={`h-1 transition-all duration-500 rounded-full ${activeIndex === i ? 'w-8 bg-[#d4a373]' : 'w-2 bg-white/10'}`} />
            ))}
         </div>
      </div>

      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-4 sm:gap-6 px-[5vw] sm:px-[10vw] md:px-[25vw]"
      >
        {reels.map((reel, i) => (
          <div key={reel._id} className="min-w-full snap-center flex justify-center">
             <motion.div 
               animate={{ 
                 scale: activeIndex === i ? 1 : 0.9,
                 opacity: activeIndex === i ? 1 : 0.3
               }}
               className="relative w-full max-w-[360px] aspect-[9/16] bg-black rounded-[40px] overflow-hidden border border-white/10 shadow-2xl group"
             >
                <HoverVideo src={reel.streamUrl?.replace('export=view', 'export=download')} isActive={activeIndex === i} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-10 left-8 right-8 text-left translate-y-4 group-hover:translate-y-0 transition-transform opacity-0 group-hover:opacity-100">
                    <p className="text-[10px] uppercase tracking-widest text-[#d4a373] mb-2 font-bold">{reel.category}</p>
                    <h3 className="text-xl font-bold text-white uppercase">{reel.title}</h3>
                </div>
             </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ReelsSection;
