import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

const Navbar = () => {
  const navRef = useRef(null);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 50) {
        if (currentScrollY > lastScrollY) {
          // Scrolling down
          gsap.to(navRef.current, { y: '-100%', duration: 0.3, ease: 'power2.out' });
        } else {
          // Scrolling up
          gsap.to(navRef.current, { y: '0%', duration: 0.3, ease: 'power2.out', backgroundColor: 'rgba(5, 5, 5, 0.8)', backdropFilter: 'blur(10px)' });
        }
      } else {
        // Top of page
        gsap.to(navRef.current, { y: '0%', duration: 0.3, ease: 'power2.out', backgroundColor: 'transparent', backdropFilter: 'none' });
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav ref={navRef} className="fixed top-0 left-0 w-full z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <Link to="/" className="text-2xl font-display font-bold tracking-widest text-primary hover:text-white/80 transition-colors">
          EDTXME
        </Link>
        <div className="hidden md:flex space-x-8 text-sm uppercase tracking-widest font-sans">
          <a href="#work" className="hover:text-white/70 transition-colors relative group">
            Work
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a href="#about" className="hover:text-white/70 transition-colors relative group">
            About
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a href="#contact" className="hover:text-white/70 transition-colors relative group">
            Contact
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
