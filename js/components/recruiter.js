// recruiter.js: Recruiter Portal for posting opportunities & managing candidate pipeline

const RecruiterComponent = {
  selectedJobFilter: "all",

  render(container) {
    const currentCompany = window.AppState.getCurrentCompany();
    const allCompanies = window.AppState.state.companies;
    const companyJobs = window.AppState.getJobsForCompany(currentCompany.id);
    
    // Gather all applicants for company jobs
    let allApplicants = [];
    companyJobs.forEach(job => {
      const jobApplicants = window.AppState.getApplicantsForJob(job.id);
      allApplicants = allApplicants.concat(jobApplicants);
    });

    const shortlistedCount = allApplicants.filter(a => a.stage === "shortlisted" || a.stage === "technical_interview" || a.stage === "hr_round").length;
    const offeredCount = allApplicants.filter(a => a.stage === "offered").length;

    container.innerHTML = `
      <div class="recruiter-view-wrapper animate-fade-in">
        
        <!-- Recruiter Header Card -->
        <div class="recruiter-header-card">
          <div class="recruiter-header-left">
            <img src="${currentCompany.logo}" alt="${currentCompany.name}" class="recruiter-company-logo" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(currentCompany.name)}'" />
            <div>
              <div class="recruiter-company-title-row">
                <h1 class="recruiter-company-name">${currentCompany.name} Recruiter Portal</h1>
                <span class="verified-badge"><i class="fas fa-check-circle"></i> Campus Partner</span>
              </div>
              <p class="recruiter-company-desc">${currentCompany.description}</p>
              
              <!-- Company Switcher Dropdown -->
              <div class="company-switch-row mt-2">
                <span class="text-muted"><i class="fas fa-building"></i> Switch Company Portal:</span>
                <select id="select-recruiter-company" class="form-control-select-sm">
                  ${allCompanies.map(c => `
                    <option value="${c.id}" ${c.id === currentCompany.id ? 'selected' : ''}>${c.name}</option>
                  `).join('')}
                </select>
              </div>
            </div>
          </div>

          <div class="recruiter-header-actions">
            <button class="btn btn-primary" id="btn-open-post-job">
              <i class="fas fa-plus-circle"></i> Post New Opportunity
            </button>
          </div>
        </div>

        <!-- Metric KPI Cards -->
        <div class="recruiter-kpi-grid">
          <div class="kpi-card">
            <div class="kpi-icon icon-blue"><i class="fas fa-briefcase"></i></div>
            <div class="kpi-info">
              <span class="kpi-label">Active Drives</span>
              <strong class="kpi-val">${companyJobs.length}</strong>
            </div>
          </div>
          <div class="kpi-card">
            <div class="kpi-icon icon-indigo"><i class="fas fa-users"></i></div>
            <div class="kpi-info">
              <span class="kpi-label">Total Applicants</span>
              <strong class="kpi-val">${allApplicants.length}</strong>
            </div>
          </div>
          <div class="kpi-card">
            <div class="kpi-icon icon-amber"><i class="fas fa-user-clock"></i></div>
            <div class="kpi-info">
              <span class="kpi-label">In Assessment / Interview</span>
              <strong class="kpi-val">${shortlistedCount}</strong>
            </div>
          </div>
          <div class="kpi-card">
            <div class="kpi-icon icon-emerald"><i class="fas fa-trophy"></i></div>
            <div class="kpi-info">
              <span class="kpi-label">Offers Released</span>
              <strong class="kpi-val text-emerald">${offeredCount}</strong>
            </div>
          </div>
        </div>

        <!-- Two Tabs: 1. Manage Job Openings | 2. Review Applicants Pipeline -->
        <div class="recruiter-sections-wrapper mt-5">
          
          <!-- Section 1: Active Job Openings -->
          <div class="section-card mb-5">
            <div class="section-card-header">
              <div>
                <h3 class="section-title"><i class="fas fa-list"></i> Active Postings & Openings</h3>
                <p class="section-sub">Manage active placement drives, requirements, and candidate applications</p>
              </div>
              <button class="btn btn-sm btn-outline-primary" id="btn-quick-post-job">
                <i class="fas fa-plus"></i> Post Job
              </button>
            </div>

            <div class="table-responsive-card">
              ${companyJobs.length === 0 ? `
                <div class="empty-state-card">
                  <p>No jobs currently posted by ${currentCompany.name}.</p>
                  <button class="btn btn-sm btn-primary mt-2" id="btn-empty-post">Post First Job</button>
                </div>
              ` : `
                <table class="pipeline-table">
                  <thead>
                    <tr>
                      <th>Job Title & Type</th>
                      <th>Work Mode</th>
                      <th>Compensation</th>
                      <th>Min CGPA</th>
                      <th>Required Skills</th>
                      <th>Applicants</th>
                      <th>Deadline</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${companyJobs.map(job => {
                      const appCount = window.AppState.getApplicantsForJob(job.id).length;
                      return `
                        <tr>
                          <td>
                            <strong>${job.title}</strong>
                            <div class="text-muted"><span class="badge-tag badge-type">${job.type}</span></div>
                          </td>
                          <td><span class="badge-tag badge-mode">${job.workMode}</span></td>
                          <td class="text-emerald font-weight-bold">${job.stipendOrCtc}</td>
                          <td><strong>${job.minCgpa}</strong> CGPA</td>
                          <td>
                            <div class="skills-pill-row">
                              ${job.requiredSkills.slice(0, 3).map(s => `<span class="tech-tag">${s}</span>`).join('')}
                              ${job.requiredSkills.length > 3 ? `<span class="tech-tag">+${job.requiredSkills.length - 3}</span>` : ''}
                            </div>
                          </td>
                          <td>
                            <span class="applicant-count-pill"><i class="fas fa-user-friends"></i> ${appCount}</span>
                          </td>
                          <td>${Helpers.formatDate(job.deadline)}</td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              `}
            </div>
          </div>

          <!-- Section 2: Candidate Pipeline & ATS Screening -->
          <div class="section-card">
            <div class="section-card-header">
              <div>
                <h3 class="section-title"><i class="fas fa-user-check"></i> Candidate Applications & ATS Review</h3>
                <p class="section-sub">Review student profiles, automated skill-match scores, and advance candidates across rounds</p>
              </div>

              <!-- Filter by Opening -->
              <div class="recruiter-filter-control">
                <label>Filter Opening:</label>
                <select id="select-filter-job-applicants" class="form-control-select-sm">
                  <option value="all">All Postings (${allApplicants.length} Candidates)</option>
                  ${companyJobs.map(j => `
                    <option value="${j.id}" ${this.selectedJobFilter === j.id ? 'selected' : ''}>${j.title}</option>
                  `).join('')}
                </select>
              </div>
            </div>

            <!-- Candidates List -->
            <div id="candidates-pipeline-container" class="mt-3">
              <!-- Rendered below -->
            </div>

          </div>

        </div>

      </div>
    `;

    this.renderApplicantsList(container, allApplicants);
    this.attachEvents(container, currentCompany);
  },

  renderApplicantsList(container, allApplicants) {
    const listContainer = container.querySelector("#candidates-pipeline-container");
    if (!listContainer) return;

    let filtered = allApplicants;
    if (this.selectedJobFilter !== "all") {
      filtered = allApplicants.filter(a => a.jobId === this.selectedJobFilter);
    }

    if (filtered.length === 0) {
      listContainer.innerHTML = `
        <div class="empty-state-card">
          <i class="fas fa-users-slash empty-icon"></i>
          <h3>No candidates have applied yet</h3>
          <p>Applications submitted by students will appear here with automated skill-match scores.</p>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = `
      <div class="candidates-grid">
        ${filtered.map(cand => {
          const meta = Helpers.getStageMeta(cand.stage);
          const student = cand.student || {};
          const matchBadgeClass = Helpers.getMatchBadgeClass(cand.matchScore || 85);

          return `
            <div class="candidate-card" data-app-id="${cand.id}">
              <div class="candidate-header">
                <img src="${student.avatar}" alt="${student.name}" class="candidate-avatar" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(student.name || 'Candidate')}'" />
                <div class="candidate-info">
                  <h4 class="candidate-name">${student.name || 'Candidate'}</h4>
                  <div class="candidate-sub">
                    <span>${student.degree || 'B.Tech'} • CGPA: <strong>${student.cgpa || '8.5'}</strong></span>
                  </div>
                  <div class="candidate-applied-for">
                    <small>Applied for: <strong>${cand.roleTitle}</strong></small>
                  </div>
                </div>

                <div class="candidate-match-gauge ${matchBadgeClass}">
                  <span class="pct">${cand.matchScore || 85}%</span>
                  <span class="label">Skill Match</span>
                </div>
              </div>

              <!-- Matched / Missing Skills preview -->
              <div class="candidate-skills-strip mt-3">
                <div class="strip-header">
                  <span><i class="fas fa-check-circle text-emerald"></i> Matched (${cand.matchedSkills ? cand.matchedSkills.length : 3}):</span>
                </div>
                <div class="candidate-tags-row">
                  ${(cand.matchedSkills || []).slice(0, 4).map(s => `<span class="matched-skill-chip"><i class="fas fa-check"></i> ${s}</span>`).join('')}
                </div>
              </div>

              <!-- Cover note snippet -->
              ${cand.coverNote ? `
                <div class="candidate-note-snippet mt-2">
                  <i class="fas fa-quote-left text-muted"></i>
                  <span>${cand.coverNote}</span>
                </div>
              ` : ''}

              <!-- Status & Stage Actions -->
              <div class="candidate-footer mt-3">
                <div class="candidate-current-stage">
                  <span class="badge-stage ${meta.badgeClass}"><i class="${meta.icon}"></i> ${meta.label}</span>
                </div>

                <div class="candidate-actions-group">
                  <select class="stage-action-select form-control-select-xs" data-app-id="${cand.id}">
                    <option value="" disabled selected>Change Stage...</option>
                    <option value="shortlisted" ${cand.stage === 'shortlisted' ? 'disabled' : ''}>Shortlist for OA</option>
                    <option value="technical_interview" ${cand.stage === 'technical_interview' ? 'disabled' : ''}>Schedule Tech Round</option>
                    <option value="hr_round" ${cand.stage === 'hr_round' ? 'disabled' : ''}>Schedule HR Round</option>
                    <option value="offered" ${cand.stage === 'offered' ? 'disabled' : ''}>Release Offer Letter</option>
                    <option value="rejected" ${cand.stage === 'rejected' ? 'disabled' : ''}>Archive / Reject</option>
                  </select>
                </div>
              </div>

            </div>
          `;
        }).join('')}
      </div>
    `;

    // Attach stage change select listeners
    listContainer.querySelectorAll(".stage-action-select").forEach(select => {
      select.addEventListener("change", (e) => {
        const appId = select.getAttribute("data-app-id");
        const newStage = e.target.value;
        if (!newStage) return;

        window.AppState.updateApplicationStage(appId, newStage, `Updated by recruiter to ${Helpers.getStageMeta(newStage).label}`);
        Helpers.showToast("Candidate Stage Updated", `Candidate moved to ${Helpers.getStageMeta(newStage).label}`, "success");
        RecruiterComponent.render(container);
      });
    });
  },

  attachEvents(container, currentCompany) {
    // Switch Company Dropdown
    const compSelect = container.querySelector("#select-recruiter-company");
    if (compSelect) {
      compSelect.addEventListener("change", (e) => {
        window.AppState.switchCompany(e.target.value);
        RecruiterComponent.render(container);
        Helpers.showToast("Company Switched", `Viewing portal as ${window.AppState.getCurrentCompany().name}`, "info");
      });
    }

    // Filter by opening
    const jobFilter = container.querySelector("#select-filter-job-applicants");
    if (jobFilter) {
      jobFilter.addEventListener("change", (e) => {
        this.selectedJobFilter = e.target.value;
        const allApplicants = [];
        window.AppState.getJobsForCompany(currentCompany.id).forEach(job => {
          allApplicants.push(...window.AppState.getApplicantsForJob(job.id));
        });
        this.renderApplicantsList(container, allApplicants);
      });
    }

    // Open Post Job Modal
    const postBtns = [
      container.querySelector("#btn-open-post-job"),
      container.querySelector("#btn-quick-post-job"),
      container.querySelector("#btn-empty-post")
    ];

    postBtns.forEach(btn => {
      if (btn) {
        btn.addEventListener("click", () => {
          RecruiterComponent.showPostJobModal(currentCompany);
        });
      }
    });
  },

  showPostJobModal(company) {
    const modal = document.getElementById("modal-post-job");
    if (!modal) return;

    modal.querySelector("#post-company-badge").textContent = company.name;
    Helpers.openModal("modal-post-job");
  }
};

window.RecruiterComponent = RecruiterComponent;
