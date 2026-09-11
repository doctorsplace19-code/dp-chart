// generate-consortium-rtd-city-pages.js
// Run: node generate-consortium-rtd-city-pages.js
// Generates cities/consortium-[state-city].html and cities/rtd-[state-city].html
// — one pair per city (5 cities x 50 states = 250 cities, 500 pages) — targeting
// city-level DOT Consortium / C-TPA and Return-to-Duty search intent, which is
// higher-margin and less saturated than the DOT-physical city pages.

const fs = require('fs');
const path = require('path');
const { STATE_FACTS } = require('./geo-facts');

const STATES = [
  { name: 'Alabama', slug: 'alabama', abbr: 'AL', cities: ['Birmingham', 'Montgomery', 'Huntsville', 'Mobile', 'Tuscaloosa'] },
  { name: 'Alaska', slug: 'alaska', abbr: 'AK', cities: ['Anchorage', 'Fairbanks', 'Juneau', 'Sitka', 'Wasilla'] },
  { name: 'Arizona', slug: 'arizona', abbr: 'AZ', cities: ['Phoenix', 'Tucson', 'Mesa', 'Chandler', 'Scottsdale'] },
  { name: 'Arkansas', slug: 'arkansas', abbr: 'AR', cities: ['Little Rock', 'Fort Smith', 'Fayetteville', 'Springdale', 'Jonesboro'] },
  { name: 'California', slug: 'california', abbr: 'CA', cities: ['Los Angeles', 'San Diego', 'San Jose', 'San Francisco', 'Fresno'] },
  { name: 'Colorado', slug: 'colorado', abbr: 'CO', cities: ['Denver', 'Colorado Springs', 'Aurora', 'Fort Collins', 'Lakewood'] },
  { name: 'Connecticut', slug: 'connecticut', abbr: 'CT', cities: ['Bridgeport', 'New Haven', 'Hartford', 'Stamford', 'Waterbury'] },
  { name: 'Delaware', slug: 'delaware', abbr: 'DE', cities: ['Wilmington', 'Dover', 'Newark', 'Middletown', 'Smyrna'] },
  { name: 'Florida', slug: 'florida', abbr: 'FL', cities: ['Jacksonville', 'Miami', 'Tampa', 'Orlando', 'St. Petersburg'] },
  { name: 'Georgia', slug: 'georgia', abbr: 'GA', cities: ['Atlanta', 'Augusta', 'Columbus', 'Macon', 'Savannah'] },
  { name: 'Hawaii', slug: 'hawaii', abbr: 'HI', cities: ['Honolulu', 'Pearl City', 'Hilo', 'Kailua', 'Waipahu'] },
  { name: 'Idaho', slug: 'idaho', abbr: 'ID', cities: ['Boise', 'Meridian', 'Nampa', 'Idaho Falls', 'Pocatello'] },
  { name: 'Illinois', slug: 'illinois', abbr: 'IL', cities: ['Chicago', 'Aurora', 'Naperville', 'Joliet', 'Rockford'] },
  { name: 'Indiana', slug: 'indiana', abbr: 'IN', cities: ['Indianapolis', 'Fort Wayne', 'Evansville', 'South Bend', 'Carmel'] },
  { name: 'Iowa', slug: 'iowa', abbr: 'IA', cities: ['Des Moines', 'Cedar Rapids', 'Davenport', 'Sioux City', 'Iowa City'] },
  { name: 'Kansas', slug: 'kansas', abbr: 'KS', cities: ['Wichita', 'Overland Park', 'Kansas City', 'Topeka', 'Olathe'] },
  { name: 'Kentucky', slug: 'kentucky', abbr: 'KY', cities: ['Louisville', 'Lexington', 'Bowling Green', 'Owensboro', 'Covington'] },
  { name: 'Louisiana', slug: 'louisiana', abbr: 'LA', cities: ['New Orleans', 'Baton Rouge', 'Shreveport', 'Lafayette', 'Lake Charles'] },
  { name: 'Maine', slug: 'maine', abbr: 'ME', cities: ['Portland', 'Lewiston', 'Bangor', 'South Portland', 'Auburn'] },
  { name: 'Maryland', slug: 'maryland', abbr: 'MD', cities: ['Baltimore', 'Columbia', 'Germantown', 'Silver Spring', 'Waldorf'] },
  { name: 'Massachusetts', slug: 'massachusetts', abbr: 'MA', cities: ['Boston', 'Worcester', 'Springfield', 'Cambridge', 'Lowell'] },
  { name: 'Michigan', slug: 'michigan', abbr: 'MI', cities: ['Detroit', 'Grand Rapids', 'Warren', 'Sterling Heights', 'Ann Arbor'] },
  { name: 'Minnesota', slug: 'minnesota', abbr: 'MN', cities: ['Minneapolis', 'Saint Paul', 'Rochester', 'Duluth', 'Bloomington'] },
  { name: 'Mississippi', slug: 'mississippi', abbr: 'MS', cities: ['Jackson', 'Gulfport', 'Southaven', 'Hattiesburg', 'Biloxi'] },
  { name: 'Missouri', slug: 'missouri', abbr: 'MO', cities: ['Kansas City', 'St. Louis', 'Springfield', 'Columbia', 'Independence'] },
  { name: 'Montana', slug: 'montana', abbr: 'MT', cities: ['Billings', 'Missoula', 'Great Falls', 'Bozeman', 'Butte'] },
  { name: 'Nebraska', slug: 'nebraska', abbr: 'NE', cities: ['Omaha', 'Lincoln', 'Bellevue', 'Grand Island', 'Kearney'] },
  { name: 'Nevada', slug: 'nevada', abbr: 'NV', cities: ['Las Vegas', 'Henderson', 'Reno', 'North Las Vegas', 'Sparks'] },
  { name: 'New Hampshire', slug: 'new-hampshire', abbr: 'NH', cities: ['Manchester', 'Nashua', 'Concord', 'Dover', 'Rochester'] },
  { name: 'New Jersey', slug: 'new-jersey', abbr: 'NJ', cities: ['Newark', 'Jersey City', 'Paterson', 'Elizabeth', 'Trenton'] },
  { name: 'New Mexico', slug: 'new-mexico', abbr: 'NM', cities: ['Albuquerque', 'Las Cruces', 'Rio Rancho', 'Santa Fe', 'Roswell'] },
  { name: 'New York', slug: 'new-york', abbr: 'NY', cities: ['New York City', 'Buffalo', 'Rochester', 'Yonkers', 'Syracuse'] },
  { name: 'North Carolina', slug: 'north-carolina', abbr: 'NC', cities: ['Charlotte', 'Raleigh', 'Greensboro', 'Durham', 'Winston-Salem'] },
  { name: 'North Dakota', slug: 'north-dakota', abbr: 'ND', cities: ['Fargo', 'Bismarck', 'Grand Forks', 'Minot', 'West Fargo'] },
  { name: 'Ohio', slug: 'ohio', abbr: 'OH', cities: ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron'] },
  { name: 'Oklahoma', slug: 'oklahoma', abbr: 'OK', cities: ['Oklahoma City', 'Tulsa', 'Norman', 'Broken Arrow', 'Edmond'] },
  { name: 'Oregon', slug: 'oregon', abbr: 'OR', cities: ['Portland', 'Salem', 'Eugene', 'Gresham', 'Hillsboro'] },
  { name: 'Pennsylvania', slug: 'pennsylvania', abbr: 'PA', cities: ['Philadelphia', 'Pittsburgh', 'Allentown', 'Erie', 'Reading'] },
  { name: 'Rhode Island', slug: 'rhode-island', abbr: 'RI', cities: ['Providence', 'Cranston', 'Warwick', 'Pawtucket', 'East Providence'] },
  { name: 'South Carolina', slug: 'south-carolina', abbr: 'SC', cities: ['Columbia', 'Charleston', 'North Charleston', 'Mount Pleasant', 'Rock Hill'] },
  { name: 'South Dakota', slug: 'south-dakota', abbr: 'SD', cities: ['Sioux Falls', 'Rapid City', 'Aberdeen', 'Brookings', 'Watertown'] },
  { name: 'Tennessee', slug: 'tennessee', abbr: 'TN', cities: ['Nashville', 'Memphis', 'Knoxville', 'Chattanooga', 'Clarksville'] },
  { name: 'Texas', slug: 'texas', abbr: 'TX', cities: ['Houston', 'San Antonio', 'Dallas', 'Austin', 'Fort Worth'] },
  { name: 'Utah', slug: 'utah', abbr: 'UT', cities: ['Salt Lake City', 'West Valley City', 'Provo', 'West Jordan', 'Orem'] },
  { name: 'Vermont', slug: 'vermont', abbr: 'VT', cities: ['Burlington', 'South Burlington', 'Rutland', 'Essex', 'Colchester'] },
  { name: 'Virginia', slug: 'virginia', abbr: 'VA', cities: ['Virginia Beach', 'Norfolk', 'Chesapeake', 'Richmond', 'Newport News'] },
  { name: 'Washington', slug: 'washington', abbr: 'WA', cities: ['Seattle', 'Spokane', 'Tacoma', 'Vancouver', 'Bellevue'] },
  { name: 'West Virginia', slug: 'west-virginia', abbr: 'WV', cities: ['Charleston', 'Huntington', 'Morgantown', 'Parkersburg', 'Wheeling'] },
  { name: 'Wisconsin', slug: 'wisconsin', abbr: 'WI', cities: ['Milwaukee', 'Madison', 'Green Bay', 'Kenosha', 'Racine'] },
  { name: 'Wyoming', slug: 'wyoming', abbr: 'WY', cities: ['Cheyenne', 'Casper', 'Laramie', 'Gillette', 'Rock Springs'] },
];

const DEFAULT_FACTS = { interstates: 'major interstate highways', corridor: 'regional freight routes', industries: 'trucking, construction, and healthcare', cdlNote: 'CDL drivers must keep a current Medical Examiner’s Certificate on file with their state.' };

function citySlugOf(stateSlug, city) {
  return `${stateSlug}-${city.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}

const SHARED_CSS = `
  :root{--navy:#1e40af;--teal:#0891b2;--text:#0f172a;--muted:#475569;--border:#e2e8f0;--cream:#eff6ff;}
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  html{scroll-behavior:smooth;}
  body{font-family:'Inter',sans-serif;background:#fff;color:var(--text);line-height:1.6;}
  nav{position:fixed;top:0;left:0;right:0;z-index:100;background:#0d1b2a;display:flex;align-items:center;justify-content:space-between;padding:0 40px;height:68px;box-shadow:0 1px 12px rgba(0,0,0,0.15);}
  .nav-logo{display:flex;align-items:center;gap:12px;text-decoration:none;}
  .logo-mark{width:38px;height:38px;background:linear-gradient(135deg,#1e40af,#0891b2);border-radius:10px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px;color:white;}
  .logo-name{font-size:19px;font-weight:800;color:white;line-height:1.1;}
  .logo-sub{font-size:10px;color:rgba(255,255,255,.5);letter-spacing:.1em;text-transform:uppercase;}
  .nav-links{display:flex;align-items:center;gap:22px;list-style:none;flex:1;justify-content:center;}
  .nav-links a{color:rgba(255,255,255,.9);text-decoration:none;font-size:15px;font-weight:500;}
  .btn{display:inline-flex;align-items:center;padding:9px 18px;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none;white-space:nowrap;}
  .btn-primary{background:linear-gradient(135deg,#1e40af,#0891b2);color:white;}
  .btn-ghost{border:1px solid rgba(255,255,255,.25);color:white;background:transparent;}
  .wom-drop{position:relative;}
  .wom-panel{display:none;position:absolute;top:100%;left:0;background:white;border-radius:12px;box-shadow:0 12px 32px rgba(0,0,0,.18);padding:20px;gap:28px;min-width:520px;z-index:50;}
  .wom-drop:hover .wom-panel{display:flex;}
  .wom-col{display:flex;flex-direction:column;gap:2px;min-width:220px;}
  .wom-col-h{font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#94a3b8;margin-bottom:8px;}
  .wom-col a{padding:8px 10px;border-radius:8px;display:flex;flex-direction:column;}
  .wom-col a:hover{background:#f1f5f9;}
  .wom-t{font-size:14px;font-weight:600;color:#0f172a;}
  .wom-d{font-size:12px;color:#64748b;}
  .hero{position:relative;background:linear-gradient(135deg,#0d1b2a 0%,#1e3a5f 100%);padding:150px 24px 70px;overflow:hidden;}
  .hero-inner{max-width:900px;margin:0 auto;position:relative;z-index:2;}
  .breadcrumb{font-size:13px;color:rgba(255,255,255,.5);margin-bottom:18px;}
  .breadcrumb a{color:rgba(255,255,255,.65);text-decoration:none;}
  .hero-badge{display:inline-block;background:rgba(94,234,212,.12);border:1px solid rgba(94,234,212,.3);color:#5eead4;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:6px 14px;border-radius:20px;margin-bottom:18px;}
  h1{font-size:clamp(2rem,4.2vw,3.1rem);font-weight:800;color:white;line-height:1.1;margin-bottom:18px;}
  h1 span{color:#5eead4;}
  .hero-sub{font-size:18px;color:rgba(255,255,255,.75);max-width:640px;line-height:1.65;margin-bottom:32px;}
  .hero-ctas{display:flex;gap:14px;flex-wrap:wrap;}
  .btn-white{background:white;color:#0d1b2a;font-weight:700;padding:15px 30px;border-radius:10px;text-decoration:none;font-size:16px;}
  .btn-outline{border:1.5px solid rgba(255,255,255,.35);color:white;font-weight:600;padding:14px 28px;border-radius:10px;text-decoration:none;font-size:16px;}
  section{padding:64px 24px;}
  .section-inner{max-width:900px;margin:0 auto;}
  .section-label{font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--teal);margin-bottom:10px;}
  .section-title{font-size:clamp(1.6rem,3vw,2.2rem);font-weight:800;margin-bottom:16px;}
  .section-sub{font-size:16px;color:var(--muted);max-width:720px;margin-bottom:36px;line-height:1.7;}
  .steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:20px;margin-top:8px;}
  .step-card{background:var(--cream);border:1px solid var(--border);border-radius:14px;padding:24px;}
  .step-num{width:32px;height:32px;border-radius:8px;background:var(--navy);color:white;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;margin-bottom:14px;}
  .step-card h3{font-size:16px;margin-bottom:8px;}
  .step-card p{font-size:14px;color:var(--muted);line-height:1.6;}
  .fact-box{background:#f8fafc;border:1px solid var(--border);border-radius:14px;padding:26px 28px;margin:28px 0;}
  .fact-box p{font-size:15px;color:var(--muted);line-height:1.75;}
  .fact-box strong{color:var(--text);}
  .price-card{background:linear-gradient(135deg,#0d1b2a,#1e3a5f);border-radius:16px;padding:32px;color:white;text-align:center;max-width:420px;margin:32px auto 0;}
  .price-card .amt{font-size:44px;font-weight:800;margin:8px 0;}
  .price-card .amt span{font-size:16px;font-weight:500;color:rgba(255,255,255,.6);}
  .price-card a{display:block;margin-top:20px;background:white;color:#0d1b2a;font-weight:700;padding:14px;border-radius:10px;text-decoration:none;}
  .cities-list{display:flex;flex-wrap:wrap;gap:10px;margin-top:8px;}
  .cities-list a{background:var(--cream);border:1px solid var(--border);color:var(--navy);font-size:13px;font-weight:600;padding:8px 14px;border-radius:20px;text-decoration:none;}
  .faq-item{border-bottom:1px solid var(--border);padding:20px 0;}
  .faq-item h3{font-size:16px;margin-bottom:8px;}
  .faq-item p{font-size:14px;color:var(--muted);line-height:1.7;}
  .cta-strip{background:linear-gradient(135deg,#0d1b2a,#134e4a);padding:56px 24px;text-align:center;}
  .cta-strip h2{color:white;font-size:clamp(1.5rem,3vw,2rem);margin-bottom:10px;}
  .cta-strip p{color:rgba(255,255,255,.7);margin-bottom:24px;}
  .cta-btns{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;}
  .cta-btn-primary{background:#5eead4;color:#0d1b2a;font-weight:700;padding:14px 28px;border-radius:10px;text-decoration:none;}
  .cta-btn-outline{border:1.5px solid rgba(255,255,255,.3);color:white;font-weight:600;padding:13px 26px;border-radius:10px;text-decoration:none;}
  footer{background:#0d1b2a;color:#94a3b8;padding:48px;}
  .footer-inner{max-width:1100px;margin:0 auto;}
  .footer-top{display:grid;grid-template-columns:1.5fr 1fr 1fr 1fr;gap:40px;margin-bottom:40px;}
  .f-brand-name{font-size:20px;font-weight:800;color:white;}
  .f-brand-sub{font-size:12px;color:#5eead4;margin:4px 0;}
  .f-brand-desc{font-size:13px;color:#64748b;line-height:1.6;}
  .f-col h4{font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#64748b;margin-bottom:16px;}
  .f-col a{display:block;font-size:13px;color:#94a3b8;text-decoration:none;margin-bottom:10px;}
  .footer-bottom{border-top:1px solid #1e293b;padding-top:24px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;}
  .f-legal{font-size:12px;color:#475569;}
  .f-legal a{color:#475569;text-decoration:none;}
  @media(max-width:900px){.wom-panel{display:none !important;}.nav-links{display:none;}.footer-top{grid-template-columns:1fr 1fr;}}
  @media(max-width:600px){.footer-top{grid-template-columns:1fr;}}
`;

function navUl() {
  return `<ul class="nav-links">
    <li class="wom-drop">
      <a href="../#services">Services</a>
      <div class="wom-panel">
        <div class="wom-col">
          <div class="wom-col-h">Exams &amp; Testing</div>
          <a href="../dot-physical"><span class="wom-t">DOT Physical</span><span class="wom-d">$110 &middot; same-day medical card</span></a>
          <a href="../drug-test"><span class="wom-t">Drug &amp; Alcohol Testing</span><span class="wom-d">DOT &amp; non-DOT</span></a>
          <a href="../return-to-duty"><span class="wom-t">Return to Duty</span><span class="wom-d">SAP &amp; follow-up testing</span></a>
        </div>
        <div class="wom-col">
          <div class="wom-col-h">Employers</div>
          <a href="../consortium"><span class="wom-t">DOT Consortium</span><span class="wom-d">Random testing &middot; $49/yr</span></a>
          <a href="../find-a-location"><span class="wom-t">Find a Location</span><span class="wom-d">Certified sites near you</span></a>
        </div>
      </div>
    </li>
    <li><a href="../return-to-duty">Return to Duty</a></li>
    <li><a href="../consortium">Consortium</a></li>
  </ul>`;
}

function footer(name) {
  return `<div class="cta-strip">
  <h2>Set Up Compliance for ${name} Today</h2>
  <p>Create your free employer account — no setup fees, cancel anytime.</p>
  <div class="cta-btns">
    <a href="https://portal.dot-physical.net/signup" class="cta-btn-primary">Create Free Account &rarr;</a>
    <a href="tel:+18882334567" class="cta-btn-outline">(888) 233-4567</a>
  </div>
</div>

<footer>
  <div class="footer-inner">
    <div class="footer-top">
      <div>
        <div class="f-brand-name">Work OccMed</div>
        <div class="f-brand-sub">A WorkOccMed Medical Group Company</div>
        <p class="f-brand-desc">Full-service occupational health for employers nationwide. DOT physicals, drug testing, consortiums, and return to duty &mdash; all managed online.</p>
      </div>
      <div class="f-col">
        <h4>Compliance</h4>
        <a href="../consortium">DOT Consortium</a>
        <a href="../return-to-duty">Return to Duty</a>
        <a href="../dot-physical">DOT Physical</a>
        <a href="../drug-test">Drug Testing</a>
      </div>
      <div class="f-col">
        <h4>Employers</h4>
        <a href="https://portal.dot-physical.net/signup">Create Account</a>
        <a href="https://portal.dot-physical.net/join-consortium">Join Consortium</a>
        <a href="../index.html#coverage">All States</a>
      </div>
      <div class="f-col">
        <h4>Contact</h4>
        <a href="tel:+18882334567">(888) 233-4567</a>
        <a href="mailto:info@workoccmed.com">info@workoccmed.com</a>
        <a href="https://portal.dot-physical.net">Employer Portal</a>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="f-legal">&copy; 2026 Work OccMed &middot; A WorkOccMed Medical Group Company</div>
      <div class="f-legal"><a href="../privacy-policy">Privacy Policy</a> &middot; <a href="../index.html">Work OccMed Home</a></div>
    </div>
  </div>
</footer>
</body>
</html>`;
}

function faqJsonLd(pairs) {
  if (!pairs || !pairs.length) return '';
  const plain = (s) => s.replace(/&mdash;/g, '—').replace(/&amp;/g, '&');
  const entities = pairs.map(({ q, a }) => ({
    '@type': 'Question',
    name: plain(q),
    acceptedAnswer: { '@type': 'Answer', text: plain(a) },
  }));
  const json = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entities,
  });
  return `<script type="application/ld+json">${json}</script>\n`;
}

function head(title, description, canonical, keywords, faqPairs) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<script async src="https://www.googletagmanager.com/gtag/js?id=GT-K8FTWVMH"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GT-K8FTWVMH');
  gtag('config', 'AW-18239837170');
</script>
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${canonical}">
<meta name="robots" content="index, follow">
<meta name="keywords" content="${keywords}">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>${SHARED_CSS}</style>
${faqJsonLd(faqPairs)}</head>
<body>
<nav>
  <a href="../index.html" class="nav-logo">
    <div class="logo-mark">WO</div>
    <div><div class="logo-name">Work OccMed</div><div class="logo-sub">Occupational Health</div></div>
  </a>
  ${navUl()}
  <div style="display:flex;gap:10px;align-items:center;">
    <a href="tel:+18882334567" class="btn btn-ghost">(888) 233-4567</a>
    <a href="https://portal.dot-physical.net/signup" class="btn btn-primary">Employer Portal &rarr;</a>
  </div>
</nav>`;
}

function otherCityLinks(state, prefix, thisCity) {
  return state.cities.filter(c => c !== thisCity).map(c => {
    const cs = citySlugOf(state.slug, c);
    return `<a href="${prefix}-${cs}.html">${c}, ${state.abbr}</a>`;
  }).join('\n      ');
}

function consortiumCityPageHtml(state, city) {
  const { name, slug, abbr } = state;
  const facts = STATE_FACTS[slug] || DEFAULT_FACTS;
  const citySlug = citySlugOf(slug, city);
  const cityState = `${city}, ${abbr}`;

  return `${head(
    `DOT Random Testing Consortium in ${cityState} — $49/yr | WorkOccMed`,
    `Join a DOT random drug &amp; alcohol testing consortium for ${city} fleets and owner-operators — from $49/yr per driver. Random pulls, MRO review, and FMCSA Clearinghouse reporting handled for you as your C/TPA.`,
    `https://www.workoccmed.com/cities/consortium-${citySlug}`,
    `dot consortium ${city}, c-tpa ${city}, random drug testing consortium ${city} ${abbr}, dot random testing ${city}, fmcsa consortium ${city} ${abbr}`,
    [
      { q: `Do I need a consortium if I only have one truck in ${city}?`, a: `Yes. FMCSA requires every CDL driver subject to DOT testing — including single-truck owner-operators based in ${city}, ${abbr} — to be enrolled in a random testing pool through a C/TPA.` },
      { q: 'How much does it cost?', a: `WorkOccMed's ${city} consortium enrollment starts at $49/year per driver, with no separate setup fee.` },
      { q: 'What happens when a driver is selected?', a: `We notify you immediately. The driver must test the same day at a certified site near them in ${city} — we handle scheduling, MRO review, and Clearinghouse reporting.` },
    ]
  )}

<section class="hero">
  <div class="hero-inner">
    <div class="breadcrumb"><a href="../index.html">Work OccMed</a> <span>&rsaquo;</span> <a href="../consortium">Consortium</a> <span>&rsaquo;</span> <a href="../consortium-${slug}">${name}</a> <span>&rsaquo;</span> <span style="color:rgba(255,255,255,.85);">${city}</span></div>
    <div class="hero-badge">${cityState} &middot; DOT Random Testing Consortium (C/TPA)</div>
    <h1>DOT Consortium<br><span>${city}, ${abbr}</span></h1>
    <p class="hero-sub">FMCSA-mandated random drug &amp; alcohol testing for CDL drivers based in ${city} — enrollment, quarterly random selection, MRO review, and Clearinghouse reporting, handled end-to-end by WorkOccMed as your Consortium/Third-Party Administrator (C/TPA), from $49/year per driver.</p>
    <div class="hero-ctas">
      <a href="https://portal.dot-physical.net/join-consortium" class="btn-white">Join the Consortium &rarr;</a>
      <a href="tel:+18882334567" class="btn-outline">(888) 233-4567</a>
    </div>
  </div>
</section>

<section>
  <div class="section-inner">
    <div class="section-label">Why It's Required</div>
    <h2 class="section-title">FMCSA Random Testing for ${city} Fleets</h2>
    <p class="section-sub">Every DOT-regulated employer — including single-truck owner-operators dispatching out of ${city} — must participate in a random drug and alcohol testing program under 49 CFR Part 382, administered through a Consortium/Third-Party Administrator (C/TPA). Operating without one risks fines that start at $16,000+ per violation.</p>
    <div class="fact-box">
      <p><strong>${city}'s trucking footprint:</strong> ${name} freight moves along ${facts.interstates}, anchored by ${facts.corridor}. With ${facts.industries} driving demand for CDL drivers around ${city}, ${facts.cdlNote}</p>
    </div>
  </div>
</section>

<section style="background:var(--cream);">
  <div class="section-inner">
    <div class="section-label">How It Works</div>
    <h2 class="section-title">Enrollment to Reporting, Handled</h2>
    <div class="steps">
      <div class="step-card"><div class="step-num">1</div><h3>Enroll Your Drivers</h3><p>Add each ${city}-based CDL driver to the consortium pool online in minutes — no paperwork, no setup fee.</p></div>
      <div class="step-card"><div class="step-num">2</div><h3>Quarterly Random Selection</h3><p>Drivers are randomly selected each quarter at FMCSA-mandated rates — computer-generated, fully auditable.</p></div>
      <div class="step-card"><div class="step-num">3</div><h3>Testing at a Local Site</h3><p>Selected drivers test at one of 15,000+ certified collection sites near them in ${city}, ${abbr}.</p></div>
      <div class="step-card"><div class="step-num">4</div><h3>MRO Review &amp; Clearinghouse</h3><p>Results are reviewed by a Medical Review Officer and reported to the FMCSA Clearinghouse automatically.</p></div>
    </div>
    <div class="price-card">
      <div style="font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#5eead4;">Consortium Enrollment</div>
      <div class="amt">$49<span>/driver/yr</span></div>
      <p style="font-size:13px;color:rgba(255,255,255,.6);">Random pulls, MRO review &amp; Clearinghouse reporting included</p>
      <a href="https://portal.dot-physical.net/join-consortium">Enroll ${city} Drivers &rarr;</a>
    </div>
  </div>
</section>

<section>
  <div class="section-inner">
    <div class="section-label">Coverage</div>
    <h2 class="section-title">More ${name} Cities</h2>
    <p class="section-sub">WorkOccMed runs DOT consortiums for fleets across ${name}, including:</p>
    <div class="cities-list">
      ${otherCityLinks(state, 'consortium', city)}
      <a href="../consortium-${slug}">All of ${name} &rarr;</a>
    </div>
  </div>
</section>

<section style="background:var(--cream);">
  <div class="section-inner">
    <div class="section-label">FAQ</div>
    <h2 class="section-title">DOT Consortium Questions &mdash; ${city}, ${abbr}</h2>
    <div class="faq-item"><h3>Do I need a consortium if I only have one truck in ${city}?</h3><p>Yes. FMCSA requires every CDL driver subject to DOT testing — including single-truck owner-operators based in ${city}, ${abbr} — to be enrolled in a random testing pool through a C/TPA.</p></div>
    <div class="faq-item"><h3>How much does it cost?</h3><p>WorkOccMed's ${city} consortium enrollment starts at $49/year per driver, with no separate setup fee.</p></div>
    <div class="faq-item"><h3>What happens when a driver is selected?</h3><p>We notify you immediately. The driver must test the same day at a certified site near them in ${city} — we handle scheduling, MRO review, and Clearinghouse reporting.</p></div>
  </div>
</section>

${footer(cityState)}`;
}

function rtdCityPageHtml(state, city) {
  const { name, slug, abbr } = state;
  const facts = STATE_FACTS[slug] || DEFAULT_FACTS;
  const citySlug = citySlugOf(slug, city);
  const cityState = `${city}, ${abbr}`;

  return `${head(
    `Return to Duty Process in ${cityState} | WorkOccMed`,
    `SAP evaluation coordination and DOT return-to-duty testing for ${city} drivers after a drug or alcohol violation. Get back to safety-sensitive duty compliantly.`,
    `https://www.workoccmed.com/cities/rtd-${citySlug}`,
    `return to duty ${city}, dot return to duty ${city} ${abbr}, sap evaluation ${city}, follow-up testing ${city}, dot violation ${city}`,
    [
      { q: `How long does the return-to-duty process take in ${city}?`, a: `It varies by driver — the SAP's recommended education or treatment sets the pace. Once cleared, the return-to-duty test itself can typically be scheduled same-day at a certified site in ${city}.` },
      { q: 'Who reports the return-to-duty test to the Clearinghouse?', a: 'WorkOccMed reports return-to-duty and follow-up test results to the FMCSA Clearinghouse on your behalf as your C/TPA.' },
      { q: 'Does WorkOccMed provide the SAP evaluation itself?', a: 'We coordinate with SAPs and manage the paperwork, records release, and testing logistics; the SAP evaluation itself is performed by a qualified, independent Substance Abuse Professional.' },
    ]
  )}

<section class="hero">
  <div class="hero-inner">
    <div class="breadcrumb"><a href="../index.html">Work OccMed</a> <span>&rsaquo;</span> <a href="../return-to-duty">Return to Duty</a> <span>&rsaquo;</span> <a href="../return-to-duty-${slug}">${name}</a> <span>&rsaquo;</span> <span style="color:rgba(255,255,255,.85);">${city}</span></div>
    <div class="hero-badge">${cityState} &middot; DOT Return to Duty</div>
    <h1>Return to Duty<br><span>${city}, ${abbr}</span></h1>
    <p class="hero-sub">After a DOT drug or alcohol violation, drivers based in ${city} must complete a SAP evaluation, a negative return-to-duty test, and a follow-up testing plan before resuming safety-sensitive duties. WorkOccMed coordinates the whole process.</p>
    <div class="hero-ctas">
      <a href="../return-to-duty" class="btn-white">Start the Process &rarr;</a>
      <a href="tel:+18882334567" class="btn-outline">(888) 233-4567</a>
    </div>
  </div>
</section>

<section>
  <div class="section-inner">
    <div class="section-label">Why It's Required</div>
    <h2 class="section-title">Getting Back on the Road in ${city}</h2>
    <p class="section-sub">A DOT drug or alcohol violation — including a positive test, refusal, or FMCSA Clearinghouse flag — prohibits a CDL driver from performing safety-sensitive functions until the full return-to-duty process is complete.</p>
    <div class="fact-box">
      <p><strong>${city}'s CDL workforce:</strong> With freight moving along ${facts.interstates} and ${facts.corridor} anchoring the region's logistics economy, ${facts.industries} around ${city} depend on drivers getting back to compliant, safety-sensitive duty quickly. ${facts.cdlNote}</p>
    </div>
  </div>
</section>

<section style="background:var(--cream);">
  <div class="section-inner">
    <div class="section-label">The Process</div>
    <h2 class="section-title">Five Steps to Return to Duty</h2>
    <div class="steps">
      <div class="step-card"><div class="step-num">1</div><h3>SAP Evaluation</h3><p>A Substance Abuse Professional evaluates the driver and recommends education or treatment.</p></div>
      <div class="step-card"><div class="step-num">2</div><h3>Education / Treatment</h3><p>The driver completes the SAP's recommended program.</p></div>
      <div class="step-card"><div class="step-num">3</div><h3>Follow-Up SAP Evaluation</h3><p>The SAP confirms compliance and clears the driver for return-to-duty testing.</p></div>
      <div class="step-card"><div class="step-num">4</div><h3>Return-to-Duty Test</h3><p>A negative, directly-observed test at a certified site near the driver in ${city}, ${abbr}.</p></div>
      <div class="step-card"><div class="step-num">5</div><h3>Follow-Up Testing Plan</h3><p>A minimum of 6 unannounced tests over the next 12 months, as set by the SAP.</p></div>
    </div>
  </div>
</section>

<section>
  <div class="section-inner">
    <div class="section-label">Coverage</div>
    <h2 class="section-title">More ${name} Cities</h2>
    <p class="section-sub">WorkOccMed coordinates return-to-duty and follow-up testing across ${name}, including:</p>
    <div class="cities-list">
      ${otherCityLinks(state, 'rtd', city)}
      <a href="../return-to-duty-${slug}">All of ${name} &rarr;</a>
    </div>
  </div>
</section>

<section style="background:var(--cream);">
  <div class="section-inner">
    <div class="section-label">FAQ</div>
    <h2 class="section-title">Return to Duty Questions &mdash; ${city}, ${abbr}</h2>
    <div class="faq-item"><h3>How long does the return-to-duty process take in ${city}?</h3><p>It varies by driver — the SAP's recommended education or treatment sets the pace. Once cleared, the return-to-duty test itself can typically be scheduled same-day at a certified site in ${city}.</p></div>
    <div class="faq-item"><h3>Who reports the return-to-duty test to the Clearinghouse?</h3><p>WorkOccMed reports return-to-duty and follow-up test results to the FMCSA Clearinghouse on your behalf as your C/TPA.</p></div>
    <div class="faq-item"><h3>Does WorkOccMed provide the SAP evaluation itself?</h3><p>We coordinate with SAPs and manage the paperwork, records release, and testing logistics; the SAP evaluation itself is performed by a qualified, independent Substance Abuse Professional.</p></div>
  </div>
</section>

${footer(cityState)}`;
}

const citiesDir = path.join(__dirname, 'cities');
if (!fs.existsSync(citiesDir)) fs.mkdirSync(citiesDir);

let consortiumCount = 0, rtdCount = 0;
for (const state of STATES) {
  for (const city of state.cities) {
    const citySlug = citySlugOf(state.slug, city);
    fs.writeFileSync(path.join(citiesDir, `consortium-${citySlug}.html`), consortiumCityPageHtml(state, city), 'utf8');
    consortiumCount++;
    fs.writeFileSync(path.join(citiesDir, `rtd-${citySlug}.html`), rtdCityPageHtml(state, city), 'utf8');
    rtdCount++;
  }
}

console.log(`Done. Generated ${consortiumCount} consortium city pages and ${rtdCount} return-to-duty city pages in cities/.`);
