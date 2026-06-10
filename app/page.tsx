'use client';

import React, { useState } from 'react';

interface CartItem {
  id: string;
  item: string;
  price: number;
}

export default function LuxuryVisualLoungeApp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [lang, setLang] = useState<'EN' | 'FR'>('EN');
  const [showChat, setShowChat] = useState(false);
  
  // ─── TABS RE-ORDERED: Spaces is now default ───
  const [activeTab, setActiveTab] = useState<'spaces' | 'chat' | 'checkout'>('spaces');

  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [guestName, setGuestName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing_apple' | 'processing_cash' | 'success_apple' | 'success_cash'>('idle');
  const [selectedMilk, setSelectedMilk] = useState<string>('Standard');
  const [loyaltyStamps, setLoyaltyStamps] = useState<number>(5);
  const maxStamps = 9;

  const [customizerIsOpen, setCustomizerIsOpen] = useState(false);
  const [customizerNameEN, setCustomizerNameEN] = useState('');
  const [customizerNameFR, setCustomizerNameFR] = useState('');
  const [customizerBasePrice, setCustomizerBasePrice] = useState(0);
  const [customizerType, setCustomizerType] = useState<'drink' | 'space' | 'pastry'>('drink');

  const openCustomizer = (nameEN: string, nameFR: string, price: number, type: 'drink' | 'space' | 'pastry') => {
    setSelectedMilk('Standard');
    setCustomizerNameEN(nameEN);
    setCustomizerNameFR(nameFR);
    setCustomizerBasePrice(price);
    setCustomizerType(type);
    setCustomizerIsOpen(true);
  };

  const confirmCustomizationAndAddToCart = () => {
    let finalPrice = customizerBasePrice;
    let details = [];
    const labelName = lang === 'EN' ? customizerNameEN : customizerNameFR;
    if (customizerType === 'drink' && selectedMilk !== 'Standard') { 
      finalPrice += 6; 
      details.push(selectedMilk); 
    }
    const detailString = details.length > 0 ? ` (${details.join(', ')})` : '';
    setCart([...cart, { id: Math.random().toString(36).substring(2, 9), item: `${labelName}${detailString}`, price: finalPrice }]);
    setCustomizerIsOpen(false);
    setActiveTab('checkout');
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
        body: JSON.stringify({ messages: updatedMessages, guestName: guestName || 'Guest' }),
      });
      const data = await response.json();
      setMessages([...updatedMessages, { role: 'assistant', content: data.reply }]);
    } catch (error) { console.error(error); } finally { setIsLoading(false); }
  };

  if (showChat) {
    return (
      <main className="min-h-screen bg-[#F5F0E8] text-[#1A1714] font-['DM_Sans'] flex flex-col p-4 md:p-6 relative">
        
        {/* Customizer Modal */}
        {customizerIsOpen && (
          <div className="fixed inset-0 bg-[#1A1714]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#F5F0E8] border border-[#D5CFC4] max-w-sm w-full p-6 rounded-[2px] space-y-5 shadow-xl text-left">
              <h3 className="font-['Cormorant_Garamond'] text-2xl text-[#1A1714]">{lang === 'EN' ? customizerNameEN : customizerNameFR}</h3>
              {customizerType === 'drink' && (
                <div className="space-y-2">
                  <label className="block text-[0.6rem] tracking-[0.12em] uppercase text-[#6B6460] font-medium">{lang === 'EN' ? 'Milk Inlay Customization' : 'Personnalisation du Lait'}</label>
                  {['Standard', 'Oat Milk', 'Almond Milk'].map((milk) => (
                    <button key={milk} type="button" onClick={() => setSelectedMilk(milk)} className={`w-full text-left px-3 py-2 rounded-[1px] border bg-transparent text-xs ${selectedMilk === milk ? 'border-[#B8734A] text-[#B8734A] bg-[#EDEBE3]' : 'border-[#D5CFC4]'}`}>{milk}</button>
                  ))}
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={() => setCustomizerIsOpen(false)} className="flex-1 py-2 border border-[#D5CFC4] text-xs uppercase bg-transparent text-[#6B6460]">{lang === 'EN' ? 'Cancel' : 'Annuler'}</button>
                <button onClick={confirmCustomizationAndAddToCart} className="flex-1 py-2 bg-[#1A1714] text-[#F5F0E8] text-xs uppercase border-none cursor-pointer font-medium">{lang === 'EN' ? 'Confirm' : 'Confirmer'}</button>
              </div>
            </div>
          </div>
        )}

        {/* 📱 Header Adaptive Fix */}
        <header className="max-w-7xl w-full mx-auto border-b border-[#D5CFC4] pb-4 mb-6 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
          <div className="space-y-0.5 max-w-[65%] sm:max-w-none">
            <h1 className="font-['Cormorant_Garamond'] text-2xl tracking-[0.2em] uppercase text-[#B8734A] font-light">T I M E</h1>
            <p className="text-[0.65rem] tracking-[0.1em] uppercase text-[#6B6460] leading-tight">
              {lang === 'EN' ? 'Marrakech · Workspace Hub & Specialty Bar' : 'Marrakech · Espace de Travail & Bar de Spécialité'}
            </p>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t border-[#D5CFC4]/30 sm:border-none">
            <div className="text-xs uppercase tracking-widest font-medium border border-[#D5CFC4] rounded-[2px] p-1 flex gap-2 bg-[#EDEBE3]/50">
              <button onClick={() => setLang('EN')} className={`px-2 py-0.5 rounded-[1px] transition-colors ${lang === 'EN' ? 'bg-[#1A1714] text-[#F5F0E8]' : 'text-[#6B6460]'}`}>EN</button>
              <button onClick={() => setLang('FR')} className={`px-2 py-0.5 rounded-[1px] transition-colors ${lang === 'FR' ? 'bg-[#1A1714] text-[#F5F0E8]' : 'text-[#6B6460]'}`}>FR</button>
            </div>
            <button onClick={() => setShowChat(false)} className="text-[0.65rem] tracking-[0.15em] uppercase border border-[#D5CFC4] px-2.5 py-1.5 rounded-[2px] bg-transparent cursor-pointer hover:border-[#1A1714] transition-colors">
              {lang === 'EN' ? '← Exit' : '← Quitter'}
            </button>
          </div>
        </header>

        {/* Guest Name */}
        {!guestName && (
          <div className="max-w-md w-full mx-auto mb-6 bg-[#EDEBE3] p-6 rounded-[2px] border border-[#D5CFC4] text-center space-y-4">
            <p className="text-xs tracking-wide text-[#6B6460] uppercase font-medium">{lang === 'EN' ? "How shall Anis address you?" : "Comment Anis doit-il vous appeler ?"}</p>
            <div className="flex gap-3 w-full">
              <input type="text" id="nameInput" placeholder="..." className="flex-1 px-4 py-2 border border-[#D5CFC4] rounded-[2px] bg-[#FDFCF9] text-sm focus:border-[#B8734A] outline-none" onKeyDown={(e) => { if (e.key === 'Enter') { const val = (e.target as HTMLInputElement).value; if (val.trim()) setGuestName(val.trim()); } }} />
              <button type="button" onClick={() => { const inputEl = document.getElementById('nameInput') as HTMLInputElement; if (inputEl && inputEl.value.trim()) setGuestName(inputEl.value.trim()); }} className="px-5 py-2 bg-[#1A1714] text-[#F5F0E8] text-xs tracking-widest uppercase rounded-[2px]">{lang === 'EN' ? 'OK' : 'Confirmer'}</button>
            </div>
          </div>
        )}

        <div className="flex-1 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 items-start overflow-hidden pb-4">
          
          {/* ☕ Concierge Menu Sidebar with High-Quality Thumbnails */}
          <aside className="lg:col-span-1 bg-[#EDEBE3] border border-[#D5CFC4] rounded-[2px] p-4 space-y-6 max-h-[52vh] lg:max-h-[82vh] overflow-y-auto style-scrollbar">
            
            <div className="bg-[#1A1714] text-[#F5F0E8] p-4 rounded-[2px] space-y-2">
              <div className="flex justify-between items-center text-[0.6rem] uppercase tracking-widest"><span className="text-[#C9A96E] font-medium">Ritual Loop</span><span>{loyaltyStamps}/{maxStamps}</span></div>
              <div className="grid grid-cols-5 gap-1">
                {Array.from({ length: loyaltyStamps }).map((_, i) => <div key={i} className="aspect-square rounded-full bg-[#C9A96E] flex items-center justify-center text-[0.5rem]">☕</div>)}
              </div>
            </div>

            <div className="space-y-6">
              {/* Beverages Section */}
              <div className="space-y-3">
                <h3 className="text-[0.6rem] tracking-[0.2em] uppercase text-[#8A9E8C] font-bold border-b border-[#D5CFC4] pb-1">{lang === 'EN' ? 'Beverages' : 'Boissons'}</h3>
                
                {/* Item 1 */}
                <button onClick={() => openCustomizer('Ethiopia V60', 'V60 Éthiopie', 45, 'drink')} className="w-full flex items-center gap-3 bg-transparent border-none p-0 group cursor-pointer text-left">
                  <img src="https://images.unsplash.com/photo-1544787210-2211d7c928c7?w=100&auto=format&fit=crop&q=80" className="w-12 h-12 object-cover grayscale group-hover:grayscale-0 rounded-[1px] transition-all" alt="Coffee"/>
                  <div className="flex-1">
                    <p className="text-xs font-medium group-hover:text-[#B8734A]">Ethiopia V60</p>
                    <p className="text-[0.6rem] text-[#6B6460]">45 MAD</p>
                  </div>
                </button>

                {/* Item 2 */}
                <button onClick={() => openCustomizer('Flat White', 'Flat White', 35, 'drink')} className="w-full flex items-center gap-3 bg-transparent border-none p-0 group cursor-pointer text-left">
                  <img src="https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=100&auto=format&fit=crop&q=80" className="w-12 h-12 object-cover grayscale group-hover:grayscale-0 rounded-[1px] transition-all" alt="Flat White"/>
                  <div className="flex-1">
                    <p className="text-xs font-medium group-hover:text-[#B8734A]">Flat White</p>
                    <p className="text-[0.6rem] text-[#6B6460]">35 MAD</p>
                  </div>
                </button>

                {/* Item 3 */}
                <button onClick={() => openCustomizer('Rose Cardamom Latte', 'Latte Rose Cardamome', 45, 'drink')} className="w-full flex items-center gap-3 bg-transparent border-none p-0 group cursor-pointer text-left">
                  <img src="https://images.unsplash.com/photo-1593444202268-51307610f4d4?w=100&auto=format&fit=crop&q=80" className="w-12 h-12 object-cover grayscale group-hover:grayscale-0 rounded-[1px] transition-all" alt="Latte"/>
                  <div className="flex-1">
                    <p className="text-xs font-medium group-hover:text-[#B8734A]">Rose Cardamom</p>
                    <p className="text-[0.6rem] text-[#6B6460]">45 MAD</p>
                  </div>
                </button>
              </div>

              {/* Pastry Section */}
              <div className="space-y-3">
                <h3 className="text-[0.6rem] tracking-[0.2em] uppercase text-[#8A9E8C] font-bold border-b border-[#D5CFC4] pb-1">{lang === 'EN' ? 'Bakery' : 'Boulangerie'}</h3>
                
                <button onClick={() => openCustomizer('Pistachio Croissant', 'Croissant Pistache', 45, 'pastry')} className="w-full flex items-center gap-3 bg-transparent border-none p-0 group cursor-pointer text-left">
                  <img src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=100&auto=format&fit=crop&q=80" className="w-12 h-12 object-cover grayscale group-hover:grayscale-0 rounded-[1px] transition-all" alt="Croissant"/>
                  <div className="flex-1">
                    <p className="text-xs font-medium group-hover:text-[#B8734A]">Pistachio Croissant</p>
                    <p className="text-[0.6rem] text-[#6B6460]">45 MAD</p>
                  </div>
                </button>
              </div>
            </div>
          </aside>

          {/* 🛰 Main Action Hub (Tabs Swapped) */}
          <div className="lg:col-span-2 flex flex-col bg-[#FDFCF9] border border-[#D5CFC4] rounded-[2px] p-5 h-[72vh] lg:h-[82vh] justify-between">
            <div className="flex border-b border-[#D5CFC4] pb-2 mb-4 gap-6 text-xs uppercase tracking-widest font-medium overflow-x-auto whitespace-nowrap style-scrollbar">
              {/* Tab Order Corrected */}
              <button onClick={() => setActiveTab('spaces')} className={`pb-1 bg-transparent border-none cursor-pointer ${activeTab === 'spaces' ? 'border-b-2 border-[#B8734A] text-[#1A1714]' : 'text-[#B0A99E]'}`}>{lang === 'EN' ? 'Book Spaces & Pods' : 'Réserver des Espaces'}</button>
              <button onClick={() => setActiveTab('chat')} className={`pb-1 bg-transparent border-none cursor-pointer ${activeTab === 'chat' ? 'border-b-2 border-[#B8734A] text-[#1A1714]' : 'text-[#B0A99E]'}`}>{lang === 'EN' ? 'Salon AI (Anis)' : 'Salon IA (Anis)'}</button>
              <button onClick={() => setActiveTab('checkout')} className={`pb-1 bg-transparent border-none cursor-pointer relative ${activeTab === 'checkout' ? 'border-b-2 border-[#B8734A] text-[#1A1714]' : 'text-[#B0A99E]'}`}>{lang === 'EN' ? 'Checkout' : 'Caisse'}</button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 style-scrollbar">
              
              {/* MODULE 1: SPACES (Now Default) */}
              {activeTab === 'spaces' && (
                <div className="space-y-6 animate-[fadeUp_0.3s_ease_both]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="border border-[#D5CFC4] bg-[#EDEBE3]/30 rounded-[1px] overflow-hidden flex flex-col group">
                      <div className="w-full h-36 relative overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80" alt="Desk" className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1714]/60 to-transparent" />
                        <span className="absolute top-3 left-3 text-[0.55rem] tracking-widest bg-[#8A9E8C] text-[#F5F0E8] px-2 py-0.5 rounded-[1px] uppercase font-medium">Quiet Desk</span>
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <h4 className="text-xs font-medium uppercase tracking-widest">{lang === 'EN' ? 'Dedicated Workspace' : 'Poste Dédié'}</h4>
                        <div className="flex justify-between items-center pt-2 mt-2 border-t border-[#D5CFC4]/40">
                          <span className="text-xs font-semibold text-[#1A1714]">150 MAD</span>
                          <button onClick={() => openCustomizer('Hot Desk Reservation', 'Poste de Travail', 150, 'space')} className="text-[0.6rem] uppercase tracking-widest bg-[#1A1714] text-[#F5F0E8] px-3 py-1.5 rounded-[1px] hover:bg-[#B8734A]">{lang === 'EN' ? 'Book' : 'Réserver'}</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* MODULE 2: ANIS CHAT */}
              {activeTab === 'chat' && (
                <div className="h-full flex flex-col">
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                    {messages.length === 0 ? (
                      <div className="text-center py-20 text-[#6B6460]">
                        <p className="font-['Cormorant_Garamond'] italic text-2xl">"Salam Alaykum, {guestName || 'Friend'}."</p>
                        <p className="text-[0.65rem] uppercase tracking-widest mt-2">{lang === 'EN' ? 'Anis is listening...' : 'Anis est à votre écoute...'}</p>
                      </div>
                    ) : (
                      messages.map((m, i) => (
                        <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} animate-[fadeUp_0.2s_ease_both]`}>
                          <span className="text-[0.5rem] tracking-widest uppercase text-[#6B6460] mb-1">{m.role === 'user' ? (guestName || 'You') : 'Anis'}</span>
                          <div className={`max-w-[85%] text-xs p-3 rounded-[1px] ${m.role === 'user' ? 'bg-[#EDEBE3] border border-[#D5CFC4]' : 'bg-[#1A1714] text-[#F5F0E8]'}`}>{m.content}</div>
                        </div>
                      ))
                    )}
                    {isLoading && <p className="text-[0.6rem] uppercase tracking-widest animate-pulse">...</p>}
                  </div>
                  <form onSubmit={handleSendMessage} className="border-t border-[#D5CFC4] pt-3 flex items-center relative">
                    <input type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} placeholder="..." className="w-full bg-transparent py-2 text-xs border-b border-transparent focus:border-[#B8734A] outline-none" />
                    <button type="submit" className="absolute right-0 text-[0.6rem] font-bold uppercase tracking-widest text-[#B8734A]">Send</button>
                  </form>
                </div>
              )}

              {/* MODULE 3: CHECKOUT */}
              {activeTab === 'checkout' && (
                <div className="space-y-5 animate-[fadeUp_0.3s_ease_both]">
                  <div className="space-y-2">
                    {cart.map((c) => (
                      <div key={c.id} className="flex justify-between items-center text-xs py-2 border-b border-[#D5CFC4]/30">
                        <span>{c.item}</span>
                        <div className="flex gap-4">
                          <span>{c.price} MAD</span>
                          <button onClick={() => setCart(cart.filter(i => i.id !== c.id))} className="text-red-700 uppercase font-bold text-[0.55rem]">X</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between font-bold text-sm pt-4 border-t border-[#D5CFC4]">
                    <span>TOTAL</span>
                    <span>{cart.reduce((a, b) => a + b.price, 0)} MAD</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-4">
                    <button onClick={() => { setPaymentStatus('success_cash'); setTimeout(() => { setCart([]); setPaymentStatus('idle'); }, 2000); }} className="bg-[#8A9E8C] text-[#F5F0E8] py-3 text-[0.6rem] uppercase tracking-widest rounded-[1px]">{lang === 'EN' ? 'Pay Cash' : 'Espèces'}</button>
                    <button onClick={() => { setPaymentStatus('success_apple'); setTimeout(() => { setCart([]); setPaymentStatus('idle'); }, 2000); }} className="bg-[#1A1714] text-[#F5F0E8] py-3 text-[0.6rem] uppercase tracking-widest rounded-[1px]">Apple Pay</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Status */}
          <aside className="lg:col-span-1 bg-[#1A1714] text-[#F5F0E8] border border-[#1A1714] rounded-[2px] p-5 h-full flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[0.5rem] tracking-[0.2em] text-[#C9A96E] uppercase block font-semibold">Sanctuary Node</span>
              <p className="font-['Cormorant_Garamond'] italic text-lg leading-snug opacity-90">"Time is not managed, but inhabited."</p>
              <div className="w-6 h-[1px] bg-[#C9A96E] mt-1" />
            </div>
            <div className="text-[0.6rem] space-y-1 opacity-50 uppercase tracking-widest font-medium">
              <p>● Fiber Connection: Active</p>
              <p>● Nodes: Marrakech / Guéliz</p>
            </div>
          </aside>
        </div>
      </main>
    );
  }

  // ─── VIEW 2: LOGIN ───
  return (
    <main className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[#F5F0E8] text-[#1A1714] font-['DM_Sans'] antialiased relative">
      <div className="absolute top-4 right-4 z-50 text-xs uppercase tracking-widest font-medium border border-[#D5CFC4] rounded-[2px] p-1 flex gap-2 bg-[#F5F0E8] shadow-sm">
        <button onClick={() => setLang('EN')} className={`px-2 py-0.5 rounded-[1px] ${lang === 'EN' ? 'bg-[#1A1714] text-[#F5F0E8]' : 'text-[#6B6460]'}`}>EN</button>
        <button onClick={() => setLang('FR')} className={`px-2 py-0.5 rounded-[1px] ${lang === 'FR' ? 'bg-[#1A1714] text-[#F5F0E8]' : 'text-[#6B6460]'}`}>FR</button>
      </div>

      <section className="relative bg-[#1A1714] overflow-hidden flex flex-col justify-end p-8 md:p-12 min-h-[45vh] md:min-h-screen group">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1541167760496-1628856ab772?w=1000&auto=format&fit=crop&q=80" alt="Espresso" className="w-full h-full object-cover opacity-20 grayscale transition-transform duration-1000 group-hover:scale-105" />
        </div>
        <div className="relative z-20 space-y-6 w-full text-left">
          <div className="flex gap-3">
             <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" className="w-8 h-8 rounded-full object-cover border border-[#C9A96E]/50 grayscale"/>
             <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" className="w-8 h-8 rounded-full object-cover border border-[#C9A96E]/50 grayscale"/>
          </div>
          <div className="w-10 h-[1px] bg-[#C9A96E]" />
          <p className="font-['Cormorant_Garamond'] italic font-light text-4xl md:text-5xl text-[#F5F0E8] leading-tight">
            {lang === 'EN' ? 'A place where time slows down.' : 'Un lieu où le temps ralentit.'}
          </p>
          <p className="text-[0.7rem] tracking-[0.18em] uppercase text-[#8A9E8C]">Marrakech · Guéliz</p>
        </div>
      </section>

      <section className="flex flex-col justify-center px-6 py-12 md:p-16 bg-[#F5F0E8]">
        <div className="max-w-md w-full mx-auto space-y-8 text-left">
          <div className="font-['Cormorant_Garamond'] text-base tracking-[0.32em] uppercase text-[#B8734A] flex items-center gap-3"><div className="w-6 h-[1px] bg-[#B8734A]" />TIME</div>
          <h1 className="font-['Cormorant_Garamond'] text-3xl font-light">{lang === 'EN' ? 'Welcome back.' : 'Bon retour.'}</h1>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button type="button" onClick={() => { setGuestName('Google User'); setShowChat(true); }} className="py-2.5 bg-[#FDFCF9] border border-[#D5CFC4] text-[0.6rem] uppercase tracking-widest font-bold">Google</button>
            <button type="button" onClick={() => { setGuestName('Apple User'); setShowChat(true); }} className="py-2.5 bg-[#1A1714] text-[#F5F0E8] text-[0.6rem] uppercase tracking-widest font-bold border-none">Apple</button>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); setGuestName(email.split('@')[0]); setShowChat(true); }} className="space-y-4 pt-1 border-t border-[#D5CFC4]/30 mt-6 pt-6">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full px-4 py-2 border border-[#D5CFC4] bg-[#FDFCF9] text-sm rounded-[1px] outline-none" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full px-4 py-2 border border-[#D5CFC4] bg-[#FDFCF9] text-sm rounded-[1px] outline-none" required />
            <button type="submit" className="w-full py-3 bg-[#1A1714] text-[#F5F0E8] text-[0.65rem] uppercase tracking-widest font-bold rounded-[1px]">{lang === 'EN' ? 'Sign in' : 'Se connecter'}</button>
          </form>
          <button type="button" onClick={() => setShowChat(true)} className="w-full py-3 border border-[#D5CFC4] text-[0.6rem] uppercase tracking-widest font-bold transition-colors hover:border-[#1A1714] mt-2">{lang === 'EN' ? 'Guest Access' : "Accès Invité"}</button>
        </div>
      </section>
    </main>
  );
}
