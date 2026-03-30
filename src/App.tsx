/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, User, Menu, X, ArrowRight, ArrowLeft, Upload, PenTool, Package, CheckCircle, UploadCloud, ImageIcon, Filter, ChevronDown, PlusCircle, MessageCircle, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- DATA ---
const PRODUCTS = [
  { id: 1, name: 'Custom Performance 1/4 Zip', price: 'From $45', category: 'Athletic', image: 'https://picsum.photos/seed/quarterzip/600/800' },
  { id: 2, name: 'Heavyweight Canvas Jacket', price: 'From $85', category: 'Workwear', image: 'https://picsum.photos/seed/workjacket/600/800' },
  { id: 3, name: 'Team Training Hoodie', price: 'From $55', category: 'Athletic', image: 'https://picsum.photos/seed/hoodie/600/800' },
  { id: 9, name: 'Classic Snapback Trucker', price: 'From $22', category: 'Hats', image: 'https://picsum.photos/seed/snapback/600/800' },
  { id: 4, name: 'Premium Embroidered Polo', price: 'From $35', category: 'Workwear', image: 'https://picsum.photos/seed/polo/600/800' },
  { id: 5, name: 'Pro-Fit Joggers', price: 'From $40', category: 'Athletic', image: 'https://picsum.photos/seed/joggers/600/800' },
  { id: 10, name: 'Performance Dad Hat', price: 'From $20', category: 'Hats', image: 'https://picsum.photos/seed/dadhat/600/800' },
  { id: 6, name: 'Heavyweight Work Hoodie', price: 'From $55', category: 'Workwear', image: 'https://picsum.photos/seed/workhoodie/600/800' },
  { id: 7, name: 'Moisture-Wicking Tee', price: 'From $20', category: 'Athletic', image: 'https://picsum.photos/seed/tee/600/800' },
  { id: 8, name: 'Durable Cargo Pants', price: 'From $60', category: 'Workwear', image: 'https://picsum.photos/seed/cargo/600/800' },
  { id: 11, name: 'Knit Winter Beanie', price: 'From $18', category: 'Hats', image: 'https://picsum.photos/seed/beanie/600/800' },
];

const PROCESS_STEPS = [
  { icon: <Search size={32} />, title: '1. Select Apparel', desc: 'Choose from our premium athletic and durable workwear blanks.' },
  { icon: <Upload size={32} />, title: '2. Upload Logo', desc: 'Upload your design and select your preferred embroidery placement.' },
  { icon: <CheckCircle size={32} />, title: '3. Approve Mockup', desc: 'Review and approve the digital stitch mockup sent by our team.' },
  { icon: <Package size={32} />, title: '4. Wear It Proudly', desc: 'We embroider in-house and ship directly to your team or site.' },
];

const MOCKUPS = [
  { 
    id: 'tee', 
    name: 'Performance Tee', 
    image: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=800&q=80', 
    backImage: undefined,
    flipBack: false,
    placements: {
      front: {
        left: 'top-[32%] right-[30%] w-12 h-12 md:w-16 md:h-16',
        right: 'top-[32%] left-[30%] w-12 h-12 md:w-16 md:h-16',
        center: 'top-[35%] left-1/2 -translate-x-1/2 w-24 h-24 md:w-32 md:h-32'
      }
    }
  },
  { 
    id: 'hoodie', 
    name: 'Premium Hoodie', 
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80', 
    backImage: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80',
    flipBack: false,
    placements: {
      front: {
        left: 'top-[38%] right-[35%] w-12 h-12 md:w-16 md:h-16',
        right: 'top-[38%] left-[35%] w-12 h-12 md:w-16 md:h-16',
        center: 'top-[42%] left-1/2 -translate-x-1/2 w-24 h-24 md:w-32 md:h-32'
      },
      back: {
        center: 'top-[35%] left-1/2 -translate-x-1/2 w-32 h-32 md:w-48 md:h-48'
      }
    }
  },
  { 
    id: 'jacket', 
    name: 'Workwear Jacket', 
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80', 
    backImage: undefined,
    flipBack: false,
    placements: {
      front: {
        left: 'top-[35%] right-[32%] w-12 h-12 md:w-16 md:h-16',
        right: 'top-[35%] left-[32%] w-12 h-12 md:w-16 md:h-16',
        center: 'top-[40%] left-1/2 -translate-x-1/2 w-24 h-24 md:w-32 md:h-32'
      }
    }
  },
  { 
    id: 'hat', 
    name: 'Snapback Hat', 
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80', 
    backImage: undefined,
    flipBack: false,
    placements: {
      front: {
        center: 'top-[25%] left-1/2 -translate-x-1/2 w-16 h-16 md:w-20 md:h-20'
      }
    }
  }
];

const APPAREL_COLORS = [
  { name: 'White', value: '#ffffff' },
  { name: 'Black', value: '#222222' },
  { name: 'Navy', value: '#1e293b' },
  { name: 'Heather Grey', value: '#9ca3af' },
  { name: 'Red', value: '#dc2626' },
  { name: 'Royal Blue', value: '#2563eb' },
  { name: 'Forest Green', value: '#166534' },
];

