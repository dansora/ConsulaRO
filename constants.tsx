
import { LanguageCode, ServiceCategory, FaqCategory } from './types';
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

export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  RO: {
    welcome: "Bine ai venit!",
    auth_login: "Autentificare",
    auth_register: "Înregistrare",
    btn_login: "Intră în cont",
    btn_create: "Creează cont",
    nav_home: "Acasă",
    nav_services: "Servicii",
    nav_announcements: "Anunțuri",
    nav_events: "Evenimente",
    nav_info: "Informații",
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
    settings_terms: "Termeni și Condiții",
    settings_privacy: "Politica de Confidențialitate",
    settings_sql: "Script Bază de Date",
    profile_edit: "Editează Profil",
    profile_save: "Salvează",
    profile_logout: "Delogare",
    profile_delete: "Șterge Contul",
    profile_send_docs: "Trimite Documente",
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
    info_title: "Informații Utile",
    faq_section: "Întrebări Frecvente",
    terms_section: "Termeni și Condiții",
    privacy_section: "Politica de Confidențialitate",
    err_title: "Eroare",
    btn_show_sql: "Vezi Soluția SQL",
    btn_close: "Închide",
    btn_copy: "Copiază",
    btn_copied: "Copiat!",
    role_user: "Utilizator",
    role_admin: "Admin",
    role_super_admin: "Super Admin",
    alerts_section: "Alerte Urgente",
    alert_global: "Global",
    alert_target: "Țară Țintă"
  },
  EN: {
    welcome: "Welcome!",
    auth_login: "Login",
    auth_register: "Register",
    btn_login: "Sign In",
    btn_create: "Create Account",
    nav_home: "Home",
    nav_services: "Services",
    nav_announcements: "Announcements",
    nav_events: "Events",
    nav_info: "Info",
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
    settings_terms: "Terms & Conditions",
    settings_privacy: "Privacy Policy",
    settings_sql: "Database Script",
    profile_edit: "Edit Profile",
    profile_save: "Save",
    profile_logout: "Logout",
    profile_delete: "Delete Account",
    profile_send_docs: "Send Documents",
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
    info_title: "Useful Information",
    faq_section: "FAQ",
    terms_section: "Terms & Conditions",
    privacy_section: "Privacy Policy",
    err_title: "Error",
    btn_show_sql: "View SQL Solution",
    btn_close: "Close",
    btn_copy: "Copy",
    btn_copied: "Copied!",
    role_user: "User",
    role_admin: "Admin",
    role_super_admin: "Super Admin",
    alerts_section: "Urgent Alerts",
    alert_global: "Global",
    alert_target: "Target Country"
  },
  IT: {
    welcome: "Benvenuto!",
    auth_login: "Accedi",
    auth_register: "Registrati",
    btn_login: "Entra",
    btn_create: "Crea Account",
    nav_home: "Home",
    nav_services: "Servizi",
    nav_announcements: "Annunci",
    nav_events: "Eventi",
    nav_info: "Info",
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
    settings_terms: "Termini e Condizioni",
    settings_privacy: "Politica sulla Riservatezza",
    settings_sql: "Script Database",
    profile_edit: "Modifica Profilo",
    profile_save: "Salva",
    profile_logout: "Esci",
    profile_delete: "Elimina Account",
    profile_send_docs: "Invia Documenti",
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
    info_title: "Informazioni Utili",
    faq_section: "Domande Frequenti",
    terms_section: "Termini e Condizioni",
    privacy_section: "Politica sulla Riservatezza",
    err_title: "Errore",
    btn_show_sql: "Vedi Soluzione SQL",
    btn_close: "Chiudi",
    btn_copy: "Copia",
    btn_copied: "Copiato!",
    role_user: "Utente",
    role_admin: "Amministratore",
    role_super_admin: "Super Amministratore",
    alerts_section: "Avvisi Urgenti",
    alert_global: "Globale",
    alert_target: "Paese di Destinazione"
  },
  ES: { welcome: "¡Bienvenido!", auth_login: "Acceso", auth_register: "Registro", btn_login: "Iniciar sesión", btn_create: "Crear cuenta", nav_home: "Inicio", nav_services: "Servicios", nav_announcements: "Anuncios", nav_events: "Eventos", nav_info: "Info", title_announcements: "Anuncios Importantes", title_events: "Eventos Activos", view_all: "Ver todo", about_app: "Sobre ConsulaRO", search_placeholder: "Buscar...", no_results: "Sin resultados", settings_title: "Ajustes", settings_notifications: "Notificaciones", settings_text_size: "Tamaño texto", settings_theme: "Tema", settings_contact: "Contactar", settings_terms: "Términos y Condiciones", settings_privacy: "Política de Privacidad", settings_sql: "Script SQL", profile_edit: "Editar Perfil", profile_save: "Guardar", profile_logout: "Cerrar sesión", profile_delete: "Eliminar cuenta", profile_send_docs: "Enviar Documentos", profile_success: "¡Perfil guardado!", profile_error: "Error al guardar.", lbl_firstname: "Nombre", lbl_lastname: "Apellido", lbl_username: "Usuario", lbl_phone: "Teléfono", lbl_address: "Dirección", lbl_city: "Ciudad", lbl_county: "Región", lbl_country: "País", lbl_postal: "Código Postal", cam_start: "Cámara", cam_take: "Tomar foto", cam_cancel: "Cancelar", send_docs_title: "Enviar Documentos", send_docs_desc: "Envía documentos al consulado.", upload_text: "Tocar para subir", services_title: "Servicios Consulares", info_title: "Información Útil", faq_section: "Preguntas Frecuentes", terms_section: "Términos y Condiciones", privacy_section: "Política de Privacidad", err_title: "Error", btn_show_sql: "Ver SQL", btn_close: "Cerrar", btn_copy: "Copiar", btn_copied: "¡Copiado!", role_user: "Usuario", role_admin: "Admin", role_super_admin: "Super Admin", alerts_section: "Alertas Urgentes", alert_global: "Global", alert_target: "País Destino" },
  FR: { welcome: "Bienvenue!", auth_login: "Connexion", auth_register: "S'inscrire", btn_login: "Se connecter", btn_create: "Créer un compte", nav_home: "Accueil", nav_services: "Services", nav_announcements: "Annonces", nav_events: "Événements", nav_info: "Info", title_announcements: "Annonces Importantes", title_events: "Événements Actifs", view_all: "Voir tout", about_app: "À propos de ConsulaRO", search_placeholder: "Rechercher...", no_results: "Aucun résultat", settings_title: "Paramètres", settings_notifications: "Notifications", settings_text_size: "Taille du texte", settings_theme: "Thème", settings_contact: "Contact", settings_terms: "Termes et Conditions", settings_privacy: "Politique de Confidentialité", settings_sql: "Script SQL", profile_edit: "Modifier Profil", profile_save: "Enregistrer", profile_logout: "Déconnexion", profile_delete: "Supprimer compte", profile_send_docs: "Envoyer Documents", profile_success: "Profil enregistré !", profile_error: "Erreur d'enregistrement.", lbl_firstname: "Prénom", lbl_lastname: "Nom", lbl_username: "Nom d'utilisateur", lbl_phone: "Téléphone", lbl_address: "Adresse", lbl_city: "Ville", lbl_county: "Région", lbl_country: "Pays", lbl_postal: "Code Postal", cam_start: "Caméra", cam_take: "Prendre photo", cam_cancel: "Annuler", send_docs_title: "Envoyer Documents", send_docs_desc: "Envoyez des documents au consulat.", upload_text: "Appuyez pour télécharger", services_title: "Services Consulaires", info_title: "Informations Utiles", faq_section: "Questions Fréquentes", terms_section: "Termes et Conditions", privacy_section: "Politique de Confidentialité", err_title: "Erreur", btn_show_sql: "Voir SQL", btn_close: "Fermer", btn_copy: "Copier", btn_copied: "Copié!", role_user: "Utilisateur", role_admin: "Admin", role_super_admin: "Super Admin", alerts_section: "Alertes Urgentes", alert_global: "Global", alert_target: "Pays Cible" },
  DE: { welcome: "Willkommen!", auth_login: "Anmeldung", auth_register: "Registrieren", btn_login: "Anmelden", btn_create: "Konto erstellen", nav_home: "Startseite", nav_services: "Dienstleistungen", nav_announcements: "Ankündigungen", nav_events: "Veranstaltungen", nav_info: "Info", title_announcements: "Wichtige Ankündigungen", title_events: "Aktive Veranstaltungen", view_all: "Alle ansehen", about_app: "Über ConsulaRO", search_placeholder: "Suchen...", no_results: "Keine Ergebnisse", settings_title: "Einstellungen", settings_notifications: "Benachrichtigungen", settings_text_size: "Textgröße", settings_theme: "Thema", settings_contact: "Kontakt", settings_terms: "Allgemeine Geschäftsbedingungen", settings_privacy: "Datenschutzrichtlinie", settings_sql: "SQL-Skript", profile_edit: "Profil bearbeiten", profile_save: "Speichern", profile_logout: "Abmelden", profile_delete: "Konto löschen", profile_send_docs: "Dokumente senden", profile_success: "Profil gespeichert!", profile_error: "Fehler beim Speichern.", lbl_firstname: "Vorname", lbl_lastname: "Nachname", lbl_username: "Benutzername", lbl_phone: "Telefon", lbl_address: "Adresse", lbl_city: "Stadt", lbl_county: "Region", lbl_country: "Land", lbl_postal: "Postleitzahl", cam_start: "Kamera", cam_take: "Foto machen", cam_cancel: "Abbrechen", send_docs_title: "Dokumente senden", send_docs_desc: "Senden Sie Dokumente an das Konsulat.", upload_text: "Zum Hochladen tippen", services_title: "Konsularische Dienstleistungen", info_title: "Nützliche Informationen", faq_section: "Häufig gestellte Fragen", terms_section: "Allgemeine Geschäftsbedingungen", privacy_section: "Datenschutz", err_title: "Fehler", btn_show_sql: "SQL ansehen", btn_close: "Schließen", btn_copy: "Kopieren", btn_copied: "Kopiert!", role_user: "Benutzer", role_admin: "Admin", role_super_admin: "Super Admin", alerts_section: "Dringende Warnungen", alert_global: "Global", alert_target: "Zielland" },
  PT: { welcome: "Bem-vindo!", auth_login: "Login", auth_register: "Registrar", btn_login: "Entrar", btn_create: "Criar conta", nav_home: "Início", nav_services: "Serviços", nav_announcements: "Anúncios", nav_events: "Eventos", nav_info: "Info", title_announcements: "Anúncios Importantes", title_events: "Eventos Ativos", view_all: "Ver tudo", about_app: "Sobre ConsulaRO", search_placeholder: "Pesquisar...", no_results: "Sem resultados", settings_title: "Configurações", settings_notifications: "Notificações", settings_text_size: "Tamanho do texto", settings_theme: "Tema", settings_contact: "Contato", settings_terms: "Termos e Condições", settings_privacy: "Política de Privacidade", settings_sql: "Script SQL", profile_edit: "Editar Perfil", profile_save: "Salvar", profile_logout: "Sair", profile_delete: "Excluir conta", profile_send_docs: "Enviar Documentos", profile_success: "Perfil salvo!", profile_error: "Erro ao salvar.", lbl_firstname: "Nome", lbl_lastname: "Sobrenome", lbl_username: "Nome de usuário", lbl_phone: "Telefone", lbl_address: "Endereço", lbl_city: "Cidade", lbl_county: "Região", lbl_country: "País", lbl_postal: "Código Postal", cam_start: "Câmera", cam_take: "Tirar foto", cam_cancel: "Cancelar", send_docs_title: "Enviar Documentos", send_docs_desc: "Envie documentos ao consulado.", upload_text: "Toque para carregar", services_title: "Serviços Consulares", info_title: "Informações Úteis", faq_section: "Perguntas Frequentes", terms_section: "Termos e Condições", privacy_section: "Política de Privacidade", err_title: "Erro", btn_show_sql: "Ver SQL", btn_close: "Fechar", btn_copy: "Copiar", btn_copied: "Copiado!", role_user: "Usuário", role_admin: "Admin", role_super_admin: "Super Admin", alerts_section: "Alertas Urgentes", alert_global: "Global", alert_target: "País de Destino" },
  HU: { welcome: "Üdvözöljük!", auth_login: "Bejelentkezés", auth_register: "Regisztráció", btn_login: "Belépés", btn_create: "Fiók létrehozása", nav_home: "Főoldal", nav_services: "Szolgáltatások", nav_announcements: "Közlemények", nav_events: "Események", nav_info: "Infó", title_announcements: "Fontos közlemények", title_events: "Aktív események", view_all: "Összes megtekintése", about_app: "A ConsulaRO-ról", search_placeholder: "Keresés...", no_results: "Nincs találat", settings_title: "Beállítások", settings_notifications: "Értesítések", settings_text_size: "Szövegméret", settings_theme: "Téma", settings_contact: "Kapcsolat", settings_terms: "Felhasználási feltételek", settings_privacy: "Adatvédelmi irányelvek", settings_sql: "SQL szkript", profile_edit: "Profil szerkesztése", profile_save: "Mentés", profile_logout: "Kijelentkezés", profile_delete: "Fiók törlése", profile_send_docs: "Dokumentumok küldése", profile_success: "Profil mentve!", profile_error: "Hiba a mentés során.", lbl_firstname: "Keresztnév", lbl_lastname: "Vezetéknév", lbl_username: "Felhasználónév", lbl_phone: "Telefon", lbl_address: "Cím", lbl_city: "Város", lbl_county: "Megye", lbl_country: "Ország", lbl_postal: "Irányítószám", cam_start: "Kamera", cam_take: "Fotó", cam_cancel: "Mégse", send_docs_title: "Dokumentumok küldése", send_docs_desc: "Dokumentumok küldése a konzulátusra.", upload_text: "Koppintson a feltöltéshez", services_title: "Konzuli szolgáltatások", info_title: "Hasznos Információk", faq_section: "Gyakori kérdések", terms_section: "Felhasználási feltételek", privacy_section: "Adatvédelmi irányelvek", err_title: "Hiba", btn_show_sql: "SQL Megtekintése", btn_close: "Bezárás", btn_copy: "Másolás", btn_copied: "Másolva!", role_user: "Felhasználó", role_admin: "Admin", role_super_admin: "Szuper Admin", alerts_section: "Sürgős riasztások", alert_global: "Globális", alert_target: "Célország" },
  TR: { welcome: "Hoş geldiniz!", auth_login: "Giriş", auth_register: "Kayıt", btn_login: "Giriş Yap", btn_create: "Hesap Oluştur", nav_home: "Anasayfa", nav_services: "Hizmetler", nav_announcements: "Duyurular", nav_events: "Etkinlikler", nav_info: "Bilgi", title_announcements: "Önemli Duyurular", title_events: "Aktif Etkinlikler", view_all: "Hepsini gör", about_app: "ConsulaRO Hakkında", search_placeholder: "Ara...", no_results: "Sonuç bulunamadı", settings_title: "Ayarlar", settings_notifications: "Bildirimler", settings_text_size: "Metin Boyutu", settings_theme: "Tema", settings_contact: "İletişim", settings_terms: "Şartlar ve Koşullar", settings_privacy: "Gizlilik Politikası", settings_sql: "SQL Komut", profile_edit: "Profili Düzenle", profile_save: "Kaydet", profile_logout: "Çıkış Yap", profile_delete: "Hesabı Sil", profile_send_docs: "Belge Gönder", profile_success: "Profil kaydedildi!", profile_error: "Kayıt hatası.", lbl_firstname: "İsim", lbl_lastname: "Soyisim", lbl_username: "Kullanıcı Adı", lbl_phone: "Telefon", lbl_address: "Adres", lbl_city: "Şehir", lbl_county: "Bölge", lbl_country: "Ülke", lbl_postal: "Posta Kodu", cam_start: "Kamera", cam_take: "Fotoğraf Çek", cam_cancel: "İptal", send_docs_title: "Belge Gönder", send_docs_desc: "Belgeleri konsolosluğa gönderin.", upload_text: "Yüklemek için dokunun", services_title: "Konsolosluk Hizmetleri", info_title: "Yararlı Bilgiler", faq_section: "Sıkça Sorulan Sorular", terms_section: "Şartlar ve Koşullar", privacy_section: "Gizlilik Politikası", err_title: "Hata", btn_show_sql: "SQL Görüntüle", btn_close: "Kapat", btn_copy: "Kopyala", btn_copied: "Kopyalandı!", role_user: "Kullanıcı", role_admin: "Admin", role_super_admin: "Süper Admin", alerts_section: "Acil Uyarılar", alert_global: "Küresel", alert_target: "Hedef Ülke" },
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