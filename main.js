const ADMIN_PASSWORD = "escato2025";
const LOGO_STORAGE_KEY = "escato_school_logo";
const EXTRA_PHOTO_KEY = "escato_extra_photo";
const TEACHERS_STORAGE_KEY = "escato_teachers";

const loginSection = document.getElementById("login-section");
const appSection = document.getElementById("app-section");
const loginForm = document.getElementById("login-form");
const adminPasswordInput = document.getElementById("admin-password");
const loginError = document.getElementById("login-error");
const logoutBtn = document.getElementById("logout-btn");
const teacherForm = document.getElementById("teacher-form");
const formPanel = document.getElementById("form-panel");
const teacherIdInput = document.getElementById("teacher-id");

const identityNumberInput = document.getElementById("identity-number");
const cnapsNumberInput = document.getElementById("cnaps-number");
const mleNumberInput = document.getElementById("mle-number");
const nameInput = document.getElementById("name");
const subjectInput = document.getElementById("subject");
const contactInput = document.getElementById("contact");
const emailInput = document.getElementById("email");
const dobInput = document.getElementById("dob");
const placeOfBirthInput = document.getElementById("place-of-birth");
const numberOfChildrenInput = document.getElementById("number-of-children");
const maritalStatusInput = document.getElementById("marital-status");
const hiringDateInput = document.getElementById("hiring-date");
const debaucheryDateInput = document.getElementById("debauchery-date");
const occupationInput = document.getElementById("occupation");
const employmentTypeInput = document.getElementById("employment-type");
const addressInput = document.getElementById("address");
const religionInput = document.getElementById("religion");
const commentInput = document.getElementById("comment");
const photoInput = document.getElementById("photo");
const previewImg = document.getElementById("preview");
const teacherTableBody = document.querySelector("#teacher-table tbody");
const tableWrap = document.getElementById("table-wrap");
const teacherCount = document.getElementById("teacher-count");
const emptyState = document.getElementById("empty-state");
const emptyTitle = document.getElementById("empty-title");
const emptyHint = document.getElementById("empty-hint");
const formTitle = document.getElementById("form-title");
const cancelEditBtn = document.getElementById("cancel-edit");

const schoolLogo = document.getElementById("school-logo");
const logoFileInput = document.getElementById("logo-file");
const dynamicFavicon = document.getElementById("dynamic-favicon");

const extraPhotoInput = document.getElementById("extra-photo-file");
const extraPhotoPreview = document.getElementById("extra-photo-preview");

const printModalBg = document.getElementById("print-modal-bg");
const printContent = document.getElementById("print-content");
const printTeacherInfoBtn = document.getElementById("print-teacher-info");
const printCertificateBtn = document.getElementById("print-certificate");
const printPermissionBtn = document.getElementById("print-permission");
const closePrintModalBtn = document.getElementById("close-print-modal");

const printTeacherListBtn = document.getElementById("print-teacher-list");
const printListSection = document.getElementById("print-list-section");
const printListContent = document.getElementById("print-list-content");

const searchTeacherInput = document.getElementById("search-teacher");

const teacherDetailBg = document.getElementById("teacher-detail-bg");
const teacherDetailContent = document.getElementById("teacher-detail-content");
const closeTeacherDetailBtn = document.getElementById("close-teacher-detail");

let editing = false;
let teachers = [];
let currentPrintTeacherIndex = null;
let currentPrintMode = "info";
let schoolLogoSrc = "";
let extraPhotoSrc = "";

const DETAIL_FIELDS = [
  ["Name", "name"],
  ["Identity Number", "identityNumber"],
  ["N° CNaPS", "cnapsNumber"],
  ["N° Mle", "mleNumber"],
  ["Subject", "subject"],
  ["Contact", "contact"],
  ["Email", "email"],
  ["N+Date of Birth", "dob"],
  ["Place of Birth", "placeOfBirth"],
  ["Number of Children", "numberOfChildren"],
  ["Marital Status", "maritalStatus"],
  ["Hiring Date", "hiringDate"],
  ["Debauchery Date", "debaucheryDate"],
  ["Occupation", "occupation"],
  ["Permanent/Temporary", "employmentType"],
  ["Address", "address"],
  ["Religion", "religion"],
  ["Comment", "comment"]
];

