/**
 * WorkSphere - Unified Online Job Portal Application Logic
 */

// ==========================================================================
// 1. INITIAL MOCK DATA & PERSISTENCE
// ==========================================================================

const INITIAL_JOBS = [
  {
    id: "job-1",
    title: "Senior Full Stack Engineer",
    company: "Stripe",
    location: "San Francisco, CA",
    workMode: "Remote",
    type: "Full-time",
    experience: "Senior Level",
    salary: "$145,000 - $180,000",
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL"],
    description: "Join Stripe to build robust APIs and payment infrastructure scaled globally.",
    postedDate: "2026-03-24",
    status: "Active", // Active, Closed
    applicantsCount: 3
  },
  {
    id: "job-2",
    title: "Product Designer (UI/UX)",
    company: "Figma",
    location: "New York, NY",
    workMode: "Hybrid",
    type: "Full-time",
    experience: "Mid Level",
    salary: "$110,000 - $135,000",
    skills: ["Figma", "Design Systems", "Prototyping", "User Research"],
    description: "We are seeking a collaborative designer to shape the future of collaborative design tools.",
    postedDate: "2026-03-22",
    status: "Active",
    applicantsCount: 1
  },
  {
    id: "job-3",
    title: "DevOps & Cloud Architect",
    company: "Amazon Web Services",
    location: "Seattle, WA",
    workMode: "Onsite",
    type: "Full-time",
    experience: "Lead / Executive",
    salary: "$160,000 - $210,000",
    skills: ["AWS", "Kubernetes", "Terraform", "CI/CD", "Docker"],
    description: "Architect mission-critical cloud backbones with high uptime and resilient scalability.",
    postedDate: "2026-03-25",
    status: "Active",
    applicantsCount: 2
  }
];

const INITIAL_APPLICATIONS = [
  {
    id: "app-1",
    jobId: "job-1",
    jobTitle: "Senior Full Stack Engineer",
    company: "Stripe",
    applicantName: "Alex Morgan",
    applicantEmail: "alex.morgan@example.com",
    appliedDate: "2026-03-25",
    status: "Shortlisted", // Applied -> UnderReview -> Shortlisted -> Interview -> Selected -> Rejected
    coverLetter: "10+ years scaling resilient TypeScript ecosystems.",
    interview: {
      dateTime: "2026-04-02T15:00",
      mode: "Online",
      link: "https://meet.google.com/xyz-work-shp"
    }
  },
  {
    id: "app-2",
    jobId: "job-2",
    jobTitle: "Product Designer (UI/UX)",
    company: "Figma",
    applicantName: "Alex Morgan",
    applicantEmail: "alex.morgan@example.com",
    appliedDate: "2026-03-23",
    status: "Interview",
    coverLetter: "Passionate about component-driven design libraries.",
    interview: {
      dateTime: "2026-03-30T10:00",
      mode: "Online",
      link: "https://zoom.us/j/987654321"
    }
  },
  {
    id: "app-3",
    jobId: "job-3",
    jobTitle: "DevOps & Cloud Architect",
    company: "Amazon Web Services",
    applicantName: "Rahul Sharma",
    applicantEmail: "rahul.s@example.com",
    appliedDate: "2026-03-25",
    status: "Applied",
    coverLetter: "Certified AWS DevOps engineer with Kubernetes expertise.",
    interview: null
  }
];

const INITIAL_REPORTS = [
  { id: "rep-1", target: "Job #job-3", reason: "Expired or Misleading", details: "Salary details not updated.", status: "Pending" }
];

const INITIAL_USERS = [
  { id: "u-1", name: "Alex Morgan", email: "alex.morgan@example.com", role: "Job Seeker", status: "Active" },
  { id: "u-2", name: "TechCorp Recruiter", email: "hr@techcorp.com", role: "Recruiter", status: "Verified" },
  { id: "u-3", name: "Spammy Agent", email: "bot@fakebiz.com", role: "Recruiter", status: "Blocked" }
];

// LocalStorage helpers
const loadState = (key, fallback) => {
  const data = localStorage.getItem(`worksphere_${key}`);
  return data ? JSON.parse(data) : fallback;
};

const saveState = (key, data) => {
  localStorage.setItem(`worksphere_${key}`, JSON.stringify(data));
};

