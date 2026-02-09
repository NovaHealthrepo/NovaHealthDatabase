import { apiGet, apiPost, apiPut, apiDelete } from "./api.js";
import { openModal, closeModal, fmtDate } from "./uiHelpers.js";

// 用戶數據狀態
let usersData = [];

// ==================== USERS ====================
export async function fetchUsers() {
  try {
    usersData = await apiGet("/users");
    renderUsers();
    return usersData;
  } catch (error) {
    console.error("載入用戶資料失敗:", error);
    alert("載入用戶資料失敗，請檢查網路連線或重新整理頁面");
    usersData = [];
    renderUsers();
    return [];
  }
}

export function getUsersData() {
  return usersData;
}

export function renderUsers() {
  const q = document.getElementById("searchUser").value.toLowerCase();
  const filtered = usersData.filter((u) => u.name.toLowerCase().includes(q));
  const grid = document.getElementById("userGridTable");
  // keep the header, replace everything after it
  const header = grid.querySelector(".gt-header").outerHTML;
  if (filtered.length === 0) {
    grid.innerHTML = header + `<span class="gt-empty">沒有找到用戶</span>`;
    return;
  }
  grid.innerHTML =
    header +
    filtered
      .map(
        (u) => `
    <div class="gt-row">
      <span>${u.userID}</span>
      <span>${u.name}</span>
      <span>${u.profile ? "✅" : "❌"}</span>
      <span>${fmtDate(u.createdAt)}</span>
      <span class="gt-actions">
        <button class="btn btn-success btn-sm" onclick="window.editUser(${u.userID})">編輯</button>
        <button class="btn btn-danger btn-sm" onclick="window.deleteUser(${u.userID})">刪除</button>
      </span>
    </div>
  `,
      )
      .join("");
}

export function openUserModal(user = null) {
  document.getElementById("userEditId").value = user ? user.userID : "";
  document.getElementById("userName").value = user ? user.name : "";
  document.getElementById("userModalTitle").textContent = user
    ? "編輯用戶"
    : "新增用戶";
  openModal("userModal");
}

export function editUser(id) {
  const u = usersData.find((x) => x.userID === id);
  if (u) openUserModal(u);
}

export async function saveUser() {
  const id = document.getElementById("userEditId").value;
  const name = document.getElementById("userName").value.trim();
  if (!name) return alert("請輸入姓名");

  try {
    if (id) {
      await apiPut(`/users/${id}`, { name });
    } else {
      await apiPost("/users", { name });
    }
    closeModal("userModal");
    await fetchUsers();
    // 通知 profileModule 更新
    if (window.fetchProfiles) {
      await window.fetchProfiles();
    }
  } catch (error) {
    console.error("儲存用戶失敗:", error);
    alert("儲存用戶失敗，請稍後再試");
  }
}

export async function deleteUser(id) {
  if (!confirm(`確定刪除用戶 #${id}？（檔案也會一併刪除）`)) return;
  try {
    await apiDelete(`/users/${id}`);
    await fetchUsers();
    // 通知 profileModule 更新
    if (window.fetchProfiles) {
      await window.fetchProfiles();
    }
  } catch (error) {
    console.error("刪除用戶失敗:", error);
    alert("刪除用戶失敗，請稍後再試");
  }
}
