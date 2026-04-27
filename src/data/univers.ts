export type UniversId = "esprit" | "corps" | "liens" | "monde" | "avenir";

export interface SubTopicFaq {
  question: string;
  answer: string;
}

export interface SubTopic {
  slug: string;
  label: string;
  description?: string;
  faq?: SubTopicFaq[];
  related?: string[];
}

export interface Univers {
  id: UniversId;
  name: string;
  tagline: string;
  color: string;
  dark: string;
  subtopics: SubTopic[];
}

export interface ArticleData {
  id: number;
  univers: UniversId;
  subtopic: string;
  date: string;
  popularity: number;
  title: string;
  href: string;
  imgSrc: string;
  imgAlt: string;
  timeLabel: string;
  format: string;
  headline: string;
  headlineEm: string;
  headlineSuffix: string;
  excerpt: string;
  author: string;
  readTime: string;
  isPaywall?: boolean;
  isVideo?: boolean;
  schemaType: string;
}

export const UNIVERS: Univers[] = [
  {
    id: "esprit",
    name: "L'Esprit",
    tagline: "Comprendre ce qui se joue en nous, pour mieux vivre avec les autres.",
    color: "#7B5CD6",
    dark: "#4A2FA8",
    subtopics: [
      { slug: "emotions", label: "Émotions", description: "Colère, joie, tristesse, peur : nos émotions ne sont pas des faiblesses. Elles sont des signaux. Apprendre à les décoder, c'est reprendre le contrôle de ce qui nous traverse au quotidien.", faq: [{ question: "Pourquoi est-il important de comprendre ses émotions ?", answer: "Les émotions influencent nos décisions, nos relations et notre santé. Les identifier permet de mieux réagir aux situations stressantes et d'améliorer son bien-être général." }, { question: "Comment mieux gérer ses émotions au quotidien ?", answer: "La pleine conscience, l'écriture expressive et la respiration profonde sont des techniques validées par la recherche pour réguler ses émotions. L'essentiel est de les accueillir sans les juger." }], related: ["conscience", "therapies", "neurosciences"] },
      { slug: "conscience", label: "Conscience", description: "Qu'est-ce que la conscience de soi ? Comment développer sa lucidité intérieure ? Entre introspection et pratiques contemplatives, explorez ce qui fait de nous des êtres conscients.", faq: [{ question: "Quelle est la différence entre conscience et méditation ?", answer: "La conscience est un état d'attention à soi et au monde. La méditation est une pratique qui permet de développer cette conscience. L'une est le but, l'autre est le chemin." }, { question: "Comment développer sa conscience de soi ?", answer: "Le journal intime, la méditation, la thérapie et l'écoute active de ses sensations corporelles sont des voies éprouvées pour approfondir sa connaissance de soi." }], related: ["meditation", "philosophie", "emotions"] },
      { slug: "meditation", label: "Méditation", description: "Loin des clichés, la méditation est aujourd'hui validée par les neurosciences. Pleine conscience, respiration, body scan : des pratiques accessibles qui transforment durablement le rapport à soi.", faq: [{ question: "Par où commencer quand on n'a jamais médité ?", answer: "Commencez par 5 minutes de respiration consciente chaque matin. Des applications comme Petit Bambou ou Headspace proposent des parcours guidés pour débutants." }, { question: "Quels sont les bienfaits prouvés de la méditation ?", answer: "La recherche montre une réduction du stress et de l'anxiété, une amélioration de la concentration, et des modifications mesurables de la structure cérébrale après 8 semaines de pratique régulière." }], related: ["conscience", "respiration", "bien-etre"] },
      { slug: "developpement-personnel", label: "Développement personnel", description: "Au-delà des injonctions et des gourous, le développement personnel peut être un vrai levier de transformation. Nos articles explorent ce qui fonctionne vraiment, preuves à l'appui.", faq: [{ question: "Le développement personnel est-il vraiment efficace ?", answer: "Certaines approches — comme la fixation d'objectifs, la thérapie cognitive et les habitudes progressives — sont validées par la recherche. D'autres relèvent davantage du marketing. Nos articles font le tri." }, { question: "Par quoi commencer en développement personnel ?", answer: "Identifiez un domaine précis à améliorer (confiance, productivité, relations) plutôt que de viser un changement global. Les petits progrès réguliers sont plus durables que les révolutions." }], related: ["emotions", "therapies", "quete-de-sens"] },
      { slug: "neurosciences", label: "Neurosciences", description: "Le cerveau est l'organe le plus complexe de l'univers connu — et il est entre vos deux oreilles. Découvrez ce que la science révèle sur la mémoire, les biais cognitifs, la plasticité cérébrale et les mécanismes de la pensée.", faq: [{ question: "Qu'est-ce que la plasticité cérébrale ?", answer: "C'est la capacité du cerveau à se réorganiser en créant de nouvelles connexions neuronales tout au long de la vie. Chaque apprentissage, chaque expérience modifie physiquement votre cerveau." }, { question: "Comment les neurosciences peuvent-elles aider au quotidien ?", answer: "Comprendre le fonctionnement de l'attention, du sommeil et des biais cognitifs permet de prendre de meilleures décisions, d'apprendre plus efficacement et de mieux gérer le stress." }], related: ["emotions", "meditation", "sommeil"] },
      { slug: "philosophie", label: "Philosophie", description: "Stoïcisme, existentialisme, philosophie orientale : les penseurs d'hier éclairent les questions d'aujourd'hui. Des réflexions profondes rendues accessibles pour nourrir votre quotidien.", faq: [{ question: "La philosophie est-elle utile dans la vie quotidienne ?", answer: "Absolument. Le stoïcisme aide à gérer l'adversité, l'existentialisme à trouver du sens, et la philosophie morale à prendre des décisions éthiques. Ce sont des outils concrets de pensée." }, { question: "Quels philosophes lire quand on débute ?", answer: "Marc Aurèle (Pensées pour moi-même), Albert Camus (Le Mythe de Sisyphe), et Alain de Botton (Les Consolations de la philosophie) sont d'excellentes portes d'entrée." }], related: ["quete-de-sens", "conscience", "litterature"] },
      { slug: "quete-de-sens", label: "Quête de sens", description: "Pourquoi suis-je là ? Qu'est-ce qui compte vraiment ? Ces questions ne sont pas réservées aux philosophes. Elles habitent chacun d'entre nous — et méritent qu'on s'y arrête.", faq: [{ question: "Comment trouver du sens dans sa vie ?", answer: "La recherche de sens passe souvent par trois voies : la contribution (aider les autres), la connexion (relations authentiques) et la création (exprimer quelque chose d'unique). Il n'y a pas de formule universelle." }, { question: "La quête de sens est-elle un privilège ou un besoin fondamental ?", answer: "Viktor Frankl, psychiatre rescapé des camps, a montré que le sens est un besoin fondamental de l'être humain, indépendant des conditions matérielles. C'est ce qui nous permet de traverser l'adversité." }], related: ["philosophie", "developpement-personnel", "conscience"] },
      { slug: "therapies", label: "Thérapies", description: "TCC, psychanalyse, EMDR, thérapie systémique : le paysage thérapeutique est vaste. Nos articles vous aident à comprendre les différentes approches et à trouver celle qui vous correspond.", faq: [{ question: "Comment choisir entre les différents types de thérapie ?", answer: "Les TCC sont efficaces pour l'anxiété et les phobies, la psychanalyse pour les schémas répétitifs profonds, l'EMDR pour les traumatismes. Un premier rendez-vous avec un professionnel aide à orienter le choix." }, { question: "Quand faut-il consulter un thérapeute ?", answer: "Quand une souffrance persiste, que les stratégies habituelles ne fonctionnent plus, ou simplement quand on souhaite mieux se comprendre. Il n'est pas nécessaire d'être en crise pour consulter." }], related: ["emotions", "developpement-personnel", "neurosciences"] },
    ],
  },
  {
    id: "corps",
    name: "Le Corps",
    tagline: "Prendre soin de soi, autrement.",
    color: "#5AA352",
    dark: "#2A6F22",
    subtopics: [
      { slug: "nutrition", label: "Nutrition", description: "Alimentation consciente, microbiote, jeûne intermittent : ce que la science dit vraiment sur ce qu'on met dans notre assiette. Loin des régimes miracles, des réponses fondées.", faq: [{ question: "Qu'est-ce qu'une alimentation équilibrée en 2026 ?", answer: "Les recommandations convergent vers une alimentation riche en végétaux, en fibres et en aliments peu transformés. Le modèle méditerranéen reste la référence la plus étudiée et validée." }, { question: "Le jeûne intermittent est-il vraiment bénéfique ?", answer: "Les études montrent des bénéfices sur l'inflammation et la sensibilité à l'insuline, mais les résultats varient selon les individus. Il n'est pas adapté à tout le monde et doit être pratiqué avec discernement." }], related: ["sommeil", "bien-etre", "prevention"] },
      { slug: "sommeil", label: "Sommeil", description: "On dort de moins en moins, et de plus en plus mal. Chronobiologie, hygiène du sommeil, impact des écrans : plongée dans ce pilier oublié de la santé.", faq: [{ question: "Combien d'heures de sommeil faut-il vraiment ?", answer: "Entre 7 et 9 heures pour la plupart des adultes, mais la qualité compte autant que la durée. Un sommeil profond de 7 heures vaut mieux que 9 heures fragmentées." }, { question: "Comment améliorer naturellement son sommeil ?", answer: "Régularité des horaires, exposition à la lumière le matin, réduction des écrans le soir, et chambre fraîche (18-19°C) sont les quatre piliers validés par la recherche." }], related: ["nutrition", "neurosciences", "bien-etre"] },
      { slug: "mouvement", label: "Mouvement", description: "Bouger ne se résume pas au sport. La marche, le yoga, le mouvement fonctionnel — notre corps a besoin de variété. Redécouvrez le plaisir de bouger, sans performance.", faq: [{ question: "Quelle est la différence entre mouvement et sport ?", answer: "Le sport est structuré, avec des règles et souvent un objectif de performance. Le mouvement est plus large : marcher, s'étirer, danser, jardiner. Les deux sont bénéfiques, mais le mouvement quotidien est plus accessible." }, { question: "Combien de mouvement par jour recommande-t-on ?", answer: "L'OMS recommande 150 minutes d'activité modérée par semaine, soit environ 20 minutes par jour. Mais chaque minute de mouvement compte, même les petits déplacements." }], related: ["sport", "respiration", "bien-etre"] },
      { slug: "prevention", label: "Prévention", description: "Mieux vaut prévenir que guérir : dépistage, vaccination, habitudes protectrices. Nos articles décryptent les gestes simples qui font une vraie différence sur le long terme.", faq: [{ question: "Quels sont les examens de santé à ne pas négliger ?", answer: "Bilan sanguin annuel, dépistage dentaire, contrôle ophtalmologique, et les dépistages spécifiques selon l'âge et le sexe (mammographie, coloscopie, PSA) sont les piliers d'un suivi préventif." }, { question: "La prévention est-elle vraiment efficace ?", answer: "L'OMS estime que 80 % des maladies cardiovasculaires et 40 % des cancers pourraient être évités par des changements de mode de vie : alimentation, activité physique, arrêt du tabac." }], related: ["nutrition", "sommeil", "medecine-douce"] },
      { slug: "medecine-douce", label: "Médecine douce", description: "Acupuncture, ostéopathie, naturopathie, sophrologie : ces approches complémentaires séduisent de plus en plus de Français. Que dit la science ? Quelles sont les limites ?", faq: [{ question: "Les médecines douces sont-elles reconnues scientifiquement ?", answer: "Certaines le sont (acupuncture pour la douleur, ostéopathie pour le mal de dos), d'autres manquent encore de preuves solides. L'essentiel est qu'elles complètent — et non remplacent — la médecine conventionnelle." }, { question: "Comment choisir un praticien en médecine douce ?", answer: "Vérifiez les certifications, demandez des recommandations, et méfiez-vous des praticiens qui vous demandent d'arrêter un traitement médical. Un bon thérapeute travaille en complémentarité avec votre médecin." }], related: ["therapies", "bien-etre", "prevention"] },
      { slug: "bien-etre", label: "Bien-être physique", description: "Le bien-être n'est pas un luxe, c'est un équilibre. Gestion du stress, soins du corps, routines santé : des approches concrètes pour se sentir mieux dans son corps au quotidien.", faq: [{ question: "Quelle est la différence entre bien-être et bonheur ?", answer: "Le bonheur est un état émotionnel fluctuant. Le bien-être est plus stable : c'est un sentiment global de satisfaction physique, mentale et sociale. On peut cultiver le bien-être même dans les périodes difficiles." }, { question: "Par quoi commencer pour améliorer son bien-être ?", answer: "Les trois piliers fondamentaux sont le sommeil, l'alimentation et le mouvement. Améliorer un seul de ces trois domaines a un effet domino positif sur les deux autres." }], related: ["sommeil", "nutrition", "meditation"] },
      { slug: "sport", label: "Sport", description: "Course, natation, musculation, sports collectifs : le sport comme vecteur de dépassement, de discipline et de plaisir. Au-delà de la performance, ce que le sport dit de nous.", faq: [{ question: "Quel sport choisir quand on reprend l'activité physique ?", answer: "La marche rapide, la natation et le vélo sont les plus adaptés pour une reprise en douceur. L'important est de choisir une activité qui vous plaît — la régularité compte plus que l'intensité." }, { question: "Le sport a-t-il un impact sur la santé mentale ?", answer: "Oui, massivement. L'exercice physique stimule la production d'endorphines et de sérotonine, réduit le cortisol, et améliore la qualité du sommeil. Son effet sur la dépression est comparable à certains antidépresseurs." }], related: ["mouvement", "respiration", "bien-etre"] },
      { slug: "respiration", label: "Respiration", description: "La respiration est le seul système autonome que l'on peut contrôler consciemment. Cohérence cardiaque, méthode Wim Hof, pranayama : des techniques puissantes à portée de souffle.", faq: [{ question: "Qu'est-ce que la cohérence cardiaque ?", answer: "C'est une technique de respiration (5 secondes d'inspiration, 5 secondes d'expiration, pendant 5 minutes) qui synchronise le rythme cardiaque et réduit le cortisol. Ses effets sont mesurables en quelques minutes." }, { question: "La respiration peut-elle vraiment réduire le stress ?", answer: "Oui. La respiration lente active le système nerveux parasympathique, qui freine la réponse de stress. C'est l'un des outils les plus rapides et les plus accessibles pour retrouver le calme." }], related: ["meditation", "mouvement", "sport"] },
    ],
  },
  {
    id: "liens",
    name: "Les Liens",
    tagline: "Ce qui nous lie, ce qui nous divise, ce qui nous transforme.",
    color: "#E67839",
    dark: "#B04E15",
    subtopics: [
      { slug: "parentalite", label: "Parentalité", description: "Être parent est le rôle le plus exigeant qui soit — et le moins préparé. Éducation bienveillante, charge mentale, relations parents-enfants : sans injonctions, avec honnêteté.", faq: [{ question: "Qu'est-ce que la parentalité positive ?", answer: "C'est une approche éducative qui privilégie la communication, l'empathie et la fermeté bienveillante. Elle ne signifie pas tout accepter, mais comprendre les besoins derrière les comportements de l'enfant." }, { question: "Comment gérer la charge mentale parentale ?", answer: "Le partage explicite des responsabilités, la déculpabilisation et le fait d'accepter l'imperfection sont des premiers pas. La charge mentale n'est pas un problème individuel mais systémique." }], related: ["education", "couples", "generations"] },
      { slug: "couples", label: "Couples", description: "L'amour au quotidien, les crises, la communication, la sexualité : explorer ce qui fait durer un couple — ou ce qui le transforme. Sans tabou, avec nuance.", faq: [{ question: "Quels sont les signes d'un couple en bonne santé ?", answer: "La capacité à gérer les conflits de manière constructive, le maintien d'une admiration mutuelle, et l'équilibre entre autonomie individuelle et projet commun sont les marqueurs identifiés par le psychologue John Gottman." }, { question: "Quand consulter un thérapeute de couple ?", answer: "Idéalement avant que la crise ne devienne chronique. Dès que la communication devient systématiquement conflictuelle ou que l'un des partenaires se sent durablement incompris, un regard extérieur peut débloquer la situation." }], related: ["ruptures", "parentalite", "amitie"] },
      { slug: "amitie", label: "Amitié", description: "L'amitié est le lien qu'on choisit. Mais à l'âge adulte, on le néglige souvent. Comment entretenir, approfondir — et parfois laisser partir — les amitiés qui comptent.", faq: [{ question: "Pourquoi est-il plus difficile de se faire des amis à l'âge adulte ?", answer: "Les sociologues identifient trois conditions de l'amitié : la proximité répétée, les interactions non planifiées et la vulnérabilité partagée. Le monde adulte offre moins d'occasions naturelles de réunir ces trois conditions." }, { question: "Combien d'amis proches a-t-on en moyenne ?", answer: "Selon le nombre de Dunbar, nous pouvons maintenir environ 5 relations intimes, 15 amis proches et 50 bons amis. La qualité compte infiniment plus que la quantité." }], related: ["couples", "communaute", "ruptures"] },
      { slug: "education", label: "Éducation", description: "L'école, les apprentissages, la transmission : l'éducation façonne les individus et les sociétés. Pédagogies alternatives, neurosciences de l'apprentissage, débats de fond.", faq: [{ question: "Quelles sont les pédagogies alternatives qui fonctionnent ?", answer: "Montessori, Freinet et Reggio Emilia ont montré des résultats positifs sur l'autonomie et la motivation. L'essentiel n'est pas la méthode mais l'adaptation aux besoins de chaque enfant." }, { question: "Les écrans nuisent-ils à l'apprentissage des enfants ?", answer: "Avant 3 ans, le consensus scientifique recommande d'éviter les écrans. Après, c'est la qualité du contenu et l'accompagnement parental qui font la différence, pas l'écran en lui-même." }], related: ["parentalite", "generations", "neurosciences"] },
      { slug: "generations", label: "Générations", description: "Boomers, Gen X, millennials, Gen Z : chaque génération porte ses codes, ses traumas et ses espoirs. Explorer ce qui sépare et ce qui relie les générations entre elles.", faq: [{ question: "Les conflits de générations sont-ils inévitables ?", answer: "Ils sont normaux mais pas inévitables. Chaque génération est façonnée par son contexte historique et économique. La compréhension mutuelle passe par la reconnaissance de ces différences de vécu." }, { question: "Qu'est-ce qui caractérise la génération Z ?", answer: "Née entre 1997 et 2012, la Gen Z est la première génération nativement numérique. Elle valorise l'authenticité, la diversité et la santé mentale, mais fait face à des niveaux d'anxiété inédits." }], related: ["education", "parentalite", "enquetes-sociales"] },
      { slug: "communaute", label: "Communauté", description: "Dans un monde individualiste, le besoin de communauté revient en force. Collectifs, tiers-lieux, solidarités de quartier : les nouvelles formes du vivre-ensemble.", faq: [{ question: "Pourquoi le sentiment de communauté recule-t-il ?", answer: "L'urbanisation, le numérique et l'individualisme ont fragilisé les liens de proximité. Mais de nouvelles formes émergent : tiers-lieux, habitat partagé, communautés en ligne qui se prolongent hors écran." }, { question: "Comment recréer du lien communautaire ?", answer: "S'impliquer dans une association locale, fréquenter un tiers-lieu, participer à des événements de quartier ou rejoindre un groupe de pratique (sport, jardinage, lecture) sont des premiers pas concrets." }], related: ["amitie", "enquetes-sociales", "generations"] },
      { slug: "ruptures", label: "Ruptures", description: "Divorce, deuil amical, rupture familiale : les séparations font partie de la vie. Les traverser, les comprendre, et parfois en sortir transformé.", faq: [{ question: "Comment surmonter une rupture amoureuse ?", answer: "Les neurosciences montrent que le cerveau traite une rupture comme un sevrage. Le temps, le soutien social, l'activité physique et parfois un accompagnement thérapeutique sont les meilleurs alliés de la guérison." }, { question: "Peut-on rester ami avec un ex ?", answer: "C'est possible mais rarement immédiat. Les psychologues recommandent une période de coupure nette (3 à 6 mois minimum) pour permettre le deuil émotionnel avant d'envisager une amitié." }], related: ["couples", "amitie", "therapies"] },
      { slug: "enquetes-sociales", label: "Enquêtes sociales", description: "Précarité, inégalités, fractures territoriales : nos enquêtes de terrain racontent la France telle qu'elle est. Des récits documentés, humains, sans simplification.", faq: [{ question: "Qu'est-ce qu'une enquête sociale chez Origines Media ?", answer: "Nos enquêtes croisent données statistiques, témoignages de terrain et analyses d'experts. Elles prennent le temps de comprendre les mécanismes plutôt que de se limiter aux constats." }, { question: "Pourquoi les enquêtes sociales sont-elles importantes ?", answer: "Elles rendent visibles des réalités que les médias traditionnels survolent. Comprendre les dynamiques sociales aide chacun à se situer et à agir en citoyen informé." }], related: ["generations", "communaute", "education"] },
    ],
  },
  {
    id: "monde",
    name: "Le Monde",
    tagline: "Partir pour comprendre. Revenir pour raconter.",
    color: "#2E9B74",
    dark: "#0A6848",
    subtopics: [
      { slug: "recits-voyage", label: "Récits de voyage", description: "Partir, se perdre, revenir changé. Nos récits de voyage vont au-delà du guide touristique : des expériences humaines qui questionnent notre rapport au monde.", faq: [{ question: "Quelle est la différence entre un récit de voyage et un guide ?", answer: "Un guide vous dit où aller. Un récit de voyage vous raconte ce que ça fait d'y être. Chez Origines, nos auteurs partagent leurs transformations intérieures autant que leurs itinéraires." }, { question: "Le voyage est-il nécessaire pour se découvrir ?", answer: "Non, mais il accélère le processus. Le dépaysement force à sortir des automatismes et à se confronter à soi-même. Cela dit, l'introspection est possible partout — le voyage n'est qu'un catalyseur." }], related: ["destinations", "photographie", "nomadisme"] },
      { slug: "destinations", label: "Destinations", description: "Des lieux qui changent ceux qui les visitent. Pas les spots Instagram, mais les endroits qui marquent — par leur beauté, leur histoire ou leur étrangeté.", faq: [{ question: "Comment choisir une destination de voyage transformatrice ?", answer: "Privilégiez les lieux qui vous confrontent à l'inconnu : une culture très différente, un paysage extrême, ou un rythme de vie décalé du vôtre. Le confort est l'ennemi de la transformation." }, { question: "Quelles destinations recommandez-vous pour un premier grand voyage ?", answer: "Le Japon pour le choc culturel en douceur, le Portugal pour l'accessibilité et la profondeur, ou le Maroc pour la proximité géographique et l'immersion culturelle totale." }], related: ["recits-voyage", "photographie", "creativite"] },
      { slug: "art", label: "Art", description: "L'art contemporain, le street art, les arts visuels : des œuvres qui dérangent, qui interrogent, qui consolent. Décryptages et rencontres avec ceux qui créent.", faq: [{ question: "Faut-il comprendre l'art pour l'apprécier ?", answer: "Non. L'art agit d'abord sur les émotions, pas sur l'intellect. Comprendre le contexte enrichit l'expérience, mais le ressenti premier est toujours valide." }, { question: "L'art contemporain est-il accessible à tous ?", answer: "Il peut l'être si on accepte de ne pas tout comprendre. Les musées gratuits, les galeries ouvertes et le street art offrent des points d'entrée sans barrière économique ni culturelle." }], related: ["creativite", "photographie", "cinema"] },
      { slug: "musique", label: "Musique", description: "La musique comme langage universel. Découvertes, analyses, portraits d'artistes : explorer ce que la musique fait à nos émotions et à notre cerveau.", faq: [{ question: "Pourquoi la musique a-t-elle autant d'effet sur nos émotions ?", answer: "La musique active simultanément les circuits de la récompense, de la mémoire et des émotions dans le cerveau. Elle peut libérer de la dopamine comparable à celle provoquée par la nourriture ou l'amour." }, { question: "Écouter de la musique peut-il améliorer la concentration ?", answer: "Cela dépend du type de musique et de la tâche. La musique instrumentale sans paroles peut aider les tâches répétitives, mais elle peut gêner les tâches créatives ou verbales." }], related: ["art", "cinema", "emotions"] },
      { slug: "litterature", label: "Littérature", description: "Romans, essais, poésie : la littérature comme miroir et comme fenêtre. Nos chroniques et nos sélections pour les lecteurs curieux, exigeants ou simplement en quête d'évasion.", faq: [{ question: "La lecture a-t-elle des bienfaits prouvés ?", answer: "Oui. La lecture régulière améliore l'empathie, réduit le stress de 68 % en 6 minutes (étude de l'Université de Sussex), et ralentit le déclin cognitif lié à l'âge." }, { question: "Comment reprendre goût à la lecture ?", answer: "Commencez par des textes courts (nouvelles, essais), lisez ce qui vous plaît sans culpabilité, et fixez-vous un rituel (20 minutes avant le coucher). Le plaisir est le meilleur moteur." }], related: ["philosophie", "cinema", "creativite"] },
      { slug: "cinema", label: "Cinéma", description: "Films, séries, documentaires : le cinéma comme art de raconter le réel et l'imaginaire. Critiques, analyses et regards sur ce que l'écran dit de notre époque.", faq: [{ question: "Les séries ont-elles remplacé le cinéma ?", answer: "Elles n'ont pas remplacé le cinéma mais élargi la narration longue. Les séries permettent une profondeur de personnage impossible en 2 heures, tandis que le cinéma conserve la puissance de l'expérience collective en salle." }, { question: "Le cinéma peut-il être thérapeutique ?", answer: "La cinéthérapie est une pratique reconnue. Certains films permettent de mettre des mots sur des émotions, de normaliser des expériences difficiles ou de stimuler la réflexion sur sa propre vie." }], related: ["litterature", "art", "musique"] },
      { slug: "creativite", label: "Créativité", description: "La créativité n'est pas réservée aux artistes. C'est une compétence qui se travaille, dans tous les domaines de la vie. Méthodes, inspirations et témoignages.", faq: [{ question: "Tout le monde est-il créatif ?", answer: "Oui. La créativité est une capacité cognitive universelle, pas un don réservé à quelques élus. Elle se manifeste dans la résolution de problèmes, la cuisine, la conversation — pas seulement dans l'art." }, { question: "Comment stimuler sa créativité ?", answer: "La contrainte, la marche, l'ennui volontaire et l'exposition à des domaines inconnus sont les meilleurs stimulants créatifs identifiés par la recherche. La créativité naît souvent de la collision entre deux mondes." }], related: ["art", "litterature", "photographie"] },
      { slug: "photographie", label: "Photographie", description: "La photographie comme regard sur le monde. Street photography, portrait, paysage : apprendre à voir autrement, avec ou sans matériel professionnel.", faq: [{ question: "Faut-il un bon appareil pour faire de bonnes photos ?", answer: "Non. Le meilleur appareil est celui que vous avez sur vous. Les smartphones actuels permettent des images remarquables. Ce qui fait une bonne photo, c'est le regard, pas le matériel." }, { question: "Comment développer son œil photographique ?", answer: "Photographiez tous les jours, étudiez les maîtres (Cartier-Bresson, Vivian Maier, Sebastião Salgado), et apprenez la composition. La contrainte (un seul objectif, le noir et blanc) force la créativité." }], related: ["art", "recits-voyage", "creativite"] },
    ],
  },
  {
    id: "avenir",
    name: "L'Avenir",
    tagline: "Ce qui change, ce qui vient, ce qui nous attend.",
    color: "#2E94B5",
    dark: "#0A6383",
    subtopics: [
      { slug: "carriere", label: "Carrière", description: "Reconversion, négociation salariale, quête de sens au travail : la carrière n'est plus linéaire. Nos articles accompagnent ceux qui veulent travailler autrement.", faq: [{ question: "Comment réussir une reconversion professionnelle ?", answer: "La reconversion réussie passe par trois phases : l'exploration (bilan de compétences, informations terrain), l'expérimentation (stages, side projects) et la transition progressive. Les reconversions brutales sont rarement les plus durables." }, { question: "Le diplôme est-il encore important en 2026 ?", answer: "Il reste un signal, mais les compétences démontrables (portfolio, certifications, expérience) gagnent du terrain. Dans le numérique et l'entrepreneuriat, ce que vous savez faire compte plus que votre diplôme." }], related: ["entrepreneuriat", "leadership", "economie"] },
      { slug: "entrepreneuriat", label: "Entrepreneuriat", description: "Créer, lancer, échouer, recommencer : l'entrepreneuriat au-delà du mythe de la startup. Témoignages, conseils pratiques et réflexions sur ce que signifie entreprendre.", faq: [{ question: "Quelles sont les erreurs les plus fréquentes des entrepreneurs ?", answer: "Ne pas valider le marché avant de construire, sous-estimer le temps nécessaire, et s'isoler. Les entrepreneurs qui réussissent testent vite, acceptent l'échec, et s'entourent." }, { question: "Faut-il quitter son emploi pour entreprendre ?", answer: "Pas nécessairement. Le side project, la micro-entreprise en parallèle ou le temps partiel permettent de tester une idée sans brûler ses vaisseaux. La prudence n'est pas un manque d'ambition." }], related: ["carriere", "innovation", "leadership"] },
      { slug: "innovation", label: "Innovation", description: "L'innovation n'est pas que technologique. Innovation sociale, frugale, organisationnelle : les idées qui transforment le monde ne viennent pas toujours de la Silicon Valley.", faq: [{ question: "Qu'est-ce que l'innovation frugale ?", answer: "C'est l'art de faire mieux avec moins. Née dans les pays émergents, elle consiste à concevoir des solutions simples, accessibles et durables. Le low-tech en est une expression." }, { question: "Comment favoriser l'innovation dans une organisation ?", answer: "La sécurité psychologique (pouvoir proposer sans craindre le jugement), la diversité des profils et le droit à l'erreur sont les trois conditions identifiées par Google dans son projet Aristote." }], related: ["ia", "numerique", "entrepreneuriat"] },
      { slug: "ia", label: "Intelligence artificielle", description: "L'IA transforme le travail, la création, la médecine et la société. Comprendre ses mécanismes, ses promesses et ses limites pour ne pas la subir.", faq: [{ question: "L'IA va-t-elle remplacer mon travail ?", answer: "L'IA va transformer la plupart des métiers plutôt que les supprimer. Les tâches répétitives et prévisibles seront automatisées, mais les compétences relationnelles, créatives et de jugement resteront humaines." }, { question: "Faut-il apprendre à coder pour comprendre l'IA ?", answer: "Non, mais comprendre les bases (comment l'IA apprend, ses biais, ses limites) est devenu aussi important que la culture générale. Savoir utiliser les outils d'IA est une compétence clé." }], related: ["innovation", "numerique", "economie"] },
      { slug: "economie", label: "Économie", description: "Au-delà des chiffres, l'économie raconte nos choix de société. Travail, consommation, inégalités : décrypter les mécanismes économiques qui façonnent nos vies.", faq: [{ question: "L'économie est-elle accessible aux non-spécialistes ?", answer: "Absolument. L'économie parle de choix quotidiens : comment on dépense, comment on épargne, pourquoi certains emplois disparaissent. Nos articles traduisent ces mécanismes en langage clair." }, { question: "Qu'est-ce que l'économie circulaire ?", answer: "C'est un modèle qui vise à éliminer le gaspillage en concevant des produits réparables, réutilisables et recyclables. Elle s'oppose au modèle linéaire extraire-produire-jeter." }], related: ["carriere", "innovation", "entrepreneuriat"] },
      { slug: "leadership", label: "Leadership", description: "Diriger sans dominer, inspirer sans manipuler : le leadership moderne se réinvente. Management, influence, intelligence émotionnelle au service du collectif.", faq: [{ question: "Quelles sont les qualités d'un bon leader en 2026 ?", answer: "L'écoute active, la capacité à créer un environnement psychologiquement sûr, la transparence et l'humilité. Le leadership autoritaire recule au profit du leadership servant." }, { question: "Le leadership s'apprend-il ?", answer: "Oui. Si certains traits de personnalité facilitent le leadership, les compétences clés (communication, gestion de conflit, vision stratégique) sont acquises, pas innées." }], related: ["carriere", "entrepreneuriat", "economie"] },
      { slug: "numerique", label: "Numérique", description: "Le numérique transforme tout : nos relations, notre travail, notre attention. Entre promesses et dérives, comprendre ce monde pour mieux l'habiter.", faq: [{ question: "Comment réduire son temps d'écran sans tout couper ?", answer: "La sobriété numérique passe par des choix intentionnels : désactiver les notifications non essentielles, définir des créneaux sans écran, et remplacer le scrolling par des activités choisies." }, { question: "Le numérique nuit-il à notre capacité d'attention ?", answer: "Les études montrent une fragmentation de l'attention, pas une réduction de la capacité. Le cerveau s'adapte au mode multitâche mais perd en profondeur. La lecture longue et la méditation aident à rééquilibrer." }], related: ["ia", "innovation", "economie"] },
      { slug: "nomadisme", label: "Nomadisme", description: "Travailler de partout, vivre nulle part — ou partout. Le nomadisme digital comme mode de vie : libertés, contraintes, et ce que ça change en profondeur.", faq: [{ question: "Le nomadisme digital est-il viable à long terme ?", answer: "Il l'est pour certains profils (freelances, développeurs, créateurs de contenu) mais demande une discipline forte. Les défis principaux sont l'isolement social, la fiscalité et la difficulté à construire des relations durables." }, { question: "Par où commencer pour devenir nomade digital ?", answer: "Développez une compétence monnayable à distance, testez avec un mois à l'étranger avant de tout quitter, et constituez une épargne de sécurité de 6 mois. La préparation est la clé." }], related: ["recits-voyage", "carriere", "numerique"] },
    ],
  },
];