// Application State Store
let appState = {
  currentRole: "seeker", // seeker, recruiter, admin
  jobs: loadState("jobs", INITIAL_JOBS),
  applications: loadState("applications", INITIAL_APPLICATIONS),
  users: loadState("users", INITIAL_USERS),
  reports: loadState("reports", INITIAL_REPORTS),
  bookmarks: loadState("bookmarks", ["job-1"]),
  currentTab: "find-jobs",
  filter: { search: "", mode: "all", experience: "all" }
};

// ==========================================================================
// 2. INITIALIZATION & NAVIGATION SYSTEM
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  initEventListeners();
  renderSidebar();
  renderWorkspace();
  updateNotifications();
});

function initEventListeners() {
  // Role selector
  const roleSwitch = document.getElementById("roleSwitch");
  roleSwitch.addEventListener("change", (e) => {
    appState.currentRole = e.target.value;
    // Set default initial tab based on role
    if (appState.currentRole === "seeker") appState.currentTab = "find-jobs";
    if (appState.currentRole === "recruiter") appState.currentTab = "manage-jobs";
    if (appState.currentRole === "admin") appState.currentTab = "admin-dashboard";

    renderSidebar();
    renderWorkspace();
    toast(`Switched view to ${e.target.options[e.target.selectedIndex].text}`, "info");
  });

  // Global Theme toggle
  document.getElementById("themeToggle").addEventListener("click", () => {
    const currentTheme = document.body.getAttribute("data-theme");
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    document.body.setAttribute("data-theme", nextTheme);
    document.getElementById("themeToggle").innerHTML = nextTheme === "dark" 
      ? '<i class="fa-solid fa-sun"></i>' 
      : '<i class="fa-solid fa-moon"></i>';
  });

  // Global search
  document.getElementById("globalSearchInput").addEventListener("input", (e) => {
    appState.filter.search = e.target.value.toLowerCase();
    if (appState.currentTab === "find-jobs" || appState.currentTab === "admin-jobs") {
      renderWorkspace();
    }
  });

  // Notification toggle
  const notifBtn = document.getElementById("notifBtn");
  const notifDropdown = document.getElementById("notifDropdown");
  notifBtn.addEventListener("click", () => {
    notifDropdown.classList.toggle("active");
  });

  document.getElementById("markAllRead").addEventListener("click", () => {
    document.getElementById("notifBadge").style.display = "none";
    toast("All notifications marked as read", "success");
    notifDropdown.classList.remove("active");
  });

  // Post/Edit Job Form Submission
  document.getElementById("postJobForm").addEventListener("submit", handleJobSubmit);

  // Apply Form Submission
  document.getElementById("applyJobForm").addEventListener("submit", handleApplySubmit);

  // Schedule Interview Submission
  document.getElementById("scheduleForm").addEventListener("submit", handleScheduleSubmit);

  // Report Submission
  document.getElementById("reportForm").addEventListener("submit", handleReportSubmit);
}

// Sidebar config based on Role
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
    { id: "admin-dashboard", icon: "fa-chart-pie", label: "Overview & Analytics" },
    { id: "admin-users", icon: "fa-users-gear", label: "Manage Users" },
    { id: "admin-jobs", icon: "fa-briefcase", label: "Job Moderation" },
    { id: "admin-reports", icon: "fa-shield-halved", label: "Reports & Safety" }
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

  // Update profile badge label
  const profileName = {
    seeker: "Alex Morgan (Seeker)",
    recruiter: "Stripe HR (Recruiter)",
    admin: "System Admin"
  }[appState.currentRole];
  document.getElementById("currentUserName").textContent = profileName;
}

function switchTab(tabId) {
  appState.currentTab = tabId;
  renderSidebar();
  renderWorkspace();
}

// ==========================================================================
// 3. WORKSPACE RENDERING
// ==========================================================================

function renderWorkspace() {
  const container = document.getElementById("workspace");
  container.innerHTML = "";

  switch (appState.currentTab) {
    // --- SEEKER VIEWS ---
    case "find-jobs":
      renderFindJobs(container);
      break;
    case "my-applications":
      renderMyApplications(container);
      break;
    case "saved-jobs":
      renderSavedJobs(container);
      break;
    case "seeker-profile":
      renderSeekerProfile(container);
      break;

    // --- RECRUITER VIEWS ---
    case "manage-jobs":
      renderManageJobs(container);
      break;
    case "applicants-pipeline":
      renderApplicantsPipeline(container);
      break;
    case "company-profile":
      renderCompanyProfile(container);
      break;

    // --- ADMIN VIEWS ---
    case "admin-dashboard":
      renderAdminDashboard(container);
      break;
    case "admin-users":
      renderAdminUsers(container);
      break;
    case "admin-jobs":
      renderAdminJobModeration(container);
      break;
    case "admin-reports":
      renderAdminReports(container);
      break;

    default:
      container.innerHTML = `<p>View not found.</p>`;
  }
}

