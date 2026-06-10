'use client';

import React, { useState } from 'react';

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
  skills?: string[];
  contact?: string;
}

interface BulletinItem {
  id: number;
  tag: string;
  title: string;
  desc: string;
  postedBy: string;
  contactHandle: string;
}

interface CustomizerState {
  isOpen: boolean;
  itemName: string;
  basePrice: number;
  hasMilkOptions: boolean;
}

export default function UltimateUnifiedLoungeApp() {
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

  // ─── FEATURE STATES ───
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing_apple' | 'processing_cash' | 'success_apple' | 'success_cash'>('idle');
  const [selectedMilk, setSelectedMilk] = useState<string>('Standard Dairy');
  
  // ─── RESTORED LOYALTY SCHEME STATE ENGINE ───
  const [loyaltyStamps, setLoyaltyStamps] = useState<number>(4); // Defaults to 4 stamps for onboarding representation
  const maxStamps = 9;

  // ─── DRINK CUSTOMIZER MODAL STATE ───
  const [customizer, setCustomizer] = useState<CustomizerState>({
    isOpen: false,
    itemName: '',
    basePrice: 0,
    hasMilkOptions: false
  });

  // ─── NETWORK & BULLETIN STORAGE DATA ───
  const [pings, setPings] = useState<PingItem[]>([
    { id: 1, user: 'Youssef El Alami', action: 'Available for UI/UX consulting', time: 'Just now', skills: ['Figma', 'Tailwind', 'Branding'], contact: '@youssef_design' },
    { id: 2, user: 'Sarah Jenkins', action: 'Building a Fintech startup from Marrakech', time: '5m ago', skills: ['Next.js', 'Supabase', 'VC Funding'], contact: 'sarah@finmedina.io' },
  ]);

  const [bulletins, setBulletins] = useState<BulletinItem[]>([
    { id: 1, tag: 'Co-Working Request', title: 'Looking for a Full-Stack React Dev', desc: 'Need local collaboration for an e-commerce platform shipping artisanal rugs globally.', postedBy: 'Amine R.', contactHandle: 'amine@medinarugs.ma' },
  ]);

  const [newAdTitle, setNewAdTitle] = useState('');
  const [newAdDesc, setNewAdDesc] = useState('');
  const [newAdTag, setNewAdTag] = useState('Networking');

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

    const newItem: CartItem = {
      id: Math.random().toString(36).substring(2, 9),
      item: `${customizer.itemName} ${details}`.trim(),
      price: finalPrice
    };

    setCart([...cart, newItem]);
    setCustomizer({ isOpen: false, itemName: '', basePrice: 0, hasMilkOptions: false });
    setActiveTab('checkout');
  };

  const removeFromCart = (idToRemove: string) => {
    setCart(cart.filter(item => item.id !== idToRemove));
  };

  const calculateTotal = () => cart.reduce((acc, curr) => acc + curr.price, 0);

  // Helper logic to credit a loyalty stamp when orders complete processing
  const awardLoyaltyStamp = () => {
    setLoyaltyStamps((prev) => {
      if (prev >= maxStamps) return 0; // Reset loop if they just claimed a free one
      return prev + 1;
    });
  };

  const processApplePay = () => {
    setPaymentStatus('processing_apple');
    setTimeout(() => {
      setPaymentStatus('success_apple');
      awardLoyaltyStamp(); // Earns a stamp on purchase completion
      setTimeout(() => { setCart([]); setPaymentStatus('idle'); }, 2500);
    }, 2000);
  };

  const processCashPayment = () => {
    setPaymentStatus('processing_cash');
    setTimeout(() => {
      setPaymentStatus('success_cash');
      awardLoyaltyStamp(); // Earns a stamp on purchase completion
      setTimeout(() => { setCart([]); setPaymentStatus('idle'); }, 3000);
    }, 1500);
  };

  const claimFreeReward = () => {
    if (loyaltyStamps >= maxStamps) {
      setLoyaltyStamps(0);
      alert("✨ Ritual Reward Claimed! Show this screen to your barista for a complimentary Specialty Brew or Pastry. 🥐");
    }
  };

  const postNewAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdTitle.trim() || !newAdDesc.trim()) return;
    const newBulletin: BulletinItem = {
      id: Date.now(), tag: newAdTag, title: newAdTitle, desc: newAdDesc,
      postedBy: guestName || 'Anonymous Member', contactHandle: email || '@medina_member'
    };
    setBulletins([newBulletin, ...bulletins]);
    setNewAdTitle(''); setNewAdDesc('');
  };

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

  if (showChat) {
    return (
      <>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
        <main className="min-h-screen bg-[#F5F0E8] text-[#1A1714] font-['DM_Sans'] flex flex-col p-4 md:p-6 relative">
          
          {/* Milk Customizer Modal */}
          {customizer.isOpen && (
            <div className="fixed inset-0 bg-[#1A1714]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
              <div className="bg-[#F5F0E8] border border-[#D5CFC4] max-w-sm w-full p-6 rounded-[2px] space-y-6 shadow-xl text-left">
                <div>
                  <span className="text-[0.6rem] tracking-[0.2em] text-[#B8734A] uppercase block font-semibold">Configure Selection</span>
                  <h3 className="font-['Cormorant_Garamond'] text-2xl text-[#1A1714] mt-0.5">{customizer.itemName}</h3>
                  <p className="text-xs text-[#6B6460] mt-1">Base Price: {customizer.basePrice} MAD</p>
                </div>

                {customizer.hasMilkOptions && (
                  <div className="space-y-3">
                    <label className="block text-[0.65rem] tracking-[0.12em] uppercase text-[#6B6460] font-medium">Milk Inlay Customization</label>
                    <div className="grid grid-cols-1 gap-2 text-xs">
                      {['Standard Dairy', 'Oat Milk (+5 MAD)', 'Almond Milk (+5 MAD)', 'Coconut Milk (+5 MAD)'].map((milk) => (
                        <button
                          key={milk} type="button" onClick={() => setSelectedMilk(milk.split(' (')[0])}
                          className={`w-full text-left px-3 py-2.5 rounded-[1px] border transition-colors bg-transparent ${selectedMilk === milk.split(' (')[0] ? 'border-[#B8734A] text-[#B8734A] font-medium bg-[#EDEBE3]' : 'border-[#D5CFC4] text-[#6B6460] hover:border-[#1A1714]'}`}
                        >{milk}</button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button onClick={() => setCustomizer({ isOpen: false, itemName: '', basePrice: 0, hasMilkOptions: false })} className="flex-1 py-2.5 border border-[#D5CFC4] text-xs uppercase tracking-widest text-[#6B6460] bg-transparent hover:text-[#1A1714]">Cancel</button>
                  <button onClick={confirmCustomizationAndAddToCart} className="flex-1 py-2.5 bg-[#1A1714] text-[#F5F0E8] text-xs uppercase tracking-widest rounded-[2px] hover:bg-[#B8734A] transition-colors border-none">Add to Order</button>
                </div>
              </div>
            </div>
          )}

          {/* Header Layout */}
          <header className="max-w-7xl w-full mx-auto flex justify-between items-center border-b border-[#D5CFC4] pb-4 mb-6">
            <div>
              <h1 className="font-['Cormorant_Garamond'] text-2xl tracking-[0.2em] uppercase text-[#B8734A] font-light">T I M E</h1>
              <p className="text-[0.65rem] tracking-[0.1em] uppercase text-[#6B6460]">Marrakech · Workspace Hub & Lounge</p>
            </div>
            <button onClick={() => setShowChat(false)} className="text-[0.65rem] tracking-[0.15em] uppercase border border-[#D5CFC4] px-3 py-1.5 rounded-[2px] hover:border-[#1A1714] transition-colors bg-transparent">← Exit Lounge</button>
          </header>

          {/* Guest Name Initialization Banner */}
          {!guestName && (
            <div className="max-w-md w-full mx-auto mb-6 bg-[#EDEBE3] p-6 rounded-[2px] border border-[#D5CFC4] text-center space-y-4 animate-[fadeUp_0.4s_ease_both]">
              <p className="text-xs tracking-wide text-[#6B6460] uppercase font-medium">Before we summon the concierge, how shall Anis address you?</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
                <input type="text" id="nameInput" placeholder="Enter your name..." className="w-full sm:w-64 px-4 py-2 border border-[#D5CFC4] rounded-[2px] bg-[#FDFCF9] text-sm text-center outline-none focus:border-[#B8734A]" onKeyDown={(e) => { if (e.key === 'Enter') { const val = (e.target as HTMLInputElement).value; if (val.trim()) setGuestName(val.trim()); } }} />
                <button type="button" onClick={() => { const inputEl = document.getElementById('nameInput') as HTMLInputElement; if (inputEl && inputEl.value.trim()) setGuestName(inputEl.value.trim()); }} className="w-full sm:w-auto px-5 py-2 bg-[#1A1714] text-[#F5F0E8] text-xs tracking-widest uppercase rounded-[2px] hover:bg-[#2E2A26] transition-colors">Confirm</button>
              </div>
            </div>
          )}

          {/* MASTER THREE-COLUMN LAYOUT */}
          <div className="flex-1 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 items-start overflow-hidden pb-4">
            
            {/* COLUMN 1: SIDEBAR INTERACTIVE ORDER CATALOG & LOYALTY CARD */}
            <aside className="lg:col-span-1 bg-[#EDEBE3] border border-[#D5CFC4] rounded-[2px] p-5 space-y-6 max-h-[45vh] lg:max-h-[75vh] overflow-y-auto">
              
              {/* 🎖 RESTORED: THE RITUAL LOYALTY STAR SCHEME CARD */}
              <div className="bg-[#1A1714] text-[#F5F0E8] p-4 rounded-[2px] border border-black space-y-3.5 shadow-md">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[0.5rem] tracking-[0.15em] text-[#C9A96E] uppercase block font-semibold">Ritual Circle</span>
                    <h3 className="font-['Cormorant_Garamond'] text-sm tracking-wide text-[#F5F0E8] uppercase font-medium">Coffee Rewards Card</h3>
                  </div>
                  <span className="text-[0.65rem] bg-[#EDEBE3] text-[#1A1714] px-1.5 py-0.5 rounded-[2px] font-mono font-medium">
                    {loyaltyStamps}/{maxStamps}
                  </span>
                </div>

                {/* Grid of Loyalty Stamp Circles */}
                <div className="grid grid-cols-5 gap-2 pt-1.5">
                  {Array.from({ length: maxStamps }).map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`aspect-square rounded-full flex items-center justify-center border text-[0.6rem] font-serif transition-all duration-300 ${idx < loyaltyStamps ? 'bg-[#C9A96E] border-[#C9A96E] text-[#1A1714] font-bold shadow-inner scale-105' : 'bg-transparent border-[#F5F0E8]/30 text-[#F5F0E8]/30'}`}
                    >
                      {idx < loyaltyStamps ? '☕' : idx + 1}
                    </div>
                  ))}
                  {/* Final 10th Spot Free Claim Node */}
                  <button 
                    type="button"
                    onClick={claimFreeReward}
                    disabled={loyaltyStamps < maxStamps}
                    className={`aspect-square rounded-full flex items-center justify-center border text-[0.55rem] font-medium transition-all p-0 ${loyaltyStamps >= maxStamps ? 'bg-[#8A9E8C] border-[#8A9E8C] text-[#F5F0E8] animate-pulse cursor-pointer hover:scale-105' : 'bg-transparent border-[#F5F0E8]/10 text-[#F5F0E8]/10 disabled:opacity-35'}`}
                  >
                    FREE
                  </button>
                </div>
                <p className="text-[0.58rem] text-[#F5F0E8]/40 uppercase tracking-wider text-center">Every order adds an authentic digital stamp block.</p>
              </div>

              {/* Order Selection Directory */}
              <div className="space-y-4 text-xs pt-2">
                <div>
                  <h3 className="text-[0.6rem] tracking-[0.15em] uppercase text-[#8A9E8C] font-semibold mb-2">Bespoke Coffee Bar</h3>
                  <div className="space-y-1.5">
                    <button onClick={() => openCustomizer('Cortado Espresso', 25, true)} className="w-full flex justify-between items-center text-left hover:text-[#B8734A] transition-colors group bg-transparent border-none p-0 cursor-pointer">
                      <span className="group-hover:underline">Cortado</span><span className="font-medium bg-[#FDFCF9] px-1.5 py-0.5 rounded-[2px] border border-[#D5CFC4]">25 MAD +</span>
                    </button>
                    <button onClick={() => openCustomizer('Rose & Cardamom Latte', 45, true)} className="w-full flex justify-between items-center text-left hover:text-[#B8734A] transition-colors group bg-transparent border-none p-0 cursor-pointer">
                      <span className="group-hover:underline">Rose Latte</span><span className="font-medium bg-[#FDFCF9] px-1.5 py-0.5 rounded-[2px] border border-[#D5CFC4]">45 MAD +</span>
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-[0.6rem] tracking-[0.15em] uppercase text-[#8A9E8C] font-semibold mb-2">Workspace Spaces</h3>
                  <div className="space-y-1.5">
                    <button onClick={() => openCustomizer('Quiet Focus Desk', 150, false)} className="w-full flex justify-between items-center text-left hover:text-[#B8734A] transition-colors group bg-transparent border-none p-0 cursor-pointer">
                      <span className="group-hover:underline">Quiet Focus Desk</span><span className="font-medium bg-[#FDFCF9] px-1.5 py-0.5 rounded-[2px] border border-[#D5CFC4]">150 MAD +</span>
                    </button>
                  </div>
                </div>
              </div>
            </aside>

            {/* COLUMN 2 & 3: CENTER NAVIGATION HUB AND CONSOLE PANELS */}
            <div className="lg:col-span-2 flex flex-col bg-[#FDFCF9] border border-[#D5CFC4] rounded-[2px] p-5 h-[68vh] lg:h-[75vh] justify-between">
              
              <div className="flex border-b border-[#D5CFC4] pb-2 mb-4 gap-6 text-xs uppercase tracking-widest font-medium overflow-x-auto whitespace-nowrap">
                <button onClick={() => setActiveTab('chat')} className={`pb-1 bg-transparent border-none cursor-pointer ${activeTab === 'chat' ? 'border-b-2 border-[#B8734A] text-[#1A1714]' : 'text-[#B0A99E]'}`}>Salon AI</button>
                <button onClick={() => setActiveTab('checkout')} className={`pb-1 bg-transparent border-none cursor-pointer relative ${activeTab === 'checkout' ? 'border-b-2 border-[#B8734A] text-[#1A1714]' : 'text-[#B0A99E]'}`}>
                  Checkout Register {cart.length > 0 && <span className="ml-1 bg-[#B8734A] text-[#F5F0E8] rounded-full text-[0.55rem] px-1">{cart.length}</span>}
                </button>
                <button onClick={() => setActiveTab('board')} className={`pb-1 bg-transparent border-none cursor-pointer ${activeTab === 'board' ? 'border-b-2 border-[#B8734A] text-[#1A1714]' : 'text-[#B0A99E]'}`}>Medina Board</button>
                <button onClick={() => setActiveTab('network')} className={`pb-1 bg-transparent border-none cursor-pointer ${activeTab === 'network' ? 'border-b-2 border-[#B8734A] text-[#1A1714]' : 'text-[#B0A99E]'}`}>Member Pings</button>
              </div>

              <div className="flex-1 overflow-y-auto pr-1 style-scrollbar">
                
                {/* WINDOW 1: CONVERSATION ENDPOINT */}
                {activeTab === 'chat' && (
                  <div className="space-y-4 h-full flex flex-col justify-between">
                    <div className="space-y-4 overflow-y-auto flex-1 max-h-[48vh] lg:max-h-[55vh]">
                      {messages.length === 0 ? (
                        <div className="text-center py-20 space-y-2">
                          <p className="font-['Cormorant_Garamond'] italic text-2xl text-[#6B6460]">"Salam Alaykum."</p>
                          <p className="text-[0.68rem] tracking-[0.12em] uppercase text-[#8A9E8C]">Anis is tracking your commands. Rewards update on checkout completion... ✨</p>
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
                      <input type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} placeholder={`Speak with Anis, ${guestName || 'Guest'}...`} className="w-full bg-transparent py-2 outline-none text-sm border-b border-transparent focus:border-[#B8734A]" />
                      <button type="submit" className="absolute right-1 text-xs uppercase tracking-widest text-[#B8734A] font-medium bg-transparent border-none cursor-pointer">Send</button>
                    </form>
                  </div>
                )}

                {/* WINDOW 2: BILLING WITH DUAL SELECTORS BACKED BY AUTOMATIC LOYALTY CREDIT PUSH */}
                {activeTab === 'checkout' && (
                  <div className="space-y-6 p-1 animate-[fadeUp_0.2s_ease_both]">
                    <div>
                      <h3 className="font-['Cormorant_Garamond'] text-xl text-[#1A1714]">Member Invoice Registry</h3>
                      <p className="text-[0.7rem] text-[#6B6460] uppercase tracking-wider">Completing payments adds 1 stamp block to your Ritual Circle card automatically.</p>
                    </div>
                    
                    {cart.length === 0 ? (
                      <div className="text-center py-12 border border-dashed border-[#D5CFC4] p-4 text-xs text-[#B0A99E] uppercase tracking-widest">Cart statements empty.</div>
                    ) : (
                      <>
                        <div className="space-y-2 max-h-[22vh] overflow-y-auto">
                          {cart.map((c) => (
                            <div key={c.id} className="flex justify-between items-center text-xs py-2 border-b border-[#D5CFC4]/50 bg-[#EDEBE3]/40 px-3 rounded-[1px]">
                              <span>{c.item}</span>
                              <div className="flex items-center gap-3">
                                <span className="font-medium text-[#1A1714]">{c.price} MAD</span>
                                <button onClick={() => removeFromCart(c.id)} className="text-[0.6rem] uppercase tracking-widest text-red-700 hover:underline bg-transparent border-none p-0 cursor-pointer">Remove</button>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between text-sm font-medium pt-3 border-t border-[#D5CFC4]">
                          <span>Grand Total Due</span> 
                          <span className="text-[#B8734A] font-bold text-base">{calculateTotal()} MAD</span>
                        </div>

                        <div className="pt-4 space-y-3">
                          {paymentStatus === 'idle' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <button onClick={processCashPayment} type="button" className="w-full bg-[#8A9E8C] hover:bg-[#788C7A] text-[#F5F0E8] text-xs tracking-widest uppercase font-medium py-3.5 rounded-[2px] border-none cursor-pointer transition-colors">Pay Cash at Counter</button>
                              <button onClick={processApplePay} type="button" className="w-full bg-[#1A1714] hover:bg-black text-[#F5F0E8] font-medium py-3.5 rounded-[2px] flex items-center justify-center gap-2 border-none cursor-pointer">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170"><path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.92-14.37-6.15-3.34-2.73-7.23-7.46-11.66-14.19-4.81-7.3-8.87-16.38-12.18-27.26-3.31-10.87-4.97-21.36-4.97-31.47 0-17.91 4.59-31.44 13.77-40.59 7.37-7.38 16.21-11.13 26.54-11.26 5.35 0 10.98 1.57 16.91 4.7 5.92 3.14 10.05 4.7 12.38 4.7 2.11 0 6.13-1.56 12.06-4.7 5.93-3.13 11.16-4.63 15.69-4.5 14.8.63 25.86 6.01 33.19 16.14-13.69 8.35-20.37 19.39-20.02 33.13.36 10.74 4.26 19.55 11.71 26.43 7.46 6.89 16.27 10.51 26.43 10.86-2.5 7.12-5.74 14.31-9.72 21.57zM119.22 35.6c0-8.48-3.04-16.03-9.11-22.66C104.05 6.3 96.58 2.64 87.7 2c.12 8.36 3.29 15.82 9.5 22.38 6.22 6.56 13.61 10.22 22.02 10.98v.24z"/></svg>
                                <span className="text-xs tracking-wide">Apple Pay</span>
                              </button>
                            </div>
                          )}

                          {paymentStatus === 'processing_apple' && <div className="w-full border border-[#D5CFC4] p-4 text-center text-xs text-[#6B6460] rounded-[2px] uppercase tracking-widest bg-[#EDEBE3] animate-pulse">Connecting to biometric Apple Pay layer... 🛡️</div>}
                          {paymentStatus === 'processing_cash' && <div className="w-full border border-[#D5CFC4] p-4 text-center text-xs text-[#6B6460] rounded-[2px] uppercase tracking-widest bg-[#EDEBE3] animate-pulse">Ticket sent to register. Please pay cashier... 🧾</div>}
                          {paymentStatus === 'success_apple' && <div className="w-full bg-[#8A9E8C] text-[#F5F0E8] p-4 text-center text-xs rounded-[2px] uppercase tracking-widest font-medium animate-bounce">✓ Apple Pay Settled. +1 loyalty Stamp Credited! ☕️</div>}
                          {paymentStatus === 'success_cash' && <div className="w-full bg-[#B8734A] text-[#F5F0E8] p-4 text-center text-xs rounded-[2px] uppercase tracking-widest font-medium">✓ Cash ticket logged. Complete payment at counter to authorize stamp. 🏺</div>}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* BULLETIN MODULE */}
                {activeTab === 'board' && (
                  <div className="space-y-6 p-1 animate-[fadeUp_0.2s_ease_both]">
                    <div>
                      <h3 className="font-['Cormorant_Garamond'] text-xl text-[#1A1714]">The Medina Circle Board</h3>
                      <p className="text-[0.7rem] text-[#6B6460] uppercase tracking-wider">A premium bridge for local remote workers to collaborate.</p>
                    </div>
                    <form onSubmit={postNewAd} className="bg-[#EDEBE3] p-4 rounded-[2px] border border-[#D5CFC4] space-y-3">
                      <span className="text-[0.6rem] tracking-widest uppercase font-bold text-[#B8734A] block">Broadcast Announcement</span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input type="text" placeholder="Headline..." value={newAdTitle} onChange={(e) => setNewAdTitle(e.target.value)} className="sm:col-span-2 px-3 py-1.5 border border-[#D5CFC4] text-xs bg-[#FDFCF9] outline-none rounded-[2px]" required />
                        <select value={newAdTag} onChange={(e) => setNewAdTag(e.target.value)} className="px-2 py-1.5 border border-[#D5CFC4] text-xs bg-[#FDFCF9] outline-none rounded-[2px] text-[#1A1714]"><option value="Collaboration">Collaboration</option><option value="Freelance Service">Freelance Service</option></select>
                      </div>
                      <textarea placeholder="Detail your information, handle or requests..." value={newAdDesc} onChange={(e) => setNewAdDesc(e.target.value)} className="w-full h-14 p-2 border border-[#D5CFC4] text-xs bg-[#FDFCF9] outline-none rounded-[2px] resize-none" required />
                      <button type="submit" className="w-full py-2 bg-[#1A1714] hover:bg-[#B8734A] text-[#F5F0E8] text-[0.65rem] tracking-widest uppercase rounded-[2px] transition-colors border-none cursor-pointer">Broadcast to Board</button>
                    </form>
                    <div className="space-y-3">
                      {bulletins.map((b) => (
                        <div key={b.id} className="bg-[#EDEBE3]/40 p-4 rounded-[2px] border border-[#D5CFC4] relative animate-[fadeUp_0.3s_ease_both]">
                          <span className="text-[0.55rem] tracking-widest uppercase bg-[#B8734A] text-[#F5F0E8] px-2 py-0.5 rounded-[1px] absolute top-4 right-4">{b.tag}</span>
                          <span className="text-[0.6rem] text-[#8A9E8C] uppercase font-semibold block">{b.postedBy}</span>
                          <h4 className="text-sm font-medium mt-1">{b.title}</h4>
                          <p className="text-xs text-[#6B6460] font-light mt-1">{b.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* NETWORK MEMBER REGISTRY */}
                {activeTab === 'network' && (
                  <div className="space-y-4 p-1 animate-[fadeUp_0.2s_ease_both]">
                    <h3 className="font-['Cormorant_Garamond'] text-xl text-[#1A1714]">Active Dashboard Directory</h3>
                    <div className="space-y-3">
                      {pings.map((p) => (
                        <div key={p.id} className="bg-[#EDEBE3]/40 border border-[#D5CFC4] p-4 rounded-[2px] flex justify-between items-start">
                          <div className="space-y-1">
                            <h4 className="text-sm font-medium text-[#1A1714]">{p.user}</h4>
                            <p className="text-xs text-[#6B6460] font-light">{p.action}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* COLUMN 4: BADGING CARD */}
            <aside className="lg:col-span-1 bg-[#1A1714] text-[#F5F0E8] border border-[#1A1714] rounded-[2px] p-5 space-y-4 h-full flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-[0.55rem] tracking-[0.2em] text-[#C9A96E] uppercase block font-semibold">Active Sanctuary</span>
                <p className="font-['Cormorant_Garamond'] italic text-lg leading-snug text-[#F5F0E8]/90">"Time is not something to be managed, but a territory to be inhabited thoughtfully."</p>
                <div className="w-6 h-[1px] bg-[#C9A96E] mt-2" />
              </div>
              <div className="text-[0.65rem] space-y-1 text-[#F5F0E8]/50 uppercase tracking-wider pt-8">
                <p>● Connection: High-Speed Fiber</p>
                <p>● Cash Settle Node: Active</p>
                <p>● Loyalty Cards: Functional</p>
              </div>
            </aside>

          </div>
        </main>
      </>
    );
  }

  // ─── COMPONENT VIEW 2: ENTRANCE ───
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
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </>
  );
}
