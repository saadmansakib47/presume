// components/templates/ProgrammerCV.tsx
import { CVData } from '@/lib/cv-types';
import { Mail, Phone, Globe, MapPin } from 'lucide-react';

const GithubIcon = ({ size = 10 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-800 shrink-0">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 10 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-800 shrink-0">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

interface Props {
  cvData: CVData;
}

export default function ProgrammerCV({ cvData }: Props) {
  const { personalInfo, summary, education, experience, projects, skills, achievements, languages, interests, enabledSections, themeColor } = cvData;
  const name = `${personalInfo.firstName} ${personalInfo.lastName}`.trim();
  const accent = themeColor === 'blue' ? '#1A3A5C' : '#18181b';

  return (
    <div className="print-page w-full min-h-[297mm] bg-white text-zinc-800 p-8 shadow-lg border border-zinc-200 flex flex-col font-sans text-xs relative overflow-hidden" id="cv-preview-programmer">
      {/* Centered Header */}
      <div className="text-center border-b border-zinc-300 pb-4 mb-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 uppercase">{name || 'Your Name'}</h1>
        <p className="text-xs font-semibold text-zinc-600 mt-1 uppercase tracking-widest">{personalInfo.headline || 'Software Engineer'}</p>
        
        {/* Contact info list */}
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-[10px] text-zinc-600 mt-3 font-medium">
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <Mail size={10} className="text-zinc-800 shrink-0" />
              <a href={`mailto:${personalInfo.email}`} className="underline">{personalInfo.email}</a>
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <Phone size={10} className="text-zinc-800 shrink-0" />
              <span>{personalInfo.phone}</span>
            </span>
          )}
          {personalInfo.github && (
            <span className="flex items-center gap-1">
              <GithubIcon size={10} />
              <a href={personalInfo.github} target="_blank" rel="noreferrer" className="underline">
                {personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
              </a>
            </span>
          )}
          {personalInfo.linkedin && (
            <span className="flex items-center gap-1">
              <LinkedinIcon size={10} />
              <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="underline">
                {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}
              </a>
            </span>
          )}
          {personalInfo.portfolio && (
            <span className="flex items-center gap-1">
              <Globe size={10} className="text-zinc-800 shrink-0" />
              <a href={personalInfo.portfolio} target="_blank" rel="noreferrer" className="underline">
                {personalInfo.portfolio.replace(/^https?:\/\/(www\.)?/, '')}
              </a>
            </span>
          )}
          {(personalInfo.address || personalInfo.location) && (
            <span className="flex items-center gap-1">
              <MapPin size={10} className="text-zinc-800 shrink-0" />
              <span>{[personalInfo.address, personalInfo.location].filter(Boolean).join(', ')}</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Grid: Left Main (65%), Right Sidebar (32%) */}
      <div className="flex gap-6 flex-1">
        {/* Left Column (Core Content) */}
        <div className="w-[65%] flex flex-col gap-4">
          {/* Profile Summary */}
          {enabledSections.summary && summary?.trim() && (
            <div className="flex flex-col gap-1.5">
              <h2 className="text-[11px] font-extrabold uppercase tracking-wider pb-0.5" style={{ color: accent, borderBottom: `1.5px solid ${accent}` }}>Profile</h2>
              <p className="text-zinc-700 leading-relaxed text-justify">{summary}</p>
            </div>
          )}

          {/* Work Experience */}
          {enabledSections.experience && experience.length > 0 && (
            <div className="flex flex-col gap-2">
              <h2 className="text-[11px] font-extrabold uppercase tracking-wider pb-0.5" style={{ color: accent, borderBottom: `1.5px solid ${accent}` }}>Experience</h2>
              <div className="flex flex-col gap-3">
                {experience.map((exp, idx) => (
                  <div key={idx} className="flex flex-col">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-zinc-900 text-xs">{exp.title}</span>
                      <span className="text-zinc-500 font-bold text-[9px] uppercase">{exp.dates}</span>
                    </div>
                    <span className="text-zinc-700 font-medium text-[10px] mt-0.5">{exp.organization}</span>
                    {exp.description && exp.description.length > 0 && (
                      <ul className="list-disc list-outside ml-3.5 mt-1 space-y-0.5 text-zinc-600 leading-relaxed">
                        {exp.description.map((desc, dIdx) => (
                          <li key={dIdx}>{desc}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {enabledSections.projects && projects.length > 0 && (
            <div className="flex flex-col gap-2">
              <h2 className="text-[11px] font-extrabold uppercase tracking-wider pb-0.5" style={{ color: accent, borderBottom: `1.5px solid ${accent}` }}>Projects</h2>
              <div className="flex flex-col gap-3">
                {projects.map((proj, idx) => (
                  <div key={idx} className="flex flex-col">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-zinc-900 text-xs">{proj.title}</span>
                      {proj.dates && <span className="text-zinc-500 font-bold text-[9px] uppercase">{proj.dates}</span>}
                    </div>
                    {proj.description && proj.description.length > 0 && (
                      <ul className="list-disc list-outside ml-3.5 mt-1 space-y-0.5 text-zinc-600 leading-relaxed">
                        {proj.description.map((desc, dIdx) => (
                          <li key={dIdx}>{desc}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievements */}
          {enabledSections.achievements && achievements.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <h2 className="text-[11px] font-extrabold uppercase tracking-wider pb-0.5" style={{ color: accent, borderBottom: `1.5px solid ${accent}` }}>Achievements</h2>
              <ul className="list-disc list-outside ml-3.5 space-y-0.5 text-zinc-600 leading-relaxed mt-1">
                {achievements.map((ach, idx) => (
                  <li key={idx}>{ach}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Column (Sidebar) */}
        <div className="w-[32%] flex flex-col gap-4">
          {/* Skills */}
          {enabledSections.skills && skills.length > 0 && (
            <div className="flex flex-col gap-2">
              <h2 className="text-[11px] font-extrabold uppercase tracking-wider pb-0.5" style={{ color: accent, borderBottom: `1.5px solid ${accent}` }}>Skills</h2>
              <div className="flex flex-col gap-2.5">
                {skills.map((cat, idx) => (
                  <div key={idx} className="flex flex-col gap-0.5 text-zinc-700">
                    <span className="font-bold text-zinc-900 text-[10px] uppercase tracking-wide">{cat.category}</span>
                    <span className="leading-relaxed text-[10px]">{cat.skills.join(', ')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {enabledSections.education && education.length > 0 && (
            <div className="flex flex-col gap-2">
              <h2 className="text-[11px] font-extrabold uppercase tracking-wider pb-0.5" style={{ color: accent, borderBottom: `1.5px solid ${accent}` }}>Education</h2>
              <div className="flex flex-col gap-2.5">
                {education.map((edu, idx) => (
                  <div key={idx} className="flex flex-col text-zinc-700">
                    <span className="font-bold text-zinc-900">{edu.degree}</span>
                    <span className="text-[10px] font-medium text-zinc-600 mt-0.5">{edu.institution}</span>
                    <div className="flex justify-between items-center text-[9px] font-semibold text-zinc-500 mt-0.5">
                      <span>{edu.dates}</span>
                      {edu.gpa && <span>{edu.gpa}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {enabledSections.languages && languages.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <h2 className="text-[11px] font-extrabold uppercase tracking-wider pb-0.5" style={{ color: accent, borderBottom: `1.5px solid ${accent}` }}>Languages</h2>
              <div className="flex flex-col gap-1.5 text-zinc-700 font-medium">
                {languages.map((lang, idx) => {
                  const parts = lang.split(/[—\-]/);
                  return (
                    <div key={idx} className="flex justify-between">
                      <span>{parts[0]?.trim()}</span>
                      {parts[1] && <span className="text-[9px] text-zinc-500 font-semibold">{parts[1]?.trim()}</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Interests */}
          {enabledSections.interests && interests.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <h2 className="text-[11px] font-extrabold uppercase tracking-wider pb-0.5" style={{ color: accent, borderBottom: `1.5px solid ${accent}` }}>Interests</h2>
              <p className="text-zinc-700 leading-relaxed font-medium">{interests.join(', ')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
