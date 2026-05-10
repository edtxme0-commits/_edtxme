import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-background border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <div className="text-2xl font-display font-bold tracking-widest text-primary mb-4 md:mb-0">
          EDTXME
        </div>
        <div className="flex space-x-6">
          <a href="#" className="text-sm uppercase tracking-widest text-white/50 hover:text-white transition-colors">Instagram</a>
          <a href="#" className="text-sm uppercase tracking-widest text-white/50 hover:text-white transition-colors">Twitter</a>
          <a href="#" className="text-sm uppercase tracking-widest text-white/50 hover:text-white transition-colors">YouTube</a>
          <a href="/admin" className="text-sm uppercase tracking-widest text-white/10 hover:text-white/30 transition-colors ml-4">Admin</a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-8 flex justify-center md:justify-end text-xs text-white/30">
        &copy; {new Date().getFullYear()} EDTXME. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
