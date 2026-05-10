import React, { useEffect, useState } from 'react';

const BackgroundEffects = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Dynamic Mouse Reactive Glow */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-[0.07] transition-transform duration-300"
        style={{
          background: 'radial-gradient(circle, #d4a373 0%, transparent 70%)',
          left: mousePos.x - 300,
          top: mousePos.y - 300,
        }}
      />

      {/* Static Ambient Gradients */}
      <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-[#d4a373]/[0.03] blur-[150px]" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[50vw] h-[50vw] rounded-full bg-white/[0.02] blur-[150px]" />
      
      {/* Cinematic Noise Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://res.cloudinary.com/dvwf9p93v/image/upload/v1712912445/noise_p0zkvq.png')] bg-repeat" />
    </div>
  );
};

export default BackgroundEffects;
