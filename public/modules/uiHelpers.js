// ─── Tab switching ───
export function switchTab(tab) {
  document.querySelectorAll(".tabs button").forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === tab);
  });
  document.querySelectorAll(".panel").forEach((panel) => {
    panel.classList.toggle("active", panel.id === `panel-${tab}`);
  });
}

// ─── Modal helpers ───
export function openModal(id) {
  document.getElementById(id).classList.add("show");
}

export function closeModal(id) {
  document.getElementById(id).classList.remove("show");
}

// ─── Formatters ───
export function fmtDate(d) {
  return d ? new Date(d).toLocaleDateString("zh-HK") : "-";
}

export function fmtDateInput(d) {
  return d ? new Date(d).toISOString().slice(0, 10) : "";
}
