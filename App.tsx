
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Menu, X, Home, Book, Send, HelpCircle, Settings, User, 
  LogOut, Globe, Moon, Sun, Monitor, Camera, Bell, Calendar,
  ChevronRight, ChevronLeft, Image as ImageIcon, FileText, Users, Flag, Globe as GlobeIcon, FileCheck, Mail, BookOpen, UserCheck, MoreHorizontal, Search, File as FileIcon
} from 'lucide-react';
import { 
  LanguageCode, UserProfile, AppTheme, TextSize, ViewState, 
  Announcement, EventItem, ServiceCategory, NotificationPreferences, SearchCategory
} from './types';
import { 
  LANGUAGES, MOCK_ANNOUNCEMENTS, MOCK_EVENTS, FAQ_DATA, 
  SERVICE_CATEGORIES, APP_DESCRIPTION_SHORT, APP_DESCRIPTION_FULL, TRANSLATIONS
} from './constants';
import { Modal } from './components/Modal';
import { Button } from './components/Button';
// Corrected import path using relative notation
import { supabase } from './lib/supabaseClient';

// --- Icons Map Helper ---
const IconMap: Record<string, React.ElementType> = {
  FileText, Users, Flag, Globe: GlobeIcon, FileCheck, Mail, BookOpen, UserCheck, MoreHorizontal
};

// --- Translation Hook ---
const useTranslation = (lang: LanguageCode) => {
  return (key: string) => {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS['RO'];
    return dict[key] || key;
  };
};

// --- Sub-Components ---

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  const [bgClass, setBgClass] = useState('bg-ro-blue');

  useEffect(() => {
    // Sequence: Blue -> Yellow -> Red
    const t1 = setTimeout(() => setBgClass('bg-ro-yellow'), 700);
    const t2 = setTimeout(() => setBgClass('bg-ro-red'), 1400);
    const t3 = setTimeout(onFinish, 2100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onFinish]);

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-colors duration-700 ease-in-out ${bgClass} opacity-90`}>
      <h1 className="text-5xl font-bold text-white mb-4 animate-fade-in drop-shadow-lg">ConsulaRO</h1>
      <p className="text-xl text-white font-medium animate-pulse drop-shadow-md">Consulatul la un click distanță!</p>
    </div>
  );
};

const Header = ({ 
  currentLang, 
  setLang, 
  onProfileClick, 
  onSettingsClick,
  onSearchClick,
  isLoggedIn 
}: { 
  currentLang: LanguageCode; 
  setLang: (l: LanguageCode) => void; 
  onProfileClick: () => void;
  onSettingsClick: () => void;
  onSearchClick: () => void;
  isLoggedIn: boolean;
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full shadow-md h-16">
      {/* Gradient Background */}
      <div 
        className="absolute inset-0 opacity-80"
        style={{
          background: 'linear-gradient(90deg, rgba(0,43,127,1) 0%, rgba(0,43,127,1) 33%, rgba(252,209,22,1) 33%, rgba(252,209,22,1) 66%, rgba(206,17,38,1) 66%, rgba(206,17,38,1) 100%)',
          mixBlendMode: 'multiply'
        }}
      />
      {/* Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]"></div>

      <div className="relative flex items-center justify-between px-4 h-full">
        {/* Left: Logo/Icon + Search */}
        <div className="flex items-center space-x-3 z-10 w-auto">
           {/* APP LOGO IMPLEMENTATION */}
           <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md overflow-hidden border-2 border-white/50">
             {/* Uses local logo.png, falls back to coat of arms if missing */}
             <img 
               src="/logo.png" 
               alt="App Logo" 
               className="w-full h-full object-cover"
               onError={(e) => {
                 // Use a reliable SVG from Wikimedia as fallback
                 (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/commons/7/70/Coat_of_arms_of_Romania.svg';
               }}
             />
           </div>
           
           {/* Search Button (Moved to Left) */}
           {isLoggedIn && (
            <button onClick={onSearchClick} className="text-white bg-black/20 hover:bg-black/30 transition-colors p-2 rounded-full">
              <Search className="w-5 h-5" />
            </button>
           )}
        </div>

        {/* Center: Title (Absolutely Centered) */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
            <h1 className="text-2xl font-bold text-white drop-shadow-md tracking-wide whitespace-nowrap">ConsulaRO</h1>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center space-x-2 z-10 justify-end w-auto">
          {/* Language Dropdown */}
          <div className="relative group">
            <button 
              className="flex items-center space-x-1 text-white font-medium bg-black/20 px-2 py-1 rounded"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span className="text-xs">{currentLang}</span>
              <GlobeIcon className="w-4 h-4" />
            </button>
            {/* Simple dropdown */}
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)}></div>
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg py-1 z-20 max-h-60 overflow-y-auto">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { setLang(lang.code); setMenuOpen(false); }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {isLoggedIn && (
            <button onClick={onProfileClick} className="text-white hover:text-gray-200 transition-colors p-1">
              <User className="w-5 h-5" />
            </button>
          )}
          <button onClick={onSettingsClick} className="text-white hover:text-gray-200 transition-colors p-1">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

const BottomNav = ({ currentView, setView, t }: { currentView: ViewState, setView: (v: ViewState) => void, t: (k:string) => string }) => {
  const navItems = [
    { view: 'HOME', icon: Home, label: t('nav_home') },
    { view: 'SERVICES', icon: Book, label: t('nav_services') },
    { view: 'SEND_DOCS', icon: Send, label: t('nav_send') },
    { view: 'EVENTS_LIST', icon: Calendar, label: t('nav_events') },
    { view: 'FAQ', icon: HelpCircle, label: t('nav_faq') },
  ];

  return (
    <nav className="fixed bottom-0 w-full bg-blue-50 pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-40 border-t border-blue-100">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = currentView === item.view;
          const Icon = item.icon;
          return (
            <button
              key={item.view}
              onClick={() => setView(item.view as ViewState)}
              className={`flex flex-col items-center justify-center w-full h-full transition-colors ${isActive ? 'text-ro-blue bg-blue-100' : 'text-gray-400 hover:text-ro-blue'}`}
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? 'stroke-[2.5px]' : ''}`} />
              <span className="text-xs font-bold">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

