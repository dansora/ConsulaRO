

import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, Book, Send, HelpCircle, Settings, User, 
  LogOut, Camera, Bell, Calendar,
  ChevronRight, Search, Shield, Trash2, Plus, Edit, Eye, ArrowLeft, Upload, X, Globe as GlobeIcon, FileText, Save, AlertTriangle, Database,
  Sun, Moon, Monitor, Type, Info, Megaphone, AlertCircle, CheckCircle, Facebook
} from 'lucide-react';
import { 
  LanguageCode, UserProfile, AppTheme, TextSize, ViewState, 
  Announcement, EventItem, NotificationPreferences, UserDocument, AlertItem
} from './types';
import { 
  LANGUAGES, FAQ_DATA, 
  SERVICE_CATEGORIES, APP_DESCRIPTION_SHORT, TRANSLATIONS
} from './constants';
import { Modal } from './components/Modal';
import { Button } from './components/Button';
import { supabase } from './lib/supabaseClient';
import { SQL_SCHEMA } from './lib/schema';

// --- Icon Map & Translation ---
const IconMap: Record<string, any> = {
  FileText
};

const useTranslation = (lang: LanguageCode) => {
  return (key: string) => {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS['RO'];
    return dict[key] || key;
  };
};

// --- Sub-Components ---

const SqlFixModal = ({ isOpen, onClose, t }: { isOpen: boolean; onClose: () => void; t: any }) => {
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;
  const handleCopy = () => {
    navigator.clipboard.writeText(SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('settings_sql')}>
      <div className="space-y-4">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <p className="text-sm text-yellow-700">
            Dacă întâmpinați erori (ex: contul nu se creează, erori 400), copiați acest script și rulați-l în <strong>Supabase Dashboard &gt; SQL Editor</strong>.
          </p>
        </div>
        <div className="relative">
          <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg text-xs overflow-auto h-64 custom-scrollbar whitespace-pre-wrap">
            {SQL_SCHEMA}
          </pre>
          <button 
            onClick={handleCopy}
            className="absolute top-2 right-2 bg-white text-gray-800 px-3 py-1 rounded text-xs font-bold shadow hover:bg-gray-100 flex items-center gap-1"
          >
            {copied ? t('btn_copied') : t('btn_copy')}
          </button>
        </div>
        <Button fullWidth onClick={onClose}>{t('btn_close')}</Button>
      </div>
    </Modal>
  );
};

const ErrorDisplayModal = ({ error, isOpen, onClose, onShowSql, t }: any) => {
  if (!isOpen || !error) return null;
  
  let errorMessage = "Unknown Error";
  if (typeof error === 'string') errorMessage = error;
  else if (error.message) errorMessage = error.message;
  else errorMessage = JSON.stringify(error, null, 2);

  const isSqlError = errorMessage.includes("PGRST") || errorMessage.includes("column") || errorMessage.includes("relation") || errorMessage.includes("400") || errorMessage.includes("23502");

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('err_title')}>
      <div className="space-y-4 text-center">
        <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">A apărut o problemă</h3>
        <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded border border-gray-200 break-words font-mono text-left max-h-40 overflow-y-auto">
          {errorMessage}
        </p>
        {isSqlError && <p className="text-xs text-blue-600">Această eroare sugerează o problemă cu baza de date.</p>}
        <div className="grid grid-cols-2 gap-3">
           <Button variant="ghost" onClick={onClose}>{t('btn_close')}</Button>
           <Button onClick={() => { onClose(); onShowSql(); }}>{t('btn_show_sql')}</Button>
        </div>
      </div>
    </Modal>
  );
};

