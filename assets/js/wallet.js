/**
 * wallet.js
 * - Operaciones de saldo, contactos y movimientos
 */

function getWallet() {
  return JSON.parse(localStorage.getItem(DB_KEYS.WALLET));
}

function saveWallet(w) {
  localStorage.setItem(DB_KEYS.WALLET, JSON.stringify(w));
}

function addTransaction(type, amount, detail) {
  const w = getWallet();
  w.transactions.unshift({
    type,
    amount,
    detail,
    date: new Date().toISOString()
  });
  saveWallet(w);
}

function deposit(amount) {
  const w = getWallet();
  w.balance += amount;
  saveWallet(w);
  addTransaction("deposit", amount, "Depósito realizado");
}

function withdraw(amount) {
  const w = getWallet();
  if (amount > w.balance) return false;
  w.balance -= amount;
  saveWallet(w);
  addTransaction("withdraw", amount, "Retiro realizado");
  return true;
}

function transfer(amount, contactName) {
  const w = getWallet();
  if (amount > w.balance) return false;
  w.balance -= amount;
  saveWallet(w);
  addTransaction("transfer", amount, `Transferencia a ${contactName}`);
  return true;
}

function addContact(name, alias, account) {
  const w = getWallet();
  w.contacts.push({ name, alias, account });
  saveWallet(w);
  addTransaction("contact", 0, `Contacto agregado: ${name}`);
}

function findContacts(query) {
  const w = getWallet();
  const q = query.toLowerCase().trim();
  return w.contacts.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.alias.toLowerCase().includes(q) ||
    c.account.toLowerCase().includes(q)
  );
}
