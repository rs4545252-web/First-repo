// seed-data.js: Comprehensive realistic initial mock data for students, jobs, and applications

window.DEFAULT_DATA = {
  activeStudentId: "student_alex",
  activeCompanyId: "comp_google",
  userRole: "student", // "student" | "recruiter"

  students: [
    {
      id: "student_alex",
      name: "Alex Chen",
      headline: "Aspiring Full-Stack & Systems Engineer | B.Tech CSE '25",
      usn: "1MS21CS042",
      email: "alex.chen@campus.edu",
      phone: "+91 98765 43210",
      college: "National Institute of Technology",
      degree: "B.Tech in Computer Science & Engineering",
      batch: "2021 - 2025",
      cgpa: 8.92,
      location: "Bangalore, India",
      bio: "Passionate computer science senior with deep experience building scalable distributed web applications, microservices, and interactive web tools. Actively solving problems on LeetCode (350+ solved) and contributing to open-source libraries.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      links: {
        github: "https://github.com/alexchen-dev",
        linkedin: "https://linkedin.com/in/alexchen-dev",
        leetcode: "https://leetcode.com/alexchen",
        portfolio: "https://alexchen.dev"
      },
      skills: [
        { name: "JavaScript", category: "Languages", level: "Expert", verified: true },
        { name: "TypeScript", category: "Languages", level: "Advanced", verified: true },
        { name: "Python", category: "Languages", level: "Advanced", verified: true },
        { name: "C++", category: "Languages", level: "Intermediate", verified: true },
        { name: "React", category: "Frameworks", level: "Expert", verified: true },
        { name: "Node.js", category: "Frameworks", level: "Advanced", verified: true },
        { name: "Next.js", category: "Frameworks", level: "Advanced", verified: false },
        { name: "PostgreSQL", category: "Databases", level: "Advanced", verified: true },
        { name: "MongoDB", category: "Databases", level: "Intermediate", verified: false },
        { name: "Redis", category: "Databases", level: "Intermediate", verified: true },
        { name: "Docker", category: "DevOps & Cloud", level: "Intermediate", verified: true },
        { name: "AWS", category: "DevOps & Cloud", level: "Beginner", verified: false },
        { name: "Git & GitHub", category: "Tools", level: "Advanced", verified: true },
        { name: "RESTful APIs", category: "Architecture", level: "Expert", verified: true },
        { name: "Data Structures & Algorithms", category: "Core CS", level: "Advanced", verified: true }
      ],
      projects: [
        {
          id: "proj_1",
          title: "OmniStream - Real-Time Collaborative Whiteboard",
          description: "A high-performance digital canvas enabling multi-user real-time drawing, vector shapes, and audio streaming with CRDT conflict resolution and WebSockets.",
          tags: ["React", "TypeScript", "Node.js", "WebSockets", "Redis", "Canvas API"],
          liveUrl: "https://omnistream-demo.vercel.app",
          githubUrl: "https://github.com/alexchen-dev/omnistream",
          highlights: [
            "Engineered CRDT syncing handling 50+ concurrent users per room with sub-30ms latency.",
            "Benchmarked Redis pub/sub message throughput boosting canvas render rates to 60 FPS."
          ],
          featured: true,
          date: "Oct 2024"
        },
        {
          id: "proj_2",
          title: "CloudPulse - Kubernetes Cluster Monitor",
          description: "Lightweight monitoring dashboard tracking pod health, memory leaks, and network ingress metrics with real-time alerting to Slack and Discord webhooks.",
          tags: ["Python", "Docker", "FastAPI", "React", "Prometheus"],
          liveUrl: "https://cloudpulse.preview.io",
          githubUrl: "https://github.com/alexchen-dev/cloudpulse",
          highlights: [
            "Cut incident detection latency by 45% using Prometheus metric scraping and dynamic threshold alarms.",
            "Packaged with multi-stage Docker builds reducing image container footprint to under 85MB."
          ],
          featured: true,
          date: "Jul 2024"
        },
        {
          id: "proj_3",
          title: "PayFlow - Microservices Payment Gateway Simulator",
          description: "Idempotent payment processing pipeline with transaction ledger, webhook retries with exponential backoff, and mock banking integrations.",
          tags: ["Node.js", "PostgreSQL", "Redis", "Docker", "RabbitMQ"],
          liveUrl: "",
          githubUrl: "https://github.com/alexchen-dev/payflow",
          highlights: [
            "Achieved zero duplicate debits across 10,000 simulated concurrent requests using distributed locks in Redis."
          ],
          featured: false,
          date: "Feb 2024"
        }
      ],
      experience: [
        {
          id: "exp_1",
          role: "Software Engineering Intern",
          company: "HyperScale Tech",
          location: "Bangalore (Hybrid)",
          period: "May 2024 - Jul 2024",
          description: "Refactored internal query parser microservice using TypeScript and PostgreSQL, improving API response times by 32%. Authored unit and integration test suites reaching 92% coverage."
        },
        {
          id: "exp_2",
          role: "Technical Lead & Open Source Lead",
          company: "Campus Developer Society",
          location: "College Campus",
          period: "Aug 2023 - Present",
          description: "Mentored 120+ junior students in full-stack web development, hosted 3 collegiate hackathons with 600+ participants."
        }
      ],
      resume: {
        filename: "Alex_Chen_SWE_Resume_2025.pdf",
        uploadedAt: "2026-08-20T10:15:00Z",
        size: "248 KB",
        atsScore: 91,
        parsedData: {
          summary: "Results-driven Computer Science undergraduate with proven experience building real-time distributed web systems and microservices. Strong foundation in Data Structures, Algorithms, TypeScript, React, and Node.js.",
          keywordMatchRate: 94,
          strengths: [
            "Quantified impact bullet points with clear numerical metrics",
            "Clear technical skill taxonomy across languages, frameworks, and databases",
            "Strong academic GPA (8.92) & reputable collegiate leadership experience",
            "Consistent action-verb structure (Engineered, Architected, Refactored)"
          ],
          improvementTips: [
            "Consider adding Docker/Kubernetes container orchestration keywords in the summary",
            "Ensure cloud deployment certifications (e.g., AWS Cloud Practitioner) are explicitly mentioned"
          ]
        }
      }
    },
    {
      id: "student_priya",
      name: "Priya Sharma",
      headline: "Machine Learning Engineer & Data Scientist | B.Tech AI & Data Science '25",
      usn: "1MS21AI019",
      email: "priya.sharma@campus.edu",
      phone: "+91 98123 45678",
      college: "National Institute of Technology",
      degree: "B.Tech in Artificial Intelligence & Data Science",
      batch: "2021 - 2025",
      cgpa: 9.35,
      location: "Bangalore, India",
      bio: "Aspiring AI/ML Engineer with a research focus on Computer Vision and Large Language Models. Published 1 IEEE conference paper on retinal disease detection using EfficientNet. Kaggle Notebooks Grandmaster.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
      links: {
        github: "https://github.com/priyasharma-ai",
        linkedin: "https://linkedin.com/in/priya-sharma-ai",
        leetcode: "https://leetcode.com/priyasharma_ml",
        portfolio: "https://priyasharma.ai"
      },
      skills: [
        { name: "Python", category: "Languages", level: "Expert", verified: true },
        { name: "C++", category: "Languages", level: "Intermediate", verified: true },
        { name: "SQL", category: "Languages", level: "Advanced", verified: true },
        { name: "PyTorch", category: "Frameworks", level: "Expert", verified: true },
        { name: "TensorFlow", category: "Frameworks", level: "Advanced", verified: true },
        { name: "Scikit-Learn", category: "Frameworks", level: "Expert", verified: true },
        { name: "Hugging Face", category: "Frameworks", level: "Advanced", verified: true },
        { name: "FastAPI", category: "Frameworks", level: "Advanced", verified: true },
        { name: "PostgreSQL", category: "Databases", level: "Intermediate", verified: true },
        { name: "Docker", category: "DevOps & Cloud", level: "Intermediate", verified: false },
        { name: "MLflow", category: "DevOps & Cloud", level: "Intermediate", verified: true },
        { name: "Git & GitHub", category: "Tools", level: "Advanced", verified: true },
        { name: "Data Structures & Algorithms", category: "Core CS", level: "Advanced", verified: true }
      ],
      projects: [
        {
          id: "proj_p1",
          title: "MediScan - Retinal Pathology Diagnostic AI",
          description: "Deep learning pipeline classifying diabetic retinopathy severity from fundus images with 96.4% AUC and Grad-CAM explainability heatmaps.",
          tags: ["Python", "PyTorch", "OpenCV", "FastAPI", "Docker"],
          liveUrl: "https://mediscan-demo.ai",
          githubUrl: "https://github.com/priyasharma-ai/mediscan",
          highlights: [
            "Fine-tuned EfficientNet-B4 achieving superior diagnostic sensitivity over baseline ResNet50.",
            "Published findings in IEEE International Conference on Biomedical Imaging 2024."
          ],
          featured: true,
          date: "Sep 2024"
        },
        {
          id: "proj_p2",
          title: "DocuSense - RAG-Powered Research Paper Assistant",
          description: "Retrieval-Augmented Generation agent with hybrid vector search (ChromaDB) and quantized LLaMA-3 for interactive querying of arXiv ML papers.",
          tags: ["Python", "Hugging Face", "ChromaDB", "LangChain", "Streamlit"],
          liveUrl: "https://docusense.streamlit.app",
          githubUrl: "https://github.com/priyasharma-ai/docusense",
          highlights: [
            "Implemented chunk re-ranking pipeline improving retrieval precision at k=5 by 38%."
          ],
          featured: true,
          date: "May 2024"
        }
      ],
      experience: [
        {
          id: "exp_p1",
          role: "AI Research Fellow",
          company: "Center for Healthcare Informatics",
          location: "Bangalore",
          period: "Jun 2024 - Aug 2024",
          description: "Curated dataset of 40,000 clinical medical scans and trained multi-modal transformer models."
        }
      ],
      resume: {
        filename: "Priya_Sharma_ML_Engineer_Resume.pdf",
        uploadedAt: "2026-08-28T14:30:00Z",
        size: "312 KB",
        atsScore: 95,
        parsedData: {
          summary: "AI/ML Engineer and IEEE published author specializing in Computer Vision, Deep Learning, PyTorch, and RAG architectures with a 9.35 CGPA.",
          keywordMatchRate: 97,
          strengths: [
            "Top-tier publication in international IEEE conference",
            "Exceptional academic record (CGPA 9.35)",
            "Strong PyTorch and machine learning production deployment stack"
          ],
          improvementTips: [
            "Consider demonstrating AWS SageMaker or GCP Vertex AI production experience"
          ]
        }
      }
    }
  ],

  companies: [
    {
      id: "comp_google",
      name: "Google",
      industry: "Big Tech / Cloud & Search",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
      location: "Bangalore & Hyderabad, India",
      website: "https://careers.google.com",
      description: "Google's mission is to organize the world's information and make it universally accessible and useful. We build products that impact billions of users worldwide."
    },
    {
      id: "comp_msft",
      name: "Microsoft",
      industry: "Software & Cloud",
      logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
      location: "Hyderabad & Bangalore, India",
      website: "https://careers.microsoft.com",
      description: "Microsoft enables digital transformation for the era of an intelligent cloud and an intelligent edge. Home of Azure, GitHub, Windows, and Office."
    },
    {
      id: "comp_razorpay",
      name: "Razorpay",
      industry: "FinTech & Payments",
      logo: "https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg",
      location: "Bangalore, India",
      website: "https://razorpay.com/jobs",
      description: "Razorpay is India's leading full-stack financial services company building banking, payment gateway, and payroll infrastructure for the modern internet."
    },
    {
      id: "comp_stripe",
      name: "Stripe",
      industry: "Global Financial Infrastructure",
      logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg",
      location: "Remote / Bangalore Hub",
      website: "https://stripe.com/jobs",
      description: "Stripe builds economic infrastructure for the internet. Millions of companies use Stripe's software to accept payments and manage transactions online."
    },
    {
      id: "comp_atlassian",
      name: "Atlassian",
      industry: "Collaboration Software",
      logo: "https://upload.wikimedia.org/wikipedia/commons/d/d4/Atlassian-Logo.svg",
      location: "Bangalore, India (Remote-First)",
      website: "https://www.atlassian.com/company/careers",
      description: "Atlassian powers team collaboration across the globe with flagship tools like Jira, Confluence, Trello, and Bitbucket."
    },
    {
      id: "comp_zepto",
      name: "Zepto",
      industry: "Quick Commerce & LogTech",
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/aa/Zepto_Logo.png",
      location: "Mumbai & Bangalore, India",
      website: "https://www.zeptonow.com",
      description: "India's fastest-growing quick commerce pioneer delivering groceries, electronics, and essentials in 10 minutes via proprietary dark-store tech."
    }
  ],

  jobs: [
    {
      id: "job_1",
      companyId: "comp_google",
      companyName: "Google",
      companyLogo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
      title: "Associate Software Engineer - Campus 2025",
      type: "Full-time",
      workMode: "Hybrid",
      location: "Bangalore, India",
      stipendOrCtc: "₹28.5 - 34.0 LPA",
      numericMinSalary: 2850000,
      deadline: "2026-10-15",
      postedDate: "2026-09-10",
      minCgpa: 8.0,
      eligibleBranches: ["CSE", "ISE", "ECE", "AI & DS"],
      maxBacklogs: 0,
      openings: 15,
      requiredSkills: ["Data Structures & Algorithms", "C++", "Python", "Java", "RESTful APIs"],
      preferredSkills: ["Docker", "Distributed Systems", "PostgreSQL"],
      description: "Join Google's Core Engineering team in Bengaluru. You will design, develop, test, deploy, and maintain software solutions that operate at massive scale, working on real products that serve billions of global users.",
      rounds: ["Online Coding Assessment (3 Problems)", "Technical Interview Round 1 (DSA & Problem Solving)", "Technical Interview Round 2 (System Design & Code Quality)", "Googliness & Leadership Round"],
      perks: ["Competitive CTC with RSUs", "Comprehensive Medical Insurance for family", "Free Gourmet Meals & Transport", "Annual Learning & Development Allowance"]
    },
    {
      id: "job_2",
      companyId: "comp_msft",
      companyName: "Microsoft",
      companyLogo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
      title: "Software Engineering Summer Intern - 2025/2026",
      type: "Internship",
      workMode: "Hybrid",
      location: "Hyderabad, India",
      stipendOrCtc: "₹1,25,000 / month",
      numericMinSalary: 125000,
      deadline: "2026-10-05",
      postedDate: "2026-09-08",
      minCgpa: 7.5,
      eligibleBranches: ["All Circuit Branches", "CSE", "ISE", "ECE", "EEE"],
      maxBacklogs: 0,
      openings: 25,
      requiredSkills: ["Data Structures & Algorithms", "C++", "Python", "Git & GitHub"],
      preferredSkills: ["React", "TypeScript", "Azure", "Docker"],
      description: "Microsoft India Development Center (IDC) is inviting students for our flagship 2-month Summer Internship. You will work side-by-side with senior architects on high-impact products across Azure, Office 365, and AI platforms.",
      rounds: ["Cognitive & Coding Assessment", "Technical Interview Round 1 (Algorithms)", "Technical Interview Round 2 (Object-Oriented Design & Problem Solving)", "Managerial Connect & PPO Discussion"],
      perks: ["PPO (Pre-Placement Offer) Eligibility for Top Performers", "Subsidized Luxury Housing / Relocation Allowance", "Wellness & Fitness Reimbursement"]
    },
    {
      id: "job_3",
      companyId: "comp_razorpay",
      companyName: "Razorpay",
      companyLogo: "https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg",
      title: "Backend Engineer - Payments Core (SDE-1)",
      type: "Full-time",
      workMode: "Hybrid",
      location: "Bangalore, India",
      stipendOrCtc: "₹22.0 - 26.0 LPA",
      numericMinSalary: 2200000,
      deadline: "2026-10-20",
      postedDate: "2026-09-12",
      minCgpa: 7.0,
      eligibleBranches: ["CSE", "ISE", "ECE", "EE", "MCA"],
      maxBacklogs: 1,
      openings: 8,
      requiredSkills: ["Node.js", "TypeScript", "PostgreSQL", "RESTful APIs", "Data Structures & Algorithms"],
      preferredSkills: ["Redis", "Docker", "RabbitMQ", "Microservices"],
      description: "Build the resilient transaction pipelines powering over 40% of all online transactions across India. You will handle peak high-volume traffic (10,000+ requests per second) with guaranteed high availability and sub-second settlement.",
      rounds: ["HackerRank Machine Coding Test", "Live System Architecture & Concurrency Round", "Engineering Manager Behavioral Round"],
      perks: ["ESOP Grants", "Home Office Setup Allowance (₹50,000)", "Unlimited Sick & Wellness Leaves"]
    },
    {
      id: "job_4",
      companyId: "comp_stripe",
      companyName: "Stripe",
      companyLogo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg",
      title: "Software Engineering Intern - Global Infrastructure",
      type: "Internship",
      workMode: "Remote",
      location: "Remote (India)",
      stipendOrCtc: "₹1,40,000 / month",
      numericMinSalary: 140000,
      deadline: "2026-09-30",
      postedDate: "2026-09-05",
      minCgpa: 8.0,
      eligibleBranches: ["CSE", "ISE", "ECE", "AI & DS"],
      maxBacklogs: 0,
      openings: 6,
      requiredSkills: ["TypeScript", "Python", "React", "Git & GitHub", "RESTful APIs"],
      preferredSkills: ["Docker", "PostgreSQL", "Redis"],
      description: "Stripe engineering values clarity of thought, strong empathetic communication, and rigorous craftsmanship. Work on developer tools, merchant interfaces, and global payout engines.",
      rounds: ["Take-home Technical Practical Assignment", "Pair Programming Debugging Session (60 mins)", "Values & Cultural Alignment Interview"],
      perks: ["Full Remote Setup (MacBook Pro + 4K Monitor sent to your home)", "Monthly Wellness Stipend", "Mentorship from Staff Engineers"]
    },
    {
      id: "job_5",
      companyId: "comp_atlassian",
      companyName: "Atlassian",
      companyLogo: "https://upload.wikimedia.org/wikipedia/commons/d/d4/Atlassian-Logo.svg",
      title: "Graduate Software Engineer (SDE-1) - Jira Platform",
      type: "Full-time",
      workMode: "Remote",
      location: "Bangalore / Remote (India)",
      stipendOrCtc: "₹24.0 - 30.0 LPA",
      numericMinSalary: 2400000,
      deadline: "2026-10-18",
      postedDate: "2026-09-11",
      minCgpa: 7.5,
      eligibleBranches: ["CSE", "ISE", "ECE", "AI & DS"],
      maxBacklogs: 0,
      openings: 12,
      requiredSkills: ["React", "JavaScript", "TypeScript", "Node.js", "Data Structures & Algorithms"],
      preferredSkills: ["PostgreSQL", "Next.js", "AWS", "Docker"],
      description: "Atlassian's TEAM Anywhere work policy allows you to do great work wherever you are most productive. Help shape the future of team agility and collaboration.",
      rounds: ["Online Assessment", "System Problem Solving & Coding", "System Design & Architecture", "Management & Values Interview"],
      perks: ["Remote Work Allowance", "Annual Learning Budget $1,500 USD", "Generous Parental & Wellness Leaves"]
    },
    {
      id: "job_6",
      companyId: "comp_zepto",
      companyName: "Zepto",
      companyLogo: "https://upload.wikimedia.org/wikipedia/commons/a/aa/Zepto_Logo.png",
      title: "Frontend SDE-1 - Dark Store & Consumer Apps",
      type: "Full-time",
      workMode: "On-site",
      location: "Bangalore, India",
      stipendOrCtc: "₹18.0 - 22.0 LPA",
      numericMinSalary: 1800000,
      deadline: "2026-10-10",
      postedDate: "2026-09-14",
      minCgpa: 6.5,
      eligibleBranches: ["All Engineering Branches"],
      maxBacklogs: 1,
      openings: 10,
      requiredSkills: ["React", "JavaScript", "TypeScript", "Next.js", "RESTful APIs"],
      preferredSkills: ["Redis", "Node.js", "Performance Optimization"],
      description: "Build ultra-fast, smooth web applications that handle millions of cart interactions daily. Optimize web vitals, state management, and real-time order tracking dashboards.",
      rounds: ["Frontend UI Machine Coding Round (2 Hours)", "Technical Architecture & JavaScript Deep-Dive", "Founders / Engineering Director Round"],
      perks: ["High-Growth Startup Fast-Track Promotions", "Catered Lunch & Dinner at HQ", "Stock Options (ESOPs)"]
    },
    {
      id: "job_7",
      companyId: "comp_google",
      companyName: "Google",
      companyLogo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
      title: "Machine Learning Engineer Intern - DeepMind & Research",
      type: "Internship",
      workMode: "Hybrid",
      location: "Bangalore, India",
      stipendOrCtc: "₹1,35,000 / month",
      numericMinSalary: 135000,
      deadline: "2026-10-12",
      postedDate: "2026-09-09",
      minCgpa: 8.5,
      eligibleBranches: ["CSE", "AI & DS", "ECE", "Mathematics & Computing"],
      maxBacklogs: 0,
      openings: 8,
      requiredSkills: ["Python", "PyTorch", "TensorFlow", "Data Structures & Algorithms"],
      preferredSkills: ["Hugging Face", "Docker", "FastAPI"],
      description: "Work with Google Research India on foundational LLM architectures, multilingual NLP, and responsible AI evaluation. Opportunity to co-author papers for premier venues.",
      rounds: ["Online ML & Algorithms Assessment", "Technical Interview Round 1 (Deep Learning Theory & Math)", "Technical Interview Round 2 (ML Implementation & Coding)", "Research Scientist Discussion"],
      perks: ["Pre-Placement Full-time Conversion (L3 ML Engineer)", "Research Compute Infrastructure (TPU v5e clusters)", "Global Mentorship"]
    },
    {
      id: "job_8",
      companyId: "comp_msft",
      companyName: "Microsoft",
      companyLogo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
      title: "Data & Applied AI Engineer (Campus 2025)",
      type: "Full-time",
      workMode: "Hybrid",
      location: "Bangalore / Hyderabad",
      stipendOrCtc: "₹26.0 - 32.0 LPA",
      numericMinSalary: 2600000,
      deadline: "2026-10-25",
      postedDate: "2026-09-15",
      minCgpa: 8.0,
      eligibleBranches: ["CSE", "AI & DS", "ISE", "Mathematics & Computing"],
      maxBacklogs: 0,
      openings: 14,
      requiredSkills: ["Python", "SQL", "Scikit-Learn", "PyTorch", "Data Structures & Algorithms"],
      preferredSkills: ["MLflow", "Docker", "FastAPI", "PostgreSQL"],
      description: "Develop generative AI features integrated into Microsoft 365 Copilot and Bing Services. Create scalable data pipelines and fine-tune state-of-the-art transformer models.",
      rounds: ["Cognitive & Data Assessment", "Machine Learning Case Study Round", "Live Algorithm & Coding Interview", "Hiring Manager Fit Round"],
      perks: ["Microsoft Stock Award", "Comprehensive Healthcare Package", "Tuition Reimbursement for Higher Studies"]
    }
  ],

  applications: [
    {
      id: "app_1",
      studentId: "student_alex",
      jobId: "job_1",
      companyName: "Google",
      companyLogo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
      roleTitle: "Associate Software Engineer - Campus 2025",
      appliedDate: "2026-09-11",
      stage: "technical_interview", // applied | shortlisted | technical_interview | hr_round | offered | rejected
      stageHistory: [
        { stage: "applied", date: "2026-09-11", note: "Application submitted with tailored SWE resume" },
        { stage: "shortlisted", date: "2026-09-13", note: "Cleared Online Assessment with 100% test cases passed" },
        { stage: "technical_interview", date: "2026-09-16", note: "Tech Round 1 scheduled for Sep 22, 2026 at 2:00 PM IST via Google Meet" }
      ],
      nextAction: "Round 1 (DSA & Algorithms) with Senior Staff SWE on Sep 22, 2026",
      feedback: "Strong performance on dynamic programming and graph assessment problems.",
      recruiterNotes: "Candidate exhibits clear code structuring in C++ and TypeScript. High recommendation.",
      resumeAttached: "Alex_Chen_SWE_Resume_2025.pdf",
      coverNote: "Excited to contribute to Google's core search and distributed infrastructure teams."
    },
    {
      id: "app_2",
      studentId: "student_alex",
      jobId: "job_3",
      companyName: "Razorpay",
      companyLogo: "https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg",
      roleTitle: "Backend Engineer - Payments Core (SDE-1)",
      appliedDate: "2026-09-12",
      stage: "offered",
      stageHistory: [
        { stage: "applied", date: "2026-09-12", note: "Applied via college placement portal" },
        { stage: "shortlisted", date: "2026-09-13", note: "Shortlisted based on high CGPA and PayFlow microservices project" },
        { stage: "technical_interview", date: "2026-09-14", note: "Cleared 2 rounds of System Design and Live Coding" },
        { stage: "hr_round", date: "2026-09-15", note: "Completed Cultural and HR alignment" },
        { stage: "offered", date: "2026-09-16", note: "Official Campus Offer Letter released!" }
      ],
      nextAction: "Review and accept Offer Letter by Sep 30, 2026",
      offerDetails: {
        ctc: "₹24,500,000 / annum (₹24.5 LPA)",
        baseSalary: "₹18,000,000 / annum",
        joiningBonus: "₹2,500,000",
        esops: "₹4,000,000 (vested over 4 years)",
        joiningDate: "July 7, 2025",
        location: "Bangalore, India"
      },
      feedback: "Exceptional depth in idempotency and concurrency controls using Redis locks.",
      recruiterNotes: "Top tier campus hire candidate. Release standard SDE-1 offer.",
      resumeAttached: "Alex_Chen_SWE_Resume_2025.pdf",
      coverNote: "Passionate about fintech systems and scalable payment pipelines."
    },
    {
      id: "app_3",
      studentId: "student_alex",
      jobId: "job_4",
      companyName: "Stripe",
      companyLogo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg",
      roleTitle: "Software Engineering Intern - Global Infrastructure",
      appliedDate: "2026-09-13",
      stage: "shortlisted",
      stageHistory: [
        { stage: "applied", date: "2026-09-13", note: "Application submitted" },
        { stage: "shortlisted", date: "2026-09-15", note: "Profile screened and invited to take-home technical practical" }
      ],
      nextAction: "Complete Stripe API take-home project by Sep 25, 2026",
      feedback: "Resume scored 91% on ATS. Impressive open-source whiteboard project.",
      recruiterNotes: "Solid engineering portfolio with real deployed links.",
      resumeAttached: "Alex_Chen_SWE_Resume_2025.pdf",
      coverNote: "Eager to contribute to Stripe's developer platforms and global APIs."
    },
    {
      id: "app_4",
      studentId: "student_alex",
      jobId: "job_6",
      companyName: "Zepto",
      companyLogo: "https://upload.wikimedia.org/wikipedia/commons/a/aa/Zepto_Logo.png",
      roleTitle: "Frontend SDE-1 - Dark Store & Consumer Apps",
      appliedDate: "2026-09-14",
      stage: "applied",
      stageHistory: [
        { stage: "applied", date: "2026-09-14", note: "Application submitted to Campus Drive" }
      ],
      nextAction: "Awaiting Campus Placement Cell verification & shortlisting",
      feedback: "In queue for initial review.",
      recruiterNotes: "Pending review.",
      resumeAttached: "Alex_Chen_SWE_Resume_2025.pdf",
      coverNote: "Experienced with Next.js and high performance web applications."
    },
    {
      id: "app_5",
      studentId: "student_priya",
      jobId: "job_7",
      companyName: "Google",
      companyLogo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
      roleTitle: "Machine Learning Engineer Intern - DeepMind & Research",
      appliedDate: "2026-09-10",
      stage: "technical_interview",
      stageHistory: [
        { stage: "applied", date: "2026-09-10", note: "Applied with IEEE publication credentials" },
        { stage: "shortlisted", date: "2026-09-12", note: "Direct shortlist due to published paper and 9.35 CGPA" },
        { stage: "technical_interview", date: "2026-09-15", note: "Technical Round 1 scheduled with Research Scientist" }
      ],
      nextAction: "Round 1 interview scheduled for Sep 24, 2026",
      feedback: "Outstanding background in medical imaging and PyTorch model architectures.",
      recruiterNotes: "Prime candidate for DeepMind campus intern.",
      resumeAttached: "Priya_Sharma_ML_Engineer_Resume.pdf",
      coverNote: "Eager to research multi-modal architectures and computer vision at scale."
    }
  ],

  placementStats: {
    totalStudents: 480,
    placedStudents: 412,
    placementRate: 85.8,
    averageCtc: "₹14.2 LPA",
    medianCtc: "₹12.0 LPA",
    highestCtc: "₹48.0 LPA",
    activeDrives: 28,
    offersReleased: 534,
    topRecruiters: [
      { name: "Google", count: 18, avgCtc: "₹31.5 LPA" },
      { name: "Microsoft", count: 24, avgCtc: "₹28.0 LPA" },
      { name: "Amazon", count: 32, avgCtc: "₹25.0 LPA" },
      { name: "Razorpay", count: 12, avgCtc: "₹23.0 LPA" },
      { name: "Atlassian", count: 8, avgCtc: "₹26.5 LPA" },
      { name: "Cisco", count: 22, avgCtc: "₹18.0 LPA" }
    ],
    domainDistribution: [
      { domain: "Full-Stack & Web Dev", percentage: 38 },
      { domain: "AI, ML & Data Science", percentage: 24 },
      { domain: "Cloud & DevOps", percentage: 16 },
      { domain: "Systems & Embedded", percentage: 12 },
      { domain: "Cybersecurity & InfoSec", percentage: 10 }
    ],
    inDemandSkills: [
      { skill: "Python", demand: 92, trend: "+14% YoY" },
      { skill: "TypeScript / React", demand: 89, trend: "+22% YoY" },
      { skill: "Docker & Kubernetes", demand: 84, trend: "+31% YoY" },
      { skill: "PostgreSQL & SQL", demand: 81, trend: "+10% YoY" },
      { skill: "PyTorch & Transformers", demand: 76, trend: "+45% YoY" },
      { skill: "Data Structures & Algos", demand: 98, trend: "Core Constant" }
    ]
  }
};
