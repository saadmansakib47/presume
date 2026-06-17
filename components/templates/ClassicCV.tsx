// components/templates/ClassicCV.tsx
import { CVData } from '@/lib/cv-types';
import { Mail, Phone, MapPin } from 'lucide-react';

const GithubIcon = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-800 shrink-0">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-800 shrink-0">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

interface Props {
  cvData: CVData;
}

export default function ClassicCV({ cvData }: Props) {
  const { personalInfo, summary, education, experience, projects, skills, achievements, languages, interests, references, showPhoto, enabledSections, themeColor } = cvData;
  const name = `${personalInfo.firstName} ${personalInfo.lastName}`.trim();
  const bannerBg = themeColor === 'blue' ? '#1A3A5C' : '#18181b';
  const sidebarBg = themeColor === 'blue' ? '#EAF0F7' : '#F4F4F5';
  const tagBg = themeColor === 'blue' ? '#dbeafe' : '#e4e4e7';
  const tagText = themeColor === 'blue' ? '#1e3a5f' : '#3f3f46';
  const tagBorder = themeColor === 'blue' ? '#bfdbfe' : '#d4d4d8';

  return (
    <div className="print-page w-full min-h-[297mm] bg-white text-zinc-800 p-0 shadow-lg border border-zinc-200 flex flex-col font-sans text-xs relative overflow-hidden" id="cv-preview-classic">
      {/* Top Banner Header */}
      <div className="text-white py-6 px-8 flex items-center min-h-[96px] justify-between z-10" style={{ backgroundColor: bannerBg }}>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight text-white font-sans">{name || 'Your Name'}</h1>
          <p className="text-sm text-zinc-400 font-medium mt-1">{personalInfo.headline || 'Professional Headline'}</p>
        </div>
      </div>

      {/* Two-Column Body */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <div className="w-[33%] border-r border-zinc-200 p-6 flex flex-col gap-6" style={{ backgroundColor: sidebarBg }}>
          {/* Photo */}
          {showPhoto && (
            <div className="flex justify-center -mt-12 mb-2 z-20">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white bg-zinc-200 shadow-md flex items-center justify-center">
                {personalInfo.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={personalInfo.photo} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-zinc-400 font-bold text-2xl">
                    {personalInfo.firstName[0]}{personalInfo.lastName[0]}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Contact */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-[10px] font-bold text-zinc-900 uppercase tracking-wider border-b border-zinc-200 pb-1">Contact</h3>
            
            {personalInfo.phone && (
              <div className="flex items-center gap-2 text-zinc-600">
                <Phone size={12} className="text-zinc-800 shrink-0" />
                <span className="break-all">{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.email && (
              <div className="flex items-center gap-2 text-zinc-600">
                <Mail size={12} className="text-zinc-800 shrink-0" />
                <span className="break-all">{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.linkedin && (
              <div className="flex items-center gap-2 text-zinc-600">
                <LinkedinIcon size={12} />
                <span className="break-all truncate">
                  {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}
                </span>
              </div>
            )}
            {personalInfo.github && (
              <div className="flex items-center gap-2 text-zinc-600">
                <GithubIcon size={12} />
                <span className="break-all truncate">
                  {personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
                </span>
              </div>
            )}
            {(personalInfo.address || personalInfo.location) && (
              <div className="flex items-center gap-2 text-zinc-600">
                <MapPin size={12} className="text-zinc-800 shrink-0" />
                <span>{[personalInfo.address, personalInfo.location].filter(Boolean).join(', ')}</span>
              </div>
            )}
          </div>

          {/* Skills */}
          {enabledSections.skills && skills.length > 0 && (
            <div className="flex flex-col gap-3">
              <h3 className="text-[10px] font-bold text-zinc-900 uppercase tracking-wider border-b border-zinc-200 pb-1">Skills</h3>
              {skills.map((cat, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  <span className="font-semibold text-[10px] text-zinc-800">{cat.category}</span>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {cat.skills.map((skill, sIdx) => (
                      <span style={{ backgroundColor: tagBg, color: tagText, border: `1px solid ${tagBorder}` }} className="text-[9px] px-1.5 py-0.5 rounded-[4px] font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Languages */}
          {enabledSections.languages && languages.length > 0 && (
            <div className="flex flex-col gap-2">
              <h3 className="text-[10px] font-bold text-zinc-900 uppercase tracking-wider border-b border-zinc-200 pb-1">Languages</h3>
              <div className="flex flex-col gap-1 text-zinc-600">
                {languages.map((lang, idx) => {
                  const parts = lang.split(/[—\-]/);
                  return (
                    <div key={idx} className="flex justify-between">
                      <span className="font-semibold text-zinc-800">{parts[0]?.trim()}</span>
                      {parts[1] && <span className="text-[10px] text-zinc-500">{parts[1]?.trim()}</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Interests */}
          {enabledSections.interests && interests.length > 0 && (
            <div className="flex flex-col gap-2">
              <h3 className="text-[10px] font-bold text-zinc-900 uppercase tracking-wider border-b border-zinc-200 pb-1">Interests</h3>
              <p className="text-zinc-600 leading-relaxed">{interests.join(' • ')}</p>
            </div>
          )}
        </div>

        {/* Right Main Column */}
        <div className="w-[67%] p-6 flex flex-col gap-5">
          {/* Profile */}
          {enabledSections.summary && summary?.trim() && (
            <div className="flex flex-col gap-1.5">
              <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider border-b border-zinc-200 pb-1">Profile</h2>
              <p className="text-zinc-600 leading-relaxed text-justify">{summary}</p>
            </div>
          )}

          {/* Education */}
          {enabledSections.education && education.length > 0 && (
            <div className="flex flex-col gap-2">
              <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider border-b border-zinc-200 pb-1">Education</h2>
              <div className="flex flex-col gap-3">
                {education.map((edu, idx) => (
                  <div key={idx} className="flex flex-col">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-zinc-900">{edu.degree}</span>
                      <span className="text-zinc-500 font-medium text-[10px]">{edu.dates}</span>
                    </div>
                    <div className="flex justify-between items-center text-zinc-600 mt-0.5">
                      <span>{edu.institution}</span>
                      {edu.gpa && <span className="text-[10px] font-medium text-zinc-700 bg-zinc-100 px-1 py-0.2 rounded border border-zinc-200">{edu.gpa}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {enabledSections.experience && experience.length > 0 && (
            <div className="flex flex-col gap-2.5">
              <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider border-b border-zinc-200 pb-1">Work Experience</h2>
              <div className="flex flex-col gap-3.5">
                {experience.map((exp, idx) => (
                  <div key={idx} className="flex flex-col">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-zinc-900">{exp.title}</span>
                      <span className="text-zinc-500 font-medium text-[10px]">{exp.dates}</span>
                    </div>
                    <span className="text-zinc-700 italic font-medium mt-0.5">{exp.organization}</span>
                    {exp.description && exp.description.length > 0 && (
                      <ul className="list-disc list-outside ml-4 mt-1.5 space-y-1 text-zinc-600 leading-relaxed">
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
            <div className="flex flex-col gap-2.5">
              <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider border-b border-zinc-200 pb-1">Projects</h2>
              <div className="flex flex-col gap-3">
                {projects.map((proj, idx) => (
                  <div key={idx} className="flex flex-col">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-zinc-900">{proj.title}</span>
                      {proj.dates && <span className="text-zinc-500 font-medium text-[10px]">{proj.dates}</span>}
                    </div>
                    {proj.description && proj.description.length > 0 && (
                      <ul className="list-disc list-outside ml-4 mt-1.5 space-y-1 text-zinc-600 leading-relaxed">
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
            <div className="flex flex-col gap-2">
              <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider border-b border-zinc-200 pb-1">Achievements & Volunteering</h2>
              <ul className="list-disc list-outside ml-4 space-y-1 text-zinc-600 leading-relaxed mt-1">
                {achievements.map((ach, idx) => (
                  <li key={idx}>{ach}</li>
                ))}
              </ul>
            </div>
          )}

          {/* References */}
          {enabledSections.references && references.length > 0 && (
            <div className="flex flex-col gap-2">
              <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider border-b border-zinc-200 pb-1">References</h2>
              <div className="grid grid-cols-2 gap-4 mt-1">
                {references.map((ref, idx) => (
                  <div key={idx} className="flex flex-col text-[10px] text-zinc-600">
                    <span className="font-bold text-zinc-900 text-xs">{ref.name}</span>
                    <span className="font-medium text-zinc-700 mt-0.5">{ref.title}</span>
                    {ref.phone && <span className="mt-0.5">Phone: {ref.phone}</span>}
                    {ref.email && <a href={`mailto:${ref.email}`} className="text-zinc-800 underline mt-0.5 font-medium">{ref.email}</a>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
