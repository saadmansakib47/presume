export interface PersonalInfo {
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  github?: string;
  linkedin?: string;
  portfolio?: string;
  photo?: string; // base64 or url (optional)
}

export interface Education {
  degree: string;
  institution: string;
  dates: string;
  gpa?: string;
}

export interface Project {
  title: string;
  description: string;
  technologies?: string;
  link?: string;
}

export interface SkillCategory {
  category: string;
  skills: string;
}

export interface CVData {
  personal: PersonalInfo;
  summary: string;
  education: Education[];
  projects: Project[];
  skills: SkillCategory[];
  achievements: string[];
  technicalWriting?: string;
  languages?: string[];
  interests?: string[];
  showPhoto: boolean;
  showSummary: boolean;
  showAchievements: boolean;
  showTechnicalWriting: boolean;
  showLanguages: boolean;
  showInterests: boolean;
}