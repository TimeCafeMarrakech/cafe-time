'use client';

import React, { useState } from 'react';

// Define explicit types for our feature components
interface CartItem {
  id: string;
  item: string;
  price: number;
}

interface PingItem {
  id: number;
  user: string;
  action: string;
  time: string;
}

interface BulletinItem {
  id: number;
  tag: string;
  title: string;
  desc: string;
  type: 'workshop' | 'coffee';
}

export default function MasterIntegratedApp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // ─── VISUAL SCREEN SWITCH ───
  const [showChat, setShowChat] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'checkout' | 'board'>('chat');

  // ─── CHAT CONVERSATION STATES ───
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [guestName, setGuestName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ─── FEATURE 1: REAL CART & CHECKOUT STATE LOGIC ───
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // ─── FEATURE 2: CUSTOMER PING LOGS STATE DATA ───
  const [pings, setPings] = useState<PingItem[]>([
    { id: 1, user: 'Youssef (Designer)', action: 'Checked into Quiet Room', time: 'Just now' },
    { id: 2, user: 'Sarah (Founder)', action: 'Ordered a Rose Latte', time: '5m ago' },
    { id: 3, user: 'Karim (Developer)', action: 'Booked Focus Desk A', time: '12m ago' }
  ]);

  // ─── FEATURE 3: BULLETIN BOARD DATA ───
  const [bulletins, setBulletins] = useState<BulletinItem[]>([
    { id: 1, tag: 'Pop-up Workshop', title: 'AI Engineering & Craft Architecture', desc: 'Join the circle this Friday evening inside the main terrace courtyard.', type: 'workshop' },
    { id: 2, tag: 'Seasonal Arrival', title: 'Sidamo Ethiopia Espresso Roast', desc: 'Freshly roasted single-origin batches are now active at the brew bar.', type: 'coffee' }
  ]);

  // Handle addition of catalog items directly into the checkout system
  const addToCart = (itemName: string, itemPrice: number) => {
    const newItem: CartItem = {
      id: Math.random().toString(36).substring(2, 9),
      item: itemName,
      price: itemPrice
    };
    setCart([...cart, newItem]);
    // Automatically switch tabs to checkout so the user visually sees the addition
    setActiveTab('checkout');
  };

  const removeFromCart = (idToRemove: string) => {
    setCart(cart.filter(item => item.id !== idToRemove));
  };

  const calculateTotal = () => cart.reduce((acc, curr) => acc + curr.price, 0);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
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

  // Simulating a fresh dynamic client ping inside the workspace dashboard
  const triggerManualPing = () => {
    const newPing: PingItem = {
      id: Date.now(),
      user: guestName ? `${guestName} (You)` : 'Honored Guest',
      action: 'Signalled presence in the courtyard lounge',
      time: 'Just now'
    };
    setPings([newPing, ...pings]);
  };

  // ─── COMPONENT VIEW 1: INTERACTIVE PLATFORM LOUNGE ───
  if (showChat) {
    return (
      <>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
        <main className="min-h-screen bg-[#F5F0E8] text-[#1A1714] font-['DM_Sans'] flex flex-col p-4 md:p-6">
          
          {/* Top Brand Header bar */}
          <header className="max-w-7xl w-full mx-auto flex justify-between items-center border-b border-[#D5CFC4] pb-4 mb-6">
            <div>
              <h1 className="font-['Cormorant_Garamond'] text-2xl tracking-[0.2em] uppercase text-[#B8734A] font-light">T I M E</h1>
              <p className="text-[0.65rem] tracking-[0.1em] uppercase text-[#6B6460]">Marrakech · Workspace Hub</p>
            </div>
            <button 
              onClick={() => setShowChat(false)}
              className="text-[0.65rem] tracking-[0.15em] uppercase border border-[#D5CFC4] px-3 py-1.5 rounded-[2px] hover:border-[#1A1714] transition-colors bg-transparent"
            >
              ← Exit Lounge
            </button>
          </header>

          {/* Guest Name Initialization Banner */}
          {!guestName && (
            <div className="max-w-md w-full mx-auto mb-6 bg-[#EDEBE3] p-6 rounded-[2px] border border-[#D5CFC4] text-center space-y-4 animate-[fadeUp_0.4s_ease_both]">
              <p className="text-xs tracking-wide text-[#6B6460] uppercase font-medium">Before we summon the concierge, how shall Anis address you?</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
                <input 
                  type="text" id="nameInput" placeholder="Enter your name..." 
                  className="w-full sm:w-64 px-4 py-2 border border-[#D5CFC4] rounded-[2px] bg-[#FDFCF9] text-sm text-center outline-none focus:border-[#B8734A]"
                  onKeyDown={(e) => { if (e.key === 'Enter') { const val = (e.target as HTMLInputElement).value; if (val.trim()) setGuestName(val.trim()); } }}
                />
                <button
                  type="button"
                  onClick={() => { const inputEl = document.getElementById('nameInput') as HTMLInputElement; if (inputEl && inputEl.value.trim()) setGuestName(inputEl.value.trim()); }}
                  className="w-full sm:w-auto px-5 py-2 bg-[#1A1714] text-[#F5F0E8] text-xs tracking-widest uppercase rounded-[2px] hover:bg-[#2E2A26] transition-colors"
                >Confirm</button>
              </div>
            </div>
          )}

          {/* MASTER GRID SYSTEM */}
          <div className="flex-1 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 items-start overflow-hidden pb-4">
            
            {/* COLUMN 1: INTERACTIVE BUY CATALOG & LIVE PULSE PINGS */}
            <aside className="lg:col-span-1 bg-[#EDEBE3] border border-[#D5CFC4] rounded-[2px] p-5 space-y-6 max-h-[40vh] lg:max-h-[75vh] overflow-y-auto">
              <div>
                <h2 className="font-['Cormorant_Garamond'] text-base tracking-wider text-[#B8734A] uppercase mb-1">Click Items to Purchase</h2>
                <p className="text-[0.6rem] text-[#6B6460] uppercase">Selecting items immediately updates your active tab statements.</p>
                <div className="w-6 h-[1px] bg-[#B8734A] mt-1" />
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <h3 className="text-[0.6rem] tracking-[0.15em] uppercase text-[#8A9E8C] font-semibold mb-2">Specialty Coffee</h3>
                  <div className="space-y-1.5">
                    <button onClick={() => addToCart('Cortado Espresso', 25)} className="w-full flex justify-between items-center text-left hover:text-[#B8734A] transition-colors group bg-transparent border-none p-0">
                      <span className="group-hover:underline">Cortado</span><span className="font-medium bg-[#FDFCF9] px-1.5 py-0.5 rounded-[2px] border border-[#D5CFC4]">25 MAD +</span>
                    </button>
                    <button onClick={() => addToCart('Rose & Cardamom Latte', 45)} className="w-full flex justify-between items-center text-left hover:text-[#B8734A] transition-colors group bg-transparent border-none p-0">
                      <span className="group-hover:underline">Rose Latte</span><span className="font-medium bg-[#FDFCF9] px-1.5 py-0.5 rounded-[2px] border border-[#D5CFC4]">45 MAD +</span>
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-[0.6rem] tracking-[0.15em] uppercase text-[#8A9E8C] font-semibold mb-2">Workspace Units</h3>
                  <div className="space-y-1.5">
                    <button onClick={() => addToCart('Quiet Focus Desk (4H)', 150)} className="w-full flex justify-between items-center text-left hover:text-[#B8734A] transition-colors group bg-transparent border-none p-0">
                      <span className="group-hover:underline">Quiet Focus Desk</span><span className="font-medium bg-[#FDFCF9] px-1.5 py-0.5 rounded-[2px] border border-[#D5CFC4]">150 MAD +</span>
                    </button>
                    <button onClick={() => addToCart('Private Meeting Room (2H)', 400)} className="w-full flex justify-between items-center text-left hover:text-[#B8734A] transition-colors group bg-transparent border-none p-0">
                      <span className="group-hover:underline">Private Meeting Room</span><span className="font-medium bg-[#FDFCF9] px-1.5 py-0.5 rounded-[2px] border border-[#D5CFC4]">400 MAD +</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* ACTIVE NETWORK PINGS MONITOR */}
              <div className="pt-4 border-t border-[#D5CFC4]">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-[0.6rem] tracking-[0.15em] uppercase text-[#B8734A] font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8A9E8C] animate-ping" /> Workspace Pulse
                  </h3>
                  <button onClick={triggerManualPing} className="text-[0.55rem] tracking-widest text-[#6B6460] uppercase border border-[#D5CFC4] px-1.5 py-0.5 rounded-[1px] bg-[#FDFCF9] hover:border-[#1A1714]">
                    Ping Self
                  </button>
                </div>
                <div className="space-y-2">
                  {pings.map((p) => (
                    <div key={p.id} className="text-[0.7rem] bg-[#FDFCF9]/80 p-2 rounded-[1px] border border-[#D5CFC4]/40 animate-[fadeUp_0.3s_ease_both]">
                      <p className="font-medium text-[#1A1714]">{p.user}</p>
                      <p className="text-[#6B6460] font-light">{p.action}</p>
                      <span className="text-[0.55rem] text-[#B0A99E] block mt-0.5">{p.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            {/* COLUMN 2 & 3: CENTER NAVIGATION CONTROL TABS AND TERMINAL */}
            <div className="lg:col-span-2 flex flex-col bg-[#FDFCF9] border border-[#D5CFC4] rounded-[2px] p-5 h-[65vh] lg:h-[75vh] justify-between">
              
              {/* Tab Toggles */}
              <div className="flex border-b border-[#D5CFC4] pb-2 mb-4 gap-6 text-xs uppercase tracking-widest font-medium">
                <button onClick={() => setActiveTab('chat')} className={`pb-1 bg-transparent border-none cursor-pointer ${activeTab === 'chat' ? 'border-b-2 border-[#B8734A] text-[#1A1714] font-medium' : 'text-[#B0A99E]'}`}>Salon AI</button>
                <button onClick={() => setActiveTab('checkout')} className={`pb-1 bg-transparent border-none cursor-pointer relative ${activeTab === 'checkout' ? 'border-b-2 border-[#B8734A] text-[#1A1714] font-medium' : 'text-[#B0A99E]'}`}>
                  Checkout Registry {cart.length > 0 && <span className="absolute -top-2 -right-3 bg-[#B8734A] text-[#F5F0E8] rounded-full text-[0.55rem] px-1">{cart.length}</span>}
                </button>
                <button onClick={() => setActiveTab('board')} className={`pb-1 bg-transparent border-none cursor-pointer ${activeTab === 'board' ? 'border-b-2 border-[#B8734A] text-[#1A1714] font-medium' : 'text-[#B0A99E]'}`}>Medina Board</button>
              </div>

              {/* DYNAMIC WINDOW ENGINE */}
              <div className="flex-1 overflow-y-auto pr-1 style-scrollbar">
                
                {/* INTERACTIVE CHAT GATEWAY */}
                {activeTab === 'chat' && (
                  <div className="space-y-4 h-full flex flex-col justify-between">
                    <div className="space-y-4 overflow-y-auto flex-1 max-h-[45vh] lg:max-h-[55vh]">
                      {messages.length === 0 ? (
                        <div className="text-center py-20 space-y-2">
                          <p className="font-['Cormorant_Garamond'] italic text-2xl text-[#6B6460]">"Salam Alaykum."</p>
                          <p className="text-[0.68rem] tracking-[0.12em] uppercase text-[#8A9E8C]">Anis is online and reading your requests... ✨</p>
                        </div>
                      ) : (
                        messages.map((m, idx) => (
                          <div key={idx} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} animate-[fadeUp_0.2s_ease_both]`}>
                            <span className="text-[0.55rem] tracking-[0.1em] uppercase text-[#6B6460] mb-0.5">{m.role === 'user' ? (guestName || 'You') : 'Anis'}</span>
                            <div className={`max-w-[85%] text-sm p-3 rounded-[2px] ${m.role === 'user' ? 'bg-[#EDEBE3] border border-[#D5CFC4]' : 'bg-[#1A1714] text-[#F5F0E8]'}`}>{m.content}</div>
                          </div>
                        ))
                      )}
                      {isLoading && <p className="text-[0.65rem] tracking-[0.15em] uppercase text-[#8A9E8C] animate-pulse">Anis is pouring thoughts... 🍃</p>}
                    </div>
                    
                    <form onSubmit={handleSendMessage} className="border-t border-[#D5CFC4] pt-3 flex items-center relative">
                      <input
                        type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)}
                        placeholder={`Speak to Anis, ${guestName || 'Guest'}...`}
                        className="w-full bg-transparent py-2 outline-none text-sm border-b border-transparent focus:border-[#B8734A]"
                      />
                      <button type="submit" className="absolute right-1 text-xs uppercase tracking-widest text-[#B8734A] font-medium bg-transparent border-none cursor-pointer">Send</button>
                    </form>
                  </div>
                )}

                {/* REAL DATA CHECKOUT SYSTEM */}
                {activeTab === 'checkout' && (
                  <div className="space-y-6 p-1 animate-[fadeUp_0.2s_ease_both]">
                    <div>
                      <h3 className="font-['Cormorant_Garamond'] text-xl text-[#1A1714]">Active Order Matrix</h3>
                      <p className="text-[0.7rem] text-[#6B6460] uppercase tracking-wider">Add items from the left side panel to calculate totals</p>
                    </div>
                    
                    {cart.length === 0 ? (
                      <div className="text-center py-12 border border-dashed border-[#D5CFC4] p-4 text-xs text-[#B0A99E] uppercase tracking-widest">
                        Your statement sheet is empty.
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[30vh] overflow-y-auto">
                        {cart.map((c) => (
                          <div key={c.id} className="flex justify-between items-center text-xs py-2 border-b border-[#D5CFC4]/50 bg-[#EDEBE3]/30 px-2 rounded-[1px]">
                            <span>{c.item}</span>
                            <div className="flex items-center gap-3">
                              <span className="font-medium text-[#1A1714]">{c.price} MAD</span>
                              <button onClick={() => removeFromCart(c.id)} className="text-[0.6rem] uppercase tracking-widest text-red-700 hover:underline bg-transparent border-none cursor-pointer">Wipe</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-between text-sm font-medium pt-3 border-t border-[#D5CFC4]">
                      <span>Aggregated Statement Total</span> 
                      <span className="text-[#B8734A] font-bold text-base">{calculateTotal()} MAD</span>
                    </div>

                    <button 
                      disabled={cart.length === 0}
                      onClick={() => {
                        alert(`Account statement settled successfully for ${calculateTotal()} MAD. Sending transaction parameters to the database logs!`);
                        setCart([]);
                      }} 
                      className="w-full py-3 bg-[#1A1714] text-[#F5F0E8] text-xs tracking-widest uppercase rounded-[2px] font-medium hover:bg-[#B8734A] transition-colors mt-4 disabled:opacity-40 disabled:hover:bg-[#1A1714] cursor-pointer"
                    >
                      Process Payment Invoice
                    </button>
                  </div>
                )}

                {/* ADVERTISEMENT BULLETIN BOARD SYSTEM */}
                {activeTab === 'board' && (
                  <div className="space-y-5 p-1 animate-[fadeUp_0.2s_ease_both]">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-['Cormorant_Garamond'] text-xl text-[#1A1714]">The Medina Bulletin</h3>
                        <p className="text-[0.7rem] text-[#6B6460] uppercase tracking-wider">Community updates and workspace popups</p>
                      </div>
                      <button 
                        onClick={() => {
                          const customTitle = prompt("Enter announcement heading:");
                          const customDesc = prompt("Enter announcement description detail:");
                          if (customTitle && customDesc) {
                            setBulletins([{ id: Date.now(), tag: 'Member Notice', title: customTitle, desc: customDesc, type: 'workshop' }, ...bulletins]);
                          }
                        }}
                        className="text-[0.6rem] tracking-widest text-[#F5F0E8] bg-[#B8734A] uppercase px-2 py-1 rounded-[2px] border-none hover:bg-[#1A1714]"
                      >
                        + Post Ad
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-3.5">
                      {bulletins.map((b) => (
                        <div key={b.id} className="bg-[#EDEBE3] p-4 rounded-[2px] border border-[#D5CFC4] space-y-1.5 animate-[fadeUp_0.2s_ease_both]">
                          <span className={`text-[0.55rem] tracking-widest uppercase font-bold px-1.5 py-0.5 rounded-[1px] ${b.type === 'coffee' ? 'bg-[#8A9E8C] text-[#F5F0E8]' : 'bg-[#B8734A] text-[#F5F0E8]'}`}>
                            {b.tag}
                          </span>
                          <h4 className="text-sm font-medium text-[#1A1714] pt-1">{b.title}</h4>
                          <p className="text-xs text-[#6B6460] leading-relaxed font-light">{b.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* COLUMN 4: QUOTATION & BRAND IDENTIFIER CARD */}
            <aside className="lg:col-span-1 bg-[#1A1714] text-[#F5F0E8] border border-[#1A1714] rounded-[2px] p-5 space-y-4 h-full flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-[0.55rem] tracking-[0.2em] text-[#C9A96E] uppercase block font-semibold">Active Sanctuary</span>
                <p className="font-['Cormorant_Garamond'] italic text-lg leading-snug text-[#F5F0E8]/90">"Time is not something to be managed, but a territory to be inhabited thoughtfully."</p>
                <div className="w-6 h-[1px] bg-[#C9A96E] mt-2" />
              </div>
              <div className="text-[0.65rem] space-y-1 text-[#F5F0E8]/50 uppercase tracking-wider pt-8">
                <p>● Fiber Connection: Operational</p>
                <p>● Guéliz Workspace: Active</p>
              </div>
            </aside>

          </div>
        </main>
      </>
    );
  }

  // ─── COMPONENT VIEW 2: SPLIT SCREEN DOORWAY ───
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400&display=swap" rel="stylesheet" />

      <main className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[#F5F0E8] text-[#1A1714] font-['DM_Sans',_sans-serif] font-light antialiased">
        <section className="relative bg-[#1A1714] overflow-hidden flex flex-col justify-end p-8 md:p-12 min-h-[40vh] md:min-h-screen group">
          <div className="absolute inset-0 opacity-[0.07] pointer-events-none transition-opacity duration-500 group-hover:opacity-[0.09]" style={{ backgroundImage: `repeating-linear-gradient(45deg, #C9A96E 0, #C9A96E 1px, transparent 0, transparent 50%), repeating-linear-gradient(-45deg, #C9A96E 0, #C9A96E 1px, transparent 0, transparent 50%)`, backgroundSize: '32px 32px' }} />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_70%,_rgba(184,115,74,0.18)_0%,_transparent_65%)] bg-gradient-to-t from-[#1A1714]/85 via-transparent to-[#1A1714]/20 pointer-events-none" />
          <div className="relative z-10 space-y-6 animate-[fadeUp_0.9s_ease_both]">
            <div className="flex gap-6 flex-wrap">
              <div className="flex flex-col gap-0.5"><span className="text-[0.62rem] tracking-[0.14em] uppercase text-[#8A9E8C]">Members</span><span className="font-['Cormorant_Garamond',_serif] text-xl text-[#F5F0E8] font-light">2,400+</span></div>
              <div className="flex flex-col gap-0.5"><span className="text-[0.62rem] tracking-[0.14em] uppercase text-[#8A9E8C]">Guéliz · Marrakech</span><span className="font-['Cormorant_Garamond',_serif] text-xl text-[#F5F0E8] font-light">Est. 2025</span></div>
              <div className="flex flex-col gap-0.5"><span className="text-[0.62rem] tracking-[0.14em] uppercase text-[#8A9E8C]">Early Access</span><span className="font-['Cormorant_Garamond',_serif] text-xl text-[#F5F0E8] font-light">Open</span></div>
            </div>
            <div className="w-10 h-[1px] bg-[#C9A96E]" />
            <p className="font-['Cormorant_Garamond',_serif] italic font-light text-4xl md:text-5xl lg:text-6xl text-[#F5F0E8] leading-[1.15] tracking-tight">A place where<br /><span className="not-italic text-[#C9A96E]">time</span> slows<br />down deliberately.</p>
            <div><p className="text-[0.78rem] tracking-[0.18em] uppercase text-[#8A9E8C] mb-1.5">Café · Marrakech · Guéliz</p><p className="text-[0.75rem] tracking-[0.08em] uppercase text-[#F5F0E8]/40">Members enjoy priority access, ritual rewards & seasonal menus</p></div>
          </div>
        </section>

        <section className="flex flex-col justify-center px-6 py-12 md:p-16 lg:p-24 bg-[#F5F0E8]">
          <div className="max-w-md w-full mx-auto space-y-8 animate-[fadeUp_0.9s_ease_both]">
            <div className="font-['Cormorant_Garamond',_serif] text-base font-normal tracking-[0.32em] uppercase text-[#B8734A] flex items-center gap-3"><div className="w-6 h-[1px] bg-[#B8734A]" />TIME</div>
            <div>
              <h1 className="font-['Cormorant_Garamond',_serif] text-3xl md:text-4xl font-light text-[#1A1714] leading-tight mb-2">Welcome back.</h1>
              <p className="text-[0.82rem] text-[#6B6460] leading-relaxed">Sign in to your membership — or join the circle for the first time.</p>
            </div>
            <form onSubmit={handleSignIn} className="space-y-5 pt-2">
              <div className="space-y-1.5"><label htmlFor="email" className="block text-[0.68rem] tracking-[0.14em] uppercase text-[#6B6460]">Email</label><input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="w-full px-4 py-3 border border-[#D5CFC4] rounded-[2px] bg-[#FDFCF9] text-sm text-[#1A1714] outline-none transition-colors duration-200 focus:border-[#B8734A]" required /></div>
              <div className="space-y-1.5"><label htmlFor="password" className="block text-[0.68rem] tracking-[0.14em] uppercase text-[#6B6460]">Password</label><input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 border border-[#D5CFC4] rounded-[2px] bg-[#FDFCF9] text-sm text-[#1A1714] outline-none transition-colors duration-200 focus:border-[#B8734A]" required /></div>
              <button type="submit" className="w-full !mt-8 py-3.5 px-6 bg-[#1A1714] text-[#F5F0E8] font-medium text-[0.78rem] tracking-[0.16em] uppercase rounded-[2px] transition-all duration-200 hover:bg-[#2E2A26] active:scale-[0.99] relative overflow-hidden group/btn"><span className="relative z-10">Sign in</span><div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C9A96E]/15 to-transparent -translateX-full transition-transform duration-700 ease-out group-hover/btn:translate-x-full" /></button>
            </form>
            <div className="flex items-center gap-4 text-[0.72rem] tracking-[0.1em] uppercase text-[#6B6460]"><div className="flex-1 h-[1px] bg-[#D5CFC4]" />or<div className="flex-1 h-[1px] bg-[#D5CFC4]" /></div>
            <button type="button" onClick={() => setShowChat(true)} className="w-full py-3 px-4 bg-transparent border border-[#D5CFC4] rounded-[2px] text-[0.78rem] tracking-[0.12em] uppercase text-[#6B6460] transition-colors duration-200 hover:border-[#1A1714] hover:text-[#1A1714]">Continue as guest →</button>
            <p className="pt-4 text-[0.72rem] text-[#B0A99E] leading-relaxed">No account yet? <a href="#" className="text-[#B8734A] no-underline hover:underline transition-all">Create your membership</a> — it takes 30 seconds.<br /><a href="#" className="text-[#B8734A] no-underline hover:underline transition-all font-light mt-1 inline-block">Forgot password?</a></p>
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
