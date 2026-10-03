/**
 * WorkSphere - Unified Online Job Portal Application Logic
 */

// ==========================================================================
// 1. DATA STORES & PERSISTENCE
// ==========================================================================

const INITIAL_JOBS = [
  {
    id: "job-101",
    title: "Senior Full Stack Engineer",
    company: "Stripe",
    location: "San Francisco, CA",
    workMode: "Remote",
    type: "Full-time",
    experience: "Senior Level",
    salary: "$145,000 - $180,000",
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL"],
    description: "Build robust developer APIs and payment infrastructure scaled globally.",
    postedDate: "2026-03-24",
    status: "Active", // Active, Pending, Expired, Rejected
    recruiterId: "u-rec-1",
    applicantsCount: 45
  },
  {
    id: "job-102",
    title: "Product Designer (UI/UX)",
    company: "Figma",
    location: "New York, NY",
    workMode: "Hybrid",
    type: "Full-time",
    experience: "Mid Level",
    salary: "$110,000 - $135,000",
    skills: ["Figma", "Design Systems", "Prototyping", "User Research"],
    description: "Shape intuitive collaborative interface experiences for product designers worldwide.",
    postedDate: "2026-03-22",
    status: "Active",
    recruiterId: "u-rec-2",
    applicantsCount: 28
  },
  {
    id: "job-103",
    title: "DevOps & Cloud Architect",
    company: "Amazon Web Services",
    location: "Seattle, WA",
    workMode: "Onsite",
    type: "Full-time",
    experience: "Lead / Executive",
    salary: "$165,000 - $210,000",
    skills: ["AWS", "Kubernetes", "Terraform", "CI/CD"],
    description: "Architect mission-critical cloud backbones with high uptime.",
    postedDate: "2026-03-25",
    status: "Active",
    recruiterId: "u-rec-3",
    applicantsCount: 34
  },
  {
    id: "job-104",
    title: "Entry Level Data Analyst",
    company: "ABC Technologies",
    location: "Austin, TX",
    workMode: "Remote",
    type: "Full-time",
    experience: "Entry Level",
    salary: "$65,000 - $80,000",
    skills: ["SQL", "Python", "Excel", "Tableau"],
    description: "Evaluate pipeline queries and generate business performance metrics.",
    postedDate: "2026-03-20",
    status: "Pending",
    recruiterId: "u-rec-4",
    applicantsCount: 12
  },
  {
    id: "job-105",
    title: "Legacy PHP Web Developer",
    company: "XYZ Company",
    location: "Chicago, IL",
    workMode: "Onsite",
    type: "Contract",
    experience: "Mid Level",
    salary: "$70,000 - $85,000",
    skills: ["PHP", "MySQL", "jQuery"],
    description: "Maintain legacy internal portals and backoffice databases.",
    postedDate: "2026-01-15",
    status: "Expired",
    recruiterId: "u-rec-2",
    applicantsCount: 18
  }
];

const INITIAL_USERS = [
  { id: "u-sek-1", name: "Alex Morgan", email: "alex.morgan@example.com", role: "Job Seeker", status: "Active", joined: "2026-01-10" },
  { id: "u-sek-2", name: "Rahul Sharma", email: "rahul.s@example.com", role: "Job Seeker", status: "Active", joined: "2026-02-14" },
  { id: "u-sek-3", name: "Priya Patel", email: "priya.p@example.com", role: "Job Seeker", status: "Blocked", joined: "2026-02-28" },
  { id: "u-rec-1", name: "Sarah Jenkins", email: "sarah@stripe.com", role: "Recruiter", company: "Stripe", status: "Approved", joined: "2026-01-05" },
  { id: "u-rec-2", name: "David Miller", email: "david@figma.com", role: "Recruiter", company: "Figma", status: "Approved", joined: "2026-01-18" },
  { id: "u-rec-3", name: "Elena Rostova", email: "elena@amazon.com", role: "Recruiter", company: "Amazon Web Services", status: "Approved", joined: "2026-02-01" },
  { id: "u-rec-4", name: "John FakeAgent", email: "admin@abctech.fake", role: "Recruiter", company: "ABC Technologies", status: "Pending", joined: "2026-03-22" },
  { id: "u-adm-1", name: "Platform Admin", email: "admin@worksphere.com", role: "Admin", status: "Active", joined: "2025-12-01" }
];

const INITIAL_APPLICATIONS = [
  {
    id: "app-1",
    jobId: "job-101",
    jobTitle: "Senior Full Stack Engineer",
    company: "Stripe",
    applicantName: "Alex Morgan",
    applicantEmail: "alex.morgan@example.com",
    appliedDate: "2026-03-25",
    status: "Shortlisted",
    interview: { dateTime: "2026-04-02T15:00", mode: "Online", link: "https://meet.google.com/xyz-worksphere" }
  },
  {
    id: "app-2",
    jobId: "job-102",
    jobTitle: "Product Designer (UI/UX)",
    company: "Figma",
    applicantName: "Alex Morgan",
    applicantEmail: "alex.morgan@example.com",
    appliedDate: "2026-03-23",
    status: "Interview",
    interview: { dateTime: "2026-03-30T10:00", mode: "Online", link: "https://zoom.us/j/987654321" }
  },
  {
    id: "app-3",
    jobId: "job-103",
    jobTitle: "DevOps & Cloud Architect",
    company: "Amazon Web Services",
    applicantName: "Rahul Sharma",
    applicantEmail: "rahul.s@example.com",
    appliedDate: "2026-03-25",
    status: "Applied",
    interview: null
  },
  {
    id: "app-4",
    jobId: "job-104",
    jobTitle: "Entry Level Data Analyst",
    company: "ABC Technologies",
    applicantName: "Priya Patel",
    applicantEmail: "priya.p@example.com",
    appliedDate: "2026-03-26",
    status: "UnderReview",
    interview: null
  }
];

const INITIAL_REPORTS = [
  {
    id: "rep-1",
    type: "Fake Job",
    company: "ABC Technologies",
    jobTitle: "Entry Level Data Analyst",
    reason: "Fake Job / Demanding advance fees",
    details: "Recruiter asking for $50 registration fee via Telegram.",
    status: "Pending", // Pending, Reviewed, Resolved
    reportedDate: "2026-03-26"
  },
  {
    id: "rep-2",
    type: "Spam",
    company: "XYZ Company",
    jobTitle: "Legacy PHP Web Developer",
    reason: "Duplicate Posting",
    details: "Same position reposted 8 times within 24 hours.",
    status: "Reviewed",
    reportedDate: "2026-03-24"
  },
  {
    id: "rep-3",
    type: "Wrong Details",
    company: "Example Pvt Ltd",
    jobTitle: "Customer Support Specialist",
    reason: "Misleading Salary",
    details: "Advertised $90k but offer letter stated commission-only.",
    status: "Pending",
    reportedDate: "2026-03-27"
  }
];

