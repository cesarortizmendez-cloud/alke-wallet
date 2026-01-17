/** data.js - Semilla de datos en localStorage (simula backend) */ // cabecera y propósito del archivo

const DB_KEYS = { // claves usadas en localStorage para separar datos
  USER: "aw_user", // clave para almacenar usuario demo
  SESSION: "aw_session", // clave para estado de sesión
  WALLET: "aw_wallet" // clave para el objeto wallet (saldo, contactos, tx)
};

function seedIfNeeded() { // inicializa datos demo si no existen en localStorage
  // Usuario asignado (credenciales demo) // asegura existencia de usuario demo
  if (!localStorage.getItem(DB_KEYS.USER)) { // si no hay usuario guardado
    const demoUser = { // objeto usuario de ejemplo
      email: "demo@alkewallet.com", // email demo
      password: "Alke1234", // password demo (nota: nunca almacenar en texto plano en produccion)
      name: "Usuario Demo" // nombre a mostrar
    };
    localStorage.setItem(DB_KEYS.USER, JSON.stringify(demoUser)); // guarda usuario como JSON
  }

  // Wallet (saldo, contactos, transacciones) // asegura existencia de wallet demo
  if (!localStorage.getItem(DB_KEYS.WALLET)) { // si no hay wallet en storage
    const demoWallet = { // objeto wallet de ejemplo
      balance: 250000, // saldo inicial en CLP
      contacts: [ // lista de contactos de ejemplo
        { name: "Ana", alias: "Ana P.", account: "111-222" },
        { name: "Bruno", alias: "Bruno R.", account: "333-444" },
        { name: "Carla", alias: "Carla M.", account: "555-666" }
      ],
      transactions: [ // transacciones iniciales
        { type: "deposit", amount: 250000, detail: "Saldo inicial", date: new Date().toISOString() } // registro inicial con fecha ISO
      ]
    };
    localStorage.setItem(DB_KEYS.WALLET, JSON.stringify(demoWallet)); // guarda wallet como JSON
  }
}

seedIfNeeded(); // ejecuta la semilla al cargar el script
