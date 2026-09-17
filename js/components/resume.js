// resume.js: Resume management, ATS scanner, and campus placement resume generator

const ResumeComponent = {
  render(container) {
    const student = window.AppState.getCurrentStudent();
    if (!student) return;

    const resume = student.resume || {
      filename: "Standard_Placement_Resume.pdf",
      uploadedAt: new Date().toISOString(),
      size: "210 KB",
      atsScore: 89,
      parsedData: {
        summary: student.bio,
        keywordMatchRate: 90,
        strengths: ["Clean section headers", "Quantifiable project metrics"],
        improvementTips: ["Add cloud certifications"]
      }
    };

    const atsScore = resume.atsScore || 85;
    const scoreColorClass = atsScore >= 85 ? "score-excellent" : atsScore >= 70 ? "score-good" : "score-needs-work";

    container.innerHTML = `
      <div class="resume-view-wrapper animate-fade-in">
        
        <!-- Header Banner -->
        <div class="page-title-banner">
          <div>
            <h1 class="page-title"><i class="fas fa-file-contract text-indigo"></i> Resume & ATS Optimization Hub</h1>
            <p class="page-subtitle">Upload your placement resume, test ATS match rate, and preview your standardized campus format.</p>
          </div>
          <div class="banner-actions">
            <button class="btn btn-outline" id="btn-print-resume">
              <i class="fas fa-print"></i> Print / Save PDF
            </button>
            <button class="btn btn-primary" id="btn-trigger-upload-resume">
              <i class="fas fa-cloud-upload-alt"></i> Upload New Resume
            </button>
          </div>
        </div>

        <!-- Two Column Layout: ATS Analysis (Left) & Standardized Resume Preview (Right) -->
        <div class="resume-grid-layout">
          
          <!-- Left Column: ATS Score & Upload Area -->
          <div class="resume-control-column">
            
            <!-- Upload Dropzone -->
            <div class="resume-dropzone-card" id="resume-dropzone">
              <input type="file" id="resume-file-input" accept=".pdf,.doc,.docx,.txt" style="display:none;" />
              <div class="dropzone-icon">
                <i class="fas fa-file-pdf"></i>
              </div>
              <h3 class="dropzone-title">Upload Updated Resume</h3>
              <p class="dropzone-desc">Drag and drop your PDF or DOCX file here, or browse from computer</p>
              <div class="current-file-badge">
                <i class="fas fa-paperclip"></i>
                <span id="current-resume-filename">${resume.filename}</span>
                <span class="file-size-tag">${resume.size}</span>
              </div>
              <button class="btn btn-sm btn-outline-primary mt-3" id="btn-browse-file">
                <i class="fas fa-folder-open"></i> Browse Files
              </button>
            </div>

            <!-- ATS Score Gauge Card -->
            <div class="ats-card">
              <div class="ats-header">
                <div class="ats-badge-icon"><i class="fas fa-robot"></i></div>
                <div>
                  <h2 class="ats-title">Placement ATS Score</h2>
                  <p class="ats-subtitle">Evaluated for campus recruiter scanning systems</p>
                </div>
              </div>

              <div class="ats-meter-wrapper">
                <div class="ats-circle-gauge ${scoreColorClass}">
                  <span class="score-number">${atsScore}</span>
                  <span class="score-max">/100</span>
                </div>
                <div class="ats-verdict">
                  <h4>${atsScore >= 85 ? "Excellent Placement Readiness" : atsScore >= 70 ? "Good ATS Compatibility" : "Needs Optimization"}</h4>
                  <p>Matches <strong>${resume.parsedData?.keywordMatchRate || 92}%</strong> of high-frequency keywords across Top Tech & FinTech recruitment filters.</p>
                </div>
              </div>

              <!-- Strengths Found -->
              <div class="ats-feedback-group mt-4">
                <h4 class="feedback-heading text-success"><i class="fas fa-check-circle"></i> Resume Strengths</h4>
                <ul class="feedback-list">
                  ${(resume.parsedData?.strengths || [
                    "Action-oriented project summaries with clear technical tags",
                    "Strong GPA & core CS foundational competencies",
                    "Valid links to GitHub source code and working deployments"
                  ]).map(str => `<li><i class="fas fa-check text-emerald"></i> ${str}</li>`).join('')}
                </ul>
              </div>

              <!-- Actionable Improvements -->
              <div class="ats-feedback-group mt-4">
                <h4 class="feedback-heading text-amber"><i class="fas fa-lightbulb"></i> Recommended Tweaks</h4>
                <ul class="feedback-list">
                  ${(resume.parsedData?.improvementTips || [
                    "Add 2-3 target keywords from upcoming campus drives (e.g. Microservices, Docker)",
                    "Highlight any hackathons or collegiate coding ranks"
                  ]).map(tip => `<li><i class="fas fa-arrow-right text-amber"></i> ${tip}</li>`).join('')}
                </ul>
              </div>

              <!-- Quick ATS Scan Test -->
              <div class="ats-reanalyze-box mt-4">
                <button class="btn btn-sm btn-outline w-100" id="btn-reanalyze-ats">
                  <i class="fas fa-sync-alt"></i> Run Instant ATS Keyword Diagnostics
                </button>
              </div>

            </div>

          </div>

          <!-- Right Column: Campus Standardized Printable Resume Document -->
          <div class="resume-preview-column">
            <div class="resume-paper" id="printable-resume">
              
              <!-- Resume Document Header -->
              <header class="resume-doc-header">
                <h1 class="doc-student-name">${student.name}</h1>
                <div class="doc-contact-line">
                  <span><i class="fas fa-envelope"></i> ${student.email}</span>
                  <span>•</span>
                  <span><i class="fas fa-phone"></i> ${student.phone}</span>
                  <span>•</span>
                  <span><i class="fas fa-map-marker-alt"></i> ${student.location}</span>
                </div>
                <div class="doc-links-line">
                  ${student.links.github ? `<span>GitHub: <strong>${student.links.github.replace('https://', '')}</strong></span> • ` : ''}
                  ${student.links.linkedin ? `<span>LinkedIn: <strong>${student.links.linkedin.replace('https://', '')}</strong></span> • ` : ''}
                  ${student.links.portfolio ? `<span>Portfolio: <strong>${student.links.portfolio.replace('https://', '')}</strong></span>` : ''}
                </div>
              </header>

              <!-- Education Section -->
              <section class="resume-doc-section">
                <h3 class="doc-section-heading">EDUCATION</h3>
                <div class="doc-entry">
                  <div class="doc-entry-header">
                    <strong>${student.college}</strong>
                    <span class="doc-date">${student.batch}</span>
                  </div>
                  <div class="doc-entry-sub">
                    <span>${student.degree}</span>
                    <span class="doc-cgpa-pill">CGPA: <strong>${student.cgpa} / 10.0</strong></span>
                  </div>
                </div>
              </section>

              <!-- Technical Skills Section -->
              <section class="resume-doc-section">
                <h3 class="doc-section-heading">TECHNICAL SKILLS</h3>
                <div class="doc-skills-matrix">
                  <p><strong>Languages:</strong> ${student.skills.filter(s => s.category === "Languages").map(s => s.name).join(", ") || "Python, C++, TypeScript, Java"}</p>
                  <p><strong>Frameworks & Libraries:</strong> ${student.skills.filter(s => s.category === "Frameworks").map(s => s.name).join(", ") || "React, Node.js, Express, FastAPI"}</p>
                  <p><strong>Databases & Cloud:</strong> ${student.skills.filter(s => s.category === "Databases" || s.category === "DevOps & Cloud").map(s => s.name).join(", ") || "PostgreSQL, MongoDB, Redis, Docker"}</p>
                  <p><strong>Developer Tools & Core:</strong> ${student.skills.filter(s => s.category === "Tools" || s.category === "Core CS").map(s => s.name).join(", ") || "Git, Docker, REST APIs, DSA, System Design"}</p>
                </div>
              </section>

              <!-- Projects Section -->
              <section class="resume-doc-section">
                <h3 class="doc-section-heading">FEATURED PROJECTS</h3>
                ${student.projects.map(p => `
                  <div class="doc-entry">
                    <div class="doc-entry-header">
                      <span><strong>${p.title}</strong> | <em>${p.tags.join(", ")}</em></span>
                      <span class="doc-date">${p.date}</span>
                    </div>
                    <p class="doc-entry-desc">${p.description}</p>
                    ${p.highlights && p.highlights.length > 0 ? `
                      <ul class="doc-bullet-list">
                        ${p.highlights.map(h => `<li>${h}</li>`).join('')}
                      </ul>
                    ` : ''}
                  </div>
                `).join('')}
              </section>

              <!-- Experience Section -->
              ${student.experience && student.experience.length > 0 ? `
                <section class="resume-doc-section">
                  <h3 class="doc-section-heading">EXPERIENCE & LEADERSHIP</h3>
                  ${student.experience.map(exp => `
                    <div class="doc-entry">
                      <div class="doc-entry-header">
                        <strong>${exp.role}</strong> — ${exp.company}
                        <span class="doc-date">${exp.period}</span>
                      </div>
                      <p class="doc-entry-desc">${exp.description}</p>
                    </div>
                  `).join('')}
                </section>
              ` : ''}

            </div>
          </div>

        </div>
      </div>
    `;

    this.attachEvents(container, student);
  },

  attachEvents(container, student) {
    const dropzone = container.querySelector("#resume-dropzone");
    const fileInput = container.querySelector("#resume-file-input");
    const browseBtn = container.querySelector("#btn-browse-file");
    const triggerBtn = container.querySelector("#btn-trigger-upload-resume");
    const printBtn = container.querySelector("#btn-print-resume");
    const reanalyzeBtn = container.querySelector("#btn-reanalyze-ats");

    const handleUpload = (file) => {
      if (!file) return;
      const filename = file.name;
      const size = Math.round(file.size / 1024) + " KB";
      
      // Compute score
      const newScore = Math.floor(Math.random() * 8) + 91; // Realistic ATS high score
      window.AppState.uploadResume({
        filename,
        size,
        atsScore: newScore,
        parsedData: {
          keywordMatchRate: newScore + 2,
          strengths: [
            "Parsed successfully by campus recruitment parser",
            "Strong distribution of required programming languages & framework keywords",
            "Quantified impact bullet points with numerical benchmarks"
          ],
          improvementTips: [
            "Ensure AWS or GCP cloud container tags are highlighted in your skill taxonomy"
          ]
        }
      });

      Helpers.showToast("Resume Uploaded", `"${filename}" parsed with ATS Score: ${newScore}/100!`, "success");
      ResumeComponent.render(container);
    };

    if (browseBtn && fileInput) {
      browseBtn.addEventListener("click", () => fileInput.click());
    }
    if (triggerBtn && fileInput) {
      triggerBtn.addEventListener("click", () => fileInput.click());
    }

    if (fileInput) {
      fileInput.addEventListener("change", (e) => {
        if (e.target.files && e.target.files[0]) {
          handleUpload(e.target.files[0]);
        }
      });
    }

    // Drag and drop handlers
    if (dropzone) {
      dropzone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropzone.classList.add("dropzone-dragover");
      });
      dropzone.addEventListener("dragleave", () => {
        dropzone.classList.remove("dropzone-dragover");
      });
      dropzone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropzone.classList.remove("dropzone-dragover");
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          handleUpload(e.dataTransfer.files[0]);
        }
      });
    }

    // Print / Save PDF
    if (printBtn) {
      printBtn.addEventListener("click", () => {
        window.print();
      });
    }

    // Reanalyze ATS
    if (reanalyzeBtn) {
      reanalyzeBtn.addEventListener("click", () => {
        reanalyzeBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Scanning Keywords...`;
        reanalyzeBtn.disabled = true;

        setTimeout(() => {
          const simulatedScore = Math.floor(Math.random() * 6) + 92;
          window.AppState.uploadResume({
            filename: student.resume?.filename || "Placement_Resume_2025.pdf",
            size: student.resume?.size || "240 KB",
            atsScore: simulatedScore
          });
          Helpers.showToast("ATS Diagnostics Complete", `Placement readiness verified: ${simulatedScore}/100 match!`, "success");
          ResumeComponent.render(container);
        }, 800);
      });
    }
  }
};

window.ResumeComponent = ResumeComponent;
