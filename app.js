/**
 * WorkSphere - Unified Online Job Portal Application Logic
 */

// ==========================================================================
// 1. INITIAL MOCK DATA & STATE PERSISTENCE
// ==========================================================================
const INITIAL_JOBS = [
  { id: "job-1", title: "Senior Full Stack Engineer", company: "Stripe", location: "San Francisco, CA", workMode: "Remote", type: "Full-time", experience: "Senior Level", salary: "$145,000 - $180,000", skills: ["React", "Node.js", "TypeScript"], description: "Join Stripe to build robust APIs.", status: "Active", applicantsCount: 3 },
  { id: "job-2", title: "Product Designer", company: "Figma", location: "New York, NY", workMode: "Hybrid", type: "Full-time", experience: "Mid Level", salary: "$110,000 - $135,000", skills: ["Figma", "UI/UX"], description: "Shape the future of design.", status: "Active", applicantsCount: 1 }
];

const INITIAL_APPS = [
  { id: "app-1", jobId: "job-1", jobTitle: "Senior Full Stack Engineer", company: "Stripe", applicantName: "Alex Morgan", applicantEmail: "alex@example.com", appliedDate: "2026-03-25", status: "Shortlisted", coverLetter: "10+ years experience.", interview: null }
];

const INITIAL_USERS = [
  { id: "u-1", name: "Alex Morgan", email: "alex@example.com", role: "Job Seeker", status: "Active" },
  { id: "u-2", name: "Stripe HR", email: "hr@stripe.com", role: "Recruiter", status: "Verified" }
];

const loadState = (key, fallback) => {
  const data = localStorage.getItem(`worksphere_${key}`);
  return data ? JSON.parse(data) : fallback;
};

const saveState = (key, data) => {
  localStorage.setItem(`worksphere_${key}`, JSON.stringify(data));
};

// Application Auth and Data State Store
let authState = loadState("auth", { isLoggedIn: false, role: "seeker", name: "" });

let appState = {
  currentRole: authState.role,
  jobs: loadState("jobs", INITIAL_JOBS),
  applications: loadState("applications", INITIAL_APPS),
  users: loadState("users", INITIAL_USERS),
  reports: loadState("reports", []),
  bookmarks: loadState("bookmarks", ["job-1"]),
  currentTab: "find-jobs",
  filter: { search: "", mode: "all", experience: "all" }
};

// ==========================================================================
// 2. INITIALIZATION & DOM EVENTS
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  initEventListeners();
  initAuthFlow();
});

function initEventListeners() {
  // Global Theme toggle
  document.getElementById("themeToggle").addEventListener("click", () => {
    const currentTheme = document.body.getAttribute("data-theme");
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    document.body.setAttribute("data-theme", nextTheme);
    document.getElementById("themeToggle").innerHTML = nextTheme === "dark" ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
  });

  // Global search
  document.getElementById("globalSearchInput").addEventListener("input", (e) => {
    appState.filter.search = e.target.value.toLowerCase();
    if (appState.currentTab === "find-jobs" || appState.currentTab === "admin-jobs") renderWorkspace();
  });

  // Notifications
  document.getElementById("notifBtn").addEventListener("click", () => {
    document.getElementById("notifDropdown").classList.toggle("active");
  });
  document.getElementById("markAllRead").addEventListener("click", () => {
    document.getElementById("notifBadge").style.display = "none";
    document.getElementById("notifDropdown").classList.remove("active");
  });

  // Forms Binding
  document.getElementById("postJobForm").addEventListener("submit", handleJobSubmit);
  document.getElementById("applyJobForm").addEventListener("submit", handleApplySubmit);
  document.getElementById("scheduleForm").addEventListener("submit", handleScheduleSubmit);
  document.getElementById("reportForm").addEventListener("submit", handleReportSubmit);

  // Authentication logic (Login Tab Switcher)
  document.querySelectorAll('.role-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      document.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
    });
  });

  // Login Submit
  document.getElementById("loginForm").addEventListener("submit", handleLogin);
}

