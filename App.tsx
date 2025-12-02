
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Menu, X, Home, Book, Send, HelpCircle, Settings, User, 
  LogOut, Globe, Moon, Sun, Monitor, Camera, Bell, Calendar,
  ChevronRight, ChevronLeft, Image as ImageIcon, FileText, Users, Flag, FileCheck, Mail, BookOpen, UserCheck, MoreHorizontal, Search 
} from 'lucide-react';
import { 
  LanguageCode, UserProfile, AppTheme, TextSize, ViewState, 
  Announcement, EventItem, ServiceCategory, NotificationPreferences, SearchCategory
} from './types';
import { 
  LANGUAGES, MOCK_ANNOUNCEMENTS, MOCK_EVENTS, FAQ_DATA, 
  SERVICE_CATEGORIES, APP_DESCRIPTION_SHORT, APP_DESCRIPTION_FULL 
} from './constants';
import { Modal } from './components/Modal';
import { Button } from './components/Button';

// --- Icons Map Helper ---
const IconMap: Record<string, React.ElementType> = {
  FileText, Users, Flag, Globe, FileCheck, Mail, BookOpen, UserCheck, MoreHorizontal
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
    <header className="sticky top-0 z-40 w-full shadow-md">
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

      <div className="relative flex items-center justify-between px-4 py-3">
        {/* Left: Logo/Icon */}
        <div className="flex items-center space-x-2">
           <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-sm">
             <Flag className="text-ro-blue w-6 h-6" />
           </div>
        </div>

        {/* Center: Title */}
        <h1 className="text-2xl font-bold text-white drop-shadow-md tracking-wide">ConsulaRO</h1>

        {/* Right: Controls */}
        <div className="flex items-center space-x-3">
          {/* Search Button */}
          {isLoggedIn && (
            <button onClick={onSearchClick} className="text-white hover:text-gray-200 transition-colors">
              <Search className="w-6 h-6" />
            </button>
          )}

          {/* Language Dropdown */}
          <div className="relative group">
            <button 
              className="flex items-center space-x-1 text-white font-medium bg-black/20 px-2 py-1 rounded"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span>{currentLang}</span>
              <Globe className="w-4 h-4" />
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
            <button onClick={onProfileClick} className="text-white hover:text-gray-200 transition-colors">
              <User className="w-6 h-6" />
            </button>
          )}
          <button onClick={onSettingsClick} className="text-white hover:text-gray-200 transition-colors">
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

