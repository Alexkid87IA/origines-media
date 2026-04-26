// Origines — Design Tokens
// Single source of truth for the design system

window.OriginesTokens = {
  colors: {
    // Core
    ink: '#0A0A0A',          // Near-black, used for logo frame & body text on light
    paper: '#F7F5F0',        // Warm off-white, brand background
    pure: '#FFFFFF',         // Pure white, for cards on paper
    shadow: '#1A1A1A',       // Deep dark for dark-mode surfaces

    // Grays (for borders, muted text)
    stone900: '#141414',
    stone700: '#3A3A3A',
    stone500: '#6B6B6B',
    stone300: '#B8B6AF',
    stone100: '#E8E5DE',
    stone50:  '#F0EDE6',

    // Category palette — harmonized via oklch(0.68 0.17 <hue>)
    // Each one has a dark variant oklch(0.42 0.13 <hue>) for accessibility on paper
    categories: {
      psychologie:   { hue: 295, light: '#A78BE8', mid: '#7B5CD6', dark: '#4A2FA8', label: 'Psychologie' },
      societe:       { hue: 25,  light: '#F5A878', mid: '#E67839', dark: '#B04E15', label: 'Société' },
      famille:       { hue: 55,  light: '#E8C872', mid: '#C99B1E', dark: '#8A6700', label: 'Famille' },
      voyage:        { hue: 165, light: '#6FC9A6', mid: '#2E9B74', dark: '#0A6848', label: 'Voyage' },
      spiritualite:  { hue: 260, light: '#9098E8', mid: '#5A66D6', dark: '#2A34A0', label: 'Spiritualité' },
      carriere:      { hue: 230, light: '#7AA8E8', mid: '#3E7DD6', dark: '#1A4FA0', label: 'Carrière' },
      art:           { hue: 340, light: '#E88AB8', mid: '#D64C90', dark: '#A01A5F', label: 'Art & Créativité' },
      sante:         { hue: 130, light: '#8FD088', mid: '#5AA352', dark: '#2A6F22', label: 'Santé' },
      tech:          { hue: 200, light: '#6FC5DE', mid: '#2E94B5', dark: '#0A6383', label: 'Tech' },
      business:      { hue: 195, light: '#5FCED0', mid: '#1EA0A3', dark: '#006D70', label: 'Business' },
    }
  },

  type: {
    display: "'Archivo', 'Arial Black', sans-serif",       // Titles, display
    body:    "'Inter Tight', 'Helvetica Neue', sans-serif",// Body, UI
    mono:    "'JetBrains Mono', 'Menlo', monospace",       // Tags, metadata, captions
    serif:   "'Fraunces', Georgia, serif",         // Editorial accents (pullquotes, drop caps)
  },

  scale: {
    // Type scale (editorial, larger than standard web)
    xs:   '12px',
    sm:   '14px',
    base: '16px',
    md:   '18px',
    lg:   '21px',
    xl:   '28px',
    '2xl':'36px',
    '3xl':'48px',
    '4xl':'64px',
    '5xl':'88px',
    '6xl':'128px',
    '7xl':'180px',
  },

  space: {
    1: '4px', 2: '8px', 3: '12px', 4: '16px', 5: '24px',
    6: '32px', 7: '48px', 8: '64px', 9: '96px', 10: '128px', 11: '192px'
  },

  radius: {
    none: '0px',
    sm:   '4px',
    md:   '8px',
    pill: '999px',
  },

  grid: {
    max: 1360,
    gutter: 24,
    cols: 12,
  }
};
