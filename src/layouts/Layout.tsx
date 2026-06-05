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
      {/* Fundal întunecat pentru a face textul ușor de citit */}
      <div className="fixed inset-0 bg-slate-950/45 backdrop-blur-[5px] z-0 pointer-events-none" />
      
      {/* Stratul principal de fundal */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Umbre colorate pentru un aspect plăcut */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[150px]" />
      </div>

      {/* Cutia principală care ține conținutul */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  );
};
