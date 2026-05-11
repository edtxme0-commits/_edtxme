import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import API_URL from '../apiConfig';
import { getImageUrl } from '../utils/imageHelper';

const MarqueeSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);
  const [imageList, setImageList] = useState<string[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/videos`);
        const videos = res.data;
        
        // Extract all thumbnails from all videos
        const allImages: string[] = [];
        videos.forEach((v: any) => {
          if (v.col1_1) allImages.push(v.col1_1);
          if (v.col1_2) allImages.push(v.col1_2);
          if (v.col2) allImages.push(v.col2);
        });

        // If no images uploaded yet, use some placeholders or keep empty
        if (allImages.length > 0) {
          setImageList(allImages);
        } else {
          // Fallback to some default cinematic images if portfolio is empty
          setImageList([
            "https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif",
            "https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif",
            "https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif"
          ]);
        }
      } catch (e) {
        console.error("Failed to fetch videos for marquee");
      }
    };
    fetchVideos();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const { top } = sectionRef.current.getBoundingClientRect();
      const calculatedOffset = (window.scrollY - (top + window.scrollY) + window.innerHeight) * 0.3;
      setOffset(calculatedOffset);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Split images into two rows and repeat them to ensure smooth infinite scroll appearance
  const mid = Math.ceil(imageList.length / 2);
  const row1Images = [...imageList.slice(0, mid), ...imageList.slice(0, mid), ...imageList.slice(0, mid), ...imageList.slice(0, mid)];
  const row2Images = [...imageList.slice(mid), ...imageList.slice(mid), ...imageList.slice(mid), ...imageList.slice(mid)];

  return (
    <section ref={sectionRef} className="bg-[#0C0C0C] pt-16 sm:pt-32 md:pt-40 pb-6 sm:pb-10 overflow-hidden w-full flex flex-col gap-2 sm:gap-4">
      {/* Row 1 (Moves Right) */}
      <div 
        className="flex gap-4 whitespace-nowrap will-change-transform"
        style={{ transform: `translate3d(${offset - 400}px, 0, 0)` }}
      >
        {row1Images.map((src, i) => (
          <img 
            key={`r1-${i}`} 
            src={getImageUrl(src)} 
            loading="lazy"
            className="w-[200px] sm:w-[400px] md:w-[480px] h-[130px] sm:h-[260px] md:h-[320px] rounded-[14px] sm:rounded-[24px] object-cover shrink-0 grayscale hover:grayscale-0 transition-all duration-700" 
            alt="Portfolio Work" 
          />
        ))}
      </div>

      {/* Row 2 (Moves Left) */}
      <div 
        className="flex gap-4 whitespace-nowrap will-change-transform"
        style={{ transform: `translate3d(${-(offset - 400)}px, 0, 0)` }}
      >
        {row2Images.map((src, i) => (
          <img 
            key={`r2-${i}`} 
            src={getImageUrl(src)} 
            loading="lazy"
            className="w-[200px] sm:w-[400px] md:w-[480px] h-[130px] sm:h-[260px] md:h-[320px] rounded-[14px] sm:rounded-[24px] object-cover shrink-0 grayscale hover:grayscale-0 transition-all duration-700" 
            alt="Portfolio Work" 
          />
        ))}
      </div>
    </section>
  );
};

export default MarqueeSection;