// ==========================================================================
// 4. JOB SEEKER COMPONENTS
// ==========================================================================

function renderFindJobs(container) {
  const filteredJobs = appState.jobs.filter(job => {
    const matchSearch = job.title.toLowerCase().includes(appState.filter.search) ||
                        job.company.toLowerCase().includes(appState.filter.search) ||
                        job.skills.some(s => s.toLowerCase().includes(appState.filter.search));
    const matchMode = appState.filter.mode === "all" || job.workMode.toLowerCase() === appState.filter.mode.toLowerCase();
    const matchExp = appState.filter.experience === "all" || job.experience.toLowerCase() === appState.filter.experience.toLowerCase();
    return matchSearch && matchMode && matchExp && job.status === "Active";
  });

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <h2>Explore Career Opportunities</h2>
        <p>Discover and apply to top matching roles</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="filter-bar">
      <div class="filter-group">
        <label><i class="fa-solid fa-house-laptop"></i> Work Mode:</label>
        <select onchange="handleFilterChange('mode', this.value)">
          <option value="all">All Modes</option>
          <option value="Remote" ${appState.filter.mode === 'Remote' ? 'selected' : ''}>Remote</option>
          <option value="Hybrid" ${appState.filter.mode === 'Hybrid' ? 'selected' : ''}>Hybrid</option>
          <option value="Onsite" ${appState.filter.mode === 'Onsite' ? 'selected' : ''}>Onsite</option>
        </select>
      </div>
      <div class="filter-group">
        <label><i class="fa-solid fa-layer-group"></i> Experience:</label>
        <select onchange="handleFilterChange('experience', this.value)">
          <option value="all">All Levels</option>
          <option value="Entry Level" ${appState.filter.experience === 'Entry Level' ? 'selected' : ''}>Entry Level</option>
          <option value="Mid Level" ${appState.filter.experience === 'Mid Level' ? 'selected' : ''}>Mid Level</option>
          <option value="Senior Level" ${appState.filter.experience === 'Senior Level' ? 'selected' : ''}>Senior Level</option>
        </select>
      </div>
    </div>

    <!-- Grid -->
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
          <div class="company-meta">
            <h4>${job.title}</h4>
            <span>${job.company} • ${job.location}</span>
          </div>
        </div>
        <button class="bookmark-btn ${isBookmarked ? 'saved' : ''}" onclick="toggleBookmark('${job.id}')" title="Save Job">
          <i class="fa-${isBookmarked ? 'solid' : 'regular'} fa-bookmark"></i>
        </button>
      </div>

      <div class="job-tags">
        <span class="tag"><i class="fa-solid fa-briefcase"></i> ${job.type}</span>
        <span class="tag"><i class="fa-solid fa-globe"></i> ${job.workMode}</span>
        <span class="tag"><i class="fa-solid fa-chart-line"></i> ${job.experience}</span>
      </div>

      <p style="font-size:0.875rem; color:var(--text-muted); margin-bottom: 1rem;">
        ${job.description.substring(0, 100)}...
      </p>

      <div class="job-tags">
        ${job.skills.map(skill => `<span class="tag" style="background:var(--primary-light); color:var(--primary);">${skill}</span>`).join("")}
      </div>

      <div class="job-card-footer">
        <span class="salary-text">${job.salary}</span>
        <div style="display:flex; gap:0.5rem;">
          <button class="btn btn-outline btn-sm" onclick="openJobDetails('${job.id}')">Details</button>
          <button class="btn btn-primary btn-sm" onclick="openApplyModal('${job.id}')">Quick Apply</button>
        </div>
      </div>
    </div>
  `;
}

function handleFilterChange(key, value) {
  appState.filter[key] = value;
  renderWorkspace();
}

function toggleBookmark(jobId) {
  if (appState.bookmarks.includes(jobId)) {
    appState.bookmarks = appState.bookmarks.filter(id => id !== jobId);
    toast("Job removed from saved list", "info");
  } else {
    appState.bookmarks.push(jobId);
    toast("Job bookmarked successfully", "success");
  }
  saveState("bookmarks", appState.bookmarks);
  renderWorkspace();
}

function renderMyApplications(container) {
  const myApps = appState.applications;

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <h2>My Submitted Applications</h2>
        <p>Track status changes and upcoming interviews</p>
      </div>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Position & Company</th>
            <th>Applied Date</th>
            <th>Pipeline Status</th>
            <th>Interview Details</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${myApps.length === 0 ? `<tr><td colspan="5" style="text-align:center;">No applications submitted yet.</td></tr>` : 
            myApps.map(app => `
              <tr>
                <td>
                  <strong>${app.jobTitle}</strong><br />
                  <span style="font-size:0.8rem; color:var(--text-muted);">${app.company}</span>
                </td>
                <td>${app.appliedDate}</td>
                <td><span class="status-pill status-${app.status}">${app.status}</span></td>
                <td>
                  ${app.interview ? `
                    <div style="font-size:0.8rem;">
                      <i class="fa-solid fa-calendar-days text-primary"></i> ${new Date(app.interview.dateTime).toLocaleString()}<br/>
                      <a href="${app.interview.link}" target="_blank" style="color:var(--primary); font-weight:600;">Join Meeting</a>
                    </div>
                  ` : '<span style="color:var(--text-muted); font-size:0.8rem;">Not scheduled</span>'}
                </td>
                <td>
                  <button class="btn btn-danger btn-sm" onclick="withdrawApplication('${app.id}')">Withdraw</button>
                </td>
              </tr>
            `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function withdrawApplication(appId) {
  if (confirm("Are you sure you want to withdraw this application?")) {
    appState.applications = appState.applications.filter(a => a.id !== appId);
    saveState("applications", appState.applications);
    toast("Application withdrawn", "info");
    renderWorkspace();
  }
}

function renderSavedJobs(container) {
  const savedList = appState.jobs.filter(j => appState.bookmarks.includes(j.id));
  container.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <h2>Saved / Bookmarked Positions</h2>
        <p>Positions you are interested in applying to later</p>
      </div>
    </div>
    <div class="job-cards-grid">
      ${savedList.length === 0 ? '<p>No saved jobs found.</p>' : savedList.map(job => renderJobCardHTML(job)).join("")}
    </div>
  `;
}

