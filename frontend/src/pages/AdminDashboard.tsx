import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../apiConfig';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('portfolio');
  const [videos, setVideos] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    totalViews: 0,
    totalProjects: 0,
    mostViewed: 'N/A'
  });

  const [siteContent, setSiteContent] = useState({
    aboutHeading: 'About me',
    aboutDescription: 'With a passion for storytelling and cinematic motion, i focus on high-end video editing...',
    aboutImage1: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png',
    aboutImage2: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png',
    founder1Name: 'Shubham',
    founder1Image: 'https://via.placeholder.com/150',
    founder2Name: 'Saurabh',
    founder2Image: 'https://via.placeholder.com/150',
    managerName: 'Nitin',
    managerRole: 'Manager',
    managerImage: 'https://via.placeholder.com/150'
  });

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    videoFile: null as File | null,
    col1_1: '',
    col1_2: '',
    col2: '',
    isFeatured: false
  });
  const [autoThumbnails, setAutoThumbnails] = useState<File[]>([]);
  const [generatingThumbs, setGeneratingThumbs] = useState(false);

  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [testimonyData, setTestimonyData] = useState({ name: '', role: '', text: '', image: '' });

  const [team, setTeam] = useState<any[]>([]);
  const [teamData, setTeamData] = useState({ name: '', role: '', image: '', isFounder: false });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) navigate('/admin');
    fetchVideos();
    fetchConfig();
    fetchTestimonials();
    fetchTeam();
  }, [navigate]);

  const fetchTeam = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/team`);
      setTeam(res.data);
    } catch (error) {}
  };

  const handleTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      let imageUrl = teamData.image as any;
      if (imageUrl instanceof File) {
        imageUrl = await handleImageUpload(imageUrl) || '';
      }
      await axios.post(`${API_URL}/api/team`, { ...teamData, image: imageUrl }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
      fetchTeam();
      setTeamData({ name: '', role: '', image: '', isFounder: false });
      alert('Team member added!');
    } catch (error) {
      alert('Failed to add member.');
    }
    setUploading(false);
  };

  const deleteTeamMember = async (id: string) => {
    if (window.confirm('Remove this member?')) {
      try {
        await axios.delete(`${API_URL}/api/team/${id}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
        });
        fetchTeam();
      } catch (error) {
        alert('Delete failed.');
      }
    }
  };

  const fetchTestimonials = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/testimonials`);
      setTestimonials(res.data);
    } catch (error) {}
  };

  const handleTestimonySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      let imageUrl = testimonyData.image as any;
      if (imageUrl instanceof File) {
        imageUrl = await handleImageUpload(imageUrl) || '';
      }
      await axios.post(`${API_URL}/api/testimonials`, { ...testimonyData, image: imageUrl }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
      fetchTestimonials();
      setTestimonyData({ name: '', role: '', text: '', image: '' });
      alert('Testimonial added!');
    } catch (error) {
      alert('Failed to add testimonial.');
    }
    setUploading(false);
  };

  const deleteTestimony = async (id: string) => {
    if (window.confirm('Delete this testimonial?')) {
      try {
        await axios.delete(`${API_URL}/api/testimonials/${id}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
        });
        fetchTestimonials();
      } catch (error) {
        alert('Delete failed.');
      }
    }
  };

  const fetchConfig = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/config`);
      setSiteContent(prev => ({ ...prev, ...res.data }));
    } catch (error) {}
  };

  const saveConfig = async () => {
    setUploading(true);
    try {
      const updatedContent: any = { ...siteContent };
      for (const key of ['aboutImage1', 'aboutImage2', 'founder1Image', 'founder2Image', 'managerImage']) {
        if (updatedContent[key] instanceof File) {
          const url = await handleImageUpload(updatedContent[key]);
          if (url) updatedContent[key] = url;
        }
      }
      const updates = Object.entries(updatedContent).map(([key, value]) => 
        axios.post(`${API_URL}/api/config`, { key, value }, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
        })
      );
      await Promise.all(updates);
      setSiteContent(updatedContent as any);
      alert('Settings saved!');
    } catch (error) {
      alert('Save failed.');
    }
    setUploading(false);
  };

  const fetchVideos = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/videos`);
      setVideos(res.data);
      
      // Calculate Stats
      const totalViews = res.data.reduce((acc: number, curr: any) => acc + (curr.views || 0), 0);
      const mostViewed = res.data.length > 0 ? [...res.data].sort((a, b) => (b.views || 0) - (a.views || 0))[0].title : 'N/A';
      setStats({
        totalViews,
        totalProjects: res.data.length,
        mostViewed
      });
    } catch (error) {}
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  const handleImageUpload = async (file: File): Promise<string | null> => {
    const data = new FormData();
    data.append('image', file);
    try {
      const res = await axios.post(`${API_URL}/api/images/upload`, data, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      return res.data.url;
    } catch (error: any) {
      console.error(`Image Upload failed: ${error.response?.data?.message || error.message}`);
      return null;
    }
  };

  // Auto Thumbnail Generation Logic
  const generateThumbnail = (file: File, timeFraction: number): Promise<File> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;
      const url = URL.createObjectURL(file);
      video.src = url;
      
      video.onloadedmetadata = () => {
        video.currentTime = Math.max(0.1, video.duration * timeFraction || 0.1);
      };
      
      video.onseeked = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          URL.revokeObjectURL(url);
          if (blob) {
            resolve(new File([blob], `auto-thumb-${Date.now()}.jpg`, { type: 'image/jpeg' }));
          } else reject(new Error('Blob failed'));
        }, 'image/jpeg', 0.8);
      };
      video.onerror = (e) => {
        URL.revokeObjectURL(url);
        reject(e);
      };
    });
  };

  const handleVideoSelection = async (file: File) => {
    setFormData(prev => ({ ...prev, videoFile: file }));
    setGeneratingThumbs(true);
    try {
      // Generate 3 thumbnails at 10%, 40%, 70% of the video duration
      const t1 = await generateThumbnail(file, 0.1);
      const t2 = await generateThumbnail(file, 0.4);
      const t3 = await generateThumbnail(file, 0.7);
      setAutoThumbnails([t1, t2, t3]);
    } catch (e) {
      console.error("Thumbnail generation failed", e);
    }
    setGeneratingThumbs(false);
  };

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      await axios.patch(`${API_URL}/api/videos/${id}`, { isFeatured: !currentStatus }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
      fetchVideos();
    } catch (e) {
      alert('Failed to update featured status.');
    }
  };

  const ImageInput = ({ label, value, onChange }: any) => {
    const fileRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    
    // value can be a string (URL) or a File object.
    const isFile = value instanceof File;
    const previewUrl = isFile ? URL.createObjectURL(value) : value;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) {
        onChange(e.target.files[0]);
      }
    };

    const doUpload = async () => {
      if (!isFile) return;
      setIsUploading(true);
      const url = await handleImageUpload(value);
      setIsUploading(false);
      if (url) {
        onChange(url); // Set the form value to the final URL string
      }
    };

    return (
      <div className="space-y-2">
        <label className="block text-[9px] uppercase tracking-widest opacity-50 px-1">{label}</label>
        <div className="flex gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex gap-2">
              <input 
                 type="text" 
                 value={isFile ? value.name : value || ''} 
                 onChange={e => onChange(e.target.value)} 
                 className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-[10px] text-white outline-none" 
                 placeholder="URL or Select File" 
              />
              {!isFile ? (
                <button type="button" onClick={() => fileRef.current?.click()} className="px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] uppercase font-bold transition-all shrink-0">Select Image</button>
              ) : (
                <div className="flex gap-2 shrink-0">
                  <button type="button" onClick={() => fileRef.current?.click()} className="px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] uppercase font-bold transition-all">Change</button>
                  <button type="button" onClick={doUpload} disabled={isUploading} className="px-4 py-3 bg-green-500 text-black rounded-xl text-[10px] uppercase font-black transition-all hover:scale-[0.98]">
                    {isUploading ? 'Uploading...' : 'Upload Now'}
                  </button>
                </div>
              )}
            </div>
            <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={handleFileChange} />
          </div>
          {previewUrl && (
            <div className="w-16 h-16 rounded-xl border border-white/10 overflow-hidden bg-black shrink-0 relative">
                {isFile && !isUploading && <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-[8px] font-bold text-white uppercase text-center p-1 z-10 pointer-events-none">Not<br/>Uploaded</div>}
                {isUploading && <div className="absolute inset-0 bg-black/80 flex items-center justify-center text-[8px] font-bold text-white uppercase text-center p-1 z-10 pointer-events-none">Uploading...</div>}
                <img src={previewUrl} className={`w-full h-full object-cover ${(isFile || isUploading) ? 'opacity-50' : ''}`} />
            </div>
          )}
        </div>
      </div>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.videoFile) return alert('Select video');
    setUploading(true);

    let finalCol1_1: any = formData.col1_1;
    let finalCol1_2: any = formData.col1_2;
    let finalCol2: any = formData.col2;

    try {
      if (finalCol1_1 instanceof File) {
        finalCol1_1 = await handleImageUpload(finalCol1_1) || '';
      } else if (!finalCol1_1 && autoThumbnails[0]) {
        finalCol1_1 = await handleImageUpload(autoThumbnails[0]) || '';
      }
      
      if (finalCol1_2 instanceof File) {
        finalCol1_2 = await handleImageUpload(finalCol1_2) || '';
      } else if (!finalCol1_2 && autoThumbnails[1]) {
        finalCol1_2 = await handleImageUpload(autoThumbnails[1]) || '';
      }

      if (finalCol2 instanceof File) {
        finalCol2 = await handleImageUpload(finalCol2) || '';
      } else if (!finalCol2 && autoThumbnails[2]) {
        finalCol2 = await handleImageUpload(autoThumbnails[2]) || '';
      }
    } catch(err) {
      console.error("Error uploading thumbnails", err);
    }

    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => {
        if (k === 'videoFile') data.append('video', v as Blob);
        else if (k === 'col1_1') data.append(k, finalCol1_1);
        else if (k === 'col1_2') data.append(k, finalCol1_2);
        else if (k === 'col2') data.append(k, finalCol2);
        else data.append(k, String(v));
    });
    try {
      await axios.post(`${API_URL}/api/videos/upload`, data, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` },
        onUploadProgress: p => p.total && setProgress(Math.round((p.loaded * 100) / p.total))
      });
      setUploading(false);
      fetchVideos();
      setFormData({ title: '', category: '', videoFile: null, col1_1: '', col1_2: '', col2: '', isFeatured: false });
      setAutoThumbnails([]);
      alert('Project uploaded successfully!');
    } catch (error: any) {
      setUploading(false);
      alert(`Upload failed: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete?')) {
      await axios.delete(`${API_URL}/api/videos/${id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
      fetchVideos();
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setIsDragging(true);
    else if (e.type === "dragleave") setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      handleVideoSelection(e.dataTransfer.files[0]);
    }
  };

  const TabButton = ({ id, label }: any) => (
    <button onClick={() => setActiveTab(id)} className={`px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all border-b-2 ${activeTab === id ? 'border-[#d4a373] text-white' : 'border-transparent text-white/30 hover:text-white/60'}`}>
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-[#D7E2EA] font-sans pb-20">
      <header className="px-6 md:px-12 py-8 flex justify-between items-center border-b border-white/5">
        <div>
          <h1 className="text-xl font-black uppercase tracking-tighter hero-heading">EDTXME Admin</h1>
          <p className="text-[9px] uppercase tracking-widest opacity-30">Management Portal V3.0</p>
        </div>
        <div className="flex gap-6 items-center">
          <Link to="/" target="_blank" rel="noopener noreferrer" className="text-xs opacity-50 hover:opacity-100 transition-opacity">Preview Site</Link>
          <button onClick={handleLogout} className="px-6 py-2 bg-red-500/10 text-red-500 rounded-full text-[10px] uppercase font-bold">Logout</button>
        </div>
      </header>

      {/* Analytics Bar */}
      <div className="px-6 md:px-12 py-4 bg-white/5 flex gap-10 overflow-x-auto no-scrollbar border-b border-white/5">
         <div className="shrink-0"><p className="text-[8px] uppercase opacity-40">Total Views</p><p className="text-sm font-bold">{stats.totalViews.toLocaleString()}</p></div>
         <div className="shrink-0"><p className="text-[8px] uppercase opacity-40">Projects</p><p className="text-sm font-bold">{stats.totalProjects}</p></div>
         <div className="shrink-0"><p className="text-[8px] uppercase opacity-40">Top Performing</p><p className="text-sm font-bold text-[#d4a373]">{stats.mostViewed}</p></div>
      </div>

      <nav className="flex px-6 md:px-12 bg-white/5 border-b border-white/5 overflow-x-auto no-scrollbar sticky top-0 z-50">
        <TabButton id="portfolio" label="Portfolio" />
        <TabButton id="about" label="About & Team" />
        <TabButton id="social" label="Social Proof" />
      </nav>

      <main className="p-6 md:p-12 max-w-7xl mx-auto">
        {activeTab === 'portfolio' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <section className="lg:col-span-1 bg-white/5 border border-white/10 rounded-[30px] p-8">
              <h2 className="text-sm font-bold uppercase mb-6 opacity-40">Add New Video</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Project Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none" required />
                <input type="text" placeholder="Category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none" required />
                
                {/* Drag & Drop Area */}
                <div 
                  onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${isDragging ? 'border-[#d4a373] bg-[#d4a373]/10' : 'border-white/10 bg-black/20'} ${formData.videoFile ? 'border-green-500/50 bg-green-500/5' : ''}`}
                >
                  <p className="text-[10px] uppercase font-bold opacity-40 mb-2">{formData.videoFile ? 'Video Selected ✅' : 'Drag & Drop Video'}</p>
                  <input type="file" accept="video/*" onChange={e => e.target.files && handleVideoSelection(e.target.files[0])} className="hidden" id="video-upload" />
                  <label htmlFor="video-upload" className="text-[10px] text-[#d4a373] cursor-pointer hover:underline">{formData.videoFile ? formData.videoFile.name : 'Or click to browse'}</label>
                </div>

                <div className="flex flex-col gap-3 bg-black/20 p-4 rounded-xl border border-white/5">
                   <div className="flex items-center gap-3">
                      <input type="checkbox" checked={formData.isFeatured} onChange={e => setFormData({...formData, isFeatured: e.target.checked})} className="w-4 h-4 accent-[#d4a373]" />
                      <span className="text-[10px] uppercase font-bold opacity-60">Featured Project (Large Card)</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <input type="checkbox" checked={(formData as any).isReel} onChange={e => setFormData({...formData, isReel: e.target.checked})} className="w-4 h-4 accent-[#d4a373]" />
                      <span className="text-[10px] uppercase font-bold opacity-60">Vertical Reel (Social Style)</span>
                   </div>
                </div>

                <div className="pt-2">
                   <p className="text-[10px] uppercase font-bold opacity-40 mb-2 text-center text-[#d4a373]">
                     {generatingThumbs ? '⏳ Generating Auto-Thumbnails...' : autoThumbnails.length > 0 ? '✅ Auto-Thumbnails Ready' : ''}
                   </p>
                </div>

                <ImageInput label="Thumbnail 1 (Optional - Auto-generated if left blank)" value={formData.col1_1} onChange={(v:any) => setFormData({...formData, col1_1: v})} />
                <ImageInput label="Thumbnail 2 (Optional - Auto-generated if left blank)" value={formData.col1_2} onChange={(v:any) => setFormData({...formData, col1_2: v})} />
                <ImageInput label="Thumbnail 3 (Optional - Auto-generated if left blank)" value={formData.col2} onChange={(v:any) => setFormData({...formData, col2: v})} />
                
                {uploading && (
                  <div className="pt-4">
                    <div className="flex justify-between text-[10px] mb-2 uppercase font-bold text-[#d4a373]">
                       <span>Uploading to Drive...</span>
                       <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden"><div className="bg-[#d4a373] h-full transition-all" style={{width:`${progress}%`}}></div></div>
                  </div>
                )}
                
                <button type="submit" disabled={uploading} className="w-full py-4 bg-white text-black text-xs font-bold uppercase rounded-xl mt-4 hover:scale-[0.98] transition-transform">
                  {uploading ? 'Processing Assets...' : 'Post Project'}
                </button>
              </form>
            </section>

            <section className="lg:col-span-2 bg-white/5 border border-white/10 rounded-[30px] p-8">
              <h2 className="text-sm font-bold uppercase mb-6 opacity-40">Portfolio Database ({videos.length})</h2>
              <div className="grid gap-4">
                {videos.map((v, i) => (
                  <div key={v._id} className={`p-5 rounded-2xl flex justify-between items-center border ${v.isFeatured ? 'bg-[#d4a373]/5 border-[#d4a373]/30' : 'bg-black/20 border-white/5'}`}>
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <img src={v.col2} className="w-16 h-10 object-cover rounded-md opacity-40" />
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-black">{String(i+1).padStart(2,'0')}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                           <h3 className="text-sm font-bold uppercase">{v.title}</h3>
                           {v.isFeatured && <span className="bg-[#d4a373] text-black text-[7px] font-black px-1.5 py-0.5 rounded uppercase">Featured</span>}
                        </div>
                        <p className="text-[10px] uppercase opacity-30 mt-0.5">{v.category} • {v.views || 0} views</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button onClick={() => toggleFeatured(v._id, v.isFeatured)} className={`text-[10px] font-bold uppercase ${v.isFeatured ? 'text-white' : 'text-[#d4a373]'} hover:underline`}>{v.isFeatured ? 'Unfeature' : 'Feature'}</button>
                      <button onClick={() => handleDelete(v._id)} className="px-5 py-2 border border-red-500/20 text-red-500 text-[10px] uppercase font-bold rounded-full hover:bg-red-500 hover:text-white transition-all">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'about' && (
          <section className="bg-white/5 border border-white/10 rounded-[30px] p-10 space-y-10">
            <div className="flex justify-between items-center border-b border-white/5 pb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest opacity-30">About Section & Team</h2>
              <button onClick={saveConfig} className="px-8 py-3 bg-[#d4a373] text-black font-bold uppercase rounded-full text-xs">Save Settings</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] uppercase opacity-40 block">Heading</label>
                <input type="text" value={siteContent.aboutHeading} onChange={e => setSiteContent({...siteContent, aboutHeading: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-4 text-white outline-none" />
                <label className="text-[10px] uppercase opacity-40 block">Bio Description</label>
                <textarea rows={6} value={siteContent.aboutDescription} onChange={e => setSiteContent({...siteContent, aboutDescription: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-4 text-white outline-none resize-none" />
              </div>
              <div className="space-y-6">
                <p className="text-[10px] uppercase opacity-40">Decorative Icons</p>
                <div className="grid grid-cols-1 gap-4">
                  <ImageInput label="Icon 1" value={siteContent.aboutImage1} onChange={(v: any) => setSiteContent({...siteContent, aboutImage1: v})} />
                  <ImageInput label="Icon 2" value={siteContent.aboutImage2} onChange={(v: any) => setSiteContent({...siteContent, aboutImage2: v})} />
                </div>
              </div>
            </div>

            <div className="pt-10 border-t border-white/5">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-8 opacity-60">Team Management</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Add Member Form */}
                <div className="lg:col-span-1 bg-black/20 p-6 rounded-[24px] border border-white/5 space-y-4">
                  <p className="text-[10px] uppercase font-bold opacity-40">Add New Member</p>
                  <form onSubmit={handleTeamSubmit} className="space-y-4">
                    <input type="text" placeholder="Name" value={teamData.name} onChange={e => setTeamData({...teamData, name: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none" required />
                    <input type="text" placeholder="Role (e.g. Lead Editor)" value={teamData.role} onChange={e => setTeamData({...teamData, role: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none" required />
                    <div className="flex items-center gap-3 bg-black/20 p-3 rounded-xl border border-white/5">
                      <input type="checkbox" checked={teamData.isFounder} onChange={e => setTeamData({...teamData, isFounder: e.target.checked})} className="w-4 h-4 accent-[#d4a373]" />
                      <span className="text-[10px] uppercase font-bold opacity-60">Founder Status</span>
                    </div>
                    <ImageInput label="Photo" value={teamData.image} onChange={(v:any) => setTeamData({...teamData, image: v})} />
                    <button type="submit" className="w-full py-4 bg-[#d4a373] text-black text-xs font-bold uppercase rounded-xl hover:scale-[0.98] transition-transform">Add to Team</button>
                  </form>
                </div>

                {/* Team List */}
                <div className="lg:col-span-2 space-y-4">
                  <p className="text-[10px] uppercase font-bold opacity-40">Active Members ({team.length})</p>
                  <div className="grid gap-3">
                    {team.map(member => (
                      <div key={member._id} className="p-4 bg-black/20 border border-white/5 rounded-2xl flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <img src={member.image} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold uppercase text-xs">{member.name}</h4>
                              {member.isFounder && <span className="text-[7px] bg-[#d4a373]/20 text-[#d4a373] px-1.5 py-0.5 rounded font-black uppercase">Founder</span>}
                            </div>
                            <p className="text-[9px] uppercase opacity-40">{member.role}</p>
                          </div>
                        </div>
                        <button onClick={() => deleteTeamMember(member._id)} className="px-4 py-2 border border-red-500/20 text-red-500 text-[9px] uppercase font-bold rounded-full hover:bg-red-500 hover:text-white transition-all">Remove</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Legacy Fixed Slots (Optional - keep for backward compatibility or remove) */}
              <div className="mt-12 pt-12 border-t border-white/5">
                <h4 className="text-[10px] uppercase font-bold opacity-30 mb-8">Founders and Team</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/5 p-6 rounded-[24px] space-y-4 border border-white/5">
                    <p className="text-[8px] uppercase opacity-30">Management / Other</p>
                    <input type="text" value={siteContent.managerName} onChange={e => setSiteContent({...siteContent, managerName: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white font-bold outline-none text-xs" placeholder="Name" />
                    <input type="text" value={siteContent.managerRole} onChange={e => setSiteContent({...siteContent, managerRole: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-[#d4a373] font-bold outline-none text-[10px] uppercase tracking-widest" placeholder="Role (e.g. Manager)" />
                    <ImageInput label="Photo" value={siteContent.managerImage} onChange={(v: any) => setSiteContent({...siteContent, managerImage: v})} />
                  </div>
                  <div className="bg-white/5 p-6 rounded-[24px] space-y-4 border border-white/5 opacity-80">
                    <p className="text-[8px] uppercase opacity-30">Founder 1 (Fixed)</p>
                    <div className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-2 text-white/50 font-bold text-xs">{siteContent.founder1Name}</div>
                    <ImageInput label="Photo" value={siteContent.founder1Image} onChange={(v: any) => setSiteContent({...siteContent, founder1Image: v})} />
                  </div>
                  <div className="bg-white/5 p-6 rounded-[24px] space-y-4 border border-white/5 opacity-80">
                    <p className="text-[8px] uppercase opacity-30">Founder 2 (Fixed)</p>
                    <div className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-2 text-white/50 font-bold text-xs">{siteContent.founder2Name}</div>
                    <ImageInput label="Photo" value={siteContent.founder2Image} onChange={(v: any) => setSiteContent({...siteContent, founder2Image: v})} />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
        {activeTab === 'social' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <section className="lg:col-span-1 bg-white/5 border border-white/10 rounded-[30px] p-8 h-fit">
              <h2 className="text-sm font-bold uppercase mb-6 opacity-40">Add Social Proof</h2>
              <form onSubmit={handleTestimonySubmit} className="space-y-4">
                 <input type="text" placeholder="Client Name" value={testimonyData.name} onChange={e => setTestimonyData({...testimonyData, name: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none" required />
                 <input type="text" placeholder="Role (e.g. Content Creator)" value={testimonyData.role} onChange={e => setTestimonyData({...testimonyData, role: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none" required />
                 <textarea placeholder="Testimonial Text" value={testimonyData.text} onChange={e => setTestimonyData({...testimonyData, text: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none h-32 resize-none" required />
                 <ImageInput label="Client Photo" value={testimonyData.image} onChange={(v:any) => setTestimonyData({...testimonyData, image: v})} />
                 <button type="submit" className="w-full py-4 bg-[#d4a373] text-black text-xs font-bold uppercase rounded-xl mt-4 hover:scale-[0.98] transition-transform">Add Testimonial</button>
              </form>
            </section>

            <section className="lg:col-span-2 bg-white/5 border border-white/10 rounded-[30px] p-8">
               <h2 className="text-sm font-bold uppercase mb-6 opacity-40">Existing Reviews ({testimonials.length})</h2>
               <div className="grid gap-4">
                  {testimonials.map(t => (
                    <div key={t._id} className="p-6 bg-black/20 border border-white/5 rounded-2xl flex justify-between items-start gap-6">
                       <div className="flex gap-4">
                          <img src={t.image} className="w-12 h-12 rounded-full object-cover border border-[#d4a373]" />
                          <div>
                             <h4 className="font-bold uppercase text-sm">{t.name}</h4>
                             <p className="text-[10px] uppercase opacity-40 mb-3">{t.role}</p>
                             <p className="text-xs opacity-70 italic">&quot;{t.text}&quot;</p>
                          </div>
                       </div>
                       <button onClick={() => deleteTestimony(t._id)} className="px-4 py-2 border border-red-500/20 text-red-500 text-[10px] uppercase font-bold rounded-full hover:bg-red-500 hover:text-white transition-all">Delete</button>
                    </div>
                  ))}
               </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
