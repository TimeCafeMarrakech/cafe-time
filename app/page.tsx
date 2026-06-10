'use client';

import React, { useState } from 'react';

export default function EntryPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Authenticating member:', email);
    // Hook for future Supabase DB authentication loops
  };

  const handleGuestAccess = () => {
    console.log('Routing to AI Concierge space...');
    // Future step: router.push('/chat') to open Anis interface
  };

  return (
    <>
      {/* 📜 Loading Google Fonts natively within the Next.js header stream */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link 
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400&display=swap" 
        rel="stylesheet" 
      />

      <main className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[#F5F0E8] text-[#1A1714] font-['DM_Sans',_sans-serif] font-light antialiased">
        
        {/* ─── LEFT PANEL — Atmosphere & Tile Inlay ─── */}
        <section className="relative bg-[#1A1714] overflow-hidden flex flex-col justify-end p-8 md:p-12 min-h-[40vh] md:min-h-screen group">
          
          {/* Pure CSS Geometric Moroccan Tile Background Inlay */}
          <div 
            className="absolute inset-0 opacity-[0.07] pointer-events-none transition-opacity duration-500 group-hover:opacity-[0.09]"
            style={{
              backgroundImage: `
                repeating-linear-gradient(45deg, #C9A96E 0, #C9A96E 1px, transparent 0, transparent 50%),
                repeating-linear-gradient(-45deg, #C9A96E 0, #C9A96E 1px, transparent 0, transparent 50%)
              `,
              backgroundSize: '32px 32px'
            }}
          />
          
          {/* Radial Tadelakt Vignette Layer */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_70%,_rgba(184,115,74,0.18)_0%,_transparent_65%)] bg-gradient-to-t from-[#1A1714]/85 via-transparent to-[#1A1714]/20 pointer-events-none" />

          {/* Staggered Fade Up Atmosphere Text */}
          <div className="relative z-10 space-y-6 animate-[fadeUp_0.9s_ease_both]">
            
            {/* Perks Strip Metrics */}
            <div className="flex gap-6 flex-wrap">
              <div className="flex flex-col gap-0.5">
                <span className="text-[0.62rem] tracking-[0.14em] uppercase text-[#8A9E8C]">Members</span>
                <span className="font-['Cormorant_Garamond',_serif] text-xl text-[#F5F0E8] font-light">2,400+</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[0.62rem] tracking-[0.14em] uppercase text-[#8A9E8C]">Guéliz · Marrakech</span>
                <span className="font-['Cormorant_Garamond',_serif] text-xl text-[#F5F0E8] font-light">Est. 2025</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[0.62rem] tracking-[0.14em] uppercase text-[#8A9E8C]">Early Access</span>
                <span className="font-['Cormorant_Garamond',_serif] text-xl text-[#F5F0E8] font-light">Open</span>
              </div>
            </div>

            {/* Brass Rule */}
            <div className="w-10 h-[1px] bg-[#C9A96E]" />

            {/* Editorial Serif Header Quote */}
            <p className="font-['Cormorant_Garamond',_serif] italic font-light text-4xl md:text-5xl lg:text-6xl text-[#F5F0E8] leading-[1.15] tracking-tight">
              A place where<br />
              <span className="not-italic text-[#C9A96E]">time</span> slows<br />
              down deliberately.
            </p>

            <div>
              <p className="text-[0.78rem] tracking-[0.18em] uppercase text-[#8A9E8C] mb-1.5">Café · Marrakech · Guéliz</p>
              <p className="text-[0.75rem] tracking-[0.08em] uppercase text-[#F5F0E8]/40">Members enjoy priority access, ritual rewards & seasonal menus</p>
            </div>
          </div>
        </section>

        {/* ─── RIGHT PANEL — Member Auth Management ─── */}
        <section className="flex flex-col justify-center px-6 py-12 md:p-16 lg:p-24 bg-[#F5F0E8]">
          <div className="max-w-md w-full mx-auto space-y-8 animate-[fadeUp_0.9s_ease_both]">
            
            {/* Brand Logo Wordmark */}
            <div className="font-['Cormorant_Garamond',_serif] text-base font-normal tracking-[0.32em] uppercase text-[#B8734A] flex items-center gap-3">
              <div className="w-6 h-[1px] bg-[#B8734A]" />
              TIME
            </div>

            {/* Headings */}
            <div>
              <h1 className="font-['Cormorant_Garamond',_serif] text-3xl md:text-4xl font-light text-[#1A1714] leading-tight mb-2">
                Welcome back.
              </h1>
              <p className="text-[0.82rem] text-[#6B6460] leading-relaxed">
                Sign in to your membership — or join the circle for the first time.
              </p>
            </div>

            {/* Interactive Inputs */}
            <form onSubmit={handleSignIn} className="space-y-5 pt-2">
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-[0.68rem] tracking-[0.14em] uppercase text-[#6B6460]">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  autoComplete="email"
                  className="w-full px-4 py-3 border border-[#D5CFC4] rounded-[2px] bg-[#FDFCF9] text-sm text-[#1A1714] outline-none transition-colors duration-200 focus:border-[#B8734A]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-[0.68rem] tracking-[0.14em] uppercase text-[#6B6460]">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full px-4 py-3 border border-[#D5CFC4] rounded-[2px] bg-[#FDFCF9] text-sm text-[#1A1714] outline-none transition-colors duration-200 focus:border-[#B8734A]"
                  required
                />
              </div>

              {/* Shimmering Matte Walnut Core Button */}
              <button
                type="submit"
                className="w-full !mt-8 py-3.5 px-6 bg-[#1A1714] text-[#F5F0E8] font-medium text-[0.78rem] tracking-[0.16em] uppercase rounded-[2px] transition-all duration-200 hover:bg-[#2E2A26] active:scale-[0.99] relative overflow-hidden group/btn"
              >
                <span className="relative z-10">Sign in</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C9A96E]/15 to-transparent -translateX-full transition-transform duration-700 ease-out group-hover/btn:translate-x-full" />
              </button>
            </form>

            {/* Text Segment Divider */}
            <div className="flex items-center gap-4 text-[0.72rem] tracking-[0.1em] uppercase text-[#6B6460]">
              <div className="flex-1 h-[1px] bg-[#D5CFC4]" />
              or
              <div className="flex-1 h-[1px] bg-[#D5CFC4]" />
            </div>

            {/* Secondary Action Link */}
            <button
              type="button"
              onClick={handleGuestAccess}
              className="w-full py-3 px-4 bg-transparent border border-[#D5CFC4] rounded-[2px] text-[0.78rem] tracking-[0.12em] uppercase text-[#6B6460] transition-colors duration-200 hover:border-[#1A1714] hover:text-[#1A1714]"
            >
              Continue as guest →
            </button>

            {/* Footer Metadata */}
            <p className="pt-4 text-[0.72rem] text-[#B0A99E] leading-relaxed">
              No account yet? <a href="#" className="text-[#B8734A] no-underline hover:underline transition-all">Create your membership</a> — it takes 30 seconds.<br />
              <a href="#" className="text-[#B8734A] no-underline hover:underline transition-all font-light mt-1 inline-block">Forgot password?</a>
            </p>

          </div>
        </section>
      </main>

      {/* Embedded CSS Animations Module */}
      <style jsx global>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
