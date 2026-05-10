import React, { useEffect } from 'react';
import Lenis from 'lenis';
import HeroSection from './sections/HeroSection';
import MarqueeSection from './sections/MarqueeSection';
import AboutSection from './sections/AboutSection';
import ServicesSection from './sections/ServicesSection';
import ProjectsSection from './sections/ProjectsSection';
import ReelsSection from './sections/ReelsSection';
import SkillsSection from './sections/SkillsSection';
import TestimonialsSection from './sections/TestimonialsSection';
import TimelineSection from './sections/TimelineSection';
import ContactSection from './sections/ContactSection';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

import Cursor from './components/Cursor';
import BackgroundEffects from './components/BackgroundEffects';

function LandingPage() {
  return (
    <main className="w-full bg-[#0C0C0C] font-sans text-[#D7E2EA] overflow-x-clip flex flex-col relative">
      <BackgroundEffects />
      <Cursor />
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <SkillsSection />
      <ServicesSection />
      <ProjectsSection />
      <ReelsSection />
      <TestimonialsSection />
      <TimelineSection />
      <ContactSection />
      {/* Admin Login Section directly on Home Page */}
      <div className="py-20 border-t border-white/10">
        <h2 className="text-center text-[#D7E2EA]/30 uppercase tracking-[0.3em] text-sm mb-10">Admin Access</h2>
        <AdminLogin />
      </div>
    </main>
  );
}

function App() {
  useEffect(() => {
    document.title = "EDTXME -- Video Editor";
    
    // Initialize smooth scrolling with Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