const TABLE_COLUMNS = [
  { key: "identityNumber" },
  { key: "cnapsNumber" },
  { key: "mleNumber" },
  { key: "subject" },
  { key: "contact" },
  { key: "email" },
  { key: "dob", format: value => (value ? "N+" + value : "") },
  { key: "placeOfBirth" },
  { key: "numberOfChildren", className: "num" },
  { key: "maritalStatus" },
  { key: "hiringDate" },
  { key: "debaucheryDate" },
  { key: "occupation" },
  { key: "employmentType", pill: true },
  { key: "address", className: "wrap" },
  { key: "religion" },
  { key: "comment", className: "wrap" }
];

const HTML_ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => HTML_ESCAPES[char]);
}

function getInitials(name) {
  return String(name || "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(word => word[0])
    .join("")
    .toUpperCase();
}

function loadTeachers() {
  try {
    teachers = JSON.parse(localStorage.getItem(TEACHERS_STORAGE_KEY)) || [];
  } catch {
    teachers = [];
  }
}

function saveTeachers() {
  localStorage.setItem(TEACHERS_STORAGE_KEY, JSON.stringify(teachers));
}

function setFavicon(url) {
  if (dynamicFavicon) dynamicFavicon.href = url || "";
}

function loadSchoolLogo() {
  const stored = localStorage.getItem(LOGO_STORAGE_KEY);
  schoolLogo.src = stored || "";
  schoolLogoSrc = stored || "";
  setFavicon(stored);
}

logoFileInput.onchange = function () {
  const file = logoFileInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    localStorage.setItem(LOGO_STORAGE_KEY, e.target.result);
    schoolLogo.src = e.target.result;
    schoolLogoSrc = e.target.result;
    setFavicon(e.target.result);
  };
  reader.readAsDataURL(file);
};

function loadExtraPhoto() {
  const stored = localStorage.getItem(EXTRA_PHOTO_KEY);
  extraPhotoPreview.src = stored || "";
  extraPhotoPreview.style.display = stored ? "inline" : "none";
  extraPhotoSrc = stored || "";
}

extraPhotoInput.onchange = function () {
  const file = extraPhotoInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    localStorage.setItem(EXTRA_PHOTO_KEY, e.target.result);
    extraPhotoPreview.src = e.target.result;
    extraPhotoPreview.style.display = "inline";
    extraPhotoSrc = e.target.result;
  };
  reader.readAsDataURL(file);
};

loginForm.onsubmit = function (e) {
  e.preventDefault();
  if (adminPasswordInput.value === ADMIN_PASSWORD) {
    loginSection.style.display = "none";
    appSection.style.display = "block";
    loadSchoolLogo();
    loadExtraPhoto();
    renderTable();
  } else {
    loginError.textContent = "Incorrect password!";
  }
};

logoutBtn.onclick = function () {
  appSection.style.display = "none";
  loginSection.style.display = "block";
  loginError.textContent = "";
  adminPasswordInput.value = "";
  resetForm();
};

function buildAvatar(teacher) {
  if (teacher.photo) {
    const img = document.createElement("img");
    img.className = "avatar";
    img.src = teacher.photo;
    img.alt = "";
    return img;
  }
  const fallback = document.createElement("span");
  fallback.className = "avatar avatar-fallback";
  fallback.setAttribute("aria-hidden", "true");
  fallback.textContent = getInitials(teacher.name);
  return fallback;
}

function buildPersonCell(teacher, index) {
  const cell = document.createElement("td");
  const inner = document.createElement("div");
  inner.className = "person-inner";
  inner.appendChild(buildAvatar(teacher));
  const nameButton = document.createElement("button");
  nameButton.type = "button";
  nameButton.className = "link-btn";
  nameButton.textContent = teacher.name;
  nameButton.onclick = () => openTeacherDetail(index);
  inner.appendChild(nameButton);
  cell.appendChild(inner);
  return cell;
}

function buildDataCell(teacher, column) {
  const cell = document.createElement("td");
  const raw = teacher[column.key];
  if (column.className) cell.className = column.className;
  if (column.pill) {
    if (raw) {
      const pill = document.createElement("span");
      pill.className = "pill pill-" + String(raw).toLowerCase();
      pill.textContent = raw;
      cell.appendChild(pill);
    }
    return cell;
  }
  cell.textContent = column.format ? column.format(raw) : raw || "";
  return cell;
}

function buildActionButton(label, variant, handler) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "btn btn-sm " + variant;
  button.textContent = label;
  button.onclick = handler;
  return button;
}

