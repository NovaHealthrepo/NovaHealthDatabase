// 主應用程式入口
import { switchTab, openModal, closeModal } from "./modules/uiHelpers.js";
import {
  fetchUsers,
  renderUsers,
  openUserModal,
  editUser,
  saveUser,
  deleteUser,
} from "./modules/userModule.js";
import {
  fetchProfiles,
  renderProfiles,
  openProfileModal,
  editProfile,
  saveProfile,
  deleteProfile,
} from "./modules/profileModule.js";

// 將函數暴露到全域範圍，供 HTML onclick 事件使用
window.switchTab = switchTab;
window.renderUsers = renderUsers;
window.openUserModal = openUserModal;
window.editUser = editUser;
window.saveUser = saveUser;
window.deleteUser = deleteUser;
window.renderProfiles = renderProfiles;
window.openProfileModal = openProfileModal;
window.editProfile = editProfile;
window.saveProfile = saveProfile;
window.deleteProfile = deleteProfile;
window.fetchProfiles = fetchProfiles;
window.openModal = openModal;
window.closeModal = closeModal;

// 初始化應用程式
async function init() {
  try {
    await fetchUsers();
    await fetchProfiles();
  } catch (error) {
    console.error("應用程式初始化失敗:", error);
    // 即使初始化失敗，應用仍可繼續運行（部分功能可用）
  }
}

// 當 DOM 載入完成後初始化
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
