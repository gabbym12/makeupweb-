// GlamLab Studio - login/logout + page guard
// Users are stored in localStorage (fine for a class project; real apps use a server).

function getUsers() {
  try { return JSON.parse(localStorage.getItem('glamUsers')) || {}; } catch (e) { return {}; }
}
function saveUsers(u) { localStorage.setItem('glamUsers', JSON.stringify(u)); }

function currentUser() {
  try { return JSON.parse(localStorage.getItem('glamSession')) || null; } catch (e) { return null; }
}

function signup(username, password) {
  username = username.trim();
  if (username.length < 3) return { ok: false, msg: 'Username needs at least 3 characters.' };
  if (password.length < 4) return { ok: false, msg: 'Password needs at least 4 characters.' };
  const users = getUsers();
  if (users[username.toLowerCase()]) return { ok: false, msg: 'That username is already taken.' };
  users[username.toLowerCase()] = { username: username, password: password, created: new Date().toISOString() };
  saveUsers(users);
  return login(username, password);
}

function login(username, password) {
  const users = getUsers();
  const u = users[username.trim().toLowerCase()];
  if (!u || u.password !== password) return { ok: false, msg: 'Wrong username or password.' };
  localStorage.setItem('glamSession', JSON.stringify({ username: u.username }));
  return { ok: true };
}

function logout() {
  localStorage.removeItem('glamSession');
  window.location.href = 'login.html';
}

// Guard: redirects to the login page if not logged in.
function requireLogin() {
  if (!currentUser()) {
    window.location.replace('login.html?next=' + encodeURIComponent(location.pathname.split('/').pop()));
  }
}

// Nav user chip + logout link
function renderAuthNav() {
  const slot = document.getElementById('authSlot');
  if (!slot) return;
  const u = currentUser();
  if (u) {
    slot.innerHTML = '<span class="userchip">💖 <b>' + u.username + '</b></span> <a href="#" onclick="logout();return false">Log out</a>';
  } else {
    slot.innerHTML = '<a href="login.html">Log in</a>';
  }
}

document.addEventListener('DOMContentLoaded', renderAuthNav);
