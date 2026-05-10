import React from 'react';
import { motion } from 'framer-motion';
import FadeIn from '../components/FadeIn';

const milestones = [
  { year: '2021', title: 'The Genesis', desc: 'Started the journey with simple vlogs and basic cuts.' },
  { year: '2022', title: 'Deep Dive', desc: 'Mastered After Effects and advanced color grading techniques.' },
  { year: '2023', title: 'Creative Studio', desc: 'Launched EDTXME brand and collaborated with 50+ international creators.' },
  { year: '2024', title: 'Cinematic Era', desc: 'Focusing on high-end commercial projects and AI-integrated workflows.' }
];

const TimelineSection = () => {
  return (
    <section className="bg-[#0C0C0C] py-16 sm:py-32 px-4 sm:px-6 md:px-10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-14 sm:mb-28">
          <h2 className="hero-heading font-black uppercase text-[clamp(2rem,8vw,100px)] text-center leading-none">The Journey</h2>
          <p className="text-[10px] uppercase tracking-[0.4em] opacity-40 mt-3 sm:mt-4">Milestones & Achievements</p>
        </div>

        <div className="relative">
          {/* Vertical Line - desktop center, mobile left */}
          <div className="absolute left-4 sm:left-6 md:left-[50%] top-0 bottom-0 w-px bg-white/10" />
          
          <div className="space-y-12 sm:space-y-20 relative">
            {milestones.map((m, i) => (
              <div key={m.year} className={`flex flex-col md:flex-row items-start md:items-center gap-4 sm:gap-10 ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                {/* Mobile: offset content from left line */}
                <FadeIn delay={i * 0.15} x={i % 2 === 0 ? -50 : 50} className="w-full md:w-1/2 pl-10 sm:pl-14 md:pl-0">
                   <div className={`flex flex-col text-left md:text-center ${i % 2 !== 0 ? 'md:items-start md:text-left' : 'md:items-end md:text-right'}`}>
                      <span className="text-[clamp(2rem,8vw,80px)] font-black text-white opacity-5 mb-[-10px] sm:mb-[-20px]">{m.year}</span>
                      <h3 className="text-lg sm:text-2xl font-bold uppercase text-[#d4a373] mb-2 sm:mb-4">{m.title}</h3>
                      <p className="text-[#D7E2EA] opacity-60 leading-relaxed max-w-sm text-sm sm:text-base">{m.desc}</p>
                   </div>
                </FadeIn>
                
                {/* Center Point */}
                <div className="absolute left-2 sm:left-4 md:relative md:left-auto flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-[#0C0C0C] border-2 sm:border-4 border-[#d4a373] z-10">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white animate-ping" />
                </div>

                <div className="hidden md:block w-full md:w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
