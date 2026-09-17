// applications.js: Interactive Application Pipeline Kanban & Status Tracker

const ApplicationsComponent = {
  viewMode: "kanban", // "kanban" | "table"

  render(container) {
    const student = window.AppState.getCurrentStudent();
    const applications = window.AppState.getApplicationsForCurrentStudent();

    // Stage counts
    const counts = {
      applied: 0,
      shortlisted: 0,
      technical_interview: 0,
      hr_round: 0,
      offered: 0,
      rejected: 0
    };

    applications.forEach(app => {
      if (counts[app.stage] !== undefined) {
        counts[app.stage]++;
      }
    });

    const activeCount = applications.filter(a => a.stage !== "rejected").length;
    const offersCount = counts.offered;

    container.innerHTML = `
      <div class="applications-view-wrapper animate-fade-in">
        
        <!-- Header Banner -->
        <div class="page-title-banner">
          <div>
            <h1 class="page-title"><i class="fas fa-stream text-indigo"></i> Placement Application Pipeline</h1>
            <p class="page-subtitle">Track your recruitment stages in real time: from campus submission to interview rounds and final offers.</p>
          </div>

          <div class="banner-controls">
            <!-- View Mode Switcher -->
            <div class="view-mode-toggle">
              <button class="mode-btn ${this.viewMode === 'kanban' ? 'active' : ''}" id="btn-view-kanban">
                <i class="fas fa-columns"></i> Kanban Board
              </button>
              <button class="mode-btn ${this.viewMode === 'table' ? 'active' : ''}" id="btn-view-table">
                <i class="fas fa-list-ul"></i> Table View
              </button>
            </div>

            <button class="btn btn-primary" id="btn-explore-more-jobs">
              <i class="fas fa-plus"></i> Explore More Drives
            </button>
          </div>
        </div>

        <!-- Metric Summary Chips -->
        <div class="pipeline-summary-bar">
          <div class="summary-chip">
            <span class="chip-label">Total Submissions</span>
            <strong class="chip-value">${applications.length}</strong>
          </div>
          <div class="summary-chip">
            <span class="chip-label">Active In-Pipeline</span>
            <strong class="chip-value text-indigo">${activeCount}</strong>
          </div>
          <div class="summary-chip highlight-chip">
            <span class="chip-label">Placement Offers</span>
            <strong class="chip-value text-emerald"><i class="fas fa-trophy"></i> ${offersCount}</strong>
          </div>
          <div class="summary-chip">
            <span class="chip-label">Interview Rounds Scheduled</span>
            <strong class="chip-value text-amber">${counts.technical_interview + counts.hr_round}</strong>
          </div>
        </div>

        <!-- Main Pipeline Content -->
        <div id="pipeline-content-area" class="mt-4">
          <!-- Rendered dynamically as Kanban or Table -->
        </div>

      </div>
    `;

    const contentArea = container.querySelector("#pipeline-content-area");
    if (this.viewMode === "kanban") {
      this.renderKanban(contentArea, applications);
    } else {
      this.renderTable(contentArea, applications);
    }

    this.attachEvents(container);
  },

  renderKanban(contentArea, applications) {
    const stages = [
      { id: "applied", label: "Applied", icon: "fa-paper-plane", class: "col-applied" },
      { id: "shortlisted", label: "Shortlisted / OA", icon: "fa-clipboard-check", class: "col-shortlisted" },
      { id: "technical_interview", label: "Technical Round", icon: "fa-code", class: "col-tech" },
      { id: "hr_round", label: "HR / Fit Round", icon: "fa-user-tie", class: "col-hr" },
      { id: "offered", label: "Offered 🎉", icon: "fa-trophy", class: "col-offered" },
      { id: "rejected", label: "Archived", icon: "fa-archive", class: "col-rejected" }
    ];

    contentArea.innerHTML = `
      <div class="kanban-board-container">
        ${stages.map(col => {
          const appsInStage = applications.filter(a => a.stage === col.id);
          return `
            <div class="kanban-column ${col.class}" data-stage="${col.id}">
              
              <!-- Column Header -->
              <div class="kanban-column-header">
                <div class="column-title-box">
                  <i class="fas ${col.icon}"></i>
                  <span class="column-title">${col.label}</span>
                </div>
                <span class="column-count-badge">${appsInStage.length}</span>
              </div>

              <!-- Column Cards Container -->
              <div class="kanban-cards-wrapper" id="kanban-col-${col.id}">
                ${appsInStage.length === 0 ? `
                  <div class="kanban-empty-slot">
                    <span>No applications in this stage</span>
                  </div>
                ` : appsInStage.map(app => `
                  <div class="kanban-card ${app.stage === 'offered' ? 'card-offered-glow' : ''}" data-id="${app.id}">
                    
                    <div class="kcard-header">
                      <img src="${app.companyLogo}" alt="${app.companyName}" class="kcard-logo" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(app.companyName)}'" />
                      <div class="kcard-title-group">
                        <h4 class="kcard-role" title="${app.roleTitle}">${app.roleTitle}</h4>
                        <span class="kcard-company">${app.companyName}</span>
                      </div>
                    </div>

                    <!-- Next Action Notice -->
                    <div class="kcard-next-action">
                      <i class="fas fa-info-circle"></i>
                      <span>${app.nextAction}</span>
                    </div>

                    <!-- Date & Badge -->
                    <div class="kcard-footer">
                      <span class="kcard-date"><i class="far fa-calendar-alt"></i> ${Helpers.formatDate(app.appliedDate)}</span>
                      
                      <div class="kcard-action-btns">
                        ${app.stage === "offered" ? `
                          <button class="btn btn-xs btn-success btn-view-offer" data-id="${app.id}" title="View Offer Letter">
                            <i class="fas fa-envelope-open-text"></i> Offer
                          </button>
                        ` : ''}
                        <button class="btn btn-xs btn-outline btn-app-details" data-id="${app.id}">
                          Timeline
                        </button>
                      </div>
                    </div>

                  </div>
                `).join('')}
              </div>

            </div>
          `;
        }).join('')}
      </div>
    `;

    this.attachCardEvents(contentArea, applications);
  },

  renderTable(contentArea, applications) {
    if (applications.length === 0) {
      contentArea.innerHTML = `
        <div class="empty-state-card">
          <i class="fas fa-folder-open empty-icon"></i>
          <h3>No applications yet</h3>
          <p>You haven't submitted any job or internship applications yet.</p>
        </div>
      `;
      return;
    }

    contentArea.innerHTML = `
      <div class="table-responsive-card">
        <table class="pipeline-table">
          <thead>
            <tr>
              <th>Company & Role</th>
              <th>Applied Date</th>
              <th>Current Stage</th>
              <th>Next Action / Schedule</th>
              <th>Resume Attached</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${applications.map(app => {
              const meta = Helpers.getStageMeta(app.stage);
              return `
                <tr>
                  <td>
                    <div class="table-company-cell">
                      <img src="${app.companyLogo}" alt="${app.companyName}" class="table-logo" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(app.companyName)}'" />
                      <div>
                        <strong>${app.roleTitle}</strong>
                        <div class="text-muted">${app.companyName}</div>
                      </div>
                    </div>
                  </td>
                  <td>${Helpers.formatDate(app.appliedDate)}</td>
                  <td>
                    <span class="badge-stage ${meta.badgeClass}">
                      <i class="${meta.icon}"></i> ${meta.label}
                    </span>
                  </td>
                  <td class="next-action-cell">${app.nextAction}</td>
                  <td><span class="resume-pill"><i class="fas fa-file-pdf text-danger"></i> ${app.resumeAttached || 'Resume.pdf'}</span></td>
                  <td>
                    <div class="action-buttons-cell">
                      ${app.stage === "offered" ? `
                        <button class="btn btn-xs btn-success btn-view-offer" data-id="${app.id}">
                          <i class="fas fa-trophy"></i> Offer
                        </button>
                      ` : ''}
                      <button class="btn btn-xs btn-outline btn-app-details" data-id="${app.id}">
                        Timeline
                      </button>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;

    this.attachCardEvents(contentArea, applications);
  },

  attachEvents(container) {
    const kanbanBtn = container.querySelector("#btn-view-kanban");
    const tableBtn = container.querySelector("#btn-view-table");
    const exploreBtn = container.querySelector("#btn-explore-more-jobs");

    if (kanbanBtn) {
      kanbanBtn.addEventListener("click", () => {
        this.viewMode = "kanban";
        this.render(container);
      });
    }

    if (tableBtn) {
      tableBtn.addEventListener("click", () => {
        this.viewMode = "table";
        this.render(container);
      });
    }

    if (exploreBtn) {
      exploreBtn.addEventListener("click", () => {
        window.App.switchView("jobs");
      });
    }
  },

  attachCardEvents(contentArea, applications) {
    // Open Details Timeline modal
    contentArea.querySelectorAll(".btn-app-details").forEach(btn => {
      btn.addEventListener("click", () => {
        const appId = btn.getAttribute("data-id");
        const app = applications.find(a => a.id === appId);
        if (app) {
          ApplicationsComponent.showTimelineModal(app);
        }
      });
    });

    // View Offer modal
    contentArea.querySelectorAll(".btn-view-offer").forEach(btn => {
      btn.addEventListener("click", () => {
        const appId = btn.getAttribute("data-id");
        const app = applications.find(a => a.id === appId);
        if (app) {
          ApplicationsComponent.showOfferModal(app);
        }
      });
    });
  },

  showTimelineModal(app) {
    const modal = document.getElementById("modal-application-timeline");
    if (!modal) return;

    const meta = Helpers.getStageMeta(app.stage);
    const content = modal.querySelector(".modal-body-content");

    content.innerHTML = `
      <div class="application-timeline-view">
        <div class="app-modal-header">
          <img src="${app.companyLogo}" alt="${app.companyName}" class="app-modal-logo" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(app.companyName)}'" />
          <div>
            <h2 class="app-modal-title">${app.roleTitle}</h2>
            <div class="app-modal-company">${app.companyName} • Applied on ${Helpers.formatDate(app.appliedDate)}</div>
          </div>
          <div class="app-modal-status">
            <span class="badge-stage ${meta.badgeClass}"><i class="${meta.icon}"></i> ${meta.label}</span>
          </div>
        </div>

        <!-- Stage Progression Stepper History -->
        <div class="modal-section mt-4">
          <h4 class="modal-section-title"><i class="fas fa-history"></i> Recruitment Progress Timeline</h4>
          <div class="app-history-timeline">
            ${(app.stageHistory || [
              { stage: app.stage, date: app.appliedDate, note: "Application registered." }
            ]).map((hist, idx) => {
              const hMeta = Helpers.getStageMeta(hist.stage);
              return `
                <div class="timeline-step-item">
                  <div class="step-bullet ${hMeta.badgeClass}"><i class="${hMeta.icon}"></i></div>
                  <div class="step-card">
                    <div class="step-header">
                      <strong class="step-title">${hMeta.label}</strong>
                      <span class="step-timestamp">${Helpers.formatDate(hist.date)}</span>
                    </div>
                    <p class="step-note">${hist.note || 'Candidate advanced through this evaluation step.'}</p>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Notes & Feedback -->
        <div class="modal-section mt-4">
          <h4 class="modal-section-title"><i class="fas fa-clipboard-list"></i> Recruitment Details</h4>
          <div class="app-notes-grid">
            <div class="note-box">
              <span class="note-box-title">Next Scheduled Action</span>
              <p>${app.nextAction || 'Under active review.'}</p>
            </div>
            <div class="note-box">
              <span class="note-box-title">Evaluator Feedback</span>
              <p>${app.feedback || 'Evaluator comments pending.'}</p>
            </div>
          </div>
        </div>

        <!-- Advance Stage Control (Interactive Demo Tool) -->
        <div class="modal-section mt-4 test-advance-box">
          <h4 class="modal-section-title"><i class="fas fa-tools"></i> Update Recruitment Stage</h4>
          <div class="stage-advance-row">
            <select id="select-update-stage" class="form-control-select">
              <option value="applied" ${app.stage === 'applied' ? 'selected' : ''}>1. Applied</option>
              <option value="shortlisted" ${app.stage === 'shortlisted' ? 'selected' : ''}>2. Shortlisted / Assessment</option>
              <option value="technical_interview" ${app.stage === 'technical_interview' ? 'selected' : ''}>3. Technical Interview</option>
              <option value="hr_round" ${app.stage === 'hr_round' ? 'selected' : ''}>4. HR Interview</option>
              <option value="offered" ${app.stage === 'offered' ? 'selected' : ''}>5. Campus Placement Offer</option>
              <option value="rejected" ${app.stage === 'rejected' ? 'selected' : ''}>6. Archived / Not Selected</option>
            </select>
            <button class="btn btn-primary" id="btn-save-stage-change">
              Update Stage
            </button>
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-actions-footer mt-4">
          <button class="btn btn-outline" onclick="Helpers.closeModal('modal-application-timeline')">Close</button>
          ${app.stage === "offered" ? `
            <button class="btn btn-success" id="btn-open-offer-from-timeline">
              <i class="fas fa-file-signature"></i> View Official Offer Letter
            </button>
          ` : ''}
        </div>

      </div>
    `;

    Helpers.openModal("modal-application-timeline");

    const saveStageBtn = content.querySelector("#btn-save-stage-change");
    const stageSelect = content.querySelector("#select-update-stage");
    if (saveStageBtn && stageSelect) {
      saveStageBtn.addEventListener("click", () => {
        const newStage = stageSelect.value;
        window.AppState.updateApplicationStage(app.id, newStage, `Status manually updated to ${Helpers.getStageMeta(newStage).label}`);
        Helpers.showToast("Stage Updated", `Application moved to "${Helpers.getStageMeta(newStage).label}"`, "success");
        Helpers.closeModal("modal-application-timeline");
        
        // Re-render
        const container = document.getElementById("view-applications");
        if (container) ApplicationsComponent.render(container);
      });
    }

    const offerBtn = content.querySelector("#btn-open-offer-from-timeline");
    if (offerBtn) {
      offerBtn.addEventListener("click", () => {
        Helpers.closeModal("modal-application-timeline");
        ApplicationsComponent.showOfferModal(app);
      });
    }
  },

  showOfferModal(app) {
    const modal = document.getElementById("modal-offer-letter");
    if (!modal) return;

    const offer = app.offerDetails || {
      ctc: "₹24,500,000 / annum (₹24.5 LPA)",
      baseSalary: "₹18,000,000 / annum",
      joiningBonus: "₹2,500,000",
      joiningDate: "July 7, 2025",
      location: "Bangalore, India"
    };

    const content = modal.querySelector(".modal-body-content");
    content.innerHTML = `
      <div class="offer-letter-view">
        <div class="offer-congrats-banner">
          <div class="congrats-icon"><i class="fas fa-award"></i></div>
          <h2>Official Campus Placement Offer Letter</h2>
          <p>Congratulations! ${app.companyName} has issued your employment offer for the <strong>${app.roleTitle}</strong> role.</p>
        </div>

        <div class="offer-paper-card">
          <div class="offer-paper-header">
            <img src="${app.companyLogo}" alt="${app.companyName}" class="offer-corp-logo" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(app.companyName)}'" />
            <div class="offer-corp-info">
              <h3>${app.companyName} Campus Recruitment</h3>
              <p>Ref: OFF-CAMPUS-${Math.floor(100000 + Math.random() * 900000)}</p>
            </div>
          </div>

          <div class="offer-compensation-grid mt-4">
            <div class="offer-stat-box">
              <span class="label">Total Annual Package (CTC)</span>
              <strong class="value text-emerald">${offer.ctc}</strong>
            </div>
            <div class="offer-stat-box">
              <span class="label">Annual Base Salary</span>
              <strong class="value">${offer.baseSalary}</strong>
            </div>
            <div class="offer-stat-box">
              <span class="label">One-Time Joining Bonus</span>
              <strong class="value">${offer.joiningBonus}</strong>
            </div>
            <div class="offer-stat-box">
              <span class="label">Tentative Joining Date</span>
              <strong class="value text-indigo">${offer.joiningDate}</strong>
            </div>
          </div>

          <div class="offer-terms mt-4">
            <h4>Terms & Acceptance:</h4>
            <p>This offer is contingent upon successful graduation with your degree and fulfilling the minimum GPA academic threshold. Acceptance must be confirmed through the college placement cell within 14 calendar days.</p>
          </div>

          <div class="offer-signature-row mt-4">
            <div>
              <div class="sig-line"><em>Authorized Placement Cell Signatory</em></div>
              <small>Dean of Corporate Relations & Placements</small>
            </div>
            <div>
              <div class="sig-line"><em>Talent Acquisition Lead</em></div>
              <small>${app.companyName} University Programs</small>
            </div>
          </div>
        </div>

        <div class="modal-actions-footer mt-4">
          <button class="btn btn-outline" onclick="Helpers.closeModal('modal-offer-letter')">Close</button>
          <button class="btn btn-success" id="btn-accept-campus-offer">
            <i class="fas fa-check-circle"></i> Accept & Sign Placement Offer
          </button>
        </div>
      </div>
    `;

    Helpers.openModal("modal-offer-letter");

    const acceptBtn = content.querySelector("#btn-accept-campus-offer");
    if (acceptBtn) {
      acceptBtn.addEventListener("click", () => {
        acceptBtn.disabled = true;
        acceptBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Processing Acceptance...`;
        setTimeout(() => {
          Helpers.closeModal("modal-offer-letter");
          Helpers.showToast("Offer Accepted! 🎓🎉", `Congratulations on accepting your placement offer with ${app.companyName}!`, "success");
        }, 800);
      });
    }
  }
};

window.ApplicationsComponent = ApplicationsComponent;
