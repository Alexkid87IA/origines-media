export const BASE_URL = 'https://www.origines.media'
export const SITE_NAME = 'Origines Media'
export const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`
export const DEFAULT_TITLE = 'Origines Media — La profondeur du récit'
export const DEFAULT_DESCRIPTION =
  'Une expérience média premium pour les chercheurs de sens. Découvrez des récits authentiques et des univers narratifs profonds.'

export const SANITY_PROJECT_ID = 'r941i081'
export const SANITY_DATASET = 'production'
export const SANITY_API_VERSION = '2024-03-01'
export const SANITY_URL = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`

export interface UniversData {
  id: string
  name: string
  tagline: string
  color: string
  subtopics: Array<{
    slug: string
    label: string
    description?: string
    faq?: Array<{ question: string; answer: string }>
  }>
}

export const UNIVERS_DATA: UniversData[] = [
  {
    id: 'esprit', name: "L'Esprit", tagline: 'Comprendre ce qui se joue en nous, pour mieux vivre avec les autres.', color: '#7B5CD6',
    subtopics: [
      { slug: 'emotions', label: 'Émotions', description: 'Colère, joie, tristesse, peur : nos émotions ne sont pas des faiblesses. Elles sont des signaux.', faq: [{ question: 'Pourquoi est-il important de comprendre ses émotions ?', answer: 'Les émotions influencent nos décisions, nos relations et notre santé. Les identifier permet de mieux réagir aux situations stressantes.' }, { question: 'Comment mieux gérer ses émotions au quotidien ?', answer: 'La pleine conscience, l\'écriture expressive et la respiration profonde sont des techniques validées par la recherche.' }] },
      { slug: 'conscience', label: 'Conscience', description: 'Qu\'est-ce que la conscience de soi ? Comment développer sa lucidité intérieure ?' },
      { slug: 'meditation', label: 'Méditation', description: 'Loin des clichés, la méditation est aujourd\'hui validée par les neurosciences.' },
      { slug: 'developpement-personnel', label: 'Développement personnel', description: 'Au-delà des injonctions et des gourous, le développement personnel peut être un vrai levier.' },
      { slug: 'neurosciences', label: 'Neurosciences', description: 'Le cerveau est l\'organe le plus complexe de l\'univers connu.' },
      { slug: 'philosophie', label: 'Philosophie', description: 'Stoïcisme, existentialisme, philosophie orientale : les penseurs d\'hier éclairent les questions d\'aujourd\'hui.' },
      { slug: 'quete-de-sens', label: 'Quête de sens', description: 'Pourquoi suis-je là ? Qu\'est-ce qui compte vraiment ?' },
      { slug: 'therapies', label: 'Thérapies', description: 'TCC, psychanalyse, EMDR, thérapie systémique : le paysage thérapeutique est vaste.' },
    ],
  },
  {
    id: 'corps', name: 'Le Corps', tagline: 'Prendre soin de soi, autrement.', color: '#5AA352',
    subtopics: [
      { slug: 'nutrition', label: 'Nutrition', description: 'Alimentation consciente, microbiote, jeûne intermittent : ce que la science dit vraiment.' },
      { slug: 'sommeil', label: 'Sommeil', description: 'On dort de moins en moins, et de plus en plus mal.' },
      { slug: 'mouvement', label: 'Mouvement', description: 'Bouger ne se résume pas au sport.' },
      { slug: 'prevention', label: 'Prévention', description: 'Mieux vaut prévenir que guérir.' },
      { slug: 'medecine-douce', label: 'Médecine douce', description: 'Acupuncture, ostéopathie, naturopathie, sophrologie.' },
      { slug: 'bien-etre', label: 'Bien-être physique', description: 'Le bien-être n\'est pas un luxe, c\'est un équilibre.' },
      { slug: 'sport', label: 'Sport', description: 'Course, natation, musculation, sports collectifs.' },
      { slug: 'respiration', label: 'Respiration', description: 'La respiration est le seul système autonome que l\'on peut contrôler consciemment.' },
    ],
  },
  {
    id: 'liens', name: 'Les Liens', tagline: 'Ce qui nous lie, ce qui nous divise, ce qui nous transforme.', color: '#E67839',
    subtopics: [
      { slug: 'parentalite', label: 'Parentalité', description: 'Être parent est le rôle le plus exigeant qui soit.' },
      { slug: 'couples', label: 'Couples', description: 'L\'amour au quotidien, les crises, la communication, la sexualité.' },
      { slug: 'amitie', label: 'Amitié', description: 'L\'amitié est le lien qu\'on choisit.' },
      { slug: 'education', label: 'Éducation', description: 'L\'école, les apprentissages, la transmission.' },
      { slug: 'generations', label: 'Générations', description: 'Boomers, Gen X, millennials, Gen Z.' },
      { slug: 'communaute', label: 'Communauté', description: 'Dans un monde individualiste, le besoin de communauté revient en force.' },
      { slug: 'ruptures', label: 'Ruptures', description: 'Divorce, deuil amical, rupture familiale.' },
      { slug: 'enquetes-sociales', label: 'Enquêtes sociales', description: 'Précarité, inégalités, fractures territoriales.' },
    ],
  },
  {
    id: 'monde', name: 'Le Monde', tagline: 'Partir pour comprendre. Revenir pour raconter.', color: '#2E9B74',
    subtopics: [
      { slug: 'recits-voyage', label: 'Récits de voyage', description: 'Partir, se perdre, revenir changé.' },
      { slug: 'destinations', label: 'Destinations', description: 'Des lieux qui changent ceux qui les visitent.' },
      { slug: 'art', label: 'Art', description: 'L\'art contemporain, le street art, les arts visuels.' },
      { slug: 'musique', label: 'Musique', description: 'La musique comme langage universel.' },
      { slug: 'litterature', label: 'Littérature', description: 'Romans, essais, poésie.' },
      { slug: 'cinema', label: 'Cinéma', description: 'Films, séries, documentaires.' },
      { slug: 'creativite', label: 'Créativité', description: 'La créativité n\'est pas réservée aux artistes.' },
      { slug: 'photographie', label: 'Photographie', description: 'La photographie comme regard sur le monde.' },
    ],
  },
  {
    id: 'avenir', name: "L'Avenir", tagline: 'Ce qui change, ce qui vient, ce qui nous attend.', color: '#2E94B5',
    subtopics: [
      { slug: 'carriere', label: 'Carrière', description: 'Reconversion, négociation salariale, quête de sens au travail.' },
      { slug: 'entrepreneuriat', label: 'Entrepreneuriat', description: 'Créer, lancer, échouer, recommencer.' },
      { slug: 'innovation', label: 'Innovation', description: 'L\'innovation n\'est pas que technologique.' },
      { slug: 'ia', label: 'Intelligence artificielle', description: 'L\'IA transforme le travail, la création, la médecine et la société.' },
      { slug: 'economie', label: 'Économie', description: 'Au-delà des chiffres, l\'économie raconte nos choix de société.' },
      { slug: 'leadership', label: 'Leadership', description: 'Diriger sans dominer, inspirer sans manipuler.' },
      { slug: 'numerique', label: 'Numérique', description: 'Le numérique transforme tout.' },
      { slug: 'nomadisme', label: 'Nomadisme', description: 'Travailler de partout, vivre nulle part — ou partout.' },
    ],
  },
]

export const UNIVERS_MAP = Object.fromEntries(UNIVERS_DATA.map(u => [u.id, u])) as Record<string, UniversData>
