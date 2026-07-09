/*
 * apply-megamenu.js — adds hover mega-menu dropdowns (Services, Guides) to the
 * dark-navy nav on standalone landing/resource pages. Idempotent.
 * Run: node apply-megamenu.js
 */
const fs = require('fs');
const path = require('path');
const DIR = __dirname;

const FILES = [
  'dot-physical.html', 'drug-test.html', 'consortium.html',
  'pre-employment-physical.html', 'corporate-invoicing.html',
  'find-a-location.html', 'return-to-duty.html', 'medical-team.html',
];

const CSS = `
  /* ── Mega-menu dropdowns ── */
  .wom-drop { position: relative; display: flex; align-items: center; height: 64px; }
  .wom-drop > a { display: flex; align-items: center; gap: 7px; }
  .wom-caret { width: 7px; height: 7px; border-right: 2px solid #93c5fd; border-bottom: 2px solid #93c5fd; transform: rotate(45deg) translateY(-2px); transition: transform .2s ease; }
  .wom-drop:hover .wom-caret { transform: rotate(225deg) translateY(-2px); }
  .wom-panel { position: absolute; top: 64px; left: -24px; background: #0d1b2a; border-top: 3px solid #1d4ed8; border-radius: 0 0 14px 14px; box-shadow: 0 24px 48px rgba(0,0,0,.4); padding: 24px 28px; display: flex; gap: 40px; opacity: 0; visibility: hidden; transform: translateY(6px); transition: opacity .18s ease, transform .18s ease, visibility .18s; z-index: 300; }
  .wom-drop:hover .wom-panel { opacity: 1; visibility: visible; transform: translateY(0); }
  .wom-col { display: flex; flex-direction: column; gap: 4px; min-width: 210px; }
  .wom-col-h { font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #64748b; margin-bottom: 8px; }
  .wom-panel a { font-family: 'Inter', sans-serif; text-decoration: none; padding: 9px 12px; border-radius: 8px; display: block; transition: background .15s ease; }
  .wom-panel a:hover { background: rgba(29,78,216,.28); }
  .wom-panel a .wom-t { display: block; font-size: 16px; font-weight: 600; color: #fff; line-height: 1.3; }
  .wom-panel a .wom-d { display: block; font-size: 13px; font-weight: 400; color: #93c5fd; margin-top: 1px; }
  @media (max-width: 900px) { .wom-drop { height: auto; } .wom-caret { display: none; } .wom-panel { display: none !important; } }
`;