const BottomNav = ({ currentView, setView }: { currentView: ViewState, setView: (v: ViewState) => void }) => {
  const navItems = [
    { view: 'HOME', icon: Home, label: 'Acasă' },
    { view: 'SERVICES', icon: Book, label: 'Servicii' },
    { view: 'SEND_DOCS', icon: Send, label: 'Trimite' },
    { view: 'FAQ', icon: HelpCircle, label: 'Întrebări' },
  ];

  return (
    <nav className="fixed bottom-0 w-full bg-consular-dark pb-safe text-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-40">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = currentView === item.view;
          const Icon = item.icon;
          return (
            <button
              key={item.view}
              onClick={() => setView(item.view as ViewState)}
              className={`flex flex-col items-center justify-center w-full h-full transition-colors ${isActive ? 'text-ro-yellow bg-white/10' : 'text-gray-300 hover:text-white'}`}
            >
              <Icon className={`w-6 h-6 mb-1 ${isActive ? 'stroke-[2.5px]' : ''}`} />
              <span className="text-xs font-medium">{item.label}</span>
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
  onNavigate 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onNavigate: (view: ViewState) => void;
}) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<SearchCategory>('ALL');
  
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    if (!isOpen) {
      setQuery('');
      setCategory('ALL');
    }
  }, [isOpen]);

  const results = useMemo(() => {
    if (!query.trim()) return null;
    const lowerQuery = query.toLowerCase();

    const services = SERVICE_CATEGORIES.filter(s => 
      s.title.toLowerCase().includes(lowerQuery) || 
      s.subServices.some(sub => sub.toLowerCase().includes(lowerQuery))
    );

    const announcements = MOCK_ANNOUNCEMENTS.filter(a => 
      a.title.toLowerCase().includes(lowerQuery) || 
      a.shortDescription.toLowerCase().includes(lowerQuery)
    );

    const events = MOCK_EVENTS.filter(e => 
      e.title.toLowerCase().includes(lowerQuery) || 
      e.location.toLowerCase().includes(lowerQuery)
    );

    // Flatten FAQ for search
    const faqs = FAQ_DATA.flatMap(cat => 
      cat.questions.filter(q => 
        q.question.toLowerCase().includes(lowerQuery) || 
        q.answer.toLowerCase().includes(lowerQuery)
      ).map(q => ({ ...q, category: cat.title }))
    );

    return { services, announcements, events, faqs };
  }, [query]);

  if (!isOpen) return null;

  const hasResults = results && (
    results.services.length > 0 || 
    results.announcements.length > 0 || 
    results.events.length > 0 || 
    results.faqs.length > 0
  );

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col animate-fade-in">
      {/* Search Header */}
      <div className="p-4 border-b flex items-center gap-2 bg-gray-50">
        <Search className="w-5 h-5 text-gray-500" />
        <input 
          ref={inputRef}
          className="flex-1 bg-transparent outline-none text-lg"
          placeholder="Caută servicii, știri, evenimente..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={onClose} className="p-2 bg-gray-200 rounded-full hover:bg-gray-300">
          <X className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Filter Chips */}
      <div className="px-4 py-3 flex gap-2 overflow-x-auto hide-scrollbar border-b">
        {(['ALL', 'SERVICES', 'ANNOUNCEMENTS', 'EVENTS', 'FAQ'] as SearchCategory[]).map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
              category === cat 
                ? 'bg-ro-blue text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat === 'ALL' ? 'Toate' : cat === 'SERVICES' ? 'Servicii' : cat === 'ANNOUNCEMENTS' ? 'Anunțuri' : cat === 'EVENTS' ? 'Evenimente' : 'Întrebări'}
          </button>
        ))}
      </div>

      {/* Results List */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50">
        {!query && (
          <div className="text-center text-gray-400 mt-20">
            <Search className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>Începe să scrii pentru a căuta în aplicație.</p>
          </div>
        )}

        {query && !hasResults && (
           <div className="text-center text-gray-500 mt-20">
             Nu am găsit rezultate pentru "{query}".
           </div>
        )}

        {results && (
          <div className="space-y-6">
            {/* Services */}
            {(category === 'ALL' || category === 'SERVICES') && results.services.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Servicii Consulare</h3>
                <div className="space-y-2">
                  {results.services.map(s => (
                    <div key={s.id} onClick={() => { onNavigate('SERVICES'); onClose(); }} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex items-center gap-3 cursor-pointer hover:bg-blue-50">
                      <div className="bg-blue-100 p-2 rounded-full text-ro-blue"><Book className="w-4 h-4"/></div>
                      <div>
                        <div className="font-bold text-gray-800">{s.title}</div>
                        <div className="text-xs text-gray-500 truncate max-w-[250px]">{s.subServices.join(', ')}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Announcements */}
            {(category === 'ALL' || category === 'ANNOUNCEMENTS') && results.announcements.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Anunțuri</h3>
                <div className="space-y-2">
                  {results.announcements.map(a => (
                    <div key={a.id} onClick={() => { onNavigate('HOME'); onClose(); }} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex gap-3 cursor-pointer hover:bg-blue-50">
                       <img src={a.imageUrl} className="w-12 h-12 rounded object-cover" alt="" />
                       <div>
                         <div className="font-bold text-sm text-gray-800">{a.title}</div>
                         <div className="text-xs text-gray-500">{a.date}</div>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

             {/* Events */}
             {(category === 'ALL' || category === 'EVENTS') && results.events.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Evenimente</h3>
                <div className="space-y-2">
                  {results.events.map(e => (
                    <div key={e.id} onClick={() => { onNavigate('HOME'); onClose(); }} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex gap-3 cursor-pointer hover:bg-blue-50">
                       <div className="bg-ro-yellow/20 p-2 rounded flex items-center justify-center w-12 h-12">
                         <Calendar className="w-6 h-6 text-ro-blue" />
                       </div>
                       <div>
                         <div className="font-bold text-sm text-gray-800">{e.title}</div>
                         <div className="text-xs text-gray-500">{e.location}</div>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQs */}
            {(category === 'ALL' || category === 'FAQ') && results.faqs.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Întrebări Frecvente</h3>
                <div className="space-y-2">
                  {results.faqs.map((f, i) => (
                    <div key={i} onClick={() => { onNavigate('FAQ'); onClose(); }} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:bg-blue-50">
                      <div className="flex gap-2 mb-1">
                        <HelpCircle className="w-4 h-4 text-ro-red mt-0.5" />
                        <span className="font-bold text-sm text-gray-800">{f.question}</span>
                      </div>
                      <p className="text-xs text-gray-500 pl-6 line-clamp-2">{f.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
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
    firstName: '', lastName: '', email: '', phone: '', address: '', city: '', country: '', username: '', avatarUrl: null
  });
  
  // Search State
  const [searchOpen, setSearchOpen] = useState(false);

  // Notification Preferences State
  const [notifications, setNotifications] = useState<NotificationPreferences>({
    enabled: false,
    announcements: true,
    events: true,
    requests: true
  });

  // Splash logic
  const handleSplashFinish = () => {
    setView('AUTH');
  };

  // Login logic
  const handleLogin = (email: string) => {
    setIsLoggedIn(true);
    // Mock user load
    setUser(prev => ({ ...prev, email, firstName: 'Ion', lastName: 'Popescu', country: 'Italia' }));
    setView('HOME');
  };

  // Render Content based on View
  const renderContent = () => {
    switch (view) {
      case 'AUTH': return <AuthScreen onLogin={handleLogin} />;
      case 'HOME': return <HomeScreen />;
      case 'SERVICES': return <ServicesScreen />;
      case 'SEND_DOCS': return <SendDocsScreen user={user} />;
      case 'FAQ': return <FaqScreen />;
      case 'SETTINGS': return (
        <SettingsScreen 
          textSize={textSize} setTextSize={setTextSize} 
          theme={theme} setTheme={setTheme} 
          setView={setView} 
          notifications={notifications}
          setNotifications={setNotifications}
        />
      );
      case 'PROFILE': return <ProfileScreen user={user} setUser={setUser} onLogout={() => { setIsLoggedIn(false); setView('AUTH'); }} />;
      default: return <div className="p-4">Loading...</div>;
    }
  };

  // Classes for text size
  const textSizeClass = textSize;
  // Classes for theme
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

      {view !== 'AUTH' && view !== 'PROFILE' && view !== 'SETTINGS' && (
        <BottomNav currentView={view} setView={setView} />
      )}

      {/* Global Search Overlay */}
      <SearchOverlay 
        isOpen={searchOpen} 
        onClose={() => setSearchOpen(false)} 
        onNavigate={setView}
      />
    </div>
  );
};

// --- Screens ---

const AuthScreen = ({ onLogin }: { onLogin: (email: string) => void }) => {
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Register specific
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-consular-bg">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header of Auth Card */}
        <div className="bg-gradient-to-r from-blue-700 via-yellow-500 to-red-600 h-2 opacity-80" />
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-ro-blue mb-2">ConsulaRO</h2>
            <p className="text-gray-500">Bine ai venit!</p>
          </div>

          <div className="flex mb-6 border-b">
            <button 
              className={`flex-1 py-2 font-medium ${mode === 'LOGIN' ? 'text-ro-blue border-b-2 border-ro-blue' : 'text-gray-400'}`}
              onClick={() => setMode('LOGIN')}
            >
              Autentificare
            </button>
            <button 
              className={`flex-1 py-2 font-medium ${mode === 'REGISTER' ? 'text-ro-blue border-b-2 border-ro-blue' : 'text-gray-400'}`}
              onClick={() => setMode('REGISTER')}
            >
              Înregistrare
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
            
            <Button type="submit" fullWidth className="mt-4 text-lg">
              {mode === 'LOGIN' ? 'Intră în cont' : 'Creează cont'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

const HomeScreen = () => {
  const [appModalOpen, setAppModalOpen] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState(false);
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [eventsModalOpen, setEventsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  // Helper for Carousel
  const Carousel = ({ title, items, type }: { title: string, items: any[], type: 'announcement' | 'event' }) => (
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
          Vezi toate
        </button>
      </div>
      <div className="flex overflow-x-auto px-4 pb-4 gap-4 snap-x hide-scrollbar">
        {items.map((item) => (
          <div 
            key={item.id} 
            onClick={() => type === 'announcement' ? setSelectedAnnouncement(item) : setSelectedEvent(item)}
            className="flex-shrink-0 w-72 bg-white rounded-xl shadow-md snap-center active:scale-95 transition-transform cursor-pointer overflow-hidden border border-gray-100"
          >
            <div className="h-32 w-full bg-gray-200 relative">
               <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
               <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                 {item.date}
               </div>
            </div>
            <div className="p-3">
              <h4 className="font-bold text-gray-800 line-clamp-1">{item.title}</h4>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {type === 'announcement' ? (item as Announcement).shortDescription : (item as EventItem).location}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="py-6">
      {/* App Presentation Card */}
      <div className="px-4 mb-8">
        <div 
          onClick={() => setAppModalOpen(true)}
          className="bg-white rounded-2xl shadow-lg p-4 flex items-center gap-4 cursor-pointer active:scale-95 transition-transform border border-blue-100"
        >
          <div className="w-1/3 flex items-center justify-center border-r border-gray-100 pr-4">
             {/* Mock MAE Logo placeholder */}
             <div className="w-16 h-16 bg-ro-blue rounded-full flex items-center justify-center text-white font-bold text-xs text-center p-1">
               MAE ROMÂNIA
             </div>
          </div>
          <div className="w-2/3">
             <h2 className="text-lg font-bold text-gray-800 mb-1">Despre ConsulaRO</h2>
             <p className="text-sm text-gray-600 line-clamp-2">{APP_DESCRIPTION_SHORT}</p>
          </div>
        </div>
      </div>

      <Carousel title="Anunțuri Importante" items={MOCK_ANNOUNCEMENTS} type="announcement" />
      <Carousel title="Evenimente Active" items={MOCK_EVENTS} type="event" />

      {/* App Description Modal */}
      <Modal isOpen={appModalOpen} onClose={() => setAppModalOpen(false)} title="Despre Aplicație" fullScreen={fullScreenImage}>
        <div className="flex flex-col h-full">
           <div 
             className={`transition-all duration-300 ${fullScreenImage ? 'flex-1 flex items-center justify-center bg-black' : 'h-48 mb-4'}`}
             onClick={() => setFullScreenImage(!fullScreenImage)}
           >
             {/* Using a placeholder for app logo/splash image */}
             <div className={`w-full h-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center cursor-zoom-in ${fullScreenImage ? 'cursor-zoom-out' : 'rounded-lg'}`}>
                <Flag className={`${fullScreenImage ? 'w-32 h-32' : 'w-16 h-16'} text-white`} />
             </div>
           </div>
           {!fullScreenImage && (
             <div className="text-gray-700 leading-relaxed text-justify">
               <p>{APP_DESCRIPTION_FULL}</p>
               <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                 <h4 className="font-bold text-ro-blue mb-2">Misiune</h4>
                 <p className="text-sm">Facilitarea accesului la servicii consulare pentru toți românii, oriunde s-ar afla.</p>
               </div>
             </div>
           )}
        </div>
      </Modal>

      {/* Announcements List Modal */}
      <Modal isOpen={announcementModalOpen} onClose={() => setAnnouncementModalOpen(false)} title="Toate Anunțurile">
        <div className="space-y-4">
          {MOCK_ANNOUNCEMENTS.map(item => (
            <div key={item.id} onClick={() => setSelectedAnnouncement(item)} className="bg-white border rounded-lg p-2 flex gap-3 shadow-sm active:bg-gray-50 cursor-pointer">
               <img src={item.imageUrl} className="w-24 h-24 object-cover rounded-md" alt="" />
               <div className="flex-1">
                 <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                 <p className="text-xs text-gray-500 line-clamp-3">{item.shortDescription}</p>
                 <span className="text-xs text-ro-red mt-1 block">{item.date}</span>
               </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* Events List Modal */}
      <Modal isOpen={eventsModalOpen} onClose={() => setEventsModalOpen(false)} title="Evenimente">
        <div className="space-y-4">
          {MOCK_EVENTS.map(item => (
            <div key={item.id} onClick={() => setSelectedEvent(item)} className="bg-white border rounded-lg p-2 flex gap-3 shadow-sm active:bg-gray-50 cursor-pointer">
               <img src={item.imageUrl} className="w-24 h-24 object-cover rounded-md" alt="" />
               <div className="flex-1">
                 <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                 <p className="text-xs text-gray-500">{item.location}</p>
                 <span className="text-xs text-blue-600 font-medium block mt-1">{item.date}</span>
               </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* Detail Modal (Shared for Event/Announcement presentation style) */}
      <Modal isOpen={!!selectedAnnouncement} onClose={() => setSelectedAnnouncement(null)} title="Detalii Anunț">
        {selectedAnnouncement && (
          <div>
            <img src={selectedAnnouncement.imageUrl} className="w-full h-48 object-cover rounded-lg mb-4" alt={selectedAnnouncement.title} />
            <h2 className="text-xl font-bold text-ro-blue mb-2">{selectedAnnouncement.title}</h2>
            <div className="text-sm text-gray-500 mb-4">{selectedAnnouncement.date}</div>
            <p className="text-gray-700 whitespace-pre-line">{selectedAnnouncement.fullDescription}</p>
          </div>
        )}
      </Modal>

      <Modal isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)} title="Detalii Eveniment">
        {selectedEvent && (
          <div>
            <img src={selectedEvent.imageUrl} className="w-full h-48 object-cover rounded-lg mb-4" alt={selectedEvent.title} />
            <h2 className="text-xl font-bold text-ro-blue mb-1">{selectedEvent.title}</h2>
            <div className="text-sm text-ro-red font-semibold mb-2">{selectedEvent.location} • {selectedEvent.date}</div>
            <p className="text-gray-700 whitespace-pre-line">{selectedEvent.description}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

const ServicesScreen = () => {
  const [selectedService, setSelectedService] = useState<ServiceCategory | null>(null);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-ro-blue mb-6 text-center">Servicii Consulare</h2>
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

      {/* Sub-services Modal */}
      <Modal isOpen={!!selectedService} onClose={() => setSelectedService(null)} title={selectedService?.title}>
        {selectedService && (
          <div className="space-y-2">
            <p className="text-sm text-gray-500 mb-4">Selectați serviciul dorit pentru a fi redirecționat către portalul E-Consulat (simulare).</p>
            {selectedService.subServices.map((sub, idx) => (
              <a 
                href="#" 
                key={idx}
                className="block p-3 bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 text-ro-blue font-medium transition-colors flex justify-between items-center"
              >
                {sub}
                <ChevronRight className="w-4 h-4" />
              </a>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
};

const SendDocsScreen = ({ user }: { user: UserProfile }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFile(f);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(f);
      setModalOpen(true);
    }
  };

  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-center mb-8">
        <Send className="w-16 h-16 text-ro-blue mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Trimite Documente</h2>
        <p className="text-gray-500 mt-2">Trimite rapid copii ale documentelor către consulatul tău.</p>
      </div>
      
      <div className="w-full max-w-sm">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-ro-blue rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <ImageIcon className="w-8 h-8 text-ro-blue mb-2" />
            <p className="text-sm text-gray-500 font-semibold">Apasă pentru încărcare</p>
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
          
          {preview && (
            <div className="border rounded p-2">
              <p className="text-xs text-gray-500 mb-1">Previzualizare:</p>
              <img src={preview} alt="Preview" className="max-h-40 mx-auto rounded" />
            </div>
          )}

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

const FaqScreen = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-ro-blue mb-6 text-center">Întrebări Frecvente</h2>
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
  textSize, setTextSize, theme, setTheme, setView, notifications, setNotifications
}: { 
  textSize: TextSize, setTextSize: (s: TextSize) => void,
  theme: AppTheme, setTheme: (t: AppTheme) => void,
  setView: (v: ViewState) => void,
  notifications: NotificationPreferences,
  setNotifications: (n: NotificationPreferences) => void
}) => {
  const [contactOpen, setContactOpen] = useState(false);

  const handleNotificationToggle = async () => {
    if (!notifications.enabled) {
      if ("Notification" in window) {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          setNotifications({ ...notifications, enabled: true });
        } else {
          alert("Trebuie să permiteți notificările din browser pentru a activa această funcție.");
        }
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
        <h2 className="text-2xl font-bold">Setări</h2>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <Bell className="w-5 h-5 text-ro-red" /> Notificări
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
                <input 
                  type="checkbox" 
                  checked={notifications.announcements} 
                  onChange={(e) => setNotifications({...notifications, announcements: e.target.checked})} 
                  className="w-5 h-5 text-ro-blue"
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Evenimente Locale</span>
                <input 
                  type="checkbox" 
                  checked={notifications.events} 
                  onChange={(e) => setNotifications({...notifications, events: e.target.checked})} 
                  className="w-5 h-5 text-ro-blue"
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status Cereri</span>
                <input 
                  type="checkbox" 
                  checked={notifications.requests} 
                  onChange={(e) => setNotifications({...notifications, requests: e.target.checked})} 
                  className="w-5 h-5 text-ro-blue"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Text Size */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-3">Dimensiune Text</h3>
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
        <h3 className="font-bold text-gray-800 mb-3">Temă</h3>
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
        <button className="w-full text-left p-4 border-b hover:bg-gray-50 flex justify-between">Termeni și Condiții <ChevronRight className="w-4 h-4 text-gray-400"/></button>
        <button className="w-full text-left p-4 border-b hover:bg-gray-50 flex justify-between">Politica de Confidențialitate <ChevronRight className="w-4 h-4 text-gray-400"/></button>
        <button onClick={() => setContactOpen(true)} className="w-full text-left p-4 hover:bg-gray-50 flex justify-between">Contactează-ne <ChevronRight className="w-4 h-4 text-gray-400"/></button>
      </div>

      {/* Social */}
      <div className="flex gap-4 justify-center mt-8">
        <button className="bg-[#1877F2] text-white p-3 rounded-full shadow-lg hover:opacity-90">
           <span className="font-bold">Facebook</span>
        </button>
        <button className="bg-[#25D366] text-white p-3 rounded-full shadow-lg hover:opacity-90">
           <span className="font-bold">WhatsApp</span>
        </button>
      </div>

      {/* Contact Modal */}
      <Modal isOpen={contactOpen} onClose={() => setContactOpen(false)} title="Contactează Echipa">
        <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); alert("Mesaj trimis!"); setContactOpen(false); }}>
          <input className="w-full border p-2 rounded" placeholder="Nume" required />
          <input className="w-full border p-2 rounded" placeholder="Prenume" required />
          <input className="w-full border p-2 rounded" placeholder="Email" type="email" required />
          <input className="w-full border p-2 rounded" placeholder="Telefon" />
          <textarea className="w-full border p-2 rounded h-32" placeholder="Mesajul tău..." required></textarea>
          <Button type="submit" fullWidth>Trimite</Button>
        </form>
      </Modal>
    </div>
  );
};

const ProfileScreen = ({ user, setUser, onLogout }: { user: UserProfile, setUser: (u: UserProfile) => void, onLogout: () => void }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);
  
  const handleSave = () => {
    setUser(formData);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm("Sunteți sigur că doriți să ștergeți contul? Această acțiune este ireversibilă.")) {
      onLogout();
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, avatarUrl: reader.result as string });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="p-4 pb-24">
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
               <label className="absolute bottom-0 right-0 bg-ro-blue text-white p-2 rounded-full cursor-pointer shadow-sm hover:bg-blue-800">
                 <Camera className="w-4 h-4" />
                 <input type="file" accept="image/*" capture="user" className="hidden" onChange={handlePhotoUpload} />
               </label>
             )}
           </div>
           <h2 className="text-xl font-bold">{user.firstName} {user.lastName}</h2>
           <p className="text-gray-500">{user.email}</p>
         </div>

         <div className="space-y-4">
           <div>
             <label className="text-xs text-gray-500 block mb-1">Nume de utilizator</label>
             <input disabled={!isEditing} value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className={`w-full p-2 rounded border ${isEditing ? 'bg-white' : 'bg-gray-50'}`} placeholder="Setează un username" />
           </div>
           <div>
             <label className="text-xs text-gray-500 block mb-1">Telefon</label>
             <input disabled={!isEditing} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className={`w-full p-2 rounded border ${isEditing ? 'bg-white' : 'bg-gray-50'}`} placeholder="Adaugă telefon" />
           </div>
           <div>
             <label className="text-xs text-gray-500 block mb-1">Adresa</label>
             <input disabled={!isEditing} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className={`w-full p-2 rounded border ${isEditing ? 'bg-white' : 'bg-gray-50'}`} placeholder="Adaugă adresa" />
           </div>
           <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Oraș</label>
                <input disabled={!isEditing} value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className={`w-full p-2 rounded border ${isEditing ? 'bg-white' : 'bg-gray-50'}`} placeholder="Oraș" />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Țara</label>
                <input disabled={!isEditing} value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className={`w-full p-2 rounded border ${isEditing ? 'bg-white' : 'bg-gray-50'}`} />
              </div>
           </div>
         </div>

         <div className="mt-8 flex gap-3">
           {isEditing ? (
             <Button fullWidth onClick={handleSave}>Salvează</Button>
           ) : (
             <Button fullWidth onClick={() => setIsEditing(true)}>Editează Profil</Button>
           )}
         </div>
       </div>

       <div className="space-y-3">
         <Button fullWidth variant="secondary" onClick={onLogout} className="flex items-center justify-center gap-2">
           <LogOut className="w-4 h-4" /> Delogare
         </Button>
         <Button fullWidth variant="danger" onClick={handleDelete}>Șterge Contul</Button>
       </div>
    </div>
  );
};

export default App;
