/** app.js - Conecta eventos por página usando data-page */ // comentario: cabecera y propósito del archivo

$(function () { // Ejecuta cuando el DOM está listo
  const page = $("body").data("page"); // Lee el atributo data-page del body

  // Pages protegidas (todas excepto login/index) // define páginas que requieren auth, donde auth   
  const protectedPages = ["menu", "deposit", "sendmoney", "transactions"]; // array de páginas protegidas
  if (protectedPages.includes(page)) requireAuth(); // si la página está protegida, verifica sesión

  if (page === "login") initLogin(); // inicializa lógica de login
  if (page === "menu") initMenu(); // inicializa lógica de menú
  if (page === "deposit") initDeposit(); // inicializa lógica de depósitos
  if (page === "sendmoney") initSendMoney(); // inicializa lógica de envío de dinero
  if (page === "transactions") initTransactions(); // inicializa lógica de transacciones
}); // fin ready

// -------- LOGIN ---------- // sección login
function initLogin() { // función de inicialización del login
  // Efecto simple jQuery // animación inicial de la tarjeta
  $(".card").hide().fadeIn(350); // oculta y muestra con fade

  $("#loginForm").on("submit", function (e) { // listener submit del form
    e.preventDefault(); // previene envío por defecto

    const email = $("#email").val().trim(); // obtiene y limpia email
    const pass = $("#password").val(); // obtiene contraseña

    if (!email || !pass) { // valida que existan ambos campos
      toast("Completa email y contraseña", "warning"); // muestra aviso
      return; // sale de la función
    }

    if (login(email, pass)) { // intenta login con credenciales
      setSession(true); // guarda sesión
      toast("Login exitoso ", "success"); // notifica éxito
      setTimeout(() => window.location.href = "menu.html", 600); // redirige tras breve delay
    } else {
      toast("Credenciales incorrectas", "danger"); // notifica fallo
    }
  }); // fin submit
} // fin initLogin

// -------- MENU ---------- // sección menu
function initMenu() { // inicializador del menú
  // Animación/transición en menu (pedido) // agrega sombra y efecto slide
  $(".card-hover").addClass("shadow-sm").hide().slideDown(250); // aplica clases y muestra

  renderBalance("#balanceValue"); // renderiza el saldo en el selector

  $("#btnLogout").on("click", function () { // botón logout
    logout(); // ejecuta logout
  });
} // fin initMenu

// -------- DEPOSIT ---------- // sección depósitos/retiros
function initDeposit() { // inicializador depósito
  renderBalance("#balanceValue"); // muestra saldo actual

  $("#depositForm").on("submit", function (e) { // submit del form de depósito
    e.preventDefault(); // previene comportamiento por defecto
    const amount = Number($("#amount").val()); // obtiene monto como número
    const action = $("input[name='action']:checked").val(); // obtiene acción seleccionada

    if (!amount || amount <= 0) { // valida monto
      toast("Ingresa un monto válido", "warning"); // advierte monto inválido
      return; // sale
    }

    if (action === "deposit") { // si es depósito
      deposit(amount); // procesa depósito
      toast("Depósito realizado", "success"); // notifica éxito
    } else { // si es retiro
      const ok = withdraw(amount); // intenta retirar
      if (!ok) { // si no alcanza saldo
        toast("Saldo insuficiente para retirar", "danger"); // notifica error
        return; // sale
      }
      toast("Retiro realizado", "success"); // notifica retiro
    }

    // Actualización dinámica del saldo (pedido) // actualiza vista del saldo
    renderBalance("#balanceValue"); // refresca saldo
    $("#amount").val(""); // limpia campo monto
  }); // fin submit depositForm
} // fin initDeposit

