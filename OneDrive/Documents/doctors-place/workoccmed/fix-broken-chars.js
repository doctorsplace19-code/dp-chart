/**
 * fix-broken-chars.js — repairs U+FFFD (replacement character) corruption
 * across the entire workoccmed site. Verified against clean reference files
 * (index.html, consortium.html, dot-random-consortium-guide.html) that never
 * had this corruption: every single U+FFFD corresponds to an en-dash "–"
 * (e.g. "$110 – same-day", "24–72h", "–– Mega-menu dropdowns ––",
 * "– 2026 WorkOccMed LLC"). No clean reference exists for the doubled
 * "<span>��</span>" breadcrumb separator (every page has it broken),
 * so that one is replaced with "/" as a safe, standard breadcrumb separator.
 *
 * Usage:
 *   node fix-broken-chars.js                # preview only, no changes
 *   node fix-broken-chars.js --apply         # write changes in place
 */
const fs = require('fs');
const path = require('path');

const APPLY = process.argv.includes('--apply');

function walk(dir) {
  let out = [];
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) out = out.concat(walk(p));
    else if (f.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const files = walk(__dirname);
let filesChanged = 0, doubleFixed = 0, singleFixed = 0;

for (const f of files) {
  const html = fs.readFileSync(f, 'utf8');
  if (!html.includes('�')) continue;

  const doubles = (html.match(/��/g) || []).length;
  let out = html.replace(/��/g, '/');
  const singles = (out.match(/�/g) || []).length;
  out = out.replace(/�/g, '–'); // en dash

  doubleFixed += doubles;
  singleFixed += singles;
  filesChanged++;

  if (APPLY) fs.writeFileSync(f, out, 'utf8');
}

console.log(`${APPLY ? 'APPLIED' : 'PREVIEWED'}: ${filesChanged} files, ${singleFixed} en-dash fixes, ${doubleFixed} breadcrumb-separator fixes.`);
