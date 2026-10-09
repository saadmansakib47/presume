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

// ─────────────────────────────────────────────────────────────────────────────
// BIODATA TYPES — Marriage Biodata
// ─────────────────────────────────────────────────────────────────────────────

export interface BiodataEducationEntry {
  degree: string;
  institution: string;
  dates: string;
  thesis?: string;
}

export interface BiodataPersonalInfo {
  fullName: string;
  dateOfBirth: string;
  age: string;
  height: string;
  bloodGroup: string;
  maritalStatus: string;
  nationality: string;
  homeDistrict: string;
  currentResidence: string;
  photo: string; // base64
}

export interface BiodataContactPerson {
  name: string;
  relation: string;
  phone: string;
}

export interface BiodataOnlineLink {
  platform: string;
  url: string;
  displayUrl: string;
}

export interface BiodataCustomSection {
  id: string;
  title: string;
  content: string;
}

export interface BiodataData {
  template: 'biodata';

  // Core identity
  personalInfo: BiodataPersonalInfo;

  // Required sections
  religion: string;
  religiousPractice: string;
  education: BiodataEducationEntry[];
  aboutMe: string;

  // Career
  careerExperience: string;   // free text (job title, org, dates)
  careerCurrentStatus: string;

  // Family
  fatherDetails: string;
  motherDetails: string;
  siblingDetails: string;

  // Lifestyle & Partner
  lifestyleInterests: string;
  lifestyleDescription: string;
  lifestyleHabits: string;
  lifestyleApproach: string;

  partnerExpectationsText: string;
  partnerEducation: string;
  partnerLocation: string;
  partnerCareer: string;

  // Family values
  familyValues: string;

  // Optional sections
  onlinePresence: BiodataOnlineLink[];
  contactPersons: BiodataContactPerson[];

  // User-added custom sections
  customSections: BiodataCustomSection[];

  // Section visibility
  enabledSections: {
    religion: boolean;
    career: boolean;
    family: boolean;
    aboutMe: boolean;
    lifestyle: boolean;
    partnerExpectations: boolean;
    familyValues: boolean;
    onlinePresence: boolean;    // optional
    contactPersons: boolean;   // optional
  };
}

export const defaultBiodataData: BiodataData = {
  template: 'biodata',

  personalInfo: {
    fullName: 'Your Full Name',
    dateOfBirth: '23 October 2002',
    age: '23 years',
    height: "5'3\"",
    bloodGroup: 'O+',
    maritalStatus: 'Unmarried',
    nationality: 'Bangladeshi',
    homeDistrict: 'Your Home District',
    currentResidence: 'Your City, Division',
    photo: '',
  },

  religion: 'Islam (Sunni)',
  religiousPractice: "Observes the five daily prayers and regularly recites the Qur'an. Has a strong interest in learning about Islam, the Seerah of the Prophet (PBUH), and Islamic history.",

  education: [
    {
      degree: 'B.Sc. (Engg.) in Software Engineering',
      institution: 'Your University Name',
      dates: '2022 – 2026',
      thesis: 'Your thesis or capstone project title here.',
    },
    {
      degree: 'Higher Secondary School Certificate (HSC)',
      institution: 'Your College Name',
      dates: '2021',
    },
    {
      degree: 'Secondary School Certificate (SSC)',
      institution: 'Your School Name',
      dates: '2019',
    },
  ],

  aboutMe: 'I am a graduate with a strong interest in technology and building practical things. I enjoy learning through projects, writing, reading, exploring ideas, and travelling. I tend to be quiet and reflective, and generally prefer a simple and peaceful lifestyle, while also enjoying frequent outings and discovering new places. I value mutual respect, personal growth, thoughtful communication, and a warm family environment.',

  careerExperience: 'Your Job Title\nYour Company Name, City\nMonth Year – Month Year',
  careerCurrentStatus: 'Recent graduate; currently exploring opportunities in software engineering, AI/ML, and intelligent systems.',

  fatherDetails: "Father's Full Name\nOccupation and Organization",
  motherDetails: "Mother's Full Name\nOccupation",
  siblingDetails: 'Brief description of sibling(s), e.g. one younger sister, currently pursuing undergraduate education.',

  lifestyleInterests: 'Technology, writing, reading, exploring new places.',
  lifestyleDescription: 'Prefers a quiet and simple lifestyle. Enjoys frequent outings to both natural and urban destinations.',
  lifestyleHabits: 'Non-smoker; does not consume alcohol.',
  lifestyleApproach: 'Prefers solving problems through friendly communication and thoughtful analysis.',

  partnerExpectationsText: 'Looking for someone with good character, compatible religious and lifestyle values, and a respectful and communicative nature. I value mutual respect, honesty, and a willingness to build a life together.',
  partnerEducation: 'HSC completed; preferably currently pursuing or having completed undergraduate education.',
  partnerLocation: 'Open to any district.',
  partnerCareer: 'Flexible; open to discussing future career plans together.',

  familyValues: 'Values a close, respectful family environment while believing that husband and wife should also have space to grow individually and make important decisions through mutual understanding.',

  onlinePresence: [
    { platform: 'Facebook', url: 'https://facebook.com/yourprofile', displayUrl: 'facebook.com/yourprofile' },
    { platform: 'GitHub', url: 'https://github.com/yourusername', displayUrl: 'github.com/yourusername' },
  ],

  contactPersons: [
    { name: "Father's Name", relation: 'Father', phone: '+880-XXXXXXXXXX' },
    { name: "Mother's Name", relation: 'Mother', phone: '+880-XXXXXXXXXX' },
  ],

  customSections: [],

  enabledSections: {
    religion: true,
    career: true,
    family: true,
    aboutMe: true,
    lifestyle: true,
    partnerExpectations: true,
    familyValues: true,
    onlinePresence: true,
    contactPersons: true,
  },
};