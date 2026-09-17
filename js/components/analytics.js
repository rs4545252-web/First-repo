// analytics.js: Placement Cell Insights, hiring statistics, and skill demand trends

const AnalyticsComponent = {
  render(container) {
    const stats = window.AppState.state.placementStats;
    const allJobs = window.AppState.getAllJobs();
    const allApplications = window.AppState.getAllApplications();

    container.innerHTML = `
      <div class="analytics-view-wrapper animate-fade-in">
        
        <!-- Header Banner -->
        <div class="page-title-banner">
          <div>
            <h1 class="page-title"><i class="fas fa-chart-pie text-indigo"></i> Campus Placement Insights & Skill Trends</h1>
            <p class="page-subtitle">Real-time statistics from the college placement cell, recruiter benchmarks, and market skill demand.</p>
          </div>
          <div class="banner-badge-group">
            <span class="stat-pill"><i class="fas fa-calendar-check text-emerald"></i> <strong>Class of 2025</strong> Drives Active</span>
          </div>
        </div>

        <!-- KPI Cards Grid -->
        <div class="stats-overview-grid">
          <div class="stat-metric-card">
            <div class="stat-icon-wrapper bg-indigo-subtle">
              <i class="fas fa-user-graduate text-indigo"></i>
            </div>
            <div class="stat-content">
              <span class="stat-label">Placement Rate</span>
              <div class="stat-val-group">
                <span class="stat-number">${stats.placementRate}%</span>
                <span class="stat-sub text-emerald"><i class="fas fa-arrow-up"></i> +4.2% YoY</span>
              </div>
              <small class="stat-footnote">${stats.placedStudents} of ${stats.totalStudents} students placed</small>
            </div>
          </div>

          <div class="stat-metric-card">
            <div class="stat-icon-wrapper bg-emerald-subtle">
              <i class="fas fa-money-bill-wave text-emerald"></i>
            </div>
            <div class="stat-content">
              <span class="stat-label">Highest Package</span>
              <div class="stat-val-group">
                <span class="stat-number text-emerald">${stats.highestCtc}</span>
                <span class="stat-badge-corp">Google</span>
              </div>
              <small class="stat-footnote">Average: <strong>${stats.averageCtc}</strong> • Median: <strong>${stats.medianCtc}</strong></small>
            </div>
          </div>

          <div class="stat-metric-card">
            <div class="stat-icon-wrapper bg-cyan-subtle">
              <i class="fas fa-trophy text-cyan"></i>
            </div>
            <div class="stat-content">
              <span class="stat-label">Total Offers Extended</span>
              <div class="stat-val-group">
                <span class="stat-number text-cyan">${stats.offersReleased}</span>
                <span class="stat-sub text-cyan">Multiple PPOs</span>
              </div>
              <small class="stat-footnote">Across 65+ registered tech companies</small>
            </div>
          </div>

          <div class="stat-metric-card">
            <div class="stat-icon-wrapper bg-amber-subtle">
              <i class="fas fa-building text-amber"></i>
            </div>
            <div class="stat-content">
              <span class="stat-label">Active Campus Drives</span>
              <div class="stat-val-group">
                <span class="stat-number text-amber">${allJobs.length}</span>
                <span class="stat-sub text-amber">Live now</span>
              </div>
              <small class="stat-footnote">Openings for SWE, AI/ML, Cloud, Data</small>
            </div>
          </div>
        </div>

        <!-- 2 Column Analytics: Top Recruiters & In-Demand Skills -->
        <div class="analytics-grid-two-col mt-5">
          
          <!-- Column 1: Top Recruiters Leaderboard -->
          <div class="analytics-card">
            <div class="analytics-card-header">
              <div>
                <h3 class="card-title"><i class="fas fa-medal text-amber"></i> Top Recruiting Partners</h3>
                <p class="card-subtitle">Highest hiring volume & competitive CTC packages</p>
              </div>
            </div>

            <div class="recruiters-table-wrapper mt-3">
              <table class="leaderboard-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Company</th>
                    <th>Students Hired</th>
                    <th>Average CTC</th>
                  </tr>
                </thead>
                <tbody>
                  ${stats.topRecruiters.map((rec, i) => `
                    <tr>
                      <td><span class="rank-badge ${i === 0 ? 'rank-gold' : i === 1 ? 'rank-silver' : i === 2 ? 'rank-bronze' : 'rank-normal'}">#${i + 1}</span></td>
                      <td><strong>${rec.name}</strong></td>
                      <td><span class="pill-hired">${rec.count} Hired</span></td>
                      <td class="text-emerald font-weight-bold">${rec.avgCtc}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Column 2: In-Demand Skills & Industry Radar -->
          <div class="analytics-card">
            <div class="analytics-card-header">
              <div>
                <h3 class="card-title"><i class="fas fa-fire-alt text-danger"></i> High-Demand Skills for 2025/2026</h3>
                <p class="card-subtitle">Skills most requested by recruiters in active technical rounds</p>
              </div>
            </div>

            <div class="skills-demand-list mt-3">
              ${stats.inDemandSkills.map(item => `
                <div class="demand-item">
                  <div class="demand-header">
                    <span class="demand-skill-name"><strong>${item.skill}</strong></span>
                    <span class="demand-trend-pill">${item.trend}</span>
                  </div>
                  <div class="demand-bar-track">
                    <div class="demand-bar-fill" style="width: ${item.demand}%;"></div>
                  </div>
                  <div class="demand-meta">
                    <small>Demand Index: <strong>${item.demand}/100</strong></small>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

        </div>

        <!-- Domain Breakdown & Readiness Checklist -->
        <div class="analytics-grid-two-col mt-5">
          
          <!-- Domain Distribution -->
          <div class="analytics-card">
            <div class="analytics-card-header">
              <div>
                <h3 class="card-title"><i class="fas fa-chart-bar text-indigo"></i> Hiring Breakdown by Domain</h3>
                <p class="card-subtitle">Distribution of campus offers across engineering specializations</p>
              </div>
            </div>

            <div class="domain-bars-wrapper mt-4">
              ${stats.domainDistribution.map(d => `
                <div class="domain-item mb-3">
                  <div class="domain-info-row">
                    <span class="domain-name">${d.domain}</span>
                    <span class="domain-pct"><strong>${d.percentage}%</strong></span>
                  </div>
                  <div class="domain-track">
                    <div class="domain-fill" style="width: ${d.percentage}%;"></div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Placement Preparation Guide / Checklist -->
          <div class="analytics-card">
            <div class="analytics-card-header">
              <div>
                <h3 class="card-title"><i class="fas fa-clipboard-check text-emerald"></i> Student Placement Checklist</h3>
                <p class="card-subtitle">Ensure your profile satisfies college placement criteria</p>
              </div>
            </div>

            <div class="checklist-items mt-3">
              <div class="checklist-item">
                <i class="fas fa-check-circle text-emerald"></i>
                <div>
                  <strong>Maintain CGPA &ge; 7.5</strong>
                  <p>78% of Tier-1 tech recruiters set the initial online test cutoff at 7.5 or 8.0 CGPA.</p>
                </div>
              </div>

              <div class="checklist-item">
                <i class="fas fa-check-circle text-emerald"></i>
                <div>
                  <strong>Showcase 2+ End-to-End Deployed Projects</strong>
                  <p>Projects with live URLs and GitHub source code receive 3x more interview callbacks.</p>
                </div>
              </div>

              <div class="checklist-item">
                <i class="fas fa-check-circle text-emerald"></i>
                <div>
                  <strong>Target &ge; 85 ATS Resume Score</strong>
                  <p>Use the built-in ATS Optimizer to eliminate formatting flaws and match keywords.</p>
                </div>
              </div>

              <div class="checklist-item">
                <i class="fas fa-check-circle text-emerald"></i>
                <div>
                  <strong>Core CS & DSA Mastery</strong>
                  <p>Focus on Arrays, Graphs, Dynamic Programming, and SQL fundamentals.</p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    `;
  }
};

window.AnalyticsComponent = AnalyticsComponent;