function buildActionsCell(index) {
  const cell = document.createElement("td");
  const group = document.createElement("div");
  group.className = "row-actions";
  group.appendChild(buildActionButton("Edit", "btn-secondary", () => startEdit(index)));
  group.appendChild(buildActionButton("Print", "btn-secondary", () => openPrintModal(index)));
  group.appendChild(
    buildActionButton("Delete", "btn-danger", () => {
      if (confirm("Delete this teacher?")) {
        teachers.splice(index, 1);
        saveTeachers();
        renderTable();
        if (editing) resetForm();
      }
    })
  );
  cell.appendChild(group);
  return cell;
}

function matchesFilter(teacher, filter) {
  return Object.values(teacher).join(" ").toLowerCase().includes(filter);
}

function formatCount(visible, total, filtered) {
  const noun = total === 1 ? "teacher" : "teachers";
  return filtered ? `${visible} of ${total} ${noun}` : `${total} ${noun}`;
}

function updateListState(visible, total, rawFilter) {
  const filtered = Boolean(rawFilter);
  teacherCount.textContent = formatCount(visible, total, filtered);
  tableWrap.hidden = visible === 0;
  emptyState.hidden = visible > 0;
  if (visible > 0) return;
  if (total === 0) {
    emptyTitle.textContent = "No teachers registered yet";
    emptyHint.textContent = "Fill in the form above and select Save to add the first one.";
  } else {
    emptyTitle.textContent = `No teacher matches "${rawFilter}"`;
    emptyHint.textContent = "Check the spelling or clear the search to see everyone.";
  }
}

function renderTable() {
  loadTeachers();
  teacherTableBody.innerHTML = "";
  const rawFilter = (searchTeacherInput.value || "").trim();
  const filter = rawFilter.toLowerCase();
  let visible = 0;
  teachers.forEach((teacher, index) => {
    if (filter && !matchesFilter(teacher, filter)) return;
    visible++;
    const row = document.createElement("tr");
    row.appendChild(buildPersonCell(teacher, index));
    TABLE_COLUMNS.forEach(column => row.appendChild(buildDataCell(teacher, column)));
    row.appendChild(buildActionsCell(index));
    teacherTableBody.appendChild(row);
  });
  updateListState(visible, teachers.length, rawFilter);
}

teacherForm.onsubmit = function (e) {
  e.preventDefault();
  const teacher = {
    identityNumber: identityNumberInput.value,
    cnapsNumber: cnapsNumberInput.value,
    mleNumber: mleNumberInput.value,
    name: nameInput.value,
    subject: subjectInput.value,
    contact: contactInput.value,
    email: emailInput.value,
    dob: dobInput.value,
    placeOfBirth: placeOfBirthInput.value,
    numberOfChildren: numberOfChildrenInput.value,
    maritalStatus: maritalStatusInput.value,
    hiringDate: hiringDateInput.value,
    debaucheryDate: debaucheryDateInput.value,
    occupation: occupationInput.value,
    employmentType: employmentTypeInput.value,
    address: addressInput.value,
    religion: religionInput.value,
    comment: commentInput.value,
    photo: previewImg.src && previewImg.style.display !== "none" ? previewImg.src : ""
  };

  if (editing) {
    teachers[teacherIdInput.value] = teacher;
  } else {
    teachers.push(teacher);
  }
  saveTeachers();
  renderTable();
  resetForm();
};

photoInput.onchange = function () {
  const file = photoInput.files[0];
  if (!file) {
    previewImg.style.display = "none";
    previewImg.src = "";
    return;
  }
  const reader = new FileReader();
  reader.onload = function (e) {
    previewImg.src = e.target.result;
    previewImg.style.display = "inline";
  };
  reader.readAsDataURL(file);
};

cancelEditBtn.onclick = resetForm;

function startEdit(index) {
  const teacher = teachers[index];
  editing = true;
  teacherIdInput.value = index;
  identityNumberInput.value = teacher.identityNumber || "";
  cnapsNumberInput.value = teacher.cnapsNumber || "";
  mleNumberInput.value = teacher.mleNumber || "";
  nameInput.value = teacher.name;
  subjectInput.value = teacher.subject;
  contactInput.value = teacher.contact;
  emailInput.value = teacher.email;
  dobInput.value = teacher.dob || "";
  placeOfBirthInput.value = teacher.placeOfBirth || "";
  numberOfChildrenInput.value = teacher.numberOfChildren || "";
  maritalStatusInput.value = teacher.maritalStatus || "";
  hiringDateInput.value = teacher.hiringDate || "";
  debaucheryDateInput.value = teacher.debaucheryDate || "";
  occupationInput.value = teacher.occupation || "";
  employmentTypeInput.value = teacher.employmentType || "";
  addressInput.value = teacher.address || "";
  religionInput.value = teacher.religion || "";
  commentInput.value = teacher.comment || "";
  previewImg.src = teacher.photo || "";
  previewImg.style.display = teacher.photo ? "inline" : "none";
  formTitle.textContent = "Edit Teacher";
  cancelEditBtn.hidden = false;
  formPanel.classList.add("is-editing");
  formPanel.scrollIntoView({ block: "start" });
  nameInput.focus({ preventScroll: true });
}

function resetForm() {
  editing = false;
  teacherForm.reset();
  teacherIdInput.value = "";
  previewImg.src = "";
  previewImg.style.display = "none";
  cancelEditBtn.hidden = true;
  formPanel.classList.remove("is-editing");
  formTitle.textContent = "Add Teacher";
}

function buildLogoHTML() {
  return schoolLogoSrc ? `<img class="doc-logo" src="${esc(schoolLogoSrc)}" alt="School logo">` : "";
}

function buildDocHeadHTML(kind, photoHTML = "") {
  return `
    <header class="doc-head">
      ${buildLogoHTML()}
      <div>
        <div class="doc-org">ESCATO</div>
        <div class="doc-kind">${esc(kind)}</div>
      </div>
      ${photoHTML}
    </header>
  `;
}

function buildDetailRows(teacher) {
  return DETAIL_FIELDS.map(
    ([label, key]) => `<tr><th scope="row">${esc(label)}</th><td>${esc(teacher[key])}</td></tr>`
  ).join("");
}

function buildSignatureHTML() {
  return `
    <div class="doc-sign">
      <div>Given this day, ${esc(new Date().toLocaleDateString())}</div>
      <div class="sign-box">(Signature and stamp)</div>
    </div>
  `;
}

function buildTeacherInfoHTML(teacher) {
  const photo = teacher.photo ? `<img class="doc-photo" src="${esc(teacher.photo)}" alt="Photo">` : "";
  return `
    ${buildDocHeadHTML("Teacher Information", photo)}
    <table class="kv">${buildDetailRows(teacher)}</table>
  `;
}

function buildWorkCertificateHTML(teacher) {
  return `
    ${buildDocHeadHTML("Certificate of Employment")}
    <div class="doc-body">
      <p>This certifies that <b>${esc(teacher.name)}</b>, holder of Identity Number <b>${esc(teacher.identityNumber)}</b>, has served as <b>${esc(teacher.occupation || teacher.subject)}</b> at ESCATO.</p>
      <p>
        <b>Period:</b> ${esc(teacher.hiringDate || "(Start date)")} to ${esc(teacher.debaucheryDate || "(End date/Present)")}<br>
        <b>Employment type:</b> ${esc(teacher.employmentType || "Not specified")}
      </p>
    </div>
    ${buildSignatureHTML()}
  `;
}

function buildPermissionLetterHTML(teacher) {
  return `
    ${buildDocHeadHTML("Permission Letter")}
    <div class="doc-body">
      <p>To whom it may concern,</p>
      <p>This is to confirm that <b>${esc(teacher.name)}</b>, Identity Number <b>${esc(teacher.identityNumber)}</b>, is employed at ESCATO as a <b>${esc(teacher.occupation || teacher.subject)}</b> (${esc(teacher.employmentType || "N/A")}).</p>
      <p>The administration grants permission for the above-mentioned teacher to <span class="fill-line"></span>.<br>(State purpose here)</p>
    </div>
    ${buildSignatureHTML()}
  `;
}

const PRINT_BUILDERS = {
  info: buildTeacherInfoHTML,
  certificate: buildWorkCertificateHTML,
  permission: buildPermissionLetterHTML
};

function openPrintModal(index) {
  currentPrintTeacherIndex = index;
  showPrintModal("info");
  closePrintModalBtn.focus();
}

function showPrintModal(mode) {
  currentPrintMode = mode;
  printModalBg.style.display = "flex";
  printContent.innerHTML = PRINT_BUILDERS[mode](teachers[currentPrintTeacherIndex]);
  printTeacherInfoBtn.classList.toggle("is-active", mode === "info");
  printCertificateBtn.classList.toggle("is-active", mode === "certificate");
  printPermissionBtn.classList.toggle("is-active", mode === "permission");
}

function closePrintModal() {
  printModalBg.style.display = "none";
  printContent.innerHTML = "";
  currentPrintTeacherIndex = null;
}

