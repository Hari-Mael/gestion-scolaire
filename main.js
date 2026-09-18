// --- CONFIG ---
const ADMIN_PASSWORD = "escato2025"; // Change as needed
const LOGO_STORAGE_KEY = "escato_school_logo";
const EXTRA_PHOTO_KEY = "escato_extra_photo";

// --- DOM Elements ---
const loginSection = document.getElementById("login-section");
const appSection = document.getElementById("app-section");
const loginForm = document.getElementById("login-form");
const adminPasswordInput = document.getElementById("admin-password");
const loginError = document.getElementById("login-error");
const logoutBtn = document.getElementById("logout-btn");
const teacherForm = document.getElementById("teacher-form");
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
const formTitle = document.getElementById("form-title");
const cancelEditBtn = document.getElementById("cancel-edit");

const schoolLogo = document.getElementById("school-logo");
const logoFileInput = document.getElementById("logo-file");
const dynamicFavicon = document.getElementById("dynamic-favicon");

const extraPhotoInput = document.getElementById("extra-photo-file");
const extraPhotoPreview = document.getElementById("extra-photo-preview");

const printModalBg = document.getElementById("print-modal-bg");
const printModal = document.getElementById("print-modal");
const printContent = document.getElementById("print-content");
const printTeacherInfoBtn = document.getElementById("print-teacher-info");
const printCertificateBtn = document.getElementById("print-certificate");
const printPermissionBtn = document.getElementById("print-permission");
const closePrintModalBtn = document.getElementById("close-print-modal");

const printTeacherListBtn = document.getElementById("print-teacher-list");
const printListSection = document.getElementById("print-list-section");
const printListContent = document.getElementById("print-list-content");

const searchTeacherInput = document.getElementById("search-teacher");

// Teacher Detail Modal
const teacherDetailBg = document.getElementById("teacher-detail-bg");
const teacherDetailModal = document.getElementById("teacher-detail-modal");
const teacherDetailContent = document.getElementById("teacher-detail-content");
const closeTeacherDetailBtn = document.getElementById("close-teacher-detail");

// --- State ---
let editing = false;
let teachers = [];
let currentPrintTeacherIndex = null;
let currentPrintMode = "info"; // info, certificate, permission
let schoolLogoSrc = "";
let extraPhotoSrc = "";

// --- LocalStorage helpers ---
function loadTeachers() {
  try {
    teachers = JSON.parse(localStorage.getItem("escato_teachers")) || [];
  } catch {
    teachers = [];
  }
}
function saveTeachers() {
  localStorage.setItem("escato_teachers", JSON.stringify(teachers));
}

