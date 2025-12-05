
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Menu, X, Home, Book, Send, HelpCircle, Settings, User, 
  LogOut, Globe, Moon, Sun, Monitor, Camera, Bell, Calendar,
  ChevronRight, ChevronLeft, Image as ImageIcon, FileText, Users, Flag, Globe as GlobeIcon, FileCheck, Mail, BookOpen, UserCheck, MoreHorizontal, Search, Shield, Download, Edit, Trash2, Plus, Filter, Save, FileIcon, Eye, ArrowLeft, Upload
} from 'lucide-react';
import { 
  LanguageCode, UserProfile, AppTheme, TextSize, ViewState, 
  Announcement, EventItem, ServiceCategory, NotificationPreferences, SearchCategory, UserRole, UserDocument
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
  onAdminClick,
  isLoggedIn,
  userRole
}: { 
  currentLang: LanguageCode; 
  setLang: (l: LanguageCode) => void; 
  onProfileClick: () => void;
  onSettingsClick: () => void;
  onSearchClick: () => void;
  onAdminClick: () => void;
  isLoggedIn: boolean;
  userRole?: UserRole;
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
             <img 
               src="/ConsulaRO.png" 
               alt="App Logo" 
               className="w-full h-full object-cover"
               onError={(e) => {
                 (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/commons/7/70/Coat_of_arms_of_Romania.svg';
               }}
             />
           </div>
           
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
          
          {/* Admin Button */}
          {(userRole === 'admin' || userRole === 'super_admin') && (
            <button onClick={onAdminClick} className="text-white bg-red-600/80 hover:bg-red-700 p-1.5 rounded-full shadow-sm mr-1">
              <Shield className="w-4 h-4" />
            </button>
          )}

          {/* Language Dropdown */}
          <div className="relative group">
            <button 
              className="flex items-center space-x-1 text-white font-medium bg-black/20 px-2 py-1 rounded"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span className="text-xs">{currentLang}</span>
              <GlobeIcon className="w-4 h-4" />
            </button>
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
  // Hide bottom nav in admin view
  if (currentView === 'ADMIN') return null;

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

const SearchOverlay = ({ isOpen, onClose, onNavigate, t }: { isOpen: boolean; onClose: () => void; onNavigate: (view: ViewState) => void; t: (k:string)=>string }) => {
    const [query, setQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
  
    useEffect(() => {
      if (isOpen && inputRef.current) setTimeout(() => inputRef.current?.focus(), 100);
      if (!isOpen) { setQuery(''); }
    }, [isOpen]);

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 bg-white flex flex-col animate-fade-in">
             <div className="p-4 border-b flex items-center gap-2 bg-gray-50">
                <Search className="w-5 h-5 text-gray-500" />
                <input ref={inputRef} className="flex-1 bg-transparent outline-none text-lg" placeholder={t('search_placeholder')} value={query} onChange={(e) => setQuery(e.target.value)} />
                <button onClick={onClose} className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"><X className="w-5 h-5 text-gray-700" /></button>
            </div>
            <div className="p-4 text-center text-gray-500">Căutare indisponibilă momentan.</div>
        </div>
    )
}

const DetailModal = ({ isOpen, onClose, title, imageUrl, children }: { isOpen: boolean, onClose: () => void, title: string, imageUrl?: string, children?: React.ReactNode }) => {
    const [imageOnly, setImageOnly] = useState(false);
    useEffect(() => { if(isOpen) setImageOnly(false); }, [isOpen]);
    if (!isOpen) return null;
    return (
      <Modal isOpen={isOpen} onClose={onClose} title={title} fullScreen={imageOnly}>
        <div className="flex flex-col h-full">
          {imageUrl && (
            <div 
               className={`transition-all duration-300 relative cursor-pointer ${imageOnly ? 'flex-1 bg-black flex items-center justify-center' : 'h-48 mb-4'}`}
               onClick={() => setImageOnly(!imageOnly)}
            >
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

const AdminScreen = ({ user, onClose }: { user: UserProfile, onClose: () => void }) => {
  const [tab, setTab] = useState<'USERS' | 'ANNOUNCEMENTS' | 'EVENTS' | 'DOCUMENTS'>('USERS');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [docs, setDocs] = useState<UserDocument[]>([]);
  
  // CMS State
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  
  const [editingItem, setEditingItem] = useState<any>(null); // For Add/Edit Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [tab]);

  const fetchData = async () => {
    try {
      if (tab === 'USERS') {
        const { data } = await supabase.from('profiles').select('*');
        if (data) setUsers(data as any);
      } else if (tab === 'DOCUMENTS') {
         const { data } = await supabase.from('user_documents').select('*').order('created_at', { ascending: false });
         if (data) setDocs(data as any);
      } else if (tab === 'ANNOUNCEMENTS') {
         const { data, error } = await supabase.from('announcements').select('*').order('date', { ascending: false });
         if(error) throw error;
         // Map image_url (db) to imageUrl (frontend)
         if (data) setAnnouncements(data.map((i:any) => ({...i, imageUrl: i.image_url, endDate: i.end_date})));
      } else if (tab === 'EVENTS') {
         const { data, error } = await supabase.from('events').select('*').order('date', { ascending: false });
         if(error) throw error;
         if (data) setEvents(data.map((i:any) => ({...i, imageUrl: i.image_url, endDate: i.end_date})));
      }
    } catch (error: any) {
       console.error("Fetch Error:", error);
       alert("Eroare la încărcarea datelor (verificați consola): " + error.message);
    }
  };

  const handleExportCSV = (data: any[], filename: string) => {
    const headers = Object.keys(data[0] || {}).join(',');
    const rows = data.map(obj => Object.values(obj).map(v => `"${v}"`).join(',')).join('\n');
    const csvContent = "data:text/csv;charset=utf-8," + headers + '\n' + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const deleteItem = async (table: string, id: string) => {
    if(!confirm('Sigur doriți să ștergeți?')) return;
    await supabase.from(table).delete().eq('id', id);
    fetchData();
  };

  const saveItem = async (table: string, data: any) => {
     setSaving(true);
     try {
       // Ensure end_date is saved. Ensure unified description.
       const payload = {
          title: data.title,
          description: data.description, 
          image_url: data.image_url || data.imageUrl, // Handle both cases
          date: data.date,
          end_date: data.end_date || data.endDate || null,
          active: data.active !== false
       };

       if(table === 'events') {
          (payload as any).location = data.location;
       }

       if (data.id) {
          const { error } = await supabase.from(table).update(payload).eq('id', data.id);
          if (error) throw error;
       } else {
          const { error } = await supabase.from(table).insert(payload);
          if (error) throw error;
       }
       setIsEditModalOpen(false);
       setIsPreviewMode(false);
       fetchData();
     } catch(e:any) {
        alert('Eroare salvare: ' + e.message);
        console.error(e);
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
      
      // Update both properties to be safe
      setEditingItem({ ...editingItem, image_url: publicUrl, imageUrl: publicUrl });
    } catch (error: any) {
      alert('Eroare upload: ' + error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  // Preview Logic
  const renderPreview = () => {
     if(!editingItem) return null;
     
     const isEvent = tab === 'EVENTS';
     const img = editingItem.image_url || editingItem.imageUrl;
     
     return (
        <div className="space-y-4">
           <div className="bg-yellow-50 p-2 text-sm text-yellow-800 border border-yellow-200 rounded">
              Acesta este modul de previzualizare. Verificați dacă totul arată corect înainte de salvare.
           </div>

           {/* Card Preview */}
           <div className="border rounded-lg overflow-hidden shadow-sm bg-white">
               {img && (
                   <div className="h-48 w-full bg-black flex items-center justify-center">
                       <img src={img} className="h-full object-contain" alt="Preview"/>
                   </div>
               )}
               <div className="p-4">
                  <h2 className="text-xl font-bold text-ro-blue mb-2">{editingItem.title}</h2>
                  <div className="text-sm text-ro-red font-semibold mb-2">
                     {isEvent && <>{editingItem.location} • </>}
                     {editingItem.date} {editingItem.end_date || editingItem.endDate ? ` - ${editingItem.end_date || editingItem.endDate}` : ''}
                  </div>
                  <p className="text-gray-700 whitespace-pre-line">{editingItem.description}</p>
               </div>
           </div>

           <div className="flex gap-2 pt-4 border-t">
              <Button variant="ghost" onClick={() => setIsPreviewMode(false)}><ArrowLeft className="w-4 h-4 mr-2"/> Înapoi la Editare</Button>
              <Button fullWidth onClick={() => saveItem(tab === 'ANNOUNCEMENTS' ? 'announcements' : 'events', editingItem)} disabled={saving}>
                 {saving ? 'Se salvează...' : 'Confirmă și Salvează'}
              </Button>
           </div>
        </div>
     );
  };

  const renderEditForm = () => {
    return (
       <div className="space-y-3">
            <input 
              className="w-full p-2 border rounded" 
              placeholder="Titlu" 
              value={editingItem?.title || ''} 
              onChange={e => setEditingItem({...editingItem, title: e.target.value})} 
            />
            
            <textarea 
              className="w-full p-2 border rounded h-40" 
              placeholder="Descriere Detaliată (unică)" 
              value={editingItem?.description || ''} 
              onChange={e => setEditingItem({...editingItem, description: e.target.value})} 
            />
            
            {tab === 'EVENTS' && (
               <input 
                 className="w-full p-2 border rounded" 
                 placeholder="Locație" 
                 value={editingItem?.location || ''} 
                 onChange={e => setEditingItem({...editingItem, location: e.target.value})} 
               />
            )}
            
            <div className="grid grid-cols-2 gap-2">
               <div>
                  <label className="text-xs text-gray-500">Data Început</label>
                  <input 
                    type="date"
                    className="w-full p-2 border rounded" 
                    value={editingItem?.date || ''} 
                    onChange={e => setEditingItem({...editingItem, date: e.target.value})} 
                  />
               </div>
               <div>
                  <label className="text-xs text-gray-500">Data Sfârșit (Opțional)</label>
                  <input 
                    type="date"
                    className="w-full p-2 border rounded" 
                    value={editingItem?.end_date || editingItem?.endDate || ''} 
                    onChange={e => setEditingItem({...editingItem, end_date: e.target.value, endDate: e.target.value})} 
                  />
               </div>
            </div>

            {/* Image Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors">
               <label className="cursor-pointer block">
                  <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2"/>
                  <span className="text-sm text-ro-blue font-bold">{uploadingImage ? 'Se încarcă...' : 'Încarcă Imagine (jpg, png)'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
               </label>
               {(editingItem?.image_url || editingItem?.imageUrl) && (
                  <div className="mt-2 text-xs text-green-600 truncate">Imagine atașată</div>
               )}
            </div>
            
            <label className="flex items-center gap-2">
               <input 
                 type="checkbox" 
                 checked={editingItem?.active !== false} 
                 onChange={e => setEditingItem({...editingItem, active: e.target.checked})} 
               />
               <span className="text-sm">Activ</span>
            </label>

            <Button fullWidth onClick={() => setIsPreviewMode(true)} disabled={!editingItem?.title || uploadingImage}><Eye className="w-4 h-4 mr-2"/> Previzualizare</Button>
       </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* Admin Header */}
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-md">
        <h2 className="text-xl font-bold flex items-center gap-2"><Shield /> Panou Administrare</h2>
        <button onClick={onClose} className="text-sm bg-gray-700 px-3 py-1 rounded hover:bg-gray-600">Ieșire</button>
      </div>
      
      {/* Tabs */}
      <div className="flex bg-white shadow-sm overflow-x-auto">
         {['USERS', 'ANNOUNCEMENTS', 'EVENTS', 'DOCUMENTS'].map(t => (
           <button 
             key={t}
             onClick={() => setTab(t as any)}
             className={`px-4 py-3 font-bold text-sm whitespace-nowrap ${tab === t ? 'text-ro-blue border-b-2 border-ro-blue bg-blue-50' : 'text-gray-500 hover:bg-gray-50'}`}
           >
             {t === 'USERS' ? 'Utilizatori' : t === 'ANNOUNCEMENTS' ? 'Anunțuri' : t === 'EVENTS' ? 'Evenimente' : 'Documente'}
           </button>
         ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        
        {/* USERS TAB */}
        {tab === 'USERS' && (
          <div>
            <div className="flex justify-between mb-4">
               <h3 className="font-bold text-lg">Total: {users.length}</h3>
               <Button onClick={() => handleExportCSV(users, 'utilizatori.csv')} className="text-sm py-1"><Download className="w-4 h-4 mr-1 inline"/> Export CSV</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {users.map(u => (
                 <div key={u.id} className="bg-white rounded-lg shadow p-3 flex gap-3 border border-gray-200">
                    <div className="w-1/3">
                      <img 
                        src={u.avatarUrl || 'https://via.placeholder.com/150'} 
                        className="w-full h-24 object-cover rounded-md bg-gray-100" 
                        alt="Avatar" 
                      />
                    </div>
                    <div className="w-2/3 text-sm">
                       <div className="font-bold text-gray-800 truncate">{u.firstName} {u.lastName}</div>
                       <div className="text-gray-500 truncate">{u.email}</div>
                       <div className="mt-1 text-xs bg-gray-100 p-1 rounded inline-block">{u.role || 'user'}</div>
                       <div className="mt-1 truncate text-xs text-gray-400">{u.city}, {u.country}</div>
                       
                       {/* Super Admin Actions */}
                       {user.role === 'super_admin' && (
                         <div className="mt-2 flex gap-2">
                            <button className="text-blue-600 text-xs hover:underline">Editează Rol</button>
                         </div>
                       )}
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {/* CMS TABS (ANNOUNCEMENTS / EVENTS) */}
        {(tab === 'ANNOUNCEMENTS' || tab === 'EVENTS') && (
           <div>
              <div className="flex justify-between mb-4">
                 <Button onClick={() => { setEditingItem({}); setIsPreviewMode(false); setIsEditModalOpen(true); }}><Plus className="w-4 h-4 mr-1 inline"/> Adaugă Nou</Button>
              </div>
              <div className="space-y-3">
                 {(tab === 'ANNOUNCEMENTS' ? announcements : events).map((item: any) => (
                    <div key={item.id} className="bg-white p-3 rounded-lg shadow border flex justify-between items-center">
                       <div className="flex items-center gap-3">
                          <img src={item.image_url || item.imageUrl} className="w-12 h-12 object-cover rounded bg-gray-200" alt=""/>
                          <div>
                             <div className="font-bold text-sm">{item.title}</div>
                             <div className="text-xs text-gray-500">{item.date} {item.end_date || item.endDate ? `- ${item.end_date || item.endDate}` : ''} • {item.active ? 'Activ' : 'Inactiv'}</div>
                          </div>
                       </div>
                       <div className="flex gap-2">
                          <button onClick={() => { setEditingItem(item); setIsPreviewMode(false); setIsEditModalOpen(true); }} className="p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"><Edit className="w-4 h-4"/></button>
                          {(user.role === 'super_admin' || user.role === 'admin') && (
                             <button onClick={() => deleteItem(tab === 'ANNOUNCEMENTS' ? 'announcements' : 'events', item.id)} className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100"><Trash2 className="w-4 h-4"/></button>
                          )}
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {/* DOCUMENTS TAB */}
        {tab === 'DOCUMENTS' && (
           <div>
              <div className="flex justify-between mb-4">
                 <h3 className="font-bold">Total: {docs.length}</h3>
                 <Button onClick={() => handleExportCSV(docs, 'documente.csv')} className="text-sm py-1"><Download className="w-4 h-4 mr-1 inline"/> CSV</Button>
              </div>
              <div className="space-y-3">
                 {docs.map(d => (
                    <div key={d.id} className="bg-white p-3 rounded-lg shadow border">
                       <div className="flex justify-between">
                          <div>
                             <div className="font-bold text-sm text-ro-blue">{d.file_name}</div>
                             <div className="text-xs text-gray-500">Utilizator: {d.user_email}</div>
                             <div className="text-xs text-gray-400">{new Date(d.created_at).toLocaleString()}</div>
                          </div>
                          <a 
                             href={d.file_url} // Ensure public access or signed URL logic
                             target="_blank" 
                             rel="noreferrer" 
                             className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200 font-bold"
                          >
                             <Download className="w-3 h-3 mr-1"/> Descarcă
                          </a>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}
      </div>

      {/* Edit/Preview Modal for CMS */}
      <Modal 
         isOpen={isEditModalOpen} 
         onClose={() => setIsEditModalOpen(false)} 
         title={isPreviewMode ? 'Previzualizare' : (editingItem?.id ? 'Editează' : 'Adaugă Nou')}
      >
         {isPreviewMode ? renderPreview() : renderEditForm()}
      </Modal>

    </div>
  );
};

// --- SETTINGS SCREEN ---
const SettingsScreen = ({ textSize, setTextSize, theme, setTheme, setView, notifications, setNotifications, t }: { textSize: TextSize, setTextSize: (s: TextSize) => void, theme: AppTheme, setTheme: (t: AppTheme) => void, setView: (v: ViewState) => void, notifications: NotificationPreferences, setNotifications: (n: NotificationPreferences) => void, t: (k: string) => string }) => {
  return (
    <div className="p-4 space-y-6">
       <h2 className="text-2xl font-bold text-ro-blue mb-4">{t('settings_title')}</h2>
       
       {/* Notifications */}
       <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
         <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><Bell className="w-4 h-4" /> {t('settings_notifications')}</h3>
         <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-gray-700">Activează notificări</span>
              <input type="checkbox" checked={notifications.enabled} onChange={e => setNotifications({...notifications, enabled: e.target.checked})} className="toggle" />
            </label>
            {notifications.enabled && (
               <div className="pl-4 space-y-2 border-l-2 border-gray-100 ml-1">
                  <label className="flex items-center gap-2 text-sm text-gray-600"><input type="checkbox" checked={notifications.announcements} onChange={e => setNotifications({...notifications, announcements: e.target.checked})} /> Anunțuri</label>
                  <label className="flex items-center gap-2 text-sm text-gray-600"><input type="checkbox" checked={notifications.events} onChange={e => setNotifications({...notifications, events: e.target.checked})} /> Evenimente</label>
               </div>
            )}
         </div>
       </div>

       {/* Appearance */}
       <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><Monitor className="w-4 h-4" /> Aspect</h3>
          
          <div className="mb-4">
             <label className="block text-sm text-gray-600 mb-2">{t('settings_text_size')}</label>
             <div className="flex bg-gray-100 rounded-lg p-1">
                {[TextSize.SMALL, TextSize.MEDIUM, TextSize.LARGE].map((s) => (
                   <button key={s} onClick={() => setTextSize(s)} className={`flex-1 py-1 rounded-md text-sm transition-colors ${textSize === s ? 'bg-white shadow text-ro-blue font-bold' : 'text-gray-500'}`}>
                      {s === TextSize.SMALL ? 'A' : s === TextSize.MEDIUM ? 'A+' : 'A++'}
                   </button>
                ))}
             </div>
          </div>

          <div>
             <label className="block text-sm text-gray-600 mb-2">{t('settings_theme')}</label>
             <div className="flex bg-gray-100 rounded-lg p-1">
                {[AppTheme.LIGHT, AppTheme.DARK, AppTheme.AUTO].map((th) => (
                   <button key={th} onClick={() => setTheme(th)} className={`flex-1 py-1 rounded-md text-sm transition-colors flex justify-center items-center gap-1 ${theme === th ? 'bg-white shadow text-ro-blue font-bold' : 'text-gray-500'}`}>
                      {th === AppTheme.LIGHT ? <Sun className="w-3 h-3"/> : th === AppTheme.DARK ? <Moon className="w-3 h-3"/> : <Monitor className="w-3 h-3"/>}
                      <span className="capitalize">{th}</span>
                   </button>
                ))}
             </div>
          </div>
       </div>
       
       {/* Contact */}
       <button className="w-full py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium flex items-center justify-center gap-2 shadow-sm hover:bg-gray-50">
          <Mail className="w-4 h-4" /> {t('settings_contact')}
       </button>
    </div>
  );
};

// --- PROFILE SCREEN ---
const ProfileScreen = ({ user, setUser, onLogout, t }: { user: UserProfile, setUser: (u: UserProfile) => void, onLogout: () => void, t: (k: string) => string }) => {
   const [isEditing, setIsEditing] = useState(false);
   const [tempUser, setTempUser] = useState(user);
   const [uploadingAvatar, setUploadingAvatar] = useState(false);
   const [showCamera, setShowCamera] = useState(false);
   const videoRef = useRef<HTMLVideoElement>(null);

   // Camera Logic
   const startCamera = async () => {
      setShowCamera(true);
      try {
         const stream = await navigator.mediaDevices.getUserMedia({ video: true });
         if (videoRef.current) videoRef.current.srcObject = stream;
      } catch(e) { alert('Nu am putut accesa camera.'); setShowCamera(false); }
   };

   const takePhoto = () => {
      if (videoRef.current) {
         const canvas = document.createElement('canvas');
         canvas.width = videoRef.current.videoWidth;
         canvas.height = videoRef.current.videoHeight;
         canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
         const dataUrl = canvas.toDataURL('image/jpeg');
         uploadAvatarFromDataUrl(dataUrl);
         
         // Stop stream
         const stream = videoRef.current.srcObject as MediaStream;
         stream?.getTracks().forEach(t => t.stop());
         setShowCamera(false);
      }
   };

   const uploadAvatarFromDataUrl = async (dataUrl: string) => {
      // Convert base64 to blob
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
      handleAvatarUpload(file);
   };

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
          // Auto save avatar
          await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id);
          setUser({...user, avatarUrl: publicUrl});
       } catch (e:any) {
          alert('Eroare upload: ' + e.message);
       } finally {
          setUploadingAvatar(false);
       }
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
                updated_at: new Date(),
             };
             // Using onConflict to merge updates efficiently
             const { error } = await supabase.from('profiles').upsert({ id: authUser.id, ...updates }, { onConflict: 'id' });
             
             if (error) {
                const msg = error.message || JSON.stringify(error);
                if (error.code === 'PGRST204') {
                   throw new Error("Eroare de structură bază de date: Coloana lipsește. Vă rugăm rulați scriptul SQL de actualizare.");
                }
                throw new Error(msg);
             }
        }
        setUser(tempUser);
        setIsEditing(false);
        alert(t('profile_success'));
      } catch (e: any) {
        console.error("Save Error:", e);
        alert(`${t('profile_error')} ${e.message || e}`);
      }
   };

   const handleDeleteAccount = async () => {
      if (window.confirm('Sigur doriți să ștergeți contul? Această acțiune va șterge profilul dumneavoastră.')) {
         try {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (authUser) {
               const { error } = await supabase.from('profiles').delete().eq('id', authUser.id);
               if(error) throw error;
               onLogout(); // Will trigger sign out
            }
         } catch (e: any) {
            alert('Eroare la ștergere: ' + e.message);
         }
      }
   };

   return (
     <div className="p-4 pb-24">
        <div className="flex flex-col items-center mb-6">
           <div className="relative group">
               <div className="w-24 h-24 bg-gray-200 rounded-full mb-3 flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                  {user.avatarUrl ? <img src={user.avatarUrl} className="w-full h-full object-cover" alt="Profile"/> : <User className="w-10 h-10 text-gray-400" />}
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
           <p className="text-gray-500 text-sm">{user.email}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
           <div className="flex justify-between items-center p-4 border-b bg-gray-50">
              <h3 className="font-bold text-gray-700">Detalii Personale</h3>
              {!isEditing ? (
                 <button onClick={() => { setTempUser(user); setIsEditing(true); }} className="text-ro-blue text-sm font-bold flex items-center gap-1"><Edit className="w-3 h-3"/> {t('profile_edit')}</button>
              ) : (
                 <div className="flex gap-2">
                    <button onClick={() => setIsEditing(false)} className="text-gray-500 text-sm font-medium">Anulează</button>
                    <button onClick={handleSave} className="text-green-600 text-sm font-bold flex items-center gap-1"><Save className="w-3 h-3"/> {t('profile_save')}</button>
                 </div>
              )}
           </div>
           <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="text-xs text-gray-500 block mb-1">{t('lbl_firstname')}</label>
                    <input disabled={!isEditing} value={isEditing ? tempUser.firstName : user.firstName} onChange={e => setTempUser({...tempUser, firstName: e.target.value})} className={`w-full p-2 rounded border ${isEditing ? 'bg-white border-blue-300' : 'bg-gray-50 border-gray-200'}`} />
                 </div>
                 <div>
                    <label className="text-xs text-gray-500 block mb-1">{t('lbl_lastname')}</label>
                    <input disabled={!isEditing} value={isEditing ? tempUser.lastName : user.lastName} onChange={e => setTempUser({...tempUser, lastName: e.target.value})} className={`w-full p-2 rounded border ${isEditing ? 'bg-white border-blue-300' : 'bg-gray-50 border-gray-200'}`} />
                 </div>
                 
                 <div>
                    <label className="text-xs text-gray-500 block mb-1">{t('lbl_username')}</label>
                    <input disabled={!isEditing} value={isEditing ? tempUser.username : user.username} onChange={e => setTempUser({...tempUser, username: e.target.value})} className={`w-full p-2 rounded border ${isEditing ? 'bg-white border-blue-300' : 'bg-gray-50 border-gray-200'}`} />
                 </div>

                 <div>
                    <label className="text-xs text-gray-500 block mb-1">{t('lbl_phone')}</label>
                    <input disabled={!isEditing} value={isEditing ? tempUser.phone : user.phone} onChange={e => setTempUser({...tempUser, phone: e.target.value})} className={`w-full p-2 rounded border ${isEditing ? 'bg-white border-blue-300' : 'bg-gray-50 border-gray-200'}`} />
                 </div>
                 
                 <div>
                    <label className="text-xs text-gray-500 block mb-1">{t('lbl_address')}</label>
                    <input disabled={!isEditing} value={isEditing ? tempUser.address : user.address} onChange={e => setTempUser({...tempUser, address: e.target.value})} className={`w-full p-2 rounded border ${isEditing ? 'bg-white border-blue-300' : 'bg-gray-50 border-gray-200'}`} />
                 </div>

                 <div>
                    <label className="text-xs text-gray-500 block mb-1">{t('lbl_city')}</label>
                    <input disabled={!isEditing} value={isEditing ? tempUser.city : user.city} onChange={e => setTempUser({...tempUser, city: e.target.value})} className={`w-full p-2 rounded border ${isEditing ? 'bg-white border-blue-300' : 'bg-gray-50 border-gray-200'}`} />
                 </div>

                 <div>
                    <label className="text-xs text-gray-500 block mb-1">{t('lbl_county')}</label>
                    <input disabled={!isEditing} value={isEditing ? tempUser.county : user.county} onChange={e => setTempUser({...tempUser, county: e.target.value})} className={`w-full p-2 rounded border ${isEditing ? 'bg-white border-blue-300' : 'bg-gray-50 border-gray-200'}`} />
                 </div>

                 <div>
                    <label className="text-xs text-gray-500 block mb-1">{t('lbl_postal')}</label>
                    <input disabled={!isEditing} value={isEditing ? tempUser.postCode : user.postCode} onChange={e => setTempUser({...tempUser, postCode: e.target.value})} className={`w-full p-2 rounded border ${isEditing ? 'bg-white border-blue-300' : 'bg-gray-50 border-gray-200'}`} />
                 </div>

                 <div>
                    <label className="text-xs text-gray-500 block mb-1">{t('lbl_country')}</label>
                    <input disabled={!isEditing} value={isEditing ? tempUser.country : user.country} onChange={e => setTempUser({...tempUser, country: e.target.value})} className={`w-full p-2 rounded border ${isEditing ? 'bg-white border-blue-300' : 'bg-gray-50 border-gray-200'}`} />
                 </div>
              </div>
           </div>
        </div>

        <div className="mt-6 space-y-3">
           <Button variant="ghost" fullWidth onClick={onLogout} className="text-blue-600 hover:bg-blue-50 border border-blue-100 flex items-center justify-center gap-2">
              <LogOut className="w-4 h-4" /> {t('profile_logout')}
           </Button>
           
           <Button variant="danger" fullWidth onClick={handleDeleteAccount} className="flex items-center justify-center gap-2 bg-red-50 text-red-600 border border-red-100 hover:bg-red-100">
               <Trash2 className="w-4 h-4" /> {t('profile_delete')}
           </Button>
        </div>
     </div>
   );
};

// --- MAIN APP (Updated with Admin Logic) ---

const App = () => {
  // State
  const [view, setView] = useState<ViewState>('SPLASH');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [language, setLanguage] = useState<LanguageCode>('RO');
  const [textSize, setTextSize] = useState<TextSize>(TextSize.MEDIUM);
  const [theme, setTheme] = useState<AppTheme>(AppTheme.AUTO);
  const [user, setUser] = useState<UserProfile>({
    firstName: '', lastName: '', email: '', phone: '', address: '', city: '', country: '', county: '', username: '', avatarUrl: null, postCode: '', role: 'user'
  });
  
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationPreferences>({
    enabled: false, announcements: true, events: true, requests: true
  });
  
  // CMS Data State
  const [cmsAnnouncements, setCmsAnnouncements] = useState<Announcement[]>([]);
  const [cmsEvents, setCmsEvents] = useState<EventItem[]>([]);

  const t = useTranslation(language);

  // Fetch CMS Data on Load
  useEffect(() => {
     const fetchContent = async () => {
        const { data: ann } = await supabase.from('announcements').select('*').eq('active', true).order('date', {ascending: false});
        if(ann && ann.length > 0) {
           // Map DB columns to Frontend Interface
           const mappedAnn = ann.map((a: any) => ({
             ...a,
             imageUrl: a.image_url,
             endDate: a.end_date
           }));
           setCmsAnnouncements(mappedAnn);
        } else setCmsAnnouncements(MOCK_ANNOUNCEMENTS);

        const { data: ev } = await supabase.from('events').select('*').eq('active', true).order('date', {ascending: false});
        if(ev && ev.length > 0) {
           const mappedEv = ev.map((e: any) => ({
              ...e,
              imageUrl: e.image_url,
              endDate: e.end_date
           }));
           setCmsEvents(mappedEv);
        } else setCmsEvents(MOCK_EVENTS);
     };
     fetchContent();
  }, []);

  // Auth Listener
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setIsLoggedIn(true);
        if (!user.email || user.email !== session.user.email) {
          loadUserProfile(session.user.id, session.user.email!);
        }
        if (view === 'AUTH' || view === 'SPLASH') setView('HOME');
      } else {
        setIsLoggedIn(false);
        setUser({ firstName: '', lastName: '', email: '', phone: '', address: '', city: '', country: '', county: '', username: '', avatarUrl: null, postCode: '', role: 'user' });
        // Redirect to Auth if not Splash
        if (view !== 'SPLASH') setView('AUTH');
      }
    });
    return () => { authListener.subscription.unsubscribe(); };
  }, [view, user.email]);

  const loadUserProfile = async (userId: string, email: string) => {
    try {
        const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
        if (data) {
           setUser({
              firstName: data.first_name || '',
              lastName: data.last_name || '',
              email: email,
              phone: data.phone || '',
              address: data.address || '',
              city: data.city || '',
              country: data.country || '',
              county: data.county || '',
              postCode: data.post_code || '',
              username: data.username || '',
              avatarUrl: data.avatar_url || null,
              role: (data.role as UserRole) || 'user'
           });
        }
    } catch (e) { console.error(e); }
  };

  const handleSplashFinish = () => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setView('HOME'); else setView('AUTH');
    });
  };

  const renderContent = () => {
    switch (view) {
      case 'AUTH': return <AuthScreen onLogin={() => {}} t={t} />;
      case 'HOME': return <HomeScreen t={t} announcements={cmsAnnouncements} events={cmsEvents} />;
      case 'SERVICES': return <ServicesScreen t={t} />;
      case 'SEND_DOCS': return <SendDocsScreen user={user} t={t} />;
      case 'EVENTS_LIST': return <EventsScreen t={t} events={cmsEvents} />;
      case 'FAQ': return <FaqScreen t={t} />;
      case 'SETTINGS': return <SettingsScreen textSize={textSize} setTextSize={setTextSize} theme={theme} setTheme={setTheme} setView={setView} notifications={notifications} setNotifications={setNotifications} t={t} />;
      case 'PROFILE': return (
        <ProfileScreen 
          user={user} 
          setUser={setUser} 
          onLogout={async () => { 
             // Call sign out; listener handles redirect
             await supabase.auth.signOut(); 
          }} 
          t={t} 
        />
      );
      case 'ADMIN': return <AdminScreen user={user} onClose={() => setView('HOME')} />;
      default: return <div className="p-4">Loading...</div>;
    }
  };

  const textSizeClass = textSize;
  const themeClass = theme === AppTheme.DARK ? 'bg-gray-900 text-white' : 'bg-consular-bg text-gray-800';

  if (view === 'SPLASH') return <SplashScreen onFinish={handleSplashFinish} />;

  return (
    <div className={`min-h-screen flex flex-col font-sans ${textSizeClass} ${themeClass} relative`}>
      {view !== 'AUTH' && view !== 'ADMIN' && (
        <Header 
          currentLang={language} 
          setLang={setLanguage} 
          onProfileClick={() => setView('PROFILE')}
          onSettingsClick={() => setView('SETTINGS')}
          onSearchClick={() => setSearchOpen(true)}
          onAdminClick={() => setView('ADMIN')}
          isLoggedIn={isLoggedIn}
          userRole={user.role}
        />
      )}
      
      <main className={`flex-1 overflow-y-auto ${view === 'ADMIN' ? '' : 'pb-20'} ${view === 'AUTH' ? 'pb-0' : ''}`}>
        {renderContent()}
      </main>

      {view !== 'AUTH' && <BottomNav currentView={view} setView={setView} t={t} />}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} onNavigate={setView} t={t} />
    </div>
  );
};

// ... (AuthScreen, SettingsScreen, etc. remain mostly same, minor tweaks below)

const AuthScreen = ({ onLogin, t }: { onLogin: (uid: string, email: string) => void, t: (k:string)=>string }) => {
  // ... (Existing logic, no change needed)
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
          email, password,
          options: { data: { first_name: firstName, last_name: lastName, country: country } }
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (error: any) { alert(error.message); } finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-consular-bg">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
         <div className="bg-gradient-to-r from-blue-700 via-yellow-500 to-red-600 h-2 opacity-80" />
         <div className="p-8">
            <h2 className="text-3xl font-bold text-ro-blue mb-2 text-center">ConsulaRO</h2>
            <div className="flex mb-6 border-b">
               <button className={`flex-1 py-2 font-medium ${mode === 'LOGIN' ? 'text-ro-blue border-b-2' : 'text-gray-400'}`} onClick={() => setMode('LOGIN')}>{t('auth_login')}</button>
               <button className={`flex-1 py-2 font-medium ${mode === 'REGISTER' ? 'text-ro-blue border-b-2' : 'text-gray-400'}`} onClick={() => setMode('REGISTER')}>{t('auth_register')}</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
               {mode === 'REGISTER' && (
                 <>
                   <div className="grid grid-cols-2 gap-4"><input required placeholder="Nume" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full px-4 py-2 border rounded-lg"/><input required placeholder="Prenume" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full px-4 py-2 border rounded-lg"/></div>
                   <input required placeholder="Țara" value={country} onChange={e => setCountry(e.target.value)} className="w-full px-4 py-2 border rounded-lg"/>
                 </>
               )}
               <input required type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-lg"/>
               <input required type="password" placeholder="Parola" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-lg"/>
               <Button type="submit" fullWidth disabled={loading}>{loading ? '...' : (mode === 'LOGIN' ? t('btn_login') : t('btn_create'))}</Button>
            </form>
         </div>
      </div>
    </div>
  );
};

const HomeScreen = ({ t, announcements, events }: { t: (k:string)=>string, announcements: any[], events: any[] }) => {
  const [appModalOpen, setAppModalOpen] = useState(false);
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [eventsModalOpen, setEventsModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // Helper for Carousel (same as before but accepts props)
  const Carousel = ({ title, items, type, onClickAll }: any) => {
     const scrollRef = useRef<HTMLDivElement>(null);
     useEffect(() => {
        const interval = setInterval(() => { if (scrollRef.current) scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' }); }, 15000);
        return () => clearInterval(interval);
     }, []);
     return (
        <div className="mb-8">
           <div className="flex justify-between items-center px-4 mb-3">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                 {type === 'announcement' ? <Bell className="w-5 h-5 text-ro-red" /> : <Calendar className="w-5 h-5 text-ro-blue" />}
                 {title}
              </h3>
              <button onClick={onClickAll} className="text-sm text-ro-blue font-medium hover:underline">{t('view_all')}</button>
           </div>
           <div ref={scrollRef} className="flex overflow-x-auto px-4 pb-4 gap-4 snap-x hide-scrollbar">
              {items.slice(0, 5).map((item: any) => (
                 <div key={item.id} onClick={() => type === 'announcement' ? setSelectedAnnouncement(item) : setSelectedEvent(item)} className="flex-shrink-0 w-[85vw] max-w-sm bg-white rounded-xl shadow-md snap-center active:scale-95 transition-transform cursor-pointer overflow-hidden border border-gray-100 flex h-32">
                    <div className="w-1/3 relative h-full"><img src={item.imageUrl || item.image_url} alt="" className="w-full h-full object-cover" /></div>
                    <div className="w-2/3 p-3 flex flex-col justify-center">
                       <h4 className="font-bold text-gray-800 line-clamp-2 text-sm mb-1">{item.title}</h4>
                       <div className="text-xs text-ro-red font-semibold mb-1">{item.date} {item.endDate ? `- ${item.endDate}` : ''}</div>
                       <p className="text-xs text-gray-500 line-clamp-2 leading-tight">{item.description}</p>
                    </div>
                 </div>
              ))}
           </div>
        </div>
     );
  };

  return (
    <div className="py-6">
       <div className="px-4 mb-8"><div onClick={() => setAppModalOpen(true)} className="bg-white rounded-2xl shadow-lg p-4 flex items-center gap-4 cursor-pointer border border-blue-100"><div className="w-1/3 flex justify-center"><img src="https://upload.wikimedia.org/wikipedia/commons/7/70/Coat_of_arms_of_Romania.svg" className="w-24 h-24 object-contain opacity-90" alt="MAE"/></div><div className="w-2/3"><h2 className="text-lg font-bold text-gray-800">{t('about_app')}</h2><p className="text-sm text-gray-600 line-clamp-2">{APP_DESCRIPTION_SHORT}</p></div></div></div>

       <Carousel title={t('title_announcements')} items={announcements} type="announcement" onClickAll={() => setAnnouncementModalOpen(true)} />
       <Carousel title={t('title_events')} items={events} type="event" onClickAll={() => setEventsModalOpen(true)} />

       <Modal isOpen={appModalOpen} onClose={() => setAppModalOpen(false)} title={t('about_app')}>
          <div className="text-gray-700 leading-relaxed text-justify p-2">{APP_DESCRIPTION_FULL}</div>
       </Modal>
       
       {/* List Modals */}
       <Modal isOpen={announcementModalOpen} onClose={() => setAnnouncementModalOpen(false)} title={t('title_announcements')}>
          <div className="space-y-4">{announcements.map((item: any) => (<div key={item.id} onClick={() => setSelectedAnnouncement(item)} className="bg-white border rounded-lg p-2 flex gap-3 shadow-sm cursor-pointer h-24 overflow-hidden"><img src={item.imageUrl || item.image_url} className="w-1/3 object-cover rounded-md"/><div className="w-2/3"><h4 className="font-bold text-sm line-clamp-1">{item.title}</h4><p className="text-xs text-gray-500 line-clamp-2">{item.description}</p></div></div>))}</div>
       </Modal>

       <Modal isOpen={eventsModalOpen} onClose={() => setEventsModalOpen(false)} title={t('title_events')}>
          <div className="space-y-4">{events.map((item: any) => (<div key={item.id} onClick={() => setSelectedEvent(item)} className="bg-white border rounded-lg p-2 flex gap-3 shadow-sm cursor-pointer h-24 overflow-hidden"><img src={item.imageUrl || item.image_url} className="w-1/3 object-cover rounded-md"/><div className="w-2/3"><h4 className="font-bold text-sm line-clamp-1">{item.title}</h4><p className="text-xs text-gray-500">{item.location}</p><span className="text-xs text-blue-600 font-medium block mt-1">{item.date}</span></div></div>))}</div>
       </Modal>

       <DetailModal isOpen={!!selectedAnnouncement} onClose={() => setSelectedAnnouncement(null)} title="Detalii" imageUrl={selectedAnnouncement?.imageUrl || selectedAnnouncement?.image_url}>
          {selectedAnnouncement && <><h2 className="text-xl font-bold text-ro-blue mb-2">{selectedAnnouncement.title}</h2><div className="text-sm text-gray-500 mb-4">{selectedAnnouncement.date} {selectedAnnouncement.endDate ? `- ${selectedAnnouncement.endDate}` : ''}</div><p className="text-gray-700 whitespace-pre-line">{selectedAnnouncement.description}</p></>}
       </DetailModal>

       <DetailModal isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)} title="Detalii" imageUrl={selectedEvent?.imageUrl || selectedEvent?.image_url}>
          {selectedEvent && <><h2 className="text-xl font-bold text-ro-blue mb-1">{selectedEvent.title}</h2><div className="text-sm text-ro-red font-semibold mb-2">{selectedEvent.location} • {selectedEvent.date} {selectedEvent.endDate ? `- ${selectedEvent.endDate}` : ''}</div><p className="text-gray-700 whitespace-pre-line">{selectedEvent.description}</p></>}
       </DetailModal>
    </div>
  );
};

const EventsScreen = ({ t, events }: { t: (k:string)=>string, events: any[] }) => {
   const [selectedEvent, setSelectedEvent] = useState<any>(null);
   return (
     <div className="p-4">
       <h2 className="text-2xl font-bold text-ro-blue mb-6 text-center">{t('nav_events')}</h2>
       <div className="space-y-4">
         {events.map((item: any) => (
           <div key={item.id} onClick={() => setSelectedEvent(item)} className="bg-white rounded-xl shadow-md cursor-pointer flex h-32 overflow-hidden border border-gray-100">
             <div className="w-1/3 relative h-full"><img src={item.imageUrl || item.image_url} className="w-full h-full object-cover" /></div>
             <div className="w-2/3 p-3 flex flex-col justify-center"><h4 className="font-bold text-gray-800 line-clamp-1 mb-1">{item.title}</h4><div className="flex items-center text-xs text-ro-red font-semibold mb-2"><Calendar className="w-3 h-3 mr-1" />{item.date}</div><p className="text-xs text-gray-500 line-clamp-3 leading-snug">{item.description}</p></div>
           </div>
         ))}
       </div>
       <DetailModal isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)} title="Detalii Eveniment" imageUrl={selectedEvent?.imageUrl || selectedEvent?.image_url}>
         {selectedEvent && <><h2 className="text-xl font-bold text-ro-blue mb-1">{selectedEvent.title}</h2><div className="text-sm text-ro-red font-semibold mb-2">{selectedEvent.location} • {selectedEvent.date} {selectedEvent.endDate ? `- ${selectedEvent.endDate}` : ''}</div><p className="text-gray-700 whitespace-pre-line">{selectedEvent.description}</p></>}
       </DetailModal>
     </div>
   );
};

// ... (ServicesScreen, FaqScreen, ProfileScreen remain mostly same, minor tweaks for consistency)
const ServicesScreen = ({ t }: { t: (k:string)=>string }) => {
    // Same implementation as before
    const [selectedService, setSelectedService] = useState<ServiceCategory | null>(null);
    return (
      <div className="p-4"><h2 className="text-2xl font-bold text-ro-blue mb-6 text-center">{t('services_title')}</h2><div className="grid grid-cols-1 gap-4">{SERVICE_CATEGORIES.map((service) => { const Icon = IconMap[service.iconName] || FileText; return (<div key={service.id} onClick={() => setSelectedService(service)} className="bg-white rounded-xl shadow-md p-4 flex items-center cursor-pointer border-l-4 border-ro-blue"><div className="w-1/4 flex justify-center border-r border-gray-100 pr-4"><Icon className="w-8 h-8 text-ro-blue" /></div><div className="w-3/4 pl-4"><h3 className="text-lg font-bold text-gray-800">{service.title}</h3></div></div>); })}</div><Modal isOpen={!!selectedService} onClose={() => setSelectedService(null)} title={selectedService?.title}>{selectedService && (<div className="space-y-2"><p className="text-sm text-gray-500 mb-4">Selectați serviciul dorit pentru a fi redirecționat către portalul E-Consulat.</p>{selectedService.subServices.map((sub, idx) => (<a href={sub.url} target="_blank" rel="noreferrer" key={idx} className="block p-3 bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 text-ro-blue font-medium transition-colors flex justify-between items-center">{sub.name}<ChevronRight className="w-4 h-4" /></a>))}</div>)}</Modal></div>
    );
};
const FaqScreen = ({ t }: { t: (k:string)=>string }) => {
    // Same implementation as before
    return (<div className="p-4"><h2 className="text-2xl font-bold text-ro-blue mb-6 text-center">{t('faq_title')}</h2><div className="space-y-6">{FAQ_DATA.map((category) => (<div key={category.id} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100"><h3 className="text-lg font-bold text-ro-red mb-3 border-b pb-2">{category.title}</h3><div className="space-y-3">{category.questions.map((q, idx) => (<details key={idx} className="group"><summary className="flex justify-between items-center font-medium cursor-pointer list-none text-gray-800 hover:text-ro-blue"><span>{q.question}</span><span className="transition group-open:rotate-180"><ChevronRight className="w-4 h-4" /></span></summary><div className="text-gray-600 mt-2 text-sm pl-2 border-l-2 border-gray-200">{q.answer}</div></details>))}</div></div>))}</div></div>);
};

const SendDocsScreen = ({ user, t }: { user: UserProfile, t: (k:string)=>string }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'image' | 'pdf' | null>(null);
  const [uploading, setUploading] = useState(false);

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

  const handleSend = async () => {
    if (!file || !user.id) return;
    setUploading(true);
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        // 1. Upload file to 'documents' bucket
        const { error: uploadError } = await supabase.storage.from('documents').upload(filePath, file);
        if (uploadError) throw uploadError;

        // 2. Get Public URL
        const { data: { publicUrl } } = supabase.storage.from('documents').getPublicUrl(filePath);

        // 3. Insert record into DB
        const { error: dbError } = await supabase.from('user_documents').insert({
            user_id: user.id,
            user_email: user.email,
            user_name: `${user.firstName} ${user.lastName}`,
            file_name: file.name,
            file_url: publicUrl,
            file_type: fileType
        });
        if (dbError) throw dbError;

        alert('Document trimis cu succes!');
        setModalOpen(false);
        setFile(null);
        setPreview(null);
    } catch (e: any) {
        alert('Eroare la trimitere: ' + e.message);
    } finally {
        setUploading(false);
    }
  };

  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-center mb-8"><Send className="w-16 h-16 text-ro-blue mx-auto mb-4" /><h2 className="text-2xl font-bold text-gray-800">{t('send_docs_title')}</h2><p className="text-gray-500 mt-2">{t('send_docs_desc')}</p></div>
      <div className="w-full max-w-sm"><label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-ro-blue rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors"><div className="flex flex-col items-center justify-center pt-5 pb-6"><ImageIcon className="w-8 h-8 text-ro-blue mb-2" /><p className="text-sm text-gray-500 font-semibold">{t('upload_text')}</p></div><input type="file" className="hidden" accept="image/*,application/pdf" onChange={handleFileChange} /></label></div>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Confirmare Trimitere">
        <div className="space-y-4">
          <div className="bg-gray-100 p-3 rounded text-sm"><p><strong>Nume:</strong> {user.firstName} {user.lastName}</p><p><strong>Email:</strong> {user.email}</p><p><strong>Țara:</strong> {user.country}</p></div>
          <div className="border rounded p-2 flex flex-col items-center justify-center bg-gray-50"><p className="text-xs text-gray-500 mb-2 w-full text-left">Previzualizare:</p>{fileType === 'image' && preview ? (<img src={preview} className="max-h-40 mx-auto rounded shadow-sm" />) : fileType === 'pdf' ? (<div className="flex flex-col items-center text-ro-red py-4"><FileText className="w-12 h-12 mb-2" /><span className="text-sm font-bold text-gray-700">{file?.name}</span><span className="text-xs text-gray-500">Document PDF</span></div>) : (<div className="py-4 text-gray-400">Previzualizare indisponibilă</div>)}</div>
          <div className="text-xs text-gray-500">Prin trimitere, sunteți de acord cu prelucrarea datelor cu caracter personal.</div>
          <Button fullWidth onClick={handleSend} disabled={uploading}>{uploading ? 'Se trimite...' : 'Trimite către Consulat'}</Button>
        </div>
      </Modal>
    </div>
  );
};

export default App;
