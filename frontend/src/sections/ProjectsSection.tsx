import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import API_URL from '../apiConfig';
import LiveProjectButton from '../components/LiveProjectButton';

const HoverVideo = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <video 
      ref={videoRef}
      src={src} 
      className="w-full h-full object-cover"
      autoPlay
      muted 
      loop 
      playsInline
    />
  );
};

const ProjectCard = ({ project, index, progress, range, targetScale }: any) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const scale = useTransform(progress, range, [1, targetScale]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    axios.post(`${API_URL}/api/videos/${project.id}/view`).catch(() => {});
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div ref={containerRef} className="h-[70vh] sm:h-[80vh] md:h-[90vh] flex items-center justify-center sticky top-16 sm:top-20 md:top-28" style={{ zIndex: index }}>
      <motion.div 
        style={{ scale, top: `calc(5vh + ${index * 25}px)` }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`w-full max-w-7xl mx-auto rounded-[24px] sm:rounded-[40px] md:rounded-[60px] border-2 ${project.isFeatured ? 'border-[#d4a373]' : 'border-white/10'} bg-[#0C0C0C] p-3 sm:p-4 md:p-8 flex flex-col gap-3 sm:gap-6 relative origin-top shadow-2xl transition-colors duration-500 overflow-hidden group`}
      >
        {/* Cinematic Glow on Hover */}
        <div className={`absolute inset-0 bg-[#d4a373]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />
        
        {/* Top Info */}
        <div className="flex justify-between items-center z-10">
          <div className="flex items-center gap-3 sm:gap-4 md:gap-8 min-w-0">
            <span className={`font-black text-[clamp(1.8rem,8vw,120px)] leading-none transition-colors shrink-0 ${isHovered ? 'text-[#d4a373]' : 'text-[#D7E2EA]'}`}>{project.num}</span>
            <div className="flex flex-col min-w-0">
              <span className="text-[#D7E2EA]/40 uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[8px] sm:text-[10px] md:text-xs mb-0.5 sm:mb-1">{project.category}</span>
              <h3 className="text-[#D7E2EA] font-medium uppercase text-[clamp(0.85rem,2.5vw,2.2rem)] tracking-tight truncate">{project.name}</h3>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
             {project.isFeatured && <span className="hidden md:block bg-[#d4a373] text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">Featured Work</span>}
             <LiveProjectButton />
          </div>
        </div>

        {/* Dynamic Media Grid */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 flex-1 min-h-0 relative z-10">
          {/* On mobile: hide the side column to save space, show only main image */}
          <div className="hidden sm:flex flex-col gap-2 sm:gap-4 w-full sm:w-[35%]">
            <div className="overflow-hidden rounded-[16px] sm:rounded-[30px] md:rounded-[40px] flex-1 bg-white/5 relative">
                <img src={project.col1_1?.replace(/https:\/\/drive\.google\.com\/uc\?(?:export=(?:view|download)&)?id=([^&]+).*/, 'https://lh3.googleusercontent.com/d/$1')} alt="" className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`} />
            </div>
            <div className="overflow-hidden rounded-[16px] sm:rounded-[30px] md:rounded-[40px] flex-[1.5] bg-white/5">
                <img src={project.col1_2?.replace(/https:\/\/drive\.google\.com\/uc\?(?:export=(?:view|download)&)?id=([^&]+).*/, 'https://lh3.googleusercontent.com/d/$1')} alt="" className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`} />
            </div>
          </div>
          
          <div className="w-full sm:w-[65%] rounded-[16px] sm:rounded-[30px] md:rounded-[40px] overflow-hidden bg-white/5 relative group/media flex-1">
            {/* Netflix Style Video Overlay */}
            <AnimatePresence>
               {isHovered && project.streamUrl && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-20 bg-black"
                  >
                    <HoverVideo src={project.streamUrl?.replace('export=view', 'export=download')} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  </motion.div>
               )}
            </AnimatePresence>
            
            <img 
              src={project.col2?.replace(/https:\/\/drive\.google\.com\/uc\?(?:export=(?:view|download)&)?id=([^&]+).*/, 'https://lh3.googleusercontent.com/d/$1')} 
              alt="" 
              className={`w-full h-full object-cover transition-all duration-1000 ${isHovered ? 'scale-110 blur-sm' : 'scale-100'}`} 
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const ProjectsSection = () => {
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const containerRef = useRef(null);
  
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/videos`);
        if (res.data && Array.isArray(res.data)) {
          const mapped = res.data.map((v: any, idx: number) => ({
            id: v._id,
            num: String(idx + 1).padStart(2, '0'),
            category: v.category || 'Portfolio',
            name: v.title,
            col1_1: v.col1_1,
            col1_2: v.col1_2,
            col2: v.col2,
            streamUrl: v.streamUrl,
            isFeatured: v.isFeatured,
            createdAt: v.createdAt
          }));
          setAllProjects(mapped);
        }
      } catch (error) {}
    };
    fetchVideos();
  }, []);

  useEffect(() => {
    let result = [...allProjects];
    
    // Search
    if (search) {
        result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }
    
    // Category
    if (filter !== 'all') {
        result = result.filter(p => p.category.toLowerCase() === filter.toLowerCase());
    }
    
    // Sort
    if (sortBy === 'newest') result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    else if (sortBy === 'oldest') result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    else if (sortBy === 'featured') result.sort((a, b) => (b.isFeatured === a.isFeatured) ? 0 : b.isFeatured ? 1 : -1);

    setFilteredProjects(result);
  }, [allProjects, filter, search, sortBy]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  const categories = ['all', ...Array.from(new Set(allProjects.map(p => p.category.toLowerCase())))];

  return (
    <section id="projects" ref={containerRef} className="bg-[#0C0C0C] rounded-t-[30px] sm:rounded-t-[60px] -mt-14 z-10 relative px-4 sm:px-6 md:px-10 py-16 sm:py-32 pb-32 sm:pb-60 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6 sm:gap-10 mb-12 sm:mb-20">
          <div className="flex flex-col gap-2 sm:gap-4">
            <h2 className="hero-heading font-black uppercase text-[clamp(2.5rem,12vw,160px)] leading-[0.8]">
              Portfolio
            </h2>
            <p className="text-[10px] uppercase tracking-[0.4em] opacity-40 ml-1 sm:ml-2">Crafting Visual Masterpieces</p>
          </div>
          
          {/* Mobile: Toggle filters button */}
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-[#D7E2EA]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M8 12h8M11 18h2"/></svg>
            {showFilters ? 'Hide Filters' : 'Filters'}
          </button>

          {/* Advanced Filtering UI - always visible on md+, toggle on mobile */}
          <div className={`${showFilters ? 'flex' : 'hidden'} md:flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-stretch sm:items-center justify-end w-full md:w-auto`}>
             <input 
                type="text" 
                placeholder="Search projects..." 
                value={search} 
                onChange={e => setSearch(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-full px-5 sm:px-6 py-2.5 text-xs text-white outline-none focus:border-[#d4a373] w-full sm:w-auto md:w-64 transition-all"
             />
             <select 
                value={sortBy} 
                onChange={e => setSortBy(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-full px-5 sm:px-6 py-2.5 text-xs text-[#D7E2EA] outline-none cursor-pointer hover:bg-white/10 transition-all appearance-none"
             >
                <option value="newest" className="bg-[#0C0C0C]">Newest First</option>
                <option value="oldest" className="bg-[#0C0C0C]">Oldest First</option>
                <option value="featured" className="bg-[#0C0C0C]">Featured First</option>
             </select>
             <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 -mx-1 px-1">
                {categories.map(cat => (
                    <button 
                        key={cat} 
                        onClick={() => setFilter(cat)}
                        className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${filter === cat ? 'bg-[#d4a373] text-black' : 'bg-white/5 text-[#D7E2EA] hover:bg-white/10'}`}
                    >
                        {cat}
                    </button>
                ))}
             </div>
          </div>
      </div>
      
      <div className="relative">
        <AnimatePresence mode="popLayout">
            {filteredProjects.length > 0 ? (
                filteredProjects.map((project, i) => {
                    const targetScale = 1 - ((filteredProjects.length - 1 - i) * 0.03);
                    const range = [i * (1 / filteredProjects.length), 1];
                    
                    return (
                        <ProjectCard 
                            key={project.id} 
                            index={i} 
                            project={project} 
                            progress={scrollYProgress} 
                            range={range} 
                            targetScale={targetScale} 
                        />
                    );
                })
            ) : (
                <div className="h-[40vh] flex items-center justify-center opacity-20 uppercase tracking-[0.5em] sm:tracking-[1em] text-xs sm:text-sm">
                    No matching projects
                </div>
            )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ProjectsSection;
