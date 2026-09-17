// profile.js: Student Profile, Skills Matrix, and Projects Showcase

const ProfileComponent = {
  render(container) {
    const student = window.AppState.getCurrentStudent();
    if (!student) return;

    // Categorize skills
    const categories = ["Languages", "Frameworks", "Databases", "DevOps & Cloud", "Core CS", "Tools", "Architecture"];
    const skillsByCategory = {};
    categories.forEach(cat => skillsByCategory[cat] = []);

    student.skills.forEach(skill => {
      const cat = skill.category || "Languages";
      if (!skillsByCategory[cat]) skillsByCategory[cat] = [];
      skillsByCategory[cat].push(skill);
    });

    // Compute profile completeness score
    let completeness = 0;
    if (student.name) completeness += 15;
    if (student.cgpa) completeness += 15;
    if (student.skills.length >= 6) completeness += 25;
    if (student.projects.length >= 2) completeness += 25;
    if (student.resume) completeness += 20;

    container.innerHTML = `
      <div class="profile-view-wrapper animate-fade-in">
        <!-- Top Profile Banner & Hero -->
        <div class="profile-hero-card">
          <div class="profile-hero-cover"></div>
          <div class="profile-hero-content">
            <div class="profile-avatar-container">
              <img src="${student.avatar}" alt="${student.name}" class="profile-avatar" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=4f46e5&color=fff&size=128'" />
              <span class="online-indicator" title="Active for Campus Placements"></span>
            </div>

            <div class="profile-hero-details">
              <div class="profile-title-row">
                <div>
                  <h1 class="profile-name">${student.name}</h1>
                  <p class="profile-headline">${student.headline}</p>
                </div>
                <div class="profile-actions-group">
                  <button class="btn btn-outline" id="btn-edit-profile">
                    <i class="fas fa-edit"></i> Edit Profile
                  </button>
                  <button class="btn btn-primary" id="btn-view-placement-resume">
                    <i class="fas fa-file-invoice"></i> View Placement Resume
                  </button>
                </div>
              </div>

              <div class="profile-meta-chips">
                <span class="meta-chip"><i class="fas fa-id-card"></i> USN: <strong>${student.usn}</strong></span>
                <span class="meta-chip"><i class="fas fa-university"></i> ${student.college}</span>
                <span class="meta-chip"><i class="fas fa-graduation-cap"></i> ${student.degree}</span>
                <span class="meta-chip highlight-cgpa"><i class="fas fa-chart-line"></i> CGPA: <strong>${student.cgpa} / 10</strong></span>
                <span class="meta-chip"><i class="fas fa-calendar-alt"></i> Batch ${student.batch}</span>
                <span class="meta-chip"><i class="fas fa-map-marker-alt"></i> ${student.location}</span>
              </div>

              <p class="profile-bio">${student.bio}</p>

              <!-- Social Links -->
              <div class="profile-links-row">
                ${student.links.github ? `<a href="${student.links.github}" target="_blank" class="social-link-btn" title="GitHub"><i class="fab fa-github"></i> GitHub</a>` : ''}
                ${student.links.linkedin ? `<a href="${student.links.linkedin}" target="_blank" class="social-link-btn" title="LinkedIn"><i class="fab fa-linkedin"></i> LinkedIn</a>` : ''}
                ${student.links.leetcode ? `<a href="${student.links.leetcode}" target="_blank" class="social-link-btn" title="LeetCode"><i class="fas fa-code"></i> LeetCode</a>` : ''}
                ${student.links.portfolio ? `<a href="${student.links.portfolio}" target="_blank" class="social-link-btn" title="Portfolio"><i class="fas fa-globe"></i> Portfolio</a>` : ''}
                <span class="contact-pill"><i class="fas fa-envelope"></i> ${student.email}</span>
                <span class="contact-pill"><i class="fas fa-phone"></i> ${student.phone}</span>
              </div>
            </div>
          </div>

          <!-- Profile Strength Bar -->
          <div class="profile-strength-bar">
            <div class="strength-label">
              <span><i class="fas fa-shield-alt"></i> Placement Readiness Score</span>
              <strong>${completeness}% Ready</strong>
            </div>
            <div class="progress-track">
              <div class="progress-fill ${completeness >= 90 ? 'progress-success' : 'progress-warning'}" style="width: ${completeness}%;"></div>
            </div>
          </div>
        </div>

        <!-- Two Column Layout: Skills & Projects -->
        <div class="profile-body-grid">
          
          <!-- Left Column: Skills Matrix -->
          <div class="profile-column">
            <div class="section-header-card">
              <div class="header-left">
                <div class="section-icon-badge"><i class="fas fa-bolt"></i></div>
                <div>
                  <h2 class="section-heading">Verified Skills Matrix</h2>
                  <p class="section-subheading">${student.skills.length} skills tracked across technical categories</p>
                </div>
              </div>
              <button class="btn btn-sm btn-outline-primary" id="btn-open-add-skill">
                <i class="fas fa-plus"></i> Add Skill
              </button>
            </div>

            <!-- Skills Container -->
            <div class="skills-card">
              ${categories.map(cat => {
                const skills = skillsByCategory[cat];
                if (!skills || skills.length === 0) return '';
                return `
                  <div class="skill-category-group">
                    <h3 class="skill-category-title">${cat}</h3>
                    <div class="skills-tag-cloud">
                      ${skills.map(s => `
                        <div class="skill-badge-pill skill-level-${s.level.toLowerCase()}">
                          <span class="skill-name">${s.name}</span>
                          <span class="skill-level-tag">${s.level}</span>
                          <button class="skill-remove-btn" data-skill="${s.name}" title="Remove ${s.name}">
                            <i class="fas fa-times"></i>
                          </button>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                `;
              }).join('')}

              <div class="skills-legend">
                <span class="legend-item"><span class="dot dot-expert"></span> Expert</span>
                <span class="legend-item"><span class="dot dot-advanced"></span> Advanced</span>
                <span class="legend-item"><span class="dot dot-intermediate"></span> Intermediate</span>
                <span class="legend-item"><span class="dot dot-beginner"></span> Beginner</span>
              </div>
            </div>

            <!-- Experience / Internships Timeline -->
            <div class="section-header-card mt-6">
              <div class="header-left">
                <div class="section-icon-badge"><i class="fas fa-briefcase"></i></div>
                <div>
                  <h2 class="section-heading">Internships & Leadership</h2>
                  <p class="section-subheading">Past industry experience & college roles</p>
                </div>
              </div>
            </div>

            <div class="experience-timeline-card">
              ${student.experience && student.experience.length > 0 ? student.experience.map(exp => `
                <div class="timeline-item">
                  <div class="timeline-dot"></div>
                  <div class="timeline-content">
                    <div class="timeline-title-row">
                      <h4 class="timeline-role">${exp.role}</h4>
                      <span class="timeline-period">${exp.period}</span>
                    </div>
                    <div class="timeline-company"><i class="fas fa-building"></i> ${exp.company} • ${exp.location}</div>
                    <p class="timeline-desc">${exp.description}</p>
                  </div>
                </div>
              `).join('') : '<p class="empty-text">No experience logged yet.</p>'}
            </div>
          </div>

          <!-- Right Column: Projects Showcase -->
          <div class="profile-column">
            <div class="section-header-card">
              <div class="header-left">
                <div class="section-icon-badge"><i class="fas fa-laptop-code"></i></div>
                <div>
                  <h2 class="section-heading">Featured Projects Showcase</h2>
                  <p class="section-subheading">Production applications, repos & system demos</p>
                </div>
              </div>
              <button class="btn btn-sm btn-primary" id="btn-open-add-project">
                <i class="fas fa-plus"></i> Add Project
              </button>
            </div>

            <!-- Projects Grid -->
            <div class="projects-list">
              ${student.projects && student.projects.length > 0 ? student.projects.map(project => `
                <div class="project-card ${project.featured ? 'project-featured' : ''}">
                  <div class="project-header">
                    <div class="project-title-area">
                      ${project.featured ? '<span class="badge-featured"><i class="fas fa-star"></i> Featured</span>' : ''}
                      <h3 class="project-title">${project.title}</h3>
                      <span class="project-date">${project.date}</span>
                    </div>
                    <div class="project-actions">
                      <button class="btn-icon-danger btn-delete-project" data-id="${project.id}" title="Delete Project">
                        <i class="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </div>

                  <p class="project-description">${project.description}</p>

                  <!-- Highlights / Impact metrics -->
                  ${project.highlights && project.highlights.length > 0 ? `
                    <div class="project-highlights">
                      <ul>
                        ${project.highlights.map(h => `<li><i class="fas fa-check-circle"></i> <span>${h}</span></li>`).join('')}
                      </ul>
                    </div>
                  ` : ''}

                  <!-- Tech Stack Tags -->
                  <div class="project-tech-tags">
                    ${project.tags.map(t => `<span class="tech-tag">${t}</span>`).join('')}
                  </div>

                  <!-- Links Footer -->
                  <div class="project-footer">
                    <div class="project-links">
                      ${project.githubUrl ? `
                        <a href="${project.githubUrl}" target="_blank" class="btn btn-xs btn-outline">
                          <i class="fab fa-github"></i> Source Code
                        </a>
                      ` : ''}
                      ${project.liveUrl ? `
                        <a href="${project.liveUrl}" target="_blank" class="btn btn-xs btn-primary">
                          <i class="fas fa-external-link-alt"></i> Live Demo
                        </a>
                      ` : ''}
                    </div>
                  </div>
                </div>
              `).join('') : `
                <div class="empty-state-card">
                  <i class="fas fa-folder-open empty-icon"></i>
                  <h3>No projects added yet</h3>
                  <p>Adding showcase projects increases placement interview shortlisting rates by 3x.</p>
                  <button class="btn btn-primary mt-3" id="btn-empty-add-proj">Add Your First Project</button>
                </div>
              `}
            </div>
          </div>

        </div>
      </div>
    `;

    this.attachEvents(container, student);
  },

  attachEvents(container, student) {
    // Delete skill buttons
    container.querySelectorAll(".skill-remove-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const skillName = btn.getAttribute("data-skill");
        if (confirm(`Remove "${skillName}" from your profile?`)) {
          window.AppState.removeSkill(skillName);
          Helpers.showToast("Skill Removed", `"${skillName}" removed from your profile.`, "info");
        }
      });
    });

    // Delete project buttons
    container.querySelectorAll(".btn-delete-project").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const projId = btn.getAttribute("data-id");
        if (confirm("Are you sure you want to delete this project?")) {
          window.AppState.deleteProject(projId);
          Helpers.showToast("Project Deleted", "Project was removed successfully.", "info");
        }
      });
    });

    // Open Add Skill Modal
    const addSkillBtn = container.querySelector("#btn-open-add-skill");
    if (addSkillBtn) {
      addSkillBtn.addEventListener("click", () => {
        Helpers.openModal("modal-add-skill");
      });
    }

    // Open Add Project Modal
    const addProjBtn = container.querySelector("#btn-open-add-project");
    if (addProjBtn) {
      addProjBtn.addEventListener("click", () => {
        Helpers.openModal("modal-add-project");
      });
    }
    const emptyAddProjBtn = container.querySelector("#btn-empty-add-proj");
    if (emptyAddProjBtn) {
      emptyAddProjBtn.addEventListener("click", () => {
        Helpers.openModal("modal-add-project");
      });
    }

    // Open Edit Profile Modal
    const editProfBtn = container.querySelector("#btn-edit-profile");
    if (editProfBtn) {
      editProfBtn.addEventListener("click", () => {
        this.populateEditProfileModal(student);
        Helpers.openModal("modal-edit-profile");
      });
    }

    // View Placement Resume button
    const viewResumeBtn = container.querySelector("#btn-view-placement-resume");
    if (viewResumeBtn) {
      viewResumeBtn.addEventListener("click", () => {
        // Switch view to resume tab
        window.App.switchView("resume");
      });
    }
  },

  populateEditProfileModal(student) {
    document.getElementById("edit-name").value = student.name || "";
    document.getElementById("edit-headline").value = student.headline || "";
    document.getElementById("edit-college").value = student.college || "";
    document.getElementById("edit-degree").value = student.degree || "";
    document.getElementById("edit-cgpa").value = student.cgpa || "";
    document.getElementById("edit-batch").value = student.batch || "";
    document.getElementById("edit-location").value = student.location || "";
    document.getElementById("edit-bio").value = student.bio || "";
    document.getElementById("edit-github").value = student.links.github || "";
    document.getElementById("edit-linkedin").value = student.links.linkedin || "";
    document.getElementById("edit-leetcode").value = student.links.leetcode || "";
    document.getElementById("edit-portfolio").value = student.links.portfolio || "";
  }
};

window.ProfileComponent = ProfileComponent;