// --- COMPONENTS ---

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function MockupGenerator() {
  const [selectedMockup, setSelectedMockup] = useState(MOCKUPS[0]);
  const [view, setView] = useState<'front' | 'back'>('front');
  const [apparelColor, setApparelColor] = useState<string>('#ffffff');
  const [logo, setLogo] = useState<string | null>(null);
  const [placement, setPlacement] = useState<'left' | 'center' | 'right'>('left');
  const [logoScale, setLogoScale] = useState<number>(100);
  const [customText, setCustomText] = useState<string>('');
  const [textFont, setTextFont] = useState<string>('ui-sans-serif, system-ui, sans-serif');
  const [textColor, setTextColor] = useState<string>('#000000');
  const [textSize, setTextSize] = useState<number>(24);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previewElement = previewRef.current;
    if (!previewElement || !logo) return;

    let initialDistance = 0;
    let initialScale = logoScale;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        initialDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        initialScale = logoScale;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        
        const scaleFactor = currentDistance / initialDistance;
        const newScale = Math.min(Math.max(20, initialScale * scaleFactor), 300);
        setLogoScale(Math.round(newScale));
      }
    };

    previewElement.addEventListener('touchstart', handleTouchStart, { passive: false });
    previewElement.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      previewElement.removeEventListener('touchstart', handleTouchStart);
      previewElement.removeEventListener('touchmove', handleTouchMove);
    };
  }, [logo, logoScale]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setLogo(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const getPlacementClasses = () => {
    const viewPlacements = selectedMockup.placements[view as 'front' | 'back'];
    if (viewPlacements && viewPlacements[placement as keyof typeof viewPlacements]) {
      return viewPlacements[placement as keyof typeof viewPlacements] as string;
    }
    return 'hidden';
  };

  return (
    <div className="pt-32 pb-20 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-display uppercase tracking-wide mb-4">Interactive Mockup Studio</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Upload your logo and see it instantly embroidered on our premium blanks.</p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Controls */}
          <div className="w-full lg:w-1/3 space-y-8">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-900">1. Select Apparel</h3>
              <div className="grid grid-cols-2 gap-2">
                {MOCKUPS.map(m => (
                  <button 
                    key={m.id}
                    onClick={() => {
                      setSelectedMockup(m);
                      setView('front');
                      if (m.id === 'hat') setPlacement('center');
                      else if (m.id === 'hoodie') setPlacement('left');
                    }}
                    className={`p-2 border text-xs font-semibold uppercase tracking-wider transition-colors ${selectedMockup.id === m.id ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-gray-400 text-gray-600'}`}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
              
              {selectedMockup.backImage && (
                <div className="mt-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider mb-2 text-gray-500">View</h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setView('front');
                        if (selectedMockup.id === 'hoodie') setPlacement('left');
                      }}
                      className={`flex-1 py-2 border text-[10px] font-semibold uppercase tracking-wider transition-colors ${view === 'front' ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-gray-400 text-gray-600'}`}
                    >
                      Front
                    </button>
                    <button 
                      onClick={() => {
                        setView('back');
                        if (selectedMockup.id === 'hoodie') setPlacement('center');
                      }}
                      className={`flex-1 py-2 border text-[10px] font-semibold uppercase tracking-wider transition-colors ${view === 'back' ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-gray-400 text-gray-600'}`}
                    >
                      Back
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-900">2. Select Color</h3>
              <div className="flex flex-wrap gap-3">
                {APPAREL_COLORS.map(color => (
                  <button
                    key={color.name}
                    onClick={() => setApparelColor(color.value)}
                    className={`w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 ${apparelColor === color.value ? 'border-black scale-110 shadow-md' : 'border-gray-200'}`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-900">3. Upload Logo</h3>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-8 border-2 border-dashed border-gray-300 hover:border-black transition-colors flex flex-col items-center justify-center gap-2 text-gray-600 hover:text-black group"
              >
                <UploadCloud size={32} className="group-hover:scale-110 transition-transform" />
                <span className="font-medium text-sm uppercase tracking-wider">
                  {logo ? 'Change Logo' : 'Click to Upload'}
                </span>
              </button>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-900">4. Select Placement</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => setPlacement('right')}
                  disabled={selectedMockup.id === 'hat' || selectedMockup.id === 'hoodie'}
                  className={`flex-1 py-3 border text-[10px] sm:text-xs font-semibold uppercase tracking-wider transition-colors ${selectedMockup.id === 'hat' || selectedMockup.id === 'hoodie' ? 'opacity-50 cursor-not-allowed bg-gray-100' : placement === 'right' ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-gray-400 text-gray-600'}`}
                >
                  Right Chest
                </button>
                <button 
                  onClick={() => setPlacement('center')}
                  disabled={selectedMockup.id === 'hoodie' && view === 'front'}
                  className={`flex-1 py-3 border text-[10px] sm:text-xs font-semibold uppercase tracking-wider transition-colors ${selectedMockup.id === 'hoodie' && view === 'front' ? 'opacity-50 cursor-not-allowed bg-gray-100' : placement === 'center' || selectedMockup.id === 'hat' || (selectedMockup.id === 'hoodie' && view === 'back') ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-gray-400 text-gray-600'}`}
                >
                  Center
                </button>
                <button 
                  onClick={() => setPlacement('left')}
                  disabled={selectedMockup.id === 'hat' || (selectedMockup.id === 'hoodie' && view === 'back')}
                  className={`flex-1 py-3 border text-[10px] sm:text-xs font-semibold uppercase tracking-wider transition-colors ${selectedMockup.id === 'hat' || (selectedMockup.id === 'hoodie' && view === 'back') ? 'opacity-50 cursor-not-allowed bg-gray-100' : placement === 'left' ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-gray-400 text-gray-600'}`}
                >
                  Left Chest
                </button>
              </div>
            </div>

            {logo && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-8"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">5. Adjust Logo Size</h3>
                  <span className="text-xs font-medium text-gray-500">{logoScale}%</span>
                </div>
                <input 
                  type="range" 
                  min="20" 
                  max="300" 
                  value={logoScale} 
                  onChange={(e) => setLogoScale(Number(e.target.value))}
                  className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                />
              </motion.div>
            )}

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-900">6. Add Custom Text</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter custom text..."
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors"
                />
                {customText && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Font</label>
                      <select
                        value={textFont}
                        onChange={(e) => setTextFont(e.target.value)}
                        className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black text-sm"
                      >
                        <option value="ui-sans-serif, system-ui, sans-serif">Sans Serif</option>
                        <option value="ui-serif, Georgia, serif">Serif</option>
                        <option value="ui-monospace, SFMono-Regular, monospace">Monospace</option>
                        <option value="Impact, fantasy">Impact</option>
                        <option value="'Comic Sans MS', cursive, sans-serif">Comic Sans</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                        />
                        <span className="text-xs text-gray-600 uppercase">{textColor}</span>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-medium text-gray-500">Text Size</label>
                        <span className="text-xs font-medium text-gray-500">{textSize}px</span>
                      </div>
                      <input 
                        type="range" 
                        min="10" 
                        max="120" 
                        value={textSize} 
                        onChange={(e) => setTextSize(Number(e.target.value))}
                        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                      />
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Preview Canvas */}
          <div 
            ref={previewRef}
            className="w-full lg:w-2/3 bg-gray-100 aspect-square md:aspect-[4/3] relative overflow-hidden flex items-center justify-center border border-gray-200 touch-none"
            style={{ backgroundColor: apparelColor }}
          >
            <img 
              src={view === 'back' && selectedMockup.backImage ? selectedMockup.backImage : selectedMockup.image} 
              alt="Apparel Mockup" 
              className={`w-full h-full object-contain object-center p-4 md:p-8 ${view === 'back' && selectedMockup.flipBack ? 'scale-x-[-1]' : ''}`}
              style={{ mixBlendMode: apparelColor !== '#ffffff' ? 'multiply' : 'normal' }}
              referrerPolicy="no-referrer"
            />
            
            {/* Logo & Text Overlay */}
            {(logo || customText) ? (
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', bounce: 0.5 }}
                className={`absolute z-10 flex flex-col items-center justify-center gap-2 ${getPlacementClasses()}`}
              >
                {logo && (
                  <img 
                    src={logo} 
                    alt="Your Logo" 
                    className="object-contain drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)] transition-transform duration-75" 
                    style={{ 
                      width: `${logoScale}%`, 
                      height: `${logoScale}%`,
                      maxWidth: 'none'
                    }} 
                  />
                )}
                {customText && (
                  <span 
                    className="text-center drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)] leading-tight whitespace-pre-wrap transition-all duration-75"
                    style={{
                      fontFamily: textFont,
                      color: textColor,
                      fontSize: `${textSize}px`
                    }}
                  >
                    {customText}
                  </span>
                )}
              </motion.div>
            ) : (
              <div className={`absolute z-10 border-2 border-dashed border-gray-400/50 flex flex-col items-center justify-center text-gray-500/50 p-2 text-center text-xs ${getPlacementClasses()}`}>
                <ImageIcon size={24} className="mb-1" />
                <span>Upload Logo<br/>or Add Text</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navClasses = isHome 
    ? (isScrolled ? 'bg-white shadow-md py-4 text-black' : 'bg-transparent py-6 text-white')
    : 'bg-white shadow-md py-4 text-black';

  return (
    <>
      <div className="bg-black text-white text-xs font-medium py-2 text-center tracking-wider uppercase fixed top-0 w-full z-50">
        Free logo setup on all team orders over 24 pieces
      </div>
      <nav 
        className={`fixed w-full z-40 transition-all duration-300 ${navClasses}`}
        style={{ top: isHome && !isScrolled ? '32px' : (isHome ? '0' : '32px') }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className={!isHome || isScrolled ? 'text-black' : 'text-white'} size={24} />
          </button>

          {/* Logo */}
          <div className="flex-1 md:flex-none text-center md:text-left flex items-center gap-2 justify-center md:justify-start">
            <PenTool className={!isHome || isScrolled ? 'text-black' : 'text-white'} size={28} />
            <Link to="/" className={`font-display text-3xl tracking-widest uppercase ${!isHome || isScrolled ? 'text-black' : 'text-white'}`}>
              AURA CUSTOMS
            </Link>
          </div>

          {/* Desktop Links */}
          <div className={`hidden md:flex space-x-8 font-semibold text-sm uppercase tracking-wide ${!isHome || isScrolled ? 'text-black' : 'text-white'}`}>
            <Link to="/shop/athletic" className="hover:opacity-70 transition-opacity">Athletic Wear</Link>
            <Link to="/shop/workwear" className="hover:opacity-70 transition-opacity">Workwear</Link>
            <Link to="/shop/hats" className="hover:opacity-70 transition-opacity">Hats</Link>
            <Link to="/mockup-studio" className="hover:opacity-70 transition-opacity">Mockup Studio</Link>
            <Link to="/custom-order" className="hover:opacity-70 transition-opacity">Custom Order</Link>
          </div>

          {/* Icons */}
          <div className={`flex space-x-4 md:space-x-6 ${!isHome || isScrolled ? 'text-black' : 'text-white'}`}>
            <button className="hover:opacity-70 transition-opacity"><Search size={20} /></button>
            <button className="hover:opacity-70 transition-opacity hidden sm:block"><User size={20} /></button>
            <button className="hover:opacity-70 transition-opacity relative">
              <ShoppingBag size={20} />
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                0
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-white flex flex-col"
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-100 mt-8">
              <span className="font-display text-2xl tracking-widest uppercase flex items-center gap-2 text-black">
                <PenTool size={24} /> AURA CUSTOMS
              </span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-black">
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-col p-6 space-y-6 text-2xl font-display uppercase tracking-wider text-black">
              <Link to="/shop/athletic" className="hover:text-gray-500">Athletic Wear</Link>
              <Link to="/shop/workwear" className="hover:text-gray-500">Workwear</Link>
              <Link to="/shop/hats" className="hover:text-gray-500">Hats</Link>
              <Link to="/mockup-studio" className="hover:text-gray-500">Mockup Studio</Link>
              <Link to="/custom-order" className="hover:text-gray-500">Custom Order</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-20 pb-10 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2">
          <h3 className="font-display text-3xl tracking-widest uppercase mb-6 flex items-center gap-2">
            <PenTool size={28} /> AURA CUSTOMS
          </h3>
          <p className="text-gray-400 max-w-sm mb-6">
            Premium custom embroidery for teams that demand the best. From the gym to the job site.
          </p>
          <div className="flex">
            <input 
              type="email" 
              placeholder="Email Address" 
              className="bg-transparent border-b border-gray-600 py-2 px-0 text-white focus:outline-none focus:border-white w-full max-w-xs"
            />
            <button className="ml-4 font-bold uppercase tracking-wider text-sm hover:text-gray-300">
              Subscribe
            </button>
          </div>
        </div>
        
        <div>
          <h4 className="font-bold uppercase tracking-wider mb-6">Services</h4>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li><Link to="/shop/athletic" className="hover:text-white transition-colors">Athletic Embroidery</Link></li>
            <li><Link to="/shop/workwear" className="hover:text-white transition-colors">Workwear Embroidery</Link></li>
            <li><Link to="/shop/hats" className="hover:text-white transition-colors">Custom Hats</Link></li>
            <li><Link to="/#how-it-works" className="hover:text-white transition-colors">Logo Digitization</Link></li>
            <li><Link to="/custom-order" className="hover:text-white transition-colors">Custom Order</Link></li>
            <li><Link to="/custom-order" className="hover:text-white transition-colors">Team Stores</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold uppercase tracking-wider mb-6">Support</h4>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li><Link to="/" className="hover:text-white transition-colors">FAQ</Link></li>
            <li><Link to="/" className="hover:text-white transition-colors">Artwork Guidelines</Link></li>
            <li><Link to="/" className="hover:text-white transition-colors">Shipping & Turnaround</Link></li>
            <li><Link to="/" className="hover:text-white transition-colors">Returns Policy</Link></li>
            <li><Link to="/" className="hover:text-white transition-colors">Contact Us</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
        <p>&copy; {new Date().getFullYear()} AURA Custom Apparel. All Rights Reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <Link to="/" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link to="/" className="hover:text-white transition-colors">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}

function HelpWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      setIsSent(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsSent(false);
        setMessage('');
      }, 4000);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 bg-white rounded-2xl shadow-2xl w-80 overflow-hidden border border-gray-100 flex flex-col mb-4"
          >
            <div className="bg-[#1a56db] p-4 text-white flex justify-between items-center">
              <div>
                <h3 className="font-bold">Chat with us</h3>
                <p className="text-blue-100 text-xs mt-0.5">Our team will respond in a few minutes</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 bg-gray-50 h-64 overflow-y-auto flex flex-col gap-3">
              <div className="bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 max-w-[85%] self-start text-sm text-gray-800">
                👋 Hi there! How can we help you with your custom apparel order today?
              </div>
              
              {isSent && (
                <>
                  <div className="bg-[#1a56db] p-3 rounded-2xl rounded-tr-sm shadow-sm max-w-[85%] self-end text-sm text-white">
                    {message}
                  </div>
                  <div className="text-xs text-gray-500 text-center mt-2 bg-gray-100 py-1 px-3 rounded-full self-center">
                    Message sent. Our team will be with you shortly!
                  </div>
                </>
              )}
            </div>
            
            {!isSent && (
              <form onSubmit={handleSend} className="p-3 bg-white border-t flex gap-2 items-center">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db]"
                />
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="bg-[#1a56db] text-white p-2 rounded-full disabled:opacity-50 hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <Send size={16} />
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#1a56db] text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-transform hover:scale-105 flex items-center justify-center"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <HelpWidget />
    </div>
  );
}

function Home() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.hash === '#how-it-works') {
      const element = document.getElementById('how-it-works');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 flex">
          <div className="w-1/2 h-full relative">
            <img 
              src="https://picsum.photos/seed/athleticwear/1000/1080" 
              alt="Athletic Wear" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
          <div className="w-1/2 h-full relative">
            <img 
              src="https://picsum.photos/seed/constructionwork/1000/1080" 
              alt="Workwear" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/60"></div>
          </div>
        </div>
        
        <div className="relative z-10 text-center px-4 mt-16 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl lg:text-8xl font-display text-white uppercase tracking-tight leading-none mb-6"
          >
            Premium Custom <br /> Embroidery
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-medium"
          >
            Elevate your team's look. High-performance athletic wear and durable workwear, custom stitched with your logo.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button onClick={() => navigate('/shop/athletic')} className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold uppercase tracking-wide hover:bg-gray-200 transition-colors">
              Shop Athletic Wear
            </button>
            <button onClick={() => navigate('/shop/workwear')} className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white text-white font-bold uppercase tracking-wide hover:bg-white hover:text-black transition-colors">
              Shop Workwear
            </button>
          </motion.div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-display uppercase tracking-wide mb-4">Choose Your Gear</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">We source only the highest quality blanks designed to withstand the toughest workouts and the hardest jobs.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div onClick={() => navigate('/shop/athletic')} className="relative h-[60vh] group overflow-hidden cursor-pointer">
            <img 
              src="https://picsum.photos/seed/gymteam/800/1000" 
              alt="Athletic Wear" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-colors duration-300"></div>
            <div className="absolute bottom-8 left-8 right-8">
              <h2 className="text-4xl font-display text-white uppercase tracking-wide mb-2">Athletic Wear</h2>
              <p className="text-gray-300 mb-4 font-medium">Moisture-wicking polos, performance hoodies, and team warm-ups.</p>
              <div className="flex items-center text-white font-semibold uppercase tracking-wider group-hover:gap-2 transition-all">
                <span>Customize Now</span>
                <ArrowRight size={20} className="ml-2" />
              </div>
            </div>
          </div>
          <div onClick={() => navigate('/shop/workwear')} className="relative h-[60vh] group overflow-hidden cursor-pointer">
            <img 
              src="https://picsum.photos/seed/constructionteam/800/1000" 
              alt="Workwear" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-colors duration-300"></div>
            <div className="absolute bottom-8 left-8 right-8">
              <h2 className="text-4xl font-display text-white uppercase tracking-wide mb-2">Workwear</h2>
              <p className="text-gray-300 mb-4 font-medium">Heavy-duty jackets, high-vis gear, and durable canvas shirts.</p>
              <div className="flex items-center text-white font-semibold uppercase tracking-wider group-hover:gap-2 transition-all">
                <span>Customize Now</span>
                <ArrowRight size={20} className="ml-2" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display uppercase tracking-wide mb-4">The Custom Process</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">From selecting your gear to wearing it on site, we make custom embroidery seamless and professional.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {PROCESS_STEPS.map((step, index) => (
              <div key={index} className="bg-white p-8 border border-gray-100 shadow-sm text-center group hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
                <h3 className="text-lg font-bold uppercase tracking-wider mb-3">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Blanks */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-4xl font-display uppercase tracking-wide mb-2">Popular Blanks</h2>
            <p className="text-gray-600">Ready for your logo.</p>
          </div>
          <Link to="/shop" className="hidden sm:flex items-center font-semibold uppercase tracking-wider text-sm hover:text-gray-600 transition-colors">
            View All Catalog <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6">
          {PRODUCTS.slice(0, 4).map((product) => (
            <Link to={`/product/${product.id}`} key={product.id} className="group cursor-pointer">
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4 border border-gray-200">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
                  <button className="w-full bg-black text-white py-3 font-bold uppercase tracking-wider text-sm hover:bg-gray-800">
                    Start Designing
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{product.category}</p>
                <h3 className="text-sm font-bold text-gray-900 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-600">{product.price} <span className="text-xs text-gray-400 ml-1">(incl. embroidery)</span></p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bulk Orders CTA */}
      <section className="py-24 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-6xl font-display uppercase tracking-tight mb-6">Outfit The Whole Team</h2>
          <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
            Need gear for a large crew, corporate event, or sports team? We offer tiered volume discounts and dedicated account managers for bulk orders.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => navigate('/bulk-orders')} className="px-8 py-4 bg-white text-black font-bold uppercase tracking-wide hover:bg-gray-200 transition-colors">
              Request A Quote
            </button>
            <button onClick={() => navigate('/bulk-orders')} className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold uppercase tracking-wide hover:bg-white hover:text-black transition-colors">
              View Bulk Pricing
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

function Shop() {
  const { category } = useParams();
  const title = category === 'athletic' ? 'Athletic Wear' : category === 'workwear' ? 'Workwear' : category === 'hats' ? 'Headwear' : 'All Products';
  const filteredProducts = category ? PRODUCTS.filter(p => p.category.toLowerCase() === category) : PRODUCTS;

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12">
        <div>
          <h1 className="text-5xl font-display uppercase tracking-wide mb-4">{title}</h1>
          <p className="text-gray-600 max-w-2xl">Premium {title.toLowerCase()} blanks ready for your custom embroidery.</p>
        </div>
        <div className="mt-6 md:mt-0 flex items-center gap-4">
          <button className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider border border-gray-300 px-4 py-2 hover:border-black transition-colors">
            <Filter size={16} /> Filter
          </button>
          <button className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider border border-gray-300 px-4 py-2 hover:border-black transition-colors">
            Sort <ChevronDown size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
        {filteredProducts.map((product) => (
          <Link to={`/product/${product.id}`} key={product.id} className="group cursor-pointer">
            <div className="relative overflow-hidden bg-gray-100 aspect-[3/4] mb-4 border border-gray-200">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="bg-white text-black px-6 py-3 text-sm font-bold uppercase tracking-wider transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  Customize
                </span>
              </div>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{product.category}</p>
              </div>
              <p className="text-sm font-medium text-gray-900">{product.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function CustomOrder() {
  const BASIC_COLORS = [
    { name: 'White', value: '#ffffff' },
    { name: 'Black', value: '#222222' },
    { name: 'Navy', value: '#1e293b' },
    { name: 'Heather Grey', value: '#9ca3af' },
    { name: 'Red', value: '#dc2626' },
    { name: 'Royal Blue', value: '#2563eb' },
    { name: 'Forest Green', value: '#166534' },
  ];

  const [activeCategory, setActiveCategory] = useState<'hats' | 'workwear' | 'athletic'>('hats');
  const [activeColors, setActiveColors] = useState<Record<string, string>>({});
  const [quantities, setQuantities] = useState<Record<string, Record<string, Record<string, number>>>>({});
  const [step, setStep] = useState<1 | 2>(1);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [designNotes, setDesignNotes] = useState('');

  const CATEGORIES = [
    { id: 'hats', label: 'Hats' },
    { id: 'workwear', label: 'Workwear' },
    { id: 'athletic', label: 'Athletic Wear' }
  ] as const;

  const ITEMS_BY_CATEGORY: Record<string, any[]> = {
    hats: [
      { id: 'snapback-trucker', name: 'Classic Snapback Trucker', image: 'https://picsum.photos/seed/snapback/600/800', sizes: ['OSFA', 'S/M', 'L/XL'] },
      { id: 'dad-hat', name: 'Performance Dad Hat', image: 'https://picsum.photos/seed/dadhat/600/800', sizes: ['OSFA'] },
      { id: 'beanie', name: 'Knit Winter Beanie', image: 'https://picsum.photos/seed/beanie/600/800', sizes: ['OSFA'] },
    ],
    workwear: [
      { id: 'canvas-jacket', name: 'Heavyweight Canvas Jacket', image: 'https://picsum.photos/seed/workjacket/600/800', sizes: ['S', 'M', 'L', 'XL', '2XL'] },
      { id: 'embroidered-polo', name: 'Premium Embroidered Polo', image: 'https://picsum.photos/seed/polo/600/800', sizes: ['S', 'M', 'L', 'XL', '2XL'] },
      { id: 'work-hoodie', name: 'Heavyweight Work Hoodie', image: 'https://picsum.photos/seed/workhoodie/600/800', sizes: ['S', 'M', 'L', 'XL', '2XL'] },
      { id: 'cargo-pants', name: 'Durable Cargo Pants', image: 'https://picsum.photos/seed/cargo/600/800', sizes: ['30', '32', '34', '36', '38'] },
    ],
    athletic: [
      { id: 'quarter-zip', name: 'Custom Performance 1/4 Zip', image: 'https://picsum.photos/seed/quarterzip/600/800', sizes: ['S', 'M', 'L', 'XL'] },
      { id: 'training-hoodie', name: 'Team Training Hoodie', image: 'https://picsum.photos/seed/hoodie/600/800', sizes: ['S', 'M', 'L', 'XL'] },
      { id: 'pro-joggers', name: 'Pro-Fit Joggers', image: 'https://picsum.photos/seed/joggers/600/800', sizes: ['S', 'M', 'L', 'XL'] },
      { id: 'moisture-tee', name: 'Moisture-Wicking Tee', image: 'https://picsum.photos/seed/tee/600/800', sizes: ['S', 'M', 'L', 'XL'] },
    ]
  };

  const tiers = [1, 10, 25, 50, 100, 250, 500];
  
  const PRICES_BY_CATEGORY: Record<string, number[]> = {
    hats: [22, 20, 18, 16, 15, 14, 12],
    workwear: [45, 42, 40, 38, 35, 32, 30],
    athletic: [35, 32, 30, 28, 26, 24, 22]
  };

  const prices = PRICES_BY_CATEGORY[activeCategory];

  const totalQuantity = Object.values(quantities).reduce((total, itemColors) => {
    return total + Object.values(itemColors).reduce((colorTotal, sizes) => {
      return colorTotal + Object.values(sizes).reduce((a, b) => a + b, 0);
    }, 0);
  }, 0);

  let currentTierIndex = 0;
  for (let i = tiers.length - 1; i >= 0; i--) {
    if (totalQuantity >= tiers[i]) {
      currentTierIndex = i;
      break;
    }
  }
  if (totalQuantity === 0) currentTierIndex = 0;

  const nextTierIndex = currentTierIndex + 1 < tiers.length ? currentTierIndex + 1 : null;
  const itemsNeeded = nextTierIndex ? tiers[nextTierIndex] - totalQuantity : 0;
  const savings = nextTierIndex ? prices[currentTierIndex] - prices[nextTierIndex] : 0;

  const updateQuantity = (itemId: string, color: string, size: string, delta: number) => {
    setQuantities(prev => {
      const itemColors = prev[itemId] || {};
      const sizeQuantities = itemColors[color] || {};
      const currentQty = sizeQuantities[size] || 0;
      return {
        ...prev,
        [itemId]: {
          ...itemColors,
          [color]: {
            ...sizeQuantities,
            [size]: Math.max(0, currentQty + delta)
          }
        }
      };
    });
  };

  const handleQuantityChange = (itemId: string, color: string, size: string, value: string) => {
    setQuantities(prev => {
      const itemColors = prev[itemId] || {};
      const sizeQuantities = itemColors[color] || {};
      if (value === '' || value.toUpperCase() === 'X') {
        return { ...prev, [itemId]: { ...itemColors, [color]: { ...sizeQuantities, [size]: 0 } } };
      }
      const val = parseInt(value, 10);
      return {
        ...prev,
        [itemId]: {
          ...itemColors,
          [color]: {
            ...sizeQuantities,
            [size]: isNaN(val) ? 0 : Math.max(0, val)
          }
        }
      };
    });
  };

  const handleNextStep = () => {
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const getCartItems = () => {
    const cartItems = [];
    const currentPrice = prices[currentTierIndex];

    for (const [itemId, itemColors] of Object.entries(quantities)) {
      let itemDetails = null;
      for (const category of Object.values(ITEMS_BY_CATEGORY)) {
        const found = category.find(i => i.id === itemId);
        if (found) {
          itemDetails = found;
          break;
        }
      }

      if (!itemDetails) continue;

      for (const [color, sizeQuantities] of Object.entries(itemColors)) {
        for (const [size, qty] of Object.entries(sizeQuantities)) {
          if (qty > 0) {
            cartItems.push({
              id: itemId,
              name: itemDetails.name,
              image: itemDetails.image,
              color: color,
              colorValue: BASIC_COLORS.find(c => c.name === color)?.value || '#000',
              size: size,
              quantity: qty,
              unitPrice: currentPrice,
              totalPrice: currentPrice * qty
            });
          }
        }
      }
    }
    return cartItems;
  };

  const handleAddToCart = () => {
    const cartItems = getCartItems();
    const currentPrice = prices[currentTierIndex];

    const cart = {
      items: cartItems,
      totalQuantity: totalQuantity,
      totalPrice: totalQuantity * currentPrice,
      customization: {
        logo: logoFile ? logoFile.name : null,
        notes: designNotes
      }
    };

    console.log('Added to Cart:', cart);
    alert('Added to cart! Check console for details.');
  };

  if (step === 2) {
    return (
      <div className="pt-32 pb-20 bg-white min-h-screen font-sans">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button onClick={handleBack} className="flex items-center text-gray-600 hover:text-black mb-8 transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to Selection
          </button>
          
          <div className="text-center mb-12">
            <h1 className="text-4xl font-display uppercase tracking-wide mb-4">Customize Your Order</h1>
            <p className="text-gray-600">Upload your logo and add any specific design instructions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left Column: Upload & Notes */}
            <div className="space-y-8">
               {/* Upload Box */}
               <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#1a56db] transition-colors cursor-pointer bg-gray-50 relative">
                 <input 
                   type="file" 
                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                   onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                   accept="image/*,.ai,.eps,.pdf"
                 />
                 {logoFile ? (
                   <div className="flex flex-col items-center">
                     <CheckCircle className="w-12 h-12 text-[#3cc13b] mb-4" />
                     <p className="font-bold text-gray-800">{logoFile.name}</p>
                     <p className="text-sm text-gray-500 mt-2">Click or drag to replace</p>
                   </div>
                 ) : (
                   <div className="flex flex-col items-center">
                     <UploadCloud className="w-12 h-12 text-gray-400 mb-4" />
                     <p className="font-bold text-gray-800 mb-2">Upload your logo</p>
                     <p className="text-sm text-gray-500">AI, EPS, PDF, PNG, or JPG</p>
                   </div>
                 )}
               </div>

               {/* Design Notes */}
               <div>
                 <label className="block text-sm font-bold text-gray-800 uppercase tracking-wider mb-2">Design Notes</label>
                 <textarea 
                   rows={4}
                   value={designNotes}
                   onChange={(e) => setDesignNotes(e.target.value)}
                   placeholder="E.g., Logo on center front, 3 inches wide. Use white thread."
                   className="w-full border-2 border-gray-200 rounded-xl p-4 focus:border-[#1a56db] focus:outline-none transition-colors"
                 />
               </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 h-fit">
              <h3 className="font-bold text-xl uppercase tracking-wider mb-6 border-b pb-4">Order Summary</h3>
              
              {/* Selected Items List */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
                {getCartItems().reduce((acc: any[], item) => {
                  const existing = acc.find(i => i.id === item.id && i.color === item.color);
                  if (existing) {
                    existing.quantity += item.quantity;
                    existing.sizes.push(`${item.size} (${item.quantity})`);
                  } else {
                    acc.push({
                      ...item,
                      sizes: [`${item.size} (${item.quantity})`]
                    });
                  }
                  return acc;
                }, []).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm">
                    <div className="w-10 h-10 rounded border border-gray-200 flex-shrink-0 overflow-hidden" style={{ backgroundColor: item.colorValue }}>
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800 leading-tight">{item.name}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span 
                          className="w-3 h-3 rounded-full border border-gray-300" 
                          style={{ backgroundColor: item.colorValue }}
                          title={item.color}
                        />
                        <span className="text-gray-500 text-xs">{item.color}</span>
                        <span className="text-gray-400 text-xs mx-1">•</span>
                        <span className="text-gray-500 text-xs truncate max-w-[120px]">{item.sizes.join(', ')}</span>
                      </div>
                    </div>
                    <div className="font-bold text-black">
                      {item.quantity}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 mb-6 border-t pt-6">
                <div className="flex justify-between text-gray-600">
                  <span>Total Items</span>
                  <span className="font-bold text-black">{totalQuantity}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Price per Item</span>
                  <span className="font-bold text-black">${prices[currentTierIndex]}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Setup Fee</span>
                  <span className="font-bold text-green-600">FREE</span>
                </div>
              </div>
              <div className="border-t pt-4 mb-8">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-lg uppercase">Estimated Total</span>
                  <span className="font-bold text-3xl">${totalQuantity * prices[currentTierIndex]}</span>
                </div>
              </div>
              <button 
                onClick={handleAddToCart}
                className="w-full py-4 bg-[#1a56db] text-white font-bold uppercase tracking-widest hover:bg-blue-700 transition-colors rounded-xl"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 bg-white min-h-screen font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display uppercase tracking-wide mb-4">Custom Order</h1>
          <p className="text-gray-600">Step 1: Build your custom apparel package.</p>
        </div>

        {/* Pricing Table */}
        <div className="mb-12 overflow-x-auto">
          <table className="w-full text-center border-collapse min-w-[600px]">
            <thead>
              <tr>
                <th colSpan={tiers.length + 1} className="bg-gray-100 py-3 text-gray-800 font-bold border-b-4 border-white">Total Items Price Break</th>
              </tr>
              <tr>
                <th className="w-[15%]"></th>
                {tiers.map(tier => (
                  <th key={tier} className="py-2 font-normal text-gray-600 bg-gray-100 border-l border-white w-[12%]">{tier}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Embroidery Row */}
              <tr>
                <td className="py-4 font-bold text-sm tracking-wider bg-[#1a56db] text-white">EMBROIDERY</td>
                {tiers.map((tier, idx) => {
                  const isActive = currentTierIndex === idx && totalQuantity > 0;
                  return (
                    <td key={tier} className={`relative py-4 border-l border-white ${isActive ? 'bg-[#1a56db] text-white' : 'bg-gray-50 text-gray-600'}`}>
                      ${prices[idx]}
                      {isActive && nextTierIndex && (
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-[#1a56db] z-10"></div>
                      )}
                    </td>
                  );
                })}
              </tr>
              {/* Savings Message Row */}
              {nextTierIndex && totalQuantity > 0 && (
                <tr>
                  <td className="bg-white"></td>
                  <td colSpan={8} className="py-2 text-[#1a56db] text-sm bg-white">
                    Add {itemsNeeded} more items to save ${savings} per item.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="bg-gray-100 py-3 text-gray-800 text-sm text-right pr-4 mt-1">
            Price includes item & decoration.
          </div>
        </div>

        {/* Category Switcher */}
        <div className="flex justify-center gap-4 mb-12">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-6 py-3 rounded-full font-bold uppercase tracking-wider transition-colors border-2 ${
                activeCategory === cat.id 
                  ? 'bg-[#1a56db] border-[#1a56db] text-white' 
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Selector Boxes */}
        <div className="space-y-8">
          {ITEMS_BY_CATEGORY[activeCategory].map(item => {
            const currentColor = activeColors[item.id] || 'Black';
            const itemColors = quantities[item.id] || {};
            const sizeQuantities = itemColors[currentColor] || {};
            
            // Calculate total quantity for this specific item across ALL colors to show if it's selected
            const hasAnyQuantity = Object.values(itemColors).some(colorSizes => Object.values(colorSizes).some(q => q > 0));
            
            const currentColorValue = BASIC_COLORS.find(c => c.name === currentColor)?.value || '#222222';

            return (
              <div key={item.id} className={`max-w-2xl mx-auto border-2 rounded-xl p-8 bg-white shadow-sm transition-colors ${hasAnyQuantity ? 'border-[#1a56db]' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className="flex flex-col items-center mb-6">
                  <div className="relative mb-4">
                    <div className="w-24 h-24 rounded-xl border border-gray-200 overflow-hidden transition-colors duration-300" style={{ backgroundColor: currentColorValue }}>
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                    <div className="absolute -bottom-2 -left-4 bg-white rounded-full">
                      <PlusCircle size={24} className="text-black" />
                    </div>
                  </div>
                  <h3 className="font-bold text-lg tracking-wider uppercase mb-1">{item.name}</h3>
                  
                  {/* Color Picker */}
                  <div className="flex justify-center gap-3 mt-4 mb-2">
                    {BASIC_COLORS.map(c => {
                      const isSelected = currentColor === c.name;
                      const colorHasQty = Object.values(itemColors[c.name] || {}).some(q => q > 0);
                      return (
                        <button
                          key={c.name}
                          onClick={() => setActiveColors(prev => ({ ...prev, [item.id]: c.name }))}
                          className={`relative w-8 h-8 rounded-full border-2 transition-transform ${isSelected ? 'border-[#1a56db] scale-110' : 'border-gray-300 hover:scale-105'}`}
                          style={{ backgroundColor: c.value }}
                          title={c.name}
                        >
                          {colorHasQty && !isSelected && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#1a56db] rounded-full border border-white"></div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-sm text-gray-500 font-medium uppercase">{currentColor}</p>
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                  {item.sizes.map((size: string) => {
                    const qty = sizeQuantities[size] || 0;
                    const isActive = qty > 0;

                    return (
                      <div key={size} className={`flex flex-col items-center p-4 rounded-xl border ${isActive ? 'bg-[#1a56db] border-[#1a56db]' : 'bg-white border-gray-200'}`}>
                        <span className={`mb-3 font-medium ${isActive ? 'text-white' : 'text-gray-800'}`}>{size}</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateQuantity(item.id, currentColor, size, -1)}
                            className={`w-10 h-10 flex items-center justify-center rounded font-bold text-xl ${isActive ? 'bg-[#3cc13b] text-white hover:bg-green-600' : 'bg-gray-200 text-white hover:bg-gray-300'}`}
                          >
                            -
                          </button>
                          <input
                            type="text"
                            value={qty === 0 ? 'X' : qty}
                            onChange={(e) => handleQuantityChange(item.id, currentColor, size, e.target.value)}
                            className={`w-14 h-10 text-center font-bold text-lg rounded focus:outline-none ${isActive ? 'bg-white text-black' : 'bg-white text-gray-500 border border-gray-200'}`}
                          />
                          <button
                            onClick={() => updateQuantity(item.id, currentColor, size, 1)}
                            className={`w-10 h-10 flex items-center justify-center rounded font-bold text-xl ${isActive ? 'bg-[#3cc13b] text-white hover:bg-green-600' : 'bg-gray-200 text-white hover:bg-gray-300'}`}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Total Summary */}
        <div className="max-w-2xl mx-auto mt-8 bg-gray-50 p-8 rounded-xl border border-gray-200">
          <h3 className="font-bold text-xl uppercase tracking-wider mb-6 text-center border-b pb-4">Current Selection</h3>
          
          {totalQuantity > 0 ? (
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
              {getCartItems().reduce((acc: any[], item) => {
                const existing = acc.find(i => i.id === item.id && i.color === item.color);
                if (existing) {
                  existing.quantity += item.quantity;
                  existing.sizes.push(`${item.size} (${item.quantity})`);
                } else {
                  acc.push({
                    ...item,
                    sizes: [`${item.size} (${item.quantity})`]
                  });
                }
                return acc;
              }, []).map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                  <div className="w-12 h-12 rounded border border-gray-200 flex-shrink-0 overflow-hidden" style={{ backgroundColor: item.colorValue }}>
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-800 leading-tight">{item.name}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span 
                        className="w-3 h-3 rounded-full border border-gray-300" 
                        style={{ backgroundColor: item.colorValue }}
                        title={item.color}
                      />
                      <span className="text-gray-500 text-xs">{item.color}</span>
                      <span className="text-gray-400 text-xs mx-1">•</span>
                      <span className="text-gray-500 text-xs truncate max-w-[150px]">{item.sizes.join(', ')}</span>
                    </div>
                  </div>
                  <div className="font-bold text-black text-lg bg-gray-100 px-3 py-1 rounded">
                    {item.quantity}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 mb-6 italic">No items selected yet.</p>
          )}

          <div className="text-center border-t pt-6">
            <p className="text-xl font-bold mb-4">Total Quantity: {totalQuantity}</p>
            <button 
              onClick={handleNextStep}
              disabled={totalQuantity === 0}
              className="px-12 py-4 bg-black text-white font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto rounded-xl"
            >
              Next: Customize <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductDetail() {
  const { id } = useParams();
  const product = PRODUCTS.find(p => p.id === Number(id)) || PRODUCTS[0];

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row gap-12">
        <div className="w-full md:w-1/2">
          <div className="bg-gray-100 aspect-[3/4] relative border border-gray-200">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">{product.category}</p>
          <h1 className="text-4xl font-display uppercase tracking-wide mb-4">{product.name}</h1>
          <p className="text-2xl font-medium mb-8">{product.price}</p>
          
          <div className="space-y-6 mb-8">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-3">Select Color</h3>
              <div className="flex gap-3">
                <button className="w-10 h-10 rounded-full bg-black border-2 border-transparent ring-2 ring-offset-2 ring-black"></button>
                <button className="w-10 h-10 rounded-full bg-gray-500 border-2 border-transparent hover:ring-2 hover:ring-offset-2 hover:ring-gray-500"></button>
                <button className="w-10 h-10 rounded-full bg-blue-900 border-2 border-transparent hover:ring-2 hover:ring-offset-2 hover:ring-blue-900"></button>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-3">
                <h3 className="text-sm font-bold uppercase tracking-wider">Select Size</h3>
                <button className="text-sm text-gray-500 underline">Size Guide</button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {['S', 'M', 'L', 'XL', '2XL', '3XL'].map(size => (
                  <button key={size} className="py-3 border border-gray-300 text-sm font-semibold hover:border-black transition-colors">
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button className="w-full bg-black text-white py-4 text-sm font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors mb-4">
            Start Customizing
          </button>
          <p className="text-xs text-gray-500 text-center uppercase tracking-wider">Minimum order quantity: 12 pieces</p>
          
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Product Details</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2 text-sm">
              <li>Premium quality material designed for durability.</li>
              <li>Includes up to 10,000 stitches of custom embroidery.</li>
              <li>Moisture-wicking and breathable fabric.</li>
              <li>Tear-away label for comfort.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop/:category" element={<Shop />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/custom-order" element={<CustomOrder />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/mockup-studio" element={<MockupGenerator />} />
        </Routes>
      </Layout>
    </Router>
  );
}