// LocalStorage helpers
const loadState = (key, fallback) => {
  const data = localStorage.getItem(`ws_${key}`);
  return data ? JSON.parse(data) : fallback;
};

const saveState = (key, data) => {
  localStorage.setItem(`ws_${key}`, JSON.stringify(data));
};

// Global App State
let state = {
  currentUser: loadState("currentUser", null), // null if logged out
  jobs: loadState("jobs", INITIAL_JOBS),
  users: loadState("users", INITIAL_USERS),
  applications: loadState("applications", INITIAL_APPLICATIONS),
  reports: loadState("reports", INITIAL_REPORTS),
  bookmarks: loadState("bookmarks", ["job-101"]),
  currentTab: "find-jobs",
  searchTerm: "",
  userFilterRole: "all",
  jobFilterStatus: "all"
};

// ==========================================================================
// 2. AUTHENTICATION CONTROLLER (LOGIN / LOGOUT)
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  initGlobalListeners();
  checkAuthSession();
});

function initGlobalListeners() {
  // Login Form Submission
  document.getElementById("loginForm").addEventListener("submit", handleLoginSubmit);

  // Theme Toggle
  document.getElementById("themeToggle").addEventListener("click", () => {
    const currentTheme = document.body.getAttribute("data-theme");
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    document.body.setAttribute("data-theme", nextTheme);
    document.getElementById("themeToggle").innerHTML = nextTheme === "dark" 
      ? '<i class="fa-solid fa-sun"></i>' 
      : '<i class="fa-solid fa-moon"></i>';
  });

  // Global Search Input
  document.getElementById("globalSearchInput").addEventListener("input", (e) => {
    state.searchTerm = e.target.value.toLowerCase();
    renderWorkspace();
  });

  // Notifications Popover
  const notifBtn = document.getElementById("notifBtn");
  const notifDropdown = document.getElementById("notifDropdown");
  notifBtn.addEventListener("click", () => notifDropdown.classList.toggle("active"));

  document.getElementById("markAllRead").addEventListener("click", () => {
    document.getElementById("notifBadge").style.display = "none";
    toast("All alerts marked as read", "success");
    notifDropdown.classList.remove("active");
  });

  // Modal Form Submissions
  document.getElementById("postJobForm").addEventListener("submit", handlePostJobSubmit);
  document.getElementById("applyJobForm").addEventListener("submit", handleApplyJobSubmit);
  document.getElementById("scheduleForm").addEventListener("submit", handleScheduleSubmit);
  document.getElementById("reportForm").addEventListener("submit", handleReportSubmit);
}

function selectAuthRole(role) {
  document.querySelectorAll(".role-tab").forEach(tab => tab.classList.remove("active"));
  document.querySelector(`.role-tab[data-role="${role}"]`).classList.add("active");
  document.getElementById("loginRole").value = role;

  const emailField = document.getElementById("loginEmail");
  if (role === "seeker") emailField.value = "alex.morgan@example.com";
  if (role === "recruiter") emailField.value = "sarah@stripe.com";
  if (role === "admin") emailField.value = "admin@worksphere.com";
}

function quickLogin(role) {
  selectAuthRole(role);
  document.getElementById("loginPassword").value = "password123";
  document.getElementById("loginForm").dispatchEvent(new Event("submit"));
}

function handleLoginSubmit(e) {
  e.preventDefault();
  const role = document.getElementById("loginRole").value;
  const email = document.getElementById("loginEmail").value.trim();

  let userProfile = {
    email: email,
    role: role,
    name: role === "seeker" ? "Alex Morgan" : role === "recruiter" ? "Sarah Jenkins" : "System Administrator"
  };

  state.currentUser = userProfile;
  saveState("currentUser", userProfile);

  // Set default initial view tab per role
  if (role === "seeker") state.currentTab = "find-jobs";
  else if (role === "recruiter") state.currentTab = "manage-jobs";
  else if (role === "admin") state.currentTab = "admin-dashboard";

  toast(`Welcome back, ${userProfile.name}!`, "success");
  checkAuthSession();
}

function handleLogout() {
  state.currentUser = null;
  saveState("currentUser", null);
  toast("You have been signed out safely", "info");
  checkAuthSession();
}

function checkAuthSession() {
  const authScreen = document.getElementById("authScreen");
  const mainApp = document.getElementById("mainApp");

  if (!state.currentUser) {
    authScreen.style.display = "flex";
    mainApp.style.display = "none";
  } else {
    authScreen.style.display = "none";
    mainApp.style.display = "block";

    // Setup navbar identity badge
    document.getElementById("currentUserName").textContent = state.currentUser.name;
    document.getElementById("activeRoleText").textContent = state.currentUser.role.toUpperCase();

    renderSidebar();
    renderWorkspace();
    updateNotifications();
  }
}

// ==========================================================================
// 3. SIDEBAR CONFIG & WORKSPACE ROUTING
// ==========================================================================

const ROLE_NAV_ITEMS = {
  seeker: [
    { id: "find-jobs", icon: "fa-compass", label: "Search & Browse Jobs" },
    { id: "my-applications", icon: "fa-paper-plane", label: "My Applications" },
    { id: "saved-jobs", icon: "fa-bookmark", label: "Saved Jobs" },
    { id: "seeker-profile", icon: "fa-user", label: "My Career Profile" }
  ],
  recruiter: [
    { id: "manage-jobs", icon: "fa-list-check", label: "Job Postings" },
    { id: "recruiter-pipeline", icon: "fa-users", label: "Applicants Pipeline" },
    { id: "recruiter-profile", icon: "fa-building", label: "Company Profile" }
  ],
  admin: [
    { id: "admin-dashboard", icon: "fa-chart-pie", label: "1. Dashboard Overview" },
    { id: "admin-users", icon: "fa-users-gear", label: "2. Manage Users" },
    { id: "admin-jobs", icon: "fa-briefcase", label: "3. Manage Jobs" },
    { id: "admin-recruiters", icon: "fa-building-shield", label: "4. Manage Recruiters" },
    { id: "admin-applications", icon: "fa-file-lines", label: "5. Manage Applications" },
    { id: "admin-reports", icon: "fa-triangle-exclamation", label: "6. Reports Desk" },
    { id: "admin-analytics", icon: "fa-chart-line", label: "7. Analytics & Charts" }
  ]
};

