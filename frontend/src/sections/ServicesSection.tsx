import React from 'react';
import FadeIn from '../components/FadeIn';

const packages = [
  {
    num: '01',
    name: 'Short-Form Edit',
    time: '15 - 60 Seconds',
    price: '₹250 - ₹500',
    desc: 'Perfect for Reels, TikToks, and Shorts with high-energy cuts and trendy transitions.'
  },
  {
    num: '02',
    name: 'Standard Edit',
    time: '1 - 3 Minutes',
    price: '₹500 - ₹1,200',
    desc: 'Ideal for YouTube videos, vlogs, or social media ads requiring professional pacing.'
  },
  {
    num: '03',
    name: 'Extended Edit',
    time: '3 - 10 Minutes',
    price: '₹1,200 - ₹4,500',
    desc: 'Comprehensive editing for longer content, documentaries, or full event coverage.'
  },
  {
    num: '04',
    name: 'Long-Form content',
    time: '10+ Minutes',
    price: 'Custom',
    desc: 'For videos exceeding 10 minutes, please contact me personally via email for specialized pricing.'
  }
];

const ServicesSection = () => {
  return (
    <section id="price" className="bg-[#FFFFFF] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-16 sm:py-24 md:py-32 w-full">
      <h2 className="text-[#0C0C0C] font-black uppercase text-center text-[clamp(2.5rem,12vw,160px)] mb-10 sm:mb-20 md:mb-28">
        Services
      </h2>

      <div className="flex flex-col max-w-5xl mx-auto w-full">
        {packages.map((pkg, i) => (
          <FadeIn key={pkg.num} delay={i * 0.1} y={30}>
            <div className="flex flex-col sm:flex-row sm:items-center border-b border-[rgba(12,12,12,0.15)] py-6 sm:py-10 md:py-12 gap-3 sm:gap-10">
              <div className="text-[#0C0C0C] font-black text-[clamp(2rem,8vw,140px)] leading-none sm:w-1/4 sm:shrink-0 flex items-center">
                <span>{pkg.num}</span>
                {/* Mobile-only: price shown next to number */}
                <span className="sm:hidden text-[#0C0C0C] font-black text-sm opacity-70 ml-auto whitespace-nowrap">{pkg.price}</span>
              </div>
              <div className="flex flex-col gap-1.5 sm:gap-2 w-full">
                <div className="flex justify-between items-baseline gap-4">
                  <h3 className="text-[#0C0C0C] font-medium uppercase text-[clamp(0.95rem,2.2vw,2.1rem)]">
                    {pkg.name}
                  </h3>
                  {/* Desktop price - hidden on mobile since it's shown next to number */}
                  <span className="hidden sm:inline text-[#0C0C0C] font-black text-[clamp(0.9rem,1.8vw,1.6rem)] opacity-80 whitespace-nowrap">
                    {pkg.price}
                  </span>
                </div>
                <div className="text-[#0C0C0C]/50 text-xs sm:text-sm font-medium uppercase tracking-wider mb-1 sm:mb-2">
                  Duration: {pkg.time}
                </div>
                <p className="text-[#0C0C0C] font-light leading-relaxed max-w-2xl text-[clamp(0.8rem,1.6vw,1.1rem)] opacity-60">
                  {pkg.desc}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;
