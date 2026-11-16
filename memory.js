// GlamLab Studio - Match the Shade (memory card game)
// 3 rounds, each harder: more pairs and a faster flip-back.

const ROUNDS = [
  { pairs: 8,  flipBack: 800, cols: '',      faces: ['💄', '💋', '👁️', '🧴', '🌸', '🎨', '🖌️', '✨'] },
  { pairs: 10, flipBack: 550, cols: 'cols5',  faces: ['💄', '💋', '👁️', '🧴', '🌸', '🎨', '🖌️', '✨', '💅', '🪞'] },
  { pairs: 12, flipBack: 350, cols: 'cols6',  faces: ['💄', '💋', '👁️', '🧴', '🌸', '🎨', '🖌️', '✨', '💅', '🪞', '👄', '🧖'] },
];
let memRound = 0, cfg = ROUNDS[0];
let deck = [], first = null, second = null, lock = false, moves = 0, pairs = 0, seconds = 0, timerId = null;

function newGame() {
  document.getElementById('overlayHolder').innerHTML = '';
  memRound = 0;
  moves = 0; seconds = 0;
  document.getElementById('moves').textContent = '0';
  document.getElementById('timer').textContent = '0s';
  clearInterval(timerId);
  timerId = setInterval(function () { seconds++; document.getElementById('timer').textContent = seconds + 's'; }, 1000);
  startRound();
}
function startRound() {
  cfg = ROUNDS[memRound];
  pairs = 0; first = null; second = null; lock = false;
  document.getElementById('overlayHolder').innerHTML = '';
  document.getElementById('roundBadge').textContent = 'Round ' + (memRound + 1) + ' of 3';
  document.getElementById('pairs').textContent = '0/' + cfg.pairs;
  const grid = document.getElementById('memgrid');
  grid.className = 'memgrid ' + cfg.cols;
  deck = cfg.faces.concat(cfg.faces);
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  grid.innerHTML = '';
  deck.forEach(function (face) {
    const card = document.createElement('div');
    card.className = 'mcard';
    card.innerHTML = '<div class="mcard-inner"><div class="mface mback">💫</div><div class="mface mfront">' + face + '</div></div>';
    card.onclick = function () { flip(card, face); };
    grid.appendChild(card);
  });
}
function flip(card, face) {
  if (lock || card.classList.contains('flipped') || card.classList.contains('matched')) return;
  card.classList.add('flipped');
  if (!first) { first = { card: card, face: face }; return; }
  second = { card: card, face: face };
  moves++;
  document.getElementById('moves').textContent = moves;
  if (first.face === second.face) {
    first.card.classList.add('matched');
    second.card.classList.add('matched');
    first = null; second = null;
    pairs++;
    document.getElementById('pairs').textContent = pairs + '/' + cfg.pairs;
    if (pairs === cfg.pairs) roundComplete();
  } else {
    // wrong: both cards flip back over (faster each round!)
    lock = true;
    setTimeout(function () {
      first.card.classList.remove('flipped');
      second.card.classList.remove('flipped');
      first = null; second = null; lock = false;
    }, cfg.flipBack);
  }
}
function roundComplete() {
  if (memRound < ROUNDS.length - 1) {
    document.getElementById('overlayHolder').innerHTML =
      '<div class="overlay"><div class="ocard"><h2>✨ Round ' + (memRound + 1) + ' Complete!</h2>'
      + '<p>' + cfg.pairs + ' pairs found in ' + seconds + ' seconds. Total moves so far: <b style="color:var(--gold)">' + moves + '</b>.</p>'
      + '<p>Next round: more cards and a faster flip-back. Ready?</p>'
      + '<button onclick="nextMemRound()">Round ' + (memRound + 2) + ' →</button></div></div>';
  } else {
    clearInterval(timerId);
    document.getElementById('overlayHolder').innerHTML =
      '<div class="overlay"><div class="ocard"><h2>🏆 All 3 Rounds Complete!</h2>'
      + '<p>You matched every pair in <b style="color:var(--gold)">' + moves + '</b> moves and ' + seconds + ' seconds.</p>'
      + '<button onclick="newGame()">Play Again</button></div></div>';
  }
}
function nextMemRound() { memRound++; startRound(); }

newGame();
