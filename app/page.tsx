'use client';

import React, { useState } from 'react';

// ─── TYPE DEFINITIONS FOR RESTORED FEATURES ───
interface CartItem {
  id: string;
  item: string;
  price: number;
  customization?: string;
}

interface PingItem {
  id: number;
  user: string;
  action: string;
  time: string;
  avatar: string;
}

interface BulletinItem {
  id: number;
  tag: string;
  title: string;
  desc: string;
  postedBy: string;
}

interface CustomizerState {
  isOpen: boolean;
  itemName: string;
  basePrice: number;
  hasMilkOptions: boolean;
}

interface ActiveMemberPhoto {
  id: number;
  name: string;
  imgUrl: string;
  status: string;
}

export default function UltimateUnifiedTimeApp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // ─── SYSTEM ROUTING SWITCH ───
  const [showChat, setShowChat] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'checkout' | 'board' | 'network'>('chat');

  // ─── CHAT CONVERSATION STATES ───
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [guestName, setGuestName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ─── CORE BACKEND FEATURE STATES ───
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing_apple' | 'processing_cash' | 'success_apple' | 'success_cash'>('idle');
  const [selectedMilk, setSelectedMilk] = useState<string>('Standard Dairy');
  const [loyaltyStamps, setLoyaltyStamps] = useState<number>(5); 
  const maxStamps = 9;

  const [customizer, setCustomizer] = useState<CustomizerState>({
    isOpen: false,
    itemName: '',
    basePrice: 0,
    hasMilkOptions: false
  });

  // ─── RESTORED: DYNAMIC ACTIVE MEMBER PROFILE IMAGES FOR LOGIN WALL ───
  const [activeWallMembers] = useState<ActiveMemberPhoto[]>([
    { id: 1, name: 'Youssef E.', imgUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', status: 'In Salon' },
    { id: 2, name: 'Sarah J.', imgUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', status: 'Focus Desk' },
    { id: 3, name: 'Amine R.', imgUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', status: 'Meeting Rm' },
    { id: 4, name: 'Chloe M.', imgUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', status: 'In Salon' },
  ]);

  // ─── NETWORK PINGS & BULLETIN STORAGE DATA ───
  const [pings, setPings] = useState<PingItem[]>([
    { id: 1, user: 'Youssef El Alami', action: 'Available for UI/UX consulting', time: 'Just now', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80' },
    { id: 2, user: 'Sarah Jenkins', action: 'Building a Fintech startup from Marrakech', time: '5m ago', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80' },
  ]);

  const [bulletins, setBulletins] = useState<BulletinItem[]>([
    { id: 1, tag: 'Co-Working', title: 'Looking for a Full-Stack React Dev', desc: 'Need local collaboration for an e-commerce platform shipping artisanal rugs.', postedBy: 'Amine R.' },
  ]);

  const [newAdTitle, setNewAdTitle] = useState('');
  const [newAdDesc, setNewAdDesc] = useState('');

  // ─── AUTHENTICATION FLOW SIMULATORS ───
  const handleOauthLogin = (provider: 'Google' | 'Apple') => {
    console.log(`Initializing Supabase OAuth tunnel for: ${provider}`);
    setGuestName(provider === 'Google' ? 'Google Member' : 'Apple Member');
    setShowChat(true);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setGuestName(email.split('@')[0]);
    setShowChat(true); 
  };

  const openCustomizer = (name: string, price: number, isDrink: boolean) => {
    setSelectedMilk('Standard Dairy');
    setCustomizer({ isOpen: true, itemName: name, basePrice: price, hasMilkOptions: isDrink });
  };

  const confirmCustomizationAndAddToCart = () => {
    let finalPrice = customizer.basePrice;
    let details = '';
    if (customizer.hasMilkOptions && selectedMilk !== 'Standard Dairy') {
      finalPrice += 5; 
      details = `(${selectedMilk})`;
    } else if (customizer.hasMilkOptions) {
      details = `(Standard Milk)`;
    }

    setCart([...cart, {
      id: Math.random().toString(36).substring(2, 9),
      item: `${customizer.itemName} ${details}`.trim(),
      price: finalPrice
    }]);
    setCustomizer({ isOpen: false, itemName: '', basePrice: 0, hasMilkOptions: false });
    setActiveTab('checkout');
  };

  const calculateTotal = () => cart.reduce((acc, curr) => acc + curr.price, 0);

  const processApplePay = () => {
    setPaymentStatus('processing_apple');
    setTimeout(() => {
      setPaymentStatus('success_apple');
      setLoyaltyStamps(prev => prev >= maxStamps ? 0 : prev + 1);
      setTimeout(() => { setCart([]); setPaymentStatus('idle'); }, 2500);
    }, 2000);
  };

  const processCashPayment = () => {
    setPaymentStatus('processing_cash');
    setTimeout(() => {
      setPaymentStatus('success_cash');
      setLoyaltyStamps(prev => prev >= maxStamps ? 0 : prev + 1);
      setTimeout(() => { setCart([]); setPaymentStatus('idle'); }, 3000);
    }, 1500);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;
    const updatedMessages = [...messages, { role: 'user', content: inputMessage }];
    setMessages(updatedMessages); setInputMessage(''); setIsLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages, guestName: guestName || 'Honored Guest' }),
      });
      const data = await response.json();
      setMessages([...updatedMessages, { role: 'assistant', content: data.reply }]);
    } catch (error) { console.error(error); } finally { setIsLoading(false); }
  };

  // ─── VIEW 1: ACTIVE PLATFORM LOUNGE SPACE ───
  if (showChat) {
    return (
      <>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
        <main className="min-h-screen bg-[#F5F0E8] text-[#1A1714] font-['DM_Sans'] flex flex-col p-4 md:p-6 relative">
          
          {/* Milk Customizer Modal */}
          {customizer.isOpen && (
            <div className="fixed inset-0 bg-[#1A1714]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-[#F5F0E8] border border-[#D5CFC4] max-w-sm w-full p-6 rounded-[2px] space-y-5 shadow-xl text-left">
                <h3 className="font-['Cormorant_Garamond'] text-2xl text-[#1A1714]">{customizer.itemName}</h3>
                {customizer.hasMilkOptions && (
                  <div className="space-y-2">
                    <label className="block text-[0.65rem] tracking-[0.12em] uppercase text-[#6B6460] font-medium">Alternative Milk Options</label>
                    {['Standard Dairy', 'Oat Milk (+5 MAD)', 'Almond Milk (+5 MAD)'].map((milk) => (
                      <button key={milk} type="button" onClick={() => setSelectedMilk(milk.split(' (')[0])} className={`w-full text-left px-3 py-2 rounded-[1px] border bg-transparent text-xs ${selectedMilk === milk.split(' (')[0] ? 'border-[#B8734A] text-[#B8734A] bg-[#EDEBE3]' : 'border-[#D5CFC4]'}`}>{milk}</button>
                    ))}
                  </div>
                )}
                <div className="flex gap-3"><button onClick={() => setCustomizer({ isOpen: false, itemName: '', basePrice: 0, hasMilkOptions: false })} className="flex-1 py-2 border border-[#D5CFC4] text-xs uppercase bg-transparent text-[#6B6460]">Cancel</button><button onClick={confirmCustomizationAndAddToCart} className="flex-1 py-2 bg-[#1A1714] text-[#F5F0E8] text-xs uppercase transition-colors border-none">Confirm</button></div>
              </div>
            </div>
          )}

          {/* Header */}
          <header className="max-w-7xl w-full mx-auto flex justify-between items-center border-b border-[#D5CFC4] pb-4 mb-6">
            <div>
              <h1 className="font-['Cormorant_Garamond'] text-2xl tracking-[0.2em] uppercase text-[#B8734A] font-light">T I M E</h1>
              <p className="text-[0.65rem] tracking-[0.1em] uppercase text-[#6B6460]">Marrakech · Active Member Dashboard</p>
            </div>
            <button onClick={() => setShowChat(false)} className="text-[0.65rem] tracking-[0.15em] uppercase border border-[#D5CFC4] px-3 py-1.5 rounded-[2px] hover:border-[#1A1714] transition-colors bg-transparent">← Exit Lounge</button>
          </header>

          {/* MASTER THREE-COLUMN WORKSPACE GRID */}
          <div className="flex-1 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 items-start overflow-hidden pb-4">
            
            {/* SIDEBAR: LOYALTY CARD & SELECTION MENU */}
            <aside className="lg:col-span-1 bg-[#EDEBE3] border border-[#D5CFC4] rounded-[2px] p-5 space-y-6 max-h-[45vh] lg:max-h-[75vh] overflow-y-auto">
              
              {/* Restored Loyalty Cards */}
              <div className="bg-[#1A1714] text-[#F5F0E8] p-4 rounded-[2px] border border-black space-y-3 shadow-md">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[0.5rem] tracking-[0.15em] text-[#C9A96E] uppercase block font-semibold">Ritual Rewards</span>
                    <h3 className="font-['Cormorant_Garamond'] text-xs tracking-wide uppercase text-[#F5F0E8]">Membership Stamps</h3>
                  </div>
                  <span className="text-[0.65rem] bg-[#EDEBE3] text-[#1A1714] px-1.5 py-0.5 rounded-[2px] font-mono">{loyaltyStamps}/{maxStamps}</span>
                </div>
                <div className="grid grid-cols-5 gap-1.5 pt-1">
                  {Array.from({ length: maxStamps }).map((_, idx) => (
                    <div key={idx} className={`aspect-square rounded-full flex items-center justify-center border text-[0.6rem] ${idx < loyaltyStamps ? 'bg-[#C9A96E] border-[#C9A96E] text-[#1A1714]' : 'border-[#F5F0E8]/20 text-[#F5F0E8]/20'}`}>
                      {idx < loyaltyStamps ? '☕' : idx + 1}
                    </div>
                  ))}
                  <div className="aspect-square rounded-full flex items-center justify-center border border-[#F5F0E8]/10 text-[0.5rem] text-[#F5F0E8]/20">FREE</div>
                </div>
              </div>

              {/* Menu items */}
              <div className="space-y-3 text-xs pt-1">
                <h3 className="text-[0.6rem] tracking-[0.15em] uppercase text-[#8A9E8C] font-semibold">Click to Order</h3>
                <div className="space-y-1.5">
                  <button onClick={() => openCustomizer('Cortado Espresso', 25, true)} className="w-full flex justify-between bg-transparent border-none p-0 hover:text-[#B8734A] cursor-pointer"><span>Cortado</span><span className="bg-[#FDFCF9] px-1 border border-[#D5CFC4]">25 MAD +</span></button>
                  <button onClick={() => openCustomizer('Rose & Cardamom Latte', 45, true)} className="w-full flex justify-between bg-transparent border-none p-0 hover:text-[#B8734A] cursor-pointer"><span>Rose Latte</span><span className="bg-[#FDFCF9] px-1 border border-[#D5CFC4]">45 MAD +</span></button>
                  <button onClick={() => openCustomizer('Quiet Focus Desk', 150, false)} className="w-full flex justify-between bg-transparent border-none p-0 hover:text-[#B8734A] cursor-pointer"><span>Quiet Focus Desk</span><span className="bg-[#FDFCF9] px-1 border border-[#D5CFC4]">150 MAD +</span></button>
                </div>
              </div>
            </aside>

            {/* CORE INTERACTIVE CONSOLE MODULE */}
            <div className="lg:col-span-2 flex flex-col bg-[#FDFCF9] border border-[#D5CFC4] rounded-[2px] p-5 h-[68vh] lg:h-[75vh] justify-between">
              
              {/* Tab Navigation */}
              <div className="flex border-b border-[#D5CFC4] pb-2 mb-4 gap-6 text-xs uppercase tracking-widest font-medium overflow-x-auto whitespace-nowrap">
                <button onClick={() => setActiveTab('chat')} className={`pb-1 bg-transparent border-none cursor-pointer ${activeTab === 'chat' ? 'border-b-2 border-[#B8734A] text-[#1A1714]' : 'text-[#B0A99E]'}`}>Salon AI</button>
                <button onClick={() => setActiveTab('checkout')} className={`pb-1 bg-transparent border-none cursor-pointer ${activeTab === 'checkout' ? 'border-b-2 border-[#B8734A] text-[#1A1714]' : 'text-[#B0A99E]'}`}>Checkout & Apple Pay</button>
                <button onClick={() => setActiveTab('board')} className={`pb-1 bg-transparent border-none cursor-pointer ${activeTab === 'board' ? 'border-b-2 border-[#B8734A] text-[#1A1714]' : 'text-[#B0A99E]'}`}>Medina Board</button>
              </div>

              {/* WINDOW TAB ROUTERS */}
              <div className="flex-1 overflow-y-auto pr-1">
                
                {/* SALON CHAT */}
                {activeTab === 'chat' && (
                  <div className="space-y-4 h-full flex flex-col justify-between">
                    <div className="space-y-4 overflow-y-auto flex-1 max-h-[48vh]">
                      {messages.length === 0 ? (
                        <div className="text-center py-16 space-y-2">
                          <p className="font-['Cormorant_Garamond'] italic text-xl text-[#6B6460]">"Salam Alaykum, {guestName || 'Member'}."</p>
                          <p className="text-[0.65rem] tracking-[0.12em] uppercase text-[#8A9E8C]">Anis is active and waiting in the courtyard lounge... ✨</p>
                        </div>
                      ) : (
                        messages.map((m, idx) => (
                          <div key={idx} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <span className="text-[0.55rem] tracking-[0.1em] uppercase text-[#6B6460] mb-0.5">{m.role === 'user' ? (guestName || 'You') : 'Anis'}</span>
                            <div className={`max-w-[85%] text-xs p-3 rounded-[2px] ${m.role === 'user' ? 'bg-[#EDEBE3] border border-[#D5CFC4]' : 'bg-[#1A1714] text-[#F5F0E8]'}`}>{m.content}</div>
                          </div>
                        ))
                      )}
                      {isLoading && <p className="text-[0.65rem] tracking-[0.15em] uppercase text-[#8A9E8C] animate-pulse">Anis is pouring thoughts... 🍃</p>}
                    </div>
                    <form onSubmit={handleSendMessage} className="border-t border-[#D5CFC4] pt-3 flex items-center relative">
                      <input type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} placeholder="Type your message..." className="w-full bg-transparent py-2 outline-none text-xs border-b border-transparent focus:border-[#B8734A]" />
                      <button type="submit" className="absolute right-1 text-xs uppercase text-[#B8734A] font-medium bg-transparent border-none cursor-pointer">Send</button>
                    </form>
                  </div>
                )}

                {/* LEDGER WITH RESTORED APPLE PAY MODULE */}
                {activeTab === 'checkout' && (
                  <div className="space-y-6 p-1">
                    <h3 className="font-['Cormorant_Garamond'] text-xl text-[#1A1714]">Statement Console</h3>
                    {cart.length === 0 ? (
                      <div className="text-center py-12 border border-dashed text-xs text-[#B0A99E] uppercase">Your checkout basket is empty.</div>
                    ) : (
                      <>
                        <div className="space-y-1.5">
                          {cart.map((c) => (
                            <div key={c.id} className="flex justify-between text-xs py-2 border-b bg-[#EDEBE3]/30 px-2 rounded-[1px] border-[#D5CFC4]/40">
                              <span>{c.item}</span>
                              <div className="flex items-center gap-3">
                                <span className="font-medium">{c.price} MAD</span>
                                <button onClick={() => setCart(cart.filter(i => i.id !== c.id))} className="text-red-700 bg-transparent border-none cursor-pointer text-[0.6rem] uppercase">Wipe</button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between text-xs font-medium pt-3 border-t border-[#D5CFC4]"><span>Total Invoice</span><span className="text-[#B8734A] font-bold">{calculateTotal()} MAD</span></div>
                        
                        {/* Interactive Checkout Router */}
                        <div className="pt-2">
                          {paymentStatus === 'idle' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <button onClick={processCashPayment} type="button" className="w-full bg-[#8A9E8C] text-[#F5F0E8] text-[0.65rem] tracking-widest uppercase py-3 rounded-[2px] border-none cursor-pointer">Pay Cash at Counter</button>
                              <button onClick={processApplePay} type="button" className="w-full bg-[#1A1714] text-[#F5F0E8] text-[0.65rem] tracking-widest uppercase py-3 rounded-[2px] flex items-center justify-center gap-1.5 border-none cursor-pointer">
                                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 170 170"><path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.92-14.37-6.15-3.34-2.73-7.23-7.46-11.66-14.19-4.81-7.3-8.87-16.38-12.18-27.26-3.31-10.87-4.97-21.36-4.97-31.47 0-17.91 4.59-31.44 13.77-40.59 7.37-7.38 16.21-11.13 26.54-11.26 5.35 0 10.98 1.57 16.91 4.7 5.92 3.14 10.05 4.7 12.38 4.7 2.11 0 6.13-1.56 12.06-4.7 5.93-3.13 11.16-4.63 15.69-4.5 14.8.63 25.86 6.01 33.19 16.14-13.69 8.35-20.37 19.39-20.02 33.13.36 10.74 4.26 19.55 11.71 26.43 7.46 6.89 16.27 10.51 26.43 10.86-2.5 7.12-5.74 14.31-9.72 21.57zM119.22 35.6c0-8.48-3.04-16.03-9.11-22.66C104.05 6.3 96.58 2.64 87.7 2c.12 8.36 3.29 15.82 9.5 22.38 6.22 6.56 13.61 10.22 22.02 10.98v.24z"/></svg>
                                <span>Apple Pay</span>
                              </button>
                            </div>
                          )}
                          {paymentStatus === 'processing_apple' && <div className="p-3 bg-[#EDEBE3] text-xs text-center uppercase tracking-wider animate-pulse">Authorizing Apple Pay Token...</div>}
                          {paymentStatus === 'processing_cash' && <div className="p-3 bg-[#EDEBE3] text-xs text-center uppercase tracking-wider animate-pulse">Printing bar ticket registry...</div>}
                          {paymentStatus === 'success_apple' && <div className="p-3 bg-[#8A9E8C] text-[#F5F0E8] text-xs text-center uppercase tracking-wider font-medium">✓ Order paid. +1 Loyalty Stamp Added!</div>}
                          {paymentStatus === 'success_cash' && <div className="p-3 bg-[#B8734A] text-[#F5F0E8] text-xs text-center uppercase tracking-wider font-medium">✓ Ticket logged. Settle cash at bar counter.</div>}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* BULLETIN BOARD */}
                {activeTab === 'board' && (
                  <div className="space-y-4 p-1">
                    <h3 className="font-['Cormorant_Garamond'] text-xl text-[#1A1714]">The Medina Circle</h3>
                    <div className="space-y-3">
                      {bulletins.map((b) => (
                        <div key={b.id} className="bg-[#EDEBE3]/50 p-4 border rounded-[2px] border-[#D5CFC4]">
                          <span className="text-[0.55rem] uppercase tracking-widest bg-[#B8734A] text-[#F5F0E8] px-2 py-0.5 rounded-[1px]">{b.tag}</span>
                          <h4 className="text-sm font-medium text-[#1A1714] mt-1.5">{b.title}</h4>
                          <p className="text-xs text-[#6B6460] mt-1 font-light leading-relaxed">{b.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* BRAND SIDEBAR IDENTIFIER PANEL */}
            <aside className="lg:col-span-1 bg-[#1A1714] text-[#F5F0E8] border border-[#1A1714] rounded-[2px] p-5 h-full flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-[0.55rem] tracking-[0.2em] text-[#C9A96E] uppercase block font-semibold">Active Sanctuary</span>
                <p className="font-['Cormorant_Garamond'] italic text-lg leading-snug text-[#F5F0E8]/90">"Time is not something to be managed, but a territory to be inhabited thoughtfully."</p>
                <div className="w-6 h-[1px] bg-[#C9A96E] mt-2" />
              </div>
              <div className="text-[0.65rem] space-y-1 text-[#F5F0E8]/50 uppercase tracking-wider pt-8">
                <p>● Connection: Active Fiber</p>
                <p>● Dual Settle Nodes: Enabled</p>
                <p>● Cloud Identity Tunnels: Active</p>
              </div>
            </aside>

          </div>
        </main>
      </>
    );
  }

  // ─── VIEW 2: SPLIT SCREEN INTERACTIVE DOORWAY WITH AUTH REGISTRATIONS & LIVE LOGIN PHOTO GRID ───
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400&display=swap" rel="stylesheet" />

      <main className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[#F5F0E8] text-[#1A1714] font-['DM_Sans',_sans-serif] font-light antialiased">
        
        {/* LEFT PANEL: ATMOSPHERE & RESTORED LIVE USER LOGIN BOARD */}
        <section className="relative bg-[#1A1714] overflow-hidden flex flex-col justify-end p-8 md:p-12 min-h-[45vh] md:min-h-screen group">
          <div className="absolute inset-0 opacity-[0.07] pointer-events-none" style={{ backgroundImage: `repeating-linear-gradient(45deg, #C9A96E 0, #C9A96E 1px, transparent 0, transparent 50%), repeating-linear-gradient(-45deg, #C9A96E 0, #C9A96E 1px, transparent 0, transparent 50%)`, backgroundSize: '32px 32px' }} />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_70%,_rgba(184,115,74,0.18)_0%,_transparent_65%)] bg-gradient-to-t from-[#1A1714]/85 via-transparent to-[#1A1714]/20 pointer-events-none" />
          
          <div className="relative z-10 space-y-6 animate-[fadeUp_0.9s_ease_both] w-full">
            
            {/* 📸 RESTORED: THE ACTIVE MEMBER PHOTO GRID / LOGIN BOARD WALL */}
            <div className="space-y-2.5">
              <span className="text-[0.55rem] tracking-[0.18em] uppercase text-[#8A9E8C] block font-semibold">Active In Courtyard Lounge Right Now</span>
              <div className="flex gap-3 flex-wrap">
                {activeWallMembers.map((m) => (
                  <div key={m.id} className="relative group/avatar flex flex-col items-center">
                    <img 
                      src={m.imgUrl} 
                      alt={m.name} 
                      className="w-10 h-10 rounded-full object-cover border border-[#C9A96E]/40 grayscale transition-all duration-300 group-hover/avatar:grayscale-0 group-hover/avatar:border-[#C9A96E]"
                    />
                    <div className="absolute -top-7 bg-[#1A1714] text-[#F5F0E8] text-[0.55rem] px-1.5 py-0.5 rounded-[1px] border border-[#C9A96E]/30 opacity-0 group-hover/avatar:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30">
                      {m.name} · <span className="text-[#8A9E8C]">{m.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-10 h-[1px] bg-[#C9A96E] mt-4" />
            <p className="font-['Cormorant_Garamond'] italic font-light text-4xl md:text-5xl lg:text-6xl text-[#F5F0E8] leading-[1.15] tracking-tight">A place where<br /><span className="not-italic text-[#C9A96E]">time</span> slows<br />down deliberately.</p>
            <div><p className="text-[0.78rem] tracking-[0.18em] uppercase text-[#8A9E8C] mb-1.5">Café · Marrakech · Guéliz</p><p className="text-[0.75rem] tracking-[0.08em] uppercase text-[#F5F0E8]/40">Members enjoy priority access, ritual rewards & seasonal menus</p></div>
          </div>
        </section>

        {/* RIGHT PANEL: FULL MEMBER CREDENTIALS & OAUTH SECURE GATEWAY ROUTING */}
        <section className="flex flex-col justify-center px-6 py-12 md:p-16 lg:p-24 bg-[#F5F0E8]">
          <div className="max-w-md w-full mx-auto space-y-8 animate-[fadeUp_0.9s_ease_both]">
            <div className="font-['Cormorant_Garamond',_serif] text-base font-normal tracking-[0.32em] uppercase text-[#B8734A] flex items-center gap-3"><div className="w-6 h-[1px] bg-[#B8734A]" />TIME</div>
            
            <div>
              <h1 className="font-['Cormorant_Garamond',_serif] text-3xl md:text-4xl font-light text-[#1A1714] leading-tight mb-2">Welcome back.</h1>
              <p className="text-[0.82rem] text-[#6B6460] leading-relaxed">Sign in to your membership space — or authorize secure social sync tunnels below.</p>
            </div>

            {/* 🌐 RESTORED: PREMIUM GOOGLE & APPLE AUTHENTICATION ROUTE BUTTONS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {/* Google Secure Button */}
              <button
                type="button"
                onClick={() => handleOauthLogin('Google')}
                className="py-2.5 px-4 bg-[#FDFCF9] text-[#1A1714] border border-[#D5CFC4] text-xs font-medium tracking-wider uppercase rounded-[2px] flex items-center justify-center gap-2 transition-colors hover:bg-[#EDEBE3] cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24"><path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.2-5.136 4.2A5.67 5.67 0 0 1 8.24 12.93a5.67 5.67 0 0 1 5.75-5.67c2.41 0 4.41 1.56 5.25 3.78l3.93-3.05C21.1 4.54 16.92 2.64 12.24 2.64a9.64 9.64 0 0 0-9.6 9.64a9.64 9.64 0 0 0 9.6 9.64c5.18 0 9.51-3.75 9.51-9.64c0-.66-.06-1.32-.15-1.995z"/></svg>
                Google Sync
              </button>

              {/* Apple Secure Button */}
              <button
                type="button"
                onClick={() => handleOauthLogin('Apple')}
                className="py-2.5 px-4 bg-[#1A1714] text-[#F5F0E8] text-xs font-medium tracking-wider uppercase rounded-[2px] flex items-center justify-center gap-2 transition-colors hover:bg-black cursor-pointer border-none"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 170 170"><path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.92-14.37-6.15-3.34-2.73-7.23-7.46-11.66-14.19-4.81-7.3-8.87-16.38-12.18-27.26-3.31-10.87-4.97-21.36-4.97-31.47 0-17.91 4.59-31.44 13.77-40.59 7.37-7.38 16.21-11.13 26.54-11.26 5.35 0 10.98 1.57 16.91 4.7 5.92 3.14 10.05 4.7 12.38 4.7 2.11 0 6.13-1.56 12.06-4.7 5.93-3.13 11.16-4.63 15.69-4.5 14.8.63 25.86 6.01 33.19 16.14-13.69 8.35-20.37 19.39-20.02 33.13.36 10.74 4.26 19.55 11.71 26.43 7.46 6.89 16.27 10.51 26.43 10.86-2.5 7.12-5.74 14.31-9.72 21.57zM119.22 35.6c0-8.48-3.04-16.03-9.11-22.66C104.05 6.3 96.58 2.64 87.7 2c.12 8.36 3.29 15.82 9.5 22.38 6.22 6.56 13.61 10.22 22.02 10.98v.24z"/></svg>
                Apple Identity
              </button>
            </div>

            <div className="flex items-center gap-4 text-[0.6rem] tracking-[0.12em] uppercase text-[#6B6460]"><div className="flex-1 h-[1px] bg-[#D5CFC4]" />or sign with credentials<div className="flex-1 h-[1px] bg-[#D5CFC4]" /></div>

            {/* Standard Email Form */}
            <form onSubmit={handleSignIn} className="space-y-4 pt-1">
              <div className="space-y-1.5"><label htmlFor="email" className="block text-[0.68rem] tracking-[0.14em] uppercase text-[#6B6460]">Email</label><input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="w-full px-4 py-3 border border-[#D5CFC4] rounded-[2px] bg-[#FDFCF9] text-sm text-[#1A1714] outline-none focus:border-[#B8734A]" required /></div>
              <div className="space-y-1.5"><label htmlFor="password" className="block text-[0.68rem] tracking-[0.14em] uppercase text-[#6B6460]">Password</label><input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 border border-[#D5CFC4] rounded-[2px] bg-[#FDFCF9] text-sm text-[#1A1714] outline-none focus:border-[#B8734A]" required /></div>
              <button type="submit" className="w-full !mt-6 py-3.5 px-6 bg-[#1A1714] text-[#F5F0E8] font-medium text-[0.78rem] tracking-[0.16em] uppercase rounded-[2px] transition-all hover:bg-[#2E2A26] active:scale-[0.99] relative overflow-hidden group/btn"><span className="relative z-10">Sign in</span><div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C9A96E]/15 to-transparent -translateX-full transition-transform duration-700 ease-out group-hover/btn:translate-x-full" /></button>
            </form>

            <div className="flex items-center gap-4 text-[0.72rem] tracking-[0.1em] uppercase text-[#6B6460]"><div className="flex-1 h-[1px] bg-[#D5CFC4]" />or<div className="flex-1 h-[1px] bg-[#D5CFC4]" /></div>
            <button type="button" onClick={() => setShowChat(true)} className="w-full py-3 px-4 bg-transparent border border-[#D5CFC4] rounded-[2px] text-[0.78rem] tracking-[0.12em] uppercase text-[#6B6460] transition-colors hover:border-[#1A1714] hover:text-[#1A1714]">Continue as guest →</button>
            <p className="pt-2 text-[0.72rem] text-[#B0A99E] leading-relaxed">No account yet? <a href="#" className="text-[#B8734A] no-underline hover:underline transition-all">Create your membership</a> — it takes 30 seconds.<br /><a href="#" className="text-[#B8734A] no-underline hover:underline transition-all font-light mt-1 inline-block">Forgot password?</a></p>
          </div>
        </section>
      </main>

      <style jsx global>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </>
  );
}
