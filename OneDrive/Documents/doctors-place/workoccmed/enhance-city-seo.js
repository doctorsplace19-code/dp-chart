/**
 * enhance-city-seo.js — in-place SEO differentiation for cities/*.html.
 *
 * Scoped STRICTLY to doctors-place/workoccmed/cities/. Does NOT regenerate from
 * the (stale) generator, so every existing hand-edit — including the
 * "Doctors Place, LLC" legal footer — is preserved.
 *
 * Two transforms per page:
 *   T1  H1 leads with the money keyword ("<City> DOT Physical & Drug Testing").
 *   T2  A unique "Nearby cities" section with real internal links to neighbor
 *       city pages (different set per city = unique content + internal links).
 *
 * Usage:
 *   node enhance-city-seo.js                 # preview only (writes to /tmp), no changes
 *   node enhance-city-seo.js --only=slug,... # preview specific cities
 *   node enhance-city-seo.js --apply         # write changes in place
 */
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, 'cities');
const APPLY = process.argv.includes('--apply');
const onlyArg = (process.argv.find(a => a.startsWith('--only=')) || '').split('=')[1];
const ONLY = onlyArg ? onlyArg.split(',') : null;

// --- Pull the STATES list (name/slug/abbr/cities) from the generator source
//     WITHOUT executing it (the generator self-runs on require). ---
const genSrc = fs.readFileSync(path.join(__dirname, 'generate-state-pages.js'), 'utf8');
const s = genSrc.indexOf('const STATES = [');
const e = genSrc.indexOf('\n];', s);
const STATES = eval(genSrc.slice(s + 'const STATES = '.length, e + 2));

const slugify = (c) => c.toLowerCase().replace(/[^a-z0-9]+/g, '-');

// fullSlug -> { state, abbr, city, neighbors:[{name,slug}] }
const BY_SLUG = {};
for (const st of STATES) {
  for (const city of st.cities) {
    const fullSlug = `${st.slug}-${slugify(city)}`;
    const neighbors = st.cities
      .filter(c => c !== city)
      .slice(0, 6)
      .map(c => ({ name: c, slug: `${st.slug}-${slugify(c)}` }));
    BY_SLUG[fullSlug] = { stateName: st.name, abbr: st.abbr, city, neighbors };
  }
}

function transform(html, info) {
  const { city, abbr, stateName, neighbors } = info;
  let out = html;
  let changed = [];

  // T1 — keyword-first H1 (idempotent: only fires on the old generic H1).
  const h1re = /<h1>Occupational Health<br><span>([^<]+?), ([A-Z]{2})<\/span><\/h1>/;
  if (h1re.test(out)) {
    out = out.replace(h1re,
      `<h1>${city} DOT Physical &amp; Drug Testing<br><span>Occupational Health &middot; ${city}, ${abbr}</span></h1>`);
    changed.push('H1');
  }

  // T2 — unique "Nearby cities" section with internal links, before the CTA strip.
  if (!out.includes('data-seo="nearby"') && neighbors.length) {
    const chips = neighbors.map(n =>
      `<a href="${n.slug}" style="display:inline-block;padding:10px 18px;background:white;border:1px solid #e2e8f0;border-radius:999px;font-size:16px;font-weight:600;color:#1e40af;text-decoration:none;">${n.name} DOT Physical &rarr;</a>`
    ).join('\n      ');
    const section = `
<section data-seo="nearby" style="background:#f8faff;">
  <div class="inner">
    <div class="label">Nearby Cities</div>
    <h2 class="title">DOT Physicals &amp; Drug Testing Near ${city}, ${abbr}</h2>
    <p class="sub">WorkOccMed serves drivers and employers across ${stateName}. If ${city} isn't the closest option, order online and use a certified site in a nearby city:</p>
    <div style="display:flex;flex-wrap:wrap;gap:12px;margin-top:22px;">
      ${chips}
    </div>
  </div>
</section>

`;
    if (out.includes('<div class="cta-strip">')) {
      out = out.replace('<div class="cta-strip">', section + '<div class="cta-strip">');
      changed.push('nearby-links(' + neighbors.length + ')');
    }
  }

  return { out, changed };
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
    const tmp = path.join(require('os').tmpdir(), 'seo-' + f);
    fs.writeFileSync(tmp, out, 'utf8');
    previews.push({ f, changed, tmp });
  }
  done++;
}

console.log(`${APPLY ? 'APPLIED' : 'PREVIEWED'}: ${done} files, skipped ${skipped}.`);
if (!APPLY && previews.length) {
  console.log('Preview files written to temp:');
  previews.forEach(p => console.log(`  ${p.f}  [${p.changed.join(', ')}]  -> ${p.tmp}`));
}
