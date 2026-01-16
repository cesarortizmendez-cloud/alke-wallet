/**
 * auth.js
 * - Login demo + guard
 */

function getUser() {
  return JSON.parse(localStorage.getItem(DB_KEYS.USER));
}

function setSession(active) {
  localStorage.setItem(DB_KEYS.SESSION, JSON.stringify({ active, ts: Date.now() }));
}

function isLoggedIn() {
  const s = localStorage.getItem(DB_KEYS.SESSION);
  if (!s) return false;
  try {
    return JSON.parse(s).active === true;
  } catch {
    return false;
  }
}

function logout() {
  setSession(false);
  window.location.href = "../pages/login.html";
}

function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = "../pages/login.html";
  }
}

function login(email, password) {
  const u = getUser();
  return u.email === email && u.password === password;
}
