import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ContactButton from '../components/ContactButton';
import FadeIn from '../components/FadeIn';
import Magnet from '../components/Magnet';

const HeroSection = () => {
  const containerRef = useRef(null);
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

  return (
    <section ref={containerRef} className="h-screen flex flex-col overflow-x-clip relative">
      {/* Navbar */}
      <FadeIn delay={0} y={-20} duration={0.7} className="w-full relative z-50">
        <nav className="flex justify-between items-center px-6 md:px-10 pt-6 md:pt-8 w-full max-w-[1600px] mx-auto">
          {['About', 'Price', 'Projects', 'Contact'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className="text-[#D7E2EA] font-medium uppercase tracking-wider text-sm md:text-lg lg:text-[1.4rem] hover:opacity-70 transition-opacity duration-200"
            >
              {item}
            </a>
          ))}
          <a 
            href="/admin"
            className="text-[#D7E2EA]/30 hover:text-[#D7E2EA] font-medium uppercase tracking-wider text-sm md:text-lg lg:text-[1.4rem] hover:opacity-70 transition-all duration-200 ml-4"
          >
            Admin
          </a>
        </nav>
      </FadeIn>

      {/* Main Hero Content - Both elements fade and move up together */}
      <div className="flex-1 flex flex-row items-center px-6 md:px-10 relative z-10">
        {/* Left Column: Character */}
        <div className="w-1/2 flex items-center justify-center relative">
          <motion.div 
            style={{ y: yImage, opacity, scale }}
            className="w-[80vw] sm:w-[60vw] md:w-[45vw] lg:w-[38vw] -translate-x-[10%]"
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

        {/* Right Column: Text - Now moves UP and fades out faster */}
        <div className="w-1/2 flex flex-col justify-center items-center text-center">
          <FadeIn delay={0.15} x={60} duration={0.8} className="w-full">
            <motion.h1 
                style={{ y: yText, opacity }}
                className="hero-heading font-black uppercase tracking-tight leading-[0.8] flex flex-col items-center text-[10vw] sm:text-[11vw] md:text-[12vw] lg:text-[13vw]"
            >
              <span className="block">HI</span>
              <span className="block">I&apos;M</span>
              <span className="block">EDTXME</span>
            </motion.h1>
          </FadeIn>
        </div>
      </div>

      {/* Bottom Bar - Also fades out */}
      <motion.div style={{ opacity }} className="flex justify-between items-end px-6 md:px-10 pb-7 sm:pb-8 md:pb-10 w-full max-w-[1600px] mx-auto z-30">
        <FadeIn delay={0.35} y={20} duration={0.8}>
          <div className="flex flex-col gap-2">
             <p className="text-[#d4a373] text-[9px] uppercase tracking-[0.4em] font-bold">Visual Storyteller</p>
             <p className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug text-[clamp(0.75rem,1.4vw,1.5rem)] max-w-[160px] sm:max-w-[220px] md:max-w-[260px]">
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
