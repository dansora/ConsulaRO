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

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  { id: '1', title: 'Acte Notariale', iconName: 'FileText', subServices: ['Procuri', 'Declarații', 'Legalizări copii'] },
  { id: '2', title: 'Acte de Stare Civilă', iconName: 'Users', subServices: ['Înscriere certificat naștere', 'Înscriere certificat căsătorie', 'Înscriere certificat deces'] },
  { id: '3', title: 'Cetățenie', iconName: 'Flag', subServices: ['Redobândire cetățenie', 'Renunțare cetățenie'] },
  { id: '4', title: 'Documente de Călătorie', iconName: 'Globe', subServices: ['Pașaport simplu electronic', 'Titlu de călătorie'] },
  { id: '5', title: 'E-Viză', iconName: 'FileCheck', subServices: ['Portal E-Viza'] },
  { id: '6', title: 'Obținere Acte din România', iconName: 'Mail', subServices: ['Cazier judiciar', 'Duplicate acte stare civilă'] },
  { id: '7', title: 'Publicații de Căsătorie', iconName: 'BookOpen', subServices: ['Publicații'] },
  { id: '8', title: 'Stare Pașaport Electronic', iconName: 'UserCheck', subServices: ['Verificare status'] },
  { id: '9', title: 'Alte Servicii', iconName: 'MoreHorizontal', subServices: ['Asistență consulară', 'Informații generale'] },
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: '1',
    title: 'Alegeri Prezidențiale 2024',
    shortDescription: 'Informații privind organizarea secțiilor de votare în străinătate.',
    fullDescription: 'Ministerul Afacerilor Externe informează cetățenii români din străinătate cu privire la organizarea alegerilor prezidențiale din anul 2024. Vă rugăm să verificați lista secțiilor de votare disponibile în țara dumneavoastră de reședință. Este necesar un act de identitate valabil.',
    imageUrl: 'https://picsum.photos/600/400?random=1',
    date: '2024-10-15'
  },
  {
    id: '2',
    title: 'Program Consulat Vacanță',
    shortDescription: 'Modificări de program în perioada sărbătorilor de iarnă.',
    fullDescription: 'În perioada 24 Decembrie - 3 Ianuarie, activitatea cu publicul va fi suspendată, cu excepția cazurilor de urgență majoră (decese, accidente). Vă mulțumim pentru înțelegere.',
    imageUrl: 'https://picsum.photos/600/400?random=2',
    date: '2024-12-01'
  },
  {
    id: '3',
    title: 'Consulate Itinerante',
    shortDescription: 'Lista consulatelor itinerante pentru luna viitoare.',
    fullDescription: 'Echipele consulare mobile se vor deplasa în următoarele orașe: Lyon (Franța), Birmingham (UK), și Dortmund (Germania). Programările se fac exclusiv online.',
    imageUrl: 'https://picsum.photos/600/400?random=3',
    date: '2024-11-10'
  }
];

export const MOCK_EVENTS: EventItem[] = [
  {
    id: '1',
    title: 'Ziua Limbii Române',
    location: 'Institutul Cultural Român',
    date: '2024-08-31',
    description: 'Sărbătorim împreună Ziua Limbii Române cu un recital de poezie și un concert de muzică clasică. Intrarea este liberă.',
    imageUrl: 'https://picsum.photos/600/400?random=4'
  },
  {
    id: '2',
    title: 'Întâlnire cu Diaspora',
    location: 'Ambasada României',
    date: '2024-09-15',
    description: 'Vă invităm la o discuție deschisă despre problemele comunității românești. Vor fi prezenți reprezentanți ai MAE.',
    imageUrl: 'https://picsum.photos/600/400?random=5'
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