function renderSidebar() {
  const sidebar = document.getElementById("sidebarMenu");
  const menuItems = ROLE_NAV_ITEMS[state.currentUser.role] || [];

  sidebar.innerHTML = menuItems.map(item => `
    <a class="nav-link ${state.currentTab === item.id ? 'active' : ''}" onclick="switchTab('${item.id}')">
      <i class="fa-solid ${item.icon}"></i>
      <span>${item.label}</span>
    </a>
  `).join("");
}

function switchTab(tabId) {
  state.currentTab = tabId;
  renderSidebar();
  renderWorkspace();
}

function renderWorkspace() {
  const container = document.getElementById("workspace");
  container.innerHTML = "";

  switch (state.currentTab) {
    // --- SEEKER ---
    case "find-jobs": renderSeekerFindJobs(container); break;
    case "my-applications": renderSeekerApplications(container); break;
    case "saved-jobs": renderSeekerSavedJobs(container); break;
    case "seeker-profile": renderSeekerProfile(container); break;

    // --- RECRUITER ---
    case "manage-jobs": renderRecruiterManageJobs(container); break;
    case "recruiter-pipeline": renderRecruiterPipeline(container); break;
    case "recruiter-profile": renderRecruiterProfile(container); break;

    // --- ADMIN SUITE (7 MODULES) ---
    case "admin-dashboard": renderAdminDashboard(container); break;
    case "admin-users": renderAdminManageUsers(container); break;
    case "admin-jobs": renderAdminManageJobs(container); break;
    case "admin-recruiters": renderAdminManageRecruiters(container); break;
    case "admin-applications": renderAdminManageApplications(container); break;
    case "admin-reports": renderAdminReports(container); break;
    case "admin-analytics": renderAdminAnalytics(container); break;

    default: container.innerHTML = `<p>Tab not found.</p>`;
  }
}

// ==========================================================================
// 4. ADMIN MODULES (ALL 7 SECTIONS)
// ==========================================================================

