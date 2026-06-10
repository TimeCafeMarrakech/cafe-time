'use client';

import React, { useState } from 'react';

// ─── EXTENDED TYPE DEFINITIONS ───
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
  type: 'drink' | 'space' | 'pastry';
}

interface ActiveMemberPhoto {
  id: number;
  name: string;
  imgUrl: string;
  status: string;
}

export default function FullyExpandedLoungeApp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // ─── SYSTEM ROUTING SWITCH ───
  const [showChat, setShowChat] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'spaces' | 'checkout' | 'board'>('chat');

  // ─── CHAT CONVERSATION STATES ───
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [guestName, setGuestName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ─── CORE BACKEND FEATURE STATES ───
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing_apple' | 'processing_cash' | 'success_apple' | 'success_cash'>('idle');
  const [selectedMilk, setSelectedMilk] = useState<string>('Standard Dairy');
  const [extraShot, setExtraShot] = useState<boolean>(false);
  const [bookingDuration, setBookingDuration] = useState<string>('2 Hours');
  const [loyaltyStamps, setLoyaltyStamps] = useState<number>(5); 
  const maxStamps = 9;

  const [customizer, setCustomizer] = useState<CustomizerState>({
    isOpen: false,
    itemName: '',
    basePrice: 0,
    type: 'drink'
  });

  // ─── ACTIVE MEMBER PROFILE IMAGES ───
  const [activeWallMembers] = useState<ActiveMemberPhoto[]>([
    { id: 1, name: 'Youssef E.', imgUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', status: 'In Salon' },
    { id: 2, name: 'Sarah J.', imgUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', status: 'Focus Desk' },
    { id: 3, name: 'Amine R.', imgUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', status: 'Meeting Rm' },
    { id: 4, name: 'Chloe M.', imgUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', status: 'In Salon' },
  ]);

  // ─── NETWORK PINGS & BULLETIN STORAGE DATA ───
  const [pings] = useState<PingItem[]>([
    { id: 1, user: 'Youssef El Alami', action: 'Available for UI/UX consulting', time: 'Just now', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80' },
    { id: 2, user: 'Sarah Jenkins', action: 'Building a Fintech startup from Marrakech', time: '5m ago', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80' },
  ]);

  const [bulletins, setBulletins] = useState<BulletinItem[]>([
    { id: 1, tag: 'Co-Working', title: 'Looking for a Full-Stack React Dev', desc: 'Need local collaboration for an e-commerce platform shipping architectural rugs.', postedBy: 'Amine R.' },
  ]);

  const [newAdTitle, setNewAdTitle] = useState('');
  const [newAdDesc, setNewAdDesc] = useState('');

  // ─── AUTHENTICATION FLOW SIMULATORS ───
  const handleOauthLogin = (provider: 'Google' | 'Apple') => {
    setGuestName(provider === 'Google' ? 'Google Member' : 'Apple Member');
    setShowChat(true);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setGuestName(email.split('@')[0]);
    setShowChat(true); 
  };

  const openCustomizer = (name: string, price: number, type: 'drink' | 'space' | 'pastry') => {
    setSelectedMilk('Standard Dairy');
    setExtraShot(false);
    setBookingDuration('2 Hours');
    setCustomizer({ isOpen: true, itemName: name, basePrice: price, type });
  };

  const confirmCustomizationAndAddToCart = () => {
    let finalPrice = customizer.basePrice;
    let details = [];

    if (customizer.type === 'drink') {
      if (selectedMilk !== 'Standard Dairy') {
        finalPrice += 6; 
        details.push(selectedMilk);
      }
      if (extraShot) {
        finalPrice += 10;
        details.push('+Extra Shot');
      }
    }

    if (customizer.type === 'space') {
      if (bookingDuration === 'Half Day (4h)') finalPrice = customizer.basePrice * 1.8;
      if (bookingDuration === 'Full Day (8h)') finalPrice = customizer.basePrice * 3.2;
      details.push(bookingDuration);
    }

    const detailString = details.length > 0 ? `(${details.join(', ')})` : '';

    setCart([...cart, {
      id: Math.random().toString(36).substring(2, 9),
      item: `${customizer.itemName} ${detailString}`.trim(),
      price: finalPrice
    }]);
    setCustomizer({ isOpen: false, itemName: '', basePrice: 0, type: 'drink' });
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

  // ─── VIEW 1: ACTIVE LOUNGE SPACE ───
  if (showChat) {
    return (
      <>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
        <main className="min-h-screen bg-[#F5F0E8] text-[#1A1714] font-['DM_Sans'] flex flex-col p-4 md:p-6 relative">
          
          {/* Universal Config Customizer Modal */}
          {customizer.isOpen && (
            <div className="fixed inset-0 bg-[#1A1714]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-[#F5F0E8] border border-[#D5CFC4] max-w-sm w-full p-6 rounded-[2px] space-y-5 shadow-xl text-left">
                <div>
                  <span className="text-[0.55rem] tracking-[0.15em] uppercase text-[#B8734A] block font-medium">Configure Request</span>
                  <h3 className="font-['Cormorant_Garamond'] text-2xl text-[#1A1714]">{customizer.itemName}</h3>
                </div>

                {customizer.type === 'drink' && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-[0.6rem] tracking-[0.12em] uppercase text-[#6B6460] font-medium">Milk Modifications</label>
                      {['Standard Dairy', 'Oat Milk (+6 MAD)', 'Almond Milk (+6 MAD)', 'Coconut Milk (+6 MAD)'].map((milk) => (
                        <button key={milk} type="button" onClick={() => setSelectedMilk(milk.split(' (')[0])} className={`w-full text-left px-3 py-2 rounded-[1px] border bg-transparent text-xs ${selectedMilk === milk.split(' (')[0] ? 'border-[#B8734A] text-[#B8734A] bg-[#EDEBE3]' : 'border-[#D5CFC4]'}`}>{milk}</button>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="text-[#6B6460] uppercase tracking-wider text-[0.6rem] font-medium">Add Extra Espresso Shot</span>
                      <button type="button" onClick={() => setExtraShot(!extraShot)} className={`px-3 py-1 border text-[0.65rem] uppercase tracking-widest ${extraShot ? 'bg-[#1A1714] text-[#F5F0E8] border-black' : 'bg-transparent border-[#D5CFC4]'}`}>
                        {extraShot ? 'Added (+10 MAD)' : 'Add shot'}
                      </button>
                    </div>
                  </div>
                )}

                {customizer.type === 'space' && (
                  <div className="space-y-2">
                    <label className="block text-[0.65rem] tracking-[0.12em] uppercase text-[#6B6460] font-medium">Reservation Duration</label>
                    {['Standard Block (2h)', 'Half Day (4h)', 'Full Day (8h)'].map((dur) => (
                      <button key={dur} type="button" onClick={() => setBookingDuration(dur)} className={`w-full text-left px-3 py-2 rounded-[1px] border bg-transparent text-xs ${bookingDuration === dur ? 'border-[#B8734A] text-[#B8734A] bg-[#EDEBE3]' : 'border-[#D5CFC4]'}`}>{dur}</button>
                    ))}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button onClick={() => setCustomizer({ isOpen: false, itemName: '', basePrice: 0, type: 'drink' })} className="flex-1 py-2 border border-[#D5CFC4] text-xs uppercase bg-transparent text-[#6B6460]">Cancel</button>
                  <button onClick={confirmCustomizationAndAddToCart} className="flex-1 py-2 bg-[#1A1714] text-[#F5F0E8] text-xs uppercase border-none cursor-pointer">Confirm Configuration</button>
                </div>
              </div>
            </div>
          )}

          {/* Header Layout */}
          <header className="max-w-7xl w-full mx-auto flex justify-between items-center border-b border-[#D5CFC4] pb-4 mb-6">
            <div>
              <h1 className="font-['Cormorant_Garamond'] text-2xl tracking-[0.2em] uppercase text-[#B8734A] font-light">T I M E</h1>
              <p className="text-[0.65rem] tracking-[0.1em] uppercase text-[#6B6460]">Marrakech · Workspace Hub & Specialty Bar</p>
            </div>
            <button onClick={() => setShowChat(false)} className="text-[0.65rem] tracking-[0.15em] uppercase border border-[#D5CFC4] px-3 py-1.5 rounded-[2px] hover:border-[#1A1714] transition-colors bg-transparent">← Exit Lounge</button>
          </header>

          {/* MASTER GRID SYSTEM Layout */}
          <div className="flex-1 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 items-start overflow-hidden pb-4">
            
            {/* ☕ EXTENDED SPECIALTY MENU SIDEBAR PANEL */}
            <aside className="lg:col-span-1 bg-[#EDEBE3] border border-[#D5CFC4] rounded-[2px] p-5 space-y-6 max-h-[50vh] lg:max-h-[78vh] overflow-y-auto style-scrollbar">
              
              {/* Ritual loyalty Card overview */}
              <div className="bg-[#1A1714] text-[#F5F0E8] p-4 rounded-[2px] border border-black space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-[0.5rem] tracking-[0.15em] text-[#C9A96E] uppercase font-semibold">Ritual Loop</span>
                  <span className="text-[0.65rem] bg-[#EDEBE3] text-[#1A1714] px-1.5 py-0.5 rounded-[2px] font-mono">{loyaltyStamps}/{maxStamps}</span>
                </div>
                <div className="grid grid-cols-5 gap-1 pt-1">
                  {Array.from({ length: maxStamps }).map((_, idx) => (
                    <div key={idx} className={`aspect-square rounded-full flex items-center justify-center text-[0.55rem] ${idx < loyaltyStamps ? 'bg-[#C9A96E] text-[#1A1714]' : 'bg-transparent border border-[#F5F0E8]/20 text-[#F5F0E8]/20'}`}>
                      {idx < loyaltyStamps ? '☕' : idx + 1}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="font-['Cormorant_Garamond'] text-base tracking-wider text-[#B8734A] uppercase mb-0.5">La Carte Café</h2>
                <div className="w-6 h-[1px] bg-[#B8734A]" />
              </div>

              <div className="space-y-4 text-xs">
                {/* Section A: Structural Pour Overs */}
                <div className="space-y-1.5">
                  <h3 className="text-[0.58rem] tracking-[0.15em] uppercase text-[#8A9E8C] font-semibold">Slow Brew & Pour Overs</h3>
                  <button onClick={() => openCustomizer('V60 Ethiopia Sidamo (Light Crop)', 45, 'drink')} className="w-full flex justify-between bg-transparent border-none p-0 text-left hover:text-[#B8734A] cursor-pointer"><span>Ethiopia V60 (Floral & Citrus)</span><span className="bg-[#FDFCF9] px-1 border border-[#D5CFC4]">45 MAD</span></button>
                  <button onClick={() => openCustomizer('Chemex Colombia Geisha', 55, 'drink')} className="w-full flex justify-between bg-transparent border-none p-0 text-left hover:text-[#B8734A] cursor-pointer"><span>Colombia Geisha (Honey Peach)</span><span className="bg-[#FDFCF9] px-1 border border-[#D5CFC4]">55 MAD</span></button>
                </div>

                {/* Section B: Standard Espresso Foundations */}
                <div className="space-y-1.5">
                  <h3 className="text-[0.58rem] tracking-[0.15em] uppercase text-[#8A9E8C] font-semibold">Espresso Frameworks</h3>
                  <button onClick={() => openCustomizer('Double Shot Espresso', 20, 'drink')} className="w-full flex justify-between bg-transparent border-none p-0 text-left hover:text-[#B8734A] cursor-pointer"><span>Double Espresso</span><span className="bg-[#FDFCF9] px-1 border border-[#D5CFC4]">20 MAD</span></button>
                  <button onClick={() => openCustomizer('Cortado', 25, 'drink')} className="w-full flex justify-between bg-transparent border-none p-0 text-left hover:text-[#B8734A] cursor-pointer"><span>Cortado</span><span className="bg-[#FDFCF9] px-1 border border-[#D5CFC4]">25 MAD</span></button>
                  <button onClick={() => openCustomizer('Flat White', 35, 'drink')} className="w-full flex justify-between bg-transparent border-none p-0 text-left hover:text-[#B8734A] cursor-pointer"><span>Flat White</span><span className="bg-[#FDFCF9] px-1 border border-[#D5CFC4]">35 MAD</span></button>
                  <button onClick={() => openCustomizer('Specialty Iced Latte', 38, 'drink')} className="w-full flex justify-between bg-transparent border-none p-0 text-left hover:text-[#B8734A] cursor-pointer"><span>Iced Latte</span><span className="bg-[#FDFCF9] px-1 border border-[#D5CFC4]">38 MAD</span></button>
                </div>

                {/* Section C: House Signatures */}
                <div className="space-y-1.5">
                  <h3 className="text-[0.58rem] tracking-[0.15em] uppercase text-[#8A9E8C] font-semibold">House Signatures</h3>
                  <button onClick={() => openCustomizer('Rose & Cardamom Crafted Latte', 45, 'drink')} className="w-full flex justify-between bg-transparent border-none p-0 text-left hover:text-[#B8734A] cursor-pointer"><span>Rose Cardamom Latte</span><span className="bg-[#FDFCF9] px-1 border border-[#D5CFC4]">45 MAD</span></button>
                  <button onClick={() => openCustomizer('Medina Orange Blossom Shakerato', 40, 'drink')} className="w-full flex justify-between bg-transparent border-none p-0 text-left hover:text-[#B8734A] cursor-pointer"><span>Orange Blossom Shakerato</span><span className="bg-[#FDFCF9] px-1 border border-[#D5CFC4]">40 MAD</span></button>
                  <button onClick={() => openCustomizer('Saffron Infused Cold Brew', 48, 'drink')} className="w-full flex justify-between bg-transparent border-none p-0 text-left hover:text-[#B8734A] cursor-pointer"><span>Saffron Tonic Cold Brew</span><span className="bg-[#FDFCF9] px-1 border border-[#D5CFC4]">48 MAD</span></button>
                </div>

                {/* Section D: Artisanal Bakery */}
                <div className="space-y-1.5">
                  <h3 className="text-[0.58rem] tracking-[0.15em] uppercase text-[#8A9E8C] font-semibold">Artisanal Bakery</h3>
                  <button onClick={() => openCustomizer('Pistachio Stuffed Croissant', 45, 'pastry')} className="w-full flex justify-between bg-transparent border-none p-0 text-left hover:text-[#B8734A] cursor-pointer"><span>Pistachio Croissant</span><span className="bg-[#FDFCF9] px-1 border border-[#D5CFC4]">45 MAD</span></button>
                  <button onClick={() => openCustomizer('Almond Brittle Twice-Baked Croissant', 40, 'pastry')} className="w-full flex justify-between bg-transparent border-none p-0 text-left hover:text-[#B8734A] cursor-pointer"><span>Almond Croissant</span><span className="bg-[#FDFCF9] px-1 border border-[#D5CFC4]">40 MAD</span></button>
                  <button onClick={() => openCustomizer('San Sebastián Sea-Salt Honey Cake', 50, 'pastry')} className="w-full flex justify-between bg-transparent border-none p-0 text-left hover:text-[#B8734A] cursor-pointer"><span>San Sebastián Honey Cake</span><span className="bg-[#FDFCF9] px-1 border border-[#D5CFC4]">50 MAD</span></button>
                </div>
              </div>
            </aside>

            {/* 🛰 MAIN INTERACTIVE MANAGEMENT CONSOLE */}
            <div className="lg:col-span-2 flex flex-col bg-[#FDFCF9] border border-[#D5CFC4] rounded-[2px] p-5 h-[70vh] lg:h-[78vh] justify-between">
              
              {/* Dynamic Action Window Toggles */}
              <div className="flex border-b border-[#D5CFC4] pb-2 mb-4 gap-6 text-xs uppercase tracking-widest font-medium overflow-x-auto whitespace-nowrap style-scrollbar">
                <button onClick={() => setActiveTab('chat')} className={`pb-1 bg-transparent border-none cursor-pointer ${activeTab === 'chat' ? 'border-b-2 border-[#B8734A] text-[#1A1714]' : 'text-[#B0A99E]'}`}>Salon AI (Anis)</button>
                <button onClick={() => setActiveTab('spaces')} className={`pb-1 bg-transparent border-none cursor-pointer ${activeTab === 'spaces' ? 'border-b-2 border-[#B8734A] text-[#1A1714]' : 'text-[#B0A99E]'}`}>Book Spaces & Pods</button>
                <button onClick={() => setActiveTab('checkout')} className={`pb-1 bg-transparent border-none cursor-pointer relative ${activeTab === 'checkout' ? 'border-b-2 border-[#B8734A] text-[#1A1714]' : 'text-[#B0A99E]'}`}>
                  Checkout Statement {cart.length > 0 && <span className="ml-1 bg-[#B8734A] text-[#F5F0E8] rounded-full text-[0.55rem] px-1">{cart.length}</span>}
                </button>
                <button onClick={() => setActiveTab('board')} className={`pb-1 bg-transparent border-none cursor-pointer ${activeTab === 'board' ? 'border-b-2 border-[#B8734A] text-[#1A1714]' : 'text-[#B0A99E]'}`}>Medina Board</button>
              </div>

              <div className="flex-1 overflow-y-auto pr-1 style-scrollbar">
                
                {/* SCREEN MODULE 1: ANIS CONVERSATIONS */}
                {activeTab === 'chat' && (
                  <div className="space-y-4 h-full flex flex-col justify-between">
                    <div className="space-y-4 overflow-y-auto flex-1 max-h-[50vh]">
                      {messages.length === 0 ? (
                        <div className="text-center py-16 space-y-2">
                          <p className="font-['Cormorant_Garamond'] italic text-xl text-[#6B6460]">"Salam Alaykum, {guestName || 'Friend'}."</p>
                          <p className="text-[0.65rem] tracking-[0.12em] uppercase text-[#8A9E8C]">Anis is tracking your preferences. Browse deep coffee crops or book infrastructure rooms above. ✨</p>
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
                      <input type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} placeholder="Inquire about coffee batches or workspace arrangements..." className="w-full bg-transparent py-2 outline-none text-xs border-b border-transparent focus:border-[#B8734A]" />
                      <button type="submit" className="absolute right-1 text-xs uppercase text-[#B8734A] font-medium bg-transparent border-none cursor-pointer">Send</button>
                    </form>
                  </div>
                )}

                {/* 🧱 RESTORED MODULE 2: WORKSPACE & INFRASTRUCTURE EXPERIENCES BOOKING INTERFACE */}
                {activeTab === 'spaces' && (
                  <div className="space-y-6 p-1 animate-[fadeUp_0.3s_ease_both]">
                    <div>
                      <h3 className="font-['Cormorant_Garamond'] text-xl text-[#1A1714]">Infrastructure & Workspace Bookings</h3>
                      <p className="text-[0.7rem] text-[#6B6460] uppercase tracking-wider">Select architectural resources. Durations can be adjusted inside the selector.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Space 1 */}
                      <div className="bg-[#EDEBE3]/50 border border-[#D5CFC4] p-4 rounded-[2px] flex flex-col justify-between space-y-3">
                        <div>
                          <span className="text-[0.55rem] uppercase tracking-widest bg-[#8A9E8C] text-[#F5F0E8] px-1.5 py-0.5 rounded-[1px]">Quiet Focus Zone</span>
                          <h4 className="text-sm font-medium mt-1.5">Dedicated Hot Desk Block</h4>
                          <p className="text-[0.68rem] text-[#6B6460] font-light mt-1">High-speed fiber connectivity, ergonomics, free mineral water flow.</p>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-xs font-semibold">150 MAD <span className="text-[0.65rem] font-light text-[#6B6460]">/ base block</span></span>
                          <button onClick={() => openCustomizer('Quiet Focus Desk Space Reservation', 150, 'space')} className="text-[0.6rem] uppercase tracking-widest bg-[#1A1714] text-[#F5F0E8] px-2.5 py-1.5 rounded-[1px] hover:bg-[#B8734A]">Select Space</button>
                        </div>
                      </div>

                      {/* Space 2 */}
                      <div className="bg-[#EDEBE3]/50 border border-[#D5CFC4] p-4 rounded-[2px] flex flex-col justify-between space-y-3">
                        <div>
                          <span className="text-[0.55rem] uppercase tracking-widest bg-[#B8734A] text-[#F5F0E8] px-1.5 py-0.5 rounded-[1px]">Private Enclave</span>
                          <h4 className="text-sm font-medium mt-1.5">Acoustic Calling & Zoom Pod</h4>
                          <p className="text-[0.68rem] text-[#6B6460] font-light mt-1">Sound-isolated glass box layout, studio ledger microphone, high refresh screen.</p>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-xs font-semibold">100 MAD <span className="text-[0.65rem] font-light text-[#6B6460]">/ base block</span></span>
                          <button onClick={() => openCustomizer('Acoustic Calling Pod Reservation', 100, 'space')} className="text-[0.6rem] uppercase tracking-widest bg-[#1A1714] text-[#F5F0E8] px-2.5 py-1.5 rounded-[1px] hover:bg-[#B8734A]">Select Space</button>
                        </div>
                      </div>

                      {/* Space 3 */}
                      <div className="bg-[#EDEBE3]/50 border border-[#D5CFC4] p-4 rounded-[2px] flex flex-col justify-between space-y-3 md:col-span-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[0.55rem] uppercase tracking-widest bg-[#C9A96E] text-[#1A1714] px-1.5 py-0.5 rounded-[1px] font-bold">Courtyard Meeting Studio</span>
                            <h4 className="text-sm font-medium mt-1.5">Premium Boardroom / Team Meeting Space</h4>
                            <p className="text-[0.68rem] text-[#6B6460] font-light mt-1">Accommodates up to 8 coworkers. Retractable presentation projectors, dedicated espresso service dispatcher console.</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center pt-1 border-t border-[#D5CFC4]/50">
                          <span className="text-xs font-semibold">400 MAD <span className="text-[0.65rem] font-light text-[#6B6460]">/ base block</span></span>
                          <button onClick={() => openCustomizer('Premium Boardroom Suite Reservation', 400, 'space')} className="text-[0.6rem] uppercase tracking-widest bg-[#1A1714] text-[#F5F0E8] px-3 py-1.5 rounded-[1px] hover:bg-[#B8734A]">Configure Boardroom</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* MODULE 3: CASH & APPLE PAY SECURE CHECKOUT LEDGER */}
                {activeTab === 'checkout' && (
                  <div className="space-y-6 p-1">
                    <h3 className="font-['Cormorant_Garamond'] text-xl text-[#1A1714]">Statement Invoice Consolidation</h3>
                    {cart.length === 0 ? (
                      <div className="text-center py-12 border border-dashed text-xs text-[#B0A99E] uppercase tracking-widest">Your statement panel has no active item lines.</div>
                    ) : (
                      <>
                        <div className="space-y-1.5">
                          {cart.map((c) => (
                            <div key={c.id} className="flex justify-between items-center text-xs py-2.5 border-b bg-[#EDEBE3]/40 px-3 rounded-[1px] border-[#D5CFC4]/40 animate-[fadeUp_0.15s_ease_both]">
                              <span>{c.item}</span>
                              <div className="flex items-center gap-4">
                                <span className="font-medium">{c.price} MAD</span>
                                <button onClick={() => setCart(cart.filter(i => i.id !== c.id))} className="text-red-700 bg-transparent border-none cursor-pointer text-[0.6rem] uppercase font-bold hover:underline">Wipe</button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between text-xs font-medium pt-4 border-t border-[#D5CFC4]">
                          <span className="uppercase tracking-widest text-[0.65rem] text-[#6B6460]">Aggregated Statement Inlay</span>
                          <span className="text-[#B8734A] font-bold text-base">{calculateTotal()} MAD</span>
                        </div>
                        
                        <div className="pt-2">
                          {paymentStatus === 'idle' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <button onClick={processCashPayment} type="button" className="w-full bg-[#8A9E8C] text-[#F5F0E8] text-[0.65rem] tracking-widest uppercase py-3.5 rounded-[2px] border-none cursor-pointer hover:bg-[#788C7A]">Pay Cash at Counter</button>
                              <button onClick={processApplePay} type="button" className="w-full bg-[#1A1714] text-[#F5F0E8] text-[0.65rem] tracking-widest uppercase py-3.5 rounded-[2px] flex items-center justify-center gap-1.5 border-none cursor-pointer hover:bg-black">
                                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 170 170"><path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.92-14.37-6.15-3.34-2.73-7.23-7.46-11.66-14.19-4.81-7.3-8.87-16.38-12.18-27.26-3.31-10.87-4.97-21.36-4.97-31.47 0-17.91 4.59-31.44 13.77-40.59 7.37-7.38 16.21-11.13 26.54-11.26 5.35 0 10.98 1.57 16.91 4.7 5.92 3.14 10.05 4.7 12.38 4.7 2.11 0 6.13-1.56 12.06-4.7 5.93-3.13 11.16-4.63 15.69-4.5 14.8.63 25.86 6.01 33.19 16.14-13.69 8.35-20.37 19.39-20.02 33.13.36 10.74 4.26 19.55 11.71 26.43 7.46 6.89 16.27 10.51 26.43 10.86-2.5 7.12-5.74 14.31-9.72 21.57zM119.22 35.6c0-8.48-3.04-16.03-9.11-22.66C104.05 6.3 96.58 2.64 87.7 2c.12 8.36 3.29 15.82 9.5 22.38 6.22 6.56 13.61 10.22 22.02 10.98v.24z"/></svg>
                                <span>Apple Pay Secure</span>
                              </button>
                            </div>
                          )}
                          {paymentStatus === 'processing_apple' && <div className="p-3 bg-[#EDEBE3] text-xs text-center uppercase tracking-wider rounded-[1px] animate-pulse">Authorizing Enclave TouchID / FaceID parameters...</div>}
                          {paymentStatus === 'processing_cash' && <div className="p-3 bg-[#EDEBE3] text-xs text-center uppercase tracking-wider rounded-[1px] animate-pulse">Routing invoice statements to bar system...</div>}
                          {paymentStatus === 'success_apple' && <div className="p-3 bg-[#8A9E8C] text-[#F5F0E8] text-xs text-center uppercase tracking-wider font-medium rounded-[1px]">✓ Settlement Success. Workspace slot authorized & +1 Stamp credited!</div>}
                          {paymentStatus === 'success_cash' && <div className="p-3 bg-[#B8734A] text-[#F5F0E8] text-xs text-center uppercase tracking-wider font-medium rounded-[1px]">✓ Logged. Please pay cash at front register counter to confirm stamp credit.</div>}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* MODULE 4: BULLETIN BOARD */}
                {activeTab === 'board' && (
                  <div className="space-y-6 p-1">
                    <h3 className="font-['Cormorant_Garamond'] text-xl text-[#1A1714]">The Medina Circle Bulletin</h3>
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

            {/* BRAND SPACE HIGHLIGHT BAR */}
            <aside className="lg:col-span-1 bg-[#1A1714] text-[#F5F0E8] border border-[#1A1714] rounded-[2px] p-5 h-full flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-[0.55rem] tracking-[0.2em] text-[#C9A96E] uppercase block font-semibold">Active Sanctuary</span>
                <p className="font-['Cormorant_Garamond'] italic text-lg leading-snug text-[#F5F0E8]/90">"Time is not something to be managed, but a territory to be inhabited thoughtfully."</p>
                <div className="w-6 h-[1px] bg-[#C9A96E] mt-2" />
              </div>
              <div className="text-[0.65rem] space-y-1.5 text-[#F5F0E8]/50 uppercase tracking-wider pt-8">
                <p>● Mesh Connection: 1 Gbps Fiber</p>
                <p>● Custom Milk Surcharges: Live</p>
                <p>● Space Reservation Slots: Active</p>
              </div>
            </aside>

          </div>
        </main>
      </>
    );
  }

  // ─── VIEW 2: SPLIT SCREEN INTERACTIVE DOORWAY ───
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400&display=swap" rel="stylesheet" />

      <main className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[#F5F0E8] text-[#1A1714] font-['DM_Sans',_sans-serif] font-light antialiased">
        
        {/* LEFT PANEL */}
        <section className="relative bg-[#1A1714] overflow-hidden flex flex-col justify-end p-8 md:p-12 min-h-[45vh] md:min-h-screen group">
          <div className="absolute inset-0 opacity-[0.07] pointer-events-none" style={{ backgroundImage: `repeating-linear-gradient(45deg, #C9A96E 0, #C9A96E 1px, transparent 0, transparent 50%), repeating-linear-gradient(-45deg, #C9A96E 0, #C9A96E 1px, transparent 0, transparent 50%)`, backgroundSize: '32px 32px' }} />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_70%,_rgba(184,115,74,0.18)_0%,_transparent_65%)] bg-gradient-to-t from-[#1A1714]/85 via-transparent to-[#1A1714]/20 pointer-events-none" />
          
          <div className="relative z-10 space-y-6 animate-[fadeUp_0.9s_ease_both] w-full">
            <div className="space-y-2.5">
              <span className="text-[0.55rem] tracking-[0.18em] uppercase text-[#8A9E8C] block font-semibold">Active In Courtyard Lounge Right Now</span>
              <div className="flex gap-3 flex-wrap">
                {activeWallMembers.map((m) => (
                  <div key={m.id} className="relative group/avatar flex flex-col items-center">
                    <img src={m.imgUrl} alt={m.name} className="w-10 h-10 rounded-full object-cover border border-[#C9A96E]/40 grayscale transition-all duration-300 group-hover/avatar:grayscale-0 group-hover/avatar:border-[#C9A96E]"/>
                    <div className="absolute -top-7 bg-[#1A1714] text-[#F5F0E8] text-[0.55rem] px-1.5 py-0.5 rounded-[1px] border border-[#C9A96E]/30 opacity-0 group-hover/avatar:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30">{m.name} · <span className="text-[#8A9E8C]">{m.status}</span></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-10 h-[1px] bg-[#C9A96E] mt-4" />
            <p className="font-['Cormorant_Garamond'] italic font-light text-4xl md:text-5xl lg:text-6xl text-[#F5F0E8] leading-[1.15] tracking-tight">A place where<br /><span className="not-italic text-[#C9A96E]">time</span> slows<br />down deliberately.</p>
            <div><p className="text-[0.78rem] tracking-[0.18em] uppercase text-[#8A9E8C] mb-1.5">Café · Marrakech · Guéliz</p><p className="text-[0.75rem] tracking-[0.08em] uppercase text-[#F5F0E8]/40">Members enjoy priority access, ritual rewards & seasonal menus</p></div>
          </div>
        </section>

        {/* RIGHT PANEL */}
        <section className="flex flex-col justify-center px-6 py-12 md:p-16 lg:p-24 bg-[#F5F0E8]">
          <div className="max-w-md w-full mx-auto space-y-8 animate-[fadeUp_0.9s_ease_both]">
            <div className="font-['Cormorant_Garamond',_serif] text-base font-normal tracking-[0.32em] uppercase text-[#B8734A] flex items-center gap-3"><div className="w-6 h-[1px] bg-[#B8734A]" />TIME</div>
            
            <div>
              <h1 className="font-['Cormorant_Garamond',_serif] text-3xl md:text-4xl font-light text-[#1A1714] leading-tight mb-2">Welcome back.</h1>
              <p className="text-[0.82rem] text-[#6B6460] leading-relaxed">Sign in to your membership space — or authorize secure social sync tunnels below.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button type="button" onClick={() => handleOauthLogin('Google')} className="py-2.5 px-4 bg-[#FDFCF9] text-[#1A1714] border border-[#D5CFC4] text-xs font-medium tracking-wider uppercase rounded-[2px] flex items-center justify-center gap-2 transition-colors hover:bg-[#EDEBE3] cursor-pointer"><svg className="w-3.5 h-3.5" viewBox="0 0 24 24"><path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.2-5.136 4.2A5.67 5.67 0 0 1 8.24 12.93a5.67 5.67 0 0 1 5.75-5.67c2.41 0 4.41 1.56 5.25 3.78l3.93-3.05C21.1 4.54 16.92 2.64 12.24 2.64a9.64 9.64 0 0 0-9.6 9.64a9.64 9.64 0 0 0 9.6 9.64c5.18 0 9.51-3.75 9.51-9.64c0-.66-.06-1.32-.15-1.995z"/></svg>Google Sync</button>
              <button type="button" onClick={() => handleOauthLogin('Apple')} className="py-2.5 px-4 bg-[#1A1714] text-[#F5F0E8] text-xs font-medium tracking-wider uppercase rounded-[2px] flex items-center justify-center gap-2 transition-colors hover:bg-black cursor-pointer border-none"><svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 170 170"><path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.92-14.37-6.15-3.34-2.73-7.23-7.46-11.66-14.19-4.81-7.3-8.87-16.38-12.18-27.26-3.31-10.87-4.97-21.36-4.97-31.47 0-17.91 4.59-31.44 13.77-40.59 7.37-7.38 16.21-11.13 26.54-11.26 5.35 0 10.98 1.57 16.91 4.7 5.92 3.14 10.05 4.7 12.38 4.7 2.11 0 6.13-1.56 12.06-4.7 5.93-3.13 11.16-4.63 15.69-4.5 14.8.63 25.86 6.01 33.19 16.14-13.69 8.35-20.37 19.39-20.02 33.13.36 10.74 4.26 19.55 11.71 26.43 7.46 6.89 16.27 10.51 26.43 10.86-2.5 7.12-5.74 14.31-9.72 21.57zM119.22 35.6c0-8.48-3.04-16.03-9.11-22.66C104.05 6.3 96.58 2.64 87.7 2c.12 8.36 3.29 15.82 9.5 22.38 6.22 6.56 13.61 10.22 22.02 10.98v.24z"/></svg>Apple Identity</button>
            </div>

            <div className="flex items-center gap-4 text-[0.6rem] tracking-[0.12em] uppercase text-[#6B6460]"><div className="flex-1 h-[1px] bg-[#D5CFC4]" />or sign with credentials<div className="flex-1 h-[1px] bg-[#D5CFC4]" /></div>

            <form onSubmit={handleSignIn} className="space-y-4 pt-1">
              <div className="space-y-1.5"><label htmlFor="email" className="block text-[0.68rem] tracking-[0.14em] uppercase text-[#6B6460]">Email</label><input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="w-full px-4 py-3 border border-[#D5CFC4] rounded-[2px] bg-[#FDFCF9] text-sm text-[#1A1714] outline-none focus:border-[#B8734A]" required /></div>
              <div className="space-y-1.5"><label htmlFor="password" className="block text-[0.68rem] tracking-[0.14em] uppercase text-[#6B6460]">Password</label><input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 border border-[#D5CFC4] rounded-[2px] bg-[#FDFCF9] text-sm text-[#1A1714] outline-none focus:border-[#B8734A]" required /></div>
              <button type="submit" className="w-full !mt-6 py-3.5 px-6 bg-[#1A1714] text-[#F5F0E8] font-medium text-[0.78rem] tracking-[0.16em] uppercase rounded-[2px] transition-all hover:bg-[#2E2A26] active:scale-[0.99] relative overflow-hidden group/btn"><span className="relative z-10">Sign in</span><div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C9A96E]/15 to-transparent -translateX-full transition-transform duration-700 ease-out group-hover/btn:translate-x-full" /></button>
            </form>

            <div className="flex items-center gap-4 text-[0.72rem] tracking-[0.1em] uppercase text-[#6B6460]"><div className="flex-1 h-[1px] bg-[#D5CFC4]" />or<div className="flex-1 h-[1px] bg-[#D5CFC4]" /></div>
            <button type="button" onClick={() => setShowChat(true)} className="w-full py-3 px-4 bg-transparent border border-[#D5CFC4] rounded-[2px] text-[0.78rem] tracking-[0.12em] uppercase text-[#6B6460] transition-colors hover:border-[#1A1714] hover:text-[#1A1714]">Continue as guest →</button>
          </div>
        </section>
      </main>

      <style jsx global>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .style-scrollbar::-webkit-scrollbar { width: 3px; height: 3px; }
        .style-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .style-scrollbar::-webkit-scrollbar-thumb { background: #D5CFC4; border-radius: 9px; }
      `}</style>
    </>
  );
}
