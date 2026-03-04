/**
 * Kaishen Brand Kit
 * =================
 * Color Palette & Logo (SVG)
 *
 * PRIMARY:   Deep Navy  #0B1D3A  — trust, stability, professionalism
 * SECONDARY: Rich Gold  #C9A84C  — wealth, premium, aspiration (ties to Kaishen = god of wealth)
 * ACCENT:    Teal       #1ABFB0  — fintech modernity, freshness (Fresh USD)
 * SURFACE:   Dark Slate #111B2E  — card/panel backgrounds
 * MUTED:     Slate Gray #3A4A6B  — borders, secondary text
 * TEXT:      Off-White  #EDF0F5  — primary text
 * TEXT-DIM:  #8A95A9    — secondary/muted text
 * SUCCESS:   #27C993
 * WARNING:   #F0B429
 * DANGER:    #E55050
 */

const COLORS = {
  primary:   '#0B1D3A',
  secondary: '#C9A84C',
  accent:    '#1ABFB0',
  surface:   '#111B2E',
  muted:     '#3A4A6B',
  text:      '#EDF0F5',
  textDim:   '#8A95A9',
  success:   '#27C993',
  warning:   '#F0B429',
  danger:    '#E55050',
  // Gradients
  gradientGold: 'linear-gradient(135deg, #C9A84C 0%, #E8D48B 50%, #C9A84C 100%)',
  gradientNavy: 'linear-gradient(180deg, #0B1D3A 0%, #111B2E 100%)',
};

// Kaishen logo — stylized K with coin/circle motif
// The outer circle represents currency/coin, the inner K is bold and geometric
// A subtle arc suggests movement/flow (money in motion, BNPL cycle)
const LOGO_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#C9A84C"/>
      <stop offset="50%" style="stop-color:#E8D48B"/>
      <stop offset="100%" style="stop-color:#C9A84C"/>
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1ABFB0"/>
      <stop offset="100%" style="stop-color:#1ABFB0;stop-opacity:0.4"/>
    </linearGradient>
  </defs>
  <!-- Outer coin ring -->
  <circle cx="100" cy="100" r="94" fill="none" stroke="url(#goldGrad)" stroke-width="4"/>
  <circle cx="100" cy="100" r="86" fill="none" stroke="url(#goldGrad)" stroke-width="1.5" opacity="0.5"/>
  <!-- Inner background circle -->
  <circle cx="100" cy="100" r="82" fill="#0B1D3A"/>
  <!-- Decorative arc — flow/cycle motif -->
  <path d="M 40 100 A 60 60 0 0 1 160 100" fill="none" stroke="url(#accentGrad)" stroke-width="2" stroke-linecap="round" opacity="0.3"/>
  <!-- Stylized K letterform -->
  <!-- Vertical stroke -->
  <rect x="68" y="55" width="12" height="90" rx="3" fill="url(#goldGrad)"/>
  <!-- Upper diagonal -->
  <polygon points="84,100 130,55 143,55 143,62 92,100" fill="url(#goldGrad)"/>
  <!-- Lower diagonal -->
  <polygon points="84,100 92,100 143,138 143,145 130,145" fill="url(#goldGrad)"/>
  <!-- Small accent dot — coin center -->
  <circle cx="100" cy="100" r="3" fill="#1ABFB0" opacity="0.6"/>
</svg>`;

// Compact logo for favicon / small contexts (just the K in a circle)
const LOGO_ICON_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <circle cx="32" cy="32" r="30" fill="#0B1D3A" stroke="#C9A84C" stroke-width="2"/>
  <rect x="20" y="16" width="5" height="32" rx="1.5" fill="#C9A84C"/>
  <polygon points="27,32 44,16 50,16 50,19 30,32" fill="#C9A84C"/>
  <polygon points="27,32 30,32 50,45 50,48 44,48" fill="#C9A84C"/>
</svg>`;

// Wordmark — "KAISHEN" text logo
const LOGO_WORDMARK_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 60" width="420" height="60">
  <defs>
    <linearGradient id="wGold" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#C9A84C"/>
      <stop offset="50%" style="stop-color:#E8D48B"/>
      <stop offset="100%" style="stop-color:#C9A84C"/>
    </linearGradient>
  </defs>
  <text x="0" y="44" font-family="'Segoe UI','Helvetica Neue',Arial,sans-serif" font-size="48" font-weight="700" letter-spacing="12" fill="url(#wGold)">KAISHEN</text>
  <line x1="0" y1="54" x2="420" y2="54" stroke="#1ABFB0" stroke-width="1.5" opacity="0.4"/>
</svg>`;

module.exports = { COLORS, LOGO_SVG, LOGO_ICON_SVG, LOGO_WORDMARK_SVG };
