import React from 'react';
import { Compass, Radio, QrCode, WifiOff, Sparkles, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { LanguageCode } from '../../types';
import { SUPPORTED_LANGUAGES } from '../../data/seedData';
import { PWAInstallButton } from '../common/PWAInstallButton';

interface WelcomeScreenProps {
  currentLanguage: LanguageCode;
  onOpenLanguageModal: () => void;
  onStartTour: () => void;
  isOfflineReady: boolean;
  onOpenDownloadScreen: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  currentLanguage,
  onOpenLanguageModal,
  onStartTour,
  isOfflineReady,
  onOpenDownloadScreen,
}) => {
  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  const content: Record<LanguageCode, { welcome: string; title: string; subtitle: string; desc: string; start: string; offlineReady: string; download: string }> = {
    es: {
      welcome: 'Audioguía Oficial',
      title: 'Cueva de Can Marçà',
      subtitle: 'Puerto de San Miguel, Ibiza',
      desc: 'Descubre más de 100.000 años de historia geológica, cascadas subterráneas, lagos esmeralda y los secretos de los antiguos contrabandistas.',
      start: 'Comenzar Visita',
      offlineReady: 'Modo sin conexión listo',
      download: 'Descargar para visita offline',
    },
    en: {
      welcome: 'Official Audio Guide',
      title: 'Can Marçà Cave',
      subtitle: 'Port of San Miguel, Ibiza',
      desc: 'Explore over 100,000 years of karstic history, subterranean waterfalls, emerald lakes, and secret smuggler hideouts.',
      start: 'Start Tour',
      offlineReady: 'Offline mode ready',
      download: 'Download for offline visit',
    },
    de: {
      welcome: 'Offizieller Audioguide',
      title: 'Höhle von Can Marçà',
      subtitle: 'Hafen von San Miguel, Ibiza',
      desc: 'Erleben Sie über 100.000 Jahre Naturgeschichte, unterirdische Wasserfälle, smaragdgrüne Seen und Schmugglerverstecke.',
      start: 'Rundgang Starten',
      offlineReady: 'Offline-Modus bereit',
      download: 'Für Offline-Nutzung herunterladen',
    },
    fr: {
      welcome: 'Audioguide Officiel',
      title: 'Grotte de Can Marçà',
      subtitle: 'Port de San Miguel, Ibiza',
      desc: 'Explorez plus de 100 000 ans d’histoire géologique, des cascades souterraines, des lacs émeraude et les secrets des contrebandiers.',
      start: 'Démarrer la visite',
      offlineReady: 'Prêt sans connexion',
      download: 'Télécharger pour le mode hors-ligne',
    },
    it: {
      welcome: 'Audioguida Ufficiale',
      title: 'Grotta di Can Marçà',
      subtitle: 'Porto di San Miguel, Ibiza',
      desc: 'Scopri oltre 100.000 anni di evoluzione naturale, cascate sotterranee, laghi verde smeraldo e antichi rifugi di contrabbandieri.',
      start: 'Inizia la Visita',
      offlineReady: 'Modalità offline pronta',
      download: 'Scarica per la visita offline',
    },
    nl: {
      welcome: 'Officiële Audiogids',
      title: 'Grot van Can Marçà',
      subtitle: 'Haven van San Miguel, Ibiza',
      desc: 'Ontdek meer dan 100.000 jaar geologische geschiedenis, ondergrondse watervallen, smaragdgroene meren en smokkelaarsroutes.',
      start: 'Start Tour',
      offlineReady: 'Offline modus gereed',
      download: 'Download voor offline bezoek',
    },
    pt: {
      welcome: 'Audioguia Oficial',
      title: 'Gruta de Can Marçà',
      subtitle: 'Porto de San Miguel, Ibiza',
      desc: 'Descubra mais de 100.000 anos de história natural, cascatas subterrâneas, lagos esmeralda e lendas de contrabandistas.',
      start: 'Começar Visita',
      offlineReady: 'Modo offline pronto',
      download: 'Transferir para visita offline',
    },
    ru: {
      welcome: 'Официальный аудиогид',
      title: 'Пещера Кан Марса',
      subtitle: 'Порт Сан-Мигель, Ибица',
      desc: 'Откройте для себя более 100 000 лет геологической истории, подземные водопады, изумрудные озера и тайны контрабандистов.',
      start: 'Начать экскурсию',
      offlineReady: 'Офлайн-режим готов',
      download: 'Скачать для офлайн-визита',
    },
    pl: {
      welcome: 'Oficjalny audioprzewodnik',
      title: 'Jaskinia Can Marçà',
      subtitle: 'Port de San Miguel, Ibiza',
      desc: 'Odkryj ponad 100 000 lat historii geologicznej, podziemne wodospady, szmaragdowe jeziora i tajemnice dawnych przemytników.',
      start: 'Rozpocznij zwiedzanie',
      offlineReady: 'Tryb offline gotowy',
      download: 'Pobierz do użytku offline',
    },
    cs: {
      welcome: 'Oficiální audioprůvodce',
      title: 'Jeskyně Can Marçà',
      subtitle: 'Puerto de San Miguel, Ibiza',
      desc: 'Objevte více než 100 000 let geologické historie, podzemní vodopády, smaragdová jezera a tajemství pašeráků.',
      start: 'Zahájit prohlídku',
      offlineReady: 'Offline režim připraven',
      download: 'Stáhnout pro offline návštěvu',
    },
    ro: {
      welcome: 'Ghid audio oficial',
      title: 'Peștera Can Marçà',
      subtitle: 'Portul San Miguel, Ibiza',
      desc: 'Descoperiți peste 100.000 de ani de istorie geologică, cascade subterane, lacuri de smarald și secretele contrabandiștilor.',
      start: 'Începe vizita',
      offlineReady: 'Mod offline pregătit',
      download: 'Descarcă pentru vizită offline',
    },
    zh: {
      welcome: '官方语音导览',
      title: '卡恩·马尔萨洞穴',
      subtitle: '圣米格尔港，伊比萨',
      desc: '探索超过10万年的地质历史、地下瀑布、翡翠色地下湖泊以及古代走私者的秘密通道。',
      start: '开始游览',
      offlineReady: '离线模式已就绪',
      download: '下载离线导览包',
    },
    ja: {
      welcome: '公式音声ガイド',
      title: 'カン・マルサ洞窟',
      subtitle: 'サン・ミゲル港、イビサ島',
      desc: '10万年以上の地質学的歴史、地下の滝、エメラルドグリーンの地底湖、密輸業者たちの隠された歴史をご体験ください。',
      start: '見学を開始する',
      offlineReady: 'オフライン準備完了',
      download: 'オフライン用にダウンロード',
    },
    ar: {
      welcome: 'الدليل الصوتي الرسمي',
      title: 'كهف كان مارسا',
      subtitle: 'ميناء سان ميغيل، إيبيزا',
      desc: 'اكتشف أكثر من 100,000 عام من التاريخ الجيولوجي، والشلالات الجوفية، والبحيرات الزمردية، وأسرار المهربين القدامى.',
      start: 'بدء الجولة',
      offlineReady: 'وضع عدم الاتصال جاهز',
      download: 'تنزيل للزيارة دون اتصال',
    },
  };

  const text = content[currentLanguage] || content.es;

  return (
    <div className="relative min-h-[calc(100vh-60px)] flex flex-col justify-between p-4 sm:p-6 pb-24 overflow-hidden">
      {/* Background Graphic Ambient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-amber-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 -right-20 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-center space-y-6 pt-4">
        {/* Cave Hero Card */}
        <div className="relative rounded-3xl overflow-hidden border border-stone-800 shadow-2xl group">
          <img
            src="/src/assets/images/can_marca_terrace_1791196483951.jpg"
            alt="Cueva de Can Marçà - Vistas al Puerto de San Miguel y Sa Ferradura"
            referrerPolicy="no-referrer"
            className="w-full h-56 sm:h-64 object-cover brightness-95 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent flex flex-col justify-end p-5">
            <div className="inline-flex items-center space-x-2 bg-stone-900/90 border border-amber-500/30 px-3 py-1 rounded-full w-max text-amber-400 text-xs font-semibold backdrop-blur-sm mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{text.welcome}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif tracking-tight drop-shadow-md">
              {text.title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              {text.subtitle}
            </p>
          </div>
        </div>

        {/* Narrative Description */}
        <p className="text-sm text-stone-300 leading-relaxed text-center px-2">
          {text.desc}
        </p>

        {/* System Capabilities Pills */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 rounded-2xl bg-stone-900/60 border border-stone-800/80 flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-200">Balizas Beacon</p>
              <p className="text-[10px] text-stone-400">Audio automático</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-stone-900/60 border border-stone-800/80 flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-200">GPS & QR</p>
              <p className="text-[10px] text-stone-400">Terraza & Cueva</p>
            </div>
          </div>
        </div>

        {/* Language Quick Changer */}
        <div className="p-3.5 rounded-2xl bg-stone-900/80 border border-stone-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{currentLangObj.flag}</span>
            <div>
              <p className="text-xs text-stone-400">Idioma seleccionado</p>
              <p className="text-sm font-semibold text-stone-100">{currentLangObj.nativeName}</p>
            </div>
          </div>
          <button
            onClick={onOpenLanguageModal}
            className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-medium text-amber-400 border border-stone-700 transition-colors"
          >
            Cambiar
          </button>
        </div>

        {/* PWA Home Screen Install Banner */}
        <PWAInstallButton variant="card" />

        {/* Offline Status Card */}
        {isOfflineReady ? (
          <div className="flex items-center justify-center space-x-2 text-xs text-emerald-400 bg-emerald-950/20 border border-emerald-800/40 rounded-xl py-2 px-3">
            <ShieldCheck className="w-4 h-4" />
            <span className="font-medium">{text.offlineReady} (10 puntos disponibles)</span>
          </div>
        ) : (
          <button
            onClick={onOpenDownloadScreen}
            className="flex items-center justify-center space-x-2 text-xs text-amber-400 bg-amber-950/20 border border-amber-800/40 hover:bg-amber-950/40 rounded-xl py-2 px-3 transition-colors"
          >
            <WifiOff className="w-4 h-4" />
            <span>{text.download}</span>
          </button>
        )}
      </div>

      {/* Start Button Fixed at Bottom */}
      <div className="max-w-md mx-auto w-full pt-4">
        <button
          onClick={onStartTour}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-stone-950 font-bold text-base shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-3"
        >
          <span>{text.start}</span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
