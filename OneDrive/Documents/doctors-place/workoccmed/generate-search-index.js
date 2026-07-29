/**
 * Builds search-index.json for the client-side site search (search.html).
 * Scans every .html page for its <title> and meta description, and records a
 * clean extensionless URL. Body text is intentionally NOT indexed, so the
 * index stays small and loads fast even with 600+ pages.
 *
 *   node generate-search-index.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

// Pages we never want in search results.
const EXCLUDE = new Set(['search.html', '404.html']);

function read(file) {
  try { return fs.readFileSync(file, 'utf8'); } catch { return ''; }
}

function extract(html) {
  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']/i);
  const decode = (s) => (s || '')
    .replace(/&amp;/g, '&').replace(/&#8217;/g, '’')
    .replace(/&mdash;/g, '—').replace(/&ndash;/g, '–')
    .replace(/&rarr;/g, '').replace(/\s+/g, ' ').trim();
  return {
    title: decode(titleMatch ? titleMatch[1] : ''),
    description: decode(descMatch ? descMatch[1] : ''),
  };
}

// url = path relative to site root, extension stripped (site serves clean URLs).
function toUrl(rel) {
  return rel.replace(/\\/g, '/').replace(/\.html$/i, '').replace(/\/index$/i, '/');
}

function labelType(rel) {
  if (rel.startsWith('states/')) return 'Locations';
  if (rel.startsWith('cities/')) return 'Locations';
  if (rel.startsWith('newsletter/')) return 'Guides';
  if (/guide|requirements|rules|checklist|clearinghouse|renewal|explained|vs-/.test(rel)) return 'Guides';
  return 'Services';
}

function walk(dir, base = '') {
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const rel = base ? `${base}/${name}` : name;
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (['.git', '.vercel', '.claude', 'node_modules', 'images'].includes(name)) continue;
      out.push(...walk(full, rel));
    } else if (name.endsWith('.html') && !EXCLUDE.has(rel)) {
      const { title, description } = extract(read(full));
      if (!title) continue;
      out.push({ title, description, url: '/' + toUrl(rel), type: labelType(rel) });
    }
  }
  return out;
}

const entries = walk(ROOT).sort((a, b) => a.title.localeCompare(b.title));
fs.writeFileSync(path.join(ROOT, 'search-index.json'), JSON.stringify(entries));
console.log(`Wrote search-index.json with ${entries.length} pages.`);
