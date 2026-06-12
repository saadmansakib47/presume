// lib/cv-types.ts

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  headline: string;
  photo: string;
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

export interface CVData {
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
  };
}

export const defaultCVData: CVData = {
  personalInfo: {
    firstName: "Saadman",
    lastName: "Sakib",
    headline: "Aspiring Software Engineer",
    photo: "",
    address: "Dhaka, Bangladesh",
    phone: "(+880) 1617386902",
    email: "saadmansakib@iut-dhaka.edu",
    linkedin: "https://www.linkedin.com/in/saadman-sakib-4987a0285/",
    github: "https://github.com/saadmansakib47",
    portfolio: "",
    location: "Dhaka, Bangladesh",
  },
  summary: "Aspiring Software Engineer interested in backend development, software quality assurance, security research and technical writing.",
  education: [],
  experience: [],
  projects: [],
  skills: [],
  achievements: [],
  technicalWriting: [],
  languages: [],
  interests: [],
  problemSolving: "",
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
    technicalWriting: true,
    problemSolving: true,
  },
};