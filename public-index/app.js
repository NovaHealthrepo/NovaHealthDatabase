// ─── Config ───
const API = "/api";

// ─── State ───
let allRecords = [];
let usersCache = [];
let staffCache = [];

// ─── DOM refs ───
const tableBody     = document.getElementById("tableBody");
const searchInput   = document.getElementById("searchInput");
const btnAdd        = document.getElementById("btnAdd");
const modalOverlay  = document.getElementById("modalOverlay");
const modalTitle    = document.getElementById("modalTitle");
const indexForm     = document.getElementById("indexForm");
const editIdInput   = document.getElementById("editId");
const btnCancel     = document.getElementById("btnCancel");
const detailCard    = document.getElementById("detailCard");
const detailTitle   = document.getElementById("detailTitle");
const detailGrid    = document.getElementById("detailGrid");
const btnCloseDetail = document.getElementById("btnCloseDetail");
const toastEl       = document.getElementById("toast");

// ─── Helpers ───
function toast(msg, type = "success") {
  toastEl.textContent = msg;
  toastEl.className = `toast toast-${type} show`;
  setTimeout(() => toastEl.classList.remove("show"), 2500);
}

function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("zh-HK");
}
function fmtTime(t) {
  if (!t) return "—";
  return new Date(t).toLocaleTimeString("zh-HK", { hour: "2-digit", minute: "2-digit", hour12: false });
}
function badge(val) {
  return val
    ? `<span class="badge badge-yes">是</span>`
    : `<span class="badge badge-no">否</span>`;
}

// ─── API calls ───
async function fetchRecords() {
  const res = await fetch(`${API}/indices`);
  allRecords = await res.json();
  // Log service 13 to check duration from API
  const s13 = allRecords.find(r => r.serviceID === 13);
  if (s13) console.log('[FRONTEND] Service 13 from API:', { serviceID: s13.serviceID, duration: s13.duration, type: typeof s13.duration });
  renderTable(allRecords);
}

async function fetchDropdowns() {
  const [uRes, sRes] = await Promise.all([
    fetch(`${API}/index-users`),
    fetch(`${API}/index-staff`),
  ]);
  usersCache = await uRes.json();
  staffCache = await sRes.json();
  populateSelect("fUser", usersCache, "userID", (u) => `${u.userID} – ${u.name}`);
  populateSelect("fStaff", staffCache, "staffID", (s) => `${s.staffID} – ${s.name} (${s.position})`);
  
  // Populate calculation dropdowns
  populateSelect("calcUserSelect", usersCache, "userID", (u) => `${u.userID} – ${u.name}`);
  populateSelect("calcStaffSelect", staffCache, "staffID", (s) => `${s.staffID} – ${s.name} (${s.position})`);
}

function populateSelect(elId, items, valKey, labelFn) {
  const sel = document.getElementById(elId);
  sel.innerHTML = `<option value="">— 請選擇 —</option>`;
  items.forEach((item) => {
    const opt = document.createElement("option");
    opt.value = item[valKey];
    opt.textContent = labelFn(item);
    sel.appendChild(opt);
  });
}

// ─── Render table ───
function renderTable(records) {
  tableBody.innerHTML = "";
  if (records.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="13" style="text-align:center;padding:24px;color:#999;">沒有紀錄</td></tr>`;
    return;
  }
  records.forEach((r) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r.serviceID}</td>
      <td>${fmtDate(r.date)}</td>
      <td>${fmtTime(r.time)}</td>
      <td>${r.duration}h</td>
      <td>${r.user?.name ?? r.userID}</td>
      <td>${r.staff?.name ?? r.staffID}</td>
      <td>$${r.Price}</td>
      <td>$${r.salary}</td>
      <td>${badge(r.isfreelance)}</td>
      <td>${badge(r.isReserved)}</td>
      <td>${badge(r.isAttended)}</td>
      <td>${badge(r.isRecorded)}</td>
      <td class="actions">
        <button class="btn btn-sm btn-primary" onclick="viewDetail(${r.serviceID})">詳情</button>
        <button class="btn btn-sm btn-success" onclick="openEdit(${r.serviceID})">編輯</button>
        <button class="btn btn-sm btn-danger"  onclick="deleteRecord(${r.serviceID})">刪除</button>
      </td>`;
    tableBody.appendChild(tr);
  });
}