// --- School Logo Storage & Favicon ---
function setFavicon(url) {
  if (dynamicFavicon) dynamicFavicon.href = url || "";
}
function loadSchoolLogo() {
  const stored = localStorage.getItem(LOGO_STORAGE_KEY);
  if (stored) {
    schoolLogo.src = stored;
    schoolLogoSrc = stored;
    setFavicon(stored);
  } else {
    schoolLogo.src = "";
    schoolLogoSrc = "";
    setFavicon("");
  }
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

// --- Extra Photo Storage ---
function loadExtraPhoto() {
  const stored = localStorage.getItem(EXTRA_PHOTO_KEY);
  if (stored) {
    extraPhotoPreview.src = stored;
    extraPhotoPreview.style.display = "inline";
    extraPhotoSrc = stored;
  } else {
    extraPhotoPreview.src = "";
    extraPhotoPreview.style.display = "none";
    extraPhotoSrc = "";
  }
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

// --- Auth ---
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
  teacherForm.reset();
  previewImg.style.display = "none";
  cancelEditBtn.style.display = "none";
  formTitle.textContent = "Add Teacher";
  editing = false;
};

// --- Teacher List Rendering ---
function renderTable() {
  loadTeachers();
  teacherTableBody.innerHTML = "";
  let filter = (searchTeacherInput.value || "").toLowerCase().trim();
  teachers.forEach((t, i) => {
    if (filter) {
      let combined = Object.values(t).join(" ").toLowerCase();
      if (!combined.includes(filter)) return;
    }
    const row = document.createElement("tr");

    // Photo
    const imgCell = document.createElement("td");
    if (t.photo) {
      const img = document.createElement("img");
      img.src = t.photo;
      img.width = 80;
      img.height = 80;
      imgCell.appendChild(img);
    } else {
      imgCell.textContent = "No Photo";
    }
    row.appendChild(imgCell);

    // Identity Number
    const idCell = document.createElement("td");
    idCell.textContent = t.identityNumber || "";
    row.appendChild(idCell);

    // N° CNaPS
    const cnapsCell = document.createElement("td");
    cnapsCell.textContent = t.cnapsNumber || "";
    row.appendChild(cnapsCell);

    // N° Mle
    const mleCell = document.createElement("td");
    mleCell.textContent = t.mleNumber || "";
    row.appendChild(mleCell);

    // Info cells
    const nameCell = document.createElement("td");
    nameCell.className = "teacher-name";
    nameCell.textContent = t.name;
    nameCell.onclick = () => openTeacherDetail(i);
    row.appendChild(nameCell);

    const subjectCell = document.createElement("td");
    subjectCell.textContent = t.subject;
    row.appendChild(subjectCell);

    const contactCell = document.createElement("td");
    contactCell.textContent = t.contact;
    row.appendChild(contactCell);

    const emailCell = document.createElement("td");
    emailCell.textContent = t.email;
    row.appendChild(emailCell);

    // N+Date of Birth
    const dobCell = document.createElement("td");
    dobCell.textContent = t.dob ? "N+" + t.dob : "";
    row.appendChild(dobCell);

    // Place of Birth
    const pobCell = document.createElement("td");
    pobCell.textContent = t.placeOfBirth || "";
    row.appendChild(pobCell);

    // Number of Children
    const childrenCell = document.createElement("td");
    childrenCell.textContent = t.numberOfChildren || "";
    row.appendChild(childrenCell);

    // Marital Status
    const maritalCell = document.createElement("td");
    maritalCell.textContent = t.maritalStatus || "";
    row.appendChild(maritalCell);

    // Hiring Date
    const hiringDateCell = document.createElement("td");
    hiringDateCell.textContent = t.hiringDate || "";
    row.appendChild(hiringDateCell);

    // Debauchery Date
    const debaucheryDateCell = document.createElement("td");
    debaucheryDateCell.textContent = t.debaucheryDate || "";
    row.appendChild(debaucheryDateCell);

    // Occupation
    const occupationCell = document.createElement("td");
    occupationCell.textContent = t.occupation || "";
    row.appendChild(occupationCell);

    // Permanent/Temporary
    const employmentTypeCell = document.createElement("td");
    employmentTypeCell.textContent = t.employmentType || "";
    row.appendChild(employmentTypeCell);

    // Address
    const addressCell = document.createElement("td");
    addressCell.textContent = t.address || "";
    row.appendChild(addressCell);

    // Religion
    const religionCell = document.createElement("td");
    religionCell.textContent = t.religion || "";
    row.appendChild(religionCell);

    // Comment
    const commentCell = document.createElement("td");
    commentCell.textContent = t.comment || "";
    row.appendChild(commentCell);

    // Actions
    const actCell = document.createElement("td");
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.onclick = () => startEdit(i);
    actCell.appendChild(editBtn);

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.onclick = () => {
      if (confirm("Delete this teacher?")) {
        teachers.splice(i, 1);
        saveTeachers();
        renderTable();
        if (editing) resetForm();
      }
    };
    actCell.appendChild(delBtn);

    const printBtn = document.createElement("button");
    printBtn.textContent = "Print";
    printBtn.onclick = () => openPrintModal(i);
    actCell.appendChild(printBtn);

    row.appendChild(actCell);

    teacherTableBody.appendChild(row);
  });
}

// --- Teacher Form ---
teacherForm.onsubmit = function (e) {
  e.preventDefault();
  const t = {
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
    teachers[teacherIdInput.value] = t;
  } else {
    teachers.push(t);
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

// --- Edit teacher ---
function startEdit(index) {
  const t = teachers[index];
  editing = true;
  teacherIdInput.value = index;
  identityNumberInput.value = t.identityNumber || "";
  cnapsNumberInput.value = t.cnapsNumber || "";
  mleNumberInput.value = t.mleNumber || "";
  nameInput.value = t.name;
  subjectInput.value = t.subject;
  contactInput.value = t.contact;
  emailInput.value = t.email;
  dobInput.value = t.dob || "";
  placeOfBirthInput.value = t.placeOfBirth || "";
  numberOfChildrenInput.value = t.numberOfChildren || "";
  maritalStatusInput.value = t.maritalStatus || "";
  hiringDateInput.value = t.hiringDate || "";
  debaucheryDateInput.value = t.debaucheryDate || "";
  occupationInput.value = t.occupation || "";
  employmentTypeInput.value = t.employmentType || "";
  addressInput.value = t.address || "";
  religionInput.value = t.religion || "";
  commentInput.value = t.comment || "";
  previewImg.src = t.photo || "";
  previewImg.style.display = t.photo ? "inline" : "none";
  formTitle.textContent = "Edit Teacher";
  cancelEditBtn.style.display = "inline";
}

// --- Reset Form ---
function resetForm() {
  editing = false;
  teacherForm.reset();
  teacherIdInput.value = "";
  previewImg.src = "";
  previewImg.style.display = "none";
  cancelEditBtn.style.display = "none";
  formTitle.textContent = "Add Teacher";
}

// --- Print Modal ---
function openPrintModal(index) {
  currentPrintTeacherIndex = index;
  showPrintModal("info");
}
function showPrintModal(mode) {
  currentPrintMode = mode;
  printModalBg.style.display = "flex";
  // Fill the printContent
  if (mode === "info") {
    printContent.innerHTML = buildTeacherInfoHTML(teachers[currentPrintTeacherIndex]);
    printTeacherInfoBtn.style.display = "";
    printCertificateBtn.style.display = "";
    printPermissionBtn.style.display = "";
  } else if (mode === "certificate") {
    printContent.innerHTML = buildWorkCertificateHTML(teachers[currentPrintTeacherIndex]);
    printTeacherInfoBtn.style.display = "";
    printCertificateBtn.style.display = "";
    printPermissionBtn.style.display = "";
  } else if (mode === "permission") {
    printContent.innerHTML = buildPermissionLetterHTML(teachers[currentPrintTeacherIndex]);
    printTeacherInfoBtn.style.display = "";
    printCertificateBtn.style.display = "";
    printPermissionBtn.style.display = "";
  }
}
closePrintModalBtn.onclick = function () {
  printModalBg.style.display = "none";
  printContent.innerHTML = "";
  currentPrintTeacherIndex = null;
};

printTeacherInfoBtn.onclick = function () {
  showPrintModal("info");
  setTimeout(() => {
    window.print();
  }, 100);
};
printCertificateBtn.onclick = function () {
  showPrintModal("certificate");
  setTimeout(() => {
    window.print();
  }, 100);
};
printPermissionBtn.onclick = function () {
  showPrintModal("permission");
  setTimeout(() => {
    window.print();
  }, 100);
};

function buildLogoHTML() {
  if (schoolLogoSrc)
    return `<img src="${schoolLogoSrc}" alt="logo" style="width:60px;vertical-align:middle;margin-right:10px;">`;
  return "";
}

function buildTeacherInfoHTML(t) {
  return `
    <div style="text-align:center;margin-bottom:8px;">
      ${buildLogoHTML()}
      <span style="font-size:1.3em;font-weight:bold;">ESCATO - Teacher Information</span>
    </div>
    <table style="width:100%;margin-top:10px;">
      <tr>
        <td colspan="2" style="text-align:center;">
          ${t.photo ? `<img src="${t.photo}" alt="Photo" style="width:90px;height:90px;border-radius:12px;" />` : ""}
        </td>
      </tr>
      <tr><td><b>Name:</b></td><td>${t.name}</td></tr>
      <tr><td><b>Identity Number:</b></td><td>${t.identityNumber}</td></tr>
      <tr><td><b>N° CNaPS:</b></td><td>${t.cnapsNumber}</td></tr>
      <tr><td><b>N° Mle:</b></td><td>${t.mleNumber}</td></tr>
      <tr><td><b>Subject:</b></td><td>${t.subject}</td></tr>
      <tr><td><b>Contact:</b></td><td>${t.contact}</td></tr>
      <tr><td><b>Email:</b></td><td>${t.email}</td></tr>
      <tr><td><b>N+Date of Birth:</b></td><td>${t.dob}</td></tr>
      <tr><td><b>Place of Birth:</b></td><td>${t.placeOfBirth || ""}</td></tr>
      <tr><td><b>Number of Children:</b></td><td>${t.numberOfChildren || ""}</td></tr>
      <tr><td><b>Marital Status:</b></td><td>${t.maritalStatus || ""}</td></tr>
      <tr><td><b>Hiring Date:</b></td><td>${t.hiringDate}</td></tr>
      <tr><td><b>Debauchery Date:</b></td><td>${t.debaucheryDate}</td></tr>
      <tr><td><b>Occupation:</b></td><td>${t.occupation}</td></tr>
      <tr><td><b>Permanent/Temporary:</b></td><td>${t.employmentType}</td></tr>
      <tr><td><b>Address:</b></td><td>${t.address}</td></tr>
      <tr><td><b>Religion:</b></td><td>${t.religion}</td></tr>
      <tr><td><b>Comment:</b></td><td>${t.comment}</td></tr>
    </table>
  `;
}

function buildWorkCertificateHTML(t) {
  return `
    <div style="text-align:center;margin-bottom:8px;">
      ${buildLogoHTML()}
      <span style="font-size:1.3em;font-weight:bold;">ESCATO - Certificate of Employment</span>
    </div>
    <p>This certifies that <b>${t.name}</b>, holder of Identity Number <b>${t.identityNumber}</b>, has served as <b>${t.occupation || t.subject}</b> at ESCATO.</p>
    <p>
      <b>Period:</b> ${t.hiringDate || "(Start date)"} to ${t.debaucheryDate || "(End date/Present)"}<br>
      <b>Employment type:</b> ${t.employmentType || "Not specified"}
    </p>
    <p>
      Given this day, ${new Date().toLocaleDateString()}<br>
      <i>(Signature and stamp)</i>
    </p>
  `;
}

function buildPermissionLetterHTML(t) {
  return `
    <div style="text-align:center;margin-bottom:8px;">
      ${buildLogoHTML()}
      <span style="font-size:1.3em;font-weight:bold;">ESCATO - Permission Letter</span>
    </div>
    <p>To whom it may concern,</p>
    <p>
      This is to confirm that <b>${t.name}</b>, Identity Number <b>${t.identityNumber}</b>, is employed at ESCATO as a <b>${t.occupation || t.subject}</b> (${t.employmentType || "N/A"}).
    </p>
    <p>
      The administration grants permission for the above-mentioned teacher to <u>__________________</u>.<br>
      (State purpose here)
    </p>
    <p>
      Given this day, ${new Date().toLocaleDateString()}<br>
      <i>(Signature and stamp)</i>
    </p>
  `;
}

// --- Print Teacher List ---
printTeacherListBtn.onclick = function () {
  buildAndPrintTeacherList();
};
function buildAndPrintTeacherList() {
  loadTeachers();
  let filter = (searchTeacherInput.value || "").toLowerCase().trim();

  let filteredTeachers = filter
    ? teachers.filter(t => Object.values(t).join(" ").toLowerCase().includes(filter))
    : teachers;

  let html = `
    <div style="text-align:center;margin-bottom:8px;">
      ${buildLogoHTML()}
      <span style="font-size:1.2em;font-weight:bold;">ESCATO - Teacher List</span>
      <br><span style="font-size:1em;">Printed on ${new Date().toLocaleDateString()}</span>
    </div>
    <table border="1" cellpadding="6" cellspacing="0" style="width:100%;font-size:0.93em;">
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
      <tbody>
        ${filteredTeachers.map(t => `
          <tr>
            <td>${t.name}</td>
            <td>${t.identityNumber}</td>
            <td>${t.cnapsNumber}</td>
            <td>${t.mleNumber}</td>
            <td>${t.subject}</td>
            <td>${t.contact}</td>
            <td>${t.email}</td>
            <td>${t.dob ? "N+" + t.dob : ""}</td>
            <td>${t.placeOfBirth || ""}</td>
            <td>${t.numberOfChildren || ""}</td>
            <td>${t.maritalStatus || ""}</td>
            <td>${t.hiringDate}</td>
            <td>${t.employmentType}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
  printListContent.innerHTML = html;
  printListSection.style.display = "block";
  setTimeout(() => {
    window.print();
    printListSection.style.display = "none";
    printListContent.innerHTML = "";
  }, 100);
}

// --- Search ---
searchTeacherInput.oninput = function () {
  renderTable();
};

// --- Teacher Detail Modal ---
function openTeacherDetail(index) {
  const t = teachers[index];
  teacherDetailContent.innerHTML = `
    <div style="text-align:center;margin-bottom:8px;">
      ${buildLogoHTML()}
      <span style="font-size:1.2em;font-weight:bold;">Teacher Details</span>
    </div>
    <div style="text-align:center;">
      ${t.photo ? `<img src="${t.photo}" alt="Photo" style="width:110px;height:110px;border-radius:12px;margin-bottom:10px;" />` : ""}
    </div>
    <table style="width:100%;margin-top:8px;">
      <tr><td><b>Name:</b></td><td>${t.name}</td></tr>
      <tr><td><b>Identity Number:</b></td><td>${t.identityNumber}</td></tr>
      <tr><td><b>N° CNaPS:</b></td><td>${t.cnapsNumber}</td></tr>
      <tr><td><b>N° Mle:</b></td><td>${t.mleNumber}</td></tr>
      <tr><td><b>Subject:</b></td><td>${t.subject}</td></tr>
      <tr><td><b>Contact:</b></td><td>${t.contact}</td></tr>
      <tr><td><b>Email:</b></td><td>${t.email}</td></tr>
      <tr><td><b>N+Date of Birth:</b></td><td>${t.dob}</td></tr>
      <tr><td><b>Place of Birth:</b></td><td>${t.placeOfBirth || ""}</td></tr>
      <tr><td><b>Number of Children:</b></td><td>${t.numberOfChildren || ""}</td></tr>
      <tr><td><b>Marital Status:</b></td><td>${t.maritalStatus || ""}</td></tr>
      <tr><td><b>Hiring Date:</b></td><td>${t.hiringDate}</td></tr>
      <tr><td><b>Debauchery Date:</b></td><td>${t.debaucheryDate}</td></tr>
      <tr><td><b>Occupation:</b></td><td>${t.occupation}</td></tr>
      <tr><td><b>Permanent/Temporary:</b></td><td>${t.employmentType}</td></tr>
      <tr><td><b>Address:</b></td><td>${t.address}</td></tr>
      <tr><td><b>Religion:</b></td><td>${t.religion}</td></tr>
      <tr><td><b>Comment:</b></td><td>${t.comment}</td></tr>
    </table>
  `;
  teacherDetailBg.style.display = "flex";
}
closeTeacherDetailBtn.onclick = function () {
  teacherDetailBg.style.display = "none";
  teacherDetailContent.innerHTML = "";
};

// --- On Load ---
window.onload = function () {
  resetForm();
  loadSchoolLogo();
  loadExtraPhoto();
  loadTeachers();
  renderTable();
};


