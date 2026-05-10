import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import ContactButton from '../components/ContactButton';
import FadeIn from '../components/FadeIn';
import Magnet from '../components/Magnet';

const HeroSection = () => {
  const containerRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Parallax transforms - Both move UP to create a clean exit
  const yText = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const yImage = useTransform(scrollYProgress, [0, 1], [0, -250]);
  
  // Fade out happens quickly within the first 30% of scroll
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  const navItems = ['About', 'Price', 'Projects', 'Contact'];

  return (
    <section ref={containerRef} className="h-screen flex flex-col overflow-x-clip relative">
      {/* Navbar */}
      <FadeIn delay={0} y={-20} duration={0.7} className="w-full relative z-50">
        <nav className="flex justify-between items-center px-5 md:px-10 pt-5 md:pt-8 w-full max-w-[1600px] mx-auto">
          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 w-full justify-between">
            {navItems.map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`}
                className="text-[#D7E2EA] font-medium uppercase tracking-wider text-sm md:text-lg lg:text-[1.4rem] hover:opacity-70 transition-opacity duration-200"
              >
                {item}
              </a>
            ))}
            <div className="flex items-center gap-4 ml-4">
              <a 
                href="/portfolio"
                className="px-5 py-2 rounded-full border border-[#d4a373] text-[#d4a373] hover:bg-[#d4a373] hover:text-black font-bold uppercase tracking-wider text-xs lg:text-sm transition-all"
              >
                Full Portfolio
              </a>
              <a 
                href="/admin"
                className="text-[#D7E2EA]/30 hover:text-[#D7E2EA] font-medium uppercase tracking-wider text-sm md:text-lg lg:text-[1.4rem] hover:opacity-70 transition-all duration-200"
              >
                Admin
              </a>
            </div>
          </div>

          {/* Mobile: Brand + Hamburger */}
          <div className="flex md:hidden items-center justify-between w-full">
            <span className="text-[#D7E2EA] font-black text-lg uppercase tracking-widest">EDTXME</span>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 flex flex-col items-center justify-center gap-1.5 relative z-[60]"
              aria-label="Toggle menu"
            >
              <motion.span 
                animate={mobileMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                className="block w-6 h-0.5 bg-[#D7E2EA] transition-all"
              />
              <motion.span 
                animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="block w-6 h-0.5 bg-[#D7E2EA] transition-all"
              />
              <motion.span 
                animate={mobileMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                className="block w-6 h-0.5 bg-[#D7E2EA] transition-all"
              />
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#0C0C0C]/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
            >
              <div className="flex flex-col items-center gap-6 py-8">
                {navItems.map((item) => (
                  <a 
                    key={item} 
                    href={`#${item.toLowerCase()}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[#D7E2EA] font-medium uppercase tracking-wider text-base hover:text-[#d4a373] transition-colors"
                  >
                    {item}
                  </a>
                ))}
                <a 
                  href="/portfolio"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-6 py-2.5 rounded-full border border-[#d4a373] text-[#d4a373] font-bold uppercase tracking-wider text-sm transition-all mt-2"
                >
                  Full Portfolio
                </a>
                <a 
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[#D7E2EA]/30 hover:text-[#D7E2EA] font-medium uppercase tracking-wider text-sm transition-all"
                >
                  Admin
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </FadeIn>

      {/* Main Hero Content */}
      {/* Mobile: stacked vertically (flex-col), centered. Desktop: side by side (flex-row) */}
      <div className="flex-1 flex flex-col md:flex-row items-center px-5 md:px-10 relative z-10">
        {/* Left Column: Character */}
        <div className="w-full md:w-1/2 flex items-center justify-center relative">
          <motion.div 
            style={{ y: yImage, opacity, scale }}
            className="w-[55vw] sm:w-[45vw] md:w-[45vw] lg:w-[38vw] md:-translate-x-[10%]"
          >
            <Magnet strength={30}>
              <FadeIn delay={0.4} x={-60} scale={0.9} duration={1}>
                <img 
                  src="https://shrug-person-78902957.figma.site/_components/v2/d24c01ad3a56fc65e942a1f501eb73db42d7cf9a/Rectangle_40443.81459862.png" 
                  alt="EDTXME Character" 
                  className="w-full drop-shadow-[0_0_50px_rgba(255,255,255,0.2)]"
                />
              </FadeIn>
            </Magnet>
          </motion.div>
        </div>

        {/* Right Column: Text */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center text-center mt-[-2vh] md:mt-0">
          <FadeIn delay={0.15} x={60} duration={0.8} className="w-full">
            <motion.h1 
                style={{ y: yText, opacity }}
                className="hero-heading font-black uppercase tracking-tight leading-[0.8] flex flex-col items-center text-[16vw] sm:text-[11vw] md:text-[12vw] lg:text-[13vw]"
            >
              <span className="block">HI</span>
              <span className="block">I&apos;M</span>
              <span className="block">EDTXME</span>
            </motion.h1>
          </FadeIn>
        </div>
      </div>

      {/* Bottom Bar - Also fades out */}
      <motion.div style={{ opacity }} className="flex justify-between items-end px-5 md:px-10 pb-5 sm:pb-8 md:pb-10 w-full max-w-[1600px] mx-auto z-30">
        <FadeIn delay={0.35} y={20} duration={0.8}>
          <div className="flex flex-col gap-1 md:gap-2">
             <p className="text-[#d4a373] text-[8px] md:text-[9px] uppercase tracking-[0.3em] md:tracking-[0.4em] font-bold">Visual Storyteller</p>
             <p className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug text-[clamp(0.65rem,1.4vw,1.5rem)] max-w-[140px] sm:max-w-[220px] md:max-w-[260px]">
                a video editor driven by crafting striking and unforgettable projects
             </p>
          </div>
        </FadeIn>
        
        <FadeIn delay={0.5} y={20} duration={0.8}>
          <ContactButton />
        </FadeIn>
      </motion.div>
    </section>
  );
};

export default HeroSection;
