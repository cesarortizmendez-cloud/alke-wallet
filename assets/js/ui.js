/** ui.js - Helpers visuales */ // cabecera: funciones utilitarias para UI

function moneyCLP(value) { // formatea número a moneda CLP usando Intl API
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(value); // devuelve string formateado
}

function toast(message, type = "success") { // muestra un toast Bootstrap simple en pantalla
  // Toast simple con Bootstrap 5 // comentario: crea y muestra toast con clase según tipo
  const toastId = "awToast"; // id único para el toast temporal
  const existing = document.getElementById(toastId); // busca toast previo
  if (existing) existing.remove(); // si existe, lo elimina para reemplazar

  const html = `
  <div id="${toastId}" class="toast align-items-center text-bg-${type} border-0 position-fixed bottom-0 end-0 m-3" role="alert">
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>
  </div>`; // construye HTML del toast con mensaje y botón cerrar

  document.body.insertAdjacentHTML("beforeend", html); // inserta el toast en el body
  const t = new bootstrap.Toast(document.getElementById(toastId), { delay: 2200 }); // instancia el toast con delay
  t.show(); // muestra el toast
} // fin toast
