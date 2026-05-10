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
    <section className="bg-[#0C0C0C] py-32 px-6 md:px-10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-28">
          <h2 className="hero-heading font-black uppercase text-[clamp(2.5rem,8vw,100px)] text-center leading-none">The Journey</h2>
          <p className="text-[10px] uppercase tracking-[0.4em] opacity-40 mt-4">Milestones & Achievements</p>
        </div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-[50%] top-0 bottom-0 w-px bg-white/10 hidden md:block" />
          
          <div className="space-y-20 relative">
            {milestones.map((m, i) => (
              <div key={m.year} className={`flex flex-col md:flex-row items-center gap-10 ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                <FadeIn delay={i * 0.15} x={i % 2 === 0 ? -50 : 50} className="w-full md:w-1/2">
                   <div className={`flex flex-col ${i % 2 !== 0 ? 'md:items-start' : 'md:items-end'} text-center ${i % 2 !== 0 ? 'md:text-left' : 'md:text-right'}`}>
                      <span className="text-[clamp(3rem,8vw,80px)] font-black text-white opacity-5 mb-[-20px]">{m.year}</span>
                      <h3 className="text-2xl font-bold uppercase text-[#d4a373] mb-4">{m.title}</h3>
                      <p className="text-[#D7E2EA] opacity-60 leading-relaxed max-w-sm ml-auto mr-auto md:ml-0 md:mr-0">{m.desc}</p>
                   </div>
                </FadeIn>
                
                {/* Center Point */}
                <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-[#0C0C0C] border-4 border-[#d4a373] z-10 relative">
                    <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                </div>

                <div className="w-full md:w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