// ==========================================================================
// 3. AUTHENTICATION LOGIC (LOGIN / LOGOUT)
// ==========================================================================

function initAuthFlow() {
  if (authState.isLoggedIn) {
    showMainApp();
  } else {
    showLoginScreen();
  }
}

function handleLogin(e) {
  e.preventDefault();
  const role = document.querySelector('.role-tab.active').dataset.role;
  const email = document.getElementById('loginEmail').value;
  
  // Format mock name based on email prefix or role
  let name = email.split('@')[0].replace(/[^a-zA-Z]/g, ' ');
  name = name.charAt(0).toUpperCase() + name.slice(1);
  if (role === 'admin') name = 'System Administrator';
  if (role === 'recruiter') name = name + ' (HR)';

  // Update Auth State
  authState = { isLoggedIn: true, role: role, name: name };
  saveState("auth", authState);
  
  appState.currentRole = role;
  
  toast(`Welcome back, ${name}!`, "success");
  showMainApp();
}

function handleLogout() {
  authState = { isLoggedIn: false, role: "seeker", name: "" };
  saveState("auth", authState);
  document.getElementById("loginForm").reset();
  showLoginScreen();
  toast("Logged out successfully.", "info");
}

function showLoginScreen() {
  document.getElementById("mainAppScreen").classList.add("hidden");
  document.getElementById("authScreen").classList.remove("hidden");
}

function showMainApp() {
  document.getElementById("authScreen").classList.add("hidden");
  document.getElementById("mainAppScreen").classList.remove("hidden");
  
  // Set default tabs based on Role
  if (appState.currentRole === "seeker") appState.currentTab = "find-jobs";
  if (appState.currentRole === "recruiter") appState.currentTab = "manage-jobs";
  if (appState.currentRole === "admin") appState.currentTab = "admin-dashboard";

  // Update UI Elements
  document.getElementById("currentUserName").textContent = authState.name;
  
  renderSidebar();
  renderWorkspace();
  updateNotifications();
}

// ==========================================================================
// 4. SIDEBAR & NAVIGATION
// ==========================================================================

const SIDEBAR_MENUS = {
  seeker: [
    { id: "find-jobs", icon: "fa-compass", label: "Explore Jobs" },
    { id: "my-applications", icon: "fa-paper-plane", label: "My Applications" },
    { id: "saved-jobs", icon: "fa-bookmark", label: "Saved Jobs" },
    { id: "seeker-profile", icon: "fa-user", label: "Candidate Profile" }
  ],
  recruiter: [
    { id: "manage-jobs", icon: "fa-list-check", label: "Manage Jobs" },
    { id: "applicants-pipeline", icon: "fa-users", label: "Applicant Pipeline" },
    { id: "company-profile", icon: "fa-building", label: "Company Profile" }
  ],
  admin: [
    { id: "admin-dashboard", icon: "fa-chart-pie", label: "Overview" },
    { id: "admin-users", icon: "fa-users-gear", label: "Manage Users" },
    { id: "admin-jobs", icon: "fa-briefcase", label: "Job Moderation" },
    { id: "admin-reports", icon: "fa-shield-halved", label: "Reports" }
  ]
};

function renderSidebar() {
  const sidebar = document.getElementById("sidebarMenu");
  const menuItems = SIDEBAR_MENUS[appState.currentRole] || [];

  sidebar.innerHTML = menuItems.map(item => `
    <a class="nav-link ${appState.currentTab === item.id ? 'active' : ''}" onclick="switchTab('${item.id}')">
      <i class="fa-solid ${item.icon}"></i>
      <span>${item.label}</span>
    </a>
  `).join("");
}

function switchTab(tabId) {
  appState.currentTab = tabId;
  renderSidebar();
  renderWorkspace();
}

// ==========================================================================
// 5. WORKSPACE ROUTING
// ==========================================================================

