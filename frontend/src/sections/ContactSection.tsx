import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Send, Phone as WhatsApp } from 'lucide-react';
import FadeIn from '../components/FadeIn';

const ContactSection = () => {
  return (
    <section id="contact" className="bg-[#0C0C0C] py-16 sm:py-32 px-4 sm:px-6 md:px-10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-20">
        
        {/* Left Side: Contact Form */}
        <div className="space-y-8 sm:space-y-12">
          <div>
            <h2 className="hero-heading font-black uppercase text-[clamp(2rem,8vw,100px)] leading-none">Get in Touch</h2>
            <p className="text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.4em] opacity-40 mt-3 sm:mt-4">Let&apos;s build your next masterpiece together</p>
          </div>

          <form className="space-y-6 sm:space-y-8 max-w-lg">
            <div className="group relative">
                <input type="text" placeholder="Your Name" className="w-full bg-transparent border-b border-white/10 py-3 sm:py-4 outline-none text-[#D7E2EA] text-sm sm:text-base focus:border-[#d4a373] transition-colors" />
                <div className="absolute bottom-0 left-0 h-0.5 bg-[#d4a373] w-0 group-focus-within:w-full transition-all duration-500" />
            </div>
            <div className="group relative">
                <input type="email" placeholder="Your Email" className="w-full bg-transparent border-b border-white/10 py-3 sm:py-4 outline-none text-[#D7E2EA] text-sm sm:text-base focus:border-[#d4a373] transition-colors" />
                <div className="absolute bottom-0 left-0 h-0.5 bg-[#d4a373] w-0 group-focus-within:w-full transition-all duration-500" />
            </div>
            <div className="group relative">
                <textarea rows={4} placeholder="Project Details" className="w-full bg-transparent border-b border-white/10 py-3 sm:py-4 outline-none text-[#D7E2EA] text-sm sm:text-base focus:border-[#d4a373] transition-colors resize-none" />
                <div className="absolute bottom-0 left-0 h-0.5 bg-[#d4a373] w-0 group-focus-within:w-full transition-all duration-500" />
            </div>
            
            <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 bg-[#d4a373] text-black font-black uppercase text-xs rounded-full flex items-center justify-center sm:justify-start gap-3 group"
            >
                Send Message
                <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </motion.button>
          </form>
        </div>

        {/* Right Side: Social & Quick Connect */}
        <div className="flex flex-col justify-between">
           <div className="space-y-6 sm:space-y-10">
              <h3 className="text-sm font-bold uppercase tracking-[0.3em] opacity-30">Quick Connect</h3>
              
              <div className="grid grid-cols-2 gap-3 sm:gap-6">
                 {/* WhatsApp */}
                 <a 
                    href="https://wa.me/91XXXXXXXXXX" 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-5 sm:p-8 bg-white/5 border border-white/10 rounded-[20px] sm:rounded-[30px] flex flex-col gap-3 sm:gap-4 hover:bg-white/10 transition-all group"
                 >
                    <WhatsApp className="text-[#25D366]" size={24} />
                    <div>
                        <p className="text-[9px] sm:text-[10px] uppercase font-bold opacity-40">WhatsApp</p>
                        <p className="text-white font-bold text-sm sm:text-base">Quick Chat</p>
                    </div>
                 </a>

                 {/* Instagram */}
                 <a 
                    href="https://www.instagram.com/_edtxme/" 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-5 sm:p-8 bg-white/5 border border-white/10 rounded-[20px] sm:rounded-[30px] flex flex-col gap-3 sm:gap-4 hover:bg-white/10 transition-all group overflow-hidden relative"
                 >
                    <Camera className="text-[#E4405F]" size={24} />
                    <div className="z-10">
                        <p className="text-[9px] sm:text-[10px] uppercase font-bold opacity-40">Instagram</p>
                        <p className="text-white font-bold text-sm sm:text-base">@edtxme</p>
                    </div>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#E4405F]/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                 </a>
              </div>
           </div>

           <div className="mt-12 sm:mt-20 pt-6 sm:pt-10 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
              <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.4em] opacity-30 text-center sm:text-left">
                © 2026 EDTXME. ALL RIGHTS RESERVED.
              </div>
              <div className="flex gap-6 sm:gap-8 text-[10px] font-bold uppercase tracking-widest opacity-40">
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Terms</a>
              </div>
           </div>
        </div>

      </div>

      {/* Background Polish */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-radial-gradient from-[#d4a373]/5 to-transparent pointer-events-none opacity-30" />
    </section>
  );
};

export default ContactSection;
