import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import gsap from 'gsap';

const Cursor = () => {
  const [cursorState, setCursorState] = useState('default');
  const [cursorText, setCursorText] = useState('');

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for the outer circle (follower)
  const springConfig = { damping: 30, stiffness: 200, mass: 0.5 };
  const followerX = useSpring(mouseX, springConfig);
  const followerY = useSpring(mouseY, springConfig);

  // Faster spring for the inner dot
  const dotX = useSpring(mouseX, { damping: 40, stiffness: 400 });
  const dotY = useSpring(mouseY, { damping: 40, stiffness: 400 });

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleHover = () => {
      const hovers = document.querySelectorAll('[data-cursor]');
      hovers.forEach(el => {
        el.addEventListener('mouseenter', () => {
          const type = el.getAttribute('data-cursor') || 'hover';
          const text = el.getAttribute('data-cursor-text') || '';
          setCursorState(type);
          setCursorText(text);
        });
        el.addEventListener('mouseleave', () => {
          setCursorState('default');
          setCursorText('');
        });
      });
      
      // Default interactive elements
      const interactives = document.querySelectorAll('a, button');
      interactives.forEach(el => {
        el.addEventListener('mouseenter', () => setCursorState('hover'));
        el.addEventListener('mouseleave', () => setCursorState('default'));
      });
    };

    window.addEventListener('mousemove', moveCursor);
    handleHover();

    const observer = new MutationObserver(handleHover);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      observer.disconnect();
    };
  }, []);

  const variants = {
    default: {
      width: 40,
      height: 40,
      backgroundColor: 'transparent',
      border: '1px solid rgba(215, 226, 234, 0.3)',
      scale: 1
    },
    hover: {
      width: 80,
      height: 80,
      backgroundColor: 'rgba(212, 163, 115, 0.1)',
      border: '1px solid rgba(212, 163, 115, 0.5)',
      scale: 1.2
    },
    view: {
      width: 100,
      height: 100,
      backgroundColor: '#d4a373',
      border: 'none',
      scale: 1
    },
    drag: {
      width: 80,
      height: 80,
      backgroundColor: '#D7E2EA',
      border: 'none',
      scale: 1
    }
  };

  return (
    <>
      {/* Outer Circle (Follower) */}
      <motion.div
        style={{
          left: followerX,
          top: followerY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className="fixed pointer-events-none z-[9999] rounded-full flex items-center justify-center text-black font-black text-[10px] uppercase tracking-widest"
        animate={variants[cursorState as keyof typeof variants] || variants.default}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      >
        {cursorText && (
          <motion.span 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="whitespace-nowrap z-10"
          >
            {cursorText}
          </motion.span>
        )}
      </motion.div>

      {/* Inner Dot */}
      <motion.div
        style={{
          left: dotX,
          top: dotY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className={`fixed pointer-events-none z-[10000] w-1.5 h-1.5 rounded-full ${cursorState === 'default' ? 'bg-white' : 'bg-transparent'} mix-blend-difference`}
        animate={{
          scale: cursorState === 'default' ? 1 : 0
        }}
      />
    </>
  );
};

export default Cursor;