// AUTO SCROLL CAROUSEL COMPONENT
const AutoScrollSection = ({ children, interval = 5000 }: { children?: React.ReactNode, interval?: number }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        const scrollNext = () => {
            if (paused || !container) return;
            const cardWidth = 316; // 300px min-width + 16px gap
            const maxScroll = container.scrollWidth - container.clientWidth;
            
            if (container.scrollLeft >= maxScroll - 10) {
                container.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                container.scrollBy({ left: cardWidth, behavior: 'smooth' });
            }
        };

        const timer = setInterval(scrollNext, interval);
        return () => clearInterval(timer);
    }, [paused, interval]);

    return (
        <div 
            ref={scrollRef} 
            className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x hide-scrollbar"
            onTouchStart={() => setPaused(true)}
            onTouchEnd={() => setPaused(false)}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {children}
        </div>
    );
};

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  const [bgClass, setBgClass] = useState('bg-ro-blue');
  useEffect(() => {
    const t1 = setTimeout(() => setBgClass('bg-ro-yellow'), 700);
    const t2 = setTimeout(() => setBgClass('bg-ro-red'), 1400);
    const t3 = setTimeout(onFinish, 2100);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onFinish]);
  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-colors duration-700 ease-in-out ${bgClass} opacity-90`}>
      <h1 className="text-5xl font-bold text-white mb-4 animate-fade-in drop-shadow-lg">ConsulaRO</h1>
      <p className="text-xl text-white font-medium animate-pulse drop-shadow-md">Consulatul la un click distanță!</p>
    </div>
  );
};

const Header = ({ currentLang, setLang, onProfileClick, onSettingsClick, onSearchClick, isLoggedIn, userRole }: any) => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 w-full shadow-md h-16">
      <div className="absolute inset-0 opacity-80" style={{ background: 'linear-gradient(90deg, rgba(0,43,127,1) 0%, rgba(0,43,127,1) 33%, rgba(252,209,22,1) 33%, rgba(252,209,22,1) 66%, rgba(206,17,38,1) 66%, rgba(206,17,38,1) 100%)', mixBlendMode: 'multiply' }} />
      <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]"></div>
      <div className="relative flex items-center justify-between px-4 h-full">
        <div className="flex items-center space-x-3 z-10 w-auto">
           <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md overflow-hidden border-2 border-white/50">
             <img src="/logo.png" alt="App Logo" className="w-full h-full object-contain p-1" onError={(e) => { (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/commons/7/70/Coat_of_arms_of_Romania.svg'; }} />
           </div>
           {isLoggedIn && ( <button onClick={onSearchClick} className="text-white bg-black/20 hover:bg-black/30 transition-colors p-2 rounded-full"><Search className="w-5 h-5" /></button> )}
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2">
            <h1 className="text-2xl font-bold text-white drop-shadow-md tracking-wide whitespace-nowrap">ConsulaRO</h1>
        </div>
        <div className="flex items-center space-x-2 z-10 justify-end w-auto">
          <div className="relative group">
            <button className="flex items-center space-x-1 text-white font-medium bg-black/20 px-2 py-1 rounded" onClick={() => setMenuOpen(!menuOpen)}>
              <span className="text-xs">{currentLang}</span><GlobeIcon className="w-4 h-4" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)}></div>
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg py-1 z-20 max-h-60 overflow-y-auto">
                  {LANGUAGES.map((lang) => ( <button key={lang.code} onClick={() => { setLang(lang.code); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{lang.label}</button> ))}
                </div>
              </>
            )}
          </div>
          {isLoggedIn && ( <button onClick={onProfileClick} className="text-white hover:text-gray-200 transition-colors p-1"><User className="w-5 h-5" /></button> )}
          <button onClick={onSettingsClick} className="text-white hover:text-gray-200 transition-colors p-1"><Settings className="w-5 h-5" /></button>
        </div>
      </div>
    </header>
  );
};

const BottomNav = ({ currentView, setView, t }: any) => {
  const navItems = [
    { view: 'HOME', icon: Home, label: t('nav_home') },
    { view: 'SERVICES', icon: Book, label: t('nav_services') },
    { view: 'ANNOUNCEMENTS_LIST', icon: Megaphone, label: t('nav_announcements') },
    { view: 'EVENTS_LIST', icon: Calendar, label: t('nav_events') },
    { view: 'INFO', icon: Info, label: t('nav_info') },
  ];
  return (
    <nav className="fixed bottom-0 w-full bg-blue-50 pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-40 border-t border-blue-100">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = currentView === item.view;
          const Icon = item.icon;
          return (
            <button key={item.view} onClick={() => setView(item.view as ViewState)} className={`flex flex-col items-center justify-center w-full h-full transition-colors ${isActive ? 'text-ro-blue bg-blue-100' : 'text-gray-400 hover:text-ro-blue'}`}>
              <Icon className={`w-5 h-5 mb-1 ${isActive ? 'stroke-[2.5px]' : ''}`} /><span className="text-xs font-bold">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

const SearchOverlay = ({ isOpen, onClose, t }: any) => {
    const [query, setQuery] = useState('');
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 bg-white flex flex-col animate-fade-in">
             <div className="p-4 border-b flex items-center gap-2 bg-gray-50">
                <Search className="w-5 h-5 text-gray-500" />
                <input autoFocus className="flex-1 bg-transparent outline-none text-lg" placeholder={t('search_placeholder')} value={query} onChange={(e) => setQuery(e.target.value)} />
                <button onClick={onClose} className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"><X className="w-5 h-5 text-gray-700" /></button>
            </div>
            <div className="p-4 text-center text-gray-500">Căutare indisponibilă momentan.</div>
        </div>
    )
}

const DetailModal = ({ isOpen, onClose, title, imageUrl, children }: any) => {
    const [imageOnly, setImageOnly] = useState(false);
    useEffect(() => { if(isOpen) setImageOnly(false); }, [isOpen]);
    if (!isOpen) return null;
    return (
      <Modal isOpen={isOpen} onClose={onClose} title={title} fullScreen={imageOnly}>
        <div className="flex flex-col h-full">
          {imageUrl && (
            <div className={`transition-all duration-300 relative cursor-pointer ${imageOnly ? 'flex-1 bg-black flex items-center justify-center' : 'h-48 mb-4'}`} onClick={() => setImageOnly(!imageOnly)}>
               <img src={imageUrl} className={`object-cover w-full h-full ${imageOnly ? 'object-contain' : 'rounded-lg'}`} alt="Detail" />
               {!imageOnly && <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded">Apasă pentru zoom</div>}
            </div>
          )}
          {!imageOnly && <div className="flex-1 overflow-y-auto">{children}</div>}
        </div>
      </Modal>
    );
};

// --- ADMIN SCREEN ---
const AdminScreen = ({ user, onClose, onError, onShowSql }: any) => {
  const [tab, setTab] = useState<'USERS' | 'ANNOUNCEMENTS' | 'EVENTS' | 'DOCUMENTS' | 'ALERTS'>('USERS');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [docs, setDocs] = useState<UserDocument[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchData(); }, [tab]);

  const fetchData = async () => {
    try {
      if (tab === 'USERS') {
        const { data, error } = await supabase.from('profiles').select('*');
        if (error) throw error;
        if (data) setUsers(data.map((u:any) => ({
            ...u, 
            avatarUrl: u.avatar_url, 
            firstName: u.first_name, 
            lastName: u.last_name, 
            postCode: u.post_code
        })));
      } else if (tab === 'DOCUMENTS') {
         const { data, error } = await supabase.from('user_documents').select('*').order('created_at', { ascending: false });
         if (error) throw error;
         if (data) setDocs(data as any);
      } else if (tab === 'ANNOUNCEMENTS') {
         const { data, error } = await supabase.from('announcements').select('*').order('date', { ascending: false });
         if(error) throw error;
         if (data) setAnnouncements(data.map((i:any) => ({
             ...i, 
             imageUrl: i.image_url, 
             endDate: i.end_date, 
             active: i.active
         })));
      } else if (tab === 'EVENTS') {
         const { data, error } = await supabase.from('events').select('*').order('date', { ascending: false });
         if(error) throw error;
         if (data) setEvents(data.map((i:any) => ({
             ...i, 
             imageUrl: i.image_url, 
             endDate: i.end_date, 
             active: i.active
         })));
      } else if (tab === 'ALERTS') {
         const { data, error } = await supabase.from('alerts').select('*').order('created_at', { ascending: false });
         if(error) throw error;
         if (data) setAlerts(data);
      }
    } catch (error: any) {
       console.error("Fetch Error:", error);
       onError(error);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
        const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
        if (error) throw error;
        alert(`Rol actualizat la ${newRole}`);
        fetchData();
    } catch(e) { onError(e); }
  };

  const deleteItem = async (table: string, id: string) => {
    if(!confirm('Sigur doriți să ștergeți?')) return;
    const { error } = await supabase.from(table).delete().eq('id', id);
    if(error) onError(error);
    else fetchData();
  };

  const saveItem = async (table: string, data: any) => {
     setSaving(true);
     try {
       const cleanDate = (d: string) => (d && d.trim() !== '' ? d : null);

       const payload: any = { active: data.active !== false };
       
       if (table === 'announcements' || table === 'events') {
          payload.title = data.title;
          payload.description = data.description || '';
          payload.image_url = data.image_url || data.imageUrl;
          payload.date = cleanDate(data.date);
          payload.end_date = cleanDate(data.end_date || data.endDate);
       }
       
       if(table === 'events') {
          payload.location = data.location;
       }

       if (table === 'alerts') {
          payload.title = data.title;
          payload.message = data.message;
          payload.type = data.type || 'info';
          payload.country = data.country || null;
       }

       let error;
       if (data.id) {
          ({ error } = await supabase.from(table).update(payload).eq('id', data.id));
       } else {
          ({ error } = await supabase.from(table).insert(payload));
       }

       if (error) throw error;

       setIsEditModalOpen(false);
       setIsPreviewMode(false);
       fetchData();
     } catch(e:any) {
        onError(e);
     } finally {
        setSaving(false);
     }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingImage(true);
    try {
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      const { error: uploadError } = await supabase.storage.from('content_images').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('content_images').getPublicUrl(filePath);
      setEditingItem({ ...editingItem, image_url: publicUrl, imageUrl: publicUrl });
    } catch (error: any) {
      onError(error);
    } finally {
      setUploadingImage(false);
    }
  };

  const renderPreview = () => {
     if(!editingItem) return null;
     if (tab === 'ALERTS') {
        return (
            <div className={`p-4 rounded-lg border-l-4 shadow mb-4 bg-red-50 border-red-500`}>
                <h3 className="font-bold text-red-800">{editingItem.title}</h3>
                <p className="text-sm text-red-700">{editingItem.message}</p>
                <div className="text-xs mt-2 text-gray-500">Target: {editingItem.country || 'Global'}</div>
                <div className="flex gap-2 pt-4 border-t mt-2"><Button variant="ghost" onClick={() => setIsPreviewMode(false)}><ArrowLeft className="w-4 h-4 mr-2"/> Editare</Button><Button fullWidth onClick={() => saveItem('alerts', editingItem)} disabled={saving}>{saving ? '...' : 'Salvează'}</Button></div>
            </div>
        )
     }
     const isEvent = tab === 'EVENTS';
     const img = editingItem.image_url || editingItem.imageUrl;
     return (
        <div className="space-y-4">
           <div className="bg-yellow-50 p-2 text-sm text-yellow-800 border border-yellow-200 rounded">Mod previzualizare.</div>
           <div className="border rounded-lg overflow-hidden shadow-sm bg-white">
               {img && (<div className="h-48 w-full bg-black flex items-center justify-center"><img src={img} className="h-full object-contain" alt="Preview"/></div>)}
               <div className="p-4"><h2 className="text-xl font-bold text-ro-blue mb-2">{editingItem.title}</h2><div className="text-sm text-ro-red font-semibold mb-2">{isEvent && <>{editingItem.location}</>}</div><p className="text-gray-700 whitespace-pre-line">{editingItem.description}</p></div>
           </div>
           <div className="flex gap-2 pt-4 border-t"><Button variant="ghost" onClick={() => setIsPreviewMode(false)}><ArrowLeft className="w-4 h-4 mr-2"/> Editare</Button><Button fullWidth onClick={() => saveItem(tab === 'ANNOUNCEMENTS' ? 'announcements' : 'events', editingItem)} disabled={saving}>{saving ? '...' : 'Salvează'}</Button></div>
        </div>
     );
  };

  const renderEditForm = () => {
      if (tab === 'ALERTS') {
          return (
              <div className="space-y-3">
                  <input className="w-full p-2 border rounded" placeholder="Titlu Alertă" value={editingItem?.title || ''} onChange={e => setEditingItem({...editingItem, title: e.target.value})} />
                  <textarea className="w-full p-2 border rounded h-24" placeholder="Mesaj Alertă" value={editingItem?.message || ''} onChange={e => setEditingItem({...editingItem, message: e.target.value})} />
                  <div className="flex gap-2">
                    <div className="flex-1">
                        <label className="text-xs text-gray-500">Tip</label>
                        <select className="w-full p-2 border rounded" value={editingItem?.type || 'info'} onChange={e => setEditingItem({...editingItem, type: e.target.value})}>
                            <option value="info">Info</option>
                            <option value="warning">Warning</option>
                            <option value="critical">Critical</option>
                        </select>
                    </div>
                    <div className="flex-1">
                        <label className="text-xs text-gray-500">Țară Țintă (Ex: RO, IT) - Gol pt Global</label>
                        <input className="w-full p-2 border rounded" placeholder="Cod Țară" value={editingItem?.country || ''} onChange={e => setEditingItem({...editingItem, country: e.target.value})} />
                    </div>
                  </div>
                  <label className="flex items-center gap-2"><input type="checkbox" checked={editingItem?.active !== false} onChange={e => setEditingItem({...editingItem, active: e.target.checked})} /><span className="text-sm">Activ</span></label>
                  <Button fullWidth onClick={() => setIsPreviewMode(true)} disabled={!editingItem?.title}>Previzualizare</Button>
              </div>
          )
      }
      return (
       <div className="space-y-3">
            <input className="w-full p-2 border rounded" placeholder="Titlu" value={editingItem?.title || ''} onChange={e => setEditingItem({...editingItem, title: e.target.value})} />
            <textarea className="w-full p-2 border rounded h-40" placeholder="Descriere" value={editingItem?.description || ''} onChange={e => setEditingItem({...editingItem, description: e.target.value})} />
            {tab === 'EVENTS' && (<input className="w-full p-2 border rounded" placeholder="Locație" value={editingItem?.location || ''} onChange={e => setEditingItem({...editingItem, location: e.target.value})} />)}
            <div className="grid grid-cols-2 gap-2">
               <div><label className="text-xs text-gray-500">Data Început</label><input type="date" className="w-full p-2 border rounded" value={editingItem?.date || ''} onChange={e => setEditingItem({...editingItem, date: e.target.value})} /></div>
               <div><label className="text-xs text-gray-500">Data Sfârșit</label><input type="date" className="w-full p-2 border rounded" value={editingItem?.end_date || editingItem?.endDate || ''} onChange={e => setEditingItem({...editingItem, end_date: e.target.value, endDate: e.target.value})} /></div>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors">
               <label className="cursor-pointer block"><Upload className="w-8 h-8 mx-auto text-gray-400 mb-2"/><span className="text-sm text-ro-blue font-bold">{uploadingImage ? '...' : 'Upload Imagine'}</span><input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} /></label>
               {(editingItem?.image_url || editingItem?.imageUrl) && (<div className="mt-2 text-xs text-green-600 truncate">Imagine atașată</div>)}
            </div>
            <label className="flex items-center gap-2"><input type="checkbox" checked={editingItem?.active !== false} onChange={e => setEditingItem({...editingItem, active: e.target.checked})} /><span className="text-sm">Activ</span></label>
            <Button fullWidth onClick={() => setIsPreviewMode(true)} disabled={!editingItem?.title || uploadingImage}><Eye className="w-4 h-4 mr-2"/> Previzualizare</Button>
       </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-gray-100 pb-24">
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-md">
          <h2 className="text-xl font-bold flex items-center gap-2"><Shield /> Admin</h2>
          <div className="flex items-center gap-2">
             {user.role === 'super_admin' && (
                <button onClick={onShowSql} className="text-xs bg-blue-600 px-3 py-1 rounded hover:bg-blue-500 flex items-center gap-1"><Database className="w-3 h-3"/> Mentenanță</button>
             )}
             <button onClick={onClose} className="text-sm bg-gray-700 px-3 py-1 rounded hover:bg-gray-600">Ieșire</button>
          </div>
      </div>
      <div className="flex bg-white shadow-sm overflow-x-auto">{['USERS', 'ALERTS', 'ANNOUNCEMENTS', 'EVENTS', 'DOCUMENTS'].map(t => (<button key={t} onClick={() => setTab(t as any)} className={`px-4 py-3 font-bold text-sm whitespace-nowrap ${tab === t ? 'text-ro-blue border-b-2 border-ro-blue bg-blue-50' : 'text-gray-500 hover:bg-gray-50'}`}>{t}</button>))}</div>
      <div className="flex-1 overflow-y-auto p-4">
        {tab === 'USERS' && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">{users.map(u => (
            <div key={u.id} className="bg-white rounded-lg shadow p-3 flex gap-3 border">
                <div className="w-1/3"><img src={u.avatarUrl || 'https://via.placeholder.com/150'} className="w-full h-24 object-cover rounded" alt=""/></div>
                <div className="w-2/3 text-sm flex flex-col justify-between">
                    <div>
                        <div className="font-bold">{u.firstName} {u.lastName}</div>
                        <div className="text-xs text-gray-500">{u.email}</div>
                    </div>
                    {user.role === 'super_admin' ? (
                        <div className="mt-2">
                            <label className="text-xs font-bold text-gray-500">Rol:</label>
                            <select 
                                value={u.role || 'user'} 
                                onChange={(e) => updateUserRole(u.id!, e.target.value)}
                                className="block w-full mt-1 p-1 border rounded text-xs bg-gray-50"
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                                <option value="super_admin">Super Admin</option>
                            </select>
                        </div>
                    ) : (
                        <div className="text-xs bg-gray-100 p-1 rounded inline-block mt-1 self-start">{u.role || 'user'}</div>
                    )}
                </div>
            </div>
        ))}</div>)}
        {(tab === 'ANNOUNCEMENTS' || tab === 'EVENTS' || tab === 'ALERTS') && (
           <div><div className="flex justify-between mb-4"><Button onClick={() => { setEditingItem({active: true}); setIsPreviewMode(false); setIsEditModalOpen(true); }}><Plus className="w-4 h-4 mr-1 inline"/> Adaugă</Button></div><div className="space-y-3">{(tab === 'ANNOUNCEMENTS' ? announcements : (tab === 'EVENTS' ? events : alerts)).map((item: any) => (<div key={item.id} className="bg-white p-3 rounded-lg shadow border flex justify-between items-center"><div className="flex items-center gap-3">{tab !== 'ALERTS' && <img src={item.image_url || item.imageUrl} className="w-12 h-12 object-cover rounded" alt=""/>}<div className="font-bold text-sm">{item.title}</div></div><div className="flex gap-2"><button onClick={() => { setEditingItem(item); setIsPreviewMode(false); setIsEditModalOpen(true); }} className="p-2 bg-blue-50 text-blue-600 rounded"><Edit className="w-4 h-4"/></button><button onClick={() => deleteItem(tab === 'ANNOUNCEMENTS' ? 'announcements' : (tab === 'EVENTS' ? 'events' : 'alerts'), item.id)} className="p-2 bg-red-50 text-red-600 rounded"><Trash2 className="w-4 h-4"/></button></div></div>))}</div></div>
        )}
        {tab === 'DOCUMENTS' && (
            <div>
                 <div className="space-y-3">
                    {docs.map(doc => (
                        <div key={doc.id} className="bg-white rounded-lg shadow p-3 border text-sm">
                            <div className="flex justify-between font-bold mb-1"><span>{doc.user_name}</span><span className="text-gray-400 font-normal text-xs">{new Date(doc.created_at).toLocaleDateString()}</span></div>
                            <div className="text-gray-600 mb-2">{doc.user_email}</div>
                            {doc.message && <div className="bg-blue-50 p-2 rounded text-xs text-blue-800 mb-2">"{doc.message}"</div>}
                            <div className="flex items-center gap-2">
                                <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1"><FileText className="w-3 h-3"/> {doc.file_name}</a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={isPreviewMode ? 'Previzualizare' : 'Editare'}>{isPreviewMode ? renderPreview() : renderEditForm()}</Modal>
    </div>
  );
};

// --- SETTINGS SCREEN ---
const SettingsScreen = ({ textSize, setTextSize, theme, setTheme, setView, notifications, setNotifications, t }: any) => {
  return ( 
      <div className="p-4 space-y-6">
          <h2 className="text-2xl font-bold text-ro-blue mb-4">{t('settings_title')}</h2>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><Bell className="w-4 h-4" /> {t('settings_notifications')}</h3>
              <label className="flex items-center justify-between"><span className="text-gray-700">Activează</span><input type="checkbox" checked={notifications.enabled} onChange={e => setNotifications({...notifications, enabled: e.target.checked})} /></label>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><Type className="w-4 h-4" /> {t('settings_text_size')}</h3>
              <div className="flex gap-2">
                  <button onClick={() => setTextSize(TextSize.SMALL)} className={`px-3 py-1 rounded border ${textSize === TextSize.SMALL ? 'bg-ro-blue text-white' : 'bg-gray-50'}`}>S</button>
                  <button onClick={() => setTextSize(TextSize.MEDIUM)} className={`px-3 py-1 rounded border ${textSize === TextSize.MEDIUM ? 'bg-ro-blue text-white' : 'bg-gray-50'}`}>M</button>
                  <button onClick={() => setTextSize(TextSize.LARGE)} className={`px-3 py-1 rounded border ${textSize === TextSize.LARGE ? 'bg-ro-blue text-white' : 'bg-gray-50'}`}>L</button>
                  <button onClick={() => setTextSize(TextSize.XLARGE)} className={`px-3 py-1 rounded border ${textSize === TextSize.XLARGE ? 'bg-ro-blue text-white' : 'bg-gray-50'}`}>XL</button>
              </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><Monitor className="w-4 h-4" /> {t('settings_theme')}</h3>
              <div className="flex gap-2">
                  <button onClick={() => setTheme(AppTheme.LIGHT)} className={`flex-1 py-2 rounded border flex items-center justify-center gap-1 ${theme === AppTheme.LIGHT ? 'bg-ro-blue text-white' : 'bg-gray-50'}`}><Sun className="w-4 h-4"/> Light</button>
                  <button onClick={() => setTheme(AppTheme.DARK)} className={`flex-1 py-2 rounded border flex items-center justify-center gap-1 ${theme === AppTheme.DARK ? 'bg-ro-blue text-white' : 'bg-gray-50'}`}><Moon className="w-4 h-4"/> Dark</button>
                  <button onClick={() => setTheme(AppTheme.AUTO)} className={`flex-1 py-2 rounded border flex items-center justify-center gap-1 ${theme === AppTheme.AUTO ? 'bg-ro-blue text-white' : 'bg-gray-50'}`}><Monitor className="w-4 h-4"/> Auto</button>
              </div>
          </div>

          <div className="space-y-2">
             <Button variant="ghost" fullWidth onClick={() => alert("Email: contact@consularo.app")} className="justify-start bg-white border border-gray-100">{t('settings_contact')}</Button>
             <Button variant="ghost" fullWidth onClick={() => setView('INFO')} className="justify-start bg-white border border-gray-100">{t('settings_terms')}</Button>
             <Button variant="ghost" fullWidth onClick={() => setView('INFO')} className="justify-start bg-white border border-gray-100">{t('settings_privacy')}</Button>
          </div>
      </div> 
    );
};

// --- PROFILE SCREEN ---
const ProfileScreen = ({ user, setUser, onLogout, t, onError, onViewChange }: any) => {
   const [isEditing, setIsEditing] = useState(false);
   const [tempUser, setTempUser] = useState(user);
   const [uploadingAvatar, setUploadingAvatar] = useState(false);
   const [showCamera, setShowCamera] = useState(false);
   const videoRef = useRef<HTMLVideoElement>(null);

   const displayAvatar = isEditing ? (tempUser.avatarUrl || user.avatarUrl) : user.avatarUrl;

   const startCamera = async () => { setShowCamera(true); try { const stream = await navigator.mediaDevices.getUserMedia({ video: true }); if (videoRef.current) videoRef.current.srcObject = stream; } catch(e) { alert('Err Camera'); setShowCamera(false); } };
   const takePhoto = () => { if (videoRef.current) { const canvas = document.createElement('canvas'); canvas.width = videoRef.current.videoWidth; canvas.height = videoRef.current.videoHeight; canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0); const dataUrl = canvas.toDataURL('image/jpeg'); uploadAvatarFromDataUrl(dataUrl); const stream = videoRef.current.srcObject as MediaStream; stream?.getTracks().forEach(t => t.stop()); setShowCamera(false); } };
   const uploadAvatarFromDataUrl = async (dataUrl: string) => { const res = await fetch(dataUrl); const blob = await res.blob(); const file = new File([blob], "avatar.jpg", { type: "image/jpeg" }); handleAvatarUpload(file); };
   const handleAvatarUpload = async (file: File) => {
       if(!user.id) return;
       setUploadingAvatar(true);
       try {
          const fileExt = file.name.split('.').pop();
          const fileName = `${user.id}-${Date.now()}.${fileExt}`;
          const filePath = `${fileName}`;
          const { error: uploadError } = await supabase.storage.from('profile_images').upload(filePath, file);
          if (uploadError) throw uploadError;
          const { data: { publicUrl } } = supabase.storage.from('profile_images').getPublicUrl(filePath);
          setTempUser({...tempUser, avatarUrl: publicUrl});
       } catch (e:any) { onError(e); } finally { setUploadingAvatar(false); }
   };
   
   const handleSave = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
             const updates = {
                first_name: tempUser.firstName || null,
                last_name: tempUser.lastName || null,
                phone: tempUser.phone || null,
                address: tempUser.address || null,
                city: tempUser.city || null,
                county: tempUser.county || null,
                country: tempUser.country || null,
                post_code: tempUser.postCode || null,
                username: tempUser.username || null,
                avatar_url: tempUser.avatarUrl || null, 
                updated_at: new Date(),
             };
             const { error } = await supabase.from('profiles').upsert({ id: authUser.id, ...updates }, { onConflict: 'id' });
             if (error) throw error;
        }
        setUser(tempUser);
        setIsEditing(false);
        alert(t('profile_success'));
      } catch (e: any) { onError(e); }
   };
   
   const handleDeleteAccount = async () => { if (window.confirm('Ești sigur că vrei să ștergi contul? Această acțiune este ireversibilă.')) { try { const { data: { user: authUser } } = await supabase.auth.getUser(); if (authUser) { await supabase.from('profiles').delete().eq('id', authUser.id); onLogout(); } } catch (e:any) { onError(e); } } };

   return (
     <div className="p-4 pb-24">
        <div className="flex flex-col items-center mb-6">
           <div className="relative group">
               <div className="w-24 h-24 bg-gray-200 rounded-full mb-3 flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                  {displayAvatar ? <img src={displayAvatar} className="w-full h-full object-cover" alt="Profile"/> : <User className="w-10 h-10 text-gray-400" />}
                  {showCamera && <video ref={videoRef} autoPlay className="absolute inset-0 w-full h-full object-cover z-20" />}
               </div>
               {isEditing && (
                  <div className="absolute bottom-2 right-0 flex gap-1">
                     <button onClick={() => document.getElementById('avatar-upload')?.click()} className="p-2 bg-blue-600 rounded-full text-white shadow hover:bg-blue-700"><Upload className="w-3 h-3"/></button>
                     <button onClick={showCamera ? takePhoto : startCamera} className="p-2 bg-ro-red rounded-full text-white shadow hover:bg-red-700">{showCamera ? <Camera className="w-3 h-3 animate-pulse"/> : <Camera className="w-3 h-3"/>}</button>
                  </div>
               )}
               <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files && handleAvatarUpload(e.target.files[0])} />
           </div>
           <h2 className="text-xl font-bold text-gray-800">{user.firstName} {user.lastName}</h2>
           {(user.role === 'admin' || user.role === 'super_admin') && (
              <Button onClick={() => onViewChange('ADMIN')} className="mt-2 text-xs flex items-center gap-2 bg-ro-blue"><Shield className="w-3 h-3"/> Panou Admin</Button>
           )}
           <Button onClick={() => onViewChange('SEND_DOCS')} className="mt-2 text-xs flex items-center gap-2 bg-ro-yellow text-ro-blue font-bold"><Send className="w-3 h-3"/> {t('profile_send_docs')}</Button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
           <div className="flex justify-between items-center p-4 border-b bg-gray-50">
              <h3 className="font-bold text-gray-700">Detalii Personale</h3>
              {!isEditing ? ( <button onClick={() => { setTempUser(user); setIsEditing(true); }} className="text-ro-blue text-sm font-bold flex items-center gap-1"><Edit className="w-3 h-3"/> {t('profile_edit')}</button> ) : ( <div className="flex gap-2"><button onClick={() => setIsEditing(false)} className="text-gray-500 text-sm font-medium">Anulează</button><button onClick={handleSave} className="text-green-600 text-sm font-bold flex items-center gap-1"><Save className="w-3 h-3"/> {t('profile_save')}</button></div> )}
           </div>
           <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div><label className="text-xs text-gray-500 block mb-1">{t('lbl_firstname')}</label><input disabled={!isEditing} value={isEditing ? tempUser.firstName : user.firstName} onChange={e => setTempUser({...tempUser, firstName: e.target.value})} className={`w-full p-2 rounded border ${isEditing ? 'bg-white border-blue-300' : 'bg-gray-50 border-gray-200'}`} /></div>
                 <div><label className="text-xs text-gray-500 block mb-1">{t('lbl_lastname')}</label><input disabled={!isEditing} value={isEditing ? tempUser.lastName : user.lastName} onChange={e => setTempUser({...tempUser, lastName: e.target.value})} className={`w-full p-2 rounded border ${isEditing ? 'bg-white border-blue-300' : 'bg-gray-50 border-gray-200'}`} /></div>
                 <div><label className="text-xs text-gray-500 block mb-1">{t('lbl_username')}</label><input disabled={!isEditing} value={isEditing ? tempUser.username : user.username} onChange={e => setTempUser({...tempUser, username: e.target.value})} className={`w-full p-2 rounded border ${isEditing ? 'bg-white border-blue-300' : 'bg-gray-50 border-gray-200'}`} /></div>
                 <div><label className="text-xs text-gray-500 block mb-1">{t('lbl_phone')}</label><input disabled={!isEditing} value={isEditing ? tempUser.phone : user.phone} onChange={e => setTempUser({...tempUser, phone: e.target.value})} className={`w-full p-2 rounded border ${isEditing ? 'bg-white border-blue-300' : 'bg-gray-50 border-gray-200'}`} /></div>
                 <div><label className="text-xs text-gray-500 block mb-1">{t('lbl_address')}</label><input disabled={!isEditing} value={isEditing ? tempUser.address : user.address} onChange={e => setTempUser({...tempUser, address: e.target.value})} className={`w-full p-2 rounded border ${isEditing ? 'bg-white border-blue-300' : 'bg-gray-50 border-gray-200'}`} /></div>
                 <div><label className="text-xs text-gray-500 block mb-1">{t('lbl_city')}</label><input disabled={!isEditing} value={isEditing ? tempUser.city : user.city} onChange={e => setTempUser({...tempUser, city: e.target.value})} className={`w-full p-2 rounded border ${isEditing ? 'bg-white border-blue-300' : 'bg-gray-50 border-gray-200'}`} /></div>
                 <div><label className="text-xs text-gray-500 block mb-1">{t('lbl_county')}</label><input disabled={!isEditing} value={isEditing ? tempUser.county : user.county} onChange={e => setTempUser({...tempUser, county: e.target.value})} className={`w-full p-2 rounded border ${isEditing ? 'bg-white border-blue-300' : 'bg-gray-50 border-gray-200'}`} /></div>
                 <div><label className="text-xs text-gray-500 block mb-1">{t('lbl_postal')}</label><input disabled={!isEditing} value={isEditing ? tempUser.postCode : user.postCode} onChange={e => setTempUser({...tempUser, postCode: e.target.value})} className={`w-full p-2 rounded border ${isEditing ? 'bg-white border-blue-300' : 'bg-gray-50 border-gray-200'}`} /></div>
                 <div><label className="text-xs text-gray-500 block mb-1">{t('lbl_country')}</label><input disabled={!isEditing} value={isEditing ? tempUser.country : user.country} onChange={e => setTempUser({...tempUser, country: e.target.value})} className={`w-full p-2 rounded border ${isEditing ? 'bg-white border-blue-300' : 'bg-gray-50 border-gray-200'}`} /></div>
              </div>
           </div>
        </div>
        <div className="mt-6 space-y-3">
           <Button variant="ghost" fullWidth onClick={onLogout} className="text-blue-600 hover:bg-blue-50 border border-blue-100 flex items-center justify-center gap-2"><LogOut className="w-4 h-4" /> {t('profile_logout')}</Button>
           <Button variant="danger" fullWidth onClick={handleDeleteAccount} className="flex items-center justify-center gap-2 bg-red-50 text-red-600 border border-red-100 hover:bg-red-100"><Trash2 className="w-4 h-4" /> {t('profile_delete')}</Button>
        </div>
     </div>
   );
};

const SendDocsScreen = ({ user, t, onError, onBack }: any) => {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [message, setMessage] = useState('');
    const [uploading, setUploading] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const startCamera = async () => { setShowCamera(true); try { const stream = await navigator.mediaDevices.getUserMedia({ video: true }); if (videoRef.current) videoRef.current.srcObject = stream; } catch(e) { alert('Err Camera'); setShowCamera(false); } };
    const takePhoto = () => { if (videoRef.current) { const canvas = document.createElement('canvas'); canvas.width = videoRef.current.videoWidth; canvas.height = videoRef.current.videoHeight; canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0); canvas.toBlob(blob => { if(blob) { const f = new File([blob], "photo.jpg", { type: "image/jpeg" }); setFile(f); setPreviewUrl(URL.createObjectURL(blob)); } }); const stream = videoRef.current.srcObject as MediaStream; stream?.getTracks().forEach(t => t.stop()); setShowCamera(false); } };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const f = e.target.files[0];
            setFile(f);
            if (f.type.startsWith('image/')) setPreviewUrl(URL.createObjectURL(f));
            else setPreviewUrl(null);
        }
    };

    const handleSend = async () => {
        if (!file || !user) return;
        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Date.now()}.${fileExt}`;
            const { error: uploadErr } = await supabase.storage.from('documents').upload(fileName, file);
            if (uploadErr) throw uploadErr;
            const { data: { publicUrl } } = supabase.storage.from('documents').getPublicUrl(fileName);
            
            const { error: dbErr } = await supabase.from('user_documents').insert({
                user_id: user.id,
                user_email: user.email,
                user_name: `${user.firstName} ${user.lastName}`,
                file_name: file.name,
                file_url: publicUrl,
                file_type: file.type.startsWith('image/') ? 'image' : 'pdf',
                message: message
            });
            if (dbErr) throw dbErr;
            alert('Document trimis cu succes!');
            setFile(null);
            setPreviewUrl(null);
            setMessage('');
            onBack();
        } catch(e:any) { onError(e); } finally { setUploading(false); }
    };

    return (
        <div className="p-4 pb-24 flex flex-col items-center">
            <div className="w-full flex items-center mb-4">
                 <button onClick={onBack} className="p-2 mr-2 bg-gray-100 rounded-full hover:bg-gray-200"><ArrowLeft className="w-5 h-5 text-gray-700"/></button>
                 <h2 className="text-2xl font-bold text-ro-blue">{t('send_docs_title')}</h2>
            </div>
            <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
                <div className="flex gap-2 justify-center">
                     <button onClick={() => document.getElementById('doc-upload')?.click()} className="flex-1 py-3 bg-blue-50 text-ro-blue rounded-lg font-bold border border-blue-100 flex flex-col items-center gap-1 hover:bg-blue-100"><Upload className="w-6 h-6"/> Încarcă Fișier</button>
                     <button onClick={startCamera} className="flex-1 py-3 bg-blue-50 text-ro-blue rounded-lg font-bold border border-blue-100 flex flex-col items-center gap-1 hover:bg-blue-100"><Camera className="w-6 h-6"/> Fă Poză</button>
                     <input id="doc-upload" type="file" className="hidden" accept="image/*,application/pdf" onChange={handleFileChange} />
                </div>
                {showCamera && (
                    <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
                        <video ref={videoRef} autoPlay className="w-full h-full object-cover" />
                        <button onClick={takePhoto} className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-4 shadow-lg border-4 border-gray-300"><div className="w-4 h-4 bg-red-600 rounded-full"></div></button>
                    </div>
                )}
                {file && (
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                            {file.type.startsWith('image/') ? <Eye className="w-4 h-4 text-gray-500"/> : <FileText className="w-4 h-4 text-gray-500"/>}
                            <span className="text-sm font-medium truncate flex-1">{file.name}</span>
                            <button onClick={() => { setFile(null); setPreviewUrl(null); }}><X className="w-4 h-4 text-red-500"/></button>
                        </div>
                        {previewUrl && <img src={previewUrl} className="w-full h-40 object-contain bg-white rounded border" alt="Preview"/>}
                        {!previewUrl && file.type === 'application/pdf' && <div className="text-xs text-center p-4 text-gray-400">Previzualizare PDF indisponibilă</div>}
                    </div>
                )}
                <textarea className="w-full p-3 border rounded-lg h-24 text-sm" placeholder="Adaugă un mesaj (opțional)..." value={message} onChange={e => setMessage(e.target.value)} />
                <Button fullWidth onClick={handleSend} disabled={!file || uploading}>{uploading ? 'Se trimite...' : 'Trimite Documentul'}</Button>
            </div>
        </div>
    );
};

