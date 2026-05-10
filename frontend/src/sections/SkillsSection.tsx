import React from 'react';
import { motion } from 'framer-motion';
import FadeIn from '../components/FadeIn';

const skills = [
  { name: 'After Effects', icon: 'AE', color: '#9999FF', percent: 95 },
  { name: 'Premiere Pro', icon: 'PR', color: '#00005B', percent: 98 },
  { name: 'DaVinci Resolve', icon: 'DR', color: '#FF9500', percent: 85 },
  { name: 'Photoshop', icon: 'PS', color: '#31A8FF', percent: 90 },
  { name: 'CapCut', icon: 'CC', color: '#00F2EA', percent: 99 },
  { name: 'Blender', icon: 'BL', color: '#E87D0D', percent: 75 },
  { name: 'Motion Graphics', icon: 'MG', color: '#FFFFFF', percent: 92 }
];

const SkillsSection = () => {
  return (
    <section className="bg-[#0C0C0C] py-32 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-20">
          <h2 className="hero-heading font-black uppercase text-[clamp(2.5rem,8vw,100px)] text-center leading-none">Expertise</h2>
          <p className="text-[10px] uppercase tracking-[0.4em] opacity-40 mt-4">The tools of the trade</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {skills.map((skill, i) => (
            <FadeIn key={skill.name} delay={i * 0.1} y={20}>
              <div className="bg-white/5 border border-white/10 rounded-[30px] p-8 hover:bg-white/10 transition-all group relative overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                   <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center font-black text-lg border border-white/10 group-hover:border-[#d4a373] transition-colors" style={{ color: skill.color }}>
                      {skill.icon}
                   </div>
                   <span className="text-2xl font-black opacity-10">{skill.percent}%</span>
                </div>
                
                <h3 className="text-lg font-bold uppercase tracking-tight mb-4">{skill.name}</h3>
                
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     whileInView={{ width: `${skill.percent}%` }}
                     transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
                     className="h-full bg-gradient-to-r from-[#d4a373] to-white"
                   />
                </div>

                <div className="absolute top-0 right-0 w-24 h-24 bg-[#d4a373]/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