export const UNIVERS_MAP = Object.fromEntries(
  UNIVERS.map((u) => [u.id, u])
) as Record<UniversId, Univers>;

export const TOTAL_ARTICLES = 151;

export const ARTICLES: ArticleData[] = [
  {
    id: 1,
    univers: "esprit",
    subtopic: "emotions",
    date: "2026-04-21T14:20",
    popularity: 14200,
    title: "Pourquoi on ne finit jamais rien",
    href: "/article/procrastination-honte",
    imgSrc: "/covers/cover-01.webp",
    imgAlt: "Procrastination — article L'Esprit",
    timeLabel: "il y a 2 min",
    format: "Article · L'Esprit",
    headline: "Pourquoi on ne finit ",
    headlineEm: "jamais rien",
    headlineSuffix: ".",
    excerpt: "Ce n'est pas de la paresse. C'est autre chose — et la psychologie commence à comprendre quoi.",
    author: "Émilie Roux",
    readTime: "24 min",
    schemaType: "Article",
  },
  {
    id: 2,
    univers: "esprit",
    subtopic: "quete-de-sens",
    date: "2026-04-16T12:00",
    popularity: 3900,
    title: "Le silence dernier luxe collectif",
    href: "/article/silence-moderne",
    imgSrc: "/recos/reco_culture.webp",
    imgAlt: "Le silence moderne — essai L'Esprit",
    timeLabel: "il y a 5 j",
    format: "Essai · L'Esprit",
    headline: "Le silence, le dernier ",
    headlineEm: "luxe collectif",
    headlineSuffix: ".",
    excerpt: "On ne l'achète pas, mais on le perd chaque jour un peu plus. Essai sur ce qui disparaît sans bruit.",
    author: "Mathilde Aubry",
    readTime: "18 min",
    schemaType: "Article",
  },
  {
    id: 3,
    univers: "esprit",
    subtopic: "neurosciences",
    date: "2026-04-20T09:14",
    popularity: 4827,
    title: "Ledition du dimanche",
    href: "/newsletter/n-42",
    imgSrc: "/covers/cover-01.webp",
    imgAlt: "L'édition du dimanche — newsletter N° 42",
    timeLabel: "hier, 09:14",
    format: "Newsletter · N° 42",
    headline: "",
    headlineEm: "L'édition",
    headlineSuffix: " du dimanche.",
    excerpt: "Chaque dimanche, le meilleur de la semaine en un seul email. Lecture, musique, et un mot de la rédac.",
    author: "La rédaction",
    readTime: "6 min",
    schemaType: "Article",
  },
  {
    id: 4,
    univers: "corps",
    subtopic: "sommeil",
    date: "2026-04-09T10:00",
    popularity: 4200,
    title: "Ce que lalimentation change au sommeil",
    href: "/article/nourriture-sommeil",
    imgSrc: "/covers/cover-04.webp",
    imgAlt: "Alimentation et sommeil — reportage Le Corps",
    timeLabel: "il y a 12 j",
    format: "Reportage · Le Corps",
    headline: "Ce que l'alimentation change ",
    headlineEm: "au sommeil",
    headlineSuffix: ".",
    excerpt: "On sait que le café empêche de dormir. Mais le reste ? Ce que la science dit vraiment.",
    author: "Émilie Roux",
    readTime: "11 min",
    schemaType: "Article",
  },
  {
    id: 5,
    univers: "corps",
    subtopic: "respiration",
    date: "2026-04-17T09:30",
    popularity: 8200,
    title: "Respirer dabord",
    href: "/video/respiration-short",
    imgSrc: "/recos/reco_activite.webp",
    imgAlt: "Respirer, d'abord — short Le Corps",
    timeLabel: "il y a 4 j",
    format: "Short · Le Corps",
    headline: "",
    headlineEm: "Respirer",
    headlineSuffix: ", d'abord.",
    excerpt: "Trois exercices. Deux minutes. Un short à revoir quand tout va trop vite.",
    author: "Studio Origines",
    readTime: "1:32",
    isVideo: true,
    schemaType: "VideoObject",
  },
  {
    id: 6,
    univers: "liens",
    subtopic: "enquetes-sociales",
    date: "2026-04-21T13:48",
    popularity: 12400,
    title: "Le grand sommeil français",
    href: "/video/sommeil-enquete",
    imgSrc: "/covers/cover-03.webp",
    imgAlt: "Le grand sommeil français — enquête vidéo Les Liens",
    timeLabel: "il y a 34 min",
    format: "Vidéo · Les Liens",
    headline: "Le ",
    headlineEm: "grand sommeil",
    headlineSuffix: " français.",
    excerpt: "On dort de moins en moins, mais personne n'en parle. Enquête sur un silence collectif.",
    author: "Studio Origines",
    readTime: "24:15",
    isVideo: true,
    schemaType: "VideoObject",
  },
  {
    id: 7,
    univers: "liens",
    subtopic: "ruptures",
    date: "2026-04-21T12:22",
    popularity: 3200,
    title: "La lettre que je nai jamais envoyee",
    href: "/histoire/la-lettre-que-j-ai-jamais-envoyee",
    imgSrc: "/histoires/histoire_relations_famille.webp",
    imgAlt: "La lettre que je n'ai jamais envoyée — histoire Les Liens",
    timeLabel: "il y a 2 h",
    format: "Histoire · Les Liens",
    headline: "La ",
    headlineEm: "lettre",
    headlineSuffix: " que je n'ai jamais envoyée.",
    excerpt: "Elle l'a écrite il y a dix ans. Elle ne l'a jamais envoyée. Aujourd'hui, elle la publie ici.",
    author: "Mathilde, 34 ans",
    readTime: "12 min",
    schemaType: "SocialMediaPosting",
  },
  {
    id: 8,
    univers: "liens",
    subtopic: "parentalite",
    date: "2026-04-20T16:22",
    popularity: 9100,
    title: "Six mois dans une famille",
    href: "/immersions/six-mois-famille-cisse",
    imgSrc: "/covers/cover-05.webp",
    imgAlt: "Six mois dans une famille — immersion Les Liens",
    timeLabel: "hier, 16:22",
    format: "Immersion · Les Liens",
    headline: "Six mois dans une famille qui ",
    headlineEm: "ne se parlait plus",
    headlineSuffix: ".",
    excerpt: "Les Cissé ne se parlaient plus depuis trois ans. Nos reporters ont vécu avec eux. Voici ce qu'ils ont vu.",
    author: "Camille + Léo",
    readTime: "34 min",
    isPaywall: true,
    schemaType: "Article",
  },
  {
    id: 9,
    univers: "liens",
    subtopic: "ruptures",
    date: "2026-04-11T16:30",
    popularity: 6800,
    title: "Ma mere ne veut plus quon se voie",
    href: "/article/rupture-mere-fille",
    imgSrc: "/histoires/histoire_emotions_bienetre.webp",
    imgAlt: "Rupture mère-fille — portrait Les Liens",
    timeLabel: "il y a 10 j",
    format: "Portrait · Les Liens",
    headline: "Ma mère ne veut ",
    headlineEm: "plus qu'on se voie",
    headlineSuffix: ".",
    excerpt: "Un jour, le téléphone a cessé de sonner. L'histoire d'une rupture qu'on ne choisit pas.",
    author: "Mathilde Aubry",
    readTime: "16 min",
    schemaType: "Article",
  },
  {
    id: 10,
    univers: "monde",
    subtopic: "recits-voyage",
    date: "2026-04-21T14:20",
    popularity: 5800,
    title: "2 200 kilomètres",
    href: "/article/2200-kilometres",
    imgSrc: "/covers/cover-02.webp",
    imgAlt: "2 200 kilomètres — récit Le Monde",
    timeLabel: "il y a 2 min",
    format: "Récit · Le Monde",
    headline: "2 200 kilomètres pour cesser ",
    headlineEm: "d'avoir peur",
    headlineSuffix: ".",
    excerpt: "Un matin, elle est partie. Sac à dos, pas de retour prévu. 87 jours plus tard, elle avait traversé trois pays — et compris quelque chose.",
    author: "Camille Dufresne",
    readTime: "18 min",
    schemaType: "Article",
  },
  {
    id: 11,
    univers: "monde",
    subtopic: "art",
    date: "2026-04-19T10:00",
    popularity: 2800,
    title: "Les lettres de Drancy",
    href: "/recommandations/lettre-a-drancy",
    imgSrc: "/recos/reco_livre.webp",
    imgAlt: "Les lettres de Drancy — recommandation Le Monde",
    timeLabel: "il y a 2 j",
    format: "Reco · Le Monde",
    headline: "Les lettres de ",
    headlineEm: "Drancy",
    headlineSuffix: ", E. Mandelstam.",
    excerpt: "82 lettres jamais envoyées, exhumées dans un grenier parisien. Un recueil bouleversant.",
    author: "Choisi par Camille D.",
    readTime: "★ Coup de cœur",
    schemaType: "Review",
  },
  {
    id: 12,
    univers: "monde",
    subtopic: "art",
    date: "2026-04-14T15:00",
    popularity: 7300,
    title: "Soulages la lumiere du noir",
    href: "/video/soulages-vitraux",
    imgSrc: "/recos/reco_musique.webp",
    imgAlt: "Soulages — portrait Le Monde",
    timeLabel: "il y a 7 j",
    format: "Vidéo · Le Monde",
    headline: "Soulages, ",
    headlineEm: "la lumière",
    headlineSuffix: " du noir.",
    excerpt: "Ses derniers vitraux capturent ce que la peinture ne pouvait plus dire. Documentaire inédit.",
    author: "Studio Origines",
    readTime: "9:12",
    isVideo: true,
    schemaType: "VideoObject",
  },
  {
    id: 13,
    univers: "monde",
    subtopic: "destinations",
    date: "2026-04-07T14:00",
    popularity: 9800,
    title: "La ou la mer eclaire les montagnes",
    href: "/article/lofoten-lumiere",
    imgSrc: "/recos/reco_destination.webp",
    imgAlt: "Îles Lofoten — récit Le Monde",
    timeLabel: "il y a 14 j",
    format: "Récit · Le Monde",
    headline: "Là où la mer ",
    headlineEm: "éclaire",
    headlineSuffix: " les montagnes.",
    excerpt: "Quarante heures de train depuis Oslo. Des cabanes rouges, une lumière qui ne ressemble à rien.",
    author: "Camille Dufresne",
    readTime: "16 min",
    schemaType: "Article",
  },
  {
    id: 14,
    univers: "avenir",
    subtopic: "numerique",
    date: "2026-04-18T14:00",
    popularity: 6400,
    title: "Le retour du numerique lent",
    href: "/article/numerique-lent",
    imgSrc: "/covers/cover-04.webp",
    imgAlt: "Le retour du numérique lent — article L'Avenir",
    timeLabel: "il y a 3 j",
    format: "Article · L'Avenir",
    headline: "Le retour du ",
    headlineEm: "numérique lent",
    headlineSuffix: ".",
    excerpt: "Moins d'écrans, plus de présence. Un mouvement grandit — et il ne vient pas d'où on croit.",
    author: "Léo Marchand",
    readTime: "5 min",
    schemaType: "Article",
  },
  {
    id: 15,
    univers: "avenir",
    subtopic: "carriere",
    date: "2026-04-15T10:45",
    popularity: 11500,
    title: "Jai demissionne a 29 ans",
    href: "/article/demission-29-ans",
    imgSrc: "/recos/reco_produit.webp",
    imgAlt: "J'ai démissionné à 29 ans — portrait L'Avenir",
    timeLabel: "il y a 6 j",
    format: "Portrait · L'Avenir",
    headline: "J'ai démissionné à ",
    headlineEm: "29 ans",
    headlineSuffix: ", sans plan B.",
    excerpt: "Pas de plan B, pas de filet. Juste une certitude : ce n'était plus possible. Portrait d'un saut dans le vide.",
    author: "Léo Marchand",
    readTime: "14 min",
    schemaType: "Article",
  },
  {
    id: 16,
    univers: "avenir",
    subtopic: "economie",
    date: "2026-04-13T11:00",
    popularity: 5100,
    title: "Le travail a-t-il encore du sens",
    href: "/article/travail-sens",
    imgSrc: "/recos/reco_podcast.webp",
    imgAlt: "Le travail a-t-il encore un sens — enquête L'Avenir",
    timeLabel: "il y a 8 j",
    format: "Enquête · L'Avenir",
    headline: "Le travail a-t-il encore ",
    headlineEm: "du sens",
    headlineSuffix: " ?",
    excerpt: "Entre bullshit jobs et quête de vocation, enquête sur un malaise générationnel.",
    author: "Léo Marchand",
    readTime: "22 min",
    schemaType: "Article",
  },
];

export function getUniversColor(id: UniversId): string {
  return UNIVERS_MAP[id].color;
}

export function getUniversDark(id: UniversId): string {
  return UNIVERS_MAP[id].dark;
}

export function getArticlesByUnivers(id: UniversId): ArticleData[] {
  return ARTICLES.filter((a) => a.univers === id);
}

const VERTICALE_TO_UNIVERS: Record<string, UniversId> = {
  psychologie: "esprit",
  spiritualite: "esprit",
  spiritualité: "esprit",
  sante: "corps",
  santé: "corps",
  famille: "liens",
  societe: "liens",
  société: "liens",
  voyage: "monde",
  "art-creativite": "monde",
  "art & créativité": "monde",
  "art-et-creativite": "monde",
  carriere: "avenir",
  carrière: "avenir",
  technologie: "avenir",
  business: "avenir",
};

export function verticaleToUnivers(verticaleSlugOrName: string): UniversId {
  const key = verticaleSlugOrName.toLowerCase().trim();
  return VERTICALE_TO_UNIVERS[key] ?? "esprit";
}
