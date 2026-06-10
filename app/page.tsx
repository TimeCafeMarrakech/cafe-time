'use client';

import React, { useState } from 'react';

export default function EntryPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // ─── THE ROUTING SWITCH ───
  const [showChat, setShowChat] = useState(false);

  // ─── CHAT INTERFACE STATES ───
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [guestName, setGuestName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Authenticating member:', email);
    setShowChat(true); 
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = { role: 'user', content: inputMessage };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages, guestName: guestName || 'Honored Guest' }),
      });
      const data = await response.json();
      setMessages([...updatedMessages, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      console.error("Error communicating with Anis:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── CONDITION 1: SHOW THE CHAT SPACE ───
  if (showChat) {
    return (
      <>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght=0,300;0,400;1,300&family=DM+Sans:wght=300;400&display=swap" rel="stylesheet" />
        <main className="min-h-screen bg-[#F5F0E8] text-[#1A1714] font-['DM_Sans'] flex flex-col p-4 md:p-8 select-none">
          
          {/* Minimal Editorial Top Header */}
          <header className="max-w-4xl w-full mx-auto flex justify-between items-center border-b border-[#D5CFC4] pb-4 mb-6">
            <div>
              <h1 className="font-['Cormorant_Garamond'] text-2xl tracking-[0.2em] uppercase text-[#B8734A]">T I M E</h1>
              <p className="text-[0.65rem] tracking-[0.1em] uppercase text-[#6B6460]">Marrakech · AI Salon</p>
            </div>
            <button 
              onClick={() => setShowChat(false)}
              className="text-[0.65rem] tracking-[0.15em] uppercase border border-[#D5CFC4] px-3 py-1.5 rounded-[2px] hover:border-[#1A1714] transition-colors"
            >
              ← Exit Lounge
            </button>
          </header>

          {/* Guest Name Initialization Banner — FIXED with explicit button confirm trigger */}
          {!guestName && (
            <div className="max-w-2xl w-full mx-auto mb-6 bg-[#EDEBE3] p-6 rounded-[2px] border border-[#D5CFC4] text-center space-y-4 animate-[fadeUp_0.4s_ease_both]">
              <p className="text-xs tracking-wide text-[#6B6460] uppercase font-medium">
                Before we summon the concierge, how shall Anis address you?
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                <input 
                  type="text" 
                  id="nameInput"
                  placeholder="Enter your name..." 
                  className="w-full sm:w-64 px-4 py-2 border border-[#D5CFC4] rounded-[2px] bg-[#FDFCF9] text-sm text-center outline-none transition-colors focus:border-[#B8734A]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const val = (e.target as HTMLInputElement).value;
                      if (val.trim()) setGuestName(val.trim());
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const inputEl = document.getElementById('nameInput') as HTMLInputElement;
                    if (inputEl && inputEl.value.trim()) {
                      setGuestName(inputEl.value.trim());
                    }
                  }}
                  className="w-full sm:w-auto px-5 py-2 bg-[#1A1714] text-[#F5F0E8] text-xs tracking-widest uppercase rounded-[2px] hover:bg-[#2E2A26] transition-colors"
                >
                  Confirm
                </button>
              </div>
            </div>
          )}

          {/* Chat Conversational Box */}
          <div className="flex-1 max-w-2xl w-full mx-auto overflow-y-auto space-y-6 py-4 pr-2 style-scrollbar">
            {messages.length === 0 ? (
              <div className="text-center py-20 space-y-3">
                <p className="font-['Cormorant_Garamond'] italic text-2xl text-[#6B6460]">"Salam Alaykum. Marhaban."</p>
                <p className="text-[0.7rem] tracking-[0.12em] uppercase text-[#8A9E8C]">Anis is listening quietly inside the courtyard room... ✨</p>
              </div>
            ) : (
              messages.map((m, idx) => (
                <div key={idx} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} animate-[fadeUp_0.4s_ease_both]`}>
                  <span className="text-[0.6rem] tracking-[0.1em] uppercase text-[#6B6460] mb-1">
                    {m.role === 'user' ? (guestName || 'You') : 'Anis'}
                  </span>
                  <div className={`max-w-[85%] text-sm leading-relaxed p-3 rounded-[2px] ${m.role === 'user' ? 'bg-[#EDEBE3] border border-[#D5CFC4] text-[#1A1714]' : 'bg-[#1A1714] text-[#F5F0E8]'}`}>
                    {m.content}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <p className="text-[0.65rem] tracking-[0.15em] uppercase text-[#8A9E8C] animate-pulse">Anis is pouring thoughts... 🍃</p>
            )}
          </div>

          {/* Input Field Line */}
          <form onSubmit={handleSendMessage} className="max-w-2xl w-full mx-auto mt-4 border-t border-[#D5CFC4] pt-4">
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={guestName ? `Speak to Anis, ${guestName}...` : "Choose a name above or type here directly..."}
                className="w-full bg-transparent py-3 pl-2 pr-12 text-sm text-[#1A1714] border-b border-transparent outline-none transition-colors placeholder-[#B0A99E] focus:border-[#B8734A]"
              />
              <button 
                type="submit"
                className="absolute right-2 p-2 text-xs tracking-widest text-[#B8734A] uppercase hover:text-[#1A1714] transition-colors"
              >
                Send →
              </button>
            </div>
          </form>
        </main>
      </>
    );
  }

  // ─── CONDITION 2: SHOW CLAUDE'S LUXURY ENTRANCE SCREEN ───
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght=0,300;0,400;1,300;1,400&family=DM+Sans:wght=300;400&display=swap" rel="stylesheet" />

      <main className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[#F5F0E8] text-[#1A1714] font-['DM_Sans',_sans-serif] font-light antialiased">
        <section className="relative bg-[#1A1714] overflow-hidden flex flex-col justify-end p-8 md:p-12 min-h-[40vh] md:min-h-screen group">
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
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_70%,_rgba(184,115,74,0.18)_0%,_transparent_65%)] bg-gradient-to-t from-[#1A1714]/85 via-transparent to-[#1A1714]/20 pointer-events-none" />

          <div className="relative z-10 space-y-6 animate-[fadeUp_0.9s_ease_both]">
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

            <div className="w-10 h-[1px] bg-[#C9A96E]" />

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

        <section className="flex flex-col justify-center px-6 py-12 md:p-16 lg:p-24 bg-[#F5F0E8]">
          <div className="max-w-md w-full mx-auto space-y-8 animate-[fadeUp_0.9s_ease_both]">
            <div className="font-['Cormorant_Garamond',_serif] text-base font-normal tracking-[0.32em] uppercase text-[#B8734A] flex items-center gap-3">
              <div className="w-6 h-[1px] bg-[#B8734A]" />
              TIME
            </div>

            <div>
              <h1 className="font-['Cormorant_Garamond',_serif] text-3xl md:text-4xl font-light text-[#1A1714] leading-tight mb-2">
                Welcome back.
              </h1>
              <p className="text-[0.82rem] text-[#6B6460] leading-relaxed">
                Sign in to your membership — or join the circle for the first time.
              </p>
            </div>

            <form onSubmit={handleSignIn} className="space-y-5 pt-2">
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-[0.68rem] tracking-[0.14em] uppercase text-[#6B6460]">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-[#D5CFC4] rounded-[2px] bg-[#FDFCF9] text-sm text-[#1A1714] outline-none transition-colors duration-200 focus:border-[#B8734A]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-[0.68rem] tracking-[0.14em] uppercase text-[#6B6460]">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-[#D5CFC4] rounded-[2px] bg-[#FDFCF9] text-sm text-[#1A1714] outline-none transition-colors duration-200 focus:border-[#B8734A]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full !mt-8 py-3.5 px-6 bg-[#1A1714] text-[#F5F0E8] font-medium text-[0.78rem] tracking-[0.16em] uppercase rounded-[2px] transition-all duration-200 hover:bg-[#2E2A26] active:scale-[0.99] relative overflow-hidden group/btn"
              >
                <span className="relative z-10">Sign in</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C9A96E]/15 to-transparent -translateX-full transition-transform duration-700 ease-out group-hover/btn:translate-x-full" />
              </button>
            </form>

            <div className="flex items-center gap-4 text-[0.72rem] tracking-[0.1em] uppercase text-[#6B6460]">
              <div className="flex-1 h-[1px] bg-[#D5CFC4]" />
              or
              <div className="flex-1 h-[1px] bg-[#D5CFC4]" />
            </div>

            <button
              type="button"
              onClick={() => setShowChat(true)}
              className="w-full py-3 px-4 bg-transparent border border-[#D5CFC4] rounded-[2px] text-[0.78rem] tracking-[0.12em] uppercase text-[#6B6460] transition-colors duration-200 hover:border-[#1A1714] hover:text-[#1A1714]"
            >
              Continue as guest →
            </button>

            <p className="pt-4 text-[0.72rem] text-[#B0A99E] leading-relaxed">
              No account yet? <a href="#" className="text-[#B8734A] no-underline hover:underline transition-all">Create your membership</a> — it takes 30 seconds.<br />
              <a href="#" className="text-[#B8734A] no-underline hover:underline transition-all font-light mt-1 inline-block">Forgot password?</a>
            </p>
          </div>
        </section>
      </main>

      <style jsx global>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
