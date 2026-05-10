import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

const LoadingScreen = ({ onComplete }) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const progressRef = useRef(null);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        if (onComplete) onComplete();
      }
    });

    // Animate percentage
    const obj = { val: 0 };
    gsap.to(obj, {
        val: 100,
        duration: 3.5,
        ease: "power3.inOut",
        onUpdate: () => setPercent(Math.floor(obj.val))
    });

    tl.to(textRef.current, {
      opacity: 1,
      y: 0,
      duration: 1.5,
      ease: 'power4.out',
      delay: 0.5
    })
    .to(progressRef.current, {
        width: '100%',
        duration: 3,
        ease: 'power3.inOut'
    }, "-=1.5")
    .to(containerRef.current, {
      yPercent: -100,
      duration: 1.5,
      ease: 'power4.inOut',
      delay: 0.2
    });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[10000] bg-[#0C0C0C] flex flex-col items-center justify-center pointer-events-none"
    >
      <div className="flex flex-col items-center gap-8 relative overflow-hidden">
        <h1 
            ref={textRef}
            className="text-[clamp(2.5rem,10vw,120px)] font-black tracking-tighter text-white opacity-0 translate-y-20 flex gap-2"
        >
            {"EDTXME".split("").map((char, i) => (
                <span key={i} className="inline-block">{char}</span>
            ))}
        </h1>
        
        <div className="flex flex-col items-center gap-4 w-64">
            <div className="w-full h-[1px] bg-white/10 relative overflow-hidden">
                <div ref={progressRef} className="absolute left-0 top-0 h-full w-0 bg-[#d4a373]" />
            </div>
            <div className="flex justify-between w-full">
                <span className="text-[10px] uppercase tracking-[0.4em] opacity-30">Loading</span>
                <span className="text-[10px] font-black text-[#d4a373]">{percent}%</span>
            </div>
        </div>
      </div>
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] bg-[#d4a373]/5 blur-[150px] rounded-full" />
    </div>
  );
};

export default LoadingScreen;
