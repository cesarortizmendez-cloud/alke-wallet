/** auth.js - Login demo + guard */ // archivo que gestiona autenticación básica y protección de rutas

function getUser() { // obtiene el objeto de usuario desde localStorage usando la clave definida en DB_KEYS
  return JSON.parse(localStorage.getItem(DB_KEYS.USER)); // parsea el JSON almacenado y lo retorna (puede ser null)
}

function setSession(active) { // guarda el estado de sesión en localStorage (activa/desactiva)
  localStorage.setItem(DB_KEYS.SESSION, JSON.stringify({ active, ts: Date.now() })); // almacena objeto con flag y timestamp
}

function isLoggedIn() { // comprueba si existe una sesión activa
  const s = localStorage.getItem(DB_KEYS.SESSION); // lee la clave de sesión
  if (!s) return false; // si no existe, no hay sesión
  try {
    return JSON.parse(s).active === true; // intenta parsear y devolver booleano
  } catch { // si el JSON está corrupto
    return false; // considera no autenticado
  }
}

function logout() { // cierra la sesión del usuario
  setSession(false); // marca sesión como inactiva
  window.location.href = "../pages/login.html"; // redirige a la página de login
}

function requireAuth() { // protección para páginas privadas; llama a login si no hay sesión
  if (!isLoggedIn()) { // si no está logueado
    window.location.href = "../pages/login.html"; // redirige a login
  }
}

function login(email, password) { // función que verifica credenciales (demo)
  const u = getUser(); // obtiene el usuario guardado (struct con email y password)
  return u.email === email && u.password === password; // compara credenciales y retorna true/false
}
