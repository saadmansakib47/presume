// components/templates/DynamicHuntedCV.tsx
import { CVData } from '@/lib/cv-types';
import { CatalogTemplate } from '@/lib/template-hunter';
import { Mail, Phone, MapPin, Globe, ExternalLink, Calendar } from 'lucide-react';

const GithubIcon = ({ size = 11, className = "text-zinc-700" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 11, className = "text-zinc-700" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

interface Props {
  cvData: CVData;
  template: CatalogTemplate;
}

export default function DynamicHuntedCV({ cvData, template }: Props) {
  const {
    personalInfo,
    summary,
    education,
    experience,
    projects,
    skills,
    achievements,
    languages,
    interests,
    enabledSections,
    showPhoto,
  } = cvData;

  const style = template.layoutStyle || {
    layout: 'single-column',
    accentColor: '#1e3a8a',
    fontFamily: 'sans',
    headerAlignment: 'center',
    dividerStyle: 'solid-line',
    showPhoto: false,
  };

  const accentColor = style.accentColor || '#1e3a8a';
  const isSerif = style.fontFamily === 'serif';
  const isTwoColumn = style.layout === 'two-column-sidebar';
  const isBanner = style.layout === 'banner-header';
  const isCentered = style.headerAlignment === 'center';

  const fullName = `${personalInfo.firstName || ''} ${personalInfo.lastName || ''}`.trim() || 'Your Name';

  // Section Heading Component
  const SectionHeading = ({ title }: { title: string }) => {
    if (style.dividerStyle === 'shaded-box') {
      return (
        <div
          className="text-white text-[11px] font-bold uppercase tracking-wider px-2 py-1 mb-2.5 rounded-sm"
          style={{ backgroundColor: accentColor }}
        >
          {title}
        </div>
      );
    }
    return (
      <div className="mb-2">
        <h2
          className={`text-[12px] font-extrabold uppercase tracking-widest ${isSerif ? 'font-serif' : 'font-sans'}`}
          style={{ color: accentColor }}
        >
          {title}
        </h2>
        <div
          className="w-full h-[1.5px] mt-0.5 mb-2"
          style={{ backgroundColor: accentColor }}
        />
      </div>
    );
  };

  // Contact items row/list
  const ContactItems = ({ vertical = false }: { vertical?: boolean }) => (
    <div className={`flex ${vertical ? 'flex-col gap-1.5' : 'flex-wrap items-center justify-center gap-x-4 gap-y-1'} text-[10px] text-zinc-600 font-medium`}>
      {personalInfo.email && (
        <span className="flex items-center gap-1">
          <Mail size={10} style={{ color: accentColor }} />
          <span>{personalInfo.email}</span>
        </span>
      )}
      {personalInfo.phone && (
        <span className="flex items-center gap-1">
          <Phone size={10} style={{ color: accentColor }} />
          <span>{personalInfo.phone}</span>
        </span>
      )}
      {(personalInfo.location || personalInfo.address) && (
        <span className="flex items-center gap-1">
          <MapPin size={10} style={{ color: accentColor }} />
          <span>{personalInfo.location || personalInfo.address}</span>
        </span>
      )}
      {personalInfo.github && (
        <span className="flex items-center gap-1">
          <GithubIcon size={10} />
          <span>{personalInfo.github.replace(/^https?:\/\//, '')}</span>
        </span>
      )}
      {personalInfo.linkedin && (
        <span className="flex items-center gap-1">
          <LinkedinIcon size={10} />
          <span>{personalInfo.linkedin.replace(/^https?:\/\//, '')}</span>
        </span>
      )}
      {personalInfo.portfolio && (
        <span className="flex items-center gap-1">
          <Globe size={10} style={{ color: accentColor }} />
          <span>{personalInfo.portfolio.replace(/^https?:\/\//, '')}</span>
        </span>
      )}
    </div>
  );

  return (
    <div
      className={`print-page w-full pb-16 print:min-h-[297mm] print:pb-0 bg-white text-zinc-900 shadow-lg border border-zinc-200 flex flex-col text-xs relative overflow-hidden ${
        isSerif ? 'font-serif' : 'font-sans'
      }`}
      id={`cv-preview-${template.id}`}
    >
      {/* Template Stamp / Source Badge */}
      <div className="bg-zinc-50 border-b border-zinc-200 px-4 py-1 flex justify-between items-center text-[9px] text-zinc-400 font-semibold tracking-wider uppercase no-print">
        <span>Template: {template.name}</span>
        <span>Discovered from {template.author || template.sourceRepo || 'LaTeX'}  {template.engine}</span>
      </div>

      {/* ── BANNER HEADER ── */}
      {isBanner && (
        <div
          className="text-white px-8 py-6 mb-4 flex justify-between items-center"
          style={{ backgroundColor: accentColor }}
        >
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-white">{fullName}</h1>
            {personalInfo.headline && (
              <p className="text-xs text-zinc-200 font-medium tracking-wide mt-0.5">{personalInfo.headline}</p>
            )}
          </div>
          <div className="text-right text-[10px] space-y-0.5 text-zinc-200">
            {personalInfo.email && <p>{personalInfo.email}</p>}
            {personalInfo.phone && <p>{personalInfo.phone}</p>}
            {personalInfo.location && <p>{personalInfo.location}</p>}
          </div>
        </div>
      )}

      {/* ── STANDARD / CENTERED / LEFT HEADER ── */}
      {!isBanner && (
        <div className={`p-8 pb-3 ${isCentered ? 'text-center' : 'text-left'}`}>
          <h1
            className="text-2xl font-black uppercase tracking-tight"
            style={{ color: accentColor }}
          >
            {fullName}
          </h1>
          {personalInfo.headline && (
            <p className="text-xs font-semibold text-zinc-600 uppercase tracking-widest mt-1 mb-2">
              {personalInfo.headline}
            </p>
          )}
          <ContactItems />
          <div className="w-full h-[1px] bg-zinc-200 mt-3" />
        </div>
      )}

      {/* ── BODY ── */}
      {isTwoColumn ? (
        /* TWO-COLUMN SIDEBAR LAYOUT */
        <div className="flex flex-1 px-8 pb-8 gap-6">
          {/* Main Column */}
          <div className="flex-1 space-y-4">
            {enabledSections.summary && summary && (
              <div>
                <SectionHeading title="Summary" />
                <p className="text-[11px] text-zinc-700 leading-relaxed">{summary}</p>
              </div>
            )}

            {enabledSections.experience && experience.length > 0 && (
              <div>
                <SectionHeading title="Experience" />
                <div className="space-y-3">
                  {experience.map((exp, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-[11px] text-zinc-900">{exp.title}</span>
                        <span className="text-[10px] text-zinc-500 font-medium">{exp.dates}</span>
                      </div>
                      <div className="text-[10px] font-semibold text-zinc-600">{exp.organization}</div>
                      {exp.description && exp.description.length > 0 && (
                        <ul className="list-disc list-outside ml-3.5 space-y-0.5 text-[10.5px] text-zinc-700">
                          {exp.description.map((b, bIdx) => (
                            <li key={bIdx}>{b}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {enabledSections.projects && projects.length > 0 && (
              <div>
                <SectionHeading title="Projects" />
                <div className="space-y-3">
                  {projects.map((proj, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-[11px] text-zinc-900">{proj.title}</span>
                        <span className="text-[10px] text-zinc-500 font-medium">{proj.dates}</span>
                      </div>
                      {proj.description && proj.description.length > 0 && (
                        <ul className="list-disc list-outside ml-3.5 space-y-0.5 text-[10.5px] text-zinc-700">
                          {proj.description.map((b, bIdx) => (
                            <li key={bIdx}>{b}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-[32%] border-l border-zinc-200 pl-5 space-y-4">
            {enabledSections.education && education.length > 0 && (
              <div>
                <SectionHeading title="Education" />
                <div className="space-y-2.5">
                  {education.map((edu, idx) => (
                    <div key={idx} className="text-[10px]">
                      <div className="font-bold text-zinc-900">{edu.degree}</div>
                      <div className="text-zinc-600">{edu.institution}</div>
                      <div className="text-zinc-400">{edu.dates}</div>
                      {edu.gpa && <div className="text-zinc-500 font-medium">GPA: {edu.gpa}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {enabledSections.skills && skills.length > 0 && (
              <div>
                <SectionHeading title="Skills" />
                <div className="space-y-2">
                  {skills.map((cat, idx) => (
                    <div key={idx} className="text-[10px]">
                      <div className="font-bold text-zinc-800">{cat.category}</div>
                      <div className="text-zinc-600 leading-tight">{cat.skills.join(', ')}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {enabledSections.languages && languages.length > 0 && (
              <div>
                <SectionHeading title="Languages" />
                <p className="text-[10px] text-zinc-600 leading-tight">{languages.join('  ')}</p>
              </div>
            )}

            {enabledSections.interests && interests.length > 0 && (
              <div>
                <SectionHeading title="Interests" />
                <p className="text-[10px] text-zinc-600 leading-tight">{interests.join('  ')}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* SINGLE-COLUMN LAYOUT */
        <div className="px-8 pb-8 space-y-4 flex-1">
          {enabledSections.summary && summary && (
            <div>
              <SectionHeading title="Summary" />
              <p className="text-[11px] text-zinc-700 leading-relaxed">{summary}</p>
            </div>
          )}

          {enabledSections.experience && experience.length > 0 && (
            <div>
              <SectionHeading title="Experience" />
              <div className="space-y-3">
                {experience.map((exp, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex justify-between items-baseline">
                      <div>
                        <span className="font-bold text-[11px] text-zinc-900">{exp.title}</span>
                        <span className="text-[11px] text-zinc-600 font-semibold">  {exp.organization}</span>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-medium">{exp.dates}</span>
                    </div>
                    {exp.description && exp.description.length > 0 && (
                      <ul className="list-disc list-outside ml-3.5 space-y-0.5 text-[10.5px] text-zinc-700 mt-1">
                        {exp.description.map((b, bIdx) => (
                          <li key={bIdx}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {enabledSections.education && education.length > 0 && (
            <div>
              <SectionHeading title="Education" />
              <div className="space-y-2">
                {education.map((edu, idx) => (
                  <div key={idx} className="flex justify-between items-baseline text-[11px]">
                    <div>
                      <span className="font-bold text-zinc-900">{edu.degree}</span>
                      <span className="text-zinc-600">  {edu.institution}</span>
                      {edu.gpa && <span className="text-zinc-500 text-[10px]"> (GPA: {edu.gpa})</span>}
                    </div>
                    <span className="text-[10px] text-zinc-500 font-medium">{edu.dates}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {enabledSections.projects && projects.length > 0 && (
            <div>
              <SectionHeading title="Projects" />
              <div className="space-y-2.5">
                {projects.map((proj, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-[11px] text-zinc-900">{proj.title}</span>
                      <span className="text-[10px] text-zinc-500 font-medium">{proj.dates}</span>
                    </div>
                    {proj.description && proj.description.length > 0 && (
                      <ul className="list-disc list-outside ml-3.5 space-y-0.5 text-[10.5px] text-zinc-700">
                        {proj.description.map((b, bIdx) => (
                          <li key={bIdx}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {enabledSections.skills && skills.length > 0 && (
            <div>
              <SectionHeading title="Skills" />
              <div className="space-y-1">
                {skills.map((cat, idx) => (
                  <div key={idx} className="text-[10.5px] flex items-baseline gap-2">
                    <span className="font-bold text-zinc-800 shrink-0">{cat.category}:</span>
                    <span className="text-zinc-700">{cat.skills.join(', ')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {enabledSections.achievements && achievements && achievements.length > 0 && (
            <div>
              <SectionHeading title="Achievements" />
              <ul className="list-disc list-outside ml-3.5 space-y-0.5 text-[10.5px] text-zinc-700">
                {achievements.map((ach, idx) => (
                  <li key={idx}>{ach}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
