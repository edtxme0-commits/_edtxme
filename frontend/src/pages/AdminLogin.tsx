import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import axios from 'axios';
import API_URL from '../apiConfig';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Draggable);
}

const AdminLogin = () => {
  const [isOn, setIsOn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const cordBeadRef = useRef(null);
  const cordLineRef = useRef(null);
  const hitAreaRef = useRef(null);
  const bodyRef = useRef(null);

  useEffect(() => {
    // Persistent session check: only redirect if we are specifically on the /admin page
    const token = localStorage.getItem('adminToken');
    if (token && location.pathname === '/admin') navigate('/admin/dashboard');

    const clickSound = new Audio("https://assets.codepen.io/605876/click.mp3");
    const draggable = Draggable.create(hitAreaRef.current, {
      type: "y",
      bounds: { minY: 0, maxY: 60 },
      onDrag: function() {
        gsap.set(cordBeadRef.current, { y: this.y });
        gsap.set(cordLineRef.current, { attr: { y2: 180 + this.y } });
      },
      onRelease: function() {
        if (this.y > 30) {
          setIsOn(prev => !prev);
          clickSound.play().catch(() => {});
        }
        gsap.to([cordBeadRef.current, hitAreaRef.current], { y: 0, duration: 0.5, ease: "back.out(2.5)" });
        gsap.to(cordLineRef.current, { attr: { y2: 180 }, duration: 0.5, ease: "back.out(2.5)" });
      }
    });

    return () => {
      if (draggable[0]) draggable[0].kill();
    };
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, { username, password });
      localStorage.setItem('adminToken', res.data.token);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div 
      ref={bodyRef}
      className={`min-h-[600px] grid place-items-center m-0 overflow-hidden font-sans transition-colors duration-500 relative ${isOn ? 'bg-[#1c1f24]' : 'bg-[#121417]'}`}
      style={{
        '--lamp-shade': '#f5f0e6',
        '--lamp-base': '#d1ccc2',
        '--accent-color': '#d4a373',
      } as any}
    >
      {/* Background Glow */}
      <div 
        className="absolute w-full h-full pointer-events-none transition-opacity duration-500"
        style={{
          background: 'radial-gradient(circle at 50% 40%, rgba(255, 214, 110, 0.3), transparent 70%)',
          opacity: isOn ? 1 : 0
        }}
      />

      <div className="flex items-center justify-center gap-12 z-10 flex-wrap w-full max-w-[1000px]">
        
        {/* Cute Lamp */}
        <div className="relative w-[280px] h-[400px] flex justify-center">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg">
            <ellipse 
              className="transition-opacity duration-500" 
              cx="100" cy="110" rx="60" ry="30" 
              fill="#ffdb8a" 
              style={{ opacity: isOn ? 0.6 : 0, filter: 'blur(15px)' }} 
            />
            
            <rect fill="var(--lamp-base)" x="92" y="100" width="16" height="160" rx="8" />
            <rect fill="var(--lamp-base)" x="60" y="250" width="80" height="12" rx="6" />

            <g>
              <line ref={cordLineRef} stroke="#555" strokeWidth="2" x1="130" y1="110" x2="130" y2="180" />
              <circle ref={cordBeadRef} fill="var(--accent-color)" cx="130" cy="190" r="6" />
              <circle ref={hitAreaRef} className="cursor-pointer" cx="130" cy="190" r="25" fill="transparent" />
            </g>

            {/* Mushroom Shade */}
            <path 
              className="transition-all duration-500" 
              fill={isOn ? "#fff" : "var(--lamp-shade)"} 
              style={{ filter: isOn ? 'drop-shadow(0 0 30px rgba(255, 255, 200, 0.4))' : 'none' }}
              d="M30 110 C 30 50, 170 50, 170 110 C 170 125, 30 125, 30 110 Z" 
            />
          </svg>
        </div>

        {/* Login Form */}
        <div 
          className="bg-white/5 backdrop-blur-xl p-10 rounded-[30px] w-[340px] border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-all duration-700 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]"
          style={{
            opacity: isOn ? 1 : 0,
            transform: isOn ? 'translateY(0)' : 'translateY(30px)',
            pointerEvents: isOn ? 'all' : 'none'
          }}
        >
          <h2 className="text-white text-center text-2xl font-medium mb-6">Welcome</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-5">
              <label className="block text-[#999] text-[0.85rem] mb-2 ml-1">Username</label>
              <input 
                type="text" 
                placeholder="edtxme" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3.5 bg-white/10 border border-transparent rounded-[15px] text-white outline-none transition-colors duration-300 focus:border-[#d4a373] focus:bg-white/20 text-base"
              />
            </div>
            <div className="mb-5 relative">
              <label className="block text-[#999] text-[0.85rem] mb-2 ml-1">Password</label>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3.5 bg-white/10 border border-transparent rounded-[15px] text-white outline-none transition-colors duration-300 focus:border-[#d4a373] focus:bg-white/20 text-base"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[42px] text-white/30 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error && <p className="text-red-400 text-sm mb-3 text-center">{error}</p>}
            <button 
              type="submit"
              className="w-full p-4 mt-2 border-none rounded-[15px] font-semibold text-[#121417] cursor-pointer transition-transform duration-300 hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #bf953f, #fcf6ba, #b38728, #fcf6ba, #aa771c)' }}
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
