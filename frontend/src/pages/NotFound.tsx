import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0C0C0C] flex flex-col items-center justify-center px-6 text-center font-sans">
      <div className="max-w-4xl w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-[400px] w-full flex items-center justify-center bg-center bg-no-repeat rounded-[40px] overflow-hidden border border-white/5 shadow-2xl"
          style={{ 
            backgroundImage: 'url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)',
            backgroundSize: 'contain'
          }}
        >
          <h1 className="text-[clamp(5rem,15vw,180px)] font-black text-black/90 mix-blend-difference select-none hero-heading">404</h1>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-[-50px] relative z-10 space-y-6"
        >
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[#D7E2EA]">
            Look like you&apos;re lost
          </h2>
          <p className="text-sm md:text-lg opacity-40 uppercase tracking-[0.3em]">
            The page you are looking for is not available!
          </p>
          
          <button 
            onClick={() => navigate('/')}
            className="inline-block mt-10 px-10 py-4 bg-[#d4a373] text-black font-black uppercase text-xs rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_10px_30px_rgba(212,163,115,0.3)]"
          >
            Go to Home
          </button>
        </motion.div>
      </div>

      {/* Decorative ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-radial-gradient from-[#d4a373]/5 to-transparent pointer-events-none opacity-50" />
    </div>
  );
};

export default NotFound;