// -------- SEND MONEY ---------- // sección enviar dinero
function initSendMoney() { // inicializador enviar dinero
  renderBalance("#balanceValue"); // muestra saldo

  // Autocompletar simple (sin plugins) con jQuery // escucha input para sugerencias
  $("#contactSearch").on("input", function () { // evento input
    const q = $(this).val(); // consulta actual
    const results = findContacts(q); // busca contactos que coincidan
    const $list = $("#suggestions"); // contenedor de sugerencias
    $list.empty(); // limpia sugerencias previas

    if (q.trim().length < 1) return; // si consulta vacía, no buscar

    results.slice(0, 5).forEach(c => { // itera hasta 5 resultados
      const item = $(`<button type="button" class="list-group-item list-group-item-action">
        ${c.name} <span class="text-secondary">(${c.account})</span>
      </button>`); // crea elemento de lista (HTML string)
      item.on("click", () => { // al hacer click en sugerencia
        $("#contactSelected").val(c.name); // guarda contacto seleccionado
        $("#contactSearch").val(`${c.name} (${c.account})`); // muestra texto en input
        $list.empty(); // limpia sugerencias
      }); // fin click
      $list.append(item); // añade ítem a la lista
    }); // fin forEach
  }); // fin evento input

  // Agregar contacto (evento pedido) // listener para crear nuevo contacto
  $("#newContactForm").on("submit", function (e) { // submit nuevo contacto
    e.preventDefault(); // previene envío
    const name = $("#cName").val().trim(); // nombre
    const alias = $("#cAlias").val().trim(); // alias opcional
    const account = $("#cAccount").val().trim(); // cuenta

    if (!name || !account) { // valida campos obligatorios
      toast("Nombre y cuenta son obligatorios", "warning"); // muestra aviso
      return; // sale
    }

    addContact(name, alias || name, account); // agrega contacto al storage
    toast("Contacto agregado", "success"); // notifica éxito

    // Cierra modal // obtiene instancia del modal y lo oculta
    const modal = bootstrap.Modal.getInstance(document.getElementById("newContactModal"));
    modal.hide(); // oculta modal

    $("#cName, #cAlias, #cAccount").val(""); // limpia campos del modal
  }); // fin newContactForm submit

  // Transferencia // listener del form de envío
  $("#sendForm").on("submit", function (e) { // submit enviar dinero
    e.preventDefault(); // previene envío por defecto
    const to = $("#contactSelected").val().trim(); // contacto destino
    const amount = Number($("#amount").val()); // monto a transferir

    if (!to) { // valida contacto seleccionado
      toast("Selecciona un contacto", "warning"); // advierte
      return; // sale
    }
    if (!amount || amount <= 0) { // valida monto
      toast("Ingresa un monto válido", "warning"); // advierte monto inválido
      return; // sale
    }

    const ok = transfer(amount, to); // intenta transferir
    if (!ok) { // si no hay saldo suficiente
      toast("Saldo insuficiente para transferir", "danger"); // notifica
      return; // sale
    }

    toast(`Transferencia enviada a ${to}`, "success"); // notifica éxito con template literal
    renderBalance("#balanceValue"); // actualiza saldo en pantalla
    $("#amount").val(""); // limpia campo monto
  }); // fin sendForm submit
} // fin initSendMoney

// -------- TRANSACTIONS ---------- // sección movimientos
function initTransactions() { // inicializador transacciones
  renderBalance("#balanceValue"); // muestra saldo
  renderTransactions(); // dibuja lista de transacciones
  $("#filterType").on("change", renderTransactions); // re-renderiza al cambiar filtro
} // fin initTransactions

function renderBalance(selector) { // actualiza el texto de saldo en el selector dado
  const w = getWallet(); // obtiene wallet desde data.js
  $(selector).text(moneyCLP(w.balance)); // formatea y escribe monto en CLP
} // fin renderBalance

function renderTransactions() { // renderiza las transacciones en la tabla
  const w = getWallet(); // obtiene wallet
  const filter = $("#filterType").val(); // lee valor del filtro
  const tx = (filter === "all") // selecciona transacciones según filtro
    ? w.transactions // todas
    : w.transactions.filter(t => t.type === filter); // filtradas por tipo

  const $tbody = $("#txBody"); // cuerpo de la tabla donde insertar filas
  $tbody.empty(); // limpia contenido previo

  tx.forEach(t => { // itera transacciones
    const date = new Date(t.date).toLocaleString("es-CL"); // formatea fecha
    $tbody.append(`
      <tr>
        <td>${date}</td>
        <td>${t.type}</td>
        <td class="money">${moneyCLP(t.amount)}</td>
        <td>${t.detail}</td>
      </tr>
    `); // añade fila a la tabla (HTML string)
  }); // fin forEach
} // fin renderTransactions
