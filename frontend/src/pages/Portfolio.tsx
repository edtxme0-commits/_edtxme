import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../apiConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getImageUrl, getVideoUrl } from '../utils/imageHelper';

const Portfolio = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<any>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProjects = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/videos`);
        setProjects(res.data);
      } catch (err) {
        console.error("Failed to load portfolio", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-[#D7E2EA] font-sans selection:bg-[#d4a373] selection:text-black">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/50 backdrop-blur-xl border-b border-white/10 p-4 sm:px-8 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 hover:text-[#d4a373] transition-colors group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold uppercase tracking-widest text-xs">Back to Home</span>
        </Link>
        <h1 className="font-black uppercase tracking-[0.2em] text-lg text-white">EDTXME<span className="text-[#d4a373]">.</span></h1>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-8 py-12 sm:py-20 max-w-[1600px] mx-auto">
        <div className="mb-12 sm:mb-20 text-center">
          <h2 className="hero-heading font-black uppercase text-[clamp(2.5rem,8vw,100px)] leading-[0.9] mb-4">
            Full <span className="text-[#d4a373]">Portfolio</span>
          </h2>
          <p className="text-sm sm:text-base uppercase tracking-[0.3em] opacity-50">Explore every aspect of visual storytelling</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-2 border-white/20 border-t-[#d4a373] rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
            {projects.map((project, i) => (
              <motion.div 
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="break-inside-avoid relative group rounded-2xl overflow-hidden bg-white/5 border border-white/5 cursor-pointer"
                onClick={() => project.streamUrl && setActiveVideo(project)}
              >
                {/* Image takes natural aspect ratio */}
                <img 
                  src={getImageUrl(project.col2)} 
                  alt={project.title} 
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700" 
                  loading="lazy"
                />
                
                {/* Overlay Metadata */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <p className="text-[#d4a373] font-bold tracking-[0.2em] uppercase text-[10px] mb-1">{project.category}</p>
                  <h3 className="text-white font-bold uppercase text-lg leading-tight">{project.title}</h3>
                  {project.streamUrl && (
                    <div className="mt-4 w-10 h-10 rounded-full bg-[#d4a373] text-black flex items-center justify-center translate-y-4 group-hover:translate-y-0 transition-transform">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Fullscreen Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
          >
            <div className="w-full h-full relative flex items-center justify-center flex-col">
               <button 
                  onClick={() => setActiveVideo(null)}
                  className="absolute top-4 right-4 z-50 w-12 h-12 bg-white/10 hover:bg-[#d4a373] text-white hover:text-black rounded-full flex items-center justify-center backdrop-blur-md transition-colors"
               >
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
               </button>
               
               <video 
                  src={getVideoUrl(activeVideo.streamUrl)}
                  className="w-full h-full max-h-[85vh] object-contain outline-none rounded-xl"
                  controls
                  autoPlay
                  playsInline
               />
               
               <div className="mt-6 text-center">
                  <p className="text-[#d4a373] font-bold tracking-[0.3em] uppercase text-[10px] mb-2">{activeVideo.category}</p>
                  <h2 className="text-white font-black uppercase text-2xl">{activeVideo.title}</h2>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Portfolio;
