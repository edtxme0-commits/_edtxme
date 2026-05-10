import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../apiConfig';
import FadeIn from '../components/FadeIn';
import AnimatedText from '../components/AnimatedText';
import ContactButton from '../components/ContactButton';

const AboutSection = () => {
  const [content, setContent] = useState({
    aboutHeading: 'About me',
    aboutDescription: "With a passion for storytelling and cinematic motion, i focus on high-end video editing, color grading, and sound design. i truly enjoy collaborating with creators and brands to turn raw footage into unforgettable visual experiences. Let's create something cinematic together!",
    aboutImage1: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png',
    aboutImage2: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png',
    founder1Name: 'Shubham',
    founder1Image: 'https://via.placeholder.com/150',
    founder2Name: 'Saurabh',
    founder2Image: 'https://via.placeholder.com/150',
    managerName: 'Nitin',
    managerRole: 'Manager',
    managerImage: 'https://via.placeholder.com/150'
  });
  const [team, setTeam] = useState<any[]>([]);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/config`);
        setContent(prev => ({ ...prev, ...res.data }));
      } catch (e) {}
    };
    const fetchTeam = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/team`);
        setTeam(res.data);
      } catch (e) {}
    };
    fetchConfig();
    fetchTeam();
  }, []);

  return (
    <section id="about" className="relative min-h-screen flex flex-col justify-center items-center px-4 sm:px-8 md:px-10 py-14 sm:py-20 overflow-hidden bg-[#0C0C0C]">
      {/* Decorative 3D Elements */}
      <FadeIn delay={0.1} x={-80} duration={0.9} className="absolute top-[4%] left-[2%] md:left-[4%] opacity-30">
        <img src={content.aboutImage1?.replace('export=view', 'export=download')} alt="Decoration 1" className="w-[120px] sm:w-[160px] md:w-[210px] object-contain pointer-events-none" />
      </FadeIn>

      <FadeIn delay={0.25} x={-80} duration={0.9} className="absolute bottom-[8%] left-[3%] md:left-[6%] opacity-30">
        <img src={content.aboutImage2?.replace('export=view', 'export=download')} alt="Decoration 2" className="w-[100px] sm:w-[140px] md:w-[180px] object-contain pointer-events-none" />
      </FadeIn>

      {/* Team Section - Dynamic Portraits */}
      <div className="absolute bottom-[4%] right-[4%] z-20 hidden xl:flex flex-col gap-6 items-end">
        {/* Founders & Management (Fixed) */}
        <FadeIn delay={0.3} x={40} duration={0.8} className="flex flex-col items-end">
            <div className="flex gap-4 items-center">
                <div className="text-right">
                    <p className="text-[9px] uppercase tracking-[0.2em] opacity-30">Founder</p>
                    <p className="text-white font-bold uppercase tracking-tight text-sm">{content.founder1Name}</p>
                </div>
                <img src={content.founder1Image?.replace('export=view', 'export=download')} alt={content.founder1Name} className="w-14 h-14 rounded-full object-cover border-2 border-white/10 grayscale hover:grayscale-0 transition-all hover:border-[#d4a373] hover:scale-110 cursor-help" />
            </div>
        </FadeIn>
        <FadeIn delay={0.4} x={40} duration={0.8} className="flex flex-col items-end">
            <div className="flex gap-4 items-center">
                <div className="text-right">
                    <p className="text-[9px] uppercase tracking-[0.2em] opacity-30">Founder</p>
                    <p className="text-white font-bold uppercase tracking-tight text-sm">{content.founder2Name}</p>
                </div>
                <img src={content.founder2Image?.replace('export=view', 'export=download')} alt={content.founder2Name} className="w-14 h-14 rounded-full object-cover border-2 border-white/10 grayscale hover:grayscale-0 transition-all hover:border-[#d4a373] hover:scale-110 cursor-help" />
            </div>
        </FadeIn>
        <FadeIn delay={0.45} x={40} duration={0.8} className="flex flex-col items-end">
            <div className="flex gap-4 items-center">
                <div className="text-right">
                    <p className="text-[9px] uppercase tracking-[0.2em] opacity-30">{content.managerRole}</p>
                    <p className="text-white font-bold uppercase tracking-tight text-sm">{content.managerName}</p>
                </div>
                <img src={content.managerImage?.replace('export=view', 'export=download')} alt={content.managerName} className="w-14 h-14 rounded-full object-cover border-2 border-white/10 grayscale hover:grayscale-0 transition-all hover:border-[#d4a373] hover:scale-110 cursor-help" />
            </div>
        </FadeIn>

        {/* Divider & Dynamic Team */}
        {team.length > 0 && (
          <div className="w-full flex justify-end my-2">
             <div className="w-1/2 h-px bg-white/10"></div>
          </div>
        )}
        {team.map((member, index) => (
          <FadeIn key={member._id} delay={0.5 + index * 0.1} x={40} duration={0.8} className="flex flex-col items-end">
            <div className="flex gap-4 items-center">
              <div className="text-right">
                <p className="text-[9px] uppercase tracking-[0.2em] opacity-30">{member.isFounder ? 'Founder' : member.role}</p>
                <p className="text-white font-bold uppercase tracking-tight text-sm">{member.name}</p>
              </div>
              <img src={member.image?.replace('export=view', 'export=download')} alt={member.name} className="w-14 h-14 rounded-full object-cover border-2 border-white/10 grayscale hover:grayscale-0 transition-all hover:border-[#d4a373] hover:scale-110 cursor-help" />
            </div>
          </FadeIn>
        ))}
        
        {/* Contact Info always at bottom */}
        <div className="mt-6 text-right">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#D7E2EA]/40 mb-1">Contact for any type of query</p>
            <a href="mailto:edtxme0@gmail.com" className="text-[#d4a373] font-bold text-base hover:opacity-70 transition-opacity">
                edtxme0@gmail.com
            </a>
        </div>
      </div>

      {/* Mobile/Tablet Team View */}
      <div className="xl:hidden flex flex-col items-center mt-10 sm:mt-16 z-20">
         <div className="flex flex-wrap justify-center gap-6 sm:gap-8 mb-8 sm:mb-12">
            {/* Founders & Management (Fixed) */}
            <FadeIn delay={0.3} y={20} className="flex flex-col items-center gap-2">
                <img src={content.founder1Image?.replace('export=view', 'export=download')} alt={content.founder1Name} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-[#d4a373]" />
                <p className="text-[10px] uppercase font-bold text-white">{content.founder1Name}</p>
                <p className="text-[8px] uppercase opacity-50">Founder</p>
            </FadeIn>
            <FadeIn delay={0.4} y={20} className="flex flex-col items-center gap-2">
                <img src={content.founder2Image?.replace('export=view', 'export=download')} alt={content.founder2Name} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-[#d4a373]" />
                <p className="text-[10px] uppercase font-bold text-white">{content.founder2Name}</p>
                <p className="text-[8px] uppercase opacity-50">Founder</p>
            </FadeIn>
            <FadeIn delay={0.45} y={20} className="flex flex-col items-center gap-2">
                <img src={content.managerImage?.replace('export=view', 'export=download')} alt={content.managerName} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-[#d4a373]" />
                <p className="text-[10px] uppercase font-bold text-white">{content.managerName}</p>
                <p className="text-[8px] uppercase opacity-50">{content.managerRole}</p>
            </FadeIn>

            {/* Divider & Dynamic Team */}
            {team.length > 0 && (
              <div className="w-full flex justify-center my-2">
                 <div className="w-1/2 h-px bg-white/10"></div>
              </div>
            )}
            {team.map((member, index) => (
              <FadeIn key={member._id} delay={0.5 + index * 0.1} y={20} className="flex flex-col items-center gap-2">
                  <img src={member.image?.replace('export=view', 'export=download')} alt={member.name} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-[#d4a373]" />
                  <p className="text-[10px] uppercase font-bold text-white">{member.name}</p>
                  <p className="text-[8px] uppercase opacity-50">{member.isFounder ? 'Founder' : member.role}</p>
              </FadeIn>
            ))}
         </div>
         <FadeIn delay={0.6} y={10} className="text-center">
            <p className="text-[9px] uppercase tracking-widest opacity-30 mb-1">Contact for any type of query</p>
            <a href="mailto:edtxme0@gmail.com" className="text-[#d4a373] font-bold uppercase text-sm">edtxme0@gmail.com</a>
         </FadeIn>
      </div>

      {/* Main Content */}
      <div className="z-10 flex flex-col items-center max-w-[1200px] mx-auto w-full mt-[-2vh]">
        <FadeIn delay={0} y={40} className="w-full">
          <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-center text-[clamp(2.5rem,10vw,140px)]">
            {content.aboutHeading}
          </h2>
        </FadeIn>

        <div className="flex flex-col items-center mt-10 sm:mt-14 md:mt-16 w-full">
          <AnimatedText 
            text={content.aboutDescription}
            className="text-[#D7E2EA] font-medium text-center leading-relaxed max-w-[640px] text-[clamp(1rem,2vw,1.35rem)]"
          />

          <div className="mt-16 sm:mt-20 md:mt-24">
            <ContactButton />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
