/**
 * data.js
 * - Semilla de datos en localStorage (simula backend)
 */

const DB_KEYS = {
  USER: "aw_user",
  SESSION: "aw_session",
  WALLET: "aw_wallet"
};

function seedIfNeeded() {
  // Usuario asignado (credenciales demo)
  if (!localStorage.getItem(DB_KEYS.USER)) {
    const demoUser = {
      email: "demo@alkewallet.com",
      password: "Alke1234", // demo (en real NUNCA se guarda así)
      name: "Usuario Demo"
    };
    localStorage.setItem(DB_KEYS.USER, JSON.stringify(demoUser));
  }

  // Wallet (saldo, contactos, transacciones)
  if (!localStorage.getItem(DB_KEYS.WALLET)) {
    const demoWallet = {
      balance: 250000,
      contacts: [
        { name: "Ana", alias: "Ana P.", account: "111-222" },
        { name: "Bruno", alias: "Bruno R.", account: "333-444" },
        { name: "Carla", alias: "Carla M.", account: "555-666" }
      ],
      transactions: [
        { type: "deposit", amount: 250000, detail: "Saldo inicial", date: new Date().toISOString() }
      ]
    };
    localStorage.setItem(DB_KEYS.WALLET, JSON.stringify(demoWallet));
  }
}

seedIfNeeded();