const SearchOverlay = ({ 
  isOpen, 
  onClose, 
  onNavigate,
  t
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onNavigate: (view: ViewState) => void;
  t: (k:string)=>string;
}) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<SearchCategory>('ALL');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) setTimeout(() => inputRef.current?.focus(), 100);
    if (!isOpen) { setQuery(''); setCategory('ALL'); }
  }, [isOpen]);

  const results = useMemo(() => {
    if (!query.trim()) return null;
    const lowerQuery = query.toLowerCase();
    
    const services = SERVICE_CATEGORIES.filter(s => 
      s.title.toLowerCase().includes(lowerQuery) || 
      s.subServices.some(sub => sub.name.toLowerCase().includes(lowerQuery))
    );
    
    const announcements = MOCK_ANNOUNCEMENTS.filter(a => a.title.toLowerCase().includes(lowerQuery) || a.shortDescription.toLowerCase().includes(lowerQuery));
    const events = MOCK_EVENTS.filter(e => e.title.toLowerCase().includes(lowerQuery) || e.location.toLowerCase().includes(lowerQuery));
    const faqs = FAQ_DATA.flatMap(cat => cat.questions.filter(q => q.question.toLowerCase().includes(lowerQuery) || q.answer.toLowerCase().includes(lowerQuery)).map(q => ({ ...q, category: cat.title })));
    return { services, announcements, events, faqs };
  }, [query]);

  if (!isOpen) return null;
  const hasResults = results && (results.services.length > 0 || results.announcements.length > 0 || results.events.length > 0 || results.faqs.length > 0);

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col animate-fade-in">
      <div className="p-4 border-b flex items-center gap-2 bg-gray-50">
        <Search className="w-5 h-5 text-gray-500" />
        <input ref={inputRef} className="flex-1 bg-transparent outline-none text-lg" placeholder={t('search_placeholder')} value={query} onChange={(e) => setQuery(e.target.value)} />
        <button onClick={onClose} className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"><X className="w-5 h-5 text-gray-700" /></button>
      </div>
      <div className="px-4 py-3 flex gap-2 overflow-x-auto hide-scrollbar border-b">
        {(['ALL', 'SERVICES', 'ANNOUNCEMENTS', 'EVENTS', 'FAQ'] as SearchCategory[]).map(cat => (
          <button key={cat} onClick={() => setCategory(cat)} className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${category === cat ? 'bg-ro-blue text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{cat}</button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50">
        {!query && <div className="text-center text-gray-400 mt-20"><Search className="w-16 h-16 mx-auto mb-4 opacity-20" /><p>...</p></div>}
        {query && !hasResults && <div className="text-center text-gray-500 mt-20">{t('no_results')} "{query}".</div>}
        {results && (
          <div className="space-y-6">
            {(category === 'ALL' || category === 'SERVICES') && results.services.length > 0 && (
              <div><h3 className="text-sm font-bold text-gray-500 uppercase mb-2">{t('nav_services')}</h3>
                <div className="space-y-2">{results.services.map(s => (<div key={s.id} onClick={() => { onNavigate('SERVICES'); onClose(); }} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex items-center gap-3 cursor-pointer hover:bg-blue-50"><div className="bg-blue-100 p-2 rounded-full text-ro-blue"><Book className="w-4 h-4"/></div><div><div className="font-bold text-gray-800">{s.title}</div><div className="text-xs text-gray-500 truncate max-w-[250px]">{s.subServices.map(sub => sub.name).join(', ')}</div></div></div>))}</div></div>
            )}
            {(category === 'ALL' || category === 'ANNOUNCEMENTS') && results.announcements.length > 0 && (
              <div><h3 className="text-sm font-bold text-gray-500 uppercase mb-2">{t('title_announcements')}</h3>
              <div className="space-y-2">{results.announcements.map(a => (<div key={a.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100"><div className="font-bold text-gray-800">{a.title}</div><div className="text-xs text-gray-500">{a.shortDescription}</div></div>))}</div></div>
            )}
            {(category === 'ALL' || category === 'EVENTS') && results.events.length > 0 && (
               <div><h3 className="text-sm font-bold text-gray-500 uppercase mb-2">{t('title_events')}</h3>
               <div className="space-y-2">{results.events.map(e => (<div key={e.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100"><div className="font-bold text-gray-800">{e.title}</div><div className="text-xs text-gray-500">{e.location} - {e.date}</div></div>))}</div></div>
            )}
            {(category === 'ALL' || category === 'FAQ') && results.faqs.length > 0 && (
               <div><h3 className="text-sm font-bold text-gray-500 uppercase mb-2">{t('nav_faq')}</h3>
               <div className="space-y-2">{results.faqs.map((f, i) => (<div key={i} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100"><div className="font-bold text-gray-800 text-sm">{f.question}</div><div className="text-xs text-gray-500 mt-1">{f.answer}</div></div>))}</div></div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};


// --- Main App Component ---

const App = () => {
  // State
  const [view, setView] = useState<ViewState>('SPLASH');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [language, setLanguage] = useState<LanguageCode>('RO');
  const [textSize, setTextSize] = useState<TextSize>(TextSize.MEDIUM);
  const [theme, setTheme] = useState<AppTheme>(AppTheme.AUTO);
  const [user, setUser] = useState<UserProfile>({
    firstName: '', lastName: '', email: '', phone: '', address: '', city: '', country: '', county: '', username: '', avatarUrl: null, postCode: ''
  });
  
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationPreferences>({
    enabled: false, announcements: true, events: true, requests: true
  });

  const t = useTranslation(language);

  // Auth State Listener
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setIsLoggedIn(true);
        // Ensure user profile is loaded if not already
        if (!user.email || user.email !== session.user.email) {
          loadUserProfile(session.user.id, session.user.email!);
        }
        if (view === 'AUTH' || view === 'SPLASH') {
          setView('HOME');
        }
      } else {
        setIsLoggedIn(false);
        setUser({ firstName: '', lastName: '', email: '', phone: '', address: '', city: '', country: '', county: '', username: '', avatarUrl: null, postCode: '' });
        if (view !== 'SPLASH') {
          setView('AUTH');
        }
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [view, user.email]);

  // Splash logic
  const handleSplashFinish = () => {
    // Check if session exists (listener will handle state, this just moves view if needed)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setView('HOME');
      } else {
        setView('AUTH');
      }
    });
  };

  const loadUserProfile = async (userId: string, email: string) => {
    try {
        // --- Operatiunea SELECT (pentru citirea datelor) ---
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .maybeSingle();
            
        // Logica de inserare (doar daca nu exista)
        if (!data) {
             // In loc de INSERT simplu, trimitem datele pe care le avem.
             // Folosim UPSET pentru a insera/actualiza intr-un singur pas
             // Daca politicile sunt corecte, acest UPSET va crea rândul nou.

             const initialProfileData = {
                 id: userId,
                 email: email, // O coloana utila, desi nu e PK
                 // Setează minimum de coloane necesare, restul pot fi NULL
             };

             const { error: upsertError } = await supabase
                .from('profiles')
                .upsert([initialProfileData], { onConflict: 'id' }); 
                // onConflict: 'id' asigura ca va face INSERT daca nu gaseste ID-ul

             if (upsertError) {
                 console.error("Eroare la UPSET profil:", upsertError);
                 // Dacă aici apare 42501, e clar o problemă de RLS pe server
                 return;
             }
        }
        
        // ... Logica de mapare a datelor (similar cu ce aveai) ...
        // Rulează din nou SELECT-ul după upsert sau actualizează starea direct.
        // Pentru simplitate, să presupunem că rămâi la logica ta de SELECT *

    } catch (e) {
        console.error("Eroare generala la incarcarea/crearea profilului", e);
    }
};

  const handleLogin = (userId: string, email: string) => {
    // Auth listener handles the rest
    loadUserProfile(userId, email);
  };

  // Render Content based on View
  const renderContent = () => {
    switch (view) {
      case 'AUTH': return <AuthScreen onLogin={handleLogin} t={t} />;
      case 'HOME': return <HomeScreen t={t} />;
      case 'SERVICES': return <ServicesScreen t={t} />;
      case 'SEND_DOCS': return <SendDocsScreen user={user} t={t} />;
      case 'EVENTS_LIST': return <EventsScreen t={t} />;
      case 'FAQ': return <FaqScreen t={t} />;
      case 'SETTINGS': return (
        <SettingsScreen 
          textSize={textSize} setTextSize={setTextSize} 
          theme={theme} setTheme={setTheme} 
          setView={setView} 
          notifications={notifications}
          setNotifications={setNotifications}
          t={t}
        />
      );
      case 'PROFILE': return <ProfileScreen user={user} setUser={setUser} onLogout={() => { setIsLoggedIn(false); setView('AUTH'); }} t={t} />;
      default: return <div className="p-4">Loading...</div>;
    }
  };

  const textSizeClass = textSize;
  const themeClass = theme === AppTheme.DARK ? 'bg-gray-900 text-white' : 'bg-consular-bg text-gray-800';

  if (view === 'SPLASH') {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <div className={`min-h-screen flex flex-col font-sans ${textSizeClass} ${themeClass} relative`}>
      {view !== 'AUTH' && (
        <Header 
          currentLang={language} 
          setLang={setLanguage} 
          onProfileClick={() => setView('PROFILE')}
          onSettingsClick={() => setView('SETTINGS')}
          onSearchClick={() => setSearchOpen(true)}
          isLoggedIn={isLoggedIn}
        />
      )}
      
      <main className={`flex-1 overflow-y-auto pb-20 ${view === 'AUTH' ? 'pb-0' : ''}`}>
        {renderContent()}
      </main>

      {view !== 'AUTH' && (
        <BottomNav currentView={view} setView={setView} t={t} />
      )}

      <SearchOverlay 
        isOpen={searchOpen} 
        onClose={() => setSearchOpen(false)} 
        onNavigate={setView}
        t={t}
      />
    </div>
  );
};

// --- Screens ---

const AuthScreen = ({ onLogin, t }: { onLogin: (uid: string, email: string) => void, t: (k:string)=>string }) => {
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'REGISTER') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
              country: country
            }
          }
        });
        if (error) throw error;
        if (data.user) {
          onLogin(data.user.id, email);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (data.user) {
          onLogin(data.user.id, email);
        }
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-consular-bg">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-700 via-yellow-500 to-red-600 h-2 opacity-80" />
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-ro-blue mb-2">ConsulaRO</h2>
            <p className="text-gray-500">{t('welcome')}</p>
          </div>

          <div className="flex mb-6 border-b">
            <button 
              className={`flex-1 py-2 font-medium ${mode === 'LOGIN' ? 'text-ro-blue border-b-2 border-ro-blue' : 'text-gray-400'}`}
              onClick={() => setMode('LOGIN')}
            >
              {t('auth_login')}
            </button>
            <button 
              className={`flex-1 py-2 font-medium ${mode === 'REGISTER' ? 'text-ro-blue border-b-2 border-ro-blue' : 'text-gray-400'}`}
              onClick={() => setMode('REGISTER')}
            >
              {t('auth_register')}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'REGISTER' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <input required type="text" placeholder="Nume" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ro-blue outline-none" />
                  <input required type="text" placeholder="Prenume" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ro-blue outline-none" />
                </div>
                <input required type="text" placeholder="Țara de reședință" value={country} onChange={e => setCountry(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ro-blue outline-none" />
              </>
            )}
            <input required type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ro-blue outline-none" />
            <input required type="password" placeholder="Parola" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ro-blue outline-none" />
            
            <Button type="submit" fullWidth className="mt-4 text-lg" disabled={loading}>
              {loading ? 'Processing...' : (mode === 'LOGIN' ? t('btn_login') : t('btn_create'))}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- Reusable Detail Modal with Image Toggle ---
const DetailModal = ({ isOpen, onClose, title, imageUrl, children }: { isOpen: boolean, onClose: () => void, title: string, imageUrl?: string, children?: React.ReactNode }) => {
  const [imageOnly, setImageOnly] = useState(false);

  // Reset state when opening a new modal
  useEffect(() => {
    if(isOpen) setImageOnly(false);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} fullScreen={imageOnly}>
      <div className="flex flex-col h-full">
        {imageUrl && (
          <div 
             className={`transition-all duration-300 relative cursor-pointer ${imageOnly ? 'flex-1 bg-black flex items-center justify-center' : 'h-48 mb-4'}`}
             onClick={() => setImageOnly(!imageOnly)}
          >
             <img 
               src={imageUrl} 
               className={`object-cover w-full h-full ${imageOnly ? 'object-contain' : 'rounded-lg'}`} 
               alt="Detail" 
             />
             {!imageOnly && <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded">Apasă pentru zoom</div>}
          </div>
        )}
        {!imageOnly && (
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
        )}
      </div>
    </Modal>
  );
};

const HomeScreen = ({ t }: { t: (k:string)=>string }) => {
  const [appModalOpen, setAppModalOpen] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState(false);
  
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  
  const [eventsModalOpen, setEventsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  // New Horizontal Carousel
  const Carousel = ({ title, items, type }: { title: string, items: any[], type: 'announcement' | 'event' }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    
    // Auto Rotation Logic
    useEffect(() => {
      const intervalDuration = type === 'announcement' ? 15000 : 12000;
      const interval = setInterval(() => {
        if (scrollRef.current) {
          const { scrollLeft, clientWidth, scrollWidth } = scrollRef.current;
          // If at end, loop back, else scroll next
          if (scrollLeft + clientWidth >= scrollWidth - 10) {
             scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
             scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' }); // Approximate card width
          }
        }
      }, intervalDuration);
      return () => clearInterval(interval);
    }, [type]);

    return (
      <div className="mb-8">
        <div className="flex justify-between items-center px-4 mb-3">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            {type === 'announcement' ? <Bell className="w-5 h-5 text-ro-red" /> : <Calendar className="w-5 h-5 text-ro-blue" />}
            {title}
          </h3>
          <button 
            onClick={() => type === 'announcement' ? setAnnouncementModalOpen(true) : setEventsModalOpen(true)}
            className="text-sm text-ro-blue font-medium hover:underline"
          >
            {t('view_all')}
          </button>
        </div>
        <div ref={scrollRef} className="flex overflow-x-auto px-4 pb-4 gap-4 snap-x hide-scrollbar">
          {items.slice(0, 5).map((item) => (
            <div 
              key={item.id} 
              onClick={() => type === 'announcement' ? setSelectedAnnouncement(item) : setSelectedEvent(item)}
              className="flex-shrink-0 w-[85vw] max-w-sm bg-white rounded-xl shadow-md snap-center active:scale-95 transition-transform cursor-pointer overflow-hidden border border-gray-100 flex h-32"
            >
              {/* Image 1/3 */}
              <div className="w-1/3 relative h-full">
                 <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
              </div>
              {/* Content 2/3 */}
              <div className="w-2/3 p-3 flex flex-col justify-center">
                <h4 className="font-bold text-gray-800 line-clamp-2 text-sm mb-1">{item.title}</h4>
                <div className="text-xs text-ro-red font-semibold mb-1">{item.date}</div>
                <p className="text-xs text-gray-500 line-clamp-2 leading-tight">
                  {type === 'announcement' ? (item as Announcement).shortDescription : (item as EventItem).location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="py-6">
      {/* App Presentation Card */}
      <div className="px-4 mb-8">
        <div 
          onClick={() => setAppModalOpen(true)}
          className="bg-white rounded-2xl shadow-lg p-4 flex items-center gap-4 cursor-pointer active:scale-95 transition-transform border border-blue-100"
        >
          <div className="w-1/3 flex items-center justify-center border-r border-gray-100 pr-4">
             {/* MAE Logo Placeholder - RESIZED */}
             <div className="w-24 h-24 flex items-center justify-center">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/7/70/Coat_of_arms_of_Romania.svg" 
                  alt="MAE" 
                  className="w-full h-full object-contain opacity-90"
                />
             </div>
          </div>
          <div className="w-2/3">
             <h2 className="text-lg font-bold text-gray-800 mb-1">{t('about_app')}</h2>
             <p className="text-sm text-gray-600 line-clamp-2">{APP_DESCRIPTION_SHORT}</p>
          </div>
        </div>
      </div>

      <Carousel title={t('title_announcements')} items={MOCK_ANNOUNCEMENTS} type="announcement" />
      <Carousel title={t('title_events')} items={MOCK_EVENTS} type="event" />

      {/* App Description Modal */}
      <Modal isOpen={appModalOpen} onClose={() => setAppModalOpen(false)} title={t('about_app')} fullScreen={fullScreenImage}>
        <div className="flex flex-col h-full">
           <div 
             className={`transition-all duration-300 ${fullScreenImage ? 'flex-1 flex items-center justify-center bg-black' : 'h-48 mb-4'}`}
             onClick={() => setFullScreenImage(!fullScreenImage)}
           >
             <div className={`w-full h-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center cursor-zoom-in ${fullScreenImage ? 'cursor-zoom-out' : 'rounded-lg'}`}>
                <Flag className={`${fullScreenImage ? 'w-32 h-32' : 'w-16 h-16'} text-white`} />
             </div>
           </div>
           {!fullScreenImage && (
             <div className="text-gray-700 leading-relaxed text-justify">
               <p>{APP_DESCRIPTION_FULL}</p>
             </div>
           )}
        </div>
      </Modal>

      {/* Announcements List Modal */}
      <Modal isOpen={announcementModalOpen} onClose={() => setAnnouncementModalOpen(false)} title={t('title_announcements')}>
        <div className="space-y-4">
          {MOCK_ANNOUNCEMENTS.map(item => (
            <div key={item.id} onClick={() => setSelectedAnnouncement(item)} className="bg-white border rounded-lg p-2 flex gap-3 shadow-sm active:bg-gray-50 cursor-pointer h-24 overflow-hidden">
               <img src={item.imageUrl} className="w-1/3 object-cover rounded-md" alt="" />
               <div className="flex-1 w-2/3">
                 <h4 className="font-bold text-sm mb-1 line-clamp-1">{item.title}</h4>
                 <p className="text-xs text-gray-500 line-clamp-2">{item.shortDescription}</p>
                 <span className="text-xs text-ro-red mt-1 block">{item.date}</span>
               </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* Events List Modal */}
      <Modal isOpen={eventsModalOpen} onClose={() => setEventsModalOpen(false)} title={t('title_events')}>
        <div className="space-y-4">
          {MOCK_EVENTS.map(item => (
            <div key={item.id} onClick={() => setSelectedEvent(item)} className="bg-white border rounded-lg p-2 flex gap-3 shadow-sm active:bg-gray-50 cursor-pointer h-24 overflow-hidden">
               <img src={item.imageUrl} className="w-1/3 object-cover rounded-md" alt="" />
               <div className="flex-1 w-2/3">
                 <h4 className="font-bold text-sm mb-1 line-clamp-1">{item.title}</h4>
                 <p className="text-xs text-gray-500">{item.location}</p>
                 <span className="text-xs text-blue-600 font-medium block mt-1">{item.date}</span>
               </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* Detail Modals with Image Toggle Logic */}
      <DetailModal 
        isOpen={!!selectedAnnouncement} 
        onClose={() => setSelectedAnnouncement(null)} 
        title="Detalii Anunț"
        imageUrl={selectedAnnouncement?.imageUrl}
      >
        {selectedAnnouncement && (
          <>
            <h2 className="text-xl font-bold text-ro-blue mb-2">{selectedAnnouncement.title}</h2>
            <div className="text-sm text-gray-500 mb-4">{selectedAnnouncement.date}</div>
            <p className="text-gray-700 whitespace-pre-line">{selectedAnnouncement.fullDescription}</p>
          </>
        )}
      </DetailModal>

      <DetailModal 
        isOpen={!!selectedEvent} 
        onClose={() => setSelectedEvent(null)} 
        title="Detalii Eveniment"
        imageUrl={selectedEvent?.imageUrl}
      >
        {selectedEvent && (
          <>
            <h2 className="text-xl font-bold text-ro-blue mb-1">{selectedEvent.title}</h2>
            <div className="text-sm text-ro-red font-semibold mb-2">{selectedEvent.location} • {selectedEvent.date}</div>
            <p className="text-gray-700 whitespace-pre-line">{selectedEvent.description}</p>
          </>
        )}
      </DetailModal>
    </div>
  );
};

const EventsScreen = ({ t }: { t: (k:string)=>string }) => {
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-ro-blue mb-6 text-center">{t('nav_events')}</h2>
      <div className="space-y-4">
        {MOCK_EVENTS.map(item => (
          <div 
            key={item.id} 
            onClick={() => setSelectedEvent(item)} 
            className="bg-white rounded-xl shadow-md cursor-pointer hover:shadow-lg transition-all border border-gray-100 flex h-32 overflow-hidden"
          >
            {/* Image 1/3 */}
            <div className="w-1/3 relative h-full">
               <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
            </div>
            {/* Content 2/3 */}
            <div className="w-2/3 p-3 flex flex-col justify-center">
              <h4 className="font-bold text-gray-800 line-clamp-1 mb-1">{item.title}</h4>
              <div className="flex items-center text-xs text-ro-red font-semibold mb-2">
                <Calendar className="w-3 h-3 mr-1" />
                {item.date}
              </div>
              <p className="text-xs text-gray-500 line-clamp-3 leading-snug">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <DetailModal 
        isOpen={!!selectedEvent} 
        onClose={() => setSelectedEvent(null)} 
        title="Detalii Eveniment"
        imageUrl={selectedEvent?.imageUrl}
      >
        {selectedEvent && (
          <>
            <h2 className="text-xl font-bold text-ro-blue mb-1">{selectedEvent.title}</h2>
            <div className="text-sm text-ro-red font-semibold mb-2">{selectedEvent.location} • {selectedEvent.date}</div>
            <p className="text-gray-700 whitespace-pre-line">{selectedEvent.description}</p>
          </>
        )}
      </DetailModal>
    </div>
  );
}

const ServicesScreen = ({ t }: { t: (k:string)=>string }) => {
  const [selectedService, setSelectedService] = useState<ServiceCategory | null>(null);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-ro-blue mb-6 text-center">{t('services_title')}</h2>
      <div className="grid grid-cols-1 gap-4">
        {SERVICE_CATEGORIES.map((service) => {
          const Icon = IconMap[service.iconName] || FileText;
          return (
            <div 
              key={service.id} 
              onClick={() => setSelectedService(service)}
              className="bg-white rounded-xl shadow-md p-4 flex items-center cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-ro-blue"
            >
              <div className="w-1/4 flex justify-center border-r border-gray-100 pr-4">
                <Icon className="w-8 h-8 text-ro-blue" />
              </div>
              <div className="w-3/4 pl-4">
                <h3 className="text-lg font-bold text-gray-800">{service.title}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <Modal isOpen={!!selectedService} onClose={() => setSelectedService(null)} title={selectedService?.title}>
        {selectedService && (
          <div className="space-y-2">
            <p className="text-sm text-gray-500 mb-4">Selectați serviciul dorit pentru a fi redirecționat către portalul E-Consulat (www.econsulat.ro).</p>
            {selectedService.subServices.map((sub, idx) => (
              <a 
                href={sub.url}
                target="_blank"
                rel="noreferrer"
                key={idx}
                className="block p-3 bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 text-ro-blue font-medium transition-colors flex justify-between items-center"
              >
                {sub.name}
                <ChevronRight className="w-4 h-4" />
              </a>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
};

const SendDocsScreen = ({ user, t }: { user: UserProfile, t: (k:string)=>string }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'image' | 'pdf' | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFile(f);
      
      if (f.type.includes('image')) {
        setFileType('image');
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(f);
      } else if (f.type.includes('pdf')) {
        setFileType('pdf');
        setPreview(null);
      }
      
      setModalOpen(true);
    }
  };

  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-center mb-8">
        <Send className="w-16 h-16 text-ro-blue mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">{t('send_docs_title')}</h2>
        <p className="text-gray-500 mt-2">{t('send_docs_desc')}</p>
      </div>
      
      <div className="w-full max-w-sm">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-ro-blue rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <ImageIcon className="w-8 h-8 text-ro-blue mb-2" />
            <p className="text-sm text-gray-500 font-semibold">{t('upload_text')}</p>
          </div>
          <input type="file" className="hidden" accept="image/*,application/pdf" onChange={handleFileChange} />
        </label>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Confirmare Trimitere">
        <div className="space-y-4">
          <div className="bg-gray-100 p-3 rounded text-sm">
            <p><strong>Nume:</strong> {user.firstName} {user.lastName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Țara:</strong> {user.country}</p>
          </div>
          
          <div className="border rounded p-2 flex flex-col items-center justify-center bg-gray-50">
            <p className="text-xs text-gray-500 mb-2 w-full text-left">Previzualizare:</p>
            {fileType === 'image' && preview ? (
              <img src={preview} alt="Preview" className="max-h-40 mx-auto rounded shadow-sm" />
            ) : fileType === 'pdf' ? (
               <div className="flex flex-col items-center text-ro-red py-4">
                 <FileText className="w-12 h-12 mb-2" />
                 <span className="text-sm font-bold text-gray-700">{file?.name}</span>
                 <span className="text-xs text-gray-500">Document PDF</span>
               </div>
            ) : (
              <div className="py-4 text-gray-400">Previzualizare indisponibilă</div>
            )}
          </div>

          <div className="text-xs text-gray-500">
            Prin trimitere, sunteți de acord cu prelucrarea datelor cu caracter personal de către personalul consular.
          </div>
          
          <Button fullWidth onClick={() => { alert('Document trimis cu succes!'); setModalOpen(false); setFile(null); setPreview(null); }}>
            Trimite către Consulat
          </Button>
        </div>
      </Modal>
    </div>
  );
};

const FaqScreen = ({ t }: { t: (k:string)=>string }) => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-ro-blue mb-6 text-center">{t('faq_title')}</h2>
      <div className="space-y-6">
        {FAQ_DATA.map((category) => (
          <div key={category.id} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <h3 className="text-lg font-bold text-ro-red mb-3 border-b pb-2">{category.title}</h3>
            <div className="space-y-3">
              {category.questions.map((q, idx) => (
                <details key={idx} className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-gray-800 hover:text-ro-blue">
                    <span>{q.question}</span>
                    <span className="transition group-open:rotate-180">
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </summary>
                  <div className="text-gray-600 mt-2 text-sm pl-2 border-l-2 border-gray-200">
                    {q.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SettingsScreen = ({ 
  textSize, setTextSize, theme, setTheme, setView, notifications, setNotifications, t
}: { 
  textSize: TextSize, setTextSize: (s: TextSize) => void,
  theme: AppTheme, setTheme: (t: AppTheme) => void,
  setView: (v: ViewState) => void,
  notifications: NotificationPreferences,
  setNotifications: (n: NotificationPreferences) => void,
  t: (k:string)=>string
}) => {
  const [contactOpen, setContactOpen] = useState(false);

  const handleNotificationToggle = async () => {
    if (!notifications.enabled) {
      if ("Notification" in window) {
        const permission = await Notification.requestPermission();
        if (permission === "granted") setNotifications({ ...notifications, enabled: true });
        else alert("Trebuie să permiteți notificările din browser pentru a activa această funcție.");
      } else {
        setNotifications({ ...notifications, enabled: true });
      }
    } else {
      setNotifications({ ...notifications, enabled: false });
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center mb-4">
        <button onClick={() => setView('HOME')} className="mr-2 p-1 rounded-full bg-gray-200">
           <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold">{t('settings_title')}</h2>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <Bell className="w-5 h-5 text-ro-red" /> {t('settings_notifications')}
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">Activează Notificări</span>
            <button 
              onClick={handleNotificationToggle}
              className={`w-12 h-6 rounded-full transition-colors flex items-center px-1 ${notifications.enabled ? 'bg-ro-blue' : 'bg-gray-300'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${notifications.enabled ? 'translate-x-6' : ''}`} />
            </button>
          </div>
          
          {notifications.enabled && (
            <div className="pl-2 border-l-2 border-gray-200 space-y-3 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Noutăți și Anunțuri</span>
                <input type="checkbox" checked={notifications.announcements} onChange={(e) => setNotifications({...notifications, announcements: e.target.checked})} className="w-5 h-5 text-ro-blue" />
              </div>
              {/* ... other notification options ... */}
            </div>
          )}
        </div>
      </div>

      {/* Text Size */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-3">{t('settings_text_size')}</h3>
        <div className="flex justify-between gap-2">
          {(['SMALL', 'MEDIUM', 'LARGE', 'XLARGE'] as const).map((sizeKey) => (
            <button
              key={sizeKey}
              onClick={() => setTextSize(TextSize[sizeKey])}
              className={`flex-1 py-2 rounded border ${textSize === TextSize[sizeKey] ? 'bg-ro-blue text-white' : 'bg-gray-50'}`}
            >
              {sizeKey === 'SMALL' ? 'A' : sizeKey === 'MEDIUM' ? 'A+' : sizeKey === 'LARGE' ? 'A++' : 'A+++'}
            </button>
          ))}
        </div>
      </div>

      {/* Theme */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-3">{t('settings_theme')}</h3>
        <div className="flex justify-between gap-2">
          <button onClick={() => setTheme(AppTheme.LIGHT)} className={`flex-1 p-2 rounded flex flex-col items-center ${theme === AppTheme.LIGHT ? 'bg-blue-100 text-ro-blue border border-ro-blue' : 'bg-gray-50'}`}>
            <Sun className="w-5 h-5 mb-1" /> <span className="text-xs">Deschis</span>
          </button>
          <button onClick={() => setTheme(AppTheme.DARK)} className={`flex-1 p-2 rounded flex flex-col items-center ${theme === AppTheme.DARK ? 'bg-gray-800 text-white' : 'bg-gray-50'}`}>
            <Moon className="w-5 h-5 mb-1" /> <span className="text-xs">Întunecat</span>
          </button>
          <button onClick={() => setTheme(AppTheme.AUTO)} className={`flex-1 p-2 rounded flex flex-col items-center ${theme === AppTheme.AUTO ? 'bg-blue-100 text-ro-blue border border-ro-blue' : 'bg-gray-50'}`}>
            <Monitor className="w-5 h-5 mb-1" /> <span className="text-xs">Auto</span>
          </button>
        </div>
      </div>

      {/* Links */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <button onClick={() => setContactOpen(true)} className="w-full text-left p-4 hover:bg-gray-50 flex justify-between">{t('settings_contact')} <ChevronRight className="w-4 h-4 text-gray-400"/></button>
      </div>

      {/* Social */}
      <div className="flex gap-4 justify-center mt-8">
        <button className="bg-[#1877F2] text-white p-3 rounded-full shadow-lg hover:opacity-90"><span className="font-bold">Facebook</span></button>
        <button className="bg-[#25D366] text-white p-3 rounded-full shadow-lg hover:opacity-90"><span className="font-bold">WhatsApp</span></button>
      </div>

      <Modal isOpen={contactOpen} onClose={() => setContactOpen(false)} title={t('settings_contact')}>
        <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); alert("Mesaj trimis!"); setContactOpen(false); }}>
          <input className="w-full border p-2 rounded" placeholder="Nume" required />
          <input className="w-full border p-2 rounded" placeholder="Email" type="email" required />
          <textarea className="w-full border p-2 rounded h-32" placeholder="Mesajul tău..." required></textarea>
          <Button type="submit" fullWidth>Trimite</Button>
        </form>
      </Modal>
    </div>
  );
};

const ProfileScreen = ({ user, setUser, onLogout, t }: { user: UserProfile, setUser: (u: UserProfile) => void, onLogout: () => void, t: (k:string)=>string }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);
  const [saving, setSaving] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  // Sync formData if user changes
  useEffect(() => {
    setFormData(user);
  }, [user]);
  
  const handleSave = async () => {
    setSaving(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      alert("Sesiunea a expirat. Vă rugăm să vă autentificați din nou.");
      setSaving(false);
      onLogout();
      return;
    }
  
    try {
      // Map frontend fields to backend columns
      const updates = {
          id: session.user.id,
          first_name: formData.firstName || null,
          last_name: formData.lastName || null,
          username: formData.username || null,
          phone: formData.phone || null,
          address: formData.address || null,
          city: formData.city || null,
          country: formData.country || null,
          county: formData.county || null, // New field mapped to county
          post_code: formData.postCode || null, // Updated map to post_code
          avatar_url: formData.avatarUrl || null, // Updated map to avatar_url
          updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(updates, { onConflict: 'id' });
  
      if (error) {
        // Force string representation for console
        console.error('Supabase Error Debug:', JSON.stringify(error, null, 2));
        
        let errorMsg = '';
        
        // Type assertion for PostgrestError-like structure
        const pgError = error as any;

        // prioritize specific fields
        if (pgError.message) {
            errorMsg += `Mesaj: ${pgError.message}`;
        }
        if (pgError.details) {
            errorMsg += `\nDetalii: ${pgError.details}`;
        }
        if (pgError.hint) {
            errorMsg += `\nSugestie: ${pgError.hint}`;
        }
        if (pgError.code) {
            errorMsg += `\nCod: ${pgError.code}`;
        }

        // Add hint for missing columns
        if (pgError.code === 'PGRST204') {
             errorMsg += "\n\n(Această eroare indică faptul că baza de date nu a fost actualizată. Vă rugăm să rulați codul din db_schema.sql în Supabase SQL Editor.)";
        }
        
        // Handle Invalid Type error (BigInt vs UUID)
        if (pgError.code === '22P02') {
             errorMsg += "\n\n(Această eroare indică o problemă de tip de date în baza de date. ID-ul profilului este definit greșit ca număr (bigint) în loc de UUID. Vă rugăm să rulați scriptul SQL de reparare.)";
        }

        // Fallback if no specific fields found
        if (!errorMsg) {
             try {
               errorMsg = JSON.stringify(error);
             } catch (e) {
               errorMsg = "Eroare necunoscută (nu se poate parsa)";
             }
        }

        alert(`${t('profile_error')}\n\n${errorMsg}`);
      } else {
        setUser(formData);
        setIsEditing(false);
        alert(t('profile_success'));
      }
    } catch (err: any) {
      console.error('Unexpected Error:', err);
      alert("A apărut o eroare neașteptată: " + (err.message || String(err)));
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (file: File) => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return;

    // Simple upload logic
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `${authUser.id}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload to 'profile_images' bucket (updated)
    const { error: uploadError } = await supabase.storage
      .from('profile_images')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      alert('Eroare la încărcare imagine: ' + uploadError.message);
    } else {
      // Get public URL
      const { data: { publicUrl } } = supabase.storage.from('profile_images').getPublicUrl(filePath);
      // Update form data state with new image URL
      setFormData(prev => ({ ...prev, avatarUrl: publicUrl })); // Use avatarUrl
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handlePhotoUpload(e.target.files[0]);
    }
  };

  // Camera Component
  const CameraCapture = ({ onCapture, onClose }: { onCapture: (blob: Blob) => void, onClose: () => void }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    useEffect(() => {
      startCamera();
      return () => stopCamera();
    }, []);

    const startCamera = async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(s);
        if (videoRef.current) videoRef.current.srcObject = s;
      } catch (err) {
        alert("Nu se poate accesa camera.");
        onClose();
      }
    };

    const stopCamera = () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };

    const takePhoto = () => {
      if (videoRef.current) {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0);
          canvas.toBlob(blob => {
            if (blob) {
              onCapture(blob);
              onClose();
            }
          }, 'image/jpeg', 0.8);
        }
      }
    };

    return (
       <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4">
         <div className="relative w-full max-w-sm aspect-[3/4] bg-gray-900 rounded-lg overflow-hidden mb-4 border border-gray-700">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
         </div>
         <div className="flex gap-4">
            <button onClick={onClose} className="px-6 py-3 rounded-full bg-gray-600 text-white font-bold">{t('cam_cancel')}</button>
            <button onClick={takePhoto} className="px-6 py-3 rounded-full bg-white text-black font-bold border-4 border-gray-300">{t('cam_take')}</button>
         </div>
       </div>
    );
  };

  return (
    <div className="p-4 pb-24">
       {showCamera && (
         <CameraCapture 
           onClose={() => setShowCamera(false)} 
           onCapture={(blob) => {
             const file = new File([blob], "camera-photo.jpg", { type: "image/jpeg" });
             handlePhotoUpload(file);
           }} 
         />
       )}

       <div className="bg-white rounded-xl shadow-md p-6 mb-6">
         <div className="flex flex-col items-center mb-6">
           <div className="relative w-24 h-24 mb-4">
             <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-lg">
               {formData.avatarUrl ? (
                 <img src={formData.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                 <User className="w-full h-full p-4 text-gray-400" />
               )}
             </div>
             {isEditing && (
               <div className="absolute -bottom-2 -right-2 flex gap-1">
                 <label className="bg-ro-blue text-white p-2 rounded-full cursor-pointer shadow-sm hover:bg-blue-800">
                   <ImageIcon className="w-4 h-4" />
                   <input type="file" accept="image/*" className="hidden" onChange={onFileInputChange} />
                 </label>
                 <button 
                   onClick={() => setShowCamera(true)}
                   className="bg-ro-blue text-white p-2 rounded-full cursor-pointer shadow-sm hover:bg-blue-800"
                 >
                   <Camera className="w-4 h-4" />
                 </button>
               </div>
             )}
           </div>
           {!isEditing ? (
             <div className="text-center">
               <h2 className="text-xl font-bold">{formData.firstName} {formData.lastName}</h2>
               <p className="text-gray-500">{user.email}</p>
             </div>
           ) : (
             <div className="w-full space-y-2">
                <input 
                  value={formData.firstName} 
                  onChange={e => setFormData({...formData, firstName: e.target.value})} 
                  className="w-full p-2 rounded border bg-white text-center font-bold" 
                  placeholder={t('lbl_firstname')}
                />
                <input 
                  value={formData.lastName} 
                  onChange={e => setFormData({...formData, lastName: e.target.value})} 
                  className="w-full p-2 rounded border bg-white text-center font-bold" 
                  placeholder={t('lbl_lastname')}
                />
             </div>
           )}
         </div>

         <div className="space-y-4">
           <div>
             <label className="text-xs text-gray-500 block mb-1">{t('lbl_username')}</label>
             <input disabled={!isEditing} value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className={`w-full p-2 rounded border ${isEditing ? 'bg-white' : 'bg-gray-50'}`} placeholder={t('lbl_username')} />
           </div>
           <div>
             <label className="text-xs text-gray-500 block mb-1">{t('lbl_phone')}</label>
             <input disabled={!isEditing} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className={`w-full p-2 rounded border ${isEditing ? 'bg-white' : 'bg-gray-50'}`} placeholder={t('lbl_phone')} />
           </div>
           <div>
             <label className="text-xs text-gray-500 block mb-1">{t('lbl_address')}</label>
             <input disabled={!isEditing} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className={`w-full p-2 rounded border ${isEditing ? 'bg-white' : 'bg-gray-50'}`} placeholder={t('lbl_address')} />
           </div>
           <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 block mb-1">{t('lbl_city')}</label>
                <input disabled={!isEditing} value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className={`w-full p-2 rounded border ${isEditing ? 'bg-white' : 'bg-gray-50'}`} placeholder={t('lbl_city')} />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">{t('lbl_county')}</label>
                <input disabled={!isEditing} value={formData.county || ''} onChange={e => setFormData({...formData, county: e.target.value})} className={`w-full p-2 rounded border ${isEditing ? 'bg-white' : 'bg-gray-50'}`} placeholder={t('lbl_county')} />
              </div>
           </div>
           <div className="grid grid-cols-2 gap-4">
              <div>
                 <label className="text-xs text-gray-500 block mb-1">{t('lbl_country')}</label>
                 <input disabled={!isEditing} value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className={`w-full p-2 rounded border ${isEditing ? 'bg-white' : 'bg-gray-50'}`} placeholder={t('lbl_country')} />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">{t('lbl_postal')}</label>
                <input disabled={!isEditing} value={formData.postCode || ''} onChange={e => setFormData({...formData, postCode: e.target.value})} className={`w-full p-2 rounded border ${isEditing ? 'bg-white' : 'bg-gray-50'}`} placeholder={t('lbl_postal')} />
              </div>
           </div>
         </div>

         <div className="mt-8 flex gap-3">
           {isEditing ? (
             <Button fullWidth onClick={handleSave} disabled={saving}>{saving ? '...' : t('profile_save')}</Button>
           ) : (
             <Button fullWidth onClick={() => setIsEditing(true)}>{t('profile_edit')}</Button>
           )}
         </div>
       </div>

       <div className="space-y-3">
         <Button fullWidth variant="secondary" onClick={async () => { await supabase.auth.signOut(); onLogout(); }} className="flex items-center justify-center gap-2">
           <LogOut className="w-4 h-4" /> {t('profile_logout')}
         </Button>
         <Button fullWidth variant="danger" onClick={() => alert("Not implemented yet")}>{t('profile_delete')}</Button>
       </div>
    </div>
  );
};

export default App;
