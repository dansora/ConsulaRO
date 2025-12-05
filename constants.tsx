
import React from 'react';
import { Announcement, EventItem, FaqCategory, LanguageCode, ServiceCategory } from './types';
import { 
  FileText, Users, Flag, Globe, FileCheck, Mail, BookOpen, UserCheck, MoreHorizontal 
} from 'lucide-react';

export const LANGUAGES: { code: LanguageCode; label: string }[] = [
  { code: 'RO', label: 'Română' },
  { code: 'EN', label: 'English' },
  { code: 'IT', label: 'Italiano' },
  { code: 'ES', label: 'Español' },
  { code: 'FR', label: 'Français' },
  { code: 'DE', label: 'Deutsch' },
  { code: 'PT', label: 'Português' },
  { code: 'HU', label: 'Magyar' },
  { code: 'TR', label: 'Türkçe' },
];

// Simple Translation Dictionary
export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  RO: {
    welcome: "Bine ai venit!",
    auth_login: "Autentificare",
    auth_register: "Înregistrare",
    btn_login: "Intră în cont",
    btn_create: "Creează cont",
    nav_home: "Acasă",
    nav_services: "Servicii",
    nav_send: "Trimite",
    nav_events: "Evenimente",
    nav_faq: "Întrebări",
    title_announcements: "Anunțuri Importante",
    title_events: "Evenimente Active",
    view_all: "Vezi toate",
    about_app: "Despre ConsulaRO",
    search_placeholder: "Caută servicii, știri, evenimente...",
    no_results: "Nu am găsit rezultate pentru",
    settings_title: "Setări",
    settings_notifications: "Notificări",
    settings_text_size: "Dimensiune Text",
    settings_theme: "Temă",
    settings_contact: "Contactează Echipa",
    profile_edit: "Editează Profil",
    profile_save: "Salvează",
    profile_logout: "Delogare",
    profile_delete: "Șterge Contul",
    profile_success: "Profilul a fost salvat cu succes!",
    profile_error: "A apărut o eroare la salvarea profilului.",
    lbl_firstname: "Prenume",
    lbl_lastname: "Nume de familie",
    lbl_username: "Nume de utilizator",
    lbl_phone: "Telefon",
    lbl_address: "Adresă",
    lbl_city: "Oraș",
    lbl_county: "Județ/Regiune",
    lbl_country: "Țară",
    lbl_postal: "Cod Poștal",
    cam_start: "Deschide Camera",
    cam_take: "Fă Poză",
    cam_cancel: "Anulează",
    send_docs_title: "Trimite Documente",
    send_docs_desc: "Trimite rapid copii ale documentelor către consulatul tău.",
    upload_text: "Apasă pentru încărcare",
    services_title: "Servicii Consulare",
    faq_title: "Întrebări Frecvente"
  },
  EN: {
    welcome: "Welcome!",
    auth_login: "Login",
    auth_register: "Register",
    btn_login: "Sign In",
    btn_create: "Create Account",
    nav_home: "Home",
    nav_services: "Services",
    nav_send: "Send",
    nav_events: "Events",
    nav_faq: "FAQ",
    title_announcements: "Important Announcements",
    title_events: "Active Events",
    view_all: "View all",
    about_app: "About ConsulaRO",
    search_placeholder: "Search services, news, events...",
    no_results: "No results found for",
    settings_title: "Settings",
    settings_notifications: "Notifications",
    settings_text_size: "Text Size",
    settings_theme: "Theme",
    settings_contact: "Contact Team",
    profile_edit: "Edit Profile",
    profile_save: "Save",
    profile_logout: "Logout",
    profile_delete: "Delete Account",
    profile_success: "Profile saved successfully!",
    profile_error: "Error saving profile.",
    lbl_firstname: "First Name",
    lbl_lastname: "Last Name",
    lbl_username: "Username",
    lbl_phone: "Phone",
    lbl_address: "Address",
    lbl_city: "City",
    lbl_county: "County/Region",
    lbl_country: "Country",
    lbl_postal: "Postal Code",
    cam_start: "Open Camera",
    cam_take: "Take Photo",
    cam_cancel: "Cancel",
    send_docs_title: "Send Documents",
    send_docs_desc: "Quickly send document copies to your consulate.",
    upload_text: "Tap to upload",
    services_title: "Consular Services",
    faq_title: "Frequently Asked Questions"
  },
  IT: {
    welcome: "Benvenuto!",
    auth_login: "Accedi",
    auth_register: "Registrati",
    btn_login: "Entra",
    btn_create: "Crea Account",
    nav_home: "Home",
    nav_services: "Servizi",
    nav_send: "Invia",
    nav_events: "Eventi",
    nav_faq: "FAQ",
    title_announcements: "Annunci Importanti",
    title_events: "Eventi Attivi",
    view_all: "Vedi tutti",
    about_app: "Su ConsulaRO",
    search_placeholder: "Cerca servizi, notizie, eventi...",
    no_results: "Nessun risultato per",
    settings_title: "Impostazioni",
    settings_notifications: "Notifiche",
    settings_text_size: "Dimensione Testo",
    settings_theme: "Tema",
    settings_contact: "Contatta Team",
    profile_edit: "Modifica Profilo",
    profile_save: "Salva",
    profile_logout: "Esci",
    profile_delete: "Elimina Account",
    profile_success: "Profilo salvato con successo!",
    profile_error: "Errore durante il salvataggio.",
    lbl_firstname: "Nome",
    lbl_lastname: "Cognome",
    lbl_username: "Nome utente",
    lbl_phone: "Telefono",
    lbl_address: "Indirizzo",
    lbl_city: "Città",
    lbl_county: "Provincia/Regione",
    lbl_country: "Paese",
    lbl_postal: "Codice Postale",
    cam_start: "Apri Fotocamera",
    cam_take: "Scatta Foto",
    cam_cancel: "Annulla",
    send_docs_title: "Invia Documenti",
    send_docs_desc: "Invia rapidamente copie dei documenti al tuo consolato.",
    upload_text: "Tocca per caricare",
    services_title: "Servizi Consolari",
    faq_title: "Domande Frequenti"
  },
  ES: { welcome: "¡Bienvenido!", auth_login: "Acceso", auth_register: "Registro", btn_login: "Iniciar sesión", btn_create: "Crear cuenta", nav_home: "Inicio", nav_services: "Servicios", nav_send: "Enviar", nav_events: "Eventos", nav_faq: "Preguntas", title_announcements: "Anuncios Importantes", title_events: "Eventos Activos", view_all: "Ver todo", about_app: "Sobre ConsulaRO", search_placeholder: "Buscar...", no_results: "Sin resultados", settings_title: "Ajustes", settings_notifications: "Notificaciones", settings_text_size: "Tamaño texto", settings_theme: "Tema", settings_contact: "Contactar", profile_edit: "Editar Perfil", profile_save: "Guardar", profile_logout: "Cerrar sesión", profile_delete: "Eliminar cuenta", profile_success: "¡Perfil guardado!", profile_error: "Error al guardar.", lbl_firstname: "Nombre", lbl_lastname: "Apellido", lbl_username: "Usuario", lbl_phone: "Teléfono", lbl_address: "Dirección", lbl_city: "Ciudad", lbl_county: "Región", lbl_country: "País", lbl_postal: "Código Postal", cam_start: "Cámara", cam_take: "Tomar foto", cam_cancel: "Cancelar", send_docs_title: "Enviar Documentos", send_docs_desc: "Envía documentos al consulado.", upload_text: "Tocar para subir", services_title: "Servicios Consulares", faq_title: "Preguntas Frecuentes" },
  FR: { welcome: "Bienvenue!", auth_login: "Connexion", auth_register: "S'inscrire", btn_login: "Se connecter", btn_create: "Créer un compte", nav_home: "Accueil", nav_services: "Services", nav_send: "Envoyer", nav_events: "Événements", nav_faq: "FAQ", title_announcements: "Annonces Importantes", title_events: "Événements Actifs", view_all: "Voir tout", about_app: "À propos de ConsulaRO", search_placeholder: "Rechercher...", no_results: "Aucun résultat", settings_title: "Paramètres", settings_notifications: "Notifications", settings_text_size: "Taille du texte", settings_theme: "Thème", settings_contact: "Contact", profile_edit: "Modifier Profil", profile_save: "Enregistrer", profile_logout: "Déconnexion", profile_delete: "Supprimer compte", profile_success: "Profil enregistré !", profile_error: "Erreur d'enregistrement.", lbl_firstname: "Prénom", lbl_lastname: "Nom", lbl_username: "Nom d'utilisateur", lbl_phone: "Téléphone", lbl_address: "Adresse", lbl_city: "Ville", lbl_county: "Région", lbl_country: "Pays", lbl_postal: "Code Postal", cam_start: "Caméra", cam_take: "Prendre photo", cam_cancel: "Annuler", send_docs_title: "Envoyer Documents", send_docs_desc: "Envoyez des documents au consulat.", upload_text: "Appuyez pour télécharger", services_title: "Services Consulaires", faq_title: "Questions Fréquentes" },
  DE: { welcome: "Willkommen!", auth_login: "Anmeldung", auth_register: "Registrieren", btn_login: "Anmelden", btn_create: "Konto erstellen", nav_home: "Startseite", nav_services: "Dienstleistungen", nav_send: "Senden", nav_events: "Veranstaltungen", nav_faq: "FAQ", title_announcements: "Wichtige Ankündigungen", title_events: "Aktive Veranstaltungen", view_all: "Alle ansehen", about_app: "Über ConsulaRO", search_placeholder: "Suchen...", no_results: "Keine Ergebnisse", settings_title: "Einstellungen", settings_notifications: "Benachrichtigungen", settings_text_size: "Textgröße", settings_theme: "Thema", settings_contact: "Kontakt", profile_edit: "Profil bearbeiten", profile_save: "Speichern", profile_logout: "Abmelden", profile_delete: "Konto löschen", profile_success: "Profil gespeichert!", profile_error: "Fehler beim Speichern.", lbl_firstname: "Vorname", lbl_lastname: "Nachname", lbl_username: "Benutzername", lbl_phone: "Telefon", lbl_address: "Adresse", lbl_city: "Stadt", lbl_county: "Region", lbl_country: "Land", lbl_postal: "Postleitzahl", cam_start: "Kamera", cam_take: "Foto machen", cam_cancel: "Abbrechen", send_docs_title: "Dokumente senden", send_docs_desc: "Senden Sie Dokumente an das Konsulat.", upload_text: "Zum Hochladen tippen", services_title: "Konsularische Dienstleistungen", faq_title: "Häufig gestellte Fragen" },
  PT: { welcome: "Bem-vindo!", auth_login: "Login", auth_register: "Registrar", btn_login: "Entrar", btn_create: "Criar conta", nav_home: "Início", nav_services: "Serviços", nav_send: "Enviar", nav_events: "Eventos", nav_faq: "FAQ", title_announcements: "Anúncios Importantes", title_events: "Eventos Ativos", view_all: "Ver tudo", about_app: "Sobre ConsulaRO", search_placeholder: "Pesquisar...", no_results: "Sem resultados", settings_title: "Configurações", settings_notifications: "Notificações", settings_text_size: "Tamanho do texto", settings_theme: "Tema", settings_contact: "Contato", profile_edit: "Editar Perfil", profile_save: "Salvar", profile_logout: "Sair", profile_delete: "Excluir conta", profile_success: "Perfil salvo!", profile_error: "Erro ao salvar.", lbl_firstname: "Nome", lbl_lastname: "Sobrenome", lbl_username: "Nome de usuário", lbl_phone: "Telefone", lbl_address: "Endereço", lbl_city: "Cidade", lbl_county: "Região", lbl_country: "País", lbl_postal: "Código Postal", cam_start: "Câmera", cam_take: "Tirar foto", cam_cancel: "Cancelar", send_docs_title: "Enviar Documentos", send_docs_desc: "Envie documentos ao consulado.", upload_text: "Toque para carregar", services_title: "Serviços Consulares", faq_title: "Perguntas Frecuentes" },
  HU: { welcome: "Üdvözöljük!", auth_login: "Bejelentkezés", auth_register: "Regisztráció", btn_login: "Belépés", btn_create: "Fiók létrehozása", nav_home: "Főoldal", nav_services: "Szolgáltatások", nav_send: "Küldés", nav_events: "Események", nav_faq: "GYIK", title_announcements: "Fontos közlemények", title_events: "Aktív események", view_all: "Összes megtekintése", about_app: "A ConsulaRO-ról", search_placeholder: "Keresés...", no_results: "Nincs találat", settings_title: "Beállítások", settings_notifications: "Értesítések", settings_text_size: "Szövegméret", settings_theme: "Téma", settings_contact: "Kapcsolat", profile_edit: "Profil szerkesztése", profile_save: "Mentés", profile_logout: "Kijelentkezés", profile_delete: "Fiók törlése", profile_success: "Profil mentve!", profile_error: "Hiba a mentés során.", lbl_firstname: "Keresztnév", lbl_lastname: "Vezetéknév", lbl_username: "Felhasználónév", lbl_phone: "Telefon", lbl_address: "Cím", lbl_city: "Város", lbl_county: "Megye", lbl_country: "Ország", lbl_postal: "Irányítószám", cam_start: "Kamera", cam_take: "Fotó", cam_cancel: "Mégse", send_docs_title: "Dokumentumok küldése", send_docs_desc: "Dokumentumok küldése a konzulátusra.", upload_text: "Koppintson a feltöltéshez", services_title: "Konzuli szolgáltatások", faq_title: "Gyakori kérdések" },
  TR: { welcome: "Hoş geldiniz!", auth_login: "Giriş", auth_register: "Kayıt", btn_login: "Giriş Yap", btn_create: "Hesap Oluştur", nav_home: "Anasayfa", nav_services: "Hizmetler", nav_send: "Gönder", nav_events: "Etkinlikler", nav_faq: "SSS", title_announcements: "Önemli Duyurular", title_events: "Aktif Etkinlikler", view_all: "Hepsini gör", about_app: "ConsulaRO Hakkında", search_placeholder: "Ara...", no_results: "Sonuç bulunamadı", settings_title: "Ayarlar", settings_notifications: "Bildirimler", settings_text_size: "Metin Boyutu", settings_theme: "Tema", settings_contact: "İletişim", profile_edit: "Profili Düzenle", profile_save: "Kaydet", profile_logout: "Çıkış Yap", profile_delete: "Hesabı Sil", profile_success: "Profil kaydedildi!", profile_error: "Kayıt hatası.", lbl_firstname: "İsim", lbl_lastname: "Soyisim", lbl_username: "Kullanıcı Adı", lbl_phone: "Telefon", lbl_address: "Adres", lbl_city: "Şehir", lbl_county: "Bölge", lbl_country: "Ülke", lbl_postal: "Posta Kodu", cam_start: "Kamera", cam_take: "Fotoğraf Çek", cam_cancel: "İptal", send_docs_title: "Belge Gönder", send_docs_desc: "Belgeleri konsolosluğa gönderin.", upload_text: "Yüklemek için dokunun", services_title: "Konsolosluk Hizmetleri", faq_title: "Sıkça Sorulan Sorular" },
};

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  { 
    id: '1', 
    title: 'Acte Notariale', 
    iconName: 'FileText', 
    subServices: [
      { name: 'Procuri', url: 'https://econsulat.ro/Procura/DescriereServiciu/401000001' },
      { name: 'Declarații', url: 'https://econsulat.ro/Declaratie/DescriereServiciu/401000002' },
      { name: 'Legalizări copii de pe înscrisuri', url: 'https://econsulat.ro/LegalizareCopiiInscrisuri/DescriereServiciu/402000001' },
      { name: 'Legalizarea semnăturilor de pe înscrisuri sub semnătură privată', url: 'https://econsulat.ro/LegalizareSemnPrivata/DescriereServiciu/402000004' },
      { name: 'Supralegalizarea de către consulat a sigiliilor şi semnăturilor de pe acte oficiale', url: 'https://econsulat.ro/LegalizareSigSemnMAE/DescriereServiciu/402000003' },
      { name: 'Legalizarea semnăturii unui traducător autorizat de Ministerul Justiției român', url: 'https://econsulat.ro/LegalizareSemnTraducatorMJ/DescriereServiciu/402020001' },
      { name: 'Efectuarea și legalizarea de traduceri de către consulat', url: 'https://econsulat.ro/EfectLegalizareTraducere/DescriereServiciu/402020002' },
      { name: 'Testamente', url: 'https://econsulat.ro/Testament/DescriereServiciu/401010001' },
      { name: 'Eliberarea duplicatelor actelor autentice', url: 'https://econsulat.ro/EliberareDuplicatActAutentic/DescriereServiciu/401010002' },
      { name: 'Convenţie de alegere a legii aplicabile regimul', url: 'https://econsulat.ro/ConventieRegimulMatrimonial/DescriereServiciu/401010004' },
    ] 
  },
  { 
    id: '2', 
    title: 'Acte de Stare Civilă', 
    iconName: 'Users', 
    subServices: [
      { name: 'Înscriere certificat naștere', url: 'https://econsulat.ro/InregistrareNastere/DescriereServiciu/300000002' },
      { name: 'Înscriere certificat căsătorie', url: 'https://econsulat.ro/InscriereCertificatDeCasatorie/DescriereServiciu/300000004' },
      { name: 'Oficierea căsătoriei la misiunea diplomatică/ oficiul consular', url: 'https://econsulat.ro/OficiereCasatorieMDOC/DescriereServiciu/300000003' },
      { name: 'Înscriere certificat deces', url: 'https://econsulat.ro/InregistrareDeces/DescriereServiciu/300000005' },
      { name: 'Înscriere de mențiuni privind modificările intervenite în statutul civil în străinătate', url: 'https://econsulat.ro/InscriereMentiuni/DescriereServiciu/300000007' },
      { name: 'Transcriere certificat de deces străin în registrele de stare civilă române', url: 'https://econsulat.ro/InscriereCertificatDeces/DescriereServiciu/300000006' },
    ] 
  },
  { 
    id: '3', 
    title: 'Cetățenie', 
    iconName: 'Flag', 
    subServices: [
      { name: 'Redobândire cetățenie', url: 'https://www.econsulat.ro' },
      { name: 'Renunțare cetățenie', url: 'https://www.econsulat.ro' }
    ] 
  },
  { 
    id: '4', 
    title: 'Documente de Călătorie', 
    iconName: 'Globe', 
    subServices: [
      { name: 'Pașaport simplu electronic', url: 'https://www.econsulat.ro' },
      { name: 'Titlu de călătorie', url: 'https://www.econsulat.ro' }
    ] 
  },
  { 
    id: '5', 
    title: 'E-Viză', 
    iconName: 'FileCheck', 
    subServices: [
      { name: 'Portal E-Viza', url: 'http://evisa.mae.ro/' }
    ] 
  },
  { 
    id: '6', 
    title: 'Obținere Acte din România', 
    iconName: 'Mail', 
    subServices: [
      { name: 'Cazier judiciar', url: 'https://www.econsulat.ro' },
      { name: 'Duplicate acte stare civilă', url: 'https://www.econsulat.ro' }
    ] 
  },
  { 
    id: '7', 
    title: 'Publicații de Căsătorie', 
    iconName: 'BookOpen', 
    subServices: [
      { name: 'Publicații', url: 'https://www.econsulat.ro' }
    ] 
  },
  { 
    id: '8', 
    title: 'Stare Pașaport Electronic', 
    iconName: 'UserCheck', 
    subServices: [
      { name: 'Verificare status', url: 'https://www.econsulat.ro' }
    ] 
  },
  { 
    id: '9', 
    title: 'Alte Servicii', 
    iconName: 'MoreHorizontal', 
    subServices: [
      { name: 'Asistență consulară', url: 'https://www.econsulat.ro' },
      { name: 'Informații generale', url: 'https://www.mae.ro' }
    ] 
  },
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: '1',
    title: 'Alegeri Prezidențiale 2024',
    description: 'Ministerul Afacerilor Externe informează cetățenii români din străinătate cu privire la organizarea alegerilor prezidențiale din anul 2024. Vă rugăm să verificați lista secțiilor de votare disponibile în țara dumneavoastră de reședință.',
    imageUrl: 'https://picsum.photos/600/400?random=1',
    date: '2024-10-15',
    active: true
  },
  {
    id: '2',
    title: 'Program Consulat Vacanță',
    description: 'În perioada 24 Decembrie - 3 Ianuarie, activitatea cu publicul va fi suspendată, cu excepția cazurilor de urgență majoră (decese, accidente). Vă mulțumim pentru înțelegere.',
    imageUrl: 'https://picsum.photos/600/400?random=2',
    date: '2024-12-01',
    active: true
  },
  {
    id: '3',
    title: 'Consulate Itinerante',
    description: 'Echipele consulare mobile se vor deplasa în următoarele orașe: Lyon (Franța), Birmingham (UK), și Dortmund (Germania). Programările se fac exclusiv online.',
    imageUrl: 'https://picsum.photos/600/400?random=3',
    date: '2024-11-10',
    active: true
  },
   {
    id: '4',
    title: 'Modificări Taxe Consulare',
    description: 'Vă informăm că începând cu data de 1 ianuarie, anumite taxe consulare vor fi actualizate conform noilor reglementări legislative.',
    imageUrl: 'https://picsum.photos/600/400?random=10',
    date: '2024-12-15',
    active: true
  },
  {
    id: '5',
    title: 'Programare Online Obligatorie',
    description: 'Pentru a evita aglomerația și a reduce timpii de așteptare, toate serviciile consulare se efectuează exclusiv pe bază de programare prin portalul econsulat.ro.',
    imageUrl: 'https://picsum.photos/600/400?random=11',
    date: '2024-09-20',
    active: true
  }
];

