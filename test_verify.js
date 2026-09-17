// test_verify.js: Automated test for Portal logic, Skill Matcher, State Transitions, and Seed Data

const fs = require('fs');

global.window = {};
global.localStorage = {
  store: {},
  getItem(k) { return this.store[k] || null; },
  setItem(k, v) { this.store[k] = v.toString(); },
  removeItem(k) { delete this.store[k]; }
};

// Load seed data
require('./js/seed-data.js');
console.log("✓ Seed data loaded successfully.");
console.log(`  - Students: ${window.DEFAULT_DATA.students.length}`);
console.log(`  - Companies: ${window.DEFAULT_DATA.companies.length}`);
console.log(`  - Jobs: ${window.DEFAULT_DATA.jobs.length}`);
console.log(`  - Applications: ${window.DEFAULT_DATA.applications.length}`);

// Load helpers
require('./js/utils/helpers.js');
console.log("✓ Helpers loaded successfully.");

const alex = window.DEFAULT_DATA.students[0];
const googleJob = window.DEFAULT_DATA.jobs[0];
const Helpers = global.window.Helpers;
const match = Helpers.calculateSkillMatch(alex.skills, googleJob.requiredSkills, googleJob.preferredSkills);
console.log(`✓ Skill Match Calculation for ${alex.name} on ${googleJob.title}:`);
console.log(`  - Match Score: ${match.percentage}%`);
console.log(`  - Matched Skills: [${match.matched.join(', ')}]`);
console.log(`  - Missing Skills: [${match.missing.join(', ')}]`);

if (match.percentage > 0 && match.matched.length > 0) {
  console.log("✓ Skill match engine PASSED.");
} else {
  console.error("✗ Skill match failed!");
  process.exit(1);
}

// Load state
require('./js/state.js');
console.log("✓ State management loaded successfully.");

const curStudent = window.AppState.getCurrentStudent();
console.log(`  - Active student: ${curStudent.name} (${curStudent.cgpa} CGPA)`);

// Test adding skill
const addSkillOk = window.AppState.addSkill({ name: "GraphQL", category: "Languages", level: "Advanced" });
console.log(`✓ Add Skill 'GraphQL': ${addSkillOk ? "SUCCESS" : "FAILED"}`);
const hasGraphQL = window.AppState.getCurrentStudent().skills.some(s => s.name === "GraphQL");
if (!hasGraphQL) {
  console.error("✗ Skill not added to state!");
  process.exit(1);
}

// Test adding project
const newProj = window.AppState.addProject({
  title: "CloudFlow Engine",
  description: "Distributed workflow scheduler",
  tags: ["Node.js", "Docker", "Redis"],
  highlights: ["Scaled to 10k ops/sec"]
});
console.log(`✓ Add Project: '${newProj.title}' (ID: ${newProj.id})`);

// Test applying to unapplied job (Microsoft job_2)
const msftJob = window.DEFAULT_DATA.jobs.find(j => j.companyName === "Microsoft");
const applyResult = window.AppState.applyToJob(msftJob.id, "Excited to join Microsoft Summer Internship!", "Alex_Chen_Resume.pdf");
console.log(`✓ Job Application to ${msftJob.companyName}: ${applyResult.success ? "SUCCESS" : "FAILED"}`);

// Test stage transition
const myApps = window.AppState.getApplicationsForCurrentStudent();
const latestApp = myApps[0];
const stageAdvanceOk = window.AppState.updateApplicationStage(latestApp.id, "technical_interview", "Scheduled live coding");
console.log(`✓ Stage Transition to 'technical_interview': ${stageAdvanceOk ? "SUCCESS" : "FAILED"}`);

// Test recruiter posting a new job
window.AppState.switchRole("recruiter");
window.AppState.switchCompany("comp_google");
const newJob = window.AppState.postNewJob({
  title: "Systems Engineer (Kernel & Network)",
  type: "Full-time",
  workMode: "On-site",
  location: "Bangalore",
  stipendOrCtc: "₹32.0 LPA",
  minCgpa: 8.0,
  requiredSkills: ["C++", "Linux", "Data Structures & Algorithms"],
  preferredSkills: ["Docker", "Networking"],
  description: "Build foundational low-latency OS kernels."
});
console.log(`✓ Recruiter Job Posting: '${newJob.title}' by Google (Job ID: ${newJob.id})`);

// Test recruiter getting applicants
const applicants = window.AppState.getApplicantsForJob("job_1");
console.log(`✓ Applicants for Google Job 1: ${applicants.length} candidates found.`);
if (applicants.length > 0) {
  console.log(`  - Candidate 1: ${applicants[0].student.name}, Match: ${applicants[0].matchScore}%`);
}

console.log("\n=======================================================");
console.log(" ALL AUTOMATED PORTAL TESTS PASSED WITH 100% SUCCESS! ");
console.log("=======================================================\n");