// ─── Search / Filter ───
searchInput.addEventListener("input", () => {
  const q = searchInput.value.trim().toLowerCase();
  if (!q) return renderTable(allRecords);
  const filtered = allRecords.filter((r) => {
    return (
      String(r.serviceID).includes(q) ||
      (r.user?.name ?? "").toLowerCase().includes(q) ||
      (r.staff?.name ?? "").toLowerCase().includes(q) ||
      String(r.userID).includes(q) ||
      String(r.staffID).includes(q)
    );
  });
  renderTable(filtered);
});

// ─── Detail Card ───
function viewDetail(id) {
  const r = allRecords.find((x) => x.serviceID === id);
  if (!r) return;
  detailTitle.textContent = `紀錄 #${r.serviceID} 詳情`;
  detailGrid.innerHTML = `
    <div class="field"><span class="lbl">服務ID:</span> ${r.serviceID}</div>
    <div class="field"><span class="lbl">日期:</span> ${fmtDate(r.date)}</div>
    <div class="field"><span class="lbl">時間:</span> ${fmtTime(r.time)}</div>
    <div class="field"><span class="lbl">報到時間:</span> ${fmtTime(r.reportTime)}</div>
    <div class="field"><span class="lbl">時數:</span> ${r.duration} 小時</div>
    <div class="field"><span class="lbl">用戶:</span> ${r.user?.name ?? r.userID}</div>
    <div class="field"><span class="lbl">員工:</span> ${r.staff?.name ?? r.staffID} (${r.staff?.position ?? ""})</div>
    <div class="field"><span class="lbl">價錢:</span> $${r.Price}</div>
    <div class="field"><span class="lbl">薪金:</span> $${r.salary}</div>
    <div class="field"><span class="lbl">自由身:</span> ${r.isfreelance ? "是" : "否"}</div>
    <div class="field"><span class="lbl">已預約:</span> ${r.isReserved ? "是" : "否"}</div>
    <div class="field"><span class="lbl">已出席:</span> ${r.isAttended ? "是" : "否"}</div>
    <div class="field"><span class="lbl">已記錄:</span> ${r.isRecorded ? "是" : "否"}</div>
    <div class="field"><span class="lbl">建立時間:</span> ${new Date(r.createAt).toLocaleString("zh-HK")}</div>
    <div class="field"><span class="lbl">更新時間:</span> ${new Date(r.updatedAt).toLocaleString("zh-HK")}</div>
  `;
  detailCard.classList.add("active");
}
btnCloseDetail.addEventListener("click", () => detailCard.classList.remove("active"));

// ─── Modal open / close ───
function openModal() { modalOverlay.classList.add("active"); }
function closeModal() { modalOverlay.classList.remove("active"); indexForm.reset(); editIdInput.value = ""; }
btnCancel.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => { if (e.target === modalOverlay) closeModal(); });

btnAdd.addEventListener("click", () => {
  modalTitle.textContent = "新增紀錄";
  editIdInput.value = "";
  indexForm.reset();
  openModal();
});

// ─── Open edit with pre-filled data ───
function openEdit(id) {
  const r = allRecords.find((x) => x.serviceID === id);
  if (!r) return;
  console.log(`[FRONTEND] Opening edit for service ${id}:`, { duration: r.duration, type: typeof r.duration });
  modalTitle.textContent = `編輯紀錄 #${id}`;
  editIdInput.value = id;

  document.getElementById("fDate").value = r.date ? new Date(r.date).toISOString().slice(0, 10) : "";
  document.getElementById("fTime").value = fmtTime(r.time);
  document.getElementById("fReportTime").value = fmtTime(r.reportTime);
  document.getElementById("fDuration").value = r.duration;
  console.log(`[FRONTEND] Duration set to input:`, document.getElementById("fDuration").value);
  document.getElementById("fUser").value = r.userID;
  document.getElementById("fStaff").value = r.staffID;
  document.getElementById("fPrice").value = r.Price;
  document.getElementById("fSalary").value = r.salary;
  document.getElementById("fFreelance").value = String(r.isfreelance);
  document.getElementById("fReserved").value = String(r.isReserved);
  document.getElementById("fAttended").value = String(r.isAttended);
  document.getElementById("fRecorded").value = String(r.isRecorded);
  openModal();
}

