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

  const [activeReel, setActiveReel] = useState<any>(null);

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
               onClick={() => setActiveReel(reel)}
               className="relative w-full max-w-[360px] aspect-[9/16] bg-black rounded-[40px] overflow-hidden border border-white/10 shadow-2xl group cursor-pointer"
             >
                <HoverVideo src={reel.streamUrl?.replace('export=view', 'export=download')} isActive={activeIndex === i} />
                
                {/* Play Button Icon on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white scale-75 group-hover:scale-100 transition-transform">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-10 left-8 right-8 text-left translate-y-4 group-hover:translate-y-0 transition-transform opacity-0 group-hover:opacity-100">
                    <p className="text-[10px] uppercase tracking-widest text-[#d4a373] mb-2 font-bold">{reel.category}</p>
                    <h3 className="text-xl font-bold text-white uppercase">{reel.title}</h3>
                </div>
             </motion.div>
          </div>
        ))}
      </div>

      {/* Fullscreen Video Modal for Reels */}
      <AnimatePresence>
        {activeReel && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-0 md:p-8"
          >
            <div className="w-full h-full md:max-w-[500px] mx-auto bg-black md:rounded-[40px] overflow-hidden relative shadow-2xl border-0 md:border border-white/10 group flex items-center justify-center">
               <button 
                  onClick={() => setActiveReel(null)}
                  className="absolute top-6 right-6 z-50 w-12 h-12 bg-black/50 hover:bg-[#d4a373] text-white hover:text-black rounded-full flex items-center justify-center backdrop-blur-md transition-colors"
               >
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
               </button>
               
               <video 
                  src={activeReel.streamUrl?.replace('export=view', 'export=download')}
                  className="w-full h-full object-contain max-h-[100vh] outline-none"
                  controls
                  autoPlay
                  playsInline
               />
               
               <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <p className="text-[#d4a373] font-bold tracking-[0.3em] uppercase text-xs mb-2">{activeReel.category}</p>
                  <h2 className="text-white font-black uppercase text-2xl md:text-3xl">{activeReel.title}</h2>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ReelsSection;
