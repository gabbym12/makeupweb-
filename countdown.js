// GlamLab Studio - Countdown Timer to the Winter Glam Launch
const LAUNCH = new Date('2026-12-01T09:00:00');

function updateCountdown() {
  const el = document.getElementById('countdown');
  if (!el) return;
  const diff = LAUNCH - new Date();
  if (diff <= 0) {
    el.innerHTML = '<div class="cd-box"><div class="v">🎉</div><div class="l">It is here!</div></div>';
    return;
  }
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor(diff / 3600000) % 24;
  const mins = Math.floor(diff / 60000) % 60;
  const secs = Math.floor(diff / 1000) % 60;
  el.innerHTML =
    '<div class="cd-box"><div class="v">' + days + '</div><div class="l">Days</div></div>'
    + '<div class="cd-box"><div class="v">' + hours + '</div><div class="l">Hours</div></div>'
    + '<div class="cd-box"><div class="v">' + mins + '</div><div class="l">Minutes</div></div>'
    + '<div class="cd-box"><div class="v">' + secs + '</div><div class="l">Seconds</div></div>';
}
updateCountdown();
setInterval(updateCountdown, 1000);
