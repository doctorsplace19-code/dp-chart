/*
 * generate-guides.js — WorkOccMed content hub / resource center
 * Builds educational guide pages + a /guides index that match the site design.
 * Each guide is real, substantive editorial content with FAQ schema (EEAT + rich results).
 *
 * Run:  node generate-guides.js
 * Output: guides.html + one <slug>.html per guide, in this directory.
 */
const fs = require('fs');
const path = require('path');
const OUT = __dirname;

const SITE = 'https://www.workoccmed.com';
const ORDER = 'https://portal.dot-physical.net/order?service=dot-physical';
const REVIEWED = 'Chantal Gabriel, MD';
const REVIEWED_TITLE = 'Medical Director, Doctors Place Inc. · FMCSA-Certified Medical Examiner';
const TODAY = 'July 2026';

/* ---------- shared chrome ---------- */

const HEAD = (title, desc, slug, faq) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GT-K8FTWVMH"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GT-K8FTWVMH');
  gtag('config', 'AW-18239837170');
</script>
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${SITE}/${slug}">
<meta name="robots" content="index, follow">
<meta property="og:type" content="article">
<meta property="og:url" content="${SITE}/${slug}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
${faq && faq.length ? faqSchema(faq) : ''}
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'Inter', sans-serif; background: white; color: #1f2937; line-height: 1.7; overflow-x: hidden; font-size: 18px; }
  .hamburger-btn { display: none; }
  .mobile-nav { display: none; position: fixed; top: 100px; left: 0; right: 0; bottom: 0; z-index: 99; background: #0d1b2a; flex-direction: column; align-items: center; justify-content: center; gap: 28px; padding: 40px; }
  .mobile-nav.open { display: flex; }
  .mobile-nav a { color: white; text-decoration: none; font-size: 22px; font-weight: 700; }
  .mobile-cta { margin-top: 16px; display: flex; flex-direction: column; gap: 12px; width: 100%; max-width: 280px; }
  .mobile-cta a { text-align: center; padding: 14px; border-radius: 10px; font-weight: 700; font-size: 19px; text-decoration: none; }
  .article { max-width: 780px; margin: 0 auto; padding: 8px 24px 64px; }
  .article h2 { font-size: clamp(1.5rem,3vw,2rem); font-weight: 800; color: #0d1b2a; margin: 44px 0 16px; letter-spacing: -0.02em; line-height: 1.2; }
  .article h3 { font-size: 1.28rem; font-weight: 700; color: #0d1b2a; margin: 30px 0 12px; }
  .article p { margin-bottom: 18px; color: #374151; }
  .article ul, .article ol { margin: 0 0 20px 24px; color: #374151; }
  .article li { margin-bottom: 9px; }
  .article a { color: #1d4ed8; font-weight: 600; }
  .article strong { color: #0d1b2a; }
  .callout { background: #eff6ff; border-left: 4px solid #1d4ed8; border-radius: 10px; padding: 20px 24px; margin: 28px 0; }
  .callout p { margin: 0; }
  .faqbox { border: 1px solid #e5e7eb; border-radius: 12px; padding: 4px 24px; margin-bottom: 14px; background: #f8fafc; }
  .faqbox summary { font-weight: 700; color: #0d1b2a; cursor: pointer; padding: 18px 0; font-size: 1.08rem; list-style: none; }
  .faqbox summary::-webkit-details-marker { display: none; }
  .faqbox summary::before { content: '+'; color: #1d4ed8; font-weight: 800; margin-right: 10px; }
  .faqbox[open] summary::before { content: '\\2013'; }
  .faqbox p { padding: 0 0 18px; margin: 0; }
  @media (max-width: 900px) {
    .nav-links-wrap { display: none !important; }
    .nav-right-wrap { display: none !important; }
    .hamburger-btn { display: block !important; }
  }
  .wom-drop { position: relative; display: flex; align-items: center; height: 64px; }
  .wom-drop > a { display: flex; align-items: center; gap: 7px; }
  .wom-caret { display: inline-block; width: 7px; height: 7px; border-right: 2px solid #93c5fd; border-bottom: 2px solid #93c5fd; transform: rotate(45deg) translateY(-2px); transition: transform .2s ease; }
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
</style>
</head>
<body>`;

const NAV = `
<div style="background:#1d4ed8;padding:10px 24px;text-align:center;">
  <p style="font-size:17px;font-weight:600;color:white;margin:0;letter-spacing:.01em;">
    FMCSA Certified &nbsp;·&nbsp; 15,000+ Sites &nbsp;·&nbsp; Same-Day Medical Card &nbsp;·&nbsp; All 50 States
  </p>
</div>
<nav style="background:#0d1b2a;padding:0 40px;height:64px;display:flex;align-items:center;gap:32px;position:sticky;top:0;z-index:100;">
  <a href="/" style="display:flex;align-items:center;gap:12px;text-decoration:none;margin-right:8px;">
    <div style="width:40px;height:40px;background:white;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
      <span style="font-size:13px;font-weight:800;color:#0d1b2a;">WOM</span>
    </div>
    <span style="display:flex;flex-direction:column;line-height:1.05;">
      <span style="font-size:20px;font-weight:800;color:white;letter-spacing:-0.01em;">WorkOccMed</span>
      <span style="font-size:11px;font-weight:500;color:#93c5fd;">a Doctors Place Inc. company</span>
    </span>
  </a>
  <div class="nav-links-wrap" style="display:flex;gap:28px;align-items:center;flex:1;">
    <div class="wom-drop">
      <a href="/#services" style="font-size:16px;font-weight:500;color:white;text-decoration:none;">Services <span class="wom-caret"></span></a>
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
    <a href="find-a-location" style="font-size:16px;font-weight:500;color:white;text-decoration:none;">Find a Location</a>
    <div class="wom-drop">
      <a href="guides" style="font-size:16px;font-weight:500;color:white;text-decoration:none;">Guides <span class="wom-caret"></span></a>
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
    <a href="return-to-duty" style="font-size:16px;font-weight:500;color:white;text-decoration:none;">Return to Duty</a>
    <a href="partners" style="font-size:16px;font-weight:600;color:#1d4ed8;text-decoration:none;">Become a Partner</a>
  </div>
  <div class="nav-right-wrap" style="display:flex;align-items:center;gap:16px;">
    <a href="tel:+18882334567" style="font-size:16px;font-weight:600;color:white;text-decoration:none;">(888) 233-4567</a>
    <a href="${ORDER}" style="font-size:16px;font-weight:700;color:white;background:#1d4ed8;padding:9px 20px;border-radius:8px;text-decoration:none;">Order Now</a>
  </div>
  <button class="hamburger-btn" onclick="document.getElementById('mobileNav').classList.toggle('open')" aria-label="Menu" style="background:none;border:none;cursor:pointer;padding:8px;color:white;">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
  </button>
</nav>
<div id="mobileNav" class="mobile-nav">
  <a href="/#services" onclick="document.getElementById('mobileNav').classList.remove('open')">Services</a>
  <a href="guides" onclick="document.getElementById('mobileNav').classList.remove('open')">Guides</a>
  <a href="find-a-location" onclick="document.getElementById('mobileNav').classList.remove('open')">Find a Location</a>
  <a href="return-to-duty" onclick="document.getElementById('mobileNav').classList.remove('open')">Return to Duty</a>
  <a href="partners" onclick="document.getElementById('mobileNav').classList.remove('open')">Become a Partner</a>
  <div class="mobile-cta">
    <a href="${ORDER}" style="background:#1d4ed8;color:white;">Order Now</a>
    <a href="tel:+18882334567" style="border:1.5px solid #d1d5db;color:#374151;background:white;">(888) 233-4567</a>
  </div>
</div>`;

const CTA = `
<section style="background:linear-gradient(135deg,#1e3a8a 0%,#1d4ed8 100%);padding:56px 48px;text-align:center;">
  <h2 style="font-size:clamp(1.6rem,3vw,2.2rem);font-weight:900;color:white;margin-bottom:12px;letter-spacing:-0.02em;">Ready to Order?</h2>
  <p style="font-size:19px;color:rgba(255,255,255,0.85);margin-bottom:28px;max-width:540px;margin-left:auto;margin-right:auto;">Order your DOT physical online — $110, no account needed, valid at 15,000+ certified sites in all 50 states.</p>
  <a href="${ORDER}" style="display:inline-block;background:white;color:#1e3a8a;font-size:20px;font-weight:800;padding:18px 42px;border-radius:12px;text-decoration:none;box-shadow:0 8px 28px rgba(0,0,0,0.25);">Order My DOT Physical →</a>
  <div style="margin-top:18px;font-size:16px;color:rgba(255,255,255,0.7);">Questions? Call <a href="tel:+18882334567" style="color:white;font-weight:700;">(888) 233-4567</a></div>
</section>`;

const FOOTER = `
<footer style="background:#0d1b2a;color:#94a3b8;padding:40px 48px;text-align:center;">
  <div style="font-size:18px;font-weight:800;color:white;margin-bottom:4px;">WorkOccMed</div>
  <div style="font-size:14px;color:#64748b;margin-bottom:16px;">A specialized division of Doctors Place Inc. · New Jersey</div>
  <div style="font-size:15px;">
    <a href="/" style="color:#94a3b8;text-decoration:none;">Home</a> &nbsp;·&nbsp;
    <a href="guides" style="color:#94a3b8;text-decoration:none;">Guides</a> &nbsp;·&nbsp;
    <a href="find-a-location" style="color:#94a3b8;text-decoration:none;">Find a Location</a> &nbsp;·&nbsp;
    <a href="return-to-duty" style="color:#94a3b8;text-decoration:none;">Return to Duty</a> &nbsp;·&nbsp;
    <a href="tel:+18882334567" style="color:#94a3b8;text-decoration:none;">(888) 233-4567</a> &nbsp;·&nbsp;
    <a href="https://www.linkedin.com/company/workoccmed" target="_blank" rel="noopener" style="color:#94a3b8;text-decoration:none;">LinkedIn ↗</a> &nbsp;·&nbsp; <a href="https://g.page/r/CZxpzYHQ5wJbEAI/review" target="_blank" rel="noopener" style="color:#94a3b8;text-decoration:none;">★ Review Us</a>
  </div>
  <div style="font-size:13px;color:#475569;margin-top:16px;">© 2026 Doctors Place Inc. · WorkOccMed is a national occupational health platform and a specialized division of Doctors Place Inc. · Corporate Headquarters: New Jersey, USA · 75 Summit Ave, Hackensack, NJ 07601 · FMCSA-certified DOT physicals nationwide.</div>
  <div style="font-size:12px;color:#475569;margin-top:12px;max-width:720px;margin-left:auto;margin-right:auto;">The information on this page is for general educational purposes and is not medical or legal advice. Regulations change; always confirm current requirements with the FMCSA and a certified medical examiner.</div>
</footer>`;

const CHATBOT = `
<div id="womChat" style="position:fixed;bottom:24px;right:24px;z-index:9999;font-family:'Inter',sans-serif;">
  <button id="womChatBtn" aria-label="Chat with us" style="width:60px;height:60px;border-radius:50%;background:#1d4ed8;border:none;cursor:pointer;box-shadow:0 6px 24px rgba(29,78,216,0.4);display:flex;align-items:center;justify-content:center;">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
  </button>
  <div id="womChatPanel" style="display:none;position:absolute;bottom:74px;right:0;width:370px;max-width:calc(100vw - 32px);height:520px;max-height:calc(100vh - 120px);background:white;border-radius:18px;box-shadow:0 12px 48px rgba(0,0,0,0.22);overflow:hidden;flex-direction:column;">
    <div style="background:#0d1b2a;padding:16px 18px;display:flex;align-items:center;gap:10px;">
      <div style="width:34px;height:34px;border-radius:8px;background:#1d4ed8;display:flex;align-items:center;justify-content:center;color:white;font-weight:800;font-size:12px;">WOM</div>
      <div style="flex:1;">
        <div style="color:white;font-weight:700;font-size:15px;">WorkOccMed Assistant</div>
        <div style="color:#93c5fd;font-size:12px;">DOT physical questions</div>
      </div>
      <button id="womChatClose" aria-label="Close" style="background:none;border:none;cursor:pointer;color:rgba(255,255,255,0.7);font-size:22px;line-height:1;">&times;</button>
    </div>
    <div id="womChatMsgs" style="flex:1;overflow-y:auto;padding:16px;background:#f8fafc;display:flex;flex-direction:column;gap:12px;"></div>
    <div style="padding:12px;border-top:1px solid #e5e7eb;display:flex;gap:8px;background:white;">
      <input id="womChatInput" type="text" placeholder="Ask about DOT physicals…" autocomplete="off"
        style="flex:1;border:1.5px solid #d1d5db;border-radius:10px;padding:11px 14px;font-family:'Inter',sans-serif;font-size:14px;outline:none;">
      <button id="womChatSend" style="background:#1d4ed8;border:none;border-radius:10px;padding:0 16px;color:white;cursor:pointer;font-weight:700;font-size:14px;">Send</button>
    </div>
  </div>
</div>
<script>
(function(){
  var API = 'https://portal.dot-physical.net/api/chat';
  var btn = document.getElementById('womChatBtn');
  var panel = document.getElementById('womChatPanel');
  var closeBtn = document.getElementById('womChatClose');
  var msgs = document.getElementById('womChatMsgs');
  var input = document.getElementById('womChatInput');
  var send = document.getElementById('womChatSend');
  var history = [];
  var greeted = false;
  function bubble(role, text){
    var wrap = document.createElement('div');
    var isUser = role === 'user';
    wrap.style.cssText = 'max-width:82%;padding:10px 14px;border-radius:14px;font-size:14px;line-height:1.5;white-space:pre-wrap;'+
      (isUser ? 'align-self:flex-end;background:#1d4ed8;color:white;border-bottom-right-radius:4px;'
              : 'align-self:flex-start;background:white;color:#111827;border:1px solid #e5e7eb;border-bottom-left-radius:4px;');
    wrap.textContent = text; msgs.appendChild(wrap); msgs.scrollTop = msgs.scrollHeight; return wrap;
  }
  function open(){ panel.style.display='flex'; if(!greeted){ greeted=true; bubble('assistant',"Hi! Ready to order your DOT physical, or have a question first? I can help."); } input.focus(); }
  function close(){ panel.style.display='none'; }
  btn.addEventListener('click', function(){ panel.style.display==='flex' ? close() : open(); });
  closeBtn.addEventListener('click', close);
  async function sendMsg(){
    var text = input.value.trim(); if(!text) return;
    bubble('user', text); history.push({role:'user',content:text}); input.value='';
    var typing = bubble('assistant','…'); send.disabled = true;
    try{
      var res = await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:history})});
      var data = await res.json();
      typing.textContent = data.message || data.error || 'Sorry, please call (888) 233-4567.';
      if(data.message) history.push({role:'assistant',content:data.message});
    }catch(e){ typing.textContent = 'Connection issue — please call (888) 233-4567.'; }
    send.disabled = false; msgs.scrollTop = msgs.scrollHeight;
  }
  send.addEventListener('click', sendMsg);
  input.addEventListener('keydown', function(e){ if(e.key==='Enter') sendMsg(); });
})();
</script>
</body>
</html>`;

/* ---------- schema helpers ---------- */

function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function faqSchema(faq){
  const data = {
    "@context":"https://schema.org",
    "@type":"FAQPage",
    "mainEntity": faq.map(f => ({
      "@type":"Question",
      "name": f.q,
      "acceptedAnswer": { "@type":"Answer", "text": f.a }
    }))
  };
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

function articleSchema(g){
  const data = {
    "@context":"https://schema.org",
    "@type":"Article",
    "headline": g.h1,
    "description": g.desc,
    "author": { "@type":"Person", "name": REVIEWED, "jobTitle":"Medical Director" },
    "reviewedBy": { "@type":"Person", "name": REVIEWED },
    "publisher": { "@type":"Organization", "name":"WorkOccMed", "parentOrganization":"Doctors Place Inc." },
    "mainEntityOfPage": `${SITE}/${g.slug}`,
    "dateModified": "2026-07-01"
  };
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

/* ---------- article renderer ---------- */

function renderGuide(g){
  const faqHtml = g.faq && g.faq.length ? `
    <h2 id="faq">Frequently Asked Questions</h2>
    ${g.faq.map(f => `<details class="faqbox"><summary>${f.q}</summary><p>${f.a}</p></details>`).join('\n')}
  ` : '';

  return HEAD(g.title, g.desc, g.slug, g.faq) +
    articleSchema(g) +
    NAV + `
<header style="background:linear-gradient(135deg,#0d1b2a 0%,#1e3a8a 100%);padding:56px 24px 48px;">
  <div style="max-width:780px;margin:0 auto;">
    <div style="font-size:14px;color:#93c5fd;margin-bottom:14px;"><a href="guides" style="color:#93c5fd;text-decoration:none;">Guides</a> &nbsp;/&nbsp; ${g.category}</div>
    <h1 style="font-size:clamp(2rem,4.2vw,3rem);font-weight:900;line-height:1.1;color:white;letter-spacing:-0.02em;margin-bottom:16px;">${g.h1}</h1>
    <p style="font-size:19px;color:rgba(255,255,255,0.82);line-height:1.6;">${g.lede}</p>
    <div style="margin-top:22px;display:flex;align-items:center;gap:12px;flex-wrap:wrap;font-size:14px;color:#cbd5e1;">
      <span style="background:rgba(255,255,255,0.1);padding:5px 12px;border-radius:20px;">Medically reviewed by ${REVIEWED}</span>
      <span>Updated ${TODAY}</span>
    </div>
  </div>
</header>
<article class="article">
  ${g.body}
  ${faqHtml}
  <div class="callout" style="margin-top:40px;">
    <p style="font-weight:700;color:#0d1b2a;margin-bottom:6px;">Reviewed by <a href="medical-team">${REVIEWED}</a></p>
    <p style="font-size:15px;color:#4b5563;">${REVIEWED_TITLE}. This guide is reviewed by a certified medical examiner for accuracy.</p>
  </div>
  ${g.related && g.related.length ? `
  <h2>Related Guides</h2>
  <ul>${g.related.map(r=>`<li><a href="${r.slug}">${r.title}</a></li>`).join('')}</ul>
  ` : ''}
</article>
` + CTA + FOOTER + CHATBOT;
}

/* ============================================================
   GUIDE CONTENT
   ============================================================ */

const guides = [
  {
    slug: 'dot-physical-requirements-2026',
    category: 'DOT / FMCSA',
    title: 'DOT Physical Requirements 2026: Complete Driver Checklist | WorkOccMed',
    desc: 'The complete 2026 DOT physical checklist: what the FMCSA exam covers, medical standards, what to bring, blood pressure and vision limits, and how to pass. Reviewed by a certified medical examiner.',
    h1: 'DOT Physical Requirements 2026: The Complete Driver Checklist',
    lede: 'Everything a commercial driver needs to know before a DOT physical — what the exam covers, the FMCSA medical standards, what to bring, and how to avoid a failed or deferred certificate.',
    body: `
<p>If you drive a commercial motor vehicle (CMV), federal law requires you to pass a <strong>DOT physical</strong> — a medical exam performed by an FMCSA-certified medical examiner — before you can be issued or renew your Medical Examiner's Certificate (the "medical card"). This guide walks through exactly what the 2026 exam involves and how to prepare so you pass on the first visit.</p>

<div class="callout"><p><strong>In a hurry?</strong> You can <a href="${ORDER}">order your DOT physical online</a> for $110 and walk into any of 15,000+ certified sites nationwide — usually the same day.</p></div>

<h2>Who needs a DOT physical?</h2>
<p>You generally need a valid DOT medical card if you operate a vehicle that:</p>
<ul>
  <li>Has a gross vehicle weight rating (GVWR) of 10,001 lbs or more;</li>
  <li>Is designed to transport 16 or more passengers (including the driver), or 9+ passengers for hire;</li>
  <li>Transports hazardous materials in quantities requiring placarding; or</li>
  <li>Requires a commercial driver's license (CDL) under your state's rules.</li>
</ul>
<p>Interstate CDL drivers must certify their medical status with their State Driver Licensing Agency and keep a current examiner's certificate on file.</p>

<h2>What the DOT physical actually covers</h2>
<p>The exam follows a standardized FMCSA form and is the same at every certified site. The examiner reviews your health history and then checks:</p>
<ul>
  <li><strong>Vision</strong> — at least 20/40 in each eye (with or without correction) and 70° field of vision in each eye.</li>
  <li><strong>Hearing</strong> — you must perceive a "forced whisper" at 5 feet, or meet the audiometric standard.</li>
  <li><strong>Blood pressure &amp; pulse</strong> — see the limits below.</li>
  <li><strong>Urinalysis</strong> — screens for underlying conditions (protein, blood, sugar). This is <em>not</em> a drug test.</li>
  <li><strong>Physical exam</strong> — heart, lungs, abdomen, spine, neurological function, and general appearance.</li>
  <li><strong>Health history</strong> — heart disease, diabetes, sleep apnea, seizures, medications, and prior surgeries.</li>
</ul>

<h3>Blood pressure limits</h3>
<p>Blood pressure is one of the most common reasons for a shortened card or a deferral:</p>
<ul>
  <li><strong>Under 140/90</strong> — normal, eligible for a 2-year card.</li>
  <li><strong>140–159 / 90–99 (Stage 1)</strong> — typically a one-year certificate.</li>
  <li><strong>160–179 / 100–109 (Stage 2)</strong> — usually a one-time 3-month certificate, then a 1-year card if controlled.</li>
  <li><strong>180+ / 110+ (Stage 3)</strong> — disqualifying until reduced and controlled.</li>
</ul>

<h3>Vision and hearing</h3>
<p>If you wear glasses or contacts, bring them — you can meet the vision standard with correction. Drivers who don't meet the standard in one eye may qualify through the FMCSA Vision Exemption program. For hearing, hearing aids are permitted to meet the standard.</p>

<h2>What to bring to your DOT physical</h2>
<ul>
  <li><strong>Photo ID</strong> — a valid government-issued ID or driver's license.</li>
  <li><strong>A complete medication list</strong> — names, dosages, and prescribing doctors.</li>
  <li><strong>Glasses, contacts, or hearing aids</strong> if you use them.</li>
  <li><strong>Specialist documentation</strong> if you have diabetes, sleep apnea, a heart condition, or a seizure history — a current note from your treating provider can prevent a deferral.</li>
  <li><strong>CPAP compliance data</strong> if you're treated for sleep apnea.</li>
  <li><strong>Vision or diabetes exemption paperwork</strong> if applicable.</li>
</ul>

<h2>How long is a DOT medical card valid?</h2>
<p>The maximum certificate length is <strong>24 months</strong>. Examiners issue shorter certificates (12 months, 3 months, or less) when a condition such as elevated blood pressure needs monitoring. Passing cleanly with well-controlled health gives you the best chance at a full 2-year card.</p>

<h2>How to prepare and pass</h2>
<ul>
  <li>Take your regular medications as prescribed, and don't skip blood pressure medicine before the exam.</li>
  <li>Avoid salt, caffeine, energy drinks, and nicotine for a few hours beforehand.</li>
  <li>Get a good night's sleep and stay hydrated for the urinalysis.</li>
  <li>Bring documentation for any managed condition — proof of control is what keeps you certified.</li>
  <li>Be honest on your health history; examiners can defer you for undisclosed conditions discovered later.</li>
</ul>

<h2>Ordering your DOT physical</h2>
<p>With WorkOccMed you can <a href="${ORDER}">order a DOT physical online</a> in about two minutes, receive authorization by email (usually within an hour during business hours), and walk into any of 15,000+ certified sites in all 50 states — no appointment needed. Most drivers receive their Medical Examiner's Certificate the same day.</p>
`,
    faq: [
      { q: 'How much does a DOT physical cost?', a: 'A WorkOccMed DOT physical is $110, which includes the exam and your Medical Examiner’s Certificate. You can order online and complete it at any of 15,000+ certified sites nationwide.' },
      { q: 'How long does a DOT physical take?', a: 'The exam itself usually takes 20–30 minutes. Because you walk in without an appointment at most sites, plan for about 30–45 minutes total.' },
      { q: 'What is the blood pressure limit for a DOT physical?', a: 'Below 140/90 qualifies for a full 2-year card. 140–159/90–99 typically yields a 1-year card, 160–179/100–109 a one-time 3-month card, and 180/110 or higher is disqualifying until controlled.' },
      { q: 'Do I need an appointment?', a: 'No. After you order online and receive authorization, you can walk into any participating certified site without an appointment.' },
      { q: 'Is the urine test at a DOT physical a drug test?', a: 'No. The urinalysis at a DOT physical screens for medical conditions such as sugar, protein, and blood in the urine. A DOT drug test is a separate service.' }
    ],
    related: [
      { slug: 'what-disqualifies-you-from-a-dot-physical', title: 'What Disqualifies You From a DOT Physical?' },
      { slug: 'cdl-medical-card-renewal', title: 'CDL Medical Card Renewal Guide' },
      { slug: 'dot-physical-vs-pre-employment-physical', title: 'DOT Physical vs. Pre-Employment Physical' }
    ]
  },

  {
    slug: 'what-disqualifies-you-from-a-dot-physical',
    category: 'DOT / FMCSA',
    title: 'What Disqualifies You From a DOT Physical? (2026 Full List) | WorkOccMed',
    desc: 'A clear list of conditions that can disqualify or defer you on a DOT physical in 2026 — blood pressure, vision, diabetes, sleep apnea, heart disease, medications — and how to still get certified.',
    h1: 'What Disqualifies You From a DOT Physical?',
    lede: 'The conditions most likely to cause a failed or deferred DOT medical card — and, just as important, how many of them can still be certified with the right documentation.',
    body: `
<p>A "failed" DOT physical is often really a <strong>deferral</strong> — the examiner needs more information before certifying you. Understanding what triggers a disqualification helps you show up prepared. Here are the most common issues and what you can do about each.</p>

<div class="callout"><p><strong>Key point:</strong> Many "disqualifying" conditions are certifiable once they're documented and controlled. Bringing the right paperwork is often the difference between a card and a deferral. When you're ready, <a href="${ORDER}">order your DOT physical online</a>.</p></div>

<h2>High blood pressure</h2>
<p>The single most common reason for a shortened or deferred card. A reading of <strong>180/110 or higher</strong> is disqualifying until it's reduced and controlled. Take your medication as prescribed and avoid salt, caffeine, and nicotine before the exam.</p>

<h2>Vision that doesn't meet the standard</h2>
<p>You need at least 20/40 in each eye (with correction) and a 70° field of vision. If you don't meet this in one eye, the <strong>FMCSA Vision Exemption Program</strong> may still allow certification with an eye specialist's evaluation.</p>

<h2>Uncontrolled diabetes</h2>
<p>Diabetes itself is <em>not</em> disqualifying. Insulin-treated drivers can be certified through the FMCSA insulin-treated diabetes standard, which requires a treating clinician's assessment (form MCSA-5870) showing stable control and no severe hypoglycemia. Bring recent A1c results and your provider's evaluation.</p>

<h2>Sleep apnea</h2>
<p>Untreated moderate-to-severe obstructive sleep apnea can lead to a deferral. Drivers who are diagnosed and compliant with CPAP therapy are routinely certified — bring your <strong>CPAP compliance report</strong> showing consistent usage.</p>

<h2>Heart disease</h2>
<p>Recent heart attack, bypass surgery, stent placement, pacemaker, or an implanted defibrillator require a waiting period and a cardiologist's clearance. With documentation of stable cardiac function and appropriate stress testing, many drivers are certified for a shorter interval.</p>

<h2>Seizures and neurological conditions</h2>
<p>A seizure disorder or epilepsy requiring medication is generally disqualifying for interstate driving, though the FMCSA has a seizure exemption program for some drivers who have been seizure-free and off medication for a defined period.</p>

<h2>Certain medications</h2>
<p>Some prescriptions — particularly Schedule II drugs, certain sedatives, and methadone — can be disqualifying. A letter from your prescriber confirming the medication is safe for commercial driving can support certification. Never stop a prescribed medication without talking to your doctor.</p>

<h2>Substance use</h2>
<p>Current use of a controlled substance without a valid prescription, or a diagnosis of alcohol use disorder, is disqualifying. Drivers with a prior violation may need to complete the <a href="return-to-duty">return-to-duty process</a> before being certified.</p>

<h2>What to do if you're deferred</h2>
<ol>
  <li>Ask the examiner exactly what documentation is needed.</li>
  <li>Get the specialist evaluation or lab work requested.</li>
  <li>Return with the paperwork — you usually don't have to restart the whole exam.</li>
</ol>
<p>A deferral is not the end of the road. With the right records, most drivers get certified.</p>
`,
    faq: [
      { q: 'Can you pass a DOT physical with high blood pressure?', a: 'Yes, if it’s controlled. Below 140/90 earns a 2-year card. Readings up to 179/109 can still be certified for shorter intervals. 180/110 or higher is disqualifying until reduced.' },
      { q: 'Does diabetes disqualify you from a DOT physical?', a: 'No. Diabetes — including insulin-treated diabetes — can be certified when it is well controlled and documented by your treating clinician using the FMCSA diabetes assessment form.' },
      { q: 'Will sleep apnea fail my DOT physical?', a: 'Not if it’s treated. Drivers who are compliant with CPAP therapy and bring their compliance report are routinely certified.' },
      { q: 'What medications disqualify a DOT physical?', a: 'Certain Schedule II drugs, some sedatives, and methadone can be disqualifying. A letter from your prescriber confirming the medication is safe for driving often supports certification. Never stop a prescribed medication without medical advice.' }
    ],
    related: [
      { slug: 'dot-physical-requirements-2026', title: 'DOT Physical Requirements 2026: Complete Checklist' },
      { slug: 'return-to-duty-process', title: 'Return-to-Duty Process Explained' },
      { slug: 'cdl-medical-card-renewal', title: 'CDL Medical Card Renewal Guide' }
    ]
  },

  {
    slug: 'fmcsa-drug-testing-rules',
    category: 'DOT / FMCSA',
    title: 'FMCSA Drug &amp; Alcohol Testing Rules Explained (2026) | WorkOccMed',
    desc: 'A plain-English guide to FMCSA drug and alcohol testing rules: the 6 test types, the 5-panel drug test, random testing rates, the Clearinghouse, and consortium requirements for CDL employers.',
    h1: 'FMCSA Drug &amp; Alcohol Testing Rules, Explained',
    lede: 'What every CDL driver and motor carrier needs to know about DOT drug and alcohol testing — the six test types, what’s screened, random rates, the Clearinghouse, and consortium requirements.',
    body: `
<p>The FMCSA requires drug and alcohol testing for anyone who holds a CDL and operates a commercial motor vehicle. The rules live in 49 CFR Part 382 and Part 40. Here's what they mean in practice.</p>

<div class="callout"><p><strong>For employers &amp; owner-operators:</strong> If you have even one CDL driver, you're required to be enrolled in a random testing program. <a href="consortium">Learn about consortium enrollment</a> ($49/year).</p></div>

<h2>The six types of DOT drug &amp; alcohol tests</h2>
<ol>
  <li><strong>Pre-employment</strong> — a negative drug test is required before a driver first performs safety-sensitive functions.</li>
  <li><strong>Random</strong> — drivers are selected by a scientifically valid random method throughout the year.</li>
  <li><strong>Reasonable suspicion</strong> — based on trained supervisor observation of appearance, behavior, speech, or odor.</li>
  <li><strong>Post-accident</strong> — required after qualifying crashes (fatality, or citation plus tow-away/injury).</li>
  <li><strong>Return-to-duty</strong> — after a violation, before returning to safety-sensitive work.</li>
  <li><strong>Follow-up</strong> — a minimum of 6 unannounced tests in the first 12 months after return-to-duty, per the SAP's plan.</li>
</ol>

<h2>What the DOT drug test screens for</h2>
<p>The DOT 5-panel urine test screens for:</p>
<ul>
  <li>Marijuana (THC metabolites)</li>
  <li>Cocaine</li>
  <li>Amphetamines (including methamphetamine, MDMA)</li>
  <li>Opioids (including codeine, morphine, heroin, and semi-synthetics like oxycodone and hydrocodone)</li>
  <li>Phencyclidine (PCP)</li>
</ul>
<p>All results go through a <strong>Medical Review Officer (MRO)</strong>, a licensed physician who verifies results and checks for legitimate medical explanations before a result is reported as positive. Note that under DOT rules, marijuana is not accepted as a valid medical explanation even in states where it's legal.</p>

<h2>Alcohol testing</h2>
<p>Alcohol is tested by breath (or saliva screening). A result of <strong>0.02–0.039</strong> requires the driver to be removed for a period; <strong>0.04 or higher</strong> is a violation requiring the return-to-duty process.</p>

<h2>Random testing rates</h2>
<p>The FMCSA sets minimum annual random testing rates each year — historically <strong>50% for drugs and 10% for alcohol</strong> of the average number of driver positions. A consortium/third-party administrator (C/TPA) manages the random pool and selections for you.</p>

<h2>The FMCSA Clearinghouse</h2>
<p>The Clearinghouse is a federal database of CDL drug and alcohol violations. Employers must:</p>
<ul>
  <li>Run a <strong>pre-employment query</strong> before hiring a driver;</li>
  <li>Run an <strong>annual query</strong> on every current driver;</li>
  <li>Report violations, refusals, and return-to-duty information.</li>
</ul>

<h2>Consortium requirements</h2>
<p>Owner-operators can't test themselves, so FMCSA requires them to join a consortium. A C/TPA like WorkOccMed manages your random pool, coordinates selections and collections, provides MRO review, and handles Clearinghouse reporting — keeping you audit-ready. <a href="consortium">Enroll in our consortium</a> for $49/year.</p>
`,
    faq: [
      { q: 'What does a DOT drug test screen for?', a: 'The DOT 5-panel test screens for marijuana, cocaine, amphetamines, opioids, and PCP. All results are verified by a Medical Review Officer before being reported.' },
      { q: 'What are the FMCSA random testing rates?', a: 'The FMCSA sets minimum annual rates each year — historically 50% for drugs and 10% for alcohol of the average number of driver positions.' },
      { q: 'Do owner-operators need a consortium?', a: 'Yes. Because you can’t administer your own random program, FMCSA requires owner-operators with a CDL to join a consortium/third-party administrator that manages random selections, collections, MRO review, and Clearinghouse reporting.' },
      { q: 'Is marijuana allowed for CDL drivers in legal states?', a: 'No. Under federal DOT rules, marijuana is prohibited for safety-sensitive employees regardless of state law, and a medical marijuana recommendation is not a valid explanation for a positive test.' }
    ],
    related: [
      { slug: 'return-to-duty-process', title: 'Return-to-Duty Process Explained' },
      { slug: 'dot-physical-requirements-2026', title: 'DOT Physical Requirements 2026' }
    ]
  },

  {
    slug: 'return-to-duty-process',
    category: 'DOT / FMCSA',
    title: 'DOT Return-to-Duty Process Explained: SAP Steps (2026) | WorkOccMed',
    desc: 'Step-by-step guide to the DOT return-to-duty (RTD) process after a drug or alcohol violation: the SAP evaluation, education/treatment, RTD test, follow-up testing, and the Clearinghouse.',
    h1: 'The DOT Return-to-Duty Process, Step by Step',
    lede: 'After a positive test or refusal, federal rules require a specific path back to safety-sensitive work. Here is exactly how the return-to-duty (RTD) process works and how long it takes.',
    body: `
<p>If a CDL driver tests positive, refuses a test, or otherwise violates DOT drug and alcohol rules, they are immediately removed from safety-sensitive duties. Getting back behind the wheel requires completing the <strong>return-to-duty (RTD) process</strong> under 49 CFR Part 40, Subpart O. Here are the steps.</p>

<div class="callout"><p>WorkOccMed coordinates return-to-duty and follow-up testing nationwide. <a href="return-to-duty">See our return-to-duty services</a> or call <a href="tel:+18882334567">(888) 233-4567</a>.</p></div>

<h2>Step 1 — Removal and the Clearinghouse</h2>
<p>The violation is reported to the FMCSA Clearinghouse, and the driver is prohibited from performing safety-sensitive functions until the process is complete.</p>

<h2>Step 2 — SAP evaluation</h2>
<p>The driver must be evaluated by a <strong>Substance Abuse Professional (SAP)</strong> — a qualified counselor who assesses the situation and prescribes a course of education and/or treatment. The driver, not the employer, pays for the SAP process.</p>

<h2>Step 3 — Education and/or treatment</h2>
<p>The driver completes the specific program the SAP prescribes. This can range from an education course to formal treatment, depending on the evaluation.</p>

<h2>Step 4 — SAP follow-up evaluation</h2>
<p>The SAP re-evaluates the driver to confirm they have complied with the recommendations and are ready to return. The SAP then issues a report clearing the driver for a return-to-duty test.</p>

<h2>Step 5 — Return-to-duty (RTD) test</h2>
<p>The driver takes a <strong>directly observed</strong> return-to-duty test, which must be negative. This test cannot be a random, pre-employment, or other type — it's a specific RTD test coordinated by the employer or C/TPA.</p>

<h2>Step 6 — Follow-up testing plan</h2>
<p>Once back at work, the driver follows a SAP-directed <strong>follow-up testing</strong> schedule: a minimum of <strong>6 unannounced, directly observed tests in the first 12 months</strong>, and potentially continuing for up to 5 years. Missing a follow-up test can send the driver back to square one.</p>

<h2>How long does it take?</h2>
<p>There's no fixed timeline — it depends on the SAP's treatment recommendation and scheduling. The fastest paths still involve the full SAP evaluation, prescribed program, follow-up evaluation, and a negative RTD test. Coordinating the SAP report, the RTD test, and the follow-up schedule efficiently is where a good C/TPA saves weeks.</p>
`,
    faq: [
      { q: 'What is a SAP in the DOT return-to-duty process?', a: 'A Substance Abuse Professional (SAP) is a qualified counselor who evaluates a driver after a drug or alcohol violation, prescribes education or treatment, and clears the driver for a return-to-duty test once requirements are met.' },
      { q: 'How many follow-up tests are required after return-to-duty?', a: 'A minimum of 6 unannounced, directly observed follow-up tests in the first 12 months, and the SAP can extend follow-up testing for up to 5 years.' },
      { q: 'Who pays for the return-to-duty process?', a: 'The driver is generally responsible for the cost of the SAP evaluation and any prescribed treatment. Employers coordinate the testing.' },
      { q: 'Can I drive during the return-to-duty process?', a: 'No. You are prohibited from performing safety-sensitive functions until you complete the SAP process and pass a return-to-duty test.' }
    ],
    related: [
      { slug: 'fmcsa-drug-testing-rules', title: 'FMCSA Drug &amp; Alcohol Testing Rules' },
      { slug: 'what-disqualifies-you-from-a-dot-physical', title: 'What Disqualifies You From a DOT Physical?' }
    ]
  },

  {
    slug: 'cdl-medical-card-renewal',
    category: 'DOT / FMCSA',
    title: 'CDL Medical Card Renewal Guide (2026): How &amp; When | WorkOccMed',
    desc: 'How to renew your CDL medical card in 2026: when to renew, how to submit your Medical Examiner’s Certificate to your state, what happens if it expires, and how to avoid a downgrade.',
    h1: 'CDL Medical Card Renewal: How and When to Renew',
    lede: 'Your DOT medical card expires — and letting it lapse can downgrade your CDL. Here is how to renew on time, submit it to your state, and avoid a license downgrade.',
    body: `
<p>Your Medical Examiner's Certificate ("medical card") has an expiration date, and keeping it current is what keeps your CDL valid. Here's how renewal works.</p>

<div class="callout"><p>Renew early. You can <a href="${ORDER}">order your renewal DOT physical online</a> for $110 and complete it the same day at a site near you — no need to wait until your card expires.</p></div>

<h2>When to renew</h2>
<p>Renew <strong>before</strong> your current card expires — ideally a few weeks early. There's no penalty for renewing early, and it protects you from an accidental lapse. Your new certificate can be valid for up to 24 months, though conditions like blood pressure may result in a shorter interval.</p>

<h2>How to renew, step by step</h2>
<ol>
  <li><strong>Get a new DOT physical</strong> from an FMCSA-certified medical examiner.</li>
  <li><strong>Receive your new Medical Examiner's Certificate</strong> (usually the same day).</li>
  <li><strong>Submit it to your State Driver Licensing Agency (SDLA).</strong> Many examiners now transmit results electronically, but you are ultimately responsible for making sure your state has your current certificate on file.</li>
  <li><strong>Keep a copy</strong> for your records and your employer.</li>
</ol>

<h2>What happens if your medical card expires</h2>
<p>If your certificate lapses, your state can downgrade your CDL to a regular license — which means you can't legally drive commercially until you renew and your state processes the new certificate. Reinstating a downgraded CDL can take time, so it's far easier to renew early.</p>

<h2>Self-certification and your driving category</h2>
<p>When you first get your CDL and at renewal, you self-certify your type of driving (interstate/intrastate, excepted/non-excepted). Non-excepted interstate drivers must maintain a current medical card with the state. If your driving category changes, update your self-certification with your SDLA.</p>

<h2>Renewing with a medical condition</h2>
<p>If you have a condition like high blood pressure, diabetes, or sleep apnea, bring your documentation to the renewal exam just as you would for a first-time physical. Proof that your condition is controlled is what earns you the longest possible certificate. See <a href="what-disqualifies-you-from-a-dot-physical">what disqualifies you from a DOT physical</a> for details.</p>
`,
    faq: [
      { q: 'How early can I renew my DOT medical card?', a: 'You can renew any time before it expires — there’s no penalty for renewing early, and doing so a few weeks ahead protects you from an accidental lapse and CDL downgrade.' },
      { q: 'What happens if my DOT medical card expires?', a: 'Your state can downgrade your CDL to a non-commercial license, meaning you cannot legally drive commercially until you renew and the state processes your new certificate.' },
      { q: 'Do I have to send my medical card to the DMV myself?', a: 'Many examiners transmit results electronically, but you are ultimately responsible for ensuring your State Driver Licensing Agency has your current Medical Examiner’s Certificate on file.' },
      { q: 'How long is a renewed medical card valid?', a: 'Up to 24 months. Conditions such as elevated blood pressure can result in a shorter certificate (for example 12 months or 3 months).' }
    ],
    related: [
      { slug: 'dot-physical-requirements-2026', title: 'DOT Physical Requirements 2026' },
      { slug: 'what-disqualifies-you-from-a-dot-physical', title: 'What Disqualifies You From a DOT Physical?' }
    ]
  },

  {
    slug: 'dot-physical-vs-pre-employment-physical',
    category: 'Employer Screening',
    title: 'DOT Physical vs. Pre-Employment Physical: What’s the Difference? | WorkOccMed',
    desc: 'DOT physical vs. pre-employment physical explained: who needs each, what they test, cost, and how to order the right exam for drivers or new hires. Reviewed by a certified medical examiner.',
    h1: 'DOT Physical vs. Pre-Employment Physical: What’s the Difference?',
    lede: 'They sound similar but serve different purposes. Here is how a DOT physical and a pre-employment physical differ — and how to know which one you or your new hire needs.',
    body: `
<p>Both exams check whether someone is medically fit to work, but they're built for different reasons and follow different rules. Choosing the wrong one wastes time and money.</p>

<h2>What is a DOT physical?</h2>
<p>A <strong>DOT physical</strong> is a federally regulated exam required by the FMCSA for commercial drivers. It follows a standardized form, must be done by a certified medical examiner, and results in a Medical Examiner's Certificate valid up to 24 months. Its purpose is narrow and specific: confirming a driver meets federal medical standards to operate a CMV. Learn more in our <a href="dot-physical-requirements-2026">DOT physical requirements guide</a>.</p>

<h2>What is a pre-employment physical?</h2>
<p>A <strong>pre-employment physical</strong> (also called a fitness-for-duty exam) is an employer-defined exam to confirm a new hire can safely perform the essential functions of a specific job. There's no single federal standard — the employer sets the components based on the role and industry.</p>

<h2>Side-by-side comparison</h2>
<table style="width:100%;border-collapse:collapse;margin:20px 0;font-size:16px;">
  <thead><tr style="background:#0d1b2a;color:white;"><th style="padding:12px;text-align:left;">&nbsp;</th><th style="padding:12px;text-align:left;">DOT Physical</th><th style="padding:12px;text-align:left;">Pre-Employment Physical</th></tr></thead>
  <tbody>
    <tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:12px;font-weight:700;">Required by</td><td style="padding:12px;">Federal law (FMCSA)</td><td style="padding:12px;">The employer</td></tr>
    <tr style="border-bottom:1px solid #e5e7eb;background:#f8fafc;"><td style="padding:12px;font-weight:700;">Who needs it</td><td style="padding:12px;">CDL / commercial drivers</td><td style="padding:12px;">New hires in many industries</td></tr>
    <tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:12px;font-weight:700;">Standard</td><td style="padding:12px;">Fixed FMCSA form</td><td style="padding:12px;">Set by employer / role</td></tr>
    <tr style="border-bottom:1px solid #e5e7eb;background:#f8fafc;"><td style="padding:12px;font-weight:700;">Result</td><td style="padding:12px;">Medical Examiner’s Certificate</td><td style="padding:12px;">Fit-for-duty determination</td></tr>
    <tr><td style="padding:12px;font-weight:700;">Common add-ons</td><td style="padding:12px;">—</td><td style="padding:12px;">Drug test, titers, TB test, fit testing, lift test</td></tr>
  </tbody>
</table>

<h2>Which one do you need?</h2>
<ul>
  <li><strong>Hiring or renewing a commercial driver?</strong> You need a <a href="dot-physical">DOT physical</a>.</li>
  <li><strong>Hiring for construction, healthcare, warehouse, or manufacturing?</strong> You likely need a <a href="pre-employment-physical">pre-employment physical</a>, often bundled with a drug test and any role-specific screenings.</li>
  <li><strong>Not sure?</strong> Call <a href="tel:+18882334567">(888) 233-4567</a> and we'll help you order the right exam.</li>
</ul>

<h2>Can you combine them?</h2>
<p>Yes. Many employers order a DOT physical <em>and</em> a drug test together for drivers, or a pre-employment physical with titers and fit testing for healthcare and industrial hires — all in one order through WorkOccMed.</p>
`,
    faq: [
      { q: 'Is a DOT physical the same as a pre-employment physical?', a: 'No. A DOT physical is a federally standardized exam for commercial drivers that produces a Medical Examiner’s Certificate. A pre-employment physical is employer-defined and confirms a new hire can perform a specific job.' },
      { q: 'Does a pre-employment physical include a drug test?', a: 'Not automatically — but employers frequently add a drug test, and it can be bundled into a single order along with titers, TB tests, or fit testing.' },
      { q: 'Which physical does a truck driver need?', a: 'Commercial drivers need a DOT physical to obtain or renew their medical card. An employer may also require a pre-employment drug test.' }
    ],
    related: [
      { slug: 'dot-physical-requirements-2026', title: 'DOT Physical Requirements 2026' },
      { slug: 'fmcsa-drug-testing-rules', title: 'FMCSA Drug &amp; Alcohol Testing Rules' }
    ]
  }
];

/* ============================================================
   GUIDES HUB (index)
   ============================================================ */

function renderHub(){
  const cards = guides.map(g => `
    <a href="${g.slug}" style="display:block;background:white;border:1px solid #e5e7eb;border-radius:16px;padding:26px;text-decoration:none;transition:box-shadow .2s;box-shadow:0 1px 3px rgba(0,0,0,0.04);">
      <div style="font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#1d4ed8;margin-bottom:10px;">${g.category}</div>
      <div style="font-size:21px;font-weight:800;color:#0d1b2a;line-height:1.25;margin-bottom:10px;letter-spacing:-0.01em;">${g.h1}</div>
      <div style="font-size:16px;color:#6b7280;line-height:1.55;">${g.lede}</div>
      <div style="margin-top:16px;color:#1d4ed8;font-weight:700;font-size:15px;">Read guide →</div>
    </a>`).join('\n');

  const itemList = {
    "@context":"https://schema.org",
    "@type":"ItemList",
    "itemListElement": guides.map((g,i)=>({ "@type":"ListItem", "position":i+1, "url":`${SITE}/${g.slug}`, "name":g.h1 }))
  };

  return HEAD(
    'Occupational Health &amp; DOT Compliance Guides | WorkOccMed',
    'Free educational guides on DOT physicals, FMCSA drug testing, CDL medical cards, return-to-duty, and employer health screening. Reviewed by a certified medical examiner.',
    'guides', null
  ) + `<script type="application/ld+json">${JSON.stringify(itemList)}</script>` + NAV + `
<header style="background:linear-gradient(135deg,#0d1b2a 0%,#1e3a8a 100%);padding:60px 24px 52px;text-align:center;">
  <div style="max-width:760px;margin:0 auto;">
    <div style="font-size:14px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#93c5fd;margin-bottom:14px;">Resource Center</div>
    <h1 style="font-size:clamp(2.2rem,4.5vw,3.2rem);font-weight:900;line-height:1.1;color:white;letter-spacing:-0.02em;margin-bottom:16px;">Occupational Health &amp; DOT Compliance Guides</h1>
    <p style="font-size:19px;color:rgba(255,255,255,0.82);line-height:1.6;">Plain-English answers to the questions drivers, employers, and safety managers ask most — written and reviewed by a certified medical examiner.</p>
  </div>
</header>
<section style="background:#f8fafc;padding:52px 24px 64px;">
  <div style="max-width:1000px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px;">
    ${cards}
  </div>
</section>
` + CTA + FOOTER + CHATBOT;
}

/* ============================================================
   WRITE FILES
   ============================================================ */

let count = 0;
for (const g of guides){
  fs.writeFileSync(path.join(OUT, `${g.slug}.html`), renderGuide(g), 'utf8');
  count++;
  console.log('wrote', g.slug + '.html');
}
fs.writeFileSync(path.join(OUT, 'guides.html'), renderHub(), 'utf8');
console.log('wrote guides.html');
console.log(`\nDone. ${count} guides + hub.`);

module.exports = { guides };
