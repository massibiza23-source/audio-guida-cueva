import { LanguageCode } from '../types';

export interface KidsPointContent {
  title: string;
  subtitle: string;
  introCall: string; // e.g. "¡Hola amiguitos! ¡Jaja! ¡Soy Miki!"
  story: string;
  challenge: string; // Fun mini-game for kids to spot in the cave
  audioScript: string;
}

export const KIDS_TOUR_DATA: Record<string, Partial<Record<LanguageCode, KidsPointContent>> & { es: KidsPointContent }> = {
  'CM-01': {
    es: {
      title: '¡La Terraza Secreta de los Piratas!',
      subtitle: 'El mirador más alto de Ibiza con Miki',
      introCall: '¡Hola pequeños exploradores! ¡Jaja! ¡Soy Miki! ¡Bienvenidos a Can Marçà!',
      story: '¡Mirad hacia abajo, bien abajo! ¿Veis ese agua tan azul y esa islita en medio con forma de herradura? ¡Jaja! ¡Por ahí llegaban en barcas de madera los piratas y contrabandistas en las noches sin luna! Subían por las rocas escalando como lagartijas. Por cierto, ¿veis alguna lagartija de color verde o azul tomando el sol en las piedras? ¡Son las lagartijas mágicas de Ibiza, guardianas de la cueva!',
      challenge: '¿Quién es el primero en encontrar una lagartija pitiusa o un barco navegando en el mar?',
      audioScript: '¡Hola amiguitos, jaja! ¡Soy Miki el explorador! ¡Bienvenidos a la terraza secreta de la Cueva de Can Marçà! Mirad qué alto estamos sobre el mar... ¡más de cien metros! ¿Veis esa isla allá abajo con forma de herradura? ¡Ahí escondían sus barcos los piratas y contrabandistas por la noche! Y en estas rocas viven unas lagartijas verdes y azules súper rápidas. ¡Abrid bien los ojos, poneros la gorra de explorador, y seguidme que entramos en la cueva! ¡Jaja, vamos!',
    },
    en: {
      title: 'The Secret Pirate Lookout!',
      subtitle: 'Highest cliff terrace in Ibiza with Miki',
      introCall: 'Hello little explorers! Haha! I am Miki! Welcome to Can Marça!',
      story: 'Look all the way down! See that crystal blue water and that horseshoe-shaped island? Haha! That is where smugglers and pirates secretly sailed on dark moonless nights! They climbed the steep cliffs just like lizards. Can you spot any shiny green lizards basking on the rocks? They are the magical guardian lizards of Ibiza!',
      challenge: 'Who can be the first to spot a lizard or a boat down in the bay?',
      audioScript: 'Hey there, little explorers! Haha! I am Miki! Welcome to the highest cliff terrace in Ibiza! Look way down at that blue bay... Smugglers used to sneak their wooden boats right there at midnight! Put on your imaginary explorer hats and follow me inside the mysterious cave! Haha, let us go!',
    },
  },
  'CM-02': {
    es: {
      title: '¡La Gran Boca de Roca de la Cueva!',
      subtitle: 'Entrando en el corazón de la montaña',
      introCall: '¡Uuuuh! ¡Mirad qué puerta de roca tan misteriosa! ¡Jaja!',
      story: '¡Bienvenidos a la entrada secreta! Hace más de cien mil años, ¡toda esta cueva estaba llena de agua! Los ríos subterráneos cavaron esta roca gigante como si fuera un queso suizo lleno de agujeros. ¿Sentís ese vientecillo fresquito? ¡Es el aliento de la montaña! Los contrabandistas tapaban esta entrada con ramas secas para que nadie la encontrara desde el mar.',
      challenge: 'Toca suavemente la pared de roca: ¿está fría o caliente? ¡Siente la roca milenaria!',
      audioScript: '¡Uuuuh, mirad qué puerta de piedra tan misteriosa! ¡Jaja! ¡Hace más de cien mil años esto estaba inundado de agua! Los ríos excavaron la montaña como un queso lleno de túneles secretos. ¿Sentís qué fresquito hace aquí dentro? ¡Es como entrar en el castillo de un gigante de piedra! ¡Avanzad despacito y no toquéis las estalagmitas que son muy delicadas! ¡Jaja!',
    },
    en: {
      title: 'The Giant Cave Mouth!',
      subtitle: 'Entering deep into the mountain',
      introCall: 'Oooh! Look at this mysterious rocky entrance! Haha!',
      story: 'Welcome inside! Over 100,000 years ago, this whole cave was flooded with rushing water! The underground rivers carved these tunnels like Swiss cheese. Feel that cool breeze? Smugglers used to hide this secret entrance with pine branches so patrol boats could never see them!',
      challenge: 'Gently touch the rock wall: is it cold or warm? Feel the ancient stone!',
      audioScript: 'Oooh, look at this mysterious rocky entrance! Haha! Over one hundred thousand years ago, this was an underwater river! Feel how refreshingly cool it is inside? Step carefully and follow my footsteps into the secret chambers! Haha!',
    },
  },
  'CM-03': {
    es: {
      title: '¡Las Cortinas de Piedra y Códigos Secretos!',
      subtitle: 'Las marcas rojas de los contrabandistas',
      introCall: '¡Oíd, oíd, exploradores! ¡Jaja! ¡Mirad esas rocas que cuelgan!',
      story: '¡Guau! Mirad hacia arriba: esas rocas parecen cortinas gigantes de un teatro o sábanas de piedra onduladas. Los científicos las llaman bambalinas. Y ahora viene lo mejor: buscad en las paredes unas marcas misteriosas de color rojo y negro. ¡Eran las flechas secretas de los contrabandistas! Como no tenían Google Maps ni electricidad, pintaban símbolos con carbón y pintura roja para saber dónde esconder el tabaco, el café y las telas finas.',
      challenge: '¿Quién puede encontrar primero una marca roja o negra pintada en la roca?',
      audioScript: '¡Jaja! ¡Mirad qué formaciones tan curiosas! Esas rocas que cuelgan del techo parecen cortinas gigantes de un teatro. ¡Se llaman bambalinas! Y mirad con atención las paredes... ¿veis unas marcas rojas y negras? ¡No las toquéis! ¡Eran los códigos secretos que pintaban los contrabandistas para no perderse en la oscuridad con sus sacos de tesoros! ¡Qué listos eran, jaja!',
    },
    en: {
      title: 'Stone Curtains & Secret Smuggler Codes!',
      subtitle: 'Red signs and wavy rock draperies',
      introCall: 'Listen up, explorers! Haha! Look at those wavy hanging rocks!',
      story: 'Look up! Those hanging formations look like giant theater curtains carved out of stone! And look closely at the walls: do you see red and black painted marks? Those were secret signs left by smugglers to find their way through the dark with heavy sacks of coffee and silk!',
      challenge: 'Can you spot a red arrow or black mark on the rock wall?',
      audioScript: 'Haha! Look up at the ceiling! Those wavy stone folds look like giant theater curtains! And check out the red and black symbols on the rocks: they were the secret treasure maps drawn by real smugglers centuries ago! Incredible, haha!',
    },
  },
  'CM-04': {
    es: {
      title: '¡El Templo de los Animales Prehistóricos!',
      subtitle: 'Fósiles gigantes y huesos antiguos',
      introCall: '¡Caramba! ¡Parece la catedral subterránea de un dinosaurio! ¡Jaja!',
      story: '¡Esta sala es gigantesca! Mirad qué columnas tan altas. Pero lo más increíble es lo que encontraron los científicos enterrado aquí: ¡huesos fosilizados de animales que vivieron en Ibiza hace miles de años! Había un roedor prehistórico gigante llamado Hypnomys que era el rey de la cueva. ¡Imaginaros un ratón del tamaño de un gato gordo corriendo por estos pasadizos!',
      challenge: 'Imagina que eres un explorador con lupa buscando fósiles: ¿dónde crees que dormía el roedor gigante?',
      audioScript: '¡Caramba! ¡Mirad qué techo tan alto! ¡Parece el templo subterráneo de un gigante! Y en el suelo de esta sala los arqueólogos encontraron huesos fosilizados de animales prehistóricos extinguidos... ¡incluso un roedor gigante que vivía en Ibiza hace miles de años! ¡Somos auténticos detectives del tiempo, jaja!',
    },
    en: {
      title: 'Temple of Prehistoric Fossils!',
      subtitle: 'Ancient bones and giant chambers',
      introCall: 'Wow! This looks like a giant underground dinosaur cathedral! Haha!',
      story: 'This hall is enormous! Scientists discovered fossilized bones of animals that roamed Ibiza thousands of years ago, including a giant prehistoric dormouse that ruled these cave passages! Imagine a rodent as big as a chubby cat exploring these caverns!',
      challenge: 'Imagine you are a fossil hunter: where do you think the ancient creatures slept?',
      audioScript: 'Wow, look how high this cavern is! Haha! Archaeologists dug right here and found ancient fossil bones from animals that lived before humans even arrived in Ibiza! We are real-time detectives, haha!',
    },
  },
  'CM-05': {
    es: {
      title: '¡La Cascada Mágica de Luz y Sonido!',
      subtitle: 'Un espectáculo de agua brillante en la cueva',
      introCall: '¡Chas, chas! ¡Preparaos para la magia! ¡Jaja!',
      story: '¡Poneos cómodos porque viene la parte más alucinante de la cueva! Hace miles de años, por aquí caía un torrente de agua subterráneo con una fuerza tremenda que talló la roca en forma de cuenco. Hoy en día, revivimos esa cascada con un espectáculo de agua, música y luces de colores brillantes. ¡El agua brilla como esmeraldas, rubíes y zafiros!',
      challenge: '¡Cierra los ojos un segundo, escucha el sonido del agua y pide un deseo secreto!',
      audioScript: '¡Chas, chas! ¡Llegamos a la cascada mágica! ¡Jaja! Antiguamente el agua caía aquí rugiendo con fuerza y esculpió toda la piedra. ¡Fijaos cómo bailan las gotas con las luces de colores como si fueran joyas líquidas! ¡Pedid un deseo en silencio antes de que termine la música! ¡Jaja, qué pasada!',
    },
    en: {
      title: 'The Magical Waterfall of Lights!',
      subtitle: 'Sparkling subterranean light and water show',
      introCall: 'Splash! Get ready for pure magic! Haha!',
      story: 'Get ready for something truly spectacular! Thousands of years ago, a roaring subterranean waterfall carved this bowl-shaped cavern. Today, it comes to life with glowing jewel-toned lights, music, and shimmering cascading water!',
      challenge: 'Close your eyes for three seconds, listen to the rushing water, and make a secret wish!',
      audioScript: 'Splash, splash! Here is the magical waterfall! Haha! Watch the water sparkle with brilliant emerald and golden lights! Close your eyes, make a secret wish, and feel the magic of Can Marça! Haha!',
    },
  },
  'CM-06': {
    es: {
      title: '¡Los Lagos de los Deseos y las Hadas!',
      subtitle: 'Piscinas esmeraldas de agua cristalina',
      introCall: '¡Uaaau! ¡Mirad qué agua tan verde y limpia! ¡Jaja!',
      story: 'Estos pequeños lagos escalonados se llaman gours. Se forman muy despacito, gota a gota, a lo largo de siglos. El agua tiene minerales especiales que la hacen parecer de color verde esmeralda brillante. ¡Parecen jacuzzis hechos para duendecillos y hadas de la montaña! ¿Veis esas estalagmitas que salen del agua? Parecen colmillos de dragón.',
      challenge: 'Cuenta cuántos pequeños laguitos escalonados puedes ver.',
      audioScript: '¡Uaaau! ¡Mirad qué agua tan verde y transparente! Parece un lago encantado de duendecillos. Estas piscinas de piedra tardaron miles de años en formarse gota a gota. Y esas rocas puntiagudas que salen del agua parecen colmillos de dragón durmiente... ¡pero no tengáis miedo, que son de piedra! ¡Jaja!',
    },
    en: {
      title: 'Wishing Lakes of the Fairies!',
      subtitle: 'Emerald crystal pools and stepped dams',
      introCall: 'Woooow! Look at this sparkling emerald water! Haha!',
      story: 'These stepped pools took thousands of years to build, mineral drop by mineral drop! The clear green water looks like fairy pools or tiny dragon baths! See those spiky stalagmites poking out? They look just like sleeping dragon teeth!',
      challenge: 'Count how many stepped pools you can see!',
      audioScript: 'Woooow! Look at that emerald water! Haha! These natural stone pools formed drop by drop over thousands of years. The spiky rocks rising from the water look like sleeping dragon teeth! Haha, so cool!',
    },
  },
  'CM-07': {
    es: {
      title: '¡El Pasadizo de los Valientes Espeleólogos!',
      subtitle: 'Túnel estrecho y minerales brillantes',
      introCall: '¡Atención pandilla! ¡Cuidado con la cabeza! ¡Jaja!',
      story: '¡Estamos en el pasadizo más auténtico de la cueva! Durante muchos años, nadie podía pasar por aquí de pie; los primeros exploradores tuvieron que arrastrarse por el barro con cascos y linternas de carburo para descubrir qué había al otro lado. Si miráis con la linterna hacia el techo, veréis cristales de calcita que brillan como purpurina o diamantes.',
      challenge: '¡Camina en fila india como auténticos exploradores de expedición!',
      audioScript: '¡Atención exploradores, cuidado con la cabecita! ¡Jaja! Durante muchos años los espeleólogos tuvieron que gatear por este pasadizo para encontrar nuevas salas secretas. ¡Mirad cómo brillan las piedras cuando les da la luz, parecen diamantes diminutos! ¡Caminad en fila india como una auténtica expedición! ¡Jaja!',
    },
    en: {
      title: 'Cave Explorers Narrow Passage!',
      subtitle: 'Glittering crystals and adventurer tunnels',
      introCall: 'Watch your heads, explorers crew! Haha!',
      story: 'This is the narrowest and most authentic tunnel! The first cave explorers had to crawl on their bellies through the mud with headlamps to discover what was on the other side. Look at the rock ceiling: tiny calcite crystals shine like diamonds in the dark!',
      challenge: 'Walk in a single file line like a real mountain expedition team!',
      audioScript: 'Watch your heads, team! Haha! Brave explorers had to crawl on their bellies through this tunnel with headlamps. Look at the ceiling: tiny calcite minerals sparkle like stars in the dark! Haha, on we march!',
    },
  },
  'CM-08': {
    es: {
      title: '¡El Abrazo de los Gigantes de Piedra!',
      subtitle: 'Columnas gigantescas que tardaron siglos en unirse',
      introCall: '¡Madre mía! ¡Qué columnas tan gigantescas! ¡Jaja!',
      story: '¿Sabéis cómo se forma una columna gigante? Una estalactita crece desde el techo hacia abajo, y una estalagmita crece desde el suelo hacia arriba. Cada cien años solo crecen un centímetro... ¡menos que vuestro dedo meñique! Y cuando por fin se tocan... ¡plas! ¡Se dan un abrazo de piedra y forman una columna eterna que sostiene el techo!',
      challenge: '¿Ves alguna estalactita del techo que esté a puntito de tocar a una del suelo pero aún le falte un trocito?',
      audioScript: '¡Madre mía! ¡Mirad qué pilares tan gigantes! ¡Jaja! ¿Sabéis cómo se forman? Una estalactita cae del techo y una estalagmita sube del suelo, creciendo despacito, despacito. Y cuando se tocan... ¡plas! ¡Se abrazan para siempre y forman una columna! ¡Han tardado miles de años en darse ese abrazo! ¡Jaja!',
    },
    en: {
      title: 'Hug of the Stone Giants!',
      subtitle: 'Massive columns that took millennia to meet',
      introCall: 'Holy moly! Look at these massive pillars! Haha!',
      story: 'Do you know how giant cave columns are made? A stalactite grows downwards from the ceiling, and a stalagmite grows upwards from the floor. They grow only one centimeter every century! When they finally meet in the middle... snap! They lock in an eternal stone hug!',
      challenge: 'Can you find a stalactite that almost touches the floor but is still missing a little gap?',
      audioScript: 'Holy moly! Look at these giant columns! Haha! A drip from the ceiling and a drip from the ground grew for thousands of years until they met in an eternal hug! Amazing, haha!',
    },
  },
  'CM-09': {
    es: {
      title: '¡El Pozo del Tesoro Secreto!',
      subtitle: 'El escondite más profundo de los contrabandistas',
      introCall: '¡Ssshhhh! ¡Bajad la voz amiguitos! ¡Jaja!',
      story: '¡Estamos en el escondite número uno! Este agujero tan hondo bajaba casi hasta el mar. Cuando los barcos de vigilancia se acercaban a la costa de Ibiza, los contrabandistas ataban sus sacos más valiosos con cuerdas gruesas y los subían volando por este pozo para esconderlos antes de que nadie pudiera verlos. ¡Aquí guardaban café caliente, especias aromáticas y telas doradas!',
      challenge: 'Asómate con cuidado y busca el fondo: ¿adivinas cuántos sacos cabían aquí?',
      audioScript: '¡Ssshhhh! ¡Bajad la voz, que estamos en el escondite secreto! ¡Jaja! Este pozo vertical era donde los contrabandistas escondían sus sacos más valiosos cuando venía la policía costera. ¡Subían los bultos con cuerdas en plena noche! ¡Menudo escondite tenían! ¡Jaja!',
    },
    en: {
      title: 'The Secret Treasure Well!',
      subtitle: 'Deepest hideout of the pirate smugglers',
      introCall: 'Shhhhh! Whisper, little explorers! Haha!',
      story: 'We have reached the top secret hideout! This deep vertical well drops straight down toward the sea. When patrol boats sailed into the bay, smugglers tied their most valuable cargo with thick ropes and hauled it up here in the pitch black night!',
      challenge: 'Peer safely into the shaft: imagine pulling up a pirate treasure chest!',
      audioScript: 'Shhhhh! Whisper, explorers! Haha! This deep shaft was where smugglers hauled up their most precious cargo with heavy ropes whenever coastal patrols drew near. The ultimate secret hideout, haha!',
    },
  },
  'CM-10': {
    es: {
      title: '¡Misión Cumplida! ¡Diploma de Explorador!',
      subtitle: 'Salida con vistas al mar y felicitación de Miki',
      introCall: '¡Yuuuuju! ¡Lo habéis conseguido! ¡Jaja! ¡Viva!',
      story: '¡Habéis cruzado toda la cueva como auténticos campeones y campeonas! Mirad qué luz de sol tan brillante y qué azul está el mar Mediterráneo desde este mirador. Ahora tenéis el título oficial de Pequeños Exploradores de Can Marçà. ¡Habéis conocido los secretos de los piratas, las rocas mágicas y los fósiles milenarios!',
      challenge: '¡Choca los cinco con tu familia o amigos y celebra que eres un explorador oficial!',
      audioScript: '¡Yuuuju! ¡Lo habéis conseguido! ¡Jaja! ¡Habéis completado toda la expedición a la Cueva de Can Marçà! Mirad qué azul está el mar y qué bonita la luz del sol. ¡Os habéis ganado el título de Exploradores Oficiales de la Cueva! ¡Chocad esos cinco y hasta la próxima gran aventura! ¡Jaja, adiós amigos!',
    },
    en: {
      title: 'Mission Complete! Official Explorer Badge!',
      subtitle: 'Exit viewpoint and celebration with Miki',
      introCall: 'Yaaay! You did it! Haha! Hooray!',
      story: 'You journeyed through the entire subterranean cave like true brave adventurers! Look at that sparkling sunlight and the deep blue Mediterranean sea from this cliff edge. You have earned your official Can Marça Cave Explorer honor!',
      challenge: 'High-five your family and celebrate your cave explorer victory!',
      audioScript: 'Yaaay! You did it! Haha! You completed the whole expedition through Can Marça Cave! You are now official Master Cave Explorers! High five everyone and see you on our next big adventure! Haha, bye bye friends!',
    },
  },
};