export const MOCK_EVENTS: EventItem[] = [
  {
    id: '1',
    title: 'Ziua Limbii Române',
    location: 'Institutul Cultural Român',
    date: '2024-08-31',
    description: 'Sărbătorim împreună Ziua Limbii Române cu un recital de poezie și un concert de muzică clasică. Intrarea este liberă.',
    imageUrl: 'https://picsum.photos/600/400?random=4',
    active: true
  },
  {
    id: '2',
    title: 'Întâlnire cu Diaspora',
    location: 'Ambasada României',
    date: '2024-09-15',
    description: 'Vă invităm la o discuție deschisă despre problemele comunității românești. Vor fi prezenți reprezentanți ai MAE.',
    imageUrl: 'https://picsum.photos/600/400?random=5',
    active: true
  },
  {
    id: '3',
    title: 'Târgul de Mărțișor',
    location: 'Centrul Comunitar',
    date: '2025-03-01',
    description: 'Veniți să sărbătorim venirea primăverii cu mărțișoare tradiționale, muzică populară și bucate românești.',
    imageUrl: 'https://picsum.photos/600/400?random=6',
    active: true
  },
  {
    id: '4',
    title: 'Festivalul Filmului Românesc',
    location: 'Cinema Central',
    date: '2024-11-20',
    description: 'Proiecții ale celor mai noi filme românești premiate internațional. Sesiuni de Q&A cu regizorii.',
    imageUrl: 'https://picsum.photos/600/400?random=7',
    active: true
  },
  {
    id: '5',
    title: 'Atelier de Pictură pentru Copii',
    location: 'Biblioteca Românească',
    date: '2024-10-05',
    description: 'Un atelier creativ pentru copiii de toate vârstele, dedicat promovării tradițiilor românești prin artă.',
    imageUrl: 'https://picsum.photos/600/400?random=8',
    active: true
  }
];