// Middle nav content (dropdowns + plain links). Relative links (pages live at site root).
const NAV_INNER = `
    <div class="wom-drop">
      <a href="/#services" style="font-family:'Inter',sans-serif;font-size:18px;font-weight:500;color:white;text-decoration:none;">Services <span class="wom-caret"></span></a>
      <div class="wom-panel">
        <div class="wom-col">
          <div class="wom-col-h">Exams &amp; Testing</div>
          <a href="dot-physical"><span class="wom-t">DOT Physical</span><span class="wom-d">$110 · same-day medical card</span></a>
          <a href="drug-test"><span class="wom-t">Drug &amp; Alcohol Testing</span><span class="wom-d">DOT &amp; non-DOT · 15,000+ sites</span></a>
          <a href="pre-employment-physical"><span class="wom-t">Pre-Employment Physical</span><span class="wom-d">Fitness-for-duty for new hires</span></a>
          <a href="return-to-duty"><span class="wom-t">Return to Duty</span><span class="wom-d">SAP &amp; follow-up testing</span></a>
        </div>
        <div class="wom-col">
          <div class="wom-col-h">Employers &amp; Compliance</div>
          <a href="consortium"><span class="wom-t">DOT Consortium</span><span class="wom-d">Random testing · $49/yr</span></a>
          <a href="corporate-invoicing"><span class="wom-t">Corporate Invoicing</span><span class="wom-d">Net-30 billing for fleets</span></a>
          <a href="find-a-location"><span class="wom-t">Find a Location</span><span class="wom-d">Certified sites near you</span></a>
          <a href="partners"><span class="wom-t">Become a Partner</span><span class="wom-d">Add your clinic to our network</span></a>
        </div>
      </div>
    </div>
    <a href="find-a-location" style="font-family:'Inter',sans-serif;font-size:18px;font-weight:500;color:white;text-decoration:none;">Find a Location</a>
    <div class="wom-drop">
      <a href="guides" style="font-family:'Inter',sans-serif;font-size:18px;font-weight:500;color:white;text-decoration:none;">Guides <span class="wom-caret"></span></a>
      <div class="wom-panel">
        <div class="wom-col">
          <div class="wom-col-h">Popular Guides</div>
          <a href="dot-physical-requirements-2026"><span class="wom-t">DOT Physical Requirements 2026</span><span class="wom-d">Complete driver checklist</span></a>
          <a href="what-disqualifies-you-from-a-dot-physical"><span class="wom-t">What Disqualifies You?</span><span class="wom-d">Conditions &amp; how to still pass</span></a>
          <a href="fmcsa-drug-testing-rules"><span class="wom-t">FMCSA Drug Testing Rules</span><span class="wom-d">Test types, random rates, Clearinghouse</span></a>
        </div>
        <div class="wom-col">
          <div class="wom-col-h">More Resources</div>
          <a href="cdl-medical-card-renewal"><span class="wom-t">CDL Medical Card Renewal</span><span class="wom-d">How &amp; when to renew</span></a>
          <a href="dot-physical-vs-pre-employment-physical"><span class="wom-t">DOT vs. Pre-Employment</span><span class="wom-d">Which exam do you need?</span></a>
          <a href="medical-team"><span class="wom-t">Our Medical Team</span><span class="wom-d">Physician-led occupational health</span></a>
          <a href="guides"><span class="wom-t">All Guides →</span><span class="wom-d">Full resource center</span></a>
        </div>
      </div>
    </div>
    <a href="return-to-duty" style="font-family:'Inter',sans-serif;font-size:18px;font-weight:500;color:white;text-decoration:none;">Return to Duty</a>
    <a href="partners" style="font-family:'Inter',sans-serif;font-size:18px;font-weight:600;color:#1d4ed8;text-decoration:none;">Become a Partner</a>
  `;

function patch(file) {
  const fp = path.join(DIR, file);
  let html = fs.readFileSync(fp, 'utf8');
  const before = html;

  // 1) inject CSS before first </style> (once)
  if (!html.includes('.wom-drop')) {
    html = html.replace('</style>', CSS + '</style>');
  }

  // 2) replace the middle nav container's inner content (3 known variants)
  let replaced = false;
  const variants = [
    /(<div class="nav-links-wrap"[^>]*>)([\s\S]*?)(<\/div>)/,          // A
    /(<ul class="nav-links">)([\s\S]*?)(<\/ul>)/,                       // B (find-a-location)
    /(<div style="display:flex;gap:28px;align-items:center;flex:1;">)([\s\S]*?)(<\/div>)/, // C (return-to-duty)
  ];
  for (const re of variants) {
    if (re.test(html)) {
      html = html.replace(re, (m, open, _mid, close) => {
        // For the <ul> variant, swap to a <div> so it holds .wom-drop children,
        // but keep the .nav-links class so existing mobile media query hides it.
        if (open.startsWith('<ul')) {
          return `<div class="nav-links" style="display:flex;gap:28px;align-items:center;flex:1;">` + NAV_INNER + `</div>`;
        }
        return open + NAV_INNER + close;
      });
      replaced = true;
      break;
    }
  }

  if (html !== before) {
    fs.writeFileSync(fp, html, 'utf8');
    console.log(`patched ${file}${replaced ? '' : '  (CSS only — NAV pattern NOT found!)'}`);
  } else {
    console.log(`skipped ${file} (already patched)`);
  }
  if (!replaced) console.warn(`  ⚠ ${file}: nav container not matched — check manually`);
}

FILES.forEach(patch);
console.log('done.');
