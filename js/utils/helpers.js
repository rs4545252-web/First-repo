// helpers.js: Utility functions, skill match calculator, ATS scanner, notifications, and formatters

const Helpers = {
  // Calculate match percentage between student's skills and a job's requirements
  calculateSkillMatch(studentSkills, requiredSkills = [], preferredSkills = []) {
    if (!studentSkills || studentSkills.length === 0) {
      return { percentage: 0, matched: [], missing: requiredSkills, preferredMatched: [] };
    }

    const studentSkillNames = studentSkills.map(s => (typeof s === 'string' ? s : s.name).toLowerCase().trim());

    // Check required skills
    const matchedRequired = requiredSkills.filter(req => 
      studentSkillNames.some(s => s === req.toLowerCase().trim() || s.includes(req.toLowerCase().trim()) || req.toLowerCase().trim().includes(s))
    );

    const missingRequired = requiredSkills.filter(req => 
      !studentSkillNames.some(s => s === req.toLowerCase().trim() || s.includes(req.toLowerCase().trim()) || req.toLowerCase().trim().includes(s))
    );

    // Check preferred skills
    const matchedPreferred = preferredSkills.filter(pref => 
      studentSkillNames.some(s => s === pref.toLowerCase().trim() || s.includes(pref.toLowerCase().trim()) || pref.toLowerCase().trim().includes(s))
    );

    // Weighted scoring: Required skills are worth 75%, Preferred are worth 25%
    let score = 0;
    if (requiredSkills.length > 0) {
      const requiredScore = (matchedRequired.length / requiredSkills.length) * 75;
      const preferredScore = preferredSkills.length > 0 ? (matchedPreferred.length / preferredSkills.length) * 25 : 25;
      score = Math.round(requiredScore + preferredScore);
    } else {
      score = 80; // fallback if no explicit skills
    }

    score = Math.min(100, Math.max(10, score));

    return {
      percentage: score,
      matched: matchedRequired,
      missing: missingRequired,
      preferredMatched: matchedPreferred,
      totalRequired: requiredSkills.length,
      totalMatched: matchedRequired.length
    };
  },

  // Color coding for match percentage
  getMatchBadgeClass(percentage) {
    if (percentage >= 80) return 'match-high';
    if (percentage >= 60) return 'match-medium';
    return 'match-low';
  },

  // Stage labels and styles for applications
  stageInfo: {
    applied: {
      label: "Applied",
      icon: "fas fa-paper-plane",
      badgeClass: "badge-applied",
      desc: "Application submitted to company"
    },
    shortlisted: {
      label: "Shortlisted",
      icon: "fas fa-clipboard-check",
      badgeClass: "badge-shortlisted",
      desc: "Resume screened / Cleared Assessment"
    },
    technical_interview: {
      label: "Technical Round",
      icon: "fas fa-code",
      badgeClass: "badge-tech",
      desc: "Live coding or system architecture"
    },
    hr_round: {
      label: "HR Interview",
      icon: "fas fa-user-tie",
      badgeClass: "badge-hr",
      desc: "Managerial & cultural alignment"
    },
    offered: {
      label: "Offered",
      icon: "fas fa-trophy",
      badgeClass: "badge-offered",
      desc: "Campus placement offer released!"
    },
    rejected: {
      label: "Archived",
      icon: "fas fa-times-circle",
      badgeClass: "badge-rejected",
      desc: "Position closed or not selected"
    }
  },

  getStageMeta(stage) {
    return this.stageInfo[stage] || {
      label: stage,
      icon: "fas fa-circle",
      badgeClass: "badge-default",
      desc: ""
    };
  },

  // Format currency numbers
  formatCurrency(num) {
    if (!num) return "Not specified";
    if (typeof num === 'string') return num;
    if (num >= 100000) {
      return `₹${(num / 100000).toFixed(1)} LPA`;
    }
    return `₹${num.toLocaleString('en-IN')}`;
  },

  // Format date readable
  formatDate(dateStr) {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  },

  // Relative time helper
  timeAgo(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const now = new Date();
    const diffDays = Math.round((now - d) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 30) return `${diffDays} days ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  },

  // Days remaining helper
  daysLeft(deadlineStr) {
    if (!deadlineStr) return null;
    const deadline = new Date(deadlineStr);
    const now = new Date();
    const diffTime = deadline - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  },

  // Audio cue with Web Audio API
  playAudioCue(type = "success") {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "success") {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.2); // G5
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.35);
      } else if (type === "click") {
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.08);
      } else {
        osc.frequency.setValueAtTime(350, ctx.currentTime);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.2);
      }
    } catch (e) {
      // Audio autoplay may be disabled
    }
  },

  // Modern Toast notification system
  showToast(title, message, type = "success") {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast-card toast-${type} animate-slide-in`;

    let icon = "fa-check-circle";
    if (type === "error") icon = "fa-exclamation-triangle";
    if (type === "info") icon = "fa-info-circle";
    if (type === "warning") icon = "fa-bell";

    toast.innerHTML = `
      <div class="toast-icon"><i class="fas ${icon}"></i></div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" aria-label="Close">&times;</button>
    `;

    container.appendChild(toast);
    this.playAudioCue(type === "error" ? "error" : "success");

    const closeBtn = toast.querySelector(".toast-close");
    const removeToast = () => {
      toast.classList.remove("animate-slide-in");
      toast.classList.add("animate-fade-out");
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    };

    closeBtn.addEventListener("click", removeToast);
    setTimeout(removeToast, 4500);
  },

  // Modal open/close helpers
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add("active");
    document.body.classList.add("modal-open");
    this.playAudioCue("click");

    // Close when clicking outside modal content
    modal.onclick = (e) => {
      if (e.target === modal) {
        Helpers.closeModal(modalId);
      }
    };
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove("active");
    document.body.classList.remove("modal-open");
  },

  // Automated ATS Resume Analyzer Heuristics
  analyzeResumeContent(resumeText, student) {
    const text = (resumeText || "").toLowerCase();
    let score = 50;
    const strengths = [];
    const recommendations = [];

    // Check for essential sections
    const hasEducation = text.includes("education") || text.includes("cgpa") || text.includes("b.tech") || text.includes("college");
    const hasSkills = text.includes("skills") || text.includes("technologies") || text.includes("programming");
    const hasProjects = text.includes("projects") || text.includes("developed") || text.includes("built");
    const hasExperience = text.includes("experience") || text.includes("internship") || text.includes("work");
    const hasContact = text.includes("email") || text.includes("@") || text.includes("linkedin") || text.includes("github");

    if (hasEducation) { score += 10; strengths.push("Clear Academic & Education records detected"); }
    else recommendations.push("Add an explicit 'Education' section with Degree, College, and CGPA");

    if (hasSkills) { score += 10; strengths.push("Structured Technical Skills and categorized tools found"); }
    else recommendations.push("Include a dedicated 'Technical Skills' taxonomy section");

    if (hasProjects) { score += 12; strengths.push("Highlighted software projects and implementation details"); }
    else recommendations.push("Feature 2-3 substantial projects with live demo or GitHub links");

    if (hasExperience) { score += 8; strengths.push("Past internship / leadership experience clearly stated"); }
    else recommendations.push("Include relevant internships, hackathon wins, or open source contributions");

    if (hasContact) { score += 6; strengths.push("Complete contact information including GitHub & LinkedIn"); }
    else recommendations.push("Add clickable links to LinkedIn, GitHub, and Portfolio");

    // Metric quantifier check (numbers, percentages, latency, scale)
    const hasMetrics = /\d+[\%|\+|k|ms|fps|users|requests]/i.test(text) || /\b(reduced|improved|increased|boosted|scaled|engineered)\b/i.test(text);
    if (hasMetrics) {
      score += 4;
      strengths.push("Strong action verbs & quantified impact metrics (e.g. %, ms, throughput)");
    } else {
      recommendations.push("Quantify results with numerical metrics (e.g. 'Improved latency by 35%')");
    }

    score = Math.min(98, Math.max(52, score));

    return {
      score,
      strengths,
      recommendations,
      hasEducation,
      hasSkills,
      hasProjects,
      hasExperience,
      hasContact
    };
  }
};

window.Helpers = Helpers;
