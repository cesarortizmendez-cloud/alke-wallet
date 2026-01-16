/**
 * app.js
 * - Conecta eventos por página usando data-page
 */

$(function () {
  const page = $("body").data("page");

  // Pages protegidas (todas excepto login/index)
  const protectedPages = ["menu", "deposit", "sendmoney", "transactions"];
  if (protectedPages.includes(page)) requireAuth();

  if (page === "login") initLogin();
  if (page === "menu") initMenu();
  if (page === "deposit") initDeposit();
  if (page === "sendmoney") initSendMoney();
  if (page === "transactions") initTransactions();
});

// -------- LOGIN ----------
function initLogin() {
  // Efecto simple jQuery
  $(".card").hide().fadeIn(350);

  $("#loginForm").on("submit", function (e) {
    e.preventDefault();

    const email = $("#email").val().trim();
    const pass = $("#password").val();

    if (!email || !pass) {
      toast("Completa email y contraseña", "warning");
      return;
    }

    if (login(email, pass)) {
      setSession(true);
      toast("Login exitoso ✅", "success");
      setTimeout(() => window.location.href = "menu.html", 600);
    } else {
      toast("Credenciales incorrectas", "danger");
    }
  });
}

// -------- MENU ----------
function initMenu() {
  // Animación/transición en menu (pedido)
  $(".card-hover").addClass("shadow-sm").hide().slideDown(250);

  renderBalance("#balanceValue");

  $("#btnLogout").on("click", function () {
    logout();
  });
}

// -------- DEPOSIT ----------
function initDeposit() {
  renderBalance("#balanceValue");

  $("#depositForm").on("submit", function (e) {
    e.preventDefault();
    const amount = Number($("#amount").val());
    const action = $("input[name='action']:checked").val();

    if (!amount || amount <= 0) {
      toast("Ingresa un monto válido", "warning");
      return;
    }

    if (action === "deposit") {
      deposit(amount);
      toast("Depósito realizado", "success");
    } else {
      const ok = withdraw(amount);
      if (!ok) {
        toast("Saldo insuficiente para retirar", "danger");
        return;
      }
      toast("Retiro realizado", "success");
    }

    // Actualización dinámica del saldo (pedido)
    renderBalance("#balanceValue");
    $("#amount").val("");
  });
}

// -------- SEND MONEY ----------
function initSendMoney() {
  renderBalance("#balanceValue");

  // Autocompletar simple (sin plugins) con jQuery
  $("#contactSearch").on("input", function () {
    const q = $(this).val();
    const results = findContacts(q);
    const $list = $("#suggestions");
    $list.empty();

    if (q.trim().length < 1) return;

    results.slice(0, 5).forEach(c => {
      const item = $(`<button type="button" class="list-group-item list-group-item-action">
        ${c.name} <span class="text-secondary">(${c.account})</span>
      </button>`);
      item.on("click", () => {
        $("#contactSelected").val(c.name);
        $("#contactSearch").val(`${c.name} (${c.account})`);
        $list.empty();
      });
      $list.append(item);
    });
  });

  // Agregar contacto (evento pedido)
  $("#newContactForm").on("submit", function (e) {
    e.preventDefault();
    const name = $("#cName").val().trim();
    const alias = $("#cAlias").val().trim();
    const account = $("#cAccount").val().trim();

    if (!name || !account) {
      toast("Nombre y cuenta son obligatorios", "warning");
      return;
    }

    addContact(name, alias || name, account);
    toast("Contacto agregado", "success");

    // Cierra modal
    const modal = bootstrap.Modal.getInstance(document.getElementById("newContactModal"));
    modal.hide();

    $("#cName, #cAlias, #cAccount").val("");
  });

  // Transferencia
  $("#sendForm").on("submit", function (e) {
    e.preventDefault();
    const to = $("#contactSelected").val().trim();
    const amount = Number($("#amount").val());

    if (!to) {
      toast("Selecciona un contacto", "warning");
      return;
    }
    if (!amount || amount <= 0) {
      toast("Ingresa un monto válido", "warning");
      return;
    }

    const ok = transfer(amount, to);
    if (!ok) {
      toast("Saldo insuficiente para transferir", "danger");
      return;
    }

    toast(`Transferencia enviada a ${to}`, "success");
    renderBalance("#balanceValue");
    $("#amount").val("");
  });
}

// -------- TRANSACTIONS ----------
function initTransactions() {
  renderBalance("#balanceValue");
  renderTransactions();
  $("#filterType").on("change", renderTransactions);
}

function renderBalance(selector) {
  const w = getWallet();
  $(selector).text(moneyCLP(w.balance));
}

function renderTransactions() {
  const w = getWallet();
  const filter = $("#filterType").val();
  const tx = (filter === "all")
    ? w.transactions
    : w.transactions.filter(t => t.type === filter);

  const $tbody = $("#txBody");
  $tbody.empty();

  tx.forEach(t => {
    const date = new Date(t.date).toLocaleString("es-CL");
    $tbody.append(`
      <tr>
        <td>${date}</td>
        <td>${t.type}</td>
        <td class="money">${moneyCLP(t.amount)}</td>
        <td>${t.detail}</td>
      </tr>
    `);
  });
}
