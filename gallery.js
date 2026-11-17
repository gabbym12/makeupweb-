// GlamLab Studio - Image Carousel + Image Gallery
const LOOKS = [
  { emoji: '💅', title: 'Glitter Glam Nails',   caption: 'Chrome glitter set with gem accents',       bg: 'linear-gradient(135deg,#ff5fa2,#ffb86e)' },
  { emoji: '👁️', title: 'Smoky Eye Night Look', caption: 'Blended charcoal smoky eye with shimmer',   bg: 'linear-gradient(135deg,#3a2352,#7c3aed)' },
  { emoji: '🌸', title: 'Soft Blush Natural',   caption: 'Everyday glow with peach blush',            bg: 'linear-gradient(135deg,#fda4af,#fbcfe8)' },
  { emoji: '💋', title: 'Classic Red Lip',      caption: 'Timeless matte red with clean liner',       bg: 'linear-gradient(135deg,#dc2626,#f472b6)' },
  { emoji: '✨', title: 'HD Camera Ready',      caption: 'Blur powder finish for 4K close-ups',       bg: 'linear-gradient(135deg,#0ea5e9,#818cf8)' },
  { emoji: '🎭', title: 'SFX Fantasy',          caption: 'Prosthetic edges blended to perfection',    bg: 'linear-gradient(135deg,#059669,#34d399)' },
];

let idx = 0, autoT = null;

function build() {
  const slides = document.getElementById('slides');
  const dots = document.getElementById('dots');
  const grid = document.getElementById('ggrid');
  slides.innerHTML = ''; dots.innerHTML = ''; grid.innerHTML = '';
  LOOKS.forEach(function (l, i) {
    const s = document.createElement('div');
    s.className = 'slide';
    s.style.background = l.bg;
    s.innerHTML = '<div class="big">' + l.emoji + '</div><h3>' + l.title + '</h3><p>' + l.caption + '</p>';
    slides.appendChild(s);
    const dot = document.createElement('span');
    if (i === 0) dot.className = 'on';
    dot.onclick = function () { goSlide(i); };
    dots.appendChild(dot);
    const g = document.createElement('div');
    g.className = 'gcard';
    g.style.background = l.bg;
    g.innerHTML = '<div class="big">' + l.emoji + '</div><div class="cap">' + l.title + '</div>';
    g.onclick = function () { goSlide(i); };
    grid.appendChild(g);
  });
  update();
}
function update() {
  document.getElementById('slides').style.transform = 'translateX(-' + idx * 100 + '%)';
  document.querySelectorAll('.car-dots span').forEach(function (d, i) { d.className = i === idx ? 'on' : ''; });
}
function moveSlide(step) { idx = (idx + step + LOOKS.length) % LOOKS.length; update(); resetAuto(); }
function goSlide(i) { idx = i; update(); resetAuto(); }
function resetAuto() {
  clearInterval(autoT);
  autoT = setInterval(function () { idx = (idx + 1) % LOOKS.length; update(); }, 5000);
}

build();
resetAuto();
