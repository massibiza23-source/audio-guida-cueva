import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Heart, RotateCcw, Globe, Sparkles, CheckCircle2, ShieldCheck, Share2 } from 'lucide-react';
import { LanguageCode } from '../../types';
import { StorageService } from '../../services/storageService';

interface TourEndScreenProps {
  language: LanguageCode;
  onRestartTour: () => void;
  onOpenLanguageModal: () => void;
  totalPoints: number;
}

export const TourEndScreen: React.FC<TourEndScreenProps> = ({
  language,
  onRestartTour,
  onOpenLanguageModal,
  totalPoints,
}) => {
  useEffect(() => {
    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#38bdf8', '#fbbf24'],
      });
    } catch (e) {
      // ignore
    }
  }, []);

  const content: Record<LanguageCode, {
    title: string;
    subtitle: string;
    completedMsg: string;
    conservationTitle: string;
    conservationText: string;
    restart: string;
    changeLang: string;
  }> = {
    es: {
      title: '¡Enhorabuena!',
      subtitle: 'Has completado el recorrido de Can Marçà',
      completedMsg: `Completadas con éxito las ${totalPoints} estaciones geológicas.`,
      conservationTitle: 'Conservación del Patrimonio Subterráneo',
      conservationText:
        'La Cueva de Can Marçà es el resultado de cientos de miles de años de paciente interacción entre la roca caliza, el agua y el tiempo. Cuidar de este entorno natural y transmitir su valor a las generaciones futuras es un compromiso de todos.',
      restart: 'Reiniciar Recorrido',
      changeLang: 'Cambiar Idioma',
    },
    en: {
      title: 'Congratulations!',
      subtitle: 'You have completed the Can Marçà tour',
      completedMsg: `Successfully visited all ${totalPoints} geological stations.`,
      conservationTitle: 'Preserving Subterranean Heritage',
      conservationText:
        'Can Marçà Cave is the precious outcome of hundreds of thousands of years of patient dance between limestone bedrock, water, and time. Protecting this fragile underground sanctuary ensures it remains a wonder for generations to come.',
      restart: 'Restart Tour',
      changeLang: 'Change Language',
    },
    de: {
      title: 'Herzlichen Glückwunsch!',
      subtitle: 'Sie haben den Rundgang durch Can Marçà beendet',
      completedMsg: `Alle ${totalPoints} geologischen Stationen erfolgreich besucht.`,
      conservationTitle: 'Schutz unseres Höhlenerbes',
      conservationText:
        'Die Höhle von Can Marçà ist das Kunstwerk aus Hunderttausenden Jahren Erdgeschichte. Der Erhalt dieser empfindlichen Tropfsteinwelt liegt uns allen am Herzen.',
      restart: 'Rundgang neu starten',
      changeLang: 'Sprache wechseln',
    },
    fr: {
      title: 'Félicitations !',
      subtitle: 'Vous avez terminé la visite de Can Marçà',
      completedMsg: `Les ${totalPoints} stations géologiques ont été explorées.`,
      conservationTitle: 'Préservation du Patrimoine Souterrain',
      conservationText:
        'La Grotte de Can Marçà est le fruit de centaines de milliers d’années de dialogue entre la roche calcaire, l’eau et le temps. Préserver cet écosystème fragile est notre responsabilité partagée.',
      restart: 'Recommencer la visite',
      changeLang: 'Changer de langue',
    },
    it: {
      title: 'Congratulazioni!',
      subtitle: 'Hai completato il percorso di Can Marçà',
      completedMsg: `Completate con successo tutte le ${totalPoints} tappe geologiche.`,
      conservationTitle: 'Conservazione del Patrimonio Sotterraneo',
      conservationText:
        'La Grotta di Can Marçà rappresenta centinaia di migliaia di anni di modellamento naturale. Custodire questo tesoro roccioso permette alla sua magia di risplendere per sempre.',
      restart: 'Ricomincia il percorso',
      changeLang: 'Cambia lingua',
    },
    nl: {
      title: 'Gefeliciteerd!',
      subtitle: 'U heeft de tour door Can Marçà voltooid',
      completedMsg: `Succesvol alle ${totalPoints} geologische punten bezocht.`,
      conservationTitle: 'Behoud van Ondergronds Erfgoed',
      conservationText:
        'De Grot van Can Marçà is het resultaat van honderdduizenden jaren wisselwerking tussen kalksteen, water en tijd. Het beschermen van deze unieke omgeving is onze gezamenlijke missie.',
      restart: 'Tour opnieuw starten',
      changeLang: 'Taal wijzigen',
    },
    pt: {
      title: 'Parabéns!',
      subtitle: 'Completou a visita a Can Marçà',
      completedMsg: `Completou com sucesso as ${totalPoints} estações geológicas.`,
      conservationTitle: 'Preservação do Património Subterrâneo',
      conservationText:
        'A Gruta de Can Marçà é o resultado de centenas de milhares de anos de paciência da natureza. Cuidar deste ecossistema calcário preserva a sua beleza para as próximas gerações.',
      restart: 'Reiniciar Visita',
      changeLang: 'Alterar Idioma',
    },
    ru: {
      title: 'Поздравляем!',
      subtitle: 'Вы завершили экскурсию по Кан Марса',
      completedMsg: `Успешно посещены все ${totalPoints} геологических станций.`,
      conservationTitle: 'Сохранение подземного наследия',
      conservationText:
        'Пещера Кан Марса — результат сотен тысяч лет терпеливого взаимодействия известняка, воды и времени. Забота об этой хрупкой подземной среде — наша общая ответственность.',
      restart: 'Начать заново',
      changeLang: 'Сменить язык',
    },
    pl: {
      title: 'Gratulacje!',
      subtitle: 'Ukończyłeś trasę po jaskini Can Marçà',
      completedMsg: `Pomyślnie odwiedzono wszystkie ${totalPoints} stacji geologicznych.`,
      conservationTitle: 'Ochrona podziemnego dziedzictwa',
      conservationText:
        'Jaskinia Can Marçà jest dziełem setek tysięcy lat cierpliwego oddziaływania skały wapiennej, wody i czasu. Dbanie o to unikalne środowisko to wspólne zobowiązanie.',
      restart: 'Rozpocznij ponownie',
      changeLang: 'Zmień język',
    },
    cs: {
      title: 'Gratulujeme!',
      subtitle: 'Dokončili jste prohlídku jeskyně Can Marçà',
      completedMsg: `Úspěšně navštíveno všech ${totalPoints} geologických zastavení.`,
      conservationTitle: 'Ochrana podzemního dědictví',
      conservationText:
        'Jeskyně Can Marçà je výsledkem stovek tisíc let trpělivého působení vápence, vody a času. Ochrana tohoto křehkého podzemního světa je naším společným posláním.',
      restart: 'Restartovat prohlídku',
      changeLang: 'Změnit jazyk',
    },
    ro: {
      title: 'Felicitări!',
      subtitle: 'Ați finalizat turul Peșterii Can Marçà',
      completedMsg: `Ați vizitat cu succes toate cele ${totalPoints} stații geologice.`,
      conservationTitle: 'Conservarea patrimoniului subteran',
      conservationText:
        'Peștera Can Marçà este rezultatul a sute de mii de ani de interacțiune răbdătoare între calcar, apă și timp. Protejarea acestui sanctuar fragil asigură păstrarea lui pentru generațiile viitoare.',
      restart: 'Reîncepe turul',
      changeLang: 'Schimbă limba',
    },
    zh: {
      title: '恭喜！',
      subtitle: '您已完成卡恩·马尔萨洞穴游览',
      completedMsg: `已成功探访全部 ${totalPoints} 个地质站点。`,
      conservationTitle: '保护地下自然遗产',
      conservationText:
        '卡恩·马尔萨洞穴是石灰岩、水和漫长岁月数十万年共同雕琢的珍贵杰作。保护这片脆弱的地下奇迹是我们共同的责任。',
      restart: '重新开始游览',
      changeLang: '更换语言',
    },
    ja: {
      title: 'おめでとうございます！',
      subtitle: 'カン・マルサ洞窟ツアーを完了しました',
      completedMsg: `全 ${totalPoints} カ所の地質スポットをすべて巡りました。`,
      conservationTitle: '地底の自然遺産の保護',
      conservationText:
        'カン・マルサ洞窟は、石灰岩・水・時間が何十万年もの年月をかけて織りなした貴重な遺産です。この繊細な環境を守ることは、私たち全員の責任です。',
      restart: 'ツアーをやり直す',
      changeLang: '言語を変更する',
    },
    ar: {
      title: 'تهانينا!',
      subtitle: 'لقد أكملت جولة كهف كان مارسا بنجاح',
      completedMsg: `تمت زيارة جميع المحطات الجيولوجية الـ ${totalPoints} بنجاح.`,
      conservationTitle: 'الحفاظ على التراث الجوفي',
      conservationText:
        'كهف كان مارسا هو نتيجة مئات الآلاف من السنين من التفاعل الصبور بين الصخور الجيرية والماء والزمن. إن حماية هذا المكان الهش واجب علينا جميعاً للأجيال القادمة.',
      restart: 'إعادة الجولة',
      changeLang: 'تغيير اللغة',
    },
  };

  const text = content[language] || content.es;

  const handleRestart = () => {
    StorageService.resetVisitorProgress(true);
    onRestartTour();
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col justify-between p-4 sm:p-6 pb-24 max-w-md mx-auto w-full text-center">
      <div className="space-y-6 pt-4">
        {/* Trophy Header */}
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-amber-300 text-stone-950 flex items-center justify-center mx-auto shadow-2xl shadow-amber-500/30">
            <Trophy className="w-10 h-10" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-stone-950 flex items-center justify-center font-bold text-xs mx-auto">
            ✓
          </div>
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif tracking-tight">
            {text.title}
          </h2>
          <p className="text-sm font-medium text-amber-400">{text.subtitle}</p>
          <p className="text-xs text-stone-400">{text.completedMsg}</p>
        </div>

        {/* Certificate Card */}
        <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-4 text-left space-y-3 shadow-xl">
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 border-b border-stone-800 pb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Certificado de Visita Can Marçà • 2026</span>
          </div>

          <div className="space-y-2 text-xs text-stone-300">
            <div className="flex items-center justify-between">
              <span className="text-stone-400">Puntos recorridos:</span>
              <span className="font-mono font-bold text-stone-100">10 / 10</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-400">Ubicación:</span>
              <span className="text-stone-100 font-medium">Puerto de San Miguel, Ibiza</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-400">Modo de visita:</span>
              <span className="text-stone-100 font-medium">Balizas Beacon + GPS + QR</span>
            </div>
          </div>
        </div>

        {/* Conservation Message */}
        <div className="bg-emerald-950/20 border border-emerald-800/40 rounded-2xl p-4 text-left space-y-2">
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-300">
            <Heart className="w-4 h-4 text-emerald-400" />
            <span>{text.conservationTitle}</span>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed font-sans">
            {text.conservationText}
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-2.5 pt-6">
        <button
          onClick={handleRestart}
          className="w-full py-3.5 px-5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center space-x-2"
        >
          <RotateCcw className="w-4 h-4 stroke-[2.5]" />
          <span>{text.restart}</span>
        </button>

        <button
          onClick={onOpenLanguageModal}
          className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-xs font-medium text-stone-300 transition-colors flex items-center justify-center space-x-2"
        >
          <Globe className="w-4 h-4 text-amber-400" />
          <span>{text.changeLang}</span>
        </button>
      </div>
    </div>
  );
};
