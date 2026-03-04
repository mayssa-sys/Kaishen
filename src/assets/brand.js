/**
 * Kaishen Brand Kit
 * =================
 * Color Palette & Logo (SVG)
 *
 * PRIMARY:   Dark Charcoal #0D0F13  — sleek, modern tech dark mode
 * SECONDARY: Electric Violet #7C3AED — AI energy, innovation, bold
 * ACCENT:    Cyan           #06D6F2  — digital, futuristic, "Fresh USD"
 * SURFACE:   Graphite       #161921  — clean card backgrounds
 * MUTED:     Cool Gray      #2E3345  — borders, secondary elements
 * TEXT:      Off-White      #EDEFFA  — primary text
 * TEXT-DIM:  #7B839B         — secondary/muted text
 * SUCCESS:   #10E88C
 * WARNING:   #F5A623
 * DANGER:    #EF4466
 */

const COLORS = {
  primary:   '#0D0F13',
  secondary: '#7C3AED',
  accent:    '#06D6F2',
  surface:   '#161921',
  muted:     '#2E3345',
  text:      '#EDEFFA',
  textDim:   '#7B839B',
  success:   '#10E88C',
  warning:   '#F5A623',
  danger:    '#EF4466',
  // Gradients
  gradientMain: 'linear-gradient(135deg, #7C3AED 0%, #06D6F2 100%)',
  gradientDark: 'linear-gradient(180deg, #0D0F13 0%, #161921 100%)',
};

// Kaishen logo — stylized K with coin/circle motif
// Outer circle = currency/coin, inner K = bold geometric
// Violet-to-cyan gradient gives AI/tech energy
const LOGO_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="mainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#7C3AED"/>
      <stop offset="100%" style="stop-color:#06D6F2"/>
    </linearGradient>
    <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#7C3AED;stop-opacity:0.4"/>
      <stop offset="100%" style="stop-color:#06D6F2;stop-opacity:0.4"/>
    </linearGradient>
  </defs>
  <!-- Outer coin ring -->
  <circle cx="100" cy="100" r="94" fill="none" stroke="url(#mainGrad)" stroke-width="4"/>
  <circle cx="100" cy="100" r="86" fill="none" stroke="url(#glowGrad)" stroke-width="1.5"/>
  <!-- Inner background circle -->
  <circle cx="100" cy="100" r="82" fill="#0D0F13"/>
  <!-- Decorative arc — flow/cycle motif -->
  <path d="M 40 100 A 60 60 0 0 1 160 100" fill="none" stroke="url(#glowGrad)" stroke-width="2" stroke-linecap="round"/>
  <!-- Stylized K letterform -->
  <rect x="68" y="55" width="12" height="90" rx="3" fill="url(#mainGrad)"/>
  <polygon points="84,100 130,55 143,55 143,62 92,100" fill="url(#mainGrad)"/>
  <polygon points="84,100 92,100 143,138 143,145 130,145" fill="url(#mainGrad)"/>
  <!-- Accent dot — digital pulse -->
  <circle cx="100" cy="100" r="3" fill="#06D6F2" opacity="0.8"/>
</svg>`;

// Compact icon for favicon
const LOGO_ICON_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <linearGradient id="iGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#7C3AED"/>
      <stop offset="100%" style="stop-color:#06D6F2"/>
    </linearGradient>
  </defs>
  <circle cx="32" cy="32" r="30" fill="#0D0F13" stroke="url(#iGrad)" stroke-width="2"/>
  <rect x="20" y="16" width="5" height="32" rx="1.5" fill="url(#iGrad)"/>
  <polygon points="27,32 44,16 50,16 50,19 30,32" fill="url(#iGrad)"/>
  <polygon points="27,32 30,32 50,45 50,48 44,48" fill="url(#iGrad)"/>
</svg>`;

// Wordmark — "KAISHEN" text logo
const LOGO_WORDMARK_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 60" width="420" height="60">
  <defs>
    <linearGradient id="wGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#7C3AED"/>
      <stop offset="100%" style="stop-color:#06D6F2"/>
    </linearGradient>
  </defs>
  <text x="0" y="44" font-family="'Segoe UI','Helvetica Neue',Arial,sans-serif" font-size="48" font-weight="700" letter-spacing="12" fill="url(#wGrad)">KAISHEN</text>
  <line x1="0" y1="54" x2="420" y2="54" stroke="#06D6F2" stroke-width="1.5" opacity="0.3"/>
</svg>`;

module.exports = { COLORS, LOGO_SVG, LOGO_ICON_SVG, LOGO_WORDMARK_SVG };