// 1. Dashboard Overview
function renderAdminDashboard(container) {
  const pendingReportsCount = state.reports.filter(r => r.status === "Pending").length;
  const activeJobsCount = state.jobs.filter(j => j.status === "Active").length;

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <h2>Administrator Overview Desk</h2>
        <p>Real-time platform metrics and ecosystem overview</p>
      </div>
      <button class="btn btn-primary btn-sm" onclick="switchTab('admin-analytics')">
        <i class="fa-solid fa-chart-line"></i> View Full Analytics
      </button>
    </div>

    <!-- 6 Primary Dashboard Stats Requested -->
    <div class="stats-grid-6">
      <div class="stat-card" onclick="switchTab('admin-users')" style="cursor:pointer;">
        <div class="stat-icon primary"><i class="fa-solid fa-users"></i></div>
        <div class="stat-info">
          <h3>1,250</h3>
          <span>Total Users</span>
        </div>
      </div>
      <div class="stat-card" onclick="switchTab('admin-users')" style="cursor:pointer;">
        <div class="stat-icon info"><i class="fa-solid fa-user-graduate"></i></div>
        <div class="stat-info">
          <h3>980</h3>
          <span>Job Seekers</span>
        </div>
      </div>
      <div class="stat-card" onclick="switchTab('admin-recruiters')" style="cursor:pointer;">
        <div class="stat-icon warning"><i class="fa-solid fa-building"></i></div>
        <div class="stat-info">
          <h3>270</h3>
          <span>Recruiters</span>
        </div>
      </div>
      <div class="stat-card" onclick="switchTab('admin-jobs')" style="cursor:pointer;">
        <div class="stat-icon success"><i class="fa-solid fa-briefcase"></i></div>
        <div class="stat-info">
          <h3>156</h3>
          <span>Active Jobs</span>
        </div>
      </div>
      <div class="stat-card" onclick="switchTab('admin-applications')" style="cursor:pointer;">
        <div class="stat-icon primary"><i class="fa-solid fa-file-invoice"></i></div>
        <div class="stat-info">
          <h3>2,430</h3>
          <span>Applications</span>
        </div>
      </div>
      <div class="stat-card" onclick="switchTab('admin-reports')" style="cursor:pointer;">
        <div class="stat-icon danger"><i class="fa-solid fa-flag"></i></div>
        <div class="stat-info">
          <h3>${12 + pendingReportsCount - 2}</h3>
          <span>Pending Reports</span>
        </div>
      </div>
    </div>

    <!-- Quick Moderation Queues -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem;">
      <div class="table-container" style="padding:1.25rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
          <h4 style="font-size:0.95rem;"><i class="fa-solid fa-triangle-exclamation text-warning"></i> Recent Reports Requiring Action</h4>
          <button class="text-btn" onclick="switchTab('admin-reports')">View All</button>
        </div>
        <table class="data-table">
          <thead>
            <tr><th>Report Type</th><th>Target / Company</th><th>Status</th></tr>
          </thead>
          <tbody>
            ${state.reports.slice(0, 3).map(r => `
              <tr>
                <td><strong>${r.type}</strong></td>
                <td>${r.company}</td>
                <td><span class="status-pill status-${r.status}">${r.status}</span></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>

      <div class="table-container" style="padding:1.25rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
          <h4 style="font-size:0.95rem;"><i class="fa-solid fa-user-check text-primary"></i> Pending Recruiter Approvals</h4>
          <button class="text-btn" onclick="switchTab('admin-recruiters')">Manage</button>
        </div>
        <table class="data-table">
          <thead>
            <tr><th>Recruiter</th><th>Company</th><th>Action</th></tr>
          </thead>
          <tbody>
            ${state.users.filter(u => u.role === "Recruiter" && u.status === "Pending").map(rec => `
              <tr>
                <td>${rec.name}</td>
                <td>${rec.company}</td>
                <td>
                  <button class="btn btn-success btn-sm" onclick="adminApproveRecruiter('${rec.id}')">Approve</button>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// 2. Manage Users
function renderAdminManageUsers(container) {
  const filteredUsers = state.users.filter(u => {
    const matchRole = state.userFilterRole === "all" || u.role.toLowerCase() === state.userFilterRole.toLowerCase();
    const matchSearch = u.name.toLowerCase().includes(state.searchTerm) || u.email.toLowerCase().includes(state.searchTerm);
    return matchRole && matchSearch;
  });

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <h2>Manage Platform Users</h2>
        <p>View, search, block, and manage access for job seekers and recruiters</p>
      </div>
    </div>

    <div class="filter-bar">
      <div class="filter-group">
        <label><i class="fa-solid fa-filter"></i> User Category:</label>
        <select onchange="state.userFilterRole = this.value; renderAdminManageUsers(document.getElementById('workspace'));">
          <option value="all" ${state.userFilterRole === 'all' ? 'selected' : ''}>All Users</option>
          <option value="Job Seeker" ${state.userFilterRole === 'Job Seeker' ? 'selected' : ''}>Job Seekers (980)</option>
          <option value="Recruiter" ${state.userFilterRole === 'Recruiter' ? 'selected' : ''}>Recruiters (270)</option>
        </select>
      </div>
      <div class="filter-group" style="margin-left:auto;">
        <span>Showing <strong>${filteredUsers.length}</strong> active profiles</span>
      </div>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>User Details</th>
            <th>Role</th>
            <th>Registered Date</th>
            <th>Account Status</th>
            <th>Moderation Actions</th>
          </tr>
        </thead>
        <tbody>
          ${filteredUsers.map(u => `
            <tr>
              <td>
                <strong>${u.name}</strong><br/>
                <span style="font-size:0.8rem; color:var(--text-muted);">${u.email}</span>
              </td>
              <td>${u.role}</td>
              <td>${u.joined}</td>
              <td><span class="status-pill status-${u.status === 'Active' || u.status === 'Approved' ? 'Active' : u.status === 'Blocked' ? 'Blocked' : 'Pending'}">${u.status}</span></td>
              <td>
                <div style="display:flex; gap:0.4rem;">
                  <button class="btn btn-outline btn-sm" onclick="adminToggleBlockUser('${u.id}')">
                    ${u.status === 'Blocked' ? '<i class="fa-solid fa-unlock"></i> Unblock' : '<i class="fa-solid fa-ban"></i> Block'}
                  </button>
                  <button class="btn btn-danger btn-sm" onclick="adminDeleteUser('${u.id}')">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function adminToggleBlockUser(userId) {
  const user = state.users.find(u => u.id === userId);
  if (user) {
    user.status = user.status === "Blocked" ? "Active" : "Blocked";
    saveState("users", state.users);
    toast(`User status set to ${user.status}`, "info");
    renderWorkspace();
  }
}

function adminDeleteUser(userId) {
  if (confirm("Delete this user account permanently?")) {
    state.users = state.users.filter(u => u.id !== userId);
    saveState("users", state.users);
    toast("User account permanently removed", "danger");
    renderWorkspace();
  }
}

// 3. Manage Jobs
function renderAdminManageJobs(container) {
  const filteredJobs = state.jobs.filter(j => {
    const matchStatus = state.jobFilterStatus === "all" || j.status.toLowerCase() === state.jobFilterStatus.toLowerCase();
    const matchSearch = j.title.toLowerCase().includes(state.searchTerm) || j.company.toLowerCase().includes(state.searchTerm);
    return matchStatus && matchSearch;
  });

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <h2>Manage Posted Jobs</h2>
        <p>Approve, reject, edit, mark expired, or purge listings</p>
      </div>
    </div>

    <div class="filter-bar">
      <div class="filter-group">
        <label><i class="fa-solid fa-filter"></i> Filter by Status:</label>
        <select onchange="state.jobFilterStatus = this.value; renderAdminManageJobs(document.getElementById('workspace'));">
          <option value="all">All Postings</option>
          <option value="Active" ${state.jobFilterStatus === 'Active' ? 'selected' : ''}>Active</option>
          <option value="Pending" ${state.jobFilterStatus === 'Pending' ? 'selected' : ''}>Pending Approval</option>
          <option value="Expired" ${state.jobFilterStatus === 'Expired' ? 'selected' : ''}>Expired</option>
          <option value="Rejected" ${state.jobFilterStatus === 'Rejected' ? 'selected' : ''}>Rejected</option>
        </select>
      </div>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Job Title & Company</th>
            <th>Type & Location</th>
            <th>Applicants</th>
            <th>Status</th>
            <th>Admin Moderation Actions</th>
          </tr>
        </thead>
        <tbody>
          ${filteredJobs.map(job => `
            <tr>
              <td>
                <strong>${job.title}</strong><br/>
                <span style="font-size:0.8rem; color:var(--text-muted);">${job.company} • ${job.postedDate}</span>
              </td>
              <td>${job.type} (${job.location})</td>
              <td><span class="badge" style="position:static; background:var(--primary);">${job.applicantsCount || 0}</span></td>
              <td><span class="status-pill status-${job.status}">${job.status}</span></td>
              <td>
                <div style="display:flex; gap:0.35rem; flex-wrap:wrap;">
                  ${job.status !== 'Active' ? `<button class="btn btn-success btn-sm" onclick="adminSetJobStatus('${job.id}', 'Active')"><i class="fa-solid fa-check"></i> Approve</button>` : ''}
                  ${job.status !== 'Rejected' ? `<button class="btn btn-outline btn-sm" onclick="adminSetJobStatus('${job.id}', 'Rejected')"><i class="fa-solid fa-xmark"></i> Reject</button>` : ''}
                  ${job.status !== 'Expired' ? `<button class="btn btn-outline btn-sm" onclick="adminSetJobStatus('${job.id}', 'Expired')"><i class="fa-solid fa-clock"></i> Mark Expired</button>` : ''}
                  <button class="btn btn-outline btn-sm" onclick="editJob('${job.id}')"><i class="fa-solid fa-pen"></i></button>
                  <button class="btn btn-danger btn-sm" onclick="deleteJob('${job.id}')"><i class="fa-solid fa-trash"></i></button>
                </div>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function adminSetJobStatus(jobId, status) {
  const job = state.jobs.find(j => j.id === jobId);
  if (job) {
    job.status = status;
    saveState("jobs", state.jobs);
    toast(`Job "${job.title}" marked as ${status}`, "info");
    renderWorkspace();
  }
}

// 4. Manage Recruiters
function renderAdminManageRecruiters(container) {
  const recruiters = state.users.filter(u => u.role === "Recruiter");

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <h2>Manage Recruiters & Corporate Profiles</h2>
        <p>Review organization verification, approve accounts, and view posted jobs</p>
      </div>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Recruiter / Representative</th>
            <th>Company Name</th>
            <th>Account Status</th>
            <th>Active Jobs Posted</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${recruiters.map(rec => {
            const recruiterJobs = state.jobs.filter(j => j.recruiterId === rec.id || j.company.toLowerCase() === (rec.company||"").toLowerCase());
            return `
              <tr>
                <td>
                  <strong>${rec.name}</strong><br/>
                  <span style="font-size:0.8rem; color:var(--text-muted);">${rec.email}</span>
                </td>
                <td><strong>${rec.company || 'N/A'}</strong></td>
                <td><span class="status-pill status-${rec.status}">${rec.status}</span></td>
                <td><strong>${recruiterJobs.length}</strong> jobs</td>
                <td>
                  <div style="display:flex; gap:0.4rem;">
                    <button class="btn btn-outline btn-sm" onclick="adminViewRecruiterProfile('${rec.id}')"><i class="fa-solid fa-eye"></i> Profile</button>
                    ${rec.status === 'Pending' ? `<button class="btn btn-success btn-sm" onclick="adminApproveRecruiter('${rec.id}')">Approve</button>` : ''}
                    <button class="btn btn-outline btn-sm" onclick="adminToggleBlockUser('${rec.id}')">
                      ${rec.status === 'Blocked' ? 'Unblock' : 'Block'}
                    </button>
                  </div>
                </td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function adminApproveRecruiter(recId) {
  const rec = state.users.find(u => u.id === recId);
  if (rec) {
    rec.status = "Approved";
    saveState("users", state.users);
    toast(`Recruiter ${rec.name} has been approved`, "success");
    renderWorkspace();
  }
}

function adminViewRecruiterProfile(recId) {
  const rec = state.users.find(u => u.id === recId);
  if (!rec) return;

  const recruiterJobs = state.jobs.filter(j => j.recruiterId === rec.id || j.company.toLowerCase() === (rec.company||"").toLowerCase());

  document.getElementById("recruiterModalTitle").textContent = `${rec.company || rec.name} - Corporate Verification`;
  document.getElementById("recruiterModalBody").innerHTML = `
    <div style="display:flex; flex-direction:column; gap:0.8rem;">
      <p><strong>Official Contact:</strong> ${rec.name} (${rec.email})</p>
      <p><strong>Registration Date:</strong> ${rec.joined}</p>
      <p><strong>Verification Status:</strong> <span class="status-pill status-${rec.status}">${rec.status}</span></p>
      <h4 style="margin-top:0.8rem;">Currently Posted Listings (${recruiterJobs.length}):</h4>
      <ul style="padding-left:1.2rem; font-size:0.85rem;">
        ${recruiterJobs.length ? recruiterJobs.map(j => `<li><strong>${j.title}</strong> (${j.status})</li>`).join("") : '<li>No active jobs posted yet.</li>'}
      </ul>
    </div>
  `;
  openModal("recruiterDetailModal");
}

// 5. Manage Applications
function renderAdminManageApplications(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <h2>Global Application Monitor</h2>
        <p>Track application flows, submitted resumes, and candidate pipeline transitions</p>
      </div>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Applicant</th>
            <th>Target Position & Company</th>
            <th>Applied Date</th>
            <th>Lifecycle Stage</th>
            <th>Interview Scheduled</th>
          </tr>
        </thead>
        <tbody>
          ${state.applications.map(app => `
            <tr>
              <td>
                <strong>${app.applicantName}</strong><br/>
                <span style="font-size:0.8rem; color:var(--text-muted);">${app.applicantEmail}</span>
              </td>
              <td>
                <strong>${app.jobTitle}</strong><br/>
                <span style="font-size:0.8rem; color:var(--text-muted);">${app.company}</span>
              </td>
              <td>${app.appliedDate}</td>
              <td><span class="status-pill status-${app.status}">${app.status}</span></td>
              <td>
                ${app.interview ? `<span style="font-size:0.8rem;"><i class="fa-solid fa-video text-primary"></i> ${new Date(app.interview.dateTime).toLocaleString()}</span>` : '<span style="color:var(--text-muted); font-size:0.8rem;">None</span>'}
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

// 6. Reports & Complaints Desk
function renderAdminReports(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <h2>Reports & Moderation Desk</h2>
        <p>Review fake job alerts, spam flags, and user safety complaints</p>
      </div>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Reported Issue</th>
            <th>Target Organization</th>
            <th>Details / Proof</th>
            <th>Report Status</th>
            <th>Moderation Actions</th>
          </tr>
        </thead>
        <tbody>
          ${state.reports.length === 0 ? '<tr><td colspan="5" style="text-align:center;">No flagged reports.</td></tr>' : 
            state.reports.map(rep => `
              <tr>
                <td><strong>${rep.type}</strong><br/><span style="font-size:0.75rem; color:var(--text-muted);">${rep.reportedDate}</span></td>
                <td><strong>${rep.company}</strong><br/><span style="font-size:0.8rem; color:var(--text-muted);">${rep.jobTitle || 'Listing'}</span></td>
                <td><p style="font-size:0.82rem; max-width:280px;">${rep.details}</p></td>
                <td><span class="status-pill status-${rep.status}">${rep.status}</span></td>
                <td>
                  <div style="display:flex; gap:0.4rem; flex-wrap:wrap;">
                    <button class="btn btn-success btn-sm" onclick="adminResolveReport('${rep.id}')"><i class="fa-solid fa-check"></i> Mark Resolved</button>
                    <button class="btn btn-danger btn-sm" onclick="adminPurgeReportedJob('${rep.id}', '${rep.company}')"><i class="fa-solid fa-ban"></i> Delete Job</button>
                  </div>
                </td>
              </tr>
            `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function adminResolveReport(repId) {
  const rep = state.reports.find(r => r.id === repId);
  if (rep) {
    rep.status = "Resolved";
    saveState("reports", state.reports);
    toast("Report resolved and marked clean", "success");
    renderWorkspace();
  }
}

function adminPurgeReportedJob(repId, companyName) {
  if (confirm(`Remove all postings associated with ${companyName}?`)) {
    state.jobs = state.jobs.filter(j => j.company.toLowerCase() !== companyName.toLowerCase());
    const rep = state.reports.find(r => r.id === repId);
    if (rep) rep.status = "Resolved";
    saveState("jobs", state.jobs);
    saveState("reports", state.reports);
    toast(`Purged offending listings for ${companyName}`, "danger");
    renderWorkspace();
  }
}

// 7. Analytics & Simple Charts
function renderAdminAnalytics(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <h2>Analytics & Growth Trends</h2>
        <p>Visual statistics for jobs posted, applications, new seekers, and recruiters</p>
      </div>
    </div>

    <!-- Analytics Chart Card with Vector SVG Representation -->
    <div class="chart-card">
      <div class="chart-header">
        <div>
          <h4>Platform Activity Metrics (2026 Trends)</h4>
          <span style="font-size:0.8rem; color:var(--text-muted);">Monthly overview across four key growth sectors</span>
        </div>
      </div>

      <svg class="analytics-chart-svg" viewBox="0 0 700 200">
        <!-- Grid lines -->
        <line x1="40" y1="20" x2="680" y2="20" stroke="var(--border-color)" stroke-dasharray="4" />
        <line x1="40" y1="70" x2="680" y2="70" stroke="var(--border-color)" stroke-dasharray="4" />
        <line x1="40" y1="120" x2="680" y2="120" stroke="var(--border-color)" stroke-dasharray="4" />
        <line x1="40" y1="170" x2="680" y2="170" stroke="var(--border-color)" />

        <!-- Polyline 1: Applications (Green) -->
        <polyline fill="none" stroke="#10b981" stroke-width="3" points="50,150 150,110 270,90 390,50 510,40 650,25" />
        
        <!-- Polyline 2: Jobs Posted (Indigo Primary) -->
        <polyline fill="none" stroke="#4f46e5" stroke-width="3" points="50,165 150,140 270,115 390,95 510,80 650,60" />

        <!-- Polyline 3: New Users (Blue Info) -->
        <polyline fill="none" stroke="#0ea5e9" stroke-width="3" points="50,170 150,155 270,135 390,110 510,95 650,75" />

        <!-- Polyline 4: Recruiters Registered (Amber Warning) -->
        <polyline fill="none" stroke="#f59e0b" stroke-width="3" points="50,185 150,175 270,160 390,145 510,130 650,115" />

        <!-- Labels -->
        <text x="50" y="192" font-size="11" fill="var(--text-muted)">Jan</text>
        <text x="150" y="192" font-size="11" fill="var(--text-muted)">Feb</text>
        <text x="270" y="192" font-size="11" fill="var(--text-muted)">Mar</text>
        <text x="390" y="192" font-size="11" fill="var(--text-muted)">Apr</text>
        <text x="510" y="192" font-size="11" fill="var(--text-muted)">May</text>
        <text x="650" y="192" font-size="11" fill="var(--text-muted)">Jun</text>
      </svg>

      <div class="chart-legend">
        <div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span> Applications Received</div>
        <div class="legend-item"><span class="legend-dot" style="background:#4f46e5;"></span> Jobs Posted</div>
        <div class="legend-item"><span class="legend-dot" style="background:#0ea5e9;"></span> New Job Seekers</div>
        <div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span> Recruiters Registered</div>
      </div>
    </div>
  `;
}

// ==========================================================================
// 5. JOB SEEKER VIEWS & ACTIONS
// ==========================================================================

function renderSeekerFindJobs(container) {
  const filtered = state.jobs.filter(j => {
    const matchSearch = j.title.toLowerCase().includes(state.searchTerm) || j.company.toLowerCase().includes(state.searchTerm);
    return matchSearch && j.status === "Active";
  });

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <h2>Explore Career Opportunities</h2>
        <p>Find your next role with verified global teams</p>
      </div>
    </div>
    <div class="job-cards-grid">
      ${filtered.length ? filtered.map(j => renderJobCardHTML(j)).join("") : '<p>No matching positions found.</p>'}
    </div>
  `;
}

function renderJobCardHTML(job) {
  const isSaved = state.bookmarks.includes(job.id);
  return `
    <div class="job-card">
      <div class="job-card-header">
        <div class="company-badge">
          <div class="company-logo">${job.company.substring(0, 2).toUpperCase()}</div>
          <div>
            <h4 style="font-size:0.95rem;">${job.title}</h4>
            <span style="font-size:0.8rem; color:var(--text-muted);">${job.company} • ${job.location}</span>
          </div>
        </div>
        <button class="bookmark-btn ${isSaved ? 'saved' : ''}" onclick="toggleBookmark('${job.id}')">
          <i class="fa-${isSaved ? 'solid' : 'regular'} fa-bookmark"></i>
        </button>
      </div>

      <div class="job-tags">
        <span class="tag">${job.type}</span>
        <span class="tag">${job.workMode}</span>
        <span class="tag">${job.experience}</span>
      </div>

      <p style="font-size:0.82rem; color:var(--text-muted); margin-bottom:0.75rem;">
        ${job.description.substring(0, 95)}...
      </p>

      <div class="job-card-footer">
        <span class="salary-text">${job.salary}</span>
        <div style="display:flex; gap:0.4rem;">
          <button class="btn btn-outline btn-sm" onclick="openJobDetails('${job.id}')">Details</button>
          <button class="btn btn-primary btn-sm" onclick="openApplyModal('${job.id}')">Apply</button>
        </div>
      </div>
    </div>
  `;
}

function renderSeekerApplications(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <h2>My Submitted Applications</h2>
        <p>Track your stage progression in real-time</p>
      </div>
    </div>
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr><th>Job & Company</th><th>Applied Date</th><th>Status</th><th>Interviews</th></tr>
        </thead>
        <tbody>
          ${state.applications.map(app => `
            <tr>
              <td><strong>${app.jobTitle}</strong><br/><span style="font-size:0.8rem; color:var(--text-muted);">${app.company}</span></td>
              <td>${app.appliedDate}</td>
              <td><span class="status-pill status-${app.status}">${app.status}</span></td>
              <td>${app.interview ? `<a href="${app.interview.link}" target="_blank" style="color:var(--primary); font-weight:600; font-size:0.8rem;"><i class="fa-solid fa-video"></i> Join Call</a>` : '<span style="color:var(--text-muted); font-size:0.8rem;">Pending</span>'}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderSeekerSavedJobs(container) {
  const saved = state.jobs.filter(j => state.bookmarks.includes(j.id));
  container.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <h2>Saved Opportunities</h2>
        <p>Positions bookmarked for later review</p>
      </div>
    </div>
    <div class="job-cards-grid">
      ${saved.length ? saved.map(j => renderJobCardHTML(j)).join("") : '<p>No saved jobs found.</p>'}
    </div>
  `;
}

function renderSeekerProfile(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <h2>Candidate Profile</h2>
        <p>Manage your professional credentials and links</p>
      </div>
      <button class="btn btn-primary" onclick="toast('Profile saved successfully!', 'success')">Save Changes</button>
    </div>
    <div class="table-container" style="padding:1.5rem;">
      <div class="grid-form">
        <div class="form-group">
          <label>Full Name</label>
          <input type="text" value="Alex Morgan" />
        </div>
        <div class="form-group">
          <label>Email Address</label>
          <input type="email" value="alex.morgan@example.com" />
        </div>
        <div class="form-group full-width">
          <label>Career Headline & Skills</label>
          <input type="text" value="Senior Full Stack & Cloud Developer | TypeScript, React, AWS, Node.js" />
        </div>
      </div>
    </div>
  `;
}

function toggleBookmark(jobId) {
  if (state.bookmarks.includes(jobId)) {
    state.bookmarks = state.bookmarks.filter(id => id !== jobId);
    toast("Job removed from saved list", "info");
  } else {
    state.bookmarks.push(jobId);
    toast("Job saved to your bookmarks", "success");
  }
  saveState("bookmarks", state.bookmarks);
  renderWorkspace();
}

// ==========================================================================
// 6. RECRUITER VIEWS & ACTIONS
// ==========================================================================

function renderRecruiterManageJobs(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <h2>Recruiter Job Board</h2>
        <p>Post and manage openings for your organization</p>
      </div>
      <button class="btn btn-primary" onclick="openPostJobModal()"><i class="fa-solid fa-plus"></i> Post New Job</button>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr><th>Job Title</th><th>Location</th><th>Applicants</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          ${state.jobs.map(job => `
            <tr>
              <td><strong>${job.title}</strong><br/><span style="font-size:0.8rem; color:var(--text-muted);">${job.company}</span></td>
              <td>${job.location} (${job.workMode})</td>
              <td><span class="badge" style="position:static; background:var(--primary);">${job.applicantsCount || 0}</span></td>
              <td><span class="status-pill status-${job.status}">${job.status}</span></td>
              <td>
                <div style="display:flex; gap:0.4rem;">
                  <button class="btn btn-outline btn-sm" onclick="editJob('${job.id}')"><i class="fa-solid fa-pen"></i></button>
                  <button class="btn btn-danger btn-sm" onclick="deleteJob('${job.id}')"><i class="fa-solid fa-trash"></i></button>
                </div>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderRecruiterPipeline(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <h2>Applicant Pipeline</h2>
        <p>Shortlist candidates and schedule interviews</p>
      </div>
    </div>
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr><th>Candidate</th><th>Applied Role</th><th>Status</th><th>Move Stage</th><th>Interview</th></tr>
        </thead>
        <tbody>
          ${state.applications.map(app => `
            <tr>
              <td><strong>${app.applicantName}</strong><br/><span style="font-size:0.8rem; color:var(--text-muted);">${app.applicantEmail}</span></td>
              <td>${app.jobTitle}</td>
              <td><span class="status-pill status-${app.status}">${app.status}</span></td>
              <td>
                <select style="padding:0.25rem 0.5rem; border-radius:4px; border:1px solid var(--border-color);" onchange="updateCandidateStatus('${app.id}', this.value)">
                  <option value="Applied" ${app.status==='Applied'?'selected':''}>Applied</option>
                  <option value="UnderReview" ${app.status==='UnderReview'?'selected':''}>Under Review</option>
                  <option value="Shortlisted" ${app.status==='Shortlisted'?'selected':''}>Shortlisted</option>
                  <option value="Interview" ${app.status==='Interview'?'selected':''}>Interview</option>
                  <option value="Selected" ${app.status==='Selected'?'selected':''}>Selected</option>
                  <option value="Rejected" ${app.status==='Rejected'?'selected':''}>Rejected</option>
                </select>
              </td>
              <td>
                <button class="btn btn-primary btn-sm" onclick="openScheduleModal('${app.id}', '${app.applicantName}')">
                  <i class="fa-solid fa-calendar-plus"></i> Schedule
                </button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function updateCandidateStatus(appId, newStatus) {
  const app = state.applications.find(a => a.id === appId);
  if (app) {
    app.status = newStatus;
    saveState("applications", state.applications);
    toast(`Candidate stage moved to ${newStatus}`, "success");
    renderWorkspace();
  }
}

function renderRecruiterProfile(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <h2>Corporate Profile</h2>
        <p>Manage company culture, team identity, and contact details</p>
      </div>
      <button class="btn btn-primary" onclick="toast('Corporate settings saved', 'success')">Save Profile</button>
    </div>
    <div class="table-container" style="padding:1.5rem;">
      <div class="grid-form">
        <div class="form-group">
          <label>Company Name</label>
          <input type="text" value="Stripe Inc." />
        </div>
        <div class="form-group">
          <label>Website</label>
          <input type="url" value="https://stripe.com" />
        </div>
        <div class="form-group full-width">
          <label>Company Bio</label>
          <textarea rows="3">Financial infrastructure for the internet.</textarea>
        </div>
      </div>
    </div>
  `;
}

// ==========================================================================
// 7. MODALS, POSTING, APPLY & REPORTING
// ==========================================================================

function openModal(id) { document.getElementById(id).classList.add("active"); }
function closeModal(id) { document.getElementById(id).classList.remove("active"); }

function openJobDetails(jobId) {
  const job = state.jobs.find(j => j.id === jobId);
  if (!job) return;

  document.getElementById("detailJobTitle").textContent = job.title;
  document.getElementById("detailContent").innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
      <h4>${job.company}</h4>
      <span class="salary-text">${job.salary}</span>
    </div>
    <p style="color:var(--text-muted); font-size:0.875rem;">${job.description}</p>
    <div class="job-tags" style="margin-top:1rem;">
      ${job.skills.map(s => `<span class="tag" style="background:var(--primary-light); color:var(--primary);">${s}</span>`).join("")}
    </div>
  `;

  document.getElementById("detailFooter").innerHTML = `
    <button class="btn btn-outline" onclick="openReportModal('${job.id}', '${job.company}', '${job.title}')"><i class="fa-solid fa-flag text-danger"></i> Report Job</button>
    <button class="btn btn-primary" onclick="closeModal('jobDetailModal'); openApplyModal('${job.id}')">Apply Now</button>
  `;
  openModal("jobDetailModal");
}

function openApplyModal(jobId) {
  const job = state.jobs.find(j => j.id === jobId);
  if (!job) return;
  document.getElementById("applyJobId").value = job.id;
  document.getElementById("applyJobTitle").textContent = `Apply for ${job.title} at ${job.company}`;
  openModal("applyModal");
}

function handleApplyJobSubmit(e) {
  e.preventDefault();
  const jobId = document.getElementById("applyJobId").value;
  const job = state.jobs.find(j => j.id === jobId);

  const newApp = {
    id: "app-" + Date.now(),
    jobId: job.id,
    jobTitle: job.title,
    company: job.company,
    applicantName: document.getElementById("applicantName").value,
    applicantEmail: document.getElementById("applicantEmail").value,
    appliedDate: new Date().toISOString().split("T")[0],
    status: "Applied",
    interview: null
  };

  state.applications.unshift(newApp);
  job.applicantsCount = (job.applicantsCount || 0) + 1;
  saveState("applications", state.applications);
  saveState("jobs", state.jobs);

  closeModal("applyModal");
  toast("Application submitted successfully!", "success");
  if (state.currentTab === "my-applications") renderWorkspace();
}

function openPostJobModal() {
  document.getElementById("postJobForm").reset();
  document.getElementById("editJobId").value = "";
  document.getElementById("postJobModalTitle").textContent = "Post a New Opportunity";
  document.getElementById("saveJobBtn").textContent = "Post Job";
  openModal("postJobModal");
}

function editJob(jobId) {
  const job = state.jobs.find(j => j.id === jobId);
  if (!job) return;

  document.getElementById("editJobId").value = job.id;
  document.getElementById("jobTitleInput").value = job.title;
  document.getElementById("companyInput").value = job.company;
  document.getElementById("locationInput").value = job.location;
  document.getElementById("workModeInput").value = job.workMode;
  document.getElementById("jobTypeInput").value = job.type;
  document.getElementById("experienceInput").value = job.experience;
  document.getElementById("salaryInput").value = job.salary;
  document.getElementById("skillsInput").value = job.skills.join(", ");
  document.getElementById("descriptionInput").value = job.description;

  document.getElementById("postJobModalTitle").textContent = "Edit Job Opportunity";
  document.getElementById("saveJobBtn").textContent = "Update Job";
  openModal("postJobModal");
}

function handlePostJobSubmit(e) {
  e.preventDefault();
  const editId = document.getElementById("editJobId").value;
  const skillsArray = document.getElementById("skillsInput").value.split(",").map(s => s.trim()).filter(Boolean);

  if (editId) {
    const job = state.jobs.find(j => j.id === editId);
    if (job) {
      job.title = document.getElementById("jobTitleInput").value;
      job.company = document.getElementById("companyInput").value;
      job.location = document.getElementById("locationInput").value;
      job.workMode = document.getElementById("workModeInput").value;
      job.type = document.getElementById("jobTypeInput").value;
      job.experience = document.getElementById("experienceInput").value;
      job.salary = document.getElementById("salaryInput").value;
      job.skills = skillsArray;
      job.description = document.getElementById("descriptionInput").value;
      toast("Job listing updated", "success");
    }
  } else {
    const newJob = {
      id: "job-" + Date.now(),
      title: document.getElementById("jobTitleInput").value,
      company: document.getElementById("companyInput").value,
      location: document.getElementById("locationInput").value,
      workMode: document.getElementById("workModeInput").value,
      type: document.getElementById("jobTypeInput").value,
      experience: document.getElementById("experienceInput").value,
      salary: document.getElementById("salaryInput").value,
      skills: skillsArray,
      description: document.getElementById("descriptionInput").value,
      postedDate: new Date().toISOString().split("T")[0],
      status: state.currentUser.role === "admin" ? "Active" : "Pending",
      applicantsCount: 0
    };
    state.jobs.unshift(newJob);
    toast("Job submitted for approval", "success");
  }

  saveState("jobs", state.jobs);
  closeModal("postJobModal");
  renderWorkspace();
}

function deleteJob(jobId) {
  if (confirm("Delete this listing permanently?")) {
    state.jobs = state.jobs.filter(j => j.id !== jobId);
    saveState("jobs", state.jobs);
    toast("Job deleted", "danger");
    renderWorkspace();
  }
}

function openScheduleModal(appId, candidateName) {
  document.getElementById("schedAppId").value = appId;
  document.getElementById("schedCandidateName").value = candidateName;
  openModal("scheduleModal");
}

function handleScheduleSubmit(e) {
  e.preventDefault();
  const appId = document.getElementById("schedAppId").value;
  const app = state.applications.find(a => a.id === appId);

  if (app) {
    app.status = "Interview";
    app.interview = {
      dateTime: document.getElementById("schedDateTime").value,
      mode: document.getElementById("schedMode").value,
      link: document.getElementById("schedLink").value
    };
    saveState("applications", state.applications);
    toast(`Interview invite dispatched to ${app.applicantName}`, "success");
    closeModal("scheduleModal");
    renderWorkspace();
  }
}

function openReportModal(targetId, company, jobTitle) {
  document.getElementById("reportTargetId").value = targetId;
  document.getElementById("reportCompany").value = company;
  openModal("reportModal");
}

function handleReportSubmit(e) {
  e.preventDefault();
  const newReport = {
    id: "rep-" + Date.now(),
    type: document.getElementById("reportReason").value,
    company: document.getElementById("reportCompany").value || "ABC Technologies",
    jobTitle: "Position #" + document.getElementById("reportTargetId").value,
    reason: document.getElementById("reportReason").value,
    details: document.getElementById("reportDetails").value,
    status: "Pending",
    reportedDate: new Date().toISOString().split("T")[0]
  };

  state.reports.unshift(newReport);
  saveState("reports", state.reports);
  closeModal("reportModal");
  toast("Report filed and submitted to Admin Moderation Desk", "warning");
}

// ==========================================================================
// 8. TOAST NOTIFICATIONS & NOTIFICATION FEED
// ==========================================================================

function toast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  const toastEl = document.createElement("div");
  toastEl.className = "toast";

  const iconMap = {
    success: '<i class="fa-solid fa-circle-check" style="color:var(--success)"></i>',
    danger: '<i class="fa-solid fa-triangle-exclamation" style="color:var(--danger)"></i>',
    warning: '<i class="fa-solid fa-circle-exclamation" style="color:var(--warning)"></i>',
    info: '<i class="fa-solid fa-circle-info" style="color:var(--primary)"></i>'
  };

  toastEl.innerHTML = `
    ${iconMap[type] || iconMap.info}
    <span>${message}</span>
  `;

  container.appendChild(toastEl);
  setTimeout(() => {
    toastEl.style.opacity = "0";
    toastEl.style.transform = "translateX(100%)";
    toastEl.style.transition = "all 0.25s ease";
    setTimeout(() => toastEl.remove(), 250);
  }, 3500);
}

function updateNotifications() {
  const list = document.getElementById("notifList");
  const notifications = [
    { title: "New Job Match", desc: "Senior Full Stack Engineer matches your profile.", unread: true },
    { title: "Application Under Review", desc: "Figma is reviewing your submitted profile.", unread: true },
    { title: "System Alert", desc: "Reports moderation desk has 1 pending flag.", unread: false }
  ];

  list.innerHTML = notifications.map(n => `
    <li class="notif-item ${n.unread ? 'unread' : ''}">
      <i class="fa-solid fa-bell text-primary"></i>
      <div>
        <strong style="display:block;">${n.title}</strong>
        <span style="color:var(--text-muted); font-size:0.75rem;">${n.desc}</span>
      </div>
    </li>
  `).join("");
}