function printMode(mode) {
  showPrintModal(mode);
  setTimeout(() => window.print(), 100);
}

closePrintModalBtn.onclick = closePrintModal;
printTeacherInfoBtn.onclick = () => printMode("info");
printCertificateBtn.onclick = () => printMode("certificate");
printPermissionBtn.onclick = () => printMode("permission");

function buildTeacherListHTML(list) {
  const rows = list
    .map(
      teacher => `
        <tr>
          <td>${esc(teacher.name)}</td>
          <td class="nw">${esc(teacher.identityNumber)}</td>
          <td class="nw">${esc(teacher.cnapsNumber)}</td>
          <td class="nw">${esc(teacher.mleNumber)}</td>
          <td>${esc(teacher.subject)}</td>
          <td class="nw">${esc(teacher.contact)}</td>
          <td>${esc(teacher.email)}</td>
          <td class="nw">${teacher.dob ? esc("N+" + teacher.dob) : ""}</td>
          <td>${esc(teacher.placeOfBirth)}</td>
          <td>${esc(teacher.numberOfChildren)}</td>
          <td>${esc(teacher.maritalStatus)}</td>
          <td class="nw">${esc(teacher.hiringDate)}</td>
          <td>${esc(teacher.employmentType)}</td>
        </tr>
      `
    )
    .join("");
  return `
    <header class="doc-head">
      ${buildLogoHTML()}
      <div>
        <div class="doc-org">ESCATO</div>
        <div class="doc-kind">Teacher List</div>
        <div class="doc-date">Printed on ${esc(new Date().toLocaleDateString())}</div>
      </div>
    </header>
    <table class="list-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Identity Number</th>
          <th>N° CNaPS</th>
          <th>N° Mle</th>
          <th>Subject</th>
          <th>Contact</th>
          <th>Email</th>
          <th>N+Date of Birth</th>
          <th>Place of Birth</th>
          <th>Number of Children</th>
          <th>Marital Status</th>
          <th>Hiring Date</th>
          <th>Employment</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

printTeacherListBtn.onclick = function () {
  buildAndPrintTeacherList();
};

function buildAndPrintTeacherList() {
  loadTeachers();
  const filter = (searchTeacherInput.value || "").toLowerCase().trim();
  const list = filter ? teachers.filter(teacher => matchesFilter(teacher, filter)) : teachers;
  printListContent.innerHTML = buildTeacherListHTML(list);
  printListSection.style.display = "block";
  setTimeout(() => {
    window.print();
    printListSection.style.display = "none";
    printListContent.innerHTML = "";
  }, 100);
}

searchTeacherInput.oninput = function () {
  renderTable();
};

function openTeacherDetail(index) {
  const teacher = teachers[index];
  const pill = teacher.employmentType
    ? `<span class="pill pill-${esc(teacher.employmentType.toLowerCase())}">${esc(teacher.employmentType)}</span>`
    : "";
  const avatar = teacher.photo
    ? `<img class="avatar" src="${esc(teacher.photo)}" alt="Photo">`
    : `<span class="avatar avatar-fallback" aria-hidden="true">${esc(getInitials(teacher.name))}</span>`;
  teacherDetailContent.innerHTML = `
    <div class="profile-head">
      ${avatar}
      <div>
        <div class="profile-name">${esc(teacher.name)}</div>
        <div class="profile-subject">${esc(teacher.subject)}</div>
        ${pill}
      </div>
    </div>
    <table class="kv">${buildDetailRows(teacher)}</table>
  `;
  teacherDetailBg.style.display = "flex";
  closeTeacherDetailBtn.focus();
}

function closeTeacherDetail() {
  teacherDetailBg.style.display = "none";
  teacherDetailContent.innerHTML = "";
}

closeTeacherDetailBtn.onclick = closeTeacherDetail;

printModalBg.addEventListener("click", e => {
  if (e.target === printModalBg) closePrintModal();
});

teacherDetailBg.addEventListener("click", e => {
  if (e.target === teacherDetailBg) closeTeacherDetail();
});

document.addEventListener("keydown", e => {
  if (e.key !== "Escape") return;
  if (printModalBg.style.display === "flex") closePrintModal();
  else if (teacherDetailBg.style.display === "flex") closeTeacherDetail();
});

window.onload = function () {
  resetForm();
  loadSchoolLogo();
  loadExtraPhoto();
  loadTeachers();
  renderTable();
};