function renderWorkspace() {
  const container = document.getElementById("workspace");
  container.innerHTML = "";

  switch (appState.currentTab) {
    case "find-jobs": renderFindJobs(container); break;
    case "my-applications": renderMyApplications(container); break;
    case "saved-jobs": renderSavedJobs(container); break;
    case "seeker-profile": renderSeekerProfile(container); break;
    case "manage-jobs": renderManageJobs(container); break;
    case "applicants-pipeline": renderApplicantsPipeline(container); break;
    case "company-profile": renderCompanyProfile(container); break;
    case "admin-dashboard": renderAdminDashboard(container); break;
    case "admin-users": renderAdminUsers(container); break;
    case "admin-jobs": renderAdminJobModeration(container); break;
    case "admin-reports": renderAdminReports(container); break;
    default: container.innerHTML = `<p>View not found.</p>`;
  }
}

// ==========================================================================
// 6. VIEW COMPONENTS (Abridged core functions)
// ==========================================================================

function renderFindJobs(container) {
  const filteredJobs = appState.jobs.filter(job => {
    const matchSearch = job.title.toLowerCase().includes(appState.filter.search);
    return matchSearch && job.status === "Active";
  });

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title"><h2>Explore Careers</h2><p>Discover top roles</p></div>
    </div>
    <div class="job-cards-grid">
      ${filteredJobs.map(job => renderJobCardHTML(job)).join("")}
    </div>
  `;
}

function renderJobCardHTML(job) {
  const isBookmarked = appState.bookmarks.includes(job.id);
  return `
    <div class="job-card">
      <div class="job-card-header">
        <div class="company-badge">
          <div class="company-logo">${job.company.substring(0, 2).toUpperCase()}</div>
          <div class="company-meta"><h4>${job.title}</h4><span>${job.company}</span></div>
        </div>
        <button class="bookmark-btn ${isBookmarked ? 'saved' : ''}" onclick="toggleBookmark('${job.id}')">
          <i class="fa-${isBookmarked ? 'solid' : 'regular'} fa-bookmark"></i>
        </button>
      </div>
      <div class="job-tags">
        <span class="tag">${job.type}</span><span class="tag">${job.workMode}</span>
      </div>
      <p style="font-size:0.875rem; color:var(--text-muted); margin: 1rem 0;">${job.description.substring(0,60)}...</p>
      <div class="job-card-footer">
        <span class="salary-text">${job.salary}</span>
        <div style="display:flex; gap:0.5rem;">
          <button class="btn btn-outline btn-sm" onclick="openJobDetails('${job.id}')">View</button>
          <button class="btn btn-primary btn-sm" onclick="openApplyModal('${job.id}')">Apply</button>
        </div>
      </div>
    </div>
  `;
}

function toggleBookmark(jobId) {
  if (appState.bookmarks.includes(jobId)) {
    appState.bookmarks = appState.bookmarks.filter(id => id !== jobId);
  } else {
    appState.bookmarks.push(jobId);
  }
  saveState("bookmarks", appState.bookmarks);
  renderWorkspace();
}

function renderMyApplications(container) {
  container.innerHTML = `
    <div class="page-header"><div class="page-title"><h2>My Applications</h2></div></div>
    <div class="table-container">
      <table class="data-table">
        <thead><tr><th>Role</th><th>Date</th><th>Status</th></tr></thead>
        <tbody>
          ${appState.applications.map(app => `<tr><td><strong>${app.jobTitle}</strong><br/>${app.company}</td><td>${app.appliedDate}</td><td><span class="status-pill status-${app.status}">${app.status}</span></td></tr>`).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderManageJobs(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-title"><h2>Manage Listings</h2></div>
      <button class="btn btn-primary" onclick="openPostJobModal()">Post Job</button>
    </div>
    <div class="table-container">
      <table class="data-table">
        <thead><tr><th>Title</th><th>Location</th><th>Applicants</th><th>Actions</th></tr></thead>
        <tbody>
          ${appState.jobs.map(job => `<tr><td>${job.title}</td><td>${job.location}</td><td>${job.applicantsCount||0}</td>
          <td><button class="btn btn-danger btn-sm" onclick="deleteJob('${job.id}')">Delete</button></td></tr>`).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderApplicantsPipeline(container) {
  container.innerHTML = `
    <div class="page-header"><div class="page-title"><h2>Applicants</h2></div></div>
    <div class="table-container">
      <table class="data-table">
        <thead><tr><th>Candidate</th><th>Role</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          ${appState.applications.map(app => `
            <tr>
              <td>${app.applicantName}</td><td>${app.jobTitle}</td><td><span class="status-pill status-${app.status}">${app.status}</span></td>
              <td><button class="btn btn-primary btn-sm" onclick="openScheduleModal('${app.id}', '${app.applicantName}')">Schedule</button></td>
            </tr>`).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderAdminDashboard(container) { container.innerHTML = `<div class="page-header"><div class="page-title"><h2>Admin Metrics</h2><p>Systems online.</p></div></div>`; }
function renderSavedJobs(container) { container.innerHTML = `<div class="page-header"><div class="page-title"><h2>Saved Jobs</h2></div></div><div class="job-cards-grid">${appState.jobs.filter(j=>appState.bookmarks.includes(j.id)).map(job=>renderJobCardHTML(job)).join("")}</div>`; }
function renderSeekerProfile(container) { container.innerHTML = `<h3>Profile Section</h3><p>Manage your professional details.</p>`; }
function renderCompanyProfile(container) { container.innerHTML = `<h3>Company Settings</h3><p>Update employer branding.</p>`; }
function renderAdminUsers(container) { container.innerHTML = `<h3>Users Dashboard</h3><p>Total users: ${appState.users.length}</p>`; }
function renderAdminJobModeration(container) { container.innerHTML = `<h3>Moderation</h3><p>Clean up spam.</p>`; }
function renderAdminReports(container) { container.innerHTML = `<h3>Reports</h3><p>Active reports: ${appState.reports.length}</p>`; }

// ==========================================================================
// 7. MODAL LOGIC & ACTIONS
// ==========================================================================

function openModal(modalId) { document.getElementById(modalId).classList.add("active"); }
function closeModal(modalId) { document.getElementById(modalId).classList.remove("active"); }

function openJobDetails(jobId) {
  const job = appState.jobs.find(j => j.id === jobId);
  document.getElementById("detailJobTitle").textContent = job.title;
  document.getElementById("detailContent").innerHTML = `<p>${job.description}</p>`;
  document.getElementById("detailFooter").innerHTML = `<button class="btn btn-primary" onclick="closeModal('jobDetailModal'); openApplyModal('${job.id}');">Apply Now</button>`;
  openModal("jobDetailModal");
}

function openApplyModal(jobId) {
  document.getElementById("applyJobId").value = jobId;
  openModal("applyModal");
}

function handleApplySubmit(e) {
  e.preventDefault();
  closeModal("applyModal");
  toast("Application submitted successfully!", "success");
}

function openPostJobModal() {
  document.getElementById("postJobForm").reset();
  openModal("postJobModal");
}

function handleJobSubmit(e) {
  e.preventDefault();
  closeModal("postJobModal");
  toast("Job Posted successfully!", "success");
}

function deleteJob(jobId) {
  appState.jobs = appState.jobs.filter(j => j.id !== jobId);
  saveState("jobs", appState.jobs);
  toast("Job removed", "danger");
  renderWorkspace();
}

function openScheduleModal(appId, name) {
  document.getElementById("schedCandidateName").value = name;
  openModal("scheduleModal");
}

function handleScheduleSubmit(e) {
  e.preventDefault();
  closeModal("scheduleModal");
  toast("Interview Scheduled!", "success");
}

function handleReportSubmit(e) {
  e.preventDefault();
  closeModal("reportModal");
  toast("Report sent to Admins.", "info");
}

function toast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  const toastEl = document.createElement("div");
  toastEl.className = "toast";
  toastEl.innerHTML = `<span>${message}</span>`;
  container.appendChild(toastEl);
  setTimeout(() => toastEl.remove(), 3000);
}

function updateNotifications() {
  document.getElementById("notifList").innerHTML = `<li class="notif-item">No new alerts</li>`;
}