// ─── Save (create or update) ───
indexForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = editIdInput.value;
  const body = {
    date:        document.getElementById("fDate").value,
    time:        document.getElementById("fTime").value,
    reportTime:  document.getElementById("fReportTime").value,
    duration:    Number(document.getElementById("fDuration").value),
    userID:      Number(document.getElementById("fUser").value),
    staffID:     Number(document.getElementById("fStaff").value),
    Price:       Number(document.getElementById("fPrice").value),
    salary:      document.getElementById("fSalary").value,
    isfreelance: document.getElementById("fFreelance").value === "true",
    isReserved:  document.getElementById("fReserved").value === "true",
    isAttended:  document.getElementById("fAttended").value === "true",
    isRecorded:  document.getElementById("fRecorded").value === "true",
  };

  try {
    const url = id ? `${API}/indices/${id}` : `${API}/indices`;
    const method = id ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Request failed");
    }
    toast(id ? "紀錄已更新 ✓" : "紀錄已新增 ✓");
    closeModal();
    await fetchRecords();
  } catch (err) {
    toast(err.message, "error");
  }
});

// ─── Delete ───
async function deleteRecord(id) {
  if (!confirm(`確定刪除紀錄 #${id}？`)) return;
  try {
    const res = await fetch(`${API}/indices/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Delete failed");
    toast("紀錄已刪除 ✓");
    detailCard.classList.remove("active");
    await fetchRecords();
  } catch (err) {
    toast(err.message, "error");
  }
}

// ─── Init ───
(async () => {
  await Promise.all([fetchRecords(), fetchDropdowns()]);
})();

// ─── Calculation Functions ───

// User Price Sum
document.getElementById("btnCalcUser").addEventListener("click", async () => {
  const userID = document.getElementById("calcUserSelect").value;
  const year = document.getElementById("calcUserYear").value;
  const month = document.getElementById("calcUserMonth").value;
  const resultDiv = document.getElementById("userResult");

  if (!userID || !year || !month) {
    resultDiv.innerHTML = '<span style="color:#e63946;">請填寫所有欄位</span>';
    return;
  }

  try {
    const res = await fetch(`${API}/user-price-sum?userID=${userID}&year=${year}&month=${month}`);
    if (!res.ok) throw new Error("計算失敗");
    const data = await res.json();
    
    const userName = usersCache.find(u => u.userID == userID)?.name || `用戶 ${userID}`;
    
    let html = `
      <div><strong>${userName}</strong> - ${year}年${month}月</div>
      <div class="calc-highlight">總價錢: $${data.totalPrice.toLocaleString()}</div>
      <div style="color:#666;">總時數: ${data.totalHours} 小時 | 服務次數: ${data.recordCount}</div>
    `;
    
    if (data.records.length > 0) {
      html += `
        <table class="calc-table">
          <thead><tr><th>日期</th><th>單價</th><th>時數</th><th>總價</th></tr></thead>
          <tbody>
      `;
      data.records.forEach(r => {
        html += `<tr><td>${fmtDate(r.date)}</td><td>$${r.price}</td><td>${r.duration}h</td><td><strong>$${r.totalPrice}</strong></td></tr>`;
      });
      html += `</tbody></table>`;
    }
    
    resultDiv.innerHTML = html;
  } catch (err) {
    resultDiv.innerHTML = `<span style="color:#e63946;">錯誤: ${err.message}</span>`;
  }
});

// Staff Salary Sum
document.getElementById("btnCalcStaff").addEventListener("click", async () => {
  const staffID = document.getElementById("calcStaffSelect").value;
  const year = document.getElementById("calcStaffYear").value;
  const month = document.getElementById("calcStaffMonth").value;
  const resultDiv = document.getElementById("staffResult");

  if (!staffID || !year || !month) {
    resultDiv.innerHTML = '<span style="color:#e63946;">請填寫所有欄位</span>';
    return;
  }

  try {
    const res = await fetch(`${API}/staff-salary-sum?staffID=${staffID}&year=${year}&month=${month}`);
    if (!res.ok) throw new Error("計算失敗");
    const data = await res.json();
    
    const staff = staffCache.find(s => s.staffID == staffID);
    const staffName = staff?.name || `員工 ${staffID}`;
    
    let html = `
      <div><strong>${staffName}</strong> - ${year}年${month}月</div>
      <div class="calc-highlight">總薪金: $${Number(data.totalSalary).toLocaleString()}</div>
      <div style="color:#666;">總時數: ${data.totalHours} 小時 | 服務次數: ${data.recordCount}</div>
    `;
    
    if (data.records.length > 0) {
      html += `
        <table class="calc-table">
          <thead><tr><th>日期</th><th>時數</th><th>薪金</th></tr></thead>
          <tbody>
      `;
      data.records.forEach(r => {
        html += `<tr><td>${fmtDate(r.date)}</td><td>${r.duration}h</td><td>$${r.salary}</td></tr>`;
      });
      html += `</tbody></table>`;
    }
    
    resultDiv.innerHTML = html;
  } catch (err) {
    resultDiv.innerHTML = `<span style="color:#e63946;">錯誤: ${err.message}</span>`;
  }
});

// Monthly Summary
document.getElementById("btnSummary").addEventListener("click", async () => {
  const type = document.getElementById("summaryType").value;
  const year = document.getElementById("summaryYear").value;
  const month = document.getElementById("summaryMonth").value;
  const resultDiv = document.getElementById("summaryResult");

  if (!year || !month) {
    resultDiv.innerHTML = '<span style="color:#e63946;">請填寫年份和月份</span>';
    return;
  }

  try {
    const res = await fetch(`${API}/monthly-summary?type=${type}&year=${year}&month=${month}`);
    if (!res.ok) throw new Error("計算失敗");
    const data = await res.json();
    
    let html = `<div style="margin-bottom:12px;"><strong>${year}年${month}月 - ${type === 'user' ? '用戶' : '員工'}統計摘要</strong></div>`;
    
    if (data.summary.length === 0) {
      html += '<div style="color:#999;">沒有數據</div>';
    } else {
      if (type === 'user') {
        html += `
          <table class="calc-table">
            <thead><tr><th>用戶ID</th><th>姓名</th><th>總價錢</th><th>總時數</th><th>服務次數</th></tr></thead>
            <tbody>
        `;
        let totalPrice = 0;
        let totalHours = 0;
        let totalRecords = 0;
        data.summary.forEach(s => {
          html += `<tr>
            <td>${s.userID}</td>
            <td>${s.userName}</td>
            <td><strong>$${s.totalPrice.toLocaleString()}</strong></td>
            <td>${s.totalHours}h</td>
            <td>${s.recordCount}</td>
          </tr>`;
          totalPrice += s.totalPrice;
          totalHours += s.totalHours;
          totalRecords += s.recordCount;
        });
        html += `
            <tr style="background:#e8f4f8;font-weight:700;">
              <td colspan="2">總計</td>
              <td>$${totalPrice.toLocaleString()}</td>
              <td>${totalHours}h</td>
              <td>${totalRecords}</td>
            </tr>
          </tbody></table>
        `;
      } else {
        html += `
          <table class="calc-table">
            <thead><tr><th>員工ID</th><th>姓名</th><th>職位</th><th>總薪金</th><th>總時數</th><th>服務次數</th></tr></thead>
            <tbody>
        `;
        let totalSalary = 0;
        let totalHours = 0;
        let totalRecords = 0;
        data.summary.forEach(s => {
          html += `<tr>
            <td>${s.staffID}</td>
            <td>${s.staffName}</td>
            <td>${s.position}</td>
            <td><strong>$${Number(s.totalSalary).toLocaleString()}</strong></td>
            <td>${s.totalHours}h</td>
            <td>${s.recordCount}</td>
          </tr>`;
          totalSalary += Number(s.totalSalary);
          totalHours += s.totalHours;
          totalRecords += s.recordCount;
        });
        html += `
            <tr style="background:#e8f4f8;font-weight:700;">
              <td colspan="3">總計</td>
              <td>$${totalSalary.toLocaleString()}</td>
              <td>${totalHours}h</td>
              <td>${totalRecords}</td>
            </tr>
          </tbody></table>
        `;
      }
    }
    
    resultDiv.innerHTML = html;
  } catch (err) {
    resultDiv.innerHTML = `<span style="color:#e63946;">錯誤: ${err.message}</span>`;
  }
});