function renderSeekerProfile(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <h2>Candidate Profile</h2>
        <p>Manage your career details and resume files</p>
      </div>
      <button class="btn btn-primary" onclick="toast('Profile changes saved successfully!', 'success')"><i class="fa-solid fa-floppy-disk"></i> Save Changes</button>
    </div>

    <div class="profile-card">
      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" alt="Profile photo" />
      <div style="flex:1;">
        <h3>Alex Morgan</h3>
        <p style="color:var(--text-muted);">Senior Full Stack & Cloud Developer</p>
        <p style="margin-top:0.5rem; font-size:0.875rem;"><i class="fa-solid fa-location-dot"></i> San Francisco, CA • <i class="fa-solid fa-envelope"></i> alex.morgan@example.com</p>
      </div>
    </div>

    <div class="table-container" style="padding:1.5rem; background:var(--bg-surface);">
      <h4 style="margin-bottom:1rem;">Professional Summary & Skills</h4>
      <div class="grid-form">
        <div class="form-group full-width">
          <label>Headline</label>
          <input type="text" value="Staff Software Engineer with 8+ years building enterprise SaaS platforms" />
        </div>
        <div class="form-group full-width">
          <label>Skills & Competencies</label>
          <input type="text" value="TypeScript, React, Node.js, GraphQL, Docker, AWS, PostgreSQL, Microservices" />
        </div>
        <div class="form-group">
          <label>LinkedIn Profile</label>
          <input type="url" value="https://linkedin.com/in/alexmorgan" />
        </div>
        <div class="form-group">
          <label>GitHub Profile</label>
          <input type="url" value="https://github.com/alexmorgan" />
        </div>
      </div>
    </div>
  `;
}

// ==========================================================================
// 5. RECRUITER COMPONENTS
// ==========================================================================

function renderManageJobs(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <h2>Recruiter Dashboard</h2>
        <p>Post, track, and manage your organization's job listings</p>
      </div>
      <button class="btn btn-primary" onclick="openPostJobModal()"><i class="fa-solid fa-plus"></i> Post New Job</button>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon primary"><i class="fa-solid fa-briefcase"></i></div>
        <div class="stat-info">
          <h3>${appState.jobs.length}</h3>
          <span>Active Listings</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon success"><i class="fa-solid fa-users"></i></div>
        <div class="stat-info">
          <h3>${appState.applications.length}</h3>
          <span>Total Applicants</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon warning"><i class="fa-solid fa-comments"></i></div>
        <div class="stat-info">
          <h3>${appState.applications.filter(a => a.status === 'Interview').length}</h3>
          <span>Interviews Scheduled</span>
        </div>
      </div>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Job Title</th>
            <th>Location & Mode</th>
            <th>Applicants</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${appState.jobs.map(job => `
            <tr>
              <td><strong>${job.title}</strong><br/><span style="font-size:0.8rem; color:var(--text-muted);">${job.company}</span></td>
              <td>${job.location} (${job.workMode})</td>
              <td><span class="badge" style="position:static; background:var(--primary);">${job.applicantsCount || 0}</span></td>
              <td><span class="status-pill status-${job.status === 'Active' ? 'Selected' : 'Rejected'}">${job.status}</span></td>
              <td>
                <div style="display:flex; gap:0.4rem;">
                  <button class="btn btn-outline btn-sm" onclick="editJob('${job.id}')"><i class="fa-solid fa-pen"></i></button>
                  <button class="btn btn-outline btn-sm" onclick="toggleJobStatus('${job.id}')">${job.status === 'Active' ? 'Close' : 'Reopen'}</button>
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

function renderApplicantsPipeline(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <h2>Applicant Review Pipeline</h2>
        <p>Transition candidate stages from initial application to final offer</p>
      </div>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Candidate Name</th>
            <th>Role Applied</th>
            <th>Application Stage</th>
            <th>Stage Progression</th>
            <th>Schedule / Action</th>
          </tr>
        </thead>
        <tbody>
          ${appState.applications.map(app => `
            <tr>
              <td>
                <strong>${app.applicantName}</strong><br/>
                <span style="font-size:0.8rem; color:var(--text-muted);">${app.applicantEmail}</span>
              </td>
              <td>${app.jobTitle}</td>
              <td><span class="status-pill status-${app.status}">${app.status}</span></td>
              <td>
                <select style="padding:0.3rem 0.6rem; border-radius:var(--radius-sm); border:1px solid var(--border-color);" 
                        onchange="updateCandidateStatus('${app.id}', this.value)">
                  <option value="Applied" ${app.status === 'Applied' ? 'selected' : ''}>Applied</option>
                  <option value="UnderReview" ${app.status === 'UnderReview' ? 'selected' : ''}>Under Review</option>
                  <option value="Shortlisted" ${app.status === 'Shortlisted' ? 'selected' : ''}>Shortlisted</option>
                  <option value="Interview" ${app.status === 'Interview' ? 'selected' : ''}>Interview</option>
                  <option value="Selected" ${app.status === 'Selected' ? 'selected' : ''}>Selected</option>
                  <option value="Rejected" ${app.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
                </select>
              </td>
              <td>
                <button class="btn btn-primary btn-sm" onclick="openScheduleModal('${app.id}', '${app.applicantName}')">
                  <i class="fa-solid fa-calendar-plus"></i> Interview
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
  const app = appState.applications.find(a => a.id === appId);
  if (app) {
    app.status = newStatus;
    saveState("applications", appState.applications);
    toast(`Updated ${app.applicantName} status to ${newStatus}`, "success");
    renderWorkspace();
  }
}

function renderCompanyProfile(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <h2>Company Organization Profile</h2>
        <p>Showcase company culture, headquarters, and branding</p>
      </div>
      <button class="btn btn-primary" onclick="toast('Company settings updated!', 'success')">Save Organization</button>
    </div>

    <div class="table-container" style="padding:2rem; background:var(--bg-surface);">
      <div class="grid-form">
        <div class="form-group">
          <label>Company Name</label>
          <input type="text" value="Stripe Technologies Inc." />
        </div>
        <div class="form-group">
          <label>Official Website</label>
          <input type="url" value="https://stripe.com" />
        </div>
        <div class="form-group">
          <label>Industry</label>
          <input type="text" value="Financial Technology / SaaS" />
        </div>
        <div class="form-group">
          <label>Company Size</label>
          <input type="text" value="5000+ Employees" />
        </div>
        <div class="form-group full-width">
          <label>About Company</label>
          <textarea rows="4">Stripe is a suite of payment APIs that powers commerce for online businesses of all sizes.</textarea>
        </div>
      </div>
    </div>
  `;
}

// ==========================================================================
// 6. ADMIN DASHBOARD & MODERATION
// ==========================================================================

function renderAdminDashboard(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <h2>Global Administration & Analytics</h2>
        <p>Monitor platform health, active users, metrics, and security</p>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon primary"><i class="fa-solid fa-users"></i></div>
        <div class="stat-info">
          <h3>${appState.users.length * 128}</h3>
          <span>Registered Users</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon success"><i class="fa-solid fa-briefcase"></i></div>
        <div class="stat-info">
          <h3>${appState.jobs.length}</h3>
          <span>Active Jobs</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon warning"><i class="fa-solid fa-paper-plane"></i></div>
        <div class="stat-info">
          <h3>${appState.applications.length * 15}</h3>
          <span>Total Applications</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon info"><i class="fa-solid fa-shield-halved"></i></div>
        <div class="stat-info">
          <h3>${appState.reports.length}</h3>
          <span>Pending Flags</span>
        </div>
      </div>
    </div>

    <div class="job-cards-grid" style="grid-template-columns: 1fr 1fr;">
      <div class="table-container" style="padding:1.5rem; background:var(--bg-surface);">
        <h4>System Activity & Safety</h4>
        <p style="font-size:0.875rem; color:var(--text-muted); margin: 0.5rem 0 1rem 0;">All platform microservices are healthy.</p>
        <ul style="list-style:none; display:flex; flex-direction:column; gap:0.5rem; font-size:0.875rem;">
          <li><i class="fa-solid fa-circle-check text-success"></i> Payment gateway integration connected.</li>
          <li><i class="fa-solid fa-circle-check text-success"></i> Spam filtering algorithm running version 2.4.</li>
          <li><i class="fa-solid fa-triangle-exclamation text-warning"></i> 1 new report awaiting moderator review.</li>
        </ul>
      </div>

      <div class="table-container" style="padding:1.5rem; background:var(--bg-surface);">
        <h4>Top Hiring Categories</h4>
        <div style="margin-top:1rem; display:flex; flex-direction:column; gap:0.75rem;">
          <div>
            <div style="display:flex; justify-content:space-between; font-size:0.8rem; font-weight:600;"><span>Engineering</span><span>65%</span></div>
            <div style="height:6px; background:var(--bg-secondary); border-radius:10px; margin-top:3px;"><div style="width:65%; height:100%; background:var(--primary); border-radius:10px;"></div></div>
          </div>
          <div>
            <div style="display:flex; justify-content:space-between; font-size:0.8rem; font-weight:600;"><span>Design</span><span>20%</span></div>
            <div style="height:6px; background:var(--bg-secondary); border-radius:10px; margin-top:3px;"><div style="width:20%; height:100%; background:var(--warning); border-radius:10px;"></div></div>
          </div>
          <div>
            <div style="display:flex; justify-content:space-between; font-size:0.8rem; font-weight:600;"><span>Product & Growth</span><span>15%</span></div>
            <div style="height:6px; background:var(--bg-secondary); border-radius:10px; margin-top:3px;"><div style="width:15%; height:100%; background:var(--success); border-radius:10px;"></div></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderAdminUsers(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <h2>User Management Console</h2>
        <p>Verify, inspect, block, or delete platform accounts</p>
      </div>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Role</th>
            <th>Status</th>
            <th>Security Actions</th>
          </tr>
        </thead>
        <tbody>
          ${appState.users.map(u => `
            <tr>
              <td><strong>${u.name}</strong><br/><span style="font-size:0.8rem; color:var(--text-muted);">${u.email}</span></td>
              <td>${u.role}</td>
              <td><span class="status-pill status-${u.status === 'Active' || u.status === 'Verified' ? 'Selected' : 'Rejected'}">${u.status}</span></td>
              <td>
                <button class="btn btn-outline btn-sm" onclick="toggleBlockUser('${u.id}')">${u.status === 'Blocked' ? 'Unblock' : 'Block'}</button>
                <button class="btn btn-danger btn-sm" onclick="deleteUser('${u.id}')"><i class="fa-solid fa-trash"></i></button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function toggleBlockUser(userId) {
  const user = appState.users.find(u => u.id === userId);
  if (user) {
    user.status = user.status === "Blocked" ? "Active" : "Blocked";
    saveState("users", appState.users);
    toast(`User status updated: ${user.status}`, "info");
    renderWorkspace();
  }
}

function deleteUser(userId) {
  if (confirm("Delete this user permanently?")) {
    appState.users = appState.users.filter(u => u.id !== userId);
    saveState("users", appState.users);
    toast("User deleted from directory", "danger");
    renderWorkspace();
  }
}

function renderAdminJobModeration(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <h2>Job Moderation Desk</h2>
        <p>Approve, restrict, or purge fraudulent listings</p>
      </div>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Position Title</th>
            <th>Company</th>
            <th>Status</th>
            <th>Moderation Action</th>
          </tr>
        </thead>
        <tbody>
          ${appState.jobs.map(job => `
            <tr>
              <td><strong>${job.title}</strong></td>
              <td>${job.company}</td>
              <td><span class="status-pill status-${job.status === 'Active' ? 'Selected' : 'Rejected'}">${job.status}</span></td>
              <td>
                <button class="btn btn-outline btn-sm" onclick="toggleJobStatus('${job.id}')">${job.status === 'Active' ? 'Suspend' : 'Approve'}</button>
                <button class="btn btn-danger btn-sm" onclick="deleteJob('${job.id}')">Delete</button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderAdminReports(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-title">
        <h2>Reported Violations</h2>
        <p>Review spam flags submitted by candidates</p>
      </div>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Flagged Item</th>
            <th>Reason</th>
            <th>Explanation</th>
            <th>Resolution</th>
          </tr>
        </thead>
        <tbody>
          ${appState.reports.length === 0 ? '<tr><td colspan="4" style="text-align:center;">No pending reports!</td></tr>' : 
            appState.reports.map(rep => `
              <tr>
                <td><strong>${rep.target}</strong></td>
                <td><span class="status-pill status-Rejected">${rep.reason}</span></td>
                <td>${rep.details}</td>
                <td>
                  <button class="btn btn-success btn-sm" onclick="resolveReport('${rep.id}')"><i class="fa-solid fa-check"></i> Dismiss</button>
                </td>
              </tr>
            `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function resolveReport(repId) {
  appState.reports = appState.reports.filter(r => r.id !== repId);
  saveState("reports", appState.reports);
  toast("Report investigated and resolved", "success");
  renderWorkspace();
}

// ==========================================================================
// 7. MODALS & FORMS HANDLERS
// ==========================================================================

function openModal(modalId) {
  document.getElementById(modalId).classList.add("active");
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove("active");
}

function openJobDetails(jobId) {
  const job = appState.jobs.find(j => j.id === jobId);
  if (!job) return;

  document.getElementById("detailJobTitle").textContent = job.title;
  document.getElementById("detailContent").innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
      <h4>${job.company}</h4>
      <span class="salary-text">${job.salary}</span>
    </div>
    <div class="job-tags" style="margin-bottom:1rem;">
      <span class="tag"><i class="fa-solid fa-location-dot"></i> ${job.location}</span>
      <span class="tag"><i class="fa-solid fa-briefcase"></i> ${job.type}</span>
      <span class="tag"><i class="fa-solid fa-globe"></i> ${job.workMode}</span>
    </div>
    <h4>Description</h4>
    <p style="margin-top:0.4rem; color:var(--text-muted);">${job.description}</p>
    <h4 style="margin-top:1rem;">Required Skills</h4>
    <div class="job-tags" style="margin-top:0.4rem;">
      ${job.skills.map(s => `<span class="tag" style="background:var(--primary-light); color:var(--primary);">${s}</span>`).join("")}
    </div>
  `;

  document.getElementById("detailFooter").innerHTML = `
    <button class="btn btn-outline" onclick="openReportModal('${job.id}')"><i class="fa-solid fa-flag"></i> Report</button>
    <button class="btn btn-primary" onclick="closeModal('jobDetailModal'); openApplyModal('${job.id}');">Apply Now</button>
  `;

  openModal("jobDetailModal");
}

function openApplyModal(jobId) {
  const job = appState.jobs.find(j => j.id === jobId);
  if (!job) return;
  document.getElementById("applyJobId").value = job.id;
  document.getElementById("applyJobTitle").textContent = `Apply for ${job.title} at ${job.company}`;
  openModal("applyModal");
}

function handleApplySubmit(e) {
  e.preventDefault();
  const jobId = document.getElementById("applyJobId").value;
  const job = appState.jobs.find(j => j.id === jobId);

  const newApp = {
    id: "app-" + Date.now(),
    jobId: job.id,
    jobTitle: job.title,
    company: job.company,
    applicantName: document.getElementById("applicantName").value,
    applicantEmail: document.getElementById("applicantEmail").value,
    appliedDate: new Date().toISOString().split("T")[0],
    status: "Applied",
    coverLetter: document.getElementById("applicantCover").value,
    interview: null
  };

  appState.applications.unshift(newApp);
  job.applicantsCount = (job.applicantsCount || 0) + 1;
  saveState("applications", appState.applications);
  saveState("jobs", appState.jobs);

  closeModal("applyModal");
  toast("Application submitted successfully!", "success");
  if (appState.currentTab === "my-applications") renderWorkspace();
}

function openPostJobModal() {
  document.getElementById("postJobForm").reset();
  document.getElementById("editJobId").value = "";
  document.getElementById("postJobModalTitle").textContent = "Post a New Opportunity";
  document.getElementById("saveJobBtn").textContent = "Post Job";
  openModal("postJobModal");
}

function editJob(jobId) {
  const job = appState.jobs.find(j => j.id === jobId);
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

function handleJobSubmit(e) {
  e.preventDefault();
  const editId = document.getElementById("editJobId").value;
  const skillsArray = document.getElementById("skillsInput").value.split(",").map(s => s.trim()).filter(Boolean);

  if (editId) {
    // Edit existing
    const job = appState.jobs.find(j => j.id === editId);
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
    // Create new
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
      status: "Active",
      applicantsCount: 0
    };
    appState.jobs.unshift(newJob);
    toast("New job posted successfully", "success");
  }

  saveState("jobs", appState.jobs);
  closeModal("postJobModal");
  renderWorkspace();
}

function toggleJobStatus(jobId) {
  const job = appState.jobs.find(j => j.id === jobId);
  if (job) {
    job.status = job.status === "Active" ? "Closed" : "Active";
    saveState("jobs", appState.jobs);
    toast(`Job is now marked as ${job.status}`, "info");
    renderWorkspace();
  }
}

function deleteJob(jobId) {
  if (confirm("Delete this listing?")) {
    appState.jobs = appState.jobs.filter(j => j.id !== jobId);
    saveState("jobs", appState.jobs);
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
  const app = appState.applications.find(a => a.id === appId);

  if (app) {
    app.status = "Interview";
    app.interview = {
      dateTime: document.getElementById("schedDateTime").value,
      mode: document.getElementById("schedMode").value,
      link: document.getElementById("schedLink").value
    };
    saveState("applications", appState.applications);
    toast(`Interview invitation sent to ${app.applicantName}`, "success");
    closeModal("scheduleModal");
    renderWorkspace();
  }
}

function openReportModal(targetId) {
  document.getElementById("reportTargetId").value = targetId;
  openModal("reportModal");
}

function handleReportSubmit(e) {
  e.preventDefault();
  const newReport = {
    id: "rep-" + Date.now(),
    target: `Job #${document.getElementById("reportTargetId").value}`,
    reason: document.getElementById("reportReason").value,
    details: document.getElementById("reportDetails").value,
    status: "Pending"
  };
  appState.reports.push(newReport);
  saveState("reports", appState.reports);
  closeModal("reportModal");
  toast("Report sent to moderators for review", "warning");
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
    toastEl.style.transition = "all 0.3s ease";
    setTimeout(() => toastEl.remove(), 300);
  }, 3500);
}

function updateNotifications() {
  const list = document.getElementById("notifList");
  const notifications = [
    { title: "Interview Request Received", desc: "Stripe invited you to an interview.", unread: true },
    { title: "Application Under Review", desc: "Figma is reviewing your resume.", unread: true },
    { title: "New Job Alert", desc: "DevOps Engineer role matches your profile.", unread: false }
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
