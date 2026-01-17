/** wallet.js - Operaciones de saldo, contactos y movimientos */ // cabecera: gestión de operaciones financieras

function getWallet() { // obtiene el objeto wallet de localStorage
  return JSON.parse(localStorage.getItem(DB_KEYS.WALLET)); // parsea y devuelve el wallet actual
}

function saveWallet(w) { // guarda el wallet actualizado en localStorage
  localStorage.setItem(DB_KEYS.WALLET, JSON.stringify(w)); // serializa y almacena
}

function addTransaction(type, amount, detail) { // añade un registro de transacción al historial
  const w = getWallet(); // obtiene wallet
  w.transactions.unshift({ // inserta al inicio del array (más reciente primero)
    type, // tipo: deposit, withdraw, transfer, contact
    amount, // monto involucrado
    detail, // descripción del movimiento
    date: new Date().toISOString() // timestamp ISO actual
  });
  saveWallet(w); // persiste cambios
}

function deposit(amount) { // suma dinero al saldo
  const w = getWallet(); // obtiene wallet
  w.balance += amount; // suma el monto
  saveWallet(w); // guarda cambios
  addTransaction("deposit", amount, "Depósito realizado"); // registra la operación
}

function withdraw(amount) { // resta dinero del saldo si hay fondos
  const w = getWallet(); // obtiene wallet
  if (amount > w.balance) return false; // valida saldo suficiente
  w.balance -= amount; // resta el monto
  saveWallet(w); // guarda cambios
  addTransaction("withdraw", amount, "Retiro realizado"); // registra la operación
  return true; // indica éxito
}

function transfer(amount, contactName) { // transfiere dinero a un contacto
  const w = getWallet(); // obtiene wallet
  if (amount > w.balance) return false; // valida saldo
  w.balance -= amount; // resta del saldo
  saveWallet(w); // guarda cambios
  addTransaction("transfer", amount, `Transferencia a ${contactName}`); // registra con nombre contacto
  return true; // indica éxito
}

function addContact(name, alias, account) { // añade un nuevo contacto al registro
  const w = getWallet(); // obtiene wallet
  w.contacts.push({ name, alias, account }); // agrega contacto al array
  saveWallet(w); // persiste cambios
  addTransaction("contact", 0, `Contacto agregado: ${name}`); // registra la acción
}

function findContacts(query) { // busca contactos por nombre, alias o cuenta
  const w = getWallet(); // obtiene wallet
  const q = query.toLowerCase().trim(); // normaliza la consulta (minúscula, sin espacios)
  return w.contacts.filter(c => // filtra contactos
    c.name.toLowerCase().includes(q) || // coincide nombre
    c.alias.toLowerCase().includes(q) || // coincide alias
    c.account.toLowerCase().includes(q) // coincide número de cuenta
  );
} // devuelve array de contactos coincidentes