const InfoScreen = ({ t }: any) => {
    return (
        <div className="p-4 pb-24">
            <h2 className="text-2xl font-bold text-ro-blue mb-6">{t('info_title')}</h2>
            
            <section className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2">{t('faq_section')}</h3>
                <div className="space-y-4">
                    {FAQ_DATA.map(cat => (
                        <div key={cat.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                            <h4 className="font-bold text-md text-ro-blue mb-2">{cat.title}</h4>
                            <div className="space-y-3">
                                {cat.questions.map((q, idx) => (
                                    <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                                        <p className="font-semibold text-gray-800 text-sm mb-1">Q: {q.question}</p>
                                        <p className="text-gray-600 text-sm">A: {q.answer}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2">{t('terms_section')}</h3>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-sm text-gray-600">
                    <p>Termenii și condițiile aplicației ConsulaRO...</p>
                    <p className="text-xs text-gray-400 mt-2 italic">(Secțiune în dezvoltare. Aici va fi textul legal complet.)</p>
                </div>
            </section>

            <section className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2">{t('privacy_section')}</h3>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-sm text-gray-600">
                    <p>Politica de confidențialitate privind datele personale...</p>
                    <p className="text-xs text-gray-400 mt-2 italic">(Secțiune în dezvoltare. Aici va fi textul legal complet.)</p>
                </div>
            </section>
        </div>
    );
};

// --- MAIN APP COMPONENT ---

const App = () => {
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewState>('SPLASH');
  const [lang, setLang] = useState<LanguageCode>('RO');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationPreferences>({ enabled: true, announcements: true, events: true, requests: true });
  const [theme, setTheme] = useState<AppTheme>(AppTheme.AUTO);
  const [textSize, setTextSize] = useState<TextSize>(TextSize.MEDIUM);
  
  // New States for Error/SQL Modals
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [errorModal, setErrorModal] = useState<{isOpen: boolean, error: any}>({isOpen: false, error: null});

  // Data State
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<Announcement | EventItem | AlertItem | null>(null);

  // Auth State
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const t = useTranslation(lang);

  const handleError = (error: any) => {
    console.error("Global Error Handler:", error);
    setErrorModal({ isOpen: true, error });
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) fetchProfile(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
         fetchProfile(session.user.id);
      } else {
         setUser(null);
         if(view !== 'SPLASH') setView('AUTH');
      }

      // Handle OAuth error in URL hash
      if (event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
          const hash = window.location.hash;
          if (hash && hash.includes('error_description')) {
              const params = new URLSearchParams(hash.substring(1));
              const errorDescription = params.get('error_description');
              if (errorDescription) alert(`Eroare autentificare: ${errorDescription.replace(/\+/g, ' ')}`);
          }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
     const fetchContent = async () => {
        const { data: ann } = await supabase.from('announcements').select('*').eq('active', true).order('date', {ascending: false});
        if(ann) setAnnouncements(ann.map((i:any) => ({...i, imageUrl: i.image_url, endDate: i.end_date, active: i.active})));
        
        const { data: ev } = await supabase.from('events').select('*').eq('active', true).order('date', {ascending: false});
        if(ev) setEvents(ev.map((i:any) => ({...i, imageUrl: i.image_url, endDate: i.end_date, active: i.active})));

        const { data: al } = await supabase.from('alerts').select('*').eq('active', true);
        if(al) setAlerts(al);
     };
     fetchContent();
  }, []);

  const fetchProfile = async (userId: string) => {
      // 1. Try normal fetch
      let { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
      
      // Ignore "no rows" error, we will handle it
      if (error && error.code === 'PGRST116') { error = null; data = null; }
      
      if (!data) {
        console.warn("Profile missing, attempting fallback creation...");
        // 2. Fallback: If auth succeeded but profile missing (trigger failed/delayed), create it manually.
        const { data: userData } = await supabase.auth.getUser();
        if(userData.user) {
             const meta = userData.user.user_metadata || {};
             let first = meta.first_name || '';
             let last = meta.last_name || '';
             
             // Fallback for Google/Facebook who might send full_name
             if (!first && meta.full_name) {
                 const parts = meta.full_name.split(' ');
                 first = parts[0];
                 last = parts.slice(1).join(' ');
             }
             
             const avatar = meta.avatar_url || meta.picture || null;

             const newProfile = {
                 id: userId,
                 email: userData.user.email,
                 first_name: first,
                 last_name: last,
                 avatar_url: avatar,
                 role: 'user'
             };
             // Use upsert to handle race conditions with trigger
             const { error: insertError } = await supabase.from('profiles').upsert(newProfile);
             
             if (!insertError) {
                 data = newProfile;
                 error = null; 
             } else {
                 console.error("Fallback creation failed:", insertError);
                 // 3. Retry fetch one last time (maybe trigger finished now)
                 const { data: retryData } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
                 if (retryData) { data = retryData; error = null; }
             }
        }
      }

      if (data) {
         setUser({
            id: data.id,
            firstName: data.first_name || '',
            lastName: data.last_name || '',
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
            city: data.city || '',
            county: data.county || '',
            country: data.country || '',
            postCode: data.post_code || '',
            username: data.username || '',
            avatarUrl: data.avatar_url || null,
            role: data.role || 'user'
         });
         if(view === 'AUTH' || view === 'SPLASH') setView('HOME');
      }
  };

  const handleOAuthLogin = async (provider: 'google' | 'facebook') => {
    try {
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: window.location.origin,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
            }
        });
        if (error) throw error;
    } catch (e: any) {
        handleError(e);
    }
  };

  const handleAuth = async () => {
    try {
      if (authMode === 'LOGIN') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        // Register Logic
        const { data, error } = await supabase.auth.signUp({ 
            email, 
            password,
            options: { data: { first_name: firstName, last_name: lastName } }
        });
        if (error) throw error;
        
        // Handle "Confirm Email" scenario
        if (data.user && !data.session) {
             alert("Înregistrare reușită! Te rugăm să îți verifici emailul pentru a confirma contul înainte de autentificare.");
             setAuthMode('LOGIN');
             return;
        }

        if (data.user) {
            alert('Cont creat cu succes!');
            // If we have a session, fetchProfile runs automatically. 
            // If trigger fails, fetchProfile fallback handles it.
        }
      }
    } catch (e: any) {
      if (e.message.includes("Invalid login credentials")) {
          alert("Email sau parolă incorectă.");
      } else if (e.message.includes("Email not confirmed")) {
          alert("Adresa de email nu a fost confirmată. Verifică Inbox-ul.");
      } else if (e.message.includes("User already registered")) {
          alert("Există deja un cont cu acest email.");
      } else {
          handleError(e);
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setView('AUTH');
    setUser(null);
  };

  const getAlertIcon = (type: string) => {
     if (type === 'critical') return <AlertTriangle className="w-12 h-12 text-white" />;
     if (type === 'warning') return <AlertCircle className="w-12 h-12 text-white" />;
     return <Info className="w-12 h-12 text-white" />;
  }

  const getAlertColor = (type: string) => {
    if (type === 'critical') return 'bg-ro-red';
    if (type === 'warning') return 'bg-orange-500';
    return 'bg-blue-500';
  }

  if (view === 'SPLASH') {
    return <SplashScreen onFinish={() => {
        setLoading(false);
        setView(user ? 'HOME' : 'AUTH'); 
    }} />;
  }
  
  if (view === 'ADMIN' && user) {
     return <AdminScreen user={user} onClose={() => setView('PROFILE')} onError={handleError} onShowSql={() => setShowSqlModal(true)} />;
  }

  if (view === 'AUTH' && !user) {
     return (
       <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
             <div className="mx-auto h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-md mb-4 border-2 border-gray-100 overflow-hidden">
                <img src="/logo.png" className="w-full h-full object-contain p-2" onError={(e) => { (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/commons/7/70/Coat_of_arms_of_Romania.svg'; }} alt="Logo" />
             </div>
             <h2 className="text-3xl font-extrabold text-ro-blue">ConsulaRO</h2>
             <p className="mt-2 text-gray-600">{authMode === 'LOGIN' ? t('auth_login') : t('auth_register')}</p>
          </div>
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 space-y-4">
                {authMode === 'REGISTER' && (
                    <div className="grid grid-cols-2 gap-2">
                        <input className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder={t('lbl_firstname')} value={firstName} onChange={e => setFirstName(e.target.value)} />
                        <input className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder={t('lbl_lastname')} value={lastName} onChange={e => setLastName(e.target.value)} />
                    </div>
                )}
                <input type="email" className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                <input type="password" className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Parola" value={password} onChange={e => setPassword(e.target.value)} />
                
                <Button fullWidth onClick={handleAuth}>{authMode === 'LOGIN' ? t('btn_login') : t('btn_create')}</Button>
                
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300" /></div>
                  <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">sau continuă cu</span></div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => handleOAuthLogin('google')} className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <span>Google</span>
                    </button>
                    <button onClick={() => handleOAuthLogin('facebook')} className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        <Facebook className="w-5 h-5 text-blue-600" fill="currentColor" />
                        <span>Facebook</span>
                    </button>
                </div>
                
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300" /></div>
                  <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">sau</span></div>
                </div>
                
                <div className="text-center">
                   <button onClick={() => setAuthMode(authMode === 'LOGIN' ? 'REGISTER' : 'LOGIN')} className="text-sm font-medium text-ro-blue hover:text-blue-800">
                     {authMode === 'LOGIN' ? "Nu ai cont? Înregistrează-te" : "Ai deja cont? Autentifică-te"}
                   </button>
                </div>
                <div className="mt-4 text-center">
                   <button onClick={() => { setView('HOME'); }} className="text-xs text-gray-400 hover:text-gray-600">Continuă ca vizitator (Funcționalități limitate)</button>
                </div>
            </div>
          </div>
       </div>
     );
  }

  // Helper icons for main render
  const MapPinIcon = ({className}:{className?:string}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

  // Filter Alerts logic
  const activeAlerts = alerts.filter(a => {
      if (!a.country) return true;
      if (!user || !user.country) return false; 
      return user.country.toLowerCase().includes(a.country.toLowerCase()) || a.country.toLowerCase().includes(user.country.toLowerCase());
  });

  const renderContent = () => {
    switch(view) {
       case 'HOME':
          return (
             <div className="p-4 space-y-6 pb-24">
                <div className="bg-gradient-to-r from-ro-blue to-blue-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full transform translate-x-10 -translate-y-10"></div>
                    <h2 className="text-2xl font-bold mb-2">{t('welcome')} {user?.firstName ? `, ${user.firstName}` : ''}</h2>
                    <p className="opacity-90">{APP_DESCRIPTION_SHORT}</p>
                    <div className="mt-4 flex justify-center bg-white/20 p-2 rounded-lg backdrop-blur-sm h-24">
                       <img src="https://upload.wikimedia.org/wikipedia/commons/7/70/Coat_of_arms_of_Romania.svg" className="h-full w-auto object-contain" alt="MAE" />
                    </div>
                </div>

                {activeAlerts.length > 0 && (
                    <section>
                         <h3 className="text-lg font-bold text-red-700 flex items-center gap-2 mb-3"><AlertTriangle className="w-5 h-5" /> {t('alerts_section')}</h3>
                         <AutoScrollSection interval={4000}>
                            {activeAlerts.map(alert => (
                                <div key={alert.id} onClick={() => setSelectedItem(alert)} className="snap-center min-w-[300px] bg-white rounded-xl shadow-md p-3 flex gap-3 border border-gray-100 cursor-pointer hover:shadow-lg transition-all">
                                     <div className={`w-24 h-24 ${getAlertColor(alert.type)} rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center`}>
                                         {getAlertIcon(alert.type)}
                                     </div>
                                     <div className="flex-1 flex flex-col justify-center">
                                         <h4 className="font-bold text-gray-800 line-clamp-2 text-sm">{alert.title}</h4>
                                         <p className="text-xs text-gray-600 mt-1 line-clamp-2">{alert.message}</p>
                                     </div>
                                </div>
                            ))}
                         </AutoScrollSection>
                    </section>
                )}

                <section>
                   <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><Megaphone className="w-5 h-5 text-ro-red" /> {t('title_announcements')}</h3>
                      <button onClick={() => setView('ANNOUNCEMENTS_LIST')} className="text-sm text-ro-blue font-semibold">{t('view_all')}</button>
                   </div>
                   <AutoScrollSection interval={5000}>
                      {announcements.length === 0 ? (
                         <div className="text-gray-400 text-sm italic w-full text-center py-4">Nu există anunțuri momentan.</div>
                      ) : (
                        announcements.map(item => (
                           <div key={item.id} onClick={() => setSelectedItem(item)} className="snap-center min-w-[300px] bg-white rounded-xl shadow-md p-3 flex gap-3 border border-gray-100 cursor-pointer hover:shadow-lg transition-all">
                              <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                 <img src={item.imageUrl || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" alt={item.title}/>
                              </div>
                              <div className="flex-1 flex flex-col justify-center">
                                 <h4 className="font-bold text-gray-800 line-clamp-2 text-sm">{item.title}</h4>
                                 <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                              </div>
                           </div>
                        ))
                      )}
                   </AutoScrollSection>
                </section>

                <section>
                   <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><Calendar className="w-5 h-5 text-ro-yellow" /> {t('title_events')}</h3>
                      <button onClick={() => setView('EVENTS_LIST')} className="text-sm text-ro-blue font-semibold">{t('view_all')}</button>
                   </div>
                   <AutoScrollSection interval={7000}>
                      {events.length === 0 ? (
                         <div className="text-gray-400 text-sm italic w-full text-center py-4">Nu există evenimente active.</div>
                      ) : (
                        events.map(event => (
                           <div key={event.id} onClick={() => setSelectedItem(event)} className="snap-center min-w-[300px] bg-white rounded-xl shadow-md p-3 flex gap-3 border border-gray-100 cursor-pointer hover:shadow-lg transition-all">
                              <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                 <img src={event.imageUrl || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" alt={event.title}/>
                              </div>
                              <div className="flex-1 flex flex-col justify-center">
                                 <h4 className="font-bold text-gray-800 line-clamp-2 text-sm">{event.title}</h4>
                                 <div className="text-xs text-ro-blue font-semibold mt-1 flex items-center gap-1"><MapPinIcon className="w-3 h-3"/> {event.location}</div>
                              </div>
                           </div>
                        ))
                      )}
                   </AutoScrollSection>
                </section>
             </div>
          );
       case 'SERVICES':
          return (
             <div className="p-4 pb-24">
                <h2 className="text-2xl font-bold text-ro-blue mb-6">{t('services_title')}</h2>
                <div className="grid grid-cols-1 gap-4">
                   {SERVICE_CATEGORIES.map(cat => {
                      const Icon = IconMap[cat.iconName] || FileText;
                      return (
                         <div key={cat.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-4 border-b border-gray-50 flex items-center gap-3 bg-gray-50">
                                <div className="p-2 bg-blue-100 rounded-lg text-ro-blue"><Icon className="w-6 h-6"/></div>
                                <h3 className="font-bold text-gray-800 text-lg">{cat.title}</h3>
                            </div>
                            <div className="divide-y divide-gray-100">
                               {cat.subServices.map((sub, idx) => (
                                  <a key={idx} href={sub.url} target="_blank" rel="noopener noreferrer" className="block p-3 pl-14 text-sm text-gray-600 hover:bg-blue-50 hover:text-ro-blue transition-colors flex justify-between items-center group">
                                     {sub.name}
                                     <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-ro-blue"/>
                                  </a>
                               ))}
                            </div>
                         </div>
                      );
                   })}
                </div>
             </div>
          );
       case 'ANNOUNCEMENTS_LIST':
            return (
                <div className="p-4 pb-24 space-y-4">
                    <h2 className="text-2xl font-bold text-ro-blue mb-4">{t('nav_announcements')}</h2>
                    {activeAlerts.length > 0 && (
                        <div className="mb-6 space-y-4">
                             <h3 className="text-lg font-bold text-red-700 flex items-center gap-2 mb-2"><AlertTriangle className="w-5 h-5" /> {t('alerts_section')}</h3>
                             {activeAlerts.map(alert => (
                                <div key={alert.id} onClick={() => setSelectedItem(alert)} className="bg-white rounded-xl shadow-sm p-3 flex gap-3 border border-red-100 cursor-pointer hover:shadow-md transition-all">
                                     <div className={`w-24 h-24 ${getAlertColor(alert.type)} rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center`}>
                                         {getAlertIcon(alert.type)}
                                     </div>
                                     <div className="flex-1 flex flex-col justify-center">
                                         <h4 className="font-bold text-gray-800 line-clamp-2 text-sm">{alert.title}</h4>
                                         <p className="text-xs text-gray-600 mt-1 line-clamp-2">{alert.message}</p>
                                     </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <h3 className="text-lg font-bold text-gray-800 mt-6 mb-2">{t('title_announcements')}</h3>
                    {announcements.length === 0 ? (
                    <div className="text-gray-400 text-sm italic w-full text-center py-4">Nu există anunțuri active.</div>
                    ) : (
                    announcements.map(item => (
                        <div key={item.id} onClick={() => setSelectedItem(item)} className="bg-white rounded-xl shadow-sm p-3 flex gap-3 border border-gray-100 cursor-pointer hover:shadow-md transition-all">
                            <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                <img src={item.imageUrl || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" alt={item.title}/>
                            </div>
                            <div className="flex-1 flex flex-col justify-center">
                                <h4 className="font-bold text-gray-800 line-clamp-2 text-sm">{item.title}</h4>
                                <p className="text-xs text-gray-600 line-clamp-2 mt-1">{item.description}</p>
                            </div>
                        </div>
                    ))
                    )}
                </div>
            );
       case 'SEND_DOCS':
          return user ? <SendDocsScreen user={user} t={t} onError={handleError} onBack={() => setView('PROFILE')} /> : <div className="p-10 text-center">Te rugăm să te autentifici. <Button onClick={() => setView('AUTH')} className="mt-4">Login</Button></div>;
       case 'EVENTS_LIST':
          return (
             <div className="p-4 pb-24 space-y-4">
                 <h2 className="text-2xl font-bold text-ro-blue mb-4">{t('nav_events')}</h2>
                 {events.length === 0 ? (
                    <div className="text-gray-400 text-sm italic w-full text-center py-4">Nu există evenimente active.</div>
                 ) : (
                    events.map(event => (
                       <div key={event.id} onClick={() => setSelectedItem(event)} className="bg-white rounded-xl shadow-sm p-3 flex gap-3 border border-gray-100 cursor-pointer hover:shadow-md transition-all">
                          <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                             <img src={event.imageUrl || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" alt={event.title}/>
                          </div>
                          <div className="flex-1 flex flex-col justify-center">
                             <h4 className="font-bold text-gray-800 line-clamp-2 text-sm">{event.title}</h4>
                             <div className="text-xs text-ro-blue font-semibold mt-1 flex items-center gap-1"><MapPinIcon className="w-3 h-3"/> {event.location}</div>
                             <p className="text-xs text-gray-600 line-clamp-2 mt-1">{event.description}</p>
                          </div>
                       </div>
                    ))
                 )}
             </div>
          );
       case 'INFO':
          return <InfoScreen t={t} />;
       case 'SETTINGS':
          return <SettingsScreen textSize={textSize} setTextSize={setTextSize} theme={theme} setTheme={setTheme} setView={setView} notifications={notifications} setNotifications={setNotifications} t={t} />;
       case 'PROFILE':
          return user ? <ProfileScreen user={user} setUser={setUser} onLogout={handleLogout} t={t} onError={handleError} onViewChange={setView} /> : <div className="p-10 text-center">Te rugăm să te autentifici. <Button onClick={() => setView('AUTH')} className="mt-4">Login</Button></div>;
       default:
          return null;
    }
  };

  return (
     <div className={`min-h-screen bg-white ${textSize} font-sans`}>
        <Header 
          currentLang={lang} 
          setLang={setLang} 
          onProfileClick={() => setView(user ? 'PROFILE' : 'AUTH')} 
          onSettingsClick={() => setView('SETTINGS')} 
          onSearchClick={() => setIsSearchOpen(true)}
          isLoggedIn={!!user}
          userRole={user?.role}
        />
        
        <main className="max-w-2xl mx-auto min-h-screen bg-gray-50 shadow-2xl relative">
           {renderContent()}
        </main>
        
        <BottomNav currentView={view} setView={setView} t={t} />
        
        <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} t={t} />
        
        <DetailModal 
           isOpen={!!selectedItem} 
           onClose={() => setSelectedItem(null)} 
           title={selectedItem?.title} 
           imageUrl={'imageUrl' in (selectedItem || {}) ? (selectedItem as any).imageUrl : undefined}
        >
           {selectedItem && (
              <div className="space-y-4">
                 {'type' in selectedItem ? (
                     // Alert Detail View
                     <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                         <div className="flex items-center gap-2 mb-2 font-bold text-red-800">
                            {getAlertIcon(selectedItem.type)}
                            <span>Alertă {selectedItem.type.toUpperCase()}</span>
                         </div>
                         <p className="text-gray-800 whitespace-pre-line">{selectedItem.message}</p>
                         {selectedItem.country && <div className="mt-2 text-xs text-gray-500">Target: {selectedItem.country}</div>}
                     </div>
                 ) : (
                     // Announcement/Event Detail View
                     <>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="w-4 h-4"/> 
                            <span>{(selectedItem as any).date} {(selectedItem as any).endDate ? ` - ${(selectedItem as any).endDate}` : ''}</span>
                        </div>
                        {'location' in selectedItem && (
                            <div className="flex items-center gap-2 text-sm text-ro-blue font-semibold">
                            <MapPinIcon className="w-4 h-4"/> 
                            <span>{(selectedItem as EventItem).location}</span>
                            </div>
                        )}
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{(selectedItem as any).description}</p>
                     </>
                 )}
                 <Button fullWidth onClick={() => setSelectedItem(null)}>Închide</Button>
              </div>
           )}
        </DetailModal>

        <SqlFixModal isOpen={showSqlModal} onClose={() => setShowSqlModal(false)} t={t} />
        <ErrorDisplayModal 
          isOpen={errorModal.isOpen} 
          error={errorModal.error} 
          onClose={() => setErrorModal({isOpen: false, error: null})} 
          onShowSql={() => setShowSqlModal(true)} 
          t={t}
        />
     </div>
  );
};

export default App;
