// GlamLab Studio - Product catalog
// Features: Search Bar, Category Filters, Sorting Options, Favorites Button, Rating System.

const PRODUCTS = [
  { id: 'velvet-matte',    name: 'Velvet Matte Lipstick',  brand: 'GlamCo',    category: 'Lips',  price: 22, added: '2026-09-01', emoji: '💄', blurb: 'Long-wear matte lipstick with botanical emulsifiers.' },
  { id: 'gloss-bomb',      name: 'Shine Bomb Lip Gloss',   brand: 'LuxeLab',   category: 'Lips',  price: 16, added: '2026-09-15', emoji: '💋', blurb: 'High-shine gloss with a plumping effect.' },
  { id: 'silk-foundation', name: 'Silk Touch Foundation',  brand: 'GlamCo',    category: 'Face',  price: 34, added: '2026-08-20', emoji: '🧴', blurb: 'Non-comedogenic 4K-ready foundation.' },
  { id: 'hd-blur',         name: 'HD Blur Powder',         brand: 'PixelGlow', category: 'Face',  price: 28, added: '2026-10-01', emoji: '✨', blurb: 'Micro-powder optical diffusion for camera-ready skin.' },
  { id: 'blush-pop',       name: 'Blush Pop Palette',      brand: 'LuxeLab',   category: 'Face',  price: 26, added: '2026-09-05', emoji: '🌸', blurb: 'Silky pressed blush in four buildable shades.' },
  { id: 'lash-drama',      name: 'Lash Drama Mascara',     brand: 'PixelGlow', category: 'Eyes',  price: 19, added: '2026-10-10', emoji: '👁️', blurb: 'Volume-boosting smudge-proof mascara.' },
  { id: 'shadow-story',    name: 'Shadow Story Palette',   brand: 'GlamCo',    category: 'Eyes',  price: 42, added: '2026-08-01', emoji: '🎨', blurb: '12 avant-garde editorial shades curated by runway artists.' },
  { id: 'liner-sharp',     name: 'Sharp Line Eyeliner',    brand: 'LuxeLab',   category: 'Eyes',  price: 15, added: '2026-10-15', emoji: '🖊️', blurb: 'Precision felt-tip liner in ultra-pigmented black.' },
  { id: 'glow-serum',      name: 'Glow Serum Primer',      brand: 'VanceLab',  category: 'Skin',  price: 38, added: '2026-09-20', emoji: '🧖', blurb: 'Skin prep serum with pigment-stabilizing formula.' },
  { id: 'setting-spray',   name: 'Sweat-Proof Setting Spray', brand: 'StageFX', category: 'Skin', price: 24, added: '2026-10-05', emoji: '💦', blurb: 'Polymer setting spray tested under stage lights.' },
  { id: 'brush-set',       name: 'Pro Brush Set (8 pc)',   brand: 'GlamCo',    category: 'Tools', price: 55, added: '2026-08-10', emoji: '🖌️', blurb: 'Vegan synthetic brushes for flawless blending.' },
  { id: 'sfx-kit',         name: 'SFX Starter Kit',        brand: 'ChenFX',    category: 'Tools', price: 78, added: '2026-07-30', emoji: '🎭', blurb: 'Silicone appliance kit with edge-blending solvents.' },
];

// Shared prefs: favorites + ratings, saved per browser
function getPrefs() {
  try { return JSON.parse(localStorage.getItem('glamPrefs')) || { favorites: [], ratings: {} }; }
  catch (e) { return { favorites: [], ratings: {} }; }
}
function savePrefs(p) { localStorage.setItem('glamPrefs', JSON.stringify(p)); }

function currentFilters() {
  return {
    q: (document.getElementById('searchBar').value || '').trim().toLowerCase(),
    cat: document.getElementById('catFilter').value,
    sort: document.getElementById('sortSel').value,
    favOnly: document.getElementById('favOnly').checked,
  };
}

function applyAll() {
  const f = currentFilters();
  let list = PRODUCTS.filter(p =>
    (f.cat === 'All' || p.category === f.cat) &&
    (!f.favOnly || getPrefs().favorites.includes(p.id)) &&
    (f.q === '' || p.name.toLowerCase().includes(f.q) || p.brand.toLowerCase().includes(f.q) ||
      p.category.toLowerCase().includes(f.q) || p.blurb.toLowerCase().includes(f.q))
  );
  if (f.sort === 'az') list.sort((a, b) => a.name.localeCompare(b.name));
  else if (f.sort === 'za') list.sort((a, b) => b.name.localeCompare(a.name));
  else if (f.sort === 'price-asc') list.sort((a, b) => a.price - b.price);
  else if (f.sort === 'price-desc') list.sort((a, b) => b.price - a.price);
  else if (f.sort === 'newest') list.sort((a, b) => b.added.localeCompare(a.added));
  else if (f.sort === 'rating') list.sort((a, b) => (getPrefs().ratings[b.id] || 0) - (getPrefs().ratings[a.id] || 0));
  else if (f.sort === 'popular') list.sort((a, b) => (b.favCount || 0) - (a.favCount || 0));
  renderCatalog(list);
}

function renderCatalog(list) {
  const grid = document.getElementById('pgrid');
  grid.innerHTML = '';
  const prefs = getPrefs();
  if (!list.length) {
    grid.innerHTML = '<p class="sub" style="grid-column:1/-1;text-align:center;padding:30px">😕 Nothing matches. Try another search or filter!</p>';
    return;
  }
  for (const p of list) {
    const d = document.createElement('div');
    d.className = 'pcard';
    const fav = prefs.favorites.includes(p.id);
    const rating = prefs.ratings[p.id] || 0;
    d.innerHTML = '<div class="emoji">' + p.emoji + '</div>'
      + '<div class="cat">' + p.category + '</div>'
      + '<h3 style="font-size:15px">' + p.name + '</h3>'
      + '<div class="brand">by ' + p.brand + '</div>'
      + '<div class="price">$' + p.price + '</div>'
      + '<p class="sub" style="font-size:12px;margin-top:6px">' + p.blurb + '</p>'
      + '<div class="stars" id="stars-' + p.id + '"></div>'
      + '<button class="fav' + (fav ? ' on' : '') + '" title="Save to favorites">' + (fav ? '💖' : '🤍') + '</button>';
    // Feature: Rating System - click a star to rate 1-5
    const stars = d.querySelector('.stars');
    for (let i = 1; i <= 5; i++) {
      const s = document.createElement('span');
      s.textContent = '★';
      if (i > rating) s.className = 'dim';
      s.onclick = function () { rate(p.id, i); };
      stars.appendChild(s);
    }
    // Feature: Favorites Button - save items for later viewing
    d.querySelector('.fav').onclick = function () {
      const prefs2 = getPrefs();
      const i = prefs2.favorites.indexOf(p.id);
      if (i >= 0) prefs2.favorites.splice(i, 1); else prefs2.favorites.push(p.id);
      savePrefs(prefs2);
      applyAll();
    };
    grid.appendChild(d);
  }
  const count = document.getElementById('resultCount');
  count.textContent = list.length + ' product' + (list.length === 1 ? '' : 's') + ' shown';
}

function rate(id, stars) {
  const prefs = getPrefs();
  if (prefs.ratings[id] === stars) delete prefs.ratings[id]; else prefs.ratings[id] = stars;
  savePrefs(prefs);
  applyAll();
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('searchBar').addEventListener('input', applyAll);
  document.getElementById('catFilter').addEventListener('change', applyAll);
  document.getElementById('sortSel').addEventListener('change', applyAll);
  document.getElementById('favOnly').addEventListener('change', applyAll);
  applyAll();
});
