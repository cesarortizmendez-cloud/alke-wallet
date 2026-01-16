/**
 * ui.js
 * - Helpers visuales
 */

function moneyCLP(value) {
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(value);
}

function toast(message, type = "success") {
  // Toast simple con Bootstrap 5
  const toastId = "awToast";
  const existing = document.getElementById(toastId);
  if (existing) existing.remove();

  const html = `
  <div id="${toastId}" class="toast align-items-center text-bg-${type} border-0 position-fixed bottom-0 end-0 m-3" role="alert">
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>
  </div>`;

  document.body.insertAdjacentHTML("beforeend", html);
  const t = new bootstrap.Toast(document.getElementById(toastId), { delay: 2200 });
  t.show();
}
