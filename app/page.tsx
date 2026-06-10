'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Coffee, Award, Home, ShoppingBag, Plus, X, Send, Calendar, Sparkles, Megaphone, Heart, Smartphone, Fingerprint, Wallet, CheckCircle, Briefcase, Loader2, MessageSquare, BellRing, GlassWater, Coins } from 'lucide-react';
import { supabase } from '@/app/supabaseClient';

interface MenuItem {
  id: number;
  name: string;
  desc: string;
  price: number;
  category: string;
  img: string;
}

interface CartItem extends MenuItem {
  cartId: number;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [activeCategory, setActiveCategory] = useState('All');
  const [reserveCategory, setReserveCategory] = useState('Workspace');
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Onboarding Wizard State Machine
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1); 
  
  // Dynamic captured inputs for live database entry
  const [onboardingName, setOnboardingName] = useState('');
  const [onboardingPhone, setOnboardingPhone] = useState('');
  const [signInPhone, setSignInPhone] = useState('');
  
  // Checkout & Interactive Modals
  const [checkoutStep, setCheckoutStep] = useState<string | null>(null); 
  const [paymentMethod, setPaymentMethod] = useState('applepay'); 
  const [showScanner, setShowScanner] = useState(false);
  
  // APPLE PAY SIMULATION STATE
  const [applePayState, setApplePayState] = useState('idle'); 

  // TECH PILLAR 1: AUTONOMOUS PAGER STATES
  const [tableNumber] = useState('Table 04'); 
  const [pagerStatus, setPagerStatus] = useState('idle'); 
  const [activeRequestType, setActiveRequestType] = useState('');

  // Rotating Dynamic States
  const [starProductIndex, setStarProductIndex] = useState(0);
  const [favorites, setFavorites] = useState<number[]>([1, 6]); 

  // Real-time Loyalty Points Engine State
  const [userPoints, setUserPoints] = useState(750);
  const [guestName, setGuestName] = useState('Alex');
  const [lang, setLang] = useState<'en' | 'fr'>('en');

  // Customer Profile Photo]
  const [customerPhoto] = useState('https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150');
  const [userHeadline, setUserHeadline] = useState('Creative Director');

  // Broadcast System States
  const [broadcasts, setBroadcasts] = useState<any[]>([]);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [isPostingBroadcast, setIsPostingBroadcast] = useState(false);

  // Chatbot States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Marhaban. Welcome to the serenity of TIME. I am Anis, your cultural and application guide. How may I elevate your lovely evening here in Marrakech? 🍃☕' }
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const t = {
    en: {
      greeting: 'Good morning', subtitle: 'Ready for something wonderful?', menuTitle: 'Our Menu', 
      rewardsTitle: 'Your Privileges', reserveTitle: 'Reservations', home: 'Home', menu: 'Order', 
      rewards: 'Rewards', reserve: 'Reserve', profile: 'Profile', cart: 'Cart', checkout: 'Checkout', pay: 'Confirm Order'
    },
    fr: {
      greeting: 'Bonjour', subtitle: 'Prêt pour quelque chose de merveilleux ?', menuTitle: 'Notre Carte', 
      rewardsTitle: 'Vos Privilèges', reserveTitle: 'Réservations', home: 'Accueil', menu: 'Commander', 
      rewards: 'Fidélité', reserve: 'Réserver', profile: 'Profil', cart: 'Panier', checkout: 'Payer', pay: 'Confirmer la commande'
    }
  };

  const menuItems: MenuItem[] = [
    { id: 1, name: 'Cortado', desc: 'Equal parts rich house espresso and softly steamed milk.', price: 25, category: 'Coffee', img: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 2, name: 'Single Origin Pour Over', desc: 'Bright citrus notes and a floral finish.', price: 45, category: 'Coffee', img: 'https://images.pexels.com/photos/374885/pexels-photo-374885.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { id: 3, name: 'Espresso (Takeaway)', desc: 'Signature house espresso inside an insulated TIME cup.', price: 20, category: 'Coffee', img: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 4, name: 'Iced Espresso Shakerato', desc: 'Double espresso vigorously shaken over ice with cane syrup.', price: 35, category: 'Coffee', img: 'https://images.pexels.com/photos/2615323/pexels-photo-2615323.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { id: 5, name: 'Rose & Cardamom Latte', desc: 'Moroccan-inspired latte with rose water, cardamom, and espresso.', price: 45, category: 'Signature', img: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { id: 6, name: 'Pistachio Stuffed Croissant', desc: 'Croissant overflowing with dynamic pistachio cream lines.', price: 45, category: 'Bakery', img: 'https://images.pexels.com/photos/8089414/pexels-photo-8089414.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { id: 7, name: 'Fudge Cocoa Brownie', desc: 'Dense fudge dark chocolate slice dusted with Maldon sea salt grains.', price: 35, category: 'Bakery', img: 'https://images.pexels.com/photos/2067396/pexels-photo-2067396.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { id: 8, name: 'San Sebastián Honey Cake', desc: ' Basque sponge saturated with organic Atlas honey.', price: 50, category: 'Bakery', img: 'https://images.pexels.com/photos/2144112/pexels-photo-2144112.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { id: 9, name: 'TIME x Atlas Lioness Tee', desc: 'Women’s luxury heavy-knit sand tee celebrating Moroccan football pride.', price: 380, category: 'Merch', img: 'https://images.pexels.com/photos/4557879/pexels-photo-4557879.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { id: 10, name: 'TIME Matte Stoneware Mug', desc: 'TIME Branded signature custom clay cup layout fired locally.', price: 160, category: 'Merch', img: 'https://images.pexels.com/photos/2615326/pexels-photo-2615326.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { id: 11, name: 'Medina Brass Keyring', desc: 'Solid brass tag bound with traditional premium stitched brown leather.', price: 90, category: 'Merch', img: 'https://images.pexels.com/photos/1194036/pexels-photo-1194036.jpeg?auto=compress&cs=tinysrgb&w=500' }
  ];

  const reserveItems = [
    { id: 101, name: 'Quiet Focus Desk', desc: 'High-speed Wi-Fi, unlimited drip coffee, and ergonomic seating.', price: '150 MAD / 4 Hrs', category: 'Workspace', img: 'https://images.pexels.com/photos/3182834/pexels-photo-3182834.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { id: 102, name: 'Private Meeting Room', desc: 'Seats 4. Screen mirroring, whiteboard, and table service included.', price: '400 MAD / 2 Hrs', category: 'Workspace', img: 'https://images.pexels.com/photos/260686/pexels-photo-260686.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { id: 103, name: 'Artisan Leather Masterclass', desc: 'Work alongside master Medina tanners to carve, stitch, and dye your own passport folder.', price: '350 MAD / Slot', category: 'Experiences', img: 'https://images.pexels.com/photos/2162938/pexels-photo-2162938.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { id: 104, name: 'Lego Education Lab', desc: 'Project building and modular robotic coding slots designed for young learners.', price: '200 MAD / Slot', category: 'Experiences', img: 'https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg?auto=compress&cs=tinysrgb&w=600' }
  ];

  const starProducts = [
    { title: 'Moroccan Mint Tea Ritual 🍃', desc: 'Authentic organic green gun-powder leaf tea poured over mountain sprigs.', img: 'https://images.pexels.com/photos/847402/pexels-photo-847402.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { title: 'Artisan Leather Crafting 🧵', desc: 'Carve and dye your own customized full-grain Moroccan leather travel fobs.', img: 'https://images.pexels.com/photos/2162938/pexels-photo-2162938.jpeg?auto=compress&cs=tinysrgb&w=400' }
  ];

  const claimableRewards = [
    { id: 'r1', name: 'Free House Coffee', pointsCost: 300, type: 'coffee' },
    { id: 'r2', name: 'Artisan Pastry of Choice', pointsCost: 500, type: 'pastry' }
  ];

  const activeLoungeMembers = [
    { id: 'm1', name: 'Youssef Benjelloun', role: 'Architect & Restorer', status: 'In Workspace 1', img: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100' },
    { id: 'm2', name: 'Elena Rostova', role: 'Fine Art Photographer', status: 'In Lounge Area', img: 'https://images.pexels.com/photos/38554/girl-people-landscape-sun-38554.jpeg?auto=compress&cs=tinysrgb&w=100' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isTyping]);

  useEffect(() => {
    if (activeTab !== 'home') return;
    const interval = setInterval(() => {
      setStarProductIndex((prev) => (prev + 1) % starProducts.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [activeTab]);

  const fetchBroadcasts = async () => {
    try {
      const { data, error } = await supabase
        .from('broadcasts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setBroadcasts(data || []);
    } catch (err: any) {
      console.error('Error getting broadcasts:', err.message);
    }
  };

  useEffect(() => {
    fetchBroadcasts();
  }, []);

  const handlePostBroadcast = async () => {
    if (!broadcastMessage.trim()) return;
    setIsPostingBroadcast(true);

    try {
      const activePhone = onboardingPhone || 'Guest_' + Date.now();
      const { error } = await supabase.from('broadcasts').insert([{
        phone_number: activePhone,
        author_name: guestName,
        headline: userHeadline,
        message: broadcastMessage
      }]);

      if (error) throw error;
      setBroadcastMessage('');
      setShowBroadcastModal(false);
      fetchBroadcasts();
    } catch (err: any) {
      alert('Could not publish broadcast layout: ' + err.message);
    } finally {
      setIsPostingBroadcast(false);
    }
  };

  const handleTriggerAutonomousPager = async (type: string) => {
    setActiveRequestType(type);
    setPagerStatus('transmitting');

    try {
      const activePhone = onboardingPhone || 'Guest_Pager';
      const { error } = await supabase.from('service_requests').insert([{
        phone_number: activePhone,
        guest_name: guestName,
        table_number: tableNumber,
        request_type: type,
        status: 'pending'
      }]);

      if (error) throw error;

      setTimeout(() => {
        setPagerStatus('active');
      }, 1200);

    } catch (err: any) {
      console.error("Pager failed to broadcast:", err.message);
      setPagerStatus('idle');
    }
  };

  const handleCancelPagerRequest = () => {
    setPagerStatus('idle');
    setActiveRequestType('');
  };

  const filteredMenu = activeCategory === 'All' ? menuItems : menuItems.filter(item => item.category === activeCategory);
  const filteredReserve = reserveItems.filter(item => item.category === reserveCategory);
  const cartTotal = cart.reduce((total, totalItem) => total + totalItem.price, 0);

  const handleToggleFavorite = (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const handleDirectAddToCart = (item: MenuItem) => {
    setCart([...cart, { 
      ...item, 
      cartId: Date.now() 
    }]);
  };

  const handleInitiateOrderConfirmation = () => {
    if (paymentMethod === 'applepay') {
      setApplePayState('prompt'); 
    } else {
      executeDatabaseCheckoutPointsSync(); 
    }
  };

  const handleSimulateFaceIDScan = () => {
    setApplePayState('scanning');
    
    setTimeout(() => {
      setApplePayState('success');
      
      setTimeout(() => {
        executeDatabaseCheckoutPointsSync();
        setApplePayState('idle');
      }, 1500);
    }, 2200);
  };

  const executeDatabaseCheckoutPointsSync = async () => {
    const calculatedEarnedPoints = cartTotal * 1; 
    setCheckoutStep('confirmed');

    try {
      if (isLoggedIn && onboardingPhone) {
        const nextPointsValue = userPoints + calculatedEarnedPoints;
        const { error } = await supabase
          .from('profiles')
          .update({ user_points: nextPointsValue })
          .eq('phone_number', onboardingPhone);

        if (error) throw error;
        setUserPoints(nextPointsValue);
      } else {
        setUserPoints(prev => prev + calculatedEarnedPoints);
      }
    } catch (err: any) {
      console.error("Failed to sync points on checkout:", err.message);
    }

    setTimeout(() => {
      setCart([]);
      setCheckoutStep(null);
      setActiveTab('home');
    }, 4000);
  };

  const handleClaimReward = async (reward: { name: string; pointsCost: number }) => {
    if (userPoints >= reward.pointsCost) {
      const nextPointsValue = userPoints - reward.pointsCost;
      
      try {
        if (isLoggedIn && onboardingPhone) {
          const { error } = await supabase
            .from('profiles')
            .update({ user_points: nextPointsValue })
            .eq('phone_number', onboardingPhone);

          if (error) throw error;
        }
        setUserPoints(nextPointsValue);
        alert(`Success! Reward pass created for ${reward.name}`);
      } catch (err: any) {
        alert("Sync error during point exchange: " + err.message);
      }
    } else {
      alert("Insufficient points balance.");
    }
  };

  const handlePingMember = (name: string) => {
    alert(`Salutations sent! An elite digital connection pass has been transmitted securely to ${name}'s radar stream.`);
  };

  const getTierLabel = (pts: number) => {
    if (pts >= 5000) return 'Royal Elite Pass';
    if (pts >= 1500) return 'Majorelle Member';
    return 'Medina Guest';
  };

  const fetchChatHistoryFromSupabase = async (phone: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('sender, message_text')
        .eq('phone_number', phone)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        const reformattedMessages = data.map((msg: any) => ({
          sender: msg.sender,
          text: msg.message_text
        }));
        setChatMessages(reformattedMessages);
      }
    } catch (err: any) {
      console.error("Could not load past cloud messages:", err.message);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userText = chatInput;
    const activeUserPhone = onboardingPhone || 'Guest_Session';

    const newHistory = [...chatMessages, { sender: 'user', text: userText }];
    setChatMessages(newHistory);
    setChatInput('');
    setIsTyping(true);

    try {
      await supabase.from('chat_messages').insert([{
        phone_number: activeUserPhone,
        sender: 'user',
        message_text: userText
      }]);
    } catch (e) {
      console.error("Supabase fail to log user row:", e);
    }

    const recentHistory = newHistory.slice(-4);
    const chatHistoryForAI = recentHistory.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    }));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatHistoryForAI,
          guestName: guestName
        })
      });

      const data = await response.json();
      const botReply = data.reply;

      setChatMessages(prev => [...prev, { sender: 'bot', text: botReply }]);

      try {
        await supabase.from('chat_messages').insert([{
          phone_number: activeUserPhone,
          sender: 'bot',
          message_text: botReply
        }]);
      } catch (e) {
        console.error("Supabase fail to log bot row:", e);
      }

    } catch (err) {
      setChatMessages(prev => [...prev, { sender: 'bot', text: "Forgive me, my connection to the Medina registry is briefly lagging. Let us try again. 📜" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const triggerOnboardingComplete = async () => {
    if (!onboardingName.trim() || !onboardingPhone.trim()) {
      alert("Please ensure your profile registration fields are complete.");
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .insert([
          {
            id: '00000000-0000-0000-0000-' + Math.floor(100000000000 + Math.random() * 900000000000), 
            phone_number: onboardingPhone,
            full_name: onboardingName,
            professional_headline: userHeadline || 'TIME Member',
            user_points: 100 
          }
        ]);

      if (error) throw error;

      setGuestName(onboardingName);
      setUserPoints(100); 
      setShowOnboarding(false);
      setOnboardingStep(1);
      setIsLoggedIn(true);

      fetchChatHistoryFromSupabase(onboardingPhone);

    } catch (err: any) {
      console.error("Cloud registration failed:", err.message);
      alert("Could not register profile: " + err.message);
    }
  };

  const handleSignInLookup = async () => {
    if (!signInPhone.trim()) {
      alert("Please provide a valid phone identity string to check in.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone_number', signInPhone)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setGuestName(data.full_name);
        setUserPoints(data.user_points);
        setUserHeadline(data.professional_headline);
        setOnboardingPhone(data.phone_number); 
        setIsLoggedIn(true);

        fetchChatHistoryFromSupabase(data.phone_number);
      } else {
        alert("No active profile linked to that record. Join the circle to initialize an entry!");
      }
    } catch (err: any) {
      alert("Verification handshake failed: " + err.message);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        .tab-fade-enter {
          animation: tabFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes tabFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes blink {
          0% { opacity: 0.2; }
          20% { opacity: 1; }
          100% { opacity: 0.2; }
        }
        .dot { animation: blink 1.4s infinite both; }
        .dot:nth-child(2) { animation-delay: .2s; }
        .dot:nth-child(3) { animation-delay: .4s; }

        @keyframes successPop {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        .success-checkmark { animation: successPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        
        @keyframes radarPulse {
          0% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.4); }
          70% { box-shadow: 0 0 0 12px rgba(212, 175, 55, 0); }
          100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); }
        }
        .radar-active { animation: radarPulse 2s infinite; }
      `}} />

      <div className="min-h-screen w-full bg-[#0B0A09] flex items-center justify-center p-6 font-jakarta text-[#7D746C] selection:bg-[#D4AF37] selection:text-[#0F0D0B]">
        <div className={`w-full max-w-[420px] h-[844px] rounded-[48px] border-[6px] border-[#262421] shadow-[0_24px_60px_-15px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col ${!isLoggedIn ? 'bg-[#0F0D0B]' : 'bg-[#FAF6F0]'}`}>
          
          {!isLoggedIn && (
            <div className="flex flex-col h-full bg-[#0F0D0B] z-50 absolute inset-0 overflow-hidden px-7 pb-8">
              {!showOnboarding && (
                <div className="flex flex-col h-full justify-between">
                  <div className="h-[140px] w-full shrink-0 relative overflow-hidden">
                    <svg viewBox="0 0 420 180" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full block">
                      <rect width="420" height="180" fill="#0F0D0B"/>
                      <circle cx="355" cy="55" r="20" fill="#D4AF37" opacity="0.95"/>
                      <circle cx="367" cy="49" r="20" fill="#0F0D0B"/>
                    </svg>
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-center gap-[24px]">
                    <div className="text-center space-y-1">
                      <h1 className="font-playfair text-[#fff] text-[56px] font-light tracking-[16px] leading-none ml-[16px]">TIME</h1>
                      <p className="text-[#D4AF37] text-[10px] tracking-[6px] uppercase font-semibold mt-2">Café · Marrakech</p>
                    </div>
                    
                    <button onClick={() => setShowOnboarding(true)} className="w-full bg-[#16222F] border border-[#D4AF37]/30 text-white rounded-[20px] p-4.5 flex items-center gap-3 transition-all hover:border-[#D4AF37] text-left shadow-xl hover:scale-[1.01]">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#C5A028] to-[#E6C65B] flex items-center justify-center text-[#0F0D0B] shrink-0"><Sparkles size={16} /></div>
                      <div className="flex-1">
                        <h4 className="text-xs font-bold tracking-wide text-white">Join the TIME Circle</h4>
                        <p className="text-[10px] text-white/50 mt-0.5">Unlock our elite privilege ecosystem ➔</p>
                      </div>
                    </button>
                    <div className="w-full h-px bg-white/5"></div>
                    <div className="space-y-3">
                      <input type="text" value={signInPhone} onChange={(e) => setSignInPhone(e.target.value)} placeholder="Enter registered phone (e.g. +2126...)" className="w-full bg-white/5 border border-white/10 rounded-[16px] px-[18px] py-[15px] text-white placeholder-white/20 outline-none focus:border-[#D4AF37] transition-colors text-[14px]"/>
                      <button onClick={handleSignInLookup} className="w-full bg-[#D4AF37] hover:bg-[#E6C65B] text-[#0F0D0B] font-bold text-xs py-[15px] rounded-[16px] uppercase tracking-[2.5px] transition-colors shadow-lg">Sign In</button>
                    </div>
                  </div>
                  <button onClick={() => setIsLoggedIn(true)} className="text-white/30 hover:text-[#D4AF37] text-[12px] transition self-center shrink-0 pt-2">Skip as Guest →</button>
                </div>
              )}

              {showOnboarding && (
                <div className="flex flex-col h-full bg-[#0F0D0B] text-white justify-between">
                  <div className="flex justify-between items-center pt-4"><div className="flex items-center gap-1.5"><Award size={14} className="text-[#D4AF37]" /><span className="text-[10px] uppercase font-bold tracking-[0.15em] text-white/60">Privilege Setup</span></div><button onClick={() => { setShowOnboarding(false); setOnboardingStep(1); }} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white"><X size={14}/></button></div>
                  <div className="flex gap-2 w-full px-2 mt-4">{[1, 2, 3, 4].map(idx => (<div key={idx} className={`h-1 flex-1 rounded-full transition-all duration-300 ${onboardingStep >= idx ? 'bg-[#D4AF37]' : 'bg-white/10'}`}></div>))}</div>
                  <div className="flex-1 flex flex-col justify-center items-center py-8 text-center space-y-6">
                    {onboardingStep === 1 && (
                      <div className="space-y-4 max-w-[85%]">
                        <div className="w-20 h-20 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] mx-auto shadow-inner"><Smartphone size={36} strokeWidth={1.5} /></div>
                        <h2 className="font-playfair text-2xl text-white font-normal tracking-wide">Frictionless Table Entry</h2>
                        <p className="text-white/60 text-xs leading-relaxed">Scan the brass table plaque layout cleanly inside your browser without apps.</p>
                      </div>
                    )}
                    {onboardingStep === 2 && (
                      <div className="space-y-4 max-w-[85%]">
                        <div className="w-20 h-20 rounded-2xl bg-blue-500/10 border border-blue-500/40 flex items-center justify-center text-blue-400 mx-auto shadow-inner"><Fingerprint size={36} strokeWidth={1.5} /></div>
                        <h2 className="font-playfair text-2xl text-white font-normal tracking-wide">One-Click Security</h2>
                        <p className="text-white/60 text-xs leading-relaxed">Identity verification finishes cleanly via biometrics.</p>
                        <div className="pt-2"><button onClick={() => setOnboardingStep(3)} className="w-full bg-white text-black font-bold text-xs p-3.5 rounded-xl flex items-center justify-center gap-2"><Fingerprint size={14}/> Authenticate Face-ID</button></div>
                      </div>
                    )}
                    {onboardingStep === 3 && (
                      <div className="space-y-4 max-w-[90%] w-full">
                        <div className="w-20 h-20 rounded-2xl bg-purple-500/10 border border-purple-500/40 flex items-center justify-center text-purple-400 mx-auto shadow-inner"><Wallet size={36} strokeWidth={1.5} /></div>
                        <h2 className="font-playfair text-2xl text-white font-normal tracking-wide">Pass Wallet Deployment</h2>
                        <p className="text-white/60 text-xs leading-relaxed">Add your loyalty card right into your device core dashboard ticket log.</p>
                        <div className="pt-1"><button onClick={() => setOnboardingStep(4)} className="w-full max-w-[280px] mx-auto bg-purple-600 text-white font-bold text-xs p-3 rounded-xl">Add to Wallet ➔</button></div>
                      </div>
                    )}
                    {onboardingStep === 4 && (
                      <div className="space-y-4 max-w-[85%] w-full text-left">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto shadow-inner mb-2"><CheckCircle size={28} /></div>
                        <h2 className="font-playfair text-xl text-white font-normal text-center tracking-wide">Complete Profile Identity</h2>
                        <div className="space-y-2.5 pt-1">
                          <input type="text" value={onboardingName} onChange={(e) => setOnboardingName(e.target.value)} placeholder="Your Full Name" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#D4AF37]"/>
                          <input type="text" value={onboardingPhone} onChange={(e) => setOnboardingPhone(e.target.value)} placeholder="Phone Number (e.g., +2126...)" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#D4AF37]"/>
                          <input type="text" value={userHeadline} onChange={(e) => setUserHeadline(e.target.value)} placeholder="Professional Headline" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#D4AF37]"/>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="pb-4 shrink-0">{onboardingStep < 4 ? (<div className="flex justify-between items-center"><button disabled={onboardingStep === 1} onClick={() => setOnboardingStep(prev => prev - 1)} className={`text-xs font-semibold tracking-wider ${onboardingStep === 1 ? 'opacity-20 text-white' : 'text-white/60'}`}>Back</button>{onboardingStep !== 2 && onboardingStep !== 3 && (<button onClick={() => setOnboardingStep(prev => prev + 1)} className="bg-[#D4AF37] text-[#0F0D0B] font-bold text-xs px-6 py-3 rounded-xl uppercase tracking-wider">Next Step</button>)}</div>) : (<button onClick={triggerOnboardingComplete} className="w-full bg-emerald-500 text-white font-bold text-xs py-3.5 rounded-xl uppercase tracking-widest text-center shadow-lg">Launch & Claim 100 PTS 🎉</button>)}</div>
                </div>
              )}
            </div>
          )}

          {isLoggedIn && (
            <div className="flex-1 flex flex-col overflow-hidden relative">
              <header className="pt-12 pb-4 px-6 flex justify-between items-center sticky top-0 bg-[#FAF6F0]/90 backdrop-blur-lg z-20 shrink-0 border-b border-black/[0.03]">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#D4AF37]"><path d="M12 2L15 9L22 10L17 15L18 22L12 18L6 22L7 15L2 10L9 9L12 2Z" stroke="currentColor" strokeWidth="1.5"/></svg>
                    <h1 className="font-playfair font-bold text-base tracking-[0.12em] text-[#1E1B18]">TIME CAFE</h1>
                  </div>
                  <div onClick={() => setActiveTab('rewards')} className="mt-1 px-2.5 py-0.5 rounded-full bg-[#1E1B18] text-[#D4AF37] text-[9px] font-bold tracking-wider w-fit cursor-pointer transition-transform hover:scale-105 shadow-sm">
                    <span>{getTierLabel(userPoints)}</span> · <span className="text-white font-extrabold">{userPoints} PTS ➔</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button onClick={() => setCheckoutStep('cart')} className="w-10 h-10 rounded-full bg-white border border-black/[0.06] flex items-center justify-center text-[#1E1B18] relative shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-transform active:scale-95">
                    <ShoppingBag size={16} />
                    {cart.length > 0 && <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-[#D4AF37] text-[#0F0D0B] text-[8px] font-bold rounded-full flex items-center justify-center shadow-sm border border-white">{cart.length}</span>}
                  </button>
                  <div onClick={() => { setActiveTab('home'); setTimeout(() => { document.getElementById('identity-box')?.scrollIntoView({ behavior: 'smooth' }); }, 150); }} className="w-10 h-10 rounded-full border-2 border-[#D4AF37] p-0.5 overflow-hidden cursor-pointer shadow-sm transition-transform hover:scale-105">
                    <img src={customerPhoto} className="w-full h-full object-cover rounded-full" alt="Profile" />
                  </div>
                </div>
              </header>

              <div className="flex-1 overflow-y-auto pb-24 hide-scrollbar">
                
                <div key={activeTab} className="tab-fade-enter">
                  
                  {activeTab === 'home' && (
                    <div className="relative px-6 pt-5 space-y-5">
                      <section>
                        <div onClick={() => setIsChatOpen(true)} className="bg-gradient-to-br from-[#1E1B18] to-[#12100F] rounded-[24px] p-4 flex items-center justify-between shadow-[0_12px_24px_rgba(0,0,0,0.15)] border border-white/[0.04] cursor-pointer group">
                          <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#C5A028] to-[#E6C65B] flex items-center justify-center text-[#0F0D0B] shadow-inner shrink-0"><Sparkles size={16} /></div>
                            <div>
                              <h4 className="text-xs font-bold text-white tracking-wide">Welcome, {guestName}</h4>
                              <p className="text-white/50 text-[10px] mt-0.5">Tap to chat with Anis, your live concierge...</p>
                            </div>
                          </div>
                          <span className="text-[#D4AF37] text-xs font-bold transition-transform group-hover:translate-x-1">➔</span>
                        </div>
                      </section>

                      {/* FEATURE 1: AUTONOMOUS TABLE SERVICE PAGER WIDGET */}
                      <section className="bg-white rounded-[28px] border border-black/[0.04] p-5 shadow-[0_6px_20px_rgba(0,0,0,0.02)] space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <BellRing size={16} className="text-[#D4AF37]" />
                            <h4 className="text-[10px] font-bold tracking-widest text-[#1E1B18] uppercase">Autonomous Table Pager</h4>
                          </div>
                          <span className="text-[10px] font-bold bg-[#1E1B18] text-white px-2.5 py-0.5 rounded-md">{tableNumber}</span>
                        </div>

                        {pagerStatus === 'idle' && (
                          <div className="grid grid-cols-3 gap-2">
                            <button onClick={() => handleTriggerAutonomousPager('Water')} className="bg-[#FAF6F0] border border-black/[0.03] p-3 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 group">
                              <GlassWater size={18} className="text-[#1E1B18] opacity-75 group-hover:text-[#D4AF37]" />
                              <span className="text-[9px] font-bold text-[#1E1B18] tracking-tight">Pour Water</span>
                            </button>
                            <button onClick={() => handleTriggerAutonomousPager('Refill')} className="bg-[#FAF6F0] border border-black/[0.03] p-3 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 group">
                              <Coffee size={18} className="text-[#1E1B18] opacity-75 group-hover:text-[#D4AF37]" />
                              <span className="text-[9px] font-bold text-[#1E1B18] tracking-tight">Drink Refill</span>
                            </button>
                            <button onClick={() => handleTriggerAutonomousPager('Barista')} className="bg-[#FAF6F0] border border-black/[0.03] p-3 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 group">
                              <Sparkles size={18} className="text-[#1E1B18] opacity-75 group-hover:text-[#D4AF37]" />
                              <span className="text-[9px] font-bold text-[#1E1B18] tracking-tight">Call Barista</span>
                            </button>
                          </div>
                        )}

                        {pagerStatus === 'transmitting' && (
                          <div className="bg-[#FAF6F0] rounded-xl p-4 flex items-center justify-center gap-2.5 text-xs text-[#1E1B18] font-semibold">
                            <Loader2 size={16} className="animate-spin text-[#D4AF37]" />
                            <span>Routing secure table signal token...</span>
                          </div>
                        )}

                        {pagerStatus === 'active' && (
                          <div className="bg-[#1E1B18] text-white rounded-xl p-4 flex flex-col items-center justify-center space-y-3 radar-active">
                            <div className="text-center">
                              <h5 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Signal Transmitted</h5>
                              <p className="text-[10px] text-white/60 mt-0.5">Barista dashboard alerted for: <strong>{activeRequestType}</strong></p>
                            </div>
                            <button onClick={handleCancelPagerRequest} className="bg-white/10 hover:bg-white/20 text-white border border-white/10 text-[9px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-lg transition-colors">Cancel Request</button>
                          </div>
                        )}
                      </section>

                      <div className="py-1">
                        <h2 className="font-playfair text-[38px] text-[#1E1B18] font-normal leading-tight tracking-tight">{t[lang].greeting}, {guestName}</h2>
                        <p className="text-[#8C827A] text-xs font-medium mt-1 opacity-90">{t[lang].subtitle}</p>
                      </div>

                      {/* TIME NETWORK BULLETINS */}
                      <section className="bg-[#121110] rounded-[28px] border border-white/5 p-5 shadow-xl relative overflow-hidden">
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-2 text-[#D4AF37]">
                            <Megaphone size={14} className="animate-pulse" />
                            <h3 className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-white/90">TIME Network Stream</h3>
                          </div>
                          <button onClick={() => setShowBroadcastModal(true)} className="bg-[#C56E4E] hover:bg-[#B35F3F] text-white text-[9px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all active:scale-95 shadow-sm">
                            <MessageSquare size={10} /> Broadcast
                          </button>
                        </div>

                        <div className="space-y-3 max-h-[140px] overflow-y-auto hide-scrollbar pr-1">
                          {broadcasts.length === 0 ? (
                            <div className="text-center py-6 text-white/30 text-[11px] italic">
                              No updates on the network layout. Be the first to drop an alert line!
                            </div>
                          ) : (
                            broadcasts.map((b: any) => (
                              <div key={b.id} className="bg-white/[0.03] border border-white/5 p-3 rounded-xl space-y-1">
                                <div className="flex justify-between items-baseline">
                                  <h5 className="text-white text-xs font-bold">{b.author_name}</h5>
                                  <span className="text-[9px] text-[#D4AF37] font-semibold tracking-wide truncate max-w-[50%]">{b.headline || 'TIME Circle'}</span>
                                </div>
                                <p className="text-white/60 text-[11px] leading-relaxed break-words">{b.message}</p>
                              </div>
                            ))
                          )}
                        </div>
                      </section>

                      <section className="space-y-3">
                        <div className="flex justify-between items-center">
                          <h3 className="text-[10px] font-bold tracking-[0.1em] text-[#1E1B18] uppercase opacity-80">Order again</h3>
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-1 hide-scrollbar -mx-6 px-6">
                          <div className="w-44 bg-white rounded-[24px] p-2.5 shrink-0 border border-black/[0.04] shadow-[0_4px_16px_rgba(0,0,0,0.02)] relative group cursor-pointer" onClick={() => setActiveTab('order')}>
                            <button onClick={(e) => handleToggleFavorite(1, e)} className="absolute top-4 right-4 z-10 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-[#C56E4E] shadow-sm"><Heart size={14} fill={favorites.includes(1) ? "#C56E4E" : "none"} /></button>
                            <div className="h-32 rounded-xl overflow-hidden mb-3"><img src="https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400" className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" alt="Cortado" /></div>
                            <h4 className="text-xs font-bold text-[#1E1B18] px-1">Cortado</h4>
                            <p className="text-[11px] text-[#D4AF37] font-bold mt-1 px-1">25 MAD</p>
                          </div>
                        </div>
                      </section>

                      <section>
                        <div className="w-full bg-white rounded-[24px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-black/[0.04] flex items-center justify-between p-4.5">
                          <div className="space-y-1.5 max-w-[60%]">
                            <span className="bg-[#C56E4E]/10 text-[#C56E4E] text-[8px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full">Featured Selection</span>
                            <h4 className="font-playfair text-xl font-normal text-[#1E1B18] leading-tight mt-2">{starProducts[starProductIndex].title}</h4>
                            <p className="text-[#8C827A] text-[10px] leading-relaxed line-clamp-2 mt-1">{starProducts[starProductIndex].desc}</p>
                          </div>
                          <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 shadow-inner"><img src={starProducts[starProductIndex].img} className="w-full h-full object-cover" alt="Featured" /></div>
                        </div>
                      </section>

                      <div id="identity-box" className="space-y-4 pt-4 border-t border-black/[0.06] scroll-mt-24">
                        <div className="bg-white rounded-[24px] p-5 border border-black/[0.04] shadow-sm space-y-3">
                          <p className="text-[#1E1B18] font-bold text-[10px] tracking-widest uppercase opacity-60">TIME Circle Identity Pass</p>
                          <div className="flex gap-4 items-center">
                            <img src={customerPhoto} className="w-14 h-14 rounded-full border border-[#D4AF37] object-cover shadow-sm" alt="Avatar" />
                            <div className="flex-1">
                              <h3 className="font-playfair text-lg text-[#1E1B18] font-semibold">{guestName}</h3>
                              <div className="flex items-center gap-1.5 text-[#8C827A] text-[11px] mt-1 font-medium">
                                <Briefcase size={12} className="text-[#D4AF37] shrink-0"/>
                                <input type="text" value={userHeadline} onChange={(e) => setUserHeadline(e.target.value)} className="bg-transparent border-b border-dashed border-black/10 outline-none text-[#1E1B18] w-full pb-0.5 focus:border-[#D4AF37]" placeholder="Professional Title" />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <p className="text-[#1E1B18] text-[10px] font-bold tracking-widest uppercase opacity-60">Active Radar Network</p>
                          {activeLoungeMembers.map((member: any) => (
                            <div key={member.id} className="bg-white p-4 rounded-[20px] border border-black/[0.04] shadow-sm flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3 overflow-hidden">
                                <img src={member.img} className="w-11 h-11 rounded-full object-cover border border-black/5 shrink-0" alt={member.name} />
                                <div className="overflow-hidden">
                                  <p className="text-xs font-bold text-[#1E1B18] truncate">{member.name}</p>
                                  <span className="text-[10px] text-[#8C827A] font-medium block opacity-75 truncate mt-0.5">{member.role}</span>
                                </div>
                              </div>
                              <button onClick={() => handlePingMember(member.name)} className="bg-[#1E1B18]/[0.03] hover:bg-[#1E1B18]/[0.06] text-[#1E1B18] text-[10px] font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 border border-black/[0.05] transition-colors shrink-0">
                                <Sparkles size={11} className="text-[#D4AF37]"/> <span>Wave</span>
                              </button>
                            </div>
                          ))}
                        </div>

                        <div className="bg-white rounded-[20px] p-4 border border-black/[0.04] shadow-sm flex justify-between items-center">
                          <p className="text-[#1E1B18] font-bold text-[10px] tracking-widest uppercase opacity-60">Language / Langue</p>
                          <div className="flex bg-[#F2ECE4] rounded-full p-0.5 border border-black/[0.04]">
                            <button onClick={() => setLang('en')} className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all ${lang === 'en' ? 'bg-[#1E1B18] text-white shadow-sm' : 'text-[#8C827A]'}`}>EN</button>
                            <button onClick={() => setLang('fr')} className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all ${lang === 'fr' ? 'bg-[#1E1B18] text-white shadow-sm' : 'text-[#8C827A]'}`}>FR</button>
                          </div>
                        </div>
                        <button onClick={() => { setIsLoggedIn(false); setOnboardingPhone(''); setSignInPhone(''); setGuestName('Alex'); setChatMessages([{ sender: 'bot', text: 'Marhaban. Welcome to the serenity of TIME. I am Anis...' }]); }} className="w-full bg-red-500/[0.08] hover:bg-red-500/[0.12] text-red-600 font-bold text-xs uppercase tracking-widest py-4 rounded-xl transition-colors">Disconnect Pass</button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'order' && (
                    <div className="px-6 space-y-5 pt-5">
                      <h2 className="font-playfair text-3xl text-[#1E1B18] font-normal tracking-tight">{t[lang].menuTitle}</h2>
                      
                      <div className="flex gap-2 pb-2 overflow-x-auto hide-scrollbar -mx-6 px-6">
                        {['All', 'Coffee', 'Signature', 'Bakery', 'Merch'].map(category => (
                          <button key={category} onClick={() => setActiveCategory(category)} className={`px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap border transition-all ${activeCategory === category ? 'bg-[#D4AF37] text-[#0F0D0B] border-[#D4AF37] shadow-sm' : 'bg-white text-[#8C827A] border-black/[0.04] shadow-[0_2px_6px_rgba(0,0,0,0.01)]'}`}>{category}</button>
                        ))}
                      </div>

                      <div className="space-y-3.5">
                        {filteredMenu.map((item: MenuItem) => (
                          <div key={item.id} className="flex bg-white rounded-2xl p-3 border border-black/[0.04] shadow-[0_4px_16px_rgba(0,0,0,0.01)] relative group cursor-pointer transition-all hover:border-[#D4AF37]/30 hover:scale-[1.005]" onClick={() => handleDirectAddToCart(item)}>
                            <img src={item.img || "https://images.pexels.com/photos/2067396/pexels-photo-2067396.jpeg?auto=compress&cs=tinysrgb&w=150"} alt={item.name} className="w-20 h-20 rounded-xl object-cover shrink-0 shadow-inner" />
                            <div className="ml-4 flex flex-col justify-between flex-1 py-0.5">
                              <div>
                                <span className="text-[#D4AF37] text-[8px] font-bold uppercase tracking-widest font-jakarta">{item.category}</span>
                                <h3 className="font-playfair text-[#1E1B18] text-base font-semibold leading-tight mt-1">{item.name}</h3>
                                <p className="text-[10px] text-[#8C827A] line-clamp-1 mt-1 opacity-80">{item.desc}</p>
                              </div>
                              <div className="flex justify-between items-center mt-2">
                                <span className="font-bold text-[#1E1B18] text-sm">{item.price} MAD</span>
                                <button className="w-7 h-7 rounded-full bg-[#1E1B18] group-hover:bg-[#D4AF37] group-hover:text-[#0F0D0B] text-white flex items-center justify-center transition-colors shadow-sm"><Plus size={14} /></button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'reserve' && (
                    <div className="px-6 space-y-5 pt-5">
                      <div>
                        <h2 className="font-playfair text-3xl text-[#1E1B18] font-normal tracking-tight">{t[lang].reserveTitle}</h2>
                        <p className="text-[#8C827A] text-[11px] mt-1">Book premium artisan milestones.</p>
                      </div>
                      <div className="flex bg-white rounded-xl border border-black/[0.04] p-1 shadow-sm w-full">
                        <button onClick={() => setReserveCategory('Workspace')} className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all ${reserveCategory === 'Workspace' ? 'bg-[#1E1B18] text-white shadow-sm' : 'text-[#8C827A]'}`}>Workspace</button>
                        <button onClick={() => setReserveCategory('Experiences')} className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all ${reserveCategory === 'Experiences' ? 'bg-[#1E1B18] text-white shadow-sm' : 'text-[#8C827A]'}`}>Experiences</button>
                      </div>
                      <div className="space-y-4.5">
                        {filteredReserve.map((item: any) => (
                          <div key={item.id} className="bg-white rounded-[24px] overflow-hidden shadow-[0_6px_20px_rgba(0,0,0,0.02)] border border-black/[0.04] group cursor-pointer">
                            <div className="h-36 relative overflow-hidden">
                              <img src={item.img} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                              <p className="absolute bottom-3 left-4 font-playfair text-white text-xl tracking-wide">{item.name}</p>
                            </div>
                            <div className="p-4 flex justify-between items-center gap-4">
                              <p className="text-[#8C827A] text-[10px] max-w-[65%] leading-relaxed">{item.desc}</p>
                              <button className="bg-[#D4AF37] text-[#0F0D0B] font-bold px-4 py-2.5 rounded-xl text-[10px] uppercase tracking-wider shrink-0 shadow-sm">{item.price.split(' ')[0]} MAD</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'rewards' && (
                    <div className="px-6 space-y-6 pt-5">
                      <div>
                        <h2 className="font-playfair text-3xl text-[#1E1B18] font-normal tracking-tight">{t[lang].rewardsTitle}</h2>
                        <p className="text-[#8C827A] text-xs mt-1">Manage token logs and digital passes.</p>
                      </div>

                      <div className="bg-gradient-to-br from-[#1E1B18] to-[#12100F] rounded-[32px] p-6 text-white flex flex-col items-center relative overflow-hidden shadow-xl text-center border border-white/[0.03]">
                         <p className="text-[#D4AF37] text-[9px] tracking-[0.25em] uppercase mb-4.5 font-bold">{getTierLabel(userPoints)}</p>
                         <div className="bg-white p-3.5 rounded-[24px] mb-4 text-[#1E1B18] shadow-md">
                            <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M9 9h6v6H9z"/></svg>
                         </div>
                         <p className="font-playfair text-2xl font-light text-white tracking-wide">{guestName}</p>
                         <div className="mt-5 border-t border-white/10 pt-3.5 w-full flex justify-between items-center text-xs">
                           <span className="text-white/40 font-medium">Current Balance:</span>
                           <span className="font-bold text-[#D4AF37] text-sm tracking-wide">{userPoints} pts</span>
                         </div>
                      </div>

                      <div className="space-y-3.5">
                        <p className="text-[#1E1B18] text-[10px] font-bold tracking-widest uppercase opacity-60">Available Redemptions</p>
                        <div className="space-y-3">
                          {claimableRewards.map((reward: any) => (
                            <div key={reward.id} className="bg-white border border-black/[0.04] p-4 rounded-xl flex items-center justify-between shadow-sm">
                              <div>
                                <p className="text-xs font-bold text-[#1E1B18]">{reward.name}</p>
                                <p className="text-[10px] text-[#D4AF37] font-semibold mt-1">{reward.pointsCost} Points Required</p>
                              </div>
                              <button onClick={() => handleClaimReward(reward)} className={`px-4 py-2.5 rounded-xl text-[10px] font-bold tracking-wider uppercase shadow-sm transition-all ${userPoints >= reward.pointsCost ? 'bg-[#C56E4E] text-white hover:bg-[#B35F3F]' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>Exchange</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* POST BROADCAST MODAL */}
              {showBroadcastModal && (
                <div className="absolute inset-0 bg-black/60 z-50 flex items-end justify-center backdrop-blur-sm">
                  <div className="bg-[#121110] w-full rounded-t-[32px] p-6 text-white space-y-5 shadow-2xl border-t border-white/10 tab-fade-enter">
                    <div className="flex justify-between items-center border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2 text-[#D4AF37]">
                        <Megaphone size={14} />
                        <h4 className="text-xs font-bold uppercase tracking-widest">Post to TIME stream</h4>
                      </div>
                      <button onClick={() => setShowBroadcastModal(false)} className="text-white/40 hover:text-white"><X size={18} /></button>
                    </div>

                    <div className="space-y-1.5 text-xs text-white/50">
                      <p>Publishing as: <strong className="text-white">{guestName}</strong></p>
                      <p>Headline track: <span className="text-[#D4AF37]">{userHeadline || 'Guest'}</span></p>
                    </div>

                    <textarea value={broadcastMessage} onChange={(e) => setBroadcastMessage(e.target.value)} placeholder="Type an update..." rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-white placeholder-white/20 outline-none focus:border-[#D4AF37] resize-none" maxLength={200} />
                    <button onClick={handlePostBroadcast} disabled={isPostingBroadcast || !broadcastMessage.trim()} className="w-full bg-[#D4AF37] disabled:bg-neutral-800 disabled:text-neutral-500 text-[#0F0D0B] font-bold text-xs py-3.5 rounded-xl uppercase tracking-widest flex items-center justify-center gap-2 transition-colors shadow-md">
                      {isPostingBroadcast ? <Loader2 size={14} className="animate-spin" /> : 'Transmit Broadcast ➔'}
                    </button>
                  </div>
                </div>
              )}

              {checkoutStep && (
                <div className="absolute inset-0 bg-black/60 z-50 flex items-end justify-center backdrop-blur-sm">
                  <div className="bg-[#FAF6F0] w-full rounded-t-[32px] max-h-[80vh] flex flex-col shadow-2xl relative overflow-hidden transition-transform duration-300">
                    <div className="p-5 bg-[#1E1B18] flex justify-between items-center text-white">
                      <h2 className="font-playfair text-2xl font-light tracking-wide">{t[lang].cart}</h2>
                      <button onClick={() => setCheckoutStep(null)} className="text-white/50 hover:text-white"><X size={20} /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-5 space-y-4">
                      {checkoutStep === 'confirmed' ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 animate-pulse">
                          <div className="w-16 h-16 bg-emerald-100 border border-emerald-400 rounded-full flex items-center justify-center text-emerald-600 mb-2"><CheckCircle size={32} /></div>
                          <h3 className="font-playfair text-xl font-bold text-[#1E1B18]">Marhaban! Order Transmitted</h3>
                          <p className="text-xs text-[#8C827A] max-w-[80%] leading-relaxed">Your table pass layout is synced cleanly.</p>
                        </div>
                      ) : cart.length === 0 ? <div className="text-center text-[#8C827A] py-10 opacity-60 font-medium">Your cart is empty.</div> : (
                        <>
                          <div className="space-y-2.5">
                            {cart.map((item: CartItem, i: number) => (
                              <div key={i} className="flex justify-between items-center bg-white p-4 rounded-xl border border-black/[0.03] shadow-sm">
                                <div>
                                  <p className="font-bold text-[#1E1B18] text-xs">{item.name}</p>
                                  <p className="text-[9px] text-[#8C827A] font-medium opacity-80 mt-0.5">{item.category}</p>
                                </div>
                                <p className="font-bold text-[#1E1B18] text-xs">{item.price} MAD</p>
                              </div>
                            ))}
                          </div>
                          
                          <div className="space-y-2.5 pt-1">
                            <p className="text-[#1E1B18] text-[10px] font-bold tracking-widest uppercase opacity-60">Payment Method</p>
                            <div className="flex bg-[#F2ECE4] rounded-2xl p-1.5 gap-1.5 border border-black/[0.04]">
                              <button onClick={() => setPaymentMethod('applepay')} className={`flex-1 py-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border ${paymentMethod === 'applepay' ? 'bg-white text-black border-white shadow-md' : 'bg-transparent text-[#8C827A] border-transparent'}`}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="mb-0.5"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.56 2.95-1.39z"/></svg>
                                <span>Apple Pay</span>
                              </button>
                              <button onClick={() => setPaymentMethod('cash')} className={`flex-1 py-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border ${paymentMethod === 'cash' ? 'bg-white text-black border-white shadow-md' : 'bg-transparent text-[#8C827A] border-transparent'}`}>
                                <Coins size={14} className="text-black" />
                                <span>Pay Counter</span>
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    {cart.length > 0 && checkoutStep !== 'confirmed' && (
                      <div className="p-5 bg-white border-t border-black/[0.04]">
                        
                        {paymentMethod === 'applepay' ? (
                          <button onClick={handleInitiateOrderConfirmation} className="w-full bg-white text-black h-13 border border-black/10 rounded-xl flex items-center justify-center font-bold text-xs tracking-widest uppercase shadow-md hover:bg-neutral-50 transition-all active:scale-[0.99]">
                            <span className="flex items-center gap-1.5">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="mb-0.5"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.56 2.95-1.39z"/></svg>
                              <span>Pay with Apple Pay</span>
                            </span>
                          </button>
                        ) : (
                          <button onClick={handleInitiateOrderConfirmation} className="w-full bg-white text-black h-13 border border-black/10 rounded-xl flex flex-col items-center justify-center font-bold text-xs tracking-widest uppercase shadow-md hover:bg-neutral-50 transition-all active:scale-[0.99]">
                            <span className="flex items-center gap-2">
                              <Coins size={14} />
                              <span>Complete Counter Request</span>
                            </span>
                          </button>
                        )}
                        
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* HIGH FIDELITY BIOMETRICS DRAWER SHEET */}
              {applePayState !== 'idle' && (
                <div className="absolute inset-0 bg-black/70 z-50 flex items-end justify-center backdrop-blur-xs">
                  <div className="bg-[#121110] w-full rounded-t-[40px] p-6 text-white space-y-6 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t border-white/10 tab-fade-enter">
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                      <div className="flex items-center gap-2">
                        <div className="bg-white text-black font-black text-[11px] px-2.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-sm">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="mb-0.5"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.56 2.95-1.39z"/></svg>
                          <span>Pay</span>
                        </div>
                        <span className="text-white/40 text-[9px] font-bold tracking-widest uppercase ml-1">Secure Pass Link</span>
                      </div>
                      <button onClick={() => setApplePayState('idle')} className="text-white/40 hover:text-white"><X size={18} /></button>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between text-xs text-white/60"><span>Merchant</span><span className="text-white font-bold">TIME Café Marrakech</span></div>
                      <div className="flex justify-between text-xs text-white/60"><span>Device Card</span><span className="text-white font-mono">✦✦✦✦ 9281</span></div>
                      <div className="w-full h-px bg-white/5"></div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs text-white/40 uppercase font-bold tracking-wider">Total Charge</span>
                        <span className="text-2xl font-bold text-[#D4AF37]">{cartTotal} MAD</span>
                      </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-[24px] p-6 flex flex-col items-center justify-center text-center space-y-4 min-h-[165px]">
                      {applePayState === 'prompt' && (
                        <>
                          <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] animate-bounce"><Fingerprint size={24}/></div>
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold tracking-wide">Biometric Verification Standing By</h4>
                            <p className="text-[10px] text-white/40 leading-relaxed max-w-[85%] mx-auto">Tap below to authorize the secure face scanning camera interface mock link.</p>
                          </div>
                          <button onClick={handleSimulateFaceIDScan} className="bg-white text-black font-extrabold text-[10px] px-6 py-2.5 rounded-xl uppercase tracking-wider shadow-md hover:bg-neutral-200 transition-colors">Authenticate Scan</button>
                        </>
                      )}

                      {applePayState === 'scanning' && (
                        <>
                          <Loader2 size={36} className="text-[#D4AF37] animate-spin mb-1" />
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold tracking-wide animate-pulse">Reading Face-ID Nodes...</h4>
                            <p className="text-[10px] text-white/30 leading-relaxed">Mapping terminal canvas bounding vectors strings...</p>
                          </div>
                        </>
                      )}

                      {applePayState === 'success' && (
                        <div className="success-checkmark flex flex-col items-center space-y-2">
                          <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-black shadow-lg"><CheckCircle size={24} strokeWidth={3} /></div>
                          <h4 className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">Payment Completed</h4>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {showScanner && (
                <div className="absolute inset-0 bg-[#0F0D0B] z-50 flex flex-col justify-between p-6 text-center">
                  <div className="flex justify-between items-center pt-4"><span className="w-8"></span><h3 className="font-playfair text-white text-2xl font-light tracking-wide">Scan Pass</h3><button onClick={() => setShowScanner(false)} className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center"><X size={16}/></button></div>
                  <div className="w-56 h-56 border-2 border-dashed border-[#C56E4E] rounded-[32px] mx-auto flex items-center justify-center relative">
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#C56E4E] animate-bounce mt-28"></div>
                  </div>
                  <p className="text-white/40 text-[11px] px-6 pb-8 leading-relaxed">Position your terminal identity pass within the bounding vectors layout lines.</p>
                </div>
              )}

              {isChatOpen && (
                <div className="absolute inset-0 bg-black/60 z-50 flex items-end justify-center backdrop-blur-sm">
                  <div className="bg-[#FAF6F0] w-full h-[78vh] rounded-t-[32px] flex flex-col overflow-hidden shadow-2xl">
                    <div className="bg-[#0F0D0B] p-5 flex justify-between items-center shrink-0 border-b border-white/5 shadow-md">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 bg-gradient-to-tr from-[#C5A028] to-[#E6C65B] rounded-full flex items-center justify-center text-[#0F0D0B] font-playfair font-bold text-sm shadow-inner">A</div>
                        <div>
                          <h3 className="font-playfair text-white text-lg font-normal tracking-wide">Time Concierge</h3>
                          <p className="text-[#D4AF37] text-[9px] tracking-widest uppercase font-bold mt-0.5">AI Assistant</p>
                        </div>
                      </div>
                      <button onClick={() => setIsChatOpen(false)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white"><X size={18}/></button>
                    </div>
                    
                    <div className="flex-1 p-5 overflow-y-auto space-y-3.5 hide-scrollbar bg-[#FAF6F0]">
                      {chatMessages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[85%] p-4 text-xs leading-relaxed shadow-sm ${msg.sender === 'user' ? 'bg-[#1E1B18] text-white rounded-[20px] rounded-br-none' : 'bg-white border border-black/[0.03] text-[#1E1B18] rounded-[20px] rounded-bl-none'}`}>{msg.text}</div>
                        </div>
                      ))}
                      
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="bg-white border border-black/[0.03] text-[#1E1B18] p-4 rounded-[20px] rounded-bl-none shadow-sm flex items-center gap-1.5">
                            <span className="text-[10px] font-semibold text-[#8C827A] opacity-70 italic mr-1">Anis is typing</span>
                            <span className="dot w-1 h-1 bg-[#D4AF37] rounded-full inline-block"></span>
                            <span className="dot w-1 h-1 bg-[#D4AF37] rounded-full inline-block"></span>
                            <span className="dot w-1 h-1 bg-[#D4AF37] rounded-full inline-block"></span>
                          </div>
                        </div>
                      )}
                      
                      <div ref={messagesEndRef} />
                    </div>
                    
                    <div className="p-4 bg-white border-t border-black/[0.04] flex gap-2 shrink-0 shadow-lg">
                      <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Ask about workspace layout passes or sizes..." className="flex-1 bg-[#FAF6F0] border border-black/[0.04] rounded-xl px-4 text-xs outline-none text-[#1E1B18] focus:border-[#D4AF37] transition-colors" />
                      <button onClick={handleSendMessage} className="w-11 h-11 bg-[#D4AF37] hover:bg-[#E6C65B] rounded-xl flex items-center justify-center text-[#0F0D0B] shrink-0 transition-colors shadow-md"><Send size={14}/></button>
                    </div>
                  </div>
                </div>
              )}

              <nav className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-black/[0.04] pt-2.5 pb-6 px-4 flex justify-between items-center h-[82px] z-30 shrink-0">
                <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1.5 w-12 transition-all duration-300 ${activeTab === 'home' ? 'text-[#C56E4E] scale-105' : 'text-[#8C827A]/40 hover:text-[#8C827A]/70'}`}>
                  <Home size={18} /><span className="text-[8px] font-bold uppercase tracking-widest">{t[lang].home}</span>
                </button>
                <button onClick={() => setActiveTab('order')} className={`flex flex-col items-center gap-1.5 w-12 transition-all duration-300 ${activeTab === 'order' ? 'text-[#C56E4E] scale-105' : 'text-[#8C827A]/40 hover:text-[#8C827A]/70'}`}>
                  <Coffee size={18} /><span className="text-[8px] font-bold uppercase tracking-widest">{t[lang].menu}</span>
                </button>
                
                <div className="relative w-14 h-14 -mt-7 flex items-center justify-center">
                  <button onClick={() => setShowScanner(true)} className="w-13 h-13 bg-[#C56E4E] hover:bg-[#B35F3F] text-white rounded-full flex items-center justify-center shadow-lg border-[4px] border-white z-40 transition-transform active:scale-95">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="6" height="6"/><rect x="15" y="3" width="6" height="6"/><rect x="15" y="15" width="6" height="6"/><rect x="3" y="15" width="6" height="6"/><path d="M9 9h6v6H9z"/></svg>
                  </button>
                </div>

                <button onClick={() => setActiveTab('reserve')} className={`flex flex-col items-center gap-1.5 w-12 transition-all duration-300 ${activeTab === 'reserve' ? 'text-[#C56E4E] scale-105' : 'text-[#8C827A]/40 hover:text-[#8C827A]/70'}`}>
                  <Calendar size={18} /><span className="text-[8px] font-bold uppercase tracking-widest">{t[lang].reserve}</span>
                </button>
                <button onClick={() => setActiveTab('rewards')} className={`flex flex-col items-center gap-1.5 w-12 transition-all duration-300 ${activeTab === 'rewards' ? 'text-[#C56E4E] scale-105' : 'text-[#8C827A]/40 hover:text-[#8C827A]/70'}`}>
                  <Award size={18} /><span className="text-[8px] font-bold uppercase tracking-widest">{t[lang].rewards}</span>
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </>
  );
}