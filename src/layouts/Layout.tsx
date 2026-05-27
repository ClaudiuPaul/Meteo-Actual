import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div 
      className="min-h-screen w-full text-slate-50 selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden relative font-sans"
      style={{
        backgroundImage: "url('/bg-sky.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      {/* Dark Blur Overlay to make text legible */}
      <div className="fixed inset-0 bg-slate-950/45 backdrop-blur-[5px] z-0 pointer-events-none" />
      
      {/* Global Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Soft radial gradients for a premium feel */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[150px]" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  );
};
