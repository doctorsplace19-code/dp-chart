/**
 * add-rtd-consortium-seo.js — in-place SEO addition for cities/*.html.
 *
 * Adds a dedicated "Return to Duty" + "DOT Consortium" section per city page,
 * with its own <h2>s targeting those exact query patterns (Search Console
 * showed real multi-city demand for "return to duty test in <city>, <state>"
 * and "dot consortium <state>" queries at position 35-60 — city pages only
 * ever targeted the DOT-physical keyword, so these terms never ranked).
 *
 * Scoped STRICTLY to doctors-place/workoccmed/cities/. Idempotent via the
 * data-seo="rtd-consortium" marker, same convention as enhance-city-seo.js.
 *
 * Usage:
 *   node add-rtd-consortium-seo.js                 # preview only (writes to /tmp)
 *   node add-rtd-consortium-seo.js --only=slug,...  # preview specific cities
 *   node add-rtd-consortium-seo.js --apply          # write changes in place
 */
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, 'cities');
const APPLY = process.argv.includes('--apply');
const onlyArg = (process.argv.find(a => a.startsWith('--only=')) || '').split('=')[1];
const ONLY = onlyArg ? onlyArg.split(',') : null;

const genSrc = fs.readFileSync(path.join(__dirname, 'generate-state-pages.js'), 'utf8');
const s = genSrc.indexOf('const STATES = [');
const e = genSrc.indexOf('\n];', s);
const STATES = eval(genSrc.slice(s + 'const STATES = '.length, e + 2));

const slugify = (c) => c.toLowerCase().replace(/[^a-z0-9]+/g, '-');

const BY_SLUG = {};
for (const st of STATES) {
  for (const city of st.cities) {
    const fullSlug = `${st.slug}-${slugify(city)}`;
    BY_SLUG[fullSlug] = { stateName: st.name, abbr: st.abbr, city };
  }
}

function transform(html, info) {
  const { city, abbr, stateName } = info;
  if (html.includes('data-seo="rtd-consortium"')) return { out: html, changed: [] };
  if (!html.includes('<div class="cta-strip">')) return { out: html, changed: [] };

  const section = `
<section data-seo="rtd-consortium" style="background:white;">
  <div class="inner">
    <div class="label">Return to Duty &amp; Consortium &middot; ${city}, ${abbr}</div>
    <h2 class="title">${city} Return to Duty Drug Testing</h2>
    <p class="sub">DOT return to duty testing after the SAP process, plus non-DOT fitness-for-duty evaluations, for ${city}-area employees and CDL drivers returning to work after a violation or injury. Order online and complete testing at a certified site near ${city}, ${stateName}.</p>
    <div style="margin-top:26px;display:grid;grid-template-columns:1fr 1fr;gap:20px;">
      <div class="card">
        <h3>${city} Return to Duty Testing</h3>
        <p>DOT return to duty drug and alcohol testing for ${city} drivers completing the SAP (Substance Abuse Professional) process, plus follow-up testing coordination. Non-DOT fitness-for-duty evaluations also available for ${city} employers.</p>
        <a href="../return-to-duty" style="display:inline-block;margin-top:12px;font-size:16px;font-weight:600;color:#1e40af;text-decoration:none;">Learn more &rarr;</a>
      </div>
      <div class="card">
        <h3>${city} DOT Consortium</h3>
        <p>Enroll your ${city}-area CDL drivers in an FMCSA-compliant random testing consortium from $49/year per driver. Random pulls, MRO review, and Clearinghouse reporting handled for you &mdash; no local consortium office needed in ${stateName}.</p>
        <a href="../consortium" style="display:inline-block;margin-top:12px;font-size:16px;font-weight:600;color:#1e40af;text-decoration:none;">Learn more &rarr;</a>
      </div>
    </div>
    <div class="faq-list" style="margin-top:36px;">
      <div class="faq-item">
        <button class="faq-q" onclick="this.classList.toggle('open');this.nextElementSibling.classList.toggle('open')">Where can I get a return to duty drug test in ${city}?</button>
        <div class="faq-a">WorkOccMed coordinates DOT return to duty testing at certified sites near ${city}, ${abbr}, following SAP-directed follow-up testing schedules. Order online and your driver completes testing at a nearby collection site.</div>
      </div>
      <div class="faq-item">
        <button class="faq-q" onclick="this.classList.toggle('open');this.nextElementSibling.classList.toggle('open')">Is there a DOT random testing consortium in ${city}, ${stateName}?</button>
        <div class="faq-a">Yes. WorkOccMed's DOT consortium covers ${city} and all of ${stateName} &mdash; enroll drivers online from $49/year each, with random selection, MRO review, and FMCSA Clearinghouse reporting fully managed for you.</div>
      </div>
    </div>
  </div>
</section>

`;
  const out = html.replace('<div class="cta-strip">', section + '<div class="cta-strip">');
  return { out, changed: ['rtd-consortium'] };
}

const files = fs.readdirSync(DIR).filter(f => f.endsWith('.html'));
let done = 0, skipped = 0;
const previews = [];

for (const f of files) {
  const slug = f.replace(/\.html$/, '');
  if (ONLY && !ONLY.includes(slug)) continue;
  const info = BY_SLUG[slug];
  if (!info) { skipped++; if (ONLY) console.log('NO MATCH:', slug); continue; }
  const html = fs.readFileSync(path.join(DIR, f), 'utf8');
  const { out, changed } = transform(html, info);
  if (!changed.length) { skipped++; continue; }
  if (APPLY) {
    fs.writeFileSync(path.join(DIR, f), out, 'utf8');
  } else {
    const tmp = path.join(require('os').tmpdir(), 'rtd-' + f);
    fs.writeFileSync(tmp, out, 'utf8');
    previews.push({ f, changed, tmp });
  }
  done++;
}

console.log(`${APPLY ? 'APPLIED' : 'PREVIEWED'}: ${done} files, skipped ${skipped}.`);
if (!APPLY && previews.length) {
  console.log('Preview files written to temp:');
  previews.slice(0, 5).forEach(p => console.log(`  ${p.f}  [${p.changed.join(', ')}]  -> ${p.tmp}`));
}
