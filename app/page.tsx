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
  const [activeTab, setActiveTab] = useState<'chat' | 'spaces' | 'checkout' | 'board'>('chat');

  // ─── CHAT CONVERSATION STATES ───
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [guestName, setGuestName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ─── SYSTEM FUNCTIONAL STATES ───
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

    if (customizerType === 'drink') {
      if (selectedMilk !== 'Standard') { 
        finalPrice += 6; 
        details.push(selectedMilk); 
      }
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

  // ─── VIEW 1: ACTIVE LOUNGE (INSIDE HUB) ───
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
                <button onClick={confirmCustomizationAndAddToCart} className="flex-1 py-2 bg-[#1A1714] text-[#F5F0E8] text-xs uppercase border-none cursor-pointer">{lang === 'EN' ? 'Confirm Configuration' : 'Confirmer la Configuration'}</button>
              </div>
            </div>
          </div>
        )}

        {/* Top Navigation Bar with Inline Language Switcher */}
        <header className="max-w-7xl w-full mx-auto flex justify-between items-center border-b border-[#D5CFC4] pb-4 mb-6">
          <div>
            <h1 className="font-['Cormorant_Garamond'] text-2xl tracking-[0.2em] uppercase text-[#B8734A] font-light">T I M E</h1>
            <p className="text-[0.65rem] tracking-[0.1em] uppercase text-[#6B6460]">{lang === 'EN' ? 'Marrakech · Workspace Hub & Specialty Bar' : 'Marrakech · Espace de Travail & Bar de Spécialité'}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-xs uppercase tracking-widest font-medium border border-[#D5CFC4] rounded-[2px] p-1 flex gap-2 bg-[#EDEBE3]/50">
              <button onClick={() => setLang('EN')} className={`px-2 py-0.5 rounded-[1px] font-medium transition-colors ${lang === 'EN' ? 'bg-[#1A1714] text-[#F5F0E8]' : 'text-[#6B6460]'}`}>EN</button>
              <button onClick={() => setLang('FR')} className={`px-2 py-0.5 rounded-[1px] font-medium transition-colors ${lang === 'FR' ? 'bg-[#1A1714] text-[#F5F0E8]' : 'text-[#6B6460]'}`}>FR</button>
            </div>
            <button onClick={() => setShowChat(false)} className="text-[0.65rem] tracking-[0.15em] uppercase border border-[#D5CFC4] px-3 py-1.5 rounded-[2px] bg-transparent cursor-pointer hover:border-[#1A1714]">{lang === 'EN' ? '← Exit Lounge' : '← Quitter le Salon'}</button>
          </div>
        </header>

        {/* Guest Name Banner */}
        {!guestName && (
          <div className="max-w-md w-full mx-auto mb-6 bg-[#EDEBE3] p-6 rounded-[2px] border border-[#D5CFC4] text-center space-y-4">
            <p className="text-xs tracking-wide text-[#6B6460] uppercase font-medium">{lang === 'EN' ? "Before we summon the concierge, how shall Anis address you?" : "Avant d'appeler le concierge, comment Anis doit-il vous appeler ?"}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
              <input type="text" id="nameInput" placeholder={lang === 'EN' ? "Enter your name..." : "Entrez votre nom..."} className="w-full sm:w-64 px-4 py-2 border border-[#D5CFC4] rounded-[2px] bg-[#FDFCF9] text-sm text-center outline-none focus:border-[#B8734A]" onKeyDown={(e) => { if (e.key === 'Enter') { const val = (e.target as HTMLInputElement).value; if (val.trim()) setGuestName(val.trim()); } }} />
              <button type="button" onClick={() => { const inputEl = document.getElementById('nameInput') as HTMLInputElement; if (inputEl && inputEl.value.trim()) setGuestName(inputEl.value.trim()); }} className="w-full sm:w-auto px-5 py-2 bg-[#1A1714] text-[#F5F0E8] text-xs tracking-widest uppercase rounded-[2px] hover:bg-[#2E2A26] transition-colors">{lang === 'EN' ? 'Confirm' : 'Confirmer'}</button>
            </div>
          </div>
        )}

        {/* THREE-COLUMN SYSTEM MATRIX */}
        <div className="flex-1 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 items-start overflow-hidden pb-4">
          
          {/* CLEAN TYPOGRAPHIC SIDEBAR CATALOG PANEL */}
          <aside className="lg:col-span-1 bg-[#EDEBE3] border border-[#D5CFC4] rounded-[2px] p-4 space-y-6 max-h-[52vh] lg:max-h-[82vh] overflow-y-auto style-scrollbar">
            <div className="bg-[#1A1714] text-[#F5F0E8] p-4 rounded-[2px] border border-black space-y-2.5">
              <div className="flex justify-between items-center text-[0.6rem] uppercase tracking-widest">
                <span className="text-[#C9A96E] font-medium">{lang === 'EN' ? 'Ritual Loop' : 'Rituel Boucle'}</span>
                <span className="bg-[#EDEBE3] text-[#1A1714] px-1.5 py-0.5 rounded-[2px] font-mono">{loyaltyStamps}/{maxStamps}</span>
              </div>
              <div className="grid grid-cols-5 gap-1">
                {Array.from({ length: loyaltyStamps }).map((_, i) => <div key={i} className="aspect-square rounded-full bg-[#C9A96E] flex items-center justify-center text-[0.5rem]">☕</div>)}
              </div>
            </div>

            <div>
              <h2 className="font-['Cormorant_Garamond'] text-base tracking-wider text-[#B8734A] uppercase mb-0.5">{lang === 'EN' ? 'La Carte Café' : 'La Carte Spécialité'}</h2>
              <div className="w-6 h-[1px] bg-[#B8734A]" />
            </div>

            <div className="space-y-5">
              {/* Category A */}
              <div className="space-y-2">
                <h3 className="text-[0.58rem] tracking-[0.15em] uppercase text-[#8A9E8C] font-semibold mb-2">{lang === 'EN' ? 'Slow Brew & Pour Overs' : 'Extractions Douces'}</h3>
                <div className="space-y-2 text-xs">
                  <button onClick={() => openCustomizer('Ethiopia V60 Single Origin', 'V60 Éthiopie Origine Unique', 45, 'drink')} className="w-full flex justify-between bg-transparent border-none p-0 text-left hover:text-[#B8734A] cursor-pointer"><span>Ethiopia V60 (Floral & Citrus)</span><span className="bg-[#FDFCF9] px-1.5 py-0.5 border border-[#D5CFC4] text-[0.7rem] rounded-[2px]">45 MAD</span></button>
                  <button onClick={() => openCustomizer('Chemex Colombia Geisha', 'Chemex Colombie Geisha', 55, 'drink')} className="w-full flex justify-between bg-transparent border-none p-0 text-left hover:text-[#B8734A] cursor-pointer"><span>Colombia Geisha (Honey Peach)</span><span className="bg-[#FDFCF9] px-1.5 py-0.5 border border-[#D5CFC4] text-[0.7rem] rounded-[2px]">55 MAD</span></button>
                </div>
              </div>

              {/* Category B */}
              <div className="space-y-2">
                <h3 className="text-[0.58rem] tracking-[0.15em] uppercase text-[#8A9E8C] font-semibold mb-2">{lang === 'EN' ? 'Espresso Frameworks' : 'Bases Espresso'}</h3>
                <div className="space-y-2 text-xs">
                  <button onClick={() => openCustomizer('Double Espresso', 'Double Espresso', 20, 'drink')} className="w-full flex justify-between bg-transparent border-none p-0 text-left hover:text-[#B8734A] cursor-pointer"><span>Double Espresso</span><span className="bg-[#FDFCF9] px-1.5 py-0.5 border border-[#D5CFC4] text-[0.7rem] rounded-[2px]">20 MAD</span></button>
                  <button onClick={() => openCustomizer('Cortado', 'Cortado Classique', 25, 'drink')} className="w-full flex justify-between bg-transparent border-none p-0 text-left hover:text-[#B8734A] cursor-pointer"><span>Cortado</span><span className="bg-[#FDFCF9] px-1.5 py-0.5 border border-[#D5CFC4] text-[0.7rem] rounded-[2px]">25 MAD</span></button>
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN INTERACTIVE CORE BOARD */}
          <div className="lg:col-span-2 flex flex-col bg-[#FDFCF9] border border-[#D5CFC4] rounded-[2px] p-5 h-[72vh] lg:h-[82vh] justify-between">
            <div className="flex border-b border-[#D5CFC4] pb-2 mb-4 gap-6 text-xs uppercase tracking-widest font-medium overflow-x-auto whitespace-nowrap style-scrollbar">
              <button onClick={() => setActiveTab('chat')} className={`pb-1 bg-transparent border-none cursor-pointer ${activeTab === 'chat' ? 'border-b-2 border-[#B8734A] text-[#1A1714]' : 'text-[#B0A99E]'}`}>{lang === 'EN' ? 'Salon AI (Anis)' : 'Salon IA (Anis)'}</button>
              <button onClick={() => setActiveTab('spaces')} className={`pb-1 bg-transparent border-none cursor-pointer ${activeTab === 'spaces' ? 'border-b-2 border-[#B8734A] text-[#1A1714]' : 'text-[#B0A99E]'}`}>{lang === 'EN' ? 'Book Spaces & Pods' : 'Réserver des Espaces'}</button>
              <button onClick={() => setActiveTab('checkout')} className={`pb-1 bg-transparent border-none cursor-pointer relative ${activeTab === 'checkout' ? 'border-b-2 border-[#B8734A] text-[#1A1714]' : 'text-[#B0A99E]'}`}>{lang === 'EN' ? 'Checkout Statement' : 'Registre de Caisse'}</button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 style-scrollbar">
              {activeTab === 'chat' && (
                <div className="space-y-4 h-full flex flex-col justify-between">
                  <div className="space-y-4 overflow-y-auto flex-1 max-h-[52vh] flex flex-col justify-center text-center">
                    {messages.length === 0 ? (
                      <div className="space-y-3">
                        <p className="font-['Cormorant_Garamond'] italic text-2xl text-[#6B6460]">"Salam Alaykum, Friend."</p>
                        <p className="text-[0.7rem] tracking-[0.1em] text-[#8A9E8C] max-w-md mx-auto leading-relaxed">
                          {lang === 'EN' ? 'ANIS IS TRACKING YOUR PREFERENCES. BROWSE DEEP COFFEE CROPS OR BOOK INFRASTRUCTURE ROOMS ABOVE. ✨' : 'ANIS SUIT VOS PRÉFÉRENCES. PARCOUREZ LES CAFÉS DE SPÉCIALITÉ OU RÉSERVEZ DES ESPACES CI-DESSUS. ✨'}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4 overflow-y-auto flex-1 text-left">
                        {messages.map((m, i) => (
                          <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} animate-[fadeUp_0.2s_ease_both]`}>
                            <span className="text-[0.55rem] tracking-[0.1em] uppercase text-[#6B6460] mb-0.5">{m.role === 'user' ? (guestName || 'You') : 'Anis'}</span>
                            <div className={`max-w-[85%] text-xs p-3 rounded-[2px] ${m.role === 'user' ? 'bg-[#EDEBE3] border border-[#D5CFC4]' : 'bg-[#1A1714] text-[#F5F0E8]'}`}>{m.content}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    {isLoading && <p className="text-[0.65rem] tracking-[0.15em] uppercase text-[#8A9E8C] animate-pulse text-left">{lang === 'EN' ? 'Anis is pouring thoughts... 🍃' : 'Anis prépare ses pensées... 🍃'}</p>}
                  </div>
                  <form onSubmit={handleSendMessage} className="border-t border-[#D5CFC4] pt-3 flex items-center relative">
                    <input type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} placeholder={lang === 'EN' ? 'Inquire about coffee batches...' : 'Posez des questions sur les cafés...'} className="w-full bg-transparent py-2 outline-none text-xs border-b border-transparent focus:border-[#B8734A]" />
                    <button type="submit" className="absolute right-1 text-xs uppercase text-[#B8734A] font-medium bg-transparent border-none cursor-pointer">SEND</button>
                  </form>
                </div>
              )}

              {activeTab === 'spaces' && (
                <div className="space-y-6 p-1 animate-[fadeUp_0.3s_ease_both]">
                  <div>
                    <h3 className="font-['Cormorant_Garamond'] text-xl text-[#1A1714]">{lang === 'EN' ? 'Infrastructure & Workspace Bookings' : "Réservations d'Espaces & Postes de Travail"}</h3>
                    <p className="text-[0.7rem] text-[#6B6460] uppercase tracking-wider">{lang === 'EN' ? 'Select architectural resources.' : 'Sélectionnez vos ressources.'}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="border border-[#D5CFC4] bg-[#EDEBE3]/30 rounded-[1px] overflow-hidden flex flex-col group">
                      <div className="w-full h-36 relative overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80" alt="Desk" className="w-full h-full object-cover grayscale" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1714]/60 to-transparent" />
                        <span className="absolute top-3 left-3 text-[0.55rem] tracking-widest bg-[#8A9E8C] text-[#F5F0E8] px-2 py-0.5 rounded-[1px] uppercase font-medium">{lang === 'EN' ? 'Quiet Desk' : 'Zone Calme'}</span>
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <h4 className="text-sm font-medium text-[#1A1714]">{lang === 'EN' ? 'Dedicated Workspace Hot Desk' : 'Poste de Travail Dédié'}</h4>
                        <div className="flex justify-between items-center pt-2 border-t border-[#D5CFC4]/40">
                          <span className="text-xs font-semibold text-[#1A1714]">150 MAD <span className="text-[0.6rem] font-light text-[#6B6460]">{lang === 'EN' ? '/ base block' : '/ bloc de base'}</span></span>
                          <button onClick={() => openCustomizer('Dedicated Hot Desk Space Reservation', 'Réservation de Poste Dédié', 150, 'space')} className="text-[0.6rem] uppercase tracking-widest bg-[#1A1714] text-[#F5F0E8] px-3 py-1.5 rounded-[1px] border-none hover:bg-[#B8734A] cursor-pointer font-medium">{lang === 'EN' ? 'Select Space' : "Choisir l'Espace"}</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'checkout' && (
                <div className="space-y-6 p-1">
                  <h3 className="font-['Cormorant_Garamond'] text-xl text-[#1A1714]">{lang === 'EN' ? 'Statement Invoice Consolidation' : 'Consolidation de la Facture'}</h3>
                  {cart.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-[#D5CFC4] text-xs text-[#B0A99E] uppercase tracking-widest">{lang === 'EN' ? 'Your statement panel has no active item lines.' : 'Votre panier ne contient aucune ligne active.'}</div>
                  ) : (
                    <>
                      <div className="space-y-1.5">
                        {cart.map((c) => (
                          <div key={c.id} className="flex justify-between items-center text-xs py-2.5 border-b bg-[#EDEBE3]/40 px-3 rounded-[1px] border-[#D5CFC4]/40">
                            <span>{c.item}</span>
                            <div className="flex items-center gap-4">
                              <span className="font-medium">{c.price} MAD</span>
                              <button onClick={() => setCart(cart.filter(i => i.id !== c.id))} className="text-red-700 bg-transparent border-none text-[0.6rem] uppercase font-bold hover:underline cursor-pointer">{lang === 'EN' ? 'Wipe' : 'Effacer'}</button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between text-xs font-medium pt-4 border-t border-[#D5CFC4]">
                        <span className="uppercase tracking-widest text-[0.65rem] text-[#6B6460]">{lang === 'EN' ? 'Aggregated Statement Inlay' : 'Total de la Facture'}</span>
                        <span className="text-[#B8734A] font-bold text-base">{cart.reduce((acc, curr) => acc + curr.price, 0)} MAD</span>
                      </div>
                      <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button onClick={() => { setPaymentStatus('processing_cash'); setTimeout(() => { setPaymentStatus('success_cash'); setTimeout(() => { setCart([]); setPaymentStatus('idle'); }, 2000); }, 1000); }} className="w-full bg-[#8A9E8C] text-[#F5F0E8] text-xs py-3 rounded-[2px] border-none font-medium uppercase cursor-pointer">{lang === 'EN' ? 'Pay Cash at Counter' : 'Payer en Espèces'}</button>
                        <button onClick={() => { setPaymentStatus('processing_apple'); setTimeout(() => { setPaymentStatus('success_apple'); setTimeout(() => { setCart([]); setPaymentStatus('idle'); }, 2000); }, 1000); }} className="w-full bg-[#1A1714] text-[#F5F0E8] text-xs py-3 rounded-[2px] border-none font-medium uppercase cursor-pointer">{lang === 'EN' ? 'Apple Pay Secure' : 'Sécurisé Apple Pay'}</button>
                      </div>
                      {paymentStatus !== 'idle' && (
                        <div className="p-3 bg-[#EDEBE3] text-center text-xs uppercase text-[#1A1714] rounded-[2px]">
                          {paymentStatus === 'processing_cash' && (lang === 'EN' ? 'Routing invoice statements to bar system...' : 'Transmission au système du bar...')}
                          {paymentStatus === 'processing_apple' && (lang === 'EN' ? 'Authorizing TouchID/FaceID enclave...' : 'Autorisation des paramètres TouchID/FaceID...')}
                          {paymentStatus === 'success_cash' && (lang === 'EN' ? '✓ Logged. Settle bill with cashier.' : '✓ Enregistré. Veuillez régler au comptoir.')}
                          {paymentStatus === 'success_apple' && (lang === 'EN' ? '✓ Apple Pay Settled. Order sent.' : '✓ Règlement Réussi. Commande envoyée.')}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDE ACCENTS CARD */}
          <aside className="lg:col-span-1 bg-[#1A1714] text-[#F5F0E8] border border-[#1A1714] rounded-[2px] p-5 h-full flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[0.55rem] tracking-[0.2em] text-[#C9A96E] uppercase block font-semibold">Active Sanctuary</span>
              <p className="font-['Cormorant_Garamond'] italic text-lg leading-snug text-[#F5F0E8]/90">"Time is not something to be managed, but a territory to be inhabited thoughtfully."</p>
              <div className="w-6 h-[1px] bg-[#C9A96E] mt-2" />
            </div>
            <div className="text-[0.65rem] space-y-1.5 text-[#F5F0E8]/50 uppercase tracking-wider pt-8">
              <p>{lang === 'EN' ? '● MESH CONNECTION: 1 GBPS FIBER' : "● CONNEXION : FIBRE 1 GBPS"}</p>
              <p>{lang === 'EN' ? '● CUSTOM MILK SURCHARGES: LIVE' : "● SUPPLÉMENT LAIT VÉGÉTAL : LIVE"}</p>
              <p>{lang === 'EN' ? '● SPACE RESERVATION SLOTS: ACTIVE' : "● CRÉNEAUX DE RÉSERVATION : ACTIFS"}</p>
            </div>
          </aside>
        </div>
      </main>
    );
  }

  // ─── VIEW 2: SPLIT SCREEN INTERACTIVE ENTRY GATEWAY ───
  return (
    <main className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[#F5F0E8] text-[#1A1714] font-['DM_Sans',_sans-serif] font-light antialiased relative">
      
      {/* Absolute Language Selector */}
      <div className="absolute top-4 right-4 z-50 text-xs uppercase tracking-widest font-medium border border-[#D5CFC4] rounded-[2px] p-1 flex gap-2 bg-[#F5F0E8] shadow-sm">
        <button onClick={() => setLang('EN')} className={`px-2 py-0.5 rounded-[1px] ${lang === 'EN' ? 'bg-[#1A1714] text-[#F5F0E8]' : 'text-[#6B6460]'}`}>EN</button>
        <button onClick={() => setLang('FR')} className={`px-2 py-0.5 rounded-[1px] ${lang === 'FR' ? 'bg-[#1A1714] text-[#F5F0E8]' : 'text-[#6B6460]'}`}>FR</button>
      </div>

      {/* LEFT ATMOSPHERE PANEL */}
      <section className="relative bg-[#1A1714] overflow-hidden flex flex-col justify-end p-8 md:p-12 min-h-[45vh] md:min-h-screen group">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1541167760496-1628856ab772?w=1000&auto=format&fit=crop&q=80" alt="Espresso Pour" className="w-full h-full object-cover opacity-20 grayscale" />
        </div>
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-10" style={{ backgroundImage: `repeating-linear-gradient(45deg, #C9A96E 0, #C9A96E 1px, transparent 0, transparent 50%), repeating-linear-gradient(-45deg, #C9A96E 0, #C9A96E 1px, transparent 0, transparent 50%)`, backgroundSize: '32px 32px' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1714] via-[#1A1714]/75 to-transparent pointer-events-none z-10" />
        
        <div className="relative z-20 space-y-6 w-full text-left">
          <div className="space-y-2.5">
            <span className="text-[0.55rem] tracking-[0.18em] uppercase text-[#8A9E8C] block font-semibold">
              {lang === 'EN' ? 'Active In Courtyard Lounge Right Now' : 'Actif dans le Salon Courtyard en ce moment'}
            </span>
            <div className="flex gap-3 flex-wrap">
              <div className="relative flex flex-col items-center group/avatar">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" alt="Youssef" className="w-10 h-10 rounded-full object-cover border border-[#C9A96E]/40 grayscale shadow-sm"/>
                <div className="absolute -top-7 bg-[#1A1714] text-[#F5F0E8] text-[0.55rem] px-1.5 py-0.5 rounded-[1px] border border-[#C9A96E]/30 opacity-0 group-hover/avatar:opacity-100 duration-200 whitespace-nowrap z-30">Youssef E. · <span className="text-[#8A9E8C]">{lang === 'EN' ? 'In Salon' : 'Au Salon'}</span></div>
              </div>
              <div className="relative flex flex-col items-center group/avatar">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" alt="Sarah" className="w-10 h-10 rounded-full object-cover border border-[#C9A96E]/40 grayscale shadow-sm"/>
                <div className="absolute -top-7 bg-[#1A1714] text-[#F5F0E8] text-[0.55rem] px-1.5 py-0.5 rounded-[1px] border border-[#C9A96E]/30 opacity-0 group-hover/avatar:opacity-100 duration-200 whitespace-nowrap z-30">Sarah J. · <span className="text-[#8A9E8C]">{lang === 'EN' ? 'Focus Desk' : 'Bureau Focus'}</span></div>
              </div>
            </div>
          </div>

          <div className="w-10 h-[1px] bg-[#C9A96E] mt-4" />
          <p className="font-['Cormorant_Garamond'] italic font-light text-4xl md:text-5xl lg:text-6xl text-[#F5F0E8] leading-[1.15] tracking-tight">
            {lang === 'EN' ? 'A place where' : 'Un lieu où le'}<br />
            <span className="not-italic text-[#C9A96E]">{lang === 'EN' ? 'time' : 'temps'}</span> {lang === 'EN' ? 'slows down' : 'ralentit'}<br />
            {lang === 'EN' ? 'deliberately.' : 'délibérément.'}
          </p>
          <div>
            <p className="text-[0.78rem] tracking-[0.18em] uppercase text-[#8A9E8C] mb-1.5">Café · Marrakech · Guéliz</p>
            <p className="text-[0.75rem] tracking-[0.08em] uppercase text-[#F5F0E8]/40">
              {lang === 'EN' ? 'Members enjoy priority access, ritual rewards & seasonal menus' : "Les membres bénéficient d'un accès prioritaire, de récompenses rituelles et de menus saisonniers"}
            </p>
          </div>
        </div>
      </section>

      {/* RIGHT ACC CREDENTIAL PANEL */}
      <section className="flex flex-col justify-center px-6 py-12 md:p-16 lg:p-24 bg-[#F5F0E8]">
        <div className="max-w-md w-full mx-auto space-y-8 text-left">
          <div className="font-['Cormorant_Garamond',_serif] text-base font-normal tracking-[0.32em] uppercase text-[#B8734A] flex items-center gap-3"><div className="w-6 h-[1px] bg-[#B8734A]" />TIME</div>
          
          <div>
            <h1 className="font-['Cormorant_Garamond',_serif] text-3xl md:text-4xl font-light text-[#1A1714] leading-tight mb-2">{lang === 'EN' ? 'Welcome back.' : 'Bon retour.'}</h1>
            <p className="text-[0.82rem] text-[#6B6460] leading-relaxed">{lang === 'EN' ? 'Sign in to your membership space — or authorize secure social sync tunnels below.' : 'Connectez-vous à votre espace membre — ou autorisez la synchronisation sociale sécurisée ci-dessous.'}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button type="button" onClick={() => { setGuestName('Google User'); setShowChat(true); }} className="py-2.5 px-4 bg-[#FDFCF9] text-[#1A1714] border border-[#D5CFC4] text-xs font-medium tracking-wider uppercase rounded-[2px] flex items-center justify-center gap-2 transition-colors hover:bg-[#EDEBE3] cursor-pointer"><svg className="w-3.5 h-3.5" viewBox="0 0 24 24"><path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.2-5.136 4.2A5.67 5.67 0 0 1 8.24 12.93a5.67 5.67 0 0 1 8.24 12.93a5.67 5.67 0 0 1 5.75-5.67c2.41 0 4.41 1.56 5.25 3.78l3.93-3.05C21.1 4.54 16.92 2.64 12.24 2.64a9.64 9.64 0 0 0-9.6 9.64a9.64 9.64 0 0 0 9.6 9.64c5.18 0 9.51-3.75 9.51-9.64c0-.66-.06-1.32-.15-1.995z"/></svg>{lang === 'EN' ? 'Google Sync' : 'Synchro Google'}</button>
            <button type="button" onClick={() => { setGuestName('Apple User'); setShowChat(true); }} className="py-2.5 px-4 bg-[#1A1714] text-[#F5F0E8] text-xs font-medium tracking-wider uppercase rounded-[2px] flex items-center justify-center gap-2 transition-colors hover:bg-black cursor-pointer border-none"><svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 170 170"><path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.92-14.37-6.15-3.34-2.73-7.23-7.46-11.66-14.19-4.81-7.3-8.87-16.38-12.18-27.26-3.31-10.87-4.97-21.36-4.97-31.47 0-17.91 4.59-31.44 13.77-40.59 7.37-7.38 16.21-11.13 26.54-11.26 5.35 0 10.98 1.57 16.91 4.7 5.92 3.14 10.05 4.7 12.38 4.7 2.11 0 6.13-1.56 12.06-4.7 5.93-3.13 11.16-4.63 15.69-4.5 14.8.63 25.86 6.01 33.19 16.14-13.69 8.35-20.37 19.39-20.02 33.13.36 10.74 4.26 19.55 11.71 26.43 7.46 6.89 16.27 10.51 26.43 10.86-2.5 7.12-5.74 14.31-9.72 21.57zM119.22 35.6c0-8.48-3.04-16.03-9.11-22.66C104.05 6.3 96.58 2.64 87.7 2c.12 8.36 3.29 15.82 9.5 22.38 6.22 6.56 13.61 10.22 22.02 10.98v.24z"/></svg>{lang === 'EN' ? 'Apple Identity' : 'Identité Apple'}</button>
          </div>

          <div className="flex items-center gap-4 text-[0.6rem] tracking-[0.12em] uppercase text-[#6B6460]"><div className="flex-1 h-[1px] bg-[#D5CFC4]" />{lang === 'EN' ? 'or sign with credentials' : 'ou connectez-vous avec vos identifiants'}<div className="flex-1 h-[1px] bg-[#D5CFC4]" /></div>

          <form onSubmit={(e) => { e.preventDefault(); setGuestName(email.split('@')[0]); setShowChat(true); }} className="space-y-4 pt-1">
            <div className="space-y-1.5"><label htmlFor="email" className="block text-[0.68rem] tracking-[0.14em] uppercase text-[#6B6460]">Email</label><input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="w-full px-4 py-3 border border-[#D5CFC4] rounded-[2px] bg-[#FDFCF9] text-sm text-[#1A1714] outline-none focus:border-[#B8734A]" required /></div>
            <div className="space-y-1.5"><label htmlFor="password" className="block text-[0.68rem] tracking-[0.14em] uppercase text-[#6B6460]">Password</label><input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 border border-[#D5CFC4] rounded-[2px] bg-[#FDFCF9] text-sm text-[#1A1714] outline-none focus:border-[#B8734A]" required /></div>
            <button type="submit" className="w-full !mt-6 py-3.5 px-6 bg-[#1A1714] text-[#F5F0E8] font-medium text-[0.78rem] tracking-[0.16em] uppercase rounded-[2px] transition-all hover:bg-[#2E2A26] active:scale-[0.99] relative overflow-hidden group/btn"><span className="relative z-10">{lang === 'EN' ? 'Sign in' : 'Se connecter'}</span><div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C9A96E]/15 to-transparent -translateX-full transition-transform duration-700 ease-out group-hover/btn:translate-x-full" /></button>
          </form>

          <div className="flex items-center gap-4 text-[0.72rem] tracking-[0.1em] uppercase text-[#6B6460]"><div className="flex-1 h-[1px] bg-[#D5CFC4]" />or<div className="flex-1 h-[1px] bg-[#D5CFC4]" /></div>
          <button type="button" onClick={() => setShowChat(true)} className="w-full py-3 px-4 bg-transparent border border-[#D5CFC4] rounded-[2px] text-[0.78rem] tracking-[0.12em] uppercase text-[#6B6460] transition-colors hover:border-[#1A1714] hover:text-[#1A1714]">{lang === 'EN' ? 'Continue as guest →' : "Continuer en tant qu'invité →"}</button>
        </div>
      </section>
    </main>
  );
}
