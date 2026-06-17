// lib/cv-types.ts

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  headline: string;
  photo: string; // Base64 encoded or path
  address: string;
  phone: string;
  email: string;
  linkedin: string;
  github: string;
  portfolio: string;
  location: string;
}

export interface EducationEntry {
  degree: string;
  institution: string;
  dates: string;
  gpa?: string;
}

export interface ExperienceEntry {
  title: string;
  organization: string;
  dates: string;
  description: string[];
}

export interface ProjectEntry {
  title: string;
  dates?: string;
  description: string[];
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface ReferenceEntry {
  name: string;
  title: string;
  phone: string;
  email: string;
}

export interface CVData {
  template: 'programmer' | 'classic';
  themeColor: 'black' | 'blue';
  personalInfo: PersonalInfo;
  summary: string;
  education: EducationEntry[];
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  skills: SkillCategory[];
  achievements: string[];
  technicalWriting: string[];
  languages: string[];
  interests: string[];
  problemSolving: string;
  references: ReferenceEntry[];

  showPhoto: boolean;
  showGPA: boolean;

  enabledSections: {
    summary: boolean;
    experience: boolean;
    projects: boolean;
    skills: boolean;
    education: boolean;
    achievements: boolean;
    languages: boolean;
    interests: boolean;
    technicalWriting: boolean;
    problemSolving: boolean;
    references: boolean;
  };
}

export const programmerDefaultCVData: CVData = {
  template: "programmer",
  themeColor: "black",
  personalInfo: {
    firstName: "Elon",
    lastName: "Musk",
    headline: "Software Engineer",
    photo: "",
    address: "San Francisco, CA",
    phone: "(+1) 415-000-0000",
    email: "elon.musk@example.com",
    linkedin: "https://www.linkedin.com/in/example-programmer",
    github: "https://github.com/example-programmer",
    portfolio: "https://example-programmer.dev",
    location: "San Francisco, CA",
  },
  summary: "Passionate software engineer with experience in distributed systems, backend infrastructure, and open-source development. Obsessed with clean code and high-impact engineering.",
  education: [
    {
      degree: "B.Sc. in Computer Science and Engineering",
      institution: "University of Pennsylvania",
      dates: "2020 — 2024",
      gpa: "3.90 / 4.00"
    }
  ],
  experience: [
    {
      title: "Software Engineer Intern",
      organization: "Acme Technologies",
      dates: "June 2023 — August 2023",
      description: [
        "Designed and implemented secure REST APIs for a high-throughput messaging platform.",
        "Refactored legacy query logic, reducing database search latency by 35%.",
        "Collaborated with SQA teams to write automated integration tests covering 90% of endpoint permutations."
      ]
    }
  ],
  projects: [
    {
      title: "Presume — Resume Builder",
      dates: "2026",
      description: [
        "A minimalistic LaTeX resume builder featuring a high-contrast B&W design system and a local Print-to-PDF engine.",
        "Engineered modular React architecture with instant synchronisation and dynamic form rendering."
      ]
    }
  ],
  skills: [
    { category: "Languages", skills: ["TypeScript", "JavaScript", "Go", "Python", "SQL"] },
    { category: "Frameworks & Tools", skills: ["Next.js", "React", "Node.js", "Docker", "Git", "LaTeX"] }
  ],
  achievements: [
    "Dean's Honor List — University of Pennsylvania, 2023",
    "Top 50 — National Collegiate Programming Contest, 2022"
  ],
  technicalWriting: [],
  languages: ["English (Native)", "Spanish (Conversational)"],
  interests: ["Distributed Systems", "Technical Writing", "Open Source"],
  problemSolving: "",
  references: [],
  showPhoto: false,
  showGPA: true,
  enabledSections: {
    summary: true,
    experience: true,
    projects: true,
    skills: true,
    education: true,
    achievements: true,
    languages: true,
    interests: true,
    technicalWriting: false,
    problemSolving: false,
    references: false,
  },
};

export const classicDefaultCVData: CVData = {
  template: "classic",
  themeColor: "blue",
  personalInfo: {
    firstName: "Mark",
    lastName: "Zuckerberg",
    headline: "Public Health Professional",
    photo: "",
    address: "Boston, MA",
    phone: "+1 617-000-0000",
    email: "mark.z@example.com",
    linkedin: "https://linkedin.com/in/example-classic",
    github: "",
    portfolio: "",
    location: "Boston, MA",
  },
  summary: "Dedicated public health graduate with hands-on experience in community health advisory, research, and event leadership. Passionate about evidence-based health initiatives and cross-community communication.",
  education: [
    {
      degree: "B.Sc. in Public Health",
      institution: "Harvard University",
      dates: "Sep 2021 — Present",
      gpa: "3.89 / 4.00"
    },
    {
      degree: "High School Diploma — Science",
      institution: "Boston Latin School",
      dates: "2021",
      gpa: "4.00 / 4.00"
    }
  ],
  experience: [
    {
      title: "Health Advisor",
      organization: "Community Health Initiative",
      dates: "Ongoing",
      description: [
        "Guide 50+ students on health awareness and lifestyle practices.",
        "Support community outreach strategy and programme planning."
      ]
    },
    {
      title: "Active Member — Public Health Club",
      organization: "Harvard University",
      dates: "Ongoing",
      description: [
        "Organise community awareness events and health campaigns.",
        "Led event coordination for the annual Public Health Symposium."
      ]
    }
  ],
  projects: [
    {
      title: "Lifestyle Choices & Health Outcome Investigation",
      dates: "2024",
      description: [
        "Conducted a mixed-method study on lifestyle choices, reproductive health, and self-examination awareness among undergraduates.",
        "Personal Hygiene Knowledge & Practices among School-Going Children: A Cross-Sectional Study."
      ]
    }
  ],
  skills: [
    { category: "Software", skills: ["MS Word", "MS Excel", "SPSS", "Tableau"] },
    { category: "Soft Skills", skills: ["Critical Thinking", "Communication", "Leadership", "Teamwork"] }
  ],
  achievements: [
    "Dean's Award — Harvard University, Fall 2023",
    "Public Health Champions Award — Fall 2024",
    "1st Runners-Up — World Diabetes Day Quiz, 2025"
  ],
  technicalWriting: [],
  languages: ["English — Native", "French — Conversational"],
  interests: ["Teaching", "Reading", "Football"],
  problemSolving: "",
  references: [
    {
      name: "Dr. Alice Johnson",
      title: "Head, Dept. of Public Health, Harvard",
      phone: "+1 617-000-0001",
      email: "alice.johnson@example.edu"
    },
    {
      name: "Dr. Robert Chen",
      title: "Asst. Professor, Public Health, Harvard",
      phone: "+1 617-000-0002",
      email: "robert.chen@example.edu"
    }
  ],
  showPhoto: true,
  showGPA: true,
  enabledSections: {
    summary: true,
    experience: true,
    projects: true,
    skills: true,
    education: true,
    achievements: true,
    languages: true,
    interests: true,
    technicalWriting: false,
    problemSolving: false,
    references: true,
  },
};

// Default export can be programmer as initial fallback
export const defaultCVData: CVData = programmerDefaultCVData;