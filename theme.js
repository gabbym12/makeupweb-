// GlamLab Studio - Dark/Light Mode toggle
function applyTheme() {
  const t = localStorage.getItem('glamTheme') || 'dark';
  document.body.classList.toggle('light', t === 'light');
  const b = document.getElementById('themeBtn');
  if (b) b.textContent = t === 'light' ? '☀️' : '🌙';
}
function toggleTheme() {
  const t = localStorage.getItem('glamTheme') === 'light' ? 'dark' : 'light';
  localStorage.setItem('glamTheme', t);
  applyTheme();
}
document.addEventListener('DOMContentLoaded', applyTheme);
