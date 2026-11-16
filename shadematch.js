// GlamLab Studio - Shade Match game
// A target color is shown; pick the identical swatch. Distractors get closer each round.

const TOTAL_ROUNDS = 10;
let round = 1, score = 0, streak = 0, locked = false, current = null;

function rand(min, max) { return min + Math.random() * (max - min); }
function hsl(c) { return 'hsl(' + Math.round(c.h) + ',' + Math.round(c.s) + '%,' + Math.round(c.l) + '%)'; }

function makeRound() {
  const base = { h: rand(0, 360), s: rand(45, 85), l: rand(35, 70) };
  // Difficulty: delta shrinks as rounds progress (from 30 down to 6)
  const delta = Math.max(6, 30 - (round - 1) * 2.7);
  const nOpts = round <= 3 ? 3 : round <= 7 ? 4 : 5;
  const opts = [{ h: base.h, s: base.s, l: base.l, correct: true }];
  let guard = 0;
  while (opts.length < nOpts && guard < 200) {
    guard++;
    const o = {
      h: (base.h + (Math.random() < .5 ? 1 : -1) * delta * rand(.6, 1.4) + 360) % 360,
      s: Math.min(95, Math.max(20, base.s + (Math.random() < .5 ? 1 : -1) * delta * rand(.4, 1))),
      l: Math.min(85, Math.max(20, base.l + (Math.random() < .5 ? 1 : -1) * delta * rand(.3, .9))),
      correct: false,
    };
    opts.push(o);
  }
  for (let i = opts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [opts[i], opts[j]] = [opts[j], opts[i]];
  }
  return { base: base, opts: opts };
}

function newRound() {
  if (round > TOTAL_ROUNDS) { endGame(); return; }
  locked = false;
  current = makeRound();
  document.getElementById('round').textContent = round;
  document.getElementById('score').textContent = score;
  document.getElementById('streak').textContent = streak;
  document.getElementById('feedback').textContent = '';
  document.getElementById('target').style.background = hsl(current.base);
  const holder = document.getElementById('opts');
  holder.innerHTML = '';
  current.opts.forEach(function (o) {
    const d = document.createElement('div');
    d.className = 'swatch';
    d.style.background = hsl(o);
    d.onclick = function () { pick(d, o); };
    holder.appendChild(d);
  });
}

function pick(el, o) {
  if (locked) return;
  locked = true;
  const fb = document.getElementById('feedback');
  if (o.correct) {
    el.classList.add('right');
    streak++;
    const pts = 10 + streak * 2 + round;
    score += pts;
    fb.textContent = '✅ Perfect match! +' + pts + ' points';
    fb.style.color = '#4ade80';
  } else {
    el.classList.add('wrong');
    streak = 0;
    document.querySelectorAll('#opts .swatch').forEach(function (s, i) { if (current.opts[i].correct) s.classList.add('right'); });
    fb.textContent = '❌ Not quite. The matching shade is outlined in green.';
    fb.style.color = '#f87171';
  }
  document.getElementById('score').textContent = score;
  document.getElementById('streak').textContent = streak;
  setTimeout(function () { round++; round > TOTAL_ROUNDS ? endGame() : newRound(); }, 1200);
}

function endGame() {
  const best = getBest();
  const isBest = score > best;
  if (isBest) localStorage.setItem('glamShadeBest', String(score));
  document.getElementById('overlayHolder').innerHTML =
    '<div class="overlay"><div class="ocard"><h2>🏁 Game Over</h2>'
    + '<p>You scored <b style="color:var(--gold)">' + score + '</b> points over ' + TOTAL_ROUNDS + ' rounds.</p>'
    + '<p>' + (isBest ? '🎉 New personal best!' : 'Personal best: ' + Math.max(best, score)) + '</p>'
    + '<button onclick="restart()">Play Again</button></div></div>';
}
function getBest() { try { return parseInt(localStorage.getItem('glamShadeBest')) || 0; } catch (e) { return 0; } }
function restart() {
  document.getElementById('overlayHolder').innerHTML = '';
  round = 1; score = 0; streak = 0; newRound();
}

newRound();
