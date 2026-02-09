// API 配置
export const API_BASE = "/api";

// API 輔助函數
export async function apiGet(endpoint) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error(`GET ${endpoint} 失敗:`, error);
    throw error;
  }
}

export async function apiPost(endpoint, data) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    return res;
  } catch (error) {
    console.error(`POST ${endpoint} 失敗:`, error);
    throw error;
  }
}

export async function apiPut(endpoint, data) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    return res;
  } catch (error) {
    console.error(`PUT ${endpoint} 失敗:`, error);
    throw error;
  }
}

export async function apiDelete(endpoint) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    return res;
  } catch (error) {
    console.error(`DELETE ${endpoint} 失敗:`, error);
    throw error;
  }
}
