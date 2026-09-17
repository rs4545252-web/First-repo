// app.js: Core Application Controller, Navigation, and Global Form Bindings

const App = {
  currentView: "profile",
  theme: "dark",

  init() {
    this.initTheme();
    this.bindNavigation();
    this.bindGlobalModals();
    this.bindRoleSwitcher();
    this.bindStudentSwitcher();

    // Subscribe to state changes to auto-update view
    window.AppState.subscribe(() => {
      this.renderCurrentView();
      this.updateHeaderBadges();
    });

    // Check initial view from URL hash or default
    const hash = window.location.hash.replace("#", "");
    if (hash && ["profile", "resume", "jobs", "applications", "recruiter", "analytics"].includes(hash)) {
      this.switchView(hash);
    } else {
      this.switchView("profile");
    }

    this.updateHeaderBadges();
  },

  initTheme() {
    const savedTheme = localStorage.getItem("SKILLPORTAL_THEME") || "dark";
    this.theme = savedTheme;
    document.documentElement.setAttribute("data-theme", this.theme);

    const themeToggleBtn = document.getElementById("btn-toggle-theme");
    if (themeToggleBtn) {
      themeToggleBtn.innerHTML = this.theme === "dark" ? `<i class="fas fa-sun"></i>` : `<i class="fas fa-moon"></i>`;
      themeToggleBtn.addEventListener("click", () => {
        this.theme = this.theme === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", this.theme);
        localStorage.setItem("SKILLPORTAL_THEME", this.theme);
        themeToggleBtn.innerHTML = this.theme === "dark" ? `<i class="fas fa-sun"></i>` : `<i class="fas fa-moon"></i>`;
        Helpers.playAudioCue("click");
      });
    }
  },

  bindNavigation() {
    document.querySelectorAll(".nav-link[data-view]").forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const view = link.getAttribute("data-view");
        this.switchView(view);
      });
    });

    // Quick reset data
    const resetBtn = document.getElementById("btn-reset-demo-data");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (confirm("Reset all portal data to initial demo seed state?")) {
          window.AppState.resetToDemoData();
          Helpers.showToast("Data Reset", "Portal data reset to factory demo values.", "info");
          this.switchView(this.currentView);
        }
      });
    }
  },

  switchView(viewName) {
    this.currentView = viewName;
    window.location.hash = viewName;

    // Update active nav link
    document.querySelectorAll(".nav-link[data-view]").forEach(link => {
      if (link.getAttribute("data-view") === viewName) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    // Hide all view containers and display current
    document.querySelectorAll(".view-panel").forEach(panel => {
      panel.classList.remove("active");
    });

    const targetPanel = document.getElementById(`view-${viewName}`);
    if (targetPanel) {
      targetPanel.classList.add("active");
    }

    this.renderCurrentView();
    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  renderCurrentView() {
    const container = document.getElementById(`view-${this.currentView}`);
    if (!container) return;

    switch (this.currentView) {
      case "profile":
        window.ProfileComponent.render(container);
        break;
      case "resume":
        window.ResumeComponent.render(container);
        break;
      case "jobs":
        window.JobsComponent.render(container);
        break;
      case "applications":
        window.ApplicationsComponent.render(container);
        break;
      case "recruiter":
        window.RecruiterComponent.render(container);
        break;
      case "analytics":
        window.AnalyticsComponent.render(container);
        break;
      default:
        window.ProfileComponent.render(container);
    }
  },

  updateHeaderBadges() {
    const student = window.AppState.getCurrentStudent();
    const apps = window.AppState.getApplicationsForCurrentStudent();
    const activeJobs = window.AppState.getAllJobs();

    // App header badge for applications count
    const appsBadge = document.getElementById("nav-apps-badge");
    if (appsBadge) {
      appsBadge.textContent = apps.length;
    }

    // Jobs badge
    const jobsBadge = document.getElementById("nav-jobs-badge");
    if (jobsBadge) {
      jobsBadge.textContent = activeJobs.length;
    }

    // Top profile pill avatar and name
    const topAvatar = document.getElementById("header-user-avatar");
    const topName = document.getElementById("header-user-name");
    const topRole = document.getElementById("header-user-role");

    if (topAvatar) topAvatar.src = student.avatar;
    if (topName) topName.textContent = student.name;
    if (topRole) topRole.textContent = student.degree.split(" in ")[1] || "Engineering";
  },

  bindRoleSwitcher() {
    const roleSelector = document.getElementById("select-active-role");
    if (roleSelector) {
      roleSelector.value = window.AppState.getUserRole();
      roleSelector.addEventListener("change", (e) => {
        const role = e.target.value;
        window.AppState.switchRole(role);

        const studentControls = document.getElementById("header-student-controls");
        if (role === "recruiter") {
          if (studentControls) studentControls.style.display = "none";
          this.switchView("recruiter");
          Helpers.showToast("Recruiter Mode Activated", "You can now post openings and review applicant portfolios.", "info");
        } else {
          if (studentControls) studentControls.style.display = "flex";
          this.switchView("profile");
          Helpers.showToast("Student Mode Activated", "Viewing student portfolio, skills, and applications.", "info");
        }
      });
    }
  },

  bindStudentSwitcher() {
    const studentSelect = document.getElementById("select-switch-student");
    if (studentSelect) {
      studentSelect.value = window.AppState.state.activeStudentId;
      studentSelect.addEventListener("change", (e) => {
        const studentId = e.target.value;
        window.AppState.switchStudent(studentId);
        const cur = window.AppState.getCurrentStudent();
        Helpers.showToast("Student Switched", `Now viewing profile as ${cur.name} (${cur.degree})`, "success");
        this.renderCurrentView();
      });
    }
  },

  bindGlobalModals() {
    // 1. Add Skill Form
    const addSkillForm = document.getElementById("form-add-skill");
    if (addSkillForm) {
      addSkillForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("input-skill-name").value.trim();
        const category = document.getElementById("input-skill-category").value;
        const level = document.getElementById("input-skill-level").value;

        if (!name) return;

        const success = window.AppState.addSkill({ name, category, level });
        if (success) {
          Helpers.showToast("Skill Added!", `"${name}" (${level}) added to your verified matrix.`, "success");
          addSkillForm.reset();
          Helpers.closeModal("modal-add-skill");
        } else {
          Helpers.showToast("Skill Exists", `"${name}" is already in your skills profile.`, "warning");
        }
      });
    }

    // 2. Add Project Form
    const addProjectForm = document.getElementById("form-add-project");
    if (addProjectForm) {
      addProjectForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const title = document.getElementById("input-proj-title").value.trim();
        const description = document.getElementById("input-proj-desc").value.trim();
        const tagsRaw = document.getElementById("input-proj-tags").value.trim();
        const liveUrl = document.getElementById("input-proj-live").value.trim();
        const githubUrl = document.getElementById("input-proj-github").value.trim();
        const highlightsRaw = document.getElementById("input-proj-highlights").value.trim();
        const featured = document.getElementById("input-proj-featured").checked;

        if (!title || !description) return;

        const tags = tagsRaw ? tagsRaw.split(",").map(t => t.trim()).filter(Boolean) : ["Full-Stack"];
        const highlights = highlightsRaw ? highlightsRaw.split("\n").map(h => h.trim()).filter(Boolean) : [];

        window.AppState.addProject({
          title,
          description,
          tags,
          liveUrl,
          githubUrl,
          highlights,
          featured,
          date: "Sep 2026"
        });

        Helpers.showToast("Project Published!", `"${title}" added to your featured portfolio.`, "success");
        addProjectForm.reset();
        Helpers.closeModal("modal-add-project");
      });
    }

    // 3. Edit Profile Form
    const editProfileForm = document.getElementById("form-edit-profile");
    if (editProfileForm) {
      editProfileForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const updates = {
          name: document.getElementById("edit-name").value.trim(),
          headline: document.getElementById("edit-headline").value.trim(),
          college: document.getElementById("edit-college").value.trim(),
          degree: document.getElementById("edit-degree").value.trim(),
          cgpa: parseFloat(document.getElementById("edit-cgpa").value) || 8.5,
          batch: document.getElementById("edit-batch").value.trim(),
          location: document.getElementById("edit-location").value.trim(),
          bio: document.getElementById("edit-bio").value.trim(),
          links: {
            github: document.getElementById("edit-github").value.trim(),
            linkedin: document.getElementById("edit-linkedin").value.trim(),
            leetcode: document.getElementById("edit-leetcode").value.trim(),
            portfolio: document.getElementById("edit-portfolio").value.trim()
          }
        };

        window.AppState.updateStudentProfile(updates);
        Helpers.showToast("Profile Updated", "Your academic & personal details were saved.", "success");
        Helpers.closeModal("modal-edit-profile");
      });
    }

    // 4. Post Job Form (Recruiter)
    const postJobForm = document.getElementById("form-post-job");
    if (postJobForm) {
      postJobForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const title = document.getElementById("post-job-title").value.trim();
        const type = document.getElementById("post-job-type").value;
        const workMode = document.getElementById("post-job-mode").value;
        const location = document.getElementById("post-job-location").value.trim() || "Bangalore, India";
        const stipendOrCtc = document.getElementById("post-job-ctc").value.trim();
        const minCgpa = parseFloat(document.getElementById("post-job-cgpa").value) || 7.0;
        const openings = parseInt(document.getElementById("post-job-openings").value) || 5;
        const deadline = document.getElementById("post-job-deadline").value || "2026-10-31";
        const reqSkillsRaw = document.getElementById("post-job-skills-req").value.trim();
        const prefSkillsRaw = document.getElementById("post-job-skills-pref").value.trim();
        const description = document.getElementById("post-job-description").value.trim();

        if (!title || !stipendOrCtc) return;

        const requiredSkills = reqSkillsRaw ? reqSkillsRaw.split(",").map(s => s.trim()).filter(Boolean) : ["Data Structures & Algorithms", "Python"];
        const preferredSkills = prefSkillsRaw ? prefSkillsRaw.split(",").map(s => s.trim()).filter(Boolean) : ["Docker"];

        const created = window.AppState.postNewJob({
          title,
          type,
          workMode,
          location,
          stipendOrCtc,
          minCgpa,
          openings,
          deadline,
          requiredSkills,
          preferredSkills,
          description
        });

        Helpers.showToast("Placement Drive Posted!", `"${created.title}" is now live for student applications.`, "success");
        postJobForm.reset();
        Helpers.closeModal("modal-post-job");
      });
    }

    // Close buttons on all modals
    document.querySelectorAll(".modal-close-btn, .btn-modal-cancel").forEach(btn => {
      btn.addEventListener("click", () => {
        const modal = btn.closest(".modal-backdrop");
        if (modal) {
          Helpers.closeModal(modal.id);
        }
      });
    });

    // Close modal on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        document.querySelectorAll(".modal-backdrop.active").forEach(m => {
          Helpers.closeModal(m.id);
        });
      }
    });
  }
};

window.App = App;

// Bootstrap on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  window.App.init();
});
