// state.js: Central state store with localStorage persistence and reactive pub/sub listeners

const getHelpers = () => (typeof window !== 'undefined' ? window.Helpers : null);

class PortalState {
  constructor() {
    this.STORAGE_KEY = "SKILL_PLACEMENT_PORTAL_STATE_V2";
    this.listeners = [];
    this.state = this.loadState();
  }

  loadState() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Ensure defaults are merged in case schema expands
        return {
          ...window.DEFAULT_DATA,
          ...parsed
        };
      }
    } catch (e) {
      console.warn("Could not load from localStorage, falling back to defaults", e);
    }
    return JSON.parse(JSON.stringify(window.DEFAULT_DATA));
  }

  saveState() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error("Failed to save state to localStorage", e);
    }
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn(this.state));
  }

  // --- Student Accessors & Mutators ---
  getCurrentStudent() {
    const student = this.state.students.find(s => s.id === this.state.activeStudentId);
    return student || this.state.students[0];
  }

  switchStudent(studentId) {
    const found = this.state.students.find(s => s.id === studentId);
    if (found) {
      this.state.activeStudentId = studentId;
      this.saveState();
      return true;
    }
    return false;
  }

  updateStudentProfile(updates) {
    const student = this.getCurrentStudent();
    if (!student) return;
    Object.assign(student, updates);
    this.saveState();
  }

  addSkill(skillObj) {
    const student = this.getCurrentStudent();
    if (!student) return;
    // Check if skill already exists
    const exists = student.skills.some(s => s.name.toLowerCase() === skillObj.name.toLowerCase());
    if (exists) return false;

    student.skills.push({
      name: skillObj.name,
      category: skillObj.category || "Languages",
      level: skillObj.level || "Intermediate",
      verified: true
    });
    this.saveState();
    return true;
  }

  removeSkill(skillName) {
    const student = this.getCurrentStudent();
    if (!student) return;
    student.skills = student.skills.filter(s => s.name.toLowerCase() !== skillName.toLowerCase());
    this.saveState();
  }

  addProject(projectData) {
    const student = this.getCurrentStudent();
    if (!student) return;
    const newProj = {
      id: "proj_" + Date.now(),
      title: projectData.title,
      description: projectData.description,
      tags: projectData.tags || [],
      liveUrl: projectData.liveUrl || "",
      githubUrl: projectData.githubUrl || "",
      highlights: projectData.highlights || [],
      featured: projectData.featured || false,
      date: projectData.date || "Just added"
    };
    student.projects.unshift(newProj);
    this.saveState();
    return newProj;
  }

  updateProject(projectId, updates) {
    const student = this.getCurrentStudent();
    if (!student) return;
    const proj = student.projects.find(p => p.id === projectId);
    if (proj) {
      Object.assign(proj, updates);
      this.saveState();
      return true;
    }
    return false;
  }

  deleteProject(projectId) {
    const student = this.getCurrentStudent();
    if (!student) return;
    student.projects = student.projects.filter(p => p.id !== projectId);
    this.saveState();
  }

  uploadResume(resumeMetadata) {
    const student = this.getCurrentStudent();
    if (!student) return;
    student.resume = {
      filename: resumeMetadata.filename || "Student_Resume.pdf",
      uploadedAt: new Date().toISOString(),
      size: resumeMetadata.size || "180 KB",
      atsScore: resumeMetadata.atsScore || 88,
      parsedData: resumeMetadata.parsedData || student.resume?.parsedData
    };
    this.saveState();
  }

  // --- Applications ---
  getApplicationsForCurrentStudent() {
    const student = this.getCurrentStudent();
    return this.state.applications.filter(app => app.studentId === student.id);
  }

  getAllApplications() {
    return this.state.applications;
  }

  hasApplied(jobId) {
    const student = this.getCurrentStudent();
    return this.state.applications.some(app => app.studentId === student.id && app.jobId === jobId);
  }

  applyToJob(jobId, coverNote = "", resumeFilename = "") {
    const student = this.getCurrentStudent();
    if (!student) return null;

    if (this.hasApplied(jobId)) {
      return { success: false, message: "You have already applied for this position." };
    }

    const job = this.state.jobs.find(j => j.id === jobId);
    if (!job) {
      return { success: false, message: "Job opportunity not found." };
    }

    const newApp = {
      id: "app_" + Date.now(),
      studentId: student.id,
      jobId: job.id,
      companyName: job.companyName,
      companyLogo: job.companyLogo,
      roleTitle: job.title,
      appliedDate: new Date().toISOString().split("T")[0],
      stage: "applied",
      stageHistory: [
        {
          stage: "applied",
          date: new Date().toISOString().split("T")[0],
          note: "Application submitted via Campus Placement Portal."
        }
      ],
      nextAction: "Application in initial review queue by " + job.companyName + " campus recruiting team.",
      feedback: "Application successfully recorded.",
      recruiterNotes: "Candidate applied via college drive. Matches eligibility criteria.",
      resumeAttached: resumeFilename || student.resume?.filename || "Alex_Chen_SWE_Resume_2025.pdf",
      coverNote: coverNote || "Enthusiastic to apply for this role."
    };

    this.state.applications.unshift(newApp);
    this.saveState();
    return { success: true, application: newApp };
  }

  updateApplicationStage(applicationId, newStage, note = "") {
    const app = this.state.applications.find(a => a.id === applicationId);
    if (!app) return false;

    const helpers = getHelpers();
    const stageLabel = helpers ? helpers.getStageMeta(newStage).label : newStage;
    app.stage = newStage;
    app.stageHistory = app.stageHistory || [];
    app.stageHistory.push({
      stage: newStage,
      date: new Date().toISOString().split("T")[0],
      note: note || `Application advanced to ${stageLabel}`
    });

    if (newStage === "technical_interview") {
      app.nextAction = "Technical Interview scheduled. Check your college email for meeting link.";
    } else if (newStage === "offered") {
      app.nextAction = "Congratulations! Formal Campus Offer has been released. Accept within 14 days.";
      if (!app.offerDetails) {
        app.offerDetails = {
          ctc: "₹22,000,000 / annum (₹22 LPA)",
          baseSalary: "₹16,500,000 / annum",
          joiningBonus: "₹2,00,000",
          joiningDate: "July 1, 2025",
          location: "Bangalore, India"
        };
      }
    } else if (newStage === "rejected") {
      app.nextAction = "Application archived. We encourage applying for future drives.";
    }

    this.saveState();
    return true;
  }

  // --- Recruiter / Job Posting ---
  getAllJobs() {
    return this.state.jobs;
  }

  getJobsForCompany(companyId) {
    return this.state.jobs.filter(j => j.companyId === companyId);
  }

  getApplicantsForJob(jobId) {
    const apps = this.state.applications.filter(a => a.jobId === jobId);
    // Enrich with student details
    const helpers = getHelpers();
    return apps.map(app => {
      const student = this.state.students.find(s => s.id === app.studentId) || {};
      const job = this.state.jobs.find(j => j.id === app.jobId) || {};
      const match = helpers ? helpers.calculateSkillMatch(student.skills || [], job.requiredSkills || [], job.preferredSkills || []) : { percentage: 85, matched: [], missing: [] };
      return {
        ...app,
        student,
        matchScore: match.percentage,
        matchedSkills: match.matched,
        missingSkills: match.missing
      };
    });
  }

  postNewJob(jobData) {
    const activeCompany = this.getCurrentCompany();
    const newJob = {
      id: "job_" + Date.now(),
      companyId: activeCompany.id,
      companyName: activeCompany.name,
      companyLogo: activeCompany.logo,
      title: jobData.title,
      type: jobData.type || "Full-time",
      workMode: jobData.workMode || "Hybrid",
      location: jobData.location || "Bangalore, India",
      stipendOrCtc: jobData.stipendOrCtc || "₹18 - 22 LPA",
      numericMinSalary: parseInt(jobData.numericMinSalary) || 1800000,
      deadline: jobData.deadline || "2026-10-31",
      postedDate: new Date().toISOString().split("T")[0],
      minCgpa: parseFloat(jobData.minCgpa) || 7.0,
      eligibleBranches: jobData.eligibleBranches || ["CSE", "ISE", "ECE", "AI & DS"],
      maxBacklogs: parseInt(jobData.maxBacklogs) || 0,
      openings: parseInt(jobData.openings) || 5,
      requiredSkills: jobData.requiredSkills || [],
      preferredSkills: jobData.preferredSkills || [],
      description: jobData.description || "",
      rounds: jobData.rounds || ["Online Assessment", "Technical Interview", "HR Round"],
      perks: jobData.perks || ["Health Insurance", "Learning Allowance", "Flexible Hours"]
    };

    this.state.jobs.unshift(newJob);
    this.saveState();
    return newJob;
  }

  // --- Roles & Companies ---
  getUserRole() {
    return this.state.userRole || "student";
  }

  switchRole(role) {
    if (role === "student" || role === "recruiter" || role === "analytics") {
      this.state.userRole = role;
      this.saveState();
      return true;
    }
    return false;
  }

  getCurrentCompany() {
    return this.state.companies.find(c => c.id === this.state.activeCompanyId) || this.state.companies[0];
  }

  switchCompany(companyId) {
    const comp = this.state.companies.find(c => c.id === companyId);
    if (comp) {
      this.state.activeCompanyId = companyId;
      this.saveState();
      return true;
    }
    return false;
  }

  resetToDemoData() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.state = JSON.parse(JSON.stringify(window.DEFAULT_DATA));
    this.saveState();
  }
}

window.AppState = new PortalState();
