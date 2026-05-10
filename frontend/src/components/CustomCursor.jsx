import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      if (cursorRef.current) cursorRef.current.style.display = 'none';
      if (followerRef.current) followerRef.current.style.display = 'none';
      return;
    }

    const cursor = cursorRef.current;
    const follower = followerRef.current;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let followerX = 0;
    let followerY = 0;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('mousemove', onMouseMove);

    const render = () => {
      // Cursor interpolation
      cursorX += (mouseX - cursorX) * 0.5;
      cursorY += (mouseY - cursorY) * 0.5;
      
      // Follower interpolation (slower)
      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;

      gsap.set(cursor, { x: cursorX, y: cursorY });
      gsap.set(follower, { x: followerX, y: followerY });

      requestAnimationFrame(render);
    };

    requestAnimationFrame(render);

    // Hover interactions
    const addHoverEvents = () => {
      const interactiveElements = document.querySelectorAll('a, button, .hover-target');
      interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', () => {
          gsap.to(cursor, { scale: 0.5, duration: 0.3 });
          gsap.to(follower, { scale: 2, backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'transparent', duration: 0.3 });
        });
        el.addEventListener('mouseleave', () => {
          gsap.to(cursor, { scale: 1, duration: 0.3 });
          gsap.to(follower, { scale: 1, backgroundColor: 'transparent', borderColor: 'rgba(255,255,255,0.3)', duration: 0.3 });
        });
      });
    };

    // Need a mutation observer in React as elements change
    const observer = new MutationObserver(() => {
      addHoverEvents();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    
    addHoverEvents();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div 
        ref={cursorRef} 
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference transform -translate-x-1/2 -translate-y-1/2"
      ></div>
      <div 
        ref={followerRef} 
        className="fixed top-0 left-0 w-10 h-10 border border-white/30 rounded-full pointer-events-none z-[9998] transition-colors duration-300 transform -translate-x-1/2 -translate-y-1/2"
      ></div>
    </>
  );
};

export default CustomCursor;