export const FAQ_DATA: FaqCategory[] = [
  {
    id: 'travel',
    title: 'Acte necesare documente călătorie/pașaport',
    questions: [
      { question: 'Ce acte sunt necesare pentru pașaportul simplu electronic?', answer: 'Cartea de identitate în original, pașaportul anterior (dacă există), dovada achitării taxei consulare.' },
      { question: 'Cât durează eliberarea pașaportului?', answer: 'Pașapoartele electronice sunt confecționate în România și trimise la consulat. Durata medie este de 2-4 săptămâni.' }
    ]
  },
  {
    id: 'citizenship',
    title: 'Cetățenie română',
    questions: [
      { question: 'Cum pot redobândi cetățenia română?', answer: 'Trebuie să depuneți un dosar complet la Autoritatea Națională pentru Cetățenie sau la misiunile diplomatice.' },
      { question: 'Pot avea dublă cetățenie?', answer: 'Da, statul român permite dubla cetățenie.' }
    ]
  },
  {
    id: 'notary',
    title: 'Acte notariale',
    questions: [
      { question: 'Pot face o procură la consulat?', answer: 'Da, consulatul îndeplinește funcții notariale pentru cetățenii români.' }
    ]
  },
  {
    id: 'other',
    title: 'Alte servicii',
    questions: [
      { question: 'Cum pot obține un cazier judiciar?', answer: 'Se poate solicita la consulat. Eliberarea se face de obicei pe loc sau în câteva zile.' }
    ]
  }
];

export const APP_DESCRIPTION_SHORT = "ConsulaRO este asistentul tău digital pentru relația cu consulatele României.";
export const APP_DESCRIPTION_FULL = "ConsulaRO este o aplicație modernă dedicată românilor din diaspora, menită să simplifice interacțiunea cu misiunile diplomatice și oficiile consulare ale României. Prin intermediul acestei aplicații, puteți accesa rapid informații despre serviciile consulare, puteți trimite documente preliminare, și puteți rămâne la curent cu noutățile și evenimentele comunității. Ne propunem să aducem consulatul mai aproape de tine, la doar un click distanță.";
