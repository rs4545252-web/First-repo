// jobs.js: Job and Internship Explorer with dynamic Skill-Match scoring and 1-click application

const JobsComponent = {
  currentFilters: {
    query: "",
    type: "all",
    mode: "all",
    minSalary: 0,
    onlyEligible: false,
    sortBy: "match" // "match" | "salary" | "deadline"
  },

  render(container) {
    const student = window.AppState.getCurrentStudent();
    const allJobs = window.AppState.getAllJobs();

    container.innerHTML = `
      <div class="jobs-view-wrapper animate-fade-in">
        
        <!-- Header & Stats Bar -->
        <div class="page-title-banner">
          <div>
            <h1 class="page-title"><i class="fas fa-briefcase text-indigo"></i> Campus Placement & Internship Drives</h1>
            <p class="page-subtitle">Discover opportunities curated for your batch. Real-time skill-match shows how your profile aligns with each role.</p>
          </div>
          <div class="banner-quick-stats">
            <span class="stat-pill"><i class="fas fa-check-double text-emerald"></i> <strong>${allJobs.length}</strong> Active Drives</span>
            <span class="stat-pill"><i class="fas fa-user-graduate text-indigo"></i> <strong>${student.cgpa} CGPA</strong> Verified</span>
          </div>
        </div>

        <!-- Search and Filter Bar -->
        <div class="filters-card">
          <div class="search-input-group">
            <i class="fas fa-search search-icon"></i>
            <input 
              type="text" 
              id="jobs-search-input" 
              class="form-control-search" 
              placeholder="Search by job title, company (Google, Microsoft, Stripe...), or skills (Python, React, Docker)..."
              value="${this.currentFilters.query}"
            />
            ${this.currentFilters.query ? '<button class="clear-search-btn" id="btn-clear-search">&times;</button>' : ''}
          </div>

          <div class="filters-row">
            <!-- Job Type Filter -->
            <div class="filter-item">
              <label><i class="fas fa-clock"></i> Type</label>
              <select id="filter-job-type" class="filter-select">
                <option value="all" ${this.currentFilters.type === 'all' ? 'selected' : ''}>All Types</option>
                <option value="Full-time" ${this.currentFilters.type === 'Full-time' ? 'selected' : ''}>Full-time</option>
                <option value="Internship" ${this.currentFilters.type === 'Internship' ? 'selected' : ''}>Internship</option>
              </select>
            </div>

            <!-- Work Mode Filter -->
            <div class="filter-item">
              <label><i class="fas fa-map-marker-alt"></i> Mode</label>
              <select id="filter-job-mode" class="filter-select">
                <option value="all" ${this.currentFilters.mode === 'all' ? 'selected' : ''}>All Modes</option>
                <option value="Remote" ${this.currentFilters.mode === 'Remote' ? 'selected' : ''}>Remote</option>
                <option value="Hybrid" ${this.currentFilters.mode === 'Hybrid' ? 'selected' : ''}>Hybrid</option>
                <option value="On-site" ${this.currentFilters.mode === 'On-site' ? 'selected' : ''}>On-site</option>
              </select>
            </div>

            <!-- Sort Option -->
            <div class="filter-item">
              <label><i class="fas fa-sort-amount-down"></i> Sort By</label>
              <select id="filter-sort-by" class="filter-select">
                <option value="match" ${this.currentFilters.sortBy === 'match' ? 'selected' : ''}>Best Skill Match</option>
                <option value="salary" ${this.currentFilters.sortBy === 'salary' ? 'selected' : ''}>Highest Compensation</option>
                <option value="deadline" ${this.currentFilters.sortBy === 'deadline' ? 'selected' : ''}>Deadline Approaching</option>
              </select>
            </div>

            <!-- CGPA Eligibility Toggle -->
            <div class="filter-toggle-item">
              <label class="switch-container">
                <input type="checkbox" id="toggle-eligible-only" ${this.currentFilters.onlyEligible ? 'checked' : ''} />
                <span class="switch-slider"></span>
                <span class="switch-label">Eligible Only (CGPA &ge; Cutoff)</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Jobs Grid Container -->
        <div class="jobs-results-container" id="jobs-grid-container">
          <!-- Populated dynamically -->
        </div>

      </div>
    `;

    this.renderJobsGrid(container, student, allJobs);
    this.attachEvents(container, student);
  },

  renderJobsGrid(container, student, allJobs) {
    const gridContainer = container.querySelector("#jobs-grid-container");
    if (!gridContainer) return;

    // Filter jobs
    let filtered = allJobs.filter(job => {
      // Query filter
      if (this.currentFilters.query) {
        const q = this.currentFilters.query.toLowerCase();
        const inTitle = job.title.toLowerCase().includes(q);
        const inCompany = job.companyName.toLowerCase().includes(q);
        const inSkills = job.requiredSkills.some(s => s.toLowerCase().includes(q)) || 
                         (job.preferredSkills && job.preferredSkills.some(s => s.toLowerCase().includes(q)));
        if (!inTitle && !inCompany && !inSkills) return false;
      }

      // Type filter
      if (this.currentFilters.type !== "all" && job.type !== this.currentFilters.type) {
        return false;
      }

      // Mode filter
      if (this.currentFilters.mode !== "all" && job.workMode !== this.currentFilters.mode) {
        return false;
      }

      // Eligibility filter
      if (this.currentFilters.onlyEligible) {
        if (student.cgpa < job.minCgpa) return false;
      }

      return true;
    });

    // Compute matches & sort
    const jobsWithScores = filtered.map(job => {
      const match = Helpers.calculateSkillMatch(student.skills, job.requiredSkills, job.preferredSkills);
      const isEligible = student.cgpa >= job.minCgpa;
      const applied = window.AppState.hasApplied(job.id);
      return {
        ...job,
        match,
        isEligible,
        applied
      };
    });

    if (this.currentFilters.sortBy === "match") {
      jobsWithScores.sort((a, b) => b.match.percentage - a.match.percentage);
    } else if (this.currentFilters.sortBy === "salary") {
      jobsWithScores.sort((a, b) => b.numericMinSalary - a.numericMinSalary);
    } else if (this.currentFilters.sortBy === "deadline") {
      jobsWithScores.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    }

    if (jobsWithScores.length === 0) {
      gridContainer.innerHTML = `
        <div class="empty-jobs-card">
          <i class="fas fa-search-minus empty-icon"></i>
          <h3>No matching placement drives found</h3>
          <p>Try resetting filters, searching for broader terms, or toggling off the strict eligibility filter.</p>
          <button class="btn btn-outline-primary mt-3" id="btn-reset-filters">Reset All Filters</button>
        </div>
      `;
      const resetBtn = gridContainer.querySelector("#btn-reset-filters");
      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          this.currentFilters = {
            query: "",
            type: "all",
            mode: "all",
            minSalary: 0,
            onlyEligible: false,
            sortBy: "match"
          };
          this.render(container);
        });
      }
      return;
    }

    gridContainer.innerHTML = `
      <div class="jobs-cards-grid">
        ${jobsWithScores.map(job => {
          const days = Helpers.daysLeft(job.deadline);
          const deadlineText = days !== null ? (days > 0 ? `${days} days left` : "Deadline today") : "";
          const matchBadgeClass = Helpers.getMatchBadgeClass(job.match.percentage);

          return `
            <div class="job-card ${job.applied ? 'job-applied' : ''}">
              
              <!-- Card Header -->
              <div class="job-card-header">
                <div class="job-company-avatar">
                  <img src="${job.companyLogo}" alt="${job.companyName}" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(job.companyName)}&background=1e293b&color=fff'" />
                </div>
                <div class="job-title-wrapper">
                  <h3 class="job-title" title="${job.title}">${job.title}</h3>
                  <div class="job-company-sub">
                    <span class="company-name">${job.companyName}</span>
                    <span class="dot-separator">•</span>
                    <span class="job-location"><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
                  </div>
                </div>
                
                <!-- Live Skill Match Gauge Pill -->
                <div class="skill-match-pill ${matchBadgeClass}" title="${job.match.totalMatched} of ${job.match.totalRequired} required skills matched in your profile">
                  <span class="match-pct">${job.match.percentage}%</span>
                  <span class="match-label">Match</span>
                </div>
              </div>

              <!-- Badges Row -->
              <div class="job-badges-row">
                <span class="badge-tag badge-type">${job.type}</span>
                <span class="badge-tag badge-mode">${job.workMode}</span>
                <span class="badge-tag badge-salary"><i class="fas fa-rupee-sign"></i> ${job.stipendOrCtc}</span>
                <span class="badge-tag ${job.isEligible ? 'badge-eligible' : 'badge-ineligible'}">
                  <i class="fas ${job.isEligible ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> Min CGPA: ${job.minCgpa}
                </span>
              </div>

              <!-- Description Snippet -->
              <p class="job-description-snippet">${job.description}</p>

              <!-- Skills Match Breakdown Bar -->
              <div class="job-skills-breakdown">
                <div class="skills-breakdown-header">
                  <span class="breakdown-title"><i class="fas fa-check-circle text-emerald"></i> Matched (${job.match.matched.length})</span>
                  ${job.match.missing.length > 0 ? `<span class="breakdown-missing text-muted"><i class="fas fa-plus-circle"></i> Missing: ${job.match.missing.slice(0, 2).join(', ')}${job.match.missing.length > 2 ? ' +' + (job.match.missing.length - 2) : ''}</span>` : '<span class="breakdown-perfect text-emerald"><i class="fas fa-star"></i> Full Skill Match</span>'}
                </div>
                <div class="job-skills-pills">
                  ${job.match.matched.map(s => `<span class="matched-skill-chip"><i class="fas fa-check"></i> ${s}</span>`).join('')}
                  ${job.match.missing.map(s => `<span class="missing-skill-chip">${s}</span>`).join('')}
                </div>
              </div>

              <!-- Card Footer -->
              <div class="job-card-footer">
                <div class="job-deadline-info">
                  <i class="far fa-clock"></i> 
                  <span>${deadlineText || Helpers.formatDate(job.deadline)}</span>
                </div>

                <div class="job-card-actions">
                  <button class="btn btn-sm btn-outline btn-view-job" data-id="${job.id}">
                    Details
                  </button>

                  ${job.applied ? `
                    <button class="btn btn-sm btn-applied" disabled>
                      <i class="fas fa-check"></i> Applied
                    </button>
                  ` : `
                    <button class="btn btn-sm btn-primary btn-apply-job" data-id="${job.id}">
                      <i class="fas fa-paper-plane"></i> Apply Now
                    </button>
                  `}
                </div>
              </div>

            </div>
          `;
        }).join('')}
      </div>
    `;

    this.attachJobCardEvents(gridContainer, student, allJobs);
  },

  attachEvents(container, student) {
    const searchInput = container.querySelector("#jobs-search-input");
    const clearSearchBtn = container.querySelector("#btn-clear-search");
    const typeSelect = container.querySelector("#filter-job-type");
    const modeSelect = container.querySelector("#filter-job-mode");
    const sortSelect = container.querySelector("#filter-sort-by");
    const eligibleToggle = container.querySelector("#toggle-eligible-only");

    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.currentFilters.query = e.target.value;
        this.renderJobsGrid(container, student, window.AppState.getAllJobs());
      });
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener("click", () => {
        this.currentFilters.query = "";
        searchInput.value = "";
        this.renderJobsGrid(container, student, window.AppState.getAllJobs());
      });
    }

    if (typeSelect) {
      typeSelect.addEventListener("change", (e) => {
        this.currentFilters.type = e.target.value;
        this.renderJobsGrid(container, student, window.AppState.getAllJobs());
      });
    }

    if (modeSelect) {
      modeSelect.addEventListener("change", (e) => {
        this.currentFilters.mode = e.target.value;
        this.renderJobsGrid(container, student, window.AppState.getAllJobs());
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.currentFilters.sortBy = e.target.value;
        this.renderJobsGrid(container, student, window.AppState.getAllJobs());
      });
    }

    if (eligibleToggle) {
      eligibleToggle.addEventListener("change", (e) => {
        this.currentFilters.onlyEligible = e.target.checked;
        this.renderJobsGrid(container, student, window.AppState.getAllJobs());
      });
    }
  },

  attachJobCardEvents(gridContainer, student, allJobs) {
    // View Job Details
    gridContainer.querySelectorAll(".btn-view-job").forEach(btn => {
      btn.addEventListener("click", () => {
        const jobId = btn.getAttribute("data-id");
        const job = allJobs.find(j => j.id === jobId);
        if (job) {
          JobsComponent.showJobModal(job, student);
        }
      });
    });

    // Apply Button
    gridContainer.querySelectorAll(".btn-apply-job").forEach(btn => {
      btn.addEventListener("click", () => {
        const jobId = btn.getAttribute("data-id");
        const job = allJobs.find(j => j.id === jobId);
        if (job) {
          JobsComponent.showApplyModal(job, student);
        }
      });
    });
  },

  showJobModal(job, student) {
    const match = Helpers.calculateSkillMatch(student.skills, job.requiredSkills, job.preferredSkills);
    const applied = window.AppState.hasApplied(job.id);
    const isEligible = student.cgpa >= job.minCgpa;

    const modal = document.getElementById("modal-job-details");
    if (!modal) return;

    const content = modal.querySelector(".modal-body-content");
    content.innerHTML = `
      <div class="job-modal-details">
        <div class="job-modal-header">
          <img src="${job.companyLogo}" alt="${job.companyName}" class="modal-company-logo" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(job.companyName)}'" />
          <div>
            <h2 class="modal-job-title">${job.title}</h2>
            <div class="modal-company-line">
              <strong>${job.companyName}</strong> • <span>${job.location}</span> • <span>${job.workMode}</span>
            </div>
          </div>
        </div>

        <div class="modal-meta-cards">
          <div class="meta-card">
            <span class="meta-label">Compensation</span>
            <span class="meta-val text-emerald">${job.stipendOrCtc}</span>
          </div>
          <div class="meta-card">
            <span class="meta-label">Job Type</span>
            <span class="meta-val">${job.type}</span>
          </div>
          <div class="meta-card">
            <span class="meta-label">Eligibility Cutoff</span>
            <span class="meta-val ${isEligible ? 'text-success' : 'text-danger'}">Min ${job.minCgpa} CGPA (${student.cgpa} Yours)</span>
          </div>
          <div class="meta-card">
            <span class="meta-label">Skill Match</span>
            <span class="meta-val text-indigo">${match.percentage}% Match</span>
          </div>
        </div>

        <!-- Role Description -->
        <div class="modal-section mt-4">
          <h4 class="modal-section-title"><i class="fas fa-align-left"></i> About the Role</h4>
          <p class="modal-text">${job.description}</p>
        </div>

        <!-- Skills Breakdown -->
        <div class="modal-section mt-4">
          <h4 class="modal-section-title"><i class="fas fa-layer-group"></i> Required & Preferred Skills</h4>
          <div class="modal-skills-grid">
            <div>
              <h5 class="skill-req-title">Required Core Skills</h5>
              <div class="skills-tag-cloud">
                ${job.requiredSkills.map(s => {
                  const has = match.matched.includes(s);
                  return `<span class="badge-skill-check ${has ? 'has-skill' : 'missing-skill'}"><i class="fas ${has ? 'fa-check text-emerald' : 'fa-circle text-muted'}"></i> ${s}</span>`;
                }).join('')}
              </div>
            </div>
            ${job.preferredSkills && job.preferredSkills.length > 0 ? `
              <div>
                <h5 class="skill-req-title">Bonus / Preferred Skills</h5>
                <div class="skills-tag-cloud">
                  ${job.preferredSkills.map(s => {
                    const has = match.preferredMatched.includes(s);
                    return `<span class="badge-skill-check ${has ? 'has-skill' : 'missing-skill'}"><i class="fas ${has ? 'fa-check text-emerald' : 'fa-circle text-muted'}"></i> ${s}</span>`;
                  }).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Selection Process Roadmap -->
        <div class="modal-section mt-4">
          <h4 class="modal-section-title"><i class="fas fa-tasks"></i> Selection Process & Interview Rounds</h4>
          <div class="rounds-stepper">
            ${job.rounds.map((r, i) => `
              <div class="stepper-step">
                <div class="step-number">${i + 1}</div>
                <div class="step-info">${r}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Eligibility Criteria Details -->
        <div class="modal-section mt-4">
          <h4 class="modal-section-title"><i class="fas fa-user-check"></i> Eligibility Rules</h4>
          <ul class="eligibility-list">
            <li><i class="fas fa-graduation-cap"></i> Eligible Batches / Branches: <strong>${job.eligibleBranches.join(', ')}</strong></li>
            <li><i class="fas fa-ban"></i> Max Active Backlogs Allowed: <strong>${job.maxBacklogs}</strong></li>
            <li><i class="fas fa-users"></i> Campus Openings: <strong>${job.openings} positions</strong></li>
            <li><i class="fas fa-calendar-times"></i> Application Deadline: <strong>${Helpers.formatDate(job.deadline)}</strong></li>
          </ul>
        </div>

        <!-- Perks & Benefits -->
        ${job.perks && job.perks.length > 0 ? `
          <div class="modal-section mt-4">
            <h4 class="modal-section-title"><i class="fas fa-gift"></i> Company Perks</h4>
            <div class="perks-tags">
              ${job.perks.map(p => `<span class="perk-pill"><i class="fas fa-star text-amber"></i> ${p}</span>`).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Action Footer -->
        <div class="modal-actions-footer mt-5">
          <button class="btn btn-outline" onclick="Helpers.closeModal('modal-job-details')">Close</button>
          ${applied ? `
            <button class="btn btn-applied" disabled><i class="fas fa-check"></i> Already Applied</button>
          ` : `
            <button class="btn btn-primary" id="btn-modal-apply-trigger"><i class="fas fa-paper-plane"></i> Apply for this Drive</button>
          `}
        </div>

      </div>
    `;

    Helpers.openModal("modal-job-details");

    const applyTrigger = content.querySelector("#btn-modal-apply-trigger");
    if (applyTrigger) {
      applyTrigger.addEventListener("click", () => {
        Helpers.closeModal("modal-job-details");
        JobsComponent.showApplyModal(job, student);
      });
    }
  },

  showApplyModal(job, student) {
    const modal = document.getElementById("modal-apply-job");
    if (!modal) return;

    modal.querySelector("#apply-job-title").textContent = job.title;
    modal.querySelector("#apply-company-name").textContent = job.companyName;
    modal.querySelector("#apply-cgpa-val").textContent = student.cgpa;
    modal.querySelector("#apply-resume-filename").textContent = student.resume?.filename || "Alex_Chen_SWE_Resume_2025.pdf";

    const submitBtn = modal.querySelector("#btn-confirm-apply");
    const noteInput = modal.querySelector("#apply-cover-note");
    noteInput.value = `I am excited to apply for the ${job.title} position at ${job.companyName}. My coursework and projects in ${job.requiredSkills.slice(0, 3).join(', ')} directly align with your team's mission.`;

    submitBtn.onclick = () => {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Submitting...`;

      setTimeout(() => {
        const result = window.AppState.applyToJob(job.id, noteInput.value, student.resume?.filename);
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<i class="fas fa-paper-plane"></i> Confirm & Submit Application`;

        if (result.success) {
          Helpers.closeModal("modal-apply-job");
          Helpers.showToast("Application Submitted!", `Your application for ${job.title} at ${job.companyName} has been received.`, "success");
          // Re-render
          const container = document.getElementById("view-jobs");
          if (container) JobsComponent.render(container);
        } else {
          Helpers.showToast("Cannot Apply", result.message, "error");
        }
      }, 600);
    };

    Helpers.openModal("modal-apply-job");
  }
};

window.JobsComponent = JobsComponent;
