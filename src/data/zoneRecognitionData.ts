import { LanguageCode } from '../types';

export interface CaveZoneData {
  pointId: string;
  order: number;
  name: string;
  caveSection: string;
  depthMeters: number; // e.g. -14
  elevationMeters: number; // elevation above sea level, e.g. +100 to +66
  temperatureCelsius: number;
  humidityPercent: number;
  lightingType: 'natural_sunlight' | 'subdued_warm' | 'aquatic_emerald' | 'waterfall_show' | 'amber_path';
  geologicalFeature: string;
  historicalSignificance?: string;
  recognitionHallmarks: Partial<Record<LanguageCode, string[]>> & { es: string[] };
  visualClues: Partial<Record<LanguageCode, { question: string; answer: string }>> & {
    es: { question: string; answer: string };
  };
  sampleImages: {
    url: string;
    caption: string;
  }[];
  mapCoordinates: {
    x: number; // percentage 0-100 on schematic
    y: number; // percentage 0-100 on schematic
    caveLevel: 'exterior' | 'nivel_superior' | 'nivel_medio' | 'nivel_profundo';
  };
}

export const CAVE_ZONES: CaveZoneData[] = [
  {
    pointId: 'CM-01',
    order: 1,
    name: 'Terraza Mirador',
    caveSection: 'Exterior / Acantilado de San Miguel',
    depthMeters: 0,
    elevationMeters: 105,
    temperatureCelsius: 24,
    humidityPercent: 62,
    lightingType: 'natural_sunlight',
    geologicalFeature: 'Acantilado calcáreo marino cretácico superior',
    historicalSignificance: 'Antigua atalaya de vigilancia costera frente a incursiones corsarias y nido de lagartija pitiusa.',
    recognitionHallmarks: {
      es: [
        'Vistas panorámicas abiertas al mar turquesa del Puerto de San Miguel',
        'Torre d’en Mular visible en el horizonte sobre el promontorio',
        'Isla Murada e Isla de Sa Ferradura en frente',
        'Luz solar directa y vegetación autóctona mediterránea (pinos, sabinas)',
      ],
      en: [
        'Open panoramic views of the turquoise sea at Puerto de San Miguel',
        'Torre d’en Mular watchtower visible on the promontory',
        'Murada Island and Sa Ferradura Island in direct view',
        'Direct sunlight and Mediterranean flora (pines, junipers)',
      ],
      de: [
        'Panoramablick auf das türkisfarbene Meer von Puerto de San Miguel',
        'Wehrturm Torre d’en Mular am Horizont sichtbar',
        'Inseln Murada und Sa Ferradura gegenüber',
        'Natürliches Sonnenlicht und mediterrane Vegetation',
      ],
      fr: [
        'Vue panoramique sur la mer turquoise du Port de San Miguel',
        'Tour de guet Torre d’en Mular visible sur le promontoire',
        'Îles Murada et Sa Ferradura en face',
        'Lumière naturelle et végétation méditerranéenne',
      ],
      it: [
        'Vista panoramica sul mare turchese di Porto di San Miguel',
        'Torre d’en Mular visibile sul promontorio',
        'Isole Murada e Sa Ferradura di fronte',
        'Luce solare naturale e macchia mediterranea',
      ],
    },
    visualClues: {
      es: {
        question: '¿Ves el mar azul, el acantilado y la torre de vigilancia al aire libre?',
        answer: 'Estás en la Terraza Mirador exterior (CM-01)',
      },
      en: {
        question: 'Do you see the blue open sea, high cliff, and coastal watchtower outside?',
        answer: 'You are at the Panoramic Terrace (CM-01)',
      },
      de: {
        question: 'Sehen Sie das offene Meer, die Klippen und den Wehrturm im Freien?',
        answer: 'Sie sind auf der Aussichtsterrasse (CM-01)',
      },
      fr: {
        question: 'Voyez-vous la mer bleue, la falaise et la tour de guet en extérieur ?',
        answer: 'Vous êtes sur la Terrasse Panoramique (CM-01)',
      },
      it: {
        question: 'Vedi il mare aperto, la scogliera e la torre di guardia all’aperto?',
        answer: 'Sei sulla Terrazza Panoramica (CM-01)',
      },
    },
    sampleImages: [
      {
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        caption: 'Terraza exterior con vistas a la bahía de San Miguel',
      },
    ],
    mapCoordinates: { x: 12, y: 15, caveLevel: 'exterior' },
  },
  {
    pointId: 'CM-02',
    order: 2,
    name: 'Boca de Entrada',
    caveSection: 'Acceso Kárstico Principal',
    depthMeters: -3,
    elevationMeters: 98,
    temperatureCelsius: 21,
    humidityPercent: 78,
    lightingType: 'subdued_warm',
    geologicalFeature: 'Fractura tectónica diaclasada y disolución kárstica inicial',
    historicalSignificance: 'Entrada natural utilizada por exploradores y espeleólogos.',
    recognitionHallmarks: {
      es: [
        'Transición de luz exterior a la penumbra de la cueva',
        'Bóveda rocosa caliza maciza con fracturas verticales tectónicas',
        'Primer descenso por rampa y pasarela de piedra protegida',
        'Notable caída de temperatura y aumento de humedad fresca',
      ],
      en: [
        'Transition from exterior daylight into the subterranean dimness',
        'Massive limestone vaulted ceiling with vertical tectonic fractures',
        'First descent along the stone ramp and guarded walkway',
        'Noticeable temperature drop and fresh humidity rush',
      ],
      de: [
        'Übergang vom Tageslicht in das unterirdische Halbdunkel',
        'Massives Kalksteingewölbe mit vertikalen tektonischen Spalten',
        'Erster Abstieg über eine gesicherte Steinrampe',
        'Spürbarer Temperaturabfall und angenehme Kühle',
      ],
      fr: [
        'Transition entre la lumière du jour et la pénombre souterraine',
        'Voûte calcaire massive avec fractures tectoniques verticales',
        'Première descente le long de la rampe de pierre sécurisée',
        'Baisse marquée de température et montée de fraîcheur',
      ],
      it: [
        'Transizione dalla luce del giorno alla penombra sotterranea',
        'Volta calcarea massiccia con fratture tettoniche verticali',
        'Prima discesa lungo la passerella protetta',
        'Netto calo termico e aria fresca e umida',
      ],
    },
    visualClues: {
      es: {
        question: '¿Estás cruzando la gran boca de roca calcárea entrando a la oscuridad?',
        answer: 'Estás en la Entrada Kárstica (CM-02)',
      },
      en: {
        question: 'Are you stepping into the giant limestone rock opening into darkness?',
        answer: 'You are at Cave Entrance (CM-02)',
      },
      de: {
        question: 'Betreten Sie die gewaltige Felsöffnung in das Höhleninnere?',
        answer: 'Sie sind am Höhleneingang (CM-02)',
      },
      fr: {
        question: 'Pénétrez-vous dans la grande ouverture rocheuse vers la pénombre ?',
        answer: 'Vous êtes à l’Entrée Kárstique (CM-02)',
      },
      it: {
        question: 'Stai varcando la grande bocca di roccia addentrandoti nel buio?',
        answer: 'Sei all’Ingresso della Grotta (CM-02)',
      },
    },
    sampleImages: [
      {
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
        caption: 'Acceso kárstico entre murallones de caliza',
      },
    ],
    mapCoordinates: { x: 22, y: 26, caveLevel: 'nivel_superior' },
  },
  {
    pointId: 'CM-03',
    order: 3,
    name: 'Bambalinas y Contrabandistas',
    caveSection: 'Galería de los Escondrijos',
    depthMeters: -6,
    elevationMeters: 92,
    temperatureCelsius: 20,
    humidityPercent: 82,
    lightingType: 'subdued_warm',
    geologicalFeature: 'Draperías y cortinas de calcita espelotémica (bambalinas)',
    historicalSignificance: 'Almacén de fardos de tabaco de contrabando, sedas y café traídos en faluchos por la noche.',
    recognitionHallmarks: {
      es: [
        'Formaciones rocosas colgantes onduladas y translúcidas como cortinajes o bambalinas',
        'Huecos y recovecos naturales donde se ocultaban los fardos de contrabando',
        'Relieves acanalados tallados por el escurrimiento de láminas de agua milenarias',
        'Iluminación rasante cálida que resalta los pliegues minerales',
      ],
      en: [
        'Hanging wavy and translucent calcite formations like theatrical curtains (draperies)',
        'Natural recesses and niches once used to conceal contraband bales',
        'Fluted fluting sculpted by thousands of years of flowing mineral water sheets',
        'Warm raking lighting highlighting mineral stone folds',
      ],
      de: [
        'Gewellte, teils lichtdurchlässige Sinterfahnen wie Vorhänge',
        'Natürliche Nischen zum Verstecken von Schmuggelware',
        'Gewellte Kalzitrippen, geformt durch herablaufende Wasserfilme',
        'Warme Streiflichtbeleuchtung, die Gesteinsfalten betont',
      ],
      fr: [
        'Draperies de calcite plissées et ondulées semblables à des rideaux de théâtre',
        'Niches rocheuses où étaient cachés les ballotins de contrebande',
        'Nervures sculptées par le lent écoulement de pellicules d’eau',
        'Éclairage rasant chaleureux révélant les replis minéraux',
      ],
      it: [
        'Drappeggi di calcite ondulati e traslucidi come tende teatrali (bambalinas)',
        'Anfratti naturali utilizzati un tempo come magazzino clandestino',
        'Costolature scolpite da millenni di veli d’acqua minerale',
        'Illuminazione radente calda sui rilievi della pietra',
      ],
    },
    visualClues: {
      es: {
        question: '¿Ves velos ondulados de roca como cortinas de tela colgando del techo?',
        answer: 'Estás en la Sala de Bambalinas y Contrabandistas (CM-03)',
      },
      en: {
        question: 'Do you see wavy rock folds like cloth curtains hanging from the ceiling?',
        answer: 'You are at Smugglers Draperies Hall (CM-03)',
      },
      de: {
        question: 'Sehen Sie gewellte Felsfalten wie steinerne Vorhänge von der Decke?',
        answer: 'Sie sind im Schmuggler-Saal mit Sinterfahnen (CM-03)',
      },
      fr: {
        question: 'Voyez-vous des voiles rocheux ondulés comme des rideaux de tissu ?',
        answer: 'Vous êtes dans la Salle des Draperies des Contrebandiers (CM-03)',
      },
      it: {
        question: 'Vedi drappeggi ondulati di roccia come tende di tessuto sul soffitto?',
        answer: 'Sei nella Sala dei Drappeggi e Contrabbandieri (CM-03)',
      },
    },
    sampleImages: [
      {
        url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
        caption: 'Bambalinas de calcita pura onduladas',
      },
    ],
    mapCoordinates: { x: 33, y: 38, caveLevel: 'nivel_superior' },
  },
  {
    pointId: 'CM-04',
    order: 4,
    name: 'El Lago y Templo de Buda',
    caveSection: 'Cripta del Espejo de Agua',
    depthMeters: -9,
    elevationMeters: 85,
    temperatureCelsius: 20,
    humidityPercent: 86,
    lightingType: 'aquatic_emerald',
    geologicalFeature: 'Gour estalagmítico masivo y balsa freática tranquila',
    historicalSignificance: 'Punto de silencio y contemplación; una estalagmita solitaria recuerda la postura del loto de Buda.',
    recognitionHallmarks: {
      es: [
        'Gran lago subterráneo de aguas cristalinas e inmóviles que actúan como espejo',
        'Estalagmita vertical aislada que reproduce la silueta de un Buda en meditación',
        'Reflejo de las estalactitas del techo sobre la superficie del agua quieta',
        'Acústica silenciosa y envolvente con eco sereno',
      ],
      en: [
        'Vast subterranean lake with crystal calm water reflecting the cave ceiling',
        'Solitary stalagmite closely evoking the silhouette of a seated meditating Buddha',
        'Mirror reflection of ceiling speleothems across the tranquil water surface',
        'Serene, hushed cavern acoustics with soft echo',
      ],
      de: [
        'Großer unterirdischer See mit spiegelglatter, kristallklarer Wasseroberfläche',
        'Solitärer Tropfstein, der an die Figur eines sitzenden Buddhas erinnert',
        'Spiegelung der Deckenzacken auf dem ruhigen Wasser',
        'Stille, andächtige Höhlenakustik',
      ],
      fr: [
        'Grand lac souterrain aux eaux limpides agissant comme un miroir',
        'Stalagmite isolée dont la forme évoque un Bouddha en méditation',
        'Reflet parfait des concrétions du plafond sur l’eau calme',
        'Atmosphère feutrée et sérénité acoustique',
      ],
      it: [
        'Grande lago sotterraneo dalle acque calme e cristalline a specchio',
        'Stalagmite solitaria che ricorda la silhouette di un Buddha in meditazione',
        'Riflesso delle formazioni rocciose sulla superficie dell’acqua',
        'Acustica raccolta e suggestiva',
      ],
    },
    visualClues: {
      es: {
        question: '¿Ves una balsa de agua cristalina y una estalagmita con forma de Buda meditando?',
        answer: 'Estás en el Lago y Templo de Buda (CM-04)',
      },
      en: {
        question: 'Do you see a crystal lake reflecting a rock figure resembling a seated Buddha?',
        answer: 'You are at Lake and Buddha Temple (CM-04)',
      },
      de: {
        question: 'Sehen Sie einen spiegelnden See und eine Felsfigur wie ein meditierender Buddha?',
        answer: 'Sie sind an den Seen & Buddha-Tempel (CM-04)',
      },
      fr: {
        question: 'Voyez-vous un bassin d’eau limpide et un rocher rappelant Bouddha assis ?',
        answer: 'Vous êtes aux Lacs et Temple de Bouddha (CM-04)',
      },
      it: {
        question: 'Vedi uno specchio d’acqua calma e una roccia a forma di Buddha?',
        answer: 'Sei ai Laghi e Tempio di Buddha (CM-04)',
      },
    },
    sampleImages: [
      {
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
        caption: 'Balsa subterránea y silueta del Templo de Buda',
      },
    ],
    mapCoordinates: { x: 45, y: 50, caveLevel: 'nivel_medio' },
  },
  {
    pointId: 'CM-05',
    order: 5,
    name: 'Niveles de Calcita',
    caveSection: 'Corredor de los Paleoniveles',
    depthMeters: -11,
    elevationMeters: 80,
    temperatureCelsius: 20,
    humidityPercent: 84,
    lightingType: 'subdued_warm',
    geologicalFeature: 'Marcas de incrustación de carbonato horizontal y terrazas de travertino',
    historicalSignificance: 'Registro paleoclimático de las fluctuaciones del nivel del agua en las glaciaciones.',
    recognitionHallmarks: {
      es: [
        'Franjas y líneas horizontales continuas grabadas en la pared a distintas alturas',
        'Borde de calcificación que indica la antigua superficie de inundación',
        'Cambios de textura en la roca: más lisa bajo la línea y con espeleotemas arriba',
        'Pasillo estrecho flanqueado por estratos geológicos visibles',
      ],
      en: [
        'Continuous horizontal stripes and waterlines etched into walls at various heights',
        'Calcified bathtub-ring mineral deposits marking ancient flood surfaces',
        'Texture shifts on the rock: smoother below the line and concretions above',
        'Narrow gallery flanked by clear geological strata',
      ],
      de: [
        'Durchgehende horizontale Kalzitstreifen an den Wänden in verschiedenen Höhen',
        'Kalkkrusten, die frühere Wasserhöchststände belegen',
        'Texturunterschiede: glatt unterhalb der Linie, Tropfsteine oberhalb',
        'Enger Gang mit deutlich sichtbaren Gesteinsschichten',
      ],
      fr: [
        'Lignes et bandes horizontales continues gravées sur les parois à diverses hauteurs',
        'Bordures de calcification traçant le niveau des anciennes crues',
        'Roche polie sous la ligne et concrétions au-dessus',
        'Galerie bordée de strates géologiques bien visibles',
      ],
      it: [
        'Fasce e linee orizzontali continue impresse nelle pareti a diverse altezze',
        'Bordi di calcificazione che testimoniano antichi allagamenti',
        'Roccia levigata sotto la linea e formazioni sopra',
        'Stretta galleria con strati geologici ben definiti',
      ],
    },
    visualClues: {
      es: {
        question: '¿Ves líneas horizontales nítidas en las paredes rocosas marcando alturas del agua?',
        answer: 'Estás en los Niveles de Calcita (CM-05)',
      },
      en: {
        question: 'Do you see crisp horizontal bands etched along the canyon walls like water marks?',
        answer: 'You are at Calcite Waterlines (CM-05)',
      },
      de: {
        question: 'Sehen Sie waagerechte Linien an den Felswänden wie alte Wasserpegel?',
        answer: 'Sie sind bei den Kalzitschichten (CM-05)',
      },
      fr: {
        question: 'Voyez-vous des lignes horizontales nettes marquant la hauteur de l’eau passée ?',
        answer: 'Vous êtes aux Niveaux de Calcite (CM-05)',
      },
      it: {
        question: 'Vedi nette righe orizzontali incise sulle pareti di roccia?',
        answer: 'Sei ai Livelli di Calcite (CM-05)',
      },
    },
    sampleImages: [
      {
        url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
        caption: 'Marcas horizontales dejadas por el nivel freático milenario',
      },
    ],
    mapCoordinates: { x: 57, y: 55, caveLevel: 'nivel_medio' },
  },
  {
    pointId: 'CM-06',
    order: 6,
    name: 'Vía de Escape',
    caveSection: 'Bifurcación de los Contrabandistas',
    depthMeters: -12,
    elevationMeters: 76,
    temperatureCelsius: 20,
    humidityPercent: 83,
    lightingType: 'subdued_warm',
    geologicalFeature: 'Galería con señales pictográficas clandestinas sobre caliza',
    historicalSignificance: 'Marcas de evacuación pintadas por contrabandistas con hollín y almagre rojo para emergencias.',
    recognitionHallmarks: {
      es: [
        'Marcas de pintura roja y negra sobre la pared de piedra a la derecha del sendero',
        'Flechas y signos geométricos secretos de orientación',
        'Bifurcación hacia un pozo o hendidura angosta de escape',
        'Ambiente con penumbra misteriosa que recrea el sigilo clandestino',
      ],
      en: [
        'Red and black hand-painted symbols on the right-hand rock face',
        'Cryptic arrows and geometric wayfinding codes made with charcoal and ochre',
        'Fork leading into a narrow natural chimney / emergency escape cleft',
        'Atmospheric shadowy glow recreating the clandestine smuggler route',
      ],
      de: [
        'Rote und schwarze Farbmarkierungen an der rechten Felswand',
        'Geheime Pfeile und geometrische Orientierungszeichen',
        'Abzweigung zu einem engen Fluchtspalt im Fels',
        'Mystische Pufferbeleuchtung, die an heimliche Schmugglerzüge erinnert',
      ],
      fr: [
        'Traces et peintures rouges et noires sur la paroi rocheuse à droite',
        'Flèches et symboles géométriques servant de boussole clandestine',
        'Bifurcation menant à une faille étroite de secours',
        'Ambiance feutrée évoquant les fuites nocturnes',
      ],
      it: [
        'Segni di pittura rossa e nera sulla parete di roccia a destra',
        'Frecce e simboli segreti usati per orientarsi al buio',
        'Biforcazione verso uno stretto cunicolo di fuga',
        'Atmosfera carica di mistero e storia marinaresca',
      ],
    },
    visualClues: {
      es: {
        question: '¿Ves marcas de pintura roja y negra en la roca que servían de código secreto?',
        answer: 'Estás en la Vía de Escape de los Contrabandistas (CM-06)',
      },
      en: {
        question: 'Do you see red and black hand markings on the rock used as secret escape signals?',
        answer: 'You are at The Escape Route (CM-06)',
      },
      de: {
        question: 'Sehen Sie rote und schwarze Zeichen an der Felswand als geheimen Code?',
        answer: 'Sie sind am Fluchtweg der Schmuggler (CM-06)',
      },
      fr: {
        question: 'Voyez-vous des traces peintes en rouge et noir sur la roche ?',
        answer: 'Vous êtes sur la Voie d’Échappatoire (CM-06)',
      },
      it: {
        question: 'Vedi marcature rosse e nere sulla roccia usate come codice segreto?',
        answer: 'Sei sulla Via di Fuga (CM-06)',
      },
    },
    sampleImages: [
      {
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
        caption: 'Marcas de señalización de los antiguos contrabandistas',
      },
    ],
    mapCoordinates: { x: 68, y: 62, caveLevel: 'nivel_medio' },
  },
  {
    pointId: 'CM-07',
    order: 7,
    name: 'Sala de la Cascada',
    caveSection: 'El Vórtice Central',
    depthMeters: -14,
    elevationMeters: 70,
    temperatureCelsius: 19,
    humidityPercent: 92,
    lightingType: 'waterfall_show',
    geologicalFeature: 'Gorg de caída vertical y marmita de gigante kárstica',
    historicalSignificance: 'Gran sala escénica con caída de agua y juego de iluminación y sonido.',
    recognitionHallmarks: {
      es: [
        'Gran chorro continuo de agua que cae verticalmente sobre una balsa rocosa',
        'Sonido intenso y constante del murmullo del agua en cascada',
        'Iluminación dinámica con cambios tonales de luz azul, dorada y magenta',
        'Bruma fresca en suspensión y el punto más profundo del recorrido (-14 metros)',
      ],
      en: [
        'Dramatic waterfall plummeting vertically into a natural rock basin',
        'Rushing, resonant sound of flowing water echoing across the hall',
        'Dynamic light choreography shifting between deep blue, amber, and violet tones',
        'Cool suspended mist and the deepest station along the tour (-14 meters)',
      ],
      de: [
        'Eindrucksvoller Wasserfall, der senkrecht in ein Felsbecken stürzt',
        'Rauschen des Wassers erfüllt die gesamte Felsenkammer',
        'Stimmungsvolles Lichtspiel mit wechselnden Blau- und Goldtönen',
        'Feiner Sprühnebel und tiefster Punkt des Rundgangs (-14 Meter)',
      ],
      fr: [
        'Chute d’eau verticale se déversant dans une cuvette rocheuse',
        'Murmure puissant et continu de l’eau résonnant dans la salle',
        'Jeu de lumières dynamique oscillant entre bleu profond, or et violet',
        'Brume rafraîchissante et point le plus profond de la visite (-14 m)',
      ],
      it: [
        'Spettacolare salto d’acqua che precipita in un bacino di roccia',
        'Fragore scrosciante dell’acqua che rimbomba nella sala',
        'Spettacolo di luci cromatiche tra blu, ambra e magenta',
        'Vapore acqueo rinfrescante e punto più profondo del percorso (-14 metri)',
      ],
    },
    visualClues: {
      es: {
        question: '¿Ves una cascada con agua cayendo de lo alto y un espectáculo de luces y sonido?',
        answer: 'Estás en la Sala de la Cascada (CM-07)',
      },
      en: {
        question: 'Do you see a flowing waterfall plunging from above with lights and music?',
        answer: 'You are at The Waterfall Chamber (CM-07)',
      },
      de: {
        question: 'Sehen Sie einen Wasserfall mit fallendem Wasser und Farbspiel?',
        answer: 'Sie sind in der Wasserfall-Halle (CM-07)',
      },
      fr: {
        question: 'Voyez-vous une cascade jaillissante avec jeux de lumière et musique ?',
        answer: 'Vous êtes dans la Salle de la Cascade (CM-07)',
      },
      it: {
        question: 'Vedi una cascata con acqua che cade dall’alto illuminata da luci colorate?',
        answer: 'Sei nella Sala della Cascata (CM-07)',
      },
    },
    sampleImages: [
      {
        url: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80',
        caption: 'Caída de agua en la sala central de Can Marçà',
      },
    ],
    mapCoordinates: { x: 79, y: 72, caveLevel: 'nivel_profundo' },
  },
  {
    pointId: 'CM-08',
    order: 8,
    name: 'Lagos Verdes Esmeralda',
    caveSection: 'Cripta de los Minerales de Cobre',
    depthMeters: -13,
    elevationMeters: 72,
    temperatureCelsius: 20,
    humidityPercent: 88,
    lightingType: 'aquatic_emerald',
    geologicalFeature: 'Gours escalonados con sedimentación de carbonato y sales cúpricas',
    historicalSignificance: 'Pozas escalonadas de agua de color verde fosforescente fascinante.',
    recognitionHallmarks: {
      es: [
        'Color verde esmeralda y turquesa brillante en el agua de las pozas',
        'Terrazas escalonadas de calcita blanca (gours) que retienen el agua',
        'Fondo cristalino donde se aprecian sedimentos minerales luminiscentes',
        'Foco de luz sumergido o dirigido que acentúa la fosforescencia verdosa',
      ],
      en: [
        'Vibrant emerald and glowing turquoise water in shallow tiered basins',
        'Stepped white calcite dams (rimstone gours) trapping the pools',
        'Pure crystal bottom showing sparkling mineral deposits',
        'Subtle illumination highlighting the water’s surreal green glow',
      ],
      de: [
        'Leuchtend smaragdgrünes und türkisfarbenes Wasser in den Becken',
        'Kaskadenförmige weiße Kalzitbecken (Gours), die das Wasser stauen',
        'Kristallklarer Boden mit funkelnden Mineralschichten',
        'Beleuchtung, die das smaragdgrüne Schimmern verstärkt',
      ],
      fr: [
        'Teinte émeraude et turquoise intense dans les vasques rocheuses',
        'Bassins en gradins de calcite blanche (gours) retenant l’eau',
        'Fond cristallin révélant des dépôts minéraux luminescents',
        'Lumière tamisée magnifiant l’éclat émeraude',
      ],
      it: [
        'Colore verde smeraldo e turchese vivido nelle pozze d’acqua',
        'Vasche a gradoni di calcite bianca (gours) che trattengono l’acqua',
        'Fondo trasparente con sedimenti minerali brillanti',
        'Illuminazione studiata per esaltare il bagliore smeraldo',
      ],
    },
    visualClues: {
      es: {
        question: '¿Ves charcas de agua con un color verde esmeralda brillante en terrazas?',
        answer: 'Estás en los Lagos Verdes (CM-08)',
      },
      en: {
        question: 'Do you see tiered shallow pools filled with vivid emerald-green water?',
        answer: 'You are at The Green Lakes (CM-08)',
      },
      de: {
        question: 'Sehen Sie gestufte Felsbecken mit strahlend smaragdgrünem Wasser?',
        answer: 'Sie sind bei den Grünen Seen (CM-08)',
      },
      fr: {
        question: 'Voyez-vous des vasques en gradins d’une couleur vert émeraude éclatante ?',
        answer: 'Vous êtes aux Lacs Verts (CM-08)',
      },
      it: {
        question: 'Vedi vasche a gradoni con acqua dal colore verde smeraldo fluorescente?',
        answer: 'Sei ai Laghi Verdi (CM-08)',
      },
    },
    sampleImages: [
      {
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        caption: 'Tonalidad esmeralda de las pozas kársticas',
      },
    ],
    mapCoordinates: { x: 74, y: 56, caveLevel: 'nivel_profundo' },
  },
  {
    pointId: 'CM-09',
    order: 9,
    name: 'La Zona Seca y Fósil',
    caveSection: 'Bóveda del Tiempo Detenido',
    depthMeters: -8,
    elevationMeters: 84,
    temperatureCelsius: 20,
    humidityPercent: 74,
    lightingType: 'subdued_warm',
    geologicalFeature: 'Espeleotemas fósiles sin acreción activa e inactividad hidrológica',
    historicalSignificance: 'Muestra palpable del cambio climático natural y la desaceleración del goteo.',
    recognitionHallmarks: {
      es: [
        'Ausencia de goteo o humedad en el suelo; suelo seco y polvoriento de calcita',
        'Cientos de estalactitas y estalagmitas fósiles de aspecto petrificado mate',
        'Bóveda alta repleta de columnas formadas por la unión de estalactita y estalagmita',
        'Sensación de silencio absoluto y atmósfera más templada y seca',
      ],
      en: [
        'Absence of active dripping or puddles on the ground; dry calcite floor',
        'Hundreds of fossilized stalactites and stalagmites with matte stone patina',
        'High vaulted hall studded with massive columns formed by fused speleothems',
        'Atmosphere of absolute stillness with slightly drier air',
      ],
      de: [
        'Kein Tropfen oder Pfützen am Boden; trockener, staubiger Untergrund',
        'Hunderte versteinerte Tropfsteine mit matter Oberfläche',
        'Hohes Gewölbe mit massiven Säulen aus zusammengewachsenen Stalaktiten und Stalagmiten',
        'Vollkommene Stille und spürbar trockenere Luft',
      ],
      fr: [
        'Absence totale de gouttes ou de flaques d’eau au sol; sol sec',
        'Centaines de stalactites et stalagmites fossilisées au fini mat',
        'Grande voûte ornée de colonnes formées par la fusion des concrétions',
        'Sensation de silence immobile et air plus sec',
      ],
      it: [
        'Assenza di stillicidio e suolo privo di pozzanghere; fondo asciutto',
        'Centinaia di stalattiti e stalagmiti fossili dall’aspetto opaco e millenario',
        'Alta volta costellata da colonne congiunte tra soffitto e pavimento',
        'Silenzio totale e aria più asciutta',
      ],
    },
    visualClues: {
      es: {
        question: '¿Ves un techo lleno de estalactitas fósiles donde no cae ni una gota de agua?',
        answer: 'Estás en la Zona Seca (CM-09)',
      },
      en: {
        question: 'Do you see a ceiling crowded with fossil stalactites where no water drips?',
        answer: 'You are at The Dry Zone (CM-09)',
      },
      de: {
        question: 'Sehen Sie eine Decke voller Tropfsteine, von der kein Wasser mehr tropft?',
        answer: 'Sie sind in der Trockenen Zone (CM-09)',
      },
      fr: {
        question: 'Voyez-vous un plafond couvert de stalactites fossiles sans goutte d’eau ?',
        answer: 'Vous êtes dans la Zone Sèche (CM-09)',
      },
      it: {
        question: 'Vedi una volta fitta di stalattiti fossili senza alcuna goccia d’acqua?',
        answer: 'Sei nella Zona Secca (CM-09)',
      },
    },
    sampleImages: [
      {
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
        caption: 'Estalactitas y columnas fósiles en reposo',
      },
    ],
    mapCoordinates: { x: 50, y: 32, caveLevel: 'nivel_superior' },
  },
  {
    pointId: 'CM-10',
    order: 10,
    name: 'Galería Final y Conservación',
    caveSection: 'Salida y Legado de Ibiza',
    depthMeters: -2,
    elevationMeters: 96,
    temperatureCelsius: 22,
    humidityPercent: 68,
    lightingType: 'natural_sunlight',
    geologicalFeature: 'Galería de transición kárstica hacia la salida del acantilado',
    historicalSignificance: 'Mensaje de custodia medioambiental para proteger el santuario geológico de Can Marçà.',
    recognitionHallmarks: {
      es: [
        'Luz natural visible al final del pasaje que anuncia el regreso al exterior',
        'Panel informativo de conservación y respeto al ecosistema subterráneo',
        'Último tramo de escalones y rampa de salida hacia el sendero del acantilado',
        'Brisa marina fresca que vuelve a sentirse en el rostro',
      ],
      en: [
        'Daylight visible at the end of the corridor heralding the exit',
        'Environmental conservation and heritage protection board',
        'Final stone steps and gentle ramp ascending back to the cliff walkway',
        'Fresh coastal sea breeze felt once more',
      ],
      de: [
        'Tageslicht am Ende des Ganges kündigt den Höhlenausgang an',
        'Informationstafel zum Naturschutz und Erhalt des Höhlenökosystems',
        'Letzte Stufen und Rampe zurück zum Klippenweg',
        'Frische Meeresbrise wieder spürbar',
      ],
      fr: [
        'Lumière du jour visible au bout de la galerie annonçant la sortie',
        'Panneau d’information sur la protection de l’écosystème de la grotte',
        'Derniers escaliers et rampe remontant vers le sentier côtier',
        'Brise marine à nouveau perceptible',
      ],
      it: [
        'Luce naturale in fondo al corridoio che annuncia l’uscita',
        'Pannello informativo sulla conservazione del patrimonio naturale',
        'Ultimi gradini e rampa di risalita verso il sentiero della scogliera',
        'Brezza marina fresca che torna ad accarezzare il viso',
      ],
    },
    visualClues: {
      es: {
        question: '¿Ves la claridad de la salida y paneles de despedida y conservación?',
        answer: 'Estás en la Salida y Conservación (CM-10)',
      },
      en: {
        question: 'Do you see natural light ahead and conservation panels at the exit?',
        answer: 'You are at Conservation & Farewell (CM-10)',
      },
      de: {
        question: 'Sehen Sie das Licht des Ausgangs und Tafeln zum Naturschutz?',
        answer: 'Sie sind bei Naturschutz und Abschied (CM-10)',
      },
      fr: {
        question: 'Voyez-vous la clarté de la sortie et les panneaux de préservation ?',
        answer: 'Vous êtes à la Préservation et Sortie (CM-10)',
      },
      it: {
        question: 'Vedi la luce dell’uscita e i pannelli di congedo e rispetto ambientale?',
        answer: 'Sei al Saluto Finale e Conservazione (CM-10)',
      },
    },
    sampleImages: [
      {
        url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
        caption: 'Última galería de Can Marçà hacia el acantilado',
      },
    ],
    mapCoordinates: { x: 26, y: 18, caveLevel: 'exterior' },
  },
];
