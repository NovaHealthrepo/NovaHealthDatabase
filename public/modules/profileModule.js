import { apiGet, apiPost, apiPut, apiDelete } from "./api.js";
import { openModal, closeModal, fmtDate, fmtDateInput } from "./uiHelpers.js";
import { getUsersData } from "./userModule.js";

// 檔案數據狀態
let profilesData = [];

// ==================== PROFILES ====================
export async function fetchProfiles() {
  try {
    profilesData = await apiGet("/profiles");
    renderProfiles();
    return profilesData;
  } catch (error) {
    console.error("載入用戶檔案失敗:", error);
    alert("載入用戶檔案失敗，請檢查網路連線或重新整理頁面");
    profilesData = [];
    renderProfiles();
    return [];
  }
}

export function getProfilesData() {
  return profilesData;
}

export function renderProfiles() {
  const q = document.getElementById("searchProfile").value.toLowerCase();
  const filtered = profilesData.filter(
    (p) =>
      (p.user?.name || "").toLowerCase().includes(q) ||
      p.phone.includes(q) ||
      p.address.toLowerCase().includes(q),
  );
  const tbody = document.getElementById("profileTableBody");
  tbody.innerHTML = filtered
    .map(
      (p) => `
    <tr>
      <td>${p.userID}</td>
      <td>${p.user?.name || "-"}</td>
      <td>${p.phone}</td>
      <td>${p.address}</td>
      <td>${p.contactPerson}</td>
      <td>${p.gender === "M" ? "男" : "女"}</td>
      <td>${fmtDate(p.birth)}</td>
      <td>${p.IDcard}</td>
      <td><span class="${p.isActive ? "badge-active" : "badge-inactive"}">${p.isActive ? "活躍" : "停用"}</span></td>
      <td>
        <button class="btn btn-success btn-sm" onclick="window.editProfile(${p.userID})">編輯</button>
        <button class="btn btn-danger btn-sm" onclick="window.deleteProfile(${p.userID})">刪除</button>
      </td>
    </tr>
  `,
    )
    .join("");
}

function populateProfileUserSelect(selectedId = null) {
  const sel = document.getElementById("profileUserID");
  const usersData = getUsersData();
  // Only show users that don't already have a profile (or the one being edited)
  const usedIds = profilesData.map((p) => p.userID);
  const available = usersData.filter(
    (u) => !usedIds.includes(u.userID) || u.userID === selectedId,
  );
  sel.innerHTML = available
    .map(
      (u) =>
        `<option value="${u.userID}" ${u.userID === selectedId ? "selected" : ""}>${u.userID} - ${u.name}</option>`,
    )
    .join("");
}

export function openProfileModal(profile = null) {
  const isEdit = !!profile;
  document.getElementById("profileModalTitle").textContent = isEdit
    ? "編輯用戶檔案"
    : "新增用戶檔案";
  document.getElementById("profileEditId").value = isEdit ? profile.userID : "";

  populateProfileUserSelect(isEdit ? profile.userID : null);
  const sel = document.getElementById("profileUserID");
  sel.disabled = isEdit;

  document.getElementById("profilePhone").value = isEdit ? profile.phone : "";
  document.getElementById("profileEmail").value = isEdit
    ? profile.email || ""
    : "";
  document.getElementById("profileAddress").value = isEdit
    ? profile.address
    : "";
  document.getElementById("profileContact").value = isEdit
    ? profile.contactPerson
    : "";
  document.getElementById("profileSecondPhone").value = isEdit
    ? profile.secondPhone
    : "";
  document.getElementById("profileSecondContact").value = isEdit
    ? profile.secondContactPerson
    : "";
  document.getElementById("profileGender").value = isEdit
    ? profile.gender
    : "M";
  document.getElementById("profileBirth").value = isEdit
    ? fmtDateInput(profile.birth)
    : "";
  document.getElementById("profileIDcard").value = isEdit ? profile.IDcard : "";
  document.getElementById("profileIsActive").value = isEdit
    ? String(profile.isActive)
    : "true";

  openModal("profileModal");
}

export function editProfile(userID) {
  const p = profilesData.find((x) => x.userID === userID);
  if (p) openProfileModal(p);
}

export async function saveProfile() {
  const editId = document.getElementById("profileEditId").value;
  const body = {
    userID: document.getElementById("profileUserID").value,
    phone: document.getElementById("profilePhone").value.trim(),
    email: document.getElementById("profileEmail").value.trim() || undefined,
    address: document.getElementById("profileAddress").value.trim(),
    contactPerson:
      document.getElementById("profileContact").value.trim() || undefined,
    secondPhone:
      document.getElementById("profileSecondPhone").value.trim() || undefined,
    secondContactPerson:
      document.getElementById("profileSecondContact").value.trim() || undefined,
    gender: document.getElementById("profileGender").value,
    birth: document.getElementById("profileBirth").value,
    IDcard: document.getElementById("profileIDcard").value.trim() || undefined,
    isActive: document.getElementById("profileIsActive").value === "true",
  };

  if (!body.phone || !body.address || !body.birth)
    return alert("請填寫必填欄位（電話、地址、出生日期）");

  try {
    if (editId) {
      await apiPut(`/profiles/${editId}`, body);
    } else {
      await apiPost("/profiles", body);
    }
    closeModal("profileModal");
    await fetchProfiles();
  } catch (error) {
    console.error("儲存用戶檔案失敗:", error);
    alert("儲存用戶檔案失敗，請稍後再試");
  }
}

export async function deleteProfile(userID) {
  if (!confirm(`確定刪除用戶 #${userID} 的檔案？`)) return;
  try {
    await apiDelete(`/profiles/${userID}`);
    await fetchProfiles();
  } catch (error) {
    console.error("刪除用戶檔案失敗:", error);
    alert("刪除用戶檔案失敗，請稍後再試");
  }
}
