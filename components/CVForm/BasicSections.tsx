// components/CVForm/BasicSections.tsx
'use client';

import { CVData, EducationEntry, ExperienceEntry, ProjectEntry, SkillCategory, ReferenceEntry } from '@/lib/cv-types';
import { Plus, Trash } from 'lucide-react';
import React from 'react';

interface Props {
  cvData: CVData;
  setCvData: React.Dispatch<React.SetStateAction<CVData>>;
}

// ─── Shared class constants ───────────────────────────────────────────────────
const SECTION_CARD   = 'bg-white p-6 rounded-[10px] border border-zinc-200 space-y-4';
const SECTION_HEADER = 'flex justify-between items-center border-b border-zinc-100 pb-3';
const ENTRY_CARD     = 'bg-zinc-50 border border-zinc-200 p-4 rounded-[10px] space-y-3 relative';
const ADD_BTN        = 'bg-zinc-950 hover:bg-zinc-800 text-white px-3.5 py-1.5 rounded-[10px] text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer';
const DEL_BTN        = 'absolute top-4 right-4 text-zinc-400 hover:text-red-500 transition cursor-pointer';
const DEL_INLINE     = 'text-zinc-400 hover:text-red-500 p-2 transition shrink-0 cursor-pointer';
const INPUT          = 'w-full bg-white border border-zinc-200 rounded-[10px] px-3 py-2 text-sm transition focus:border-zinc-900';
const LABEL          = 'text-[10px] font-bold text-zinc-500 uppercase tracking-wider';
const EMPTY_MSG      = 'text-zinc-400 text-sm py-2 italic';
const INLINE_INPUT   = 'flex-1 bg-zinc-50 border border-zinc-200 rounded-[10px] px-3 py-2.5 text-sm transition focus:border-zinc-900';

export default function BasicSections({ cvData, setCvData }: Props) {

  // ─── Education Handlers ────────────────────────────────────────────────────
  const addEducation = () => {
    const newEdu: EducationEntry = { degree: '', institution: '', dates: '', gpa: '' };
    setCvData(prev => ({ ...prev, education: [...prev.education, newEdu] }));
  };
  const updateEducation = (index: number, field: keyof EducationEntry, value: string) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => i === index ? { ...edu, [field]: value } : edu)
    }));
  };
  const removeEducation = (index: number) => {
    setCvData(prev => ({ ...prev, education: prev.education.filter((_, i) => i !== index) }));
  };

  // ─── Experience Handlers ───────────────────────────────────────────────────
  const addExperience = () => {
    const newExp: ExperienceEntry = { title: '', organization: '', dates: '', description: [''] };
    setCvData(prev => ({ ...prev, experience: [...prev.experience, newExp] }));
  };
  const updateExperience = (index: number, field: 'title' | 'organization' | 'dates', value: string) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => i === index ? { ...exp, [field]: value } : exp)
    }));
  };
  const updateExperienceDescription = (index: number, value: string) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) =>
        i === index ? { ...exp, description: value.split('\n').filter(line => line.trim() !== '') } : exp
      )
    }));
  };
  const removeExperience = (index: number) => {
    setCvData(prev => ({ ...prev, experience: prev.experience.filter((_, i) => i !== index) }));
  };

  // ─── Projects Handlers ─────────────────────────────────────────────────────
  const addProject = () => {
    const newProj: ProjectEntry = { title: '', dates: '', description: [''] };
    setCvData(prev => ({ ...prev, projects: [...prev.projects, newProj] }));
  };
  const updateProject = (index: number, field: 'title' | 'dates', value: string) => {
    setCvData(prev => ({
      ...prev,
      projects: prev.projects.map((p, i) => i === index ? { ...p, [field]: value } : p)
    }));
  };
  const updateProjectDescription = (index: number, value: string) => {
    setCvData(prev => ({
      ...prev,
      projects: prev.projects.map((p, i) =>
        i === index ? { ...p, description: value.split('\n').filter(line => line.trim() !== '') } : p
      )
    }));
  };
  const removeProject = (index: number) => {
    setCvData(prev => ({ ...prev, projects: prev.projects.filter((_, i) => i !== index) }));
  };

  // ─── Skills Handlers ───────────────────────────────────────────────────────
  const addSkillCategory = () => {
    const newCat: SkillCategory = { category: '', skills: [] };
    setCvData(prev => ({ ...prev, skills: [...prev.skills, newCat] }));
  };
  const updateSkillCategory = (index: number, field: 'category' | 'skills', value: string | string[]) => {
    setCvData(prev => ({
      ...prev,
      skills: prev.skills.map((cat, i) => i === index ? { ...cat, [field]: value } : cat)
    }));
  };
  const removeSkillCategory = (index: number) => {
    setCvData(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== index) }));
  };

  // ─── Achievements Handlers ─────────────────────────────────────────────────
  const addAchievement = () => {
    setCvData(prev => ({ ...prev, achievements: [...prev.achievements, ''] }));
  };
  const updateAchievement = (index: number, value: string) => {
    setCvData(prev => ({
      ...prev,
      achievements: prev.achievements.map((a, i) => i === index ? value : a)
    }));
  };
  const removeAchievement = (index: number) => {
    setCvData(prev => ({ ...prev, achievements: prev.achievements.filter((_, i) => i !== index) }));
  };

  // ─── Languages Handlers ────────────────────────────────────────────────────
  const addLanguage = () => setCvData(prev => ({ ...prev, languages: [...prev.languages, ''] }));
  const updateLanguage = (index: number, value: string) => {
    setCvData(prev => ({
      ...prev,
      languages: prev.languages.map((l, i) => i === index ? value : l)
    }));
  };
  const removeLanguage = (index: number) => {
    setCvData(prev => ({ ...prev, languages: prev.languages.filter((_, i) => i !== index) }));
  };

  // ─── Interests Handlers ────────────────────────────────────────────────────
  const addInterest = () => setCvData(prev => ({ ...prev, interests: [...prev.interests, ''] }));
  const updateInterest = (index: number, value: string) => {
    setCvData(prev => ({
      ...prev,
      interests: prev.interests.map((int, i) => i === index ? value : int)
    }));
  };
  const removeInterest = (index: number) => {
    setCvData(prev => ({ ...prev, interests: prev.interests.filter((_, i) => i !== index) }));
  };

  // ─── References Handlers ───────────────────────────────────────────────────
  const addReference = () => {
    const newRef: ReferenceEntry = { name: '', title: '', phone: '', email: '' };
    setCvData(prev => ({ ...prev, references: [...prev.references, newRef] }));
  };
  const updateReference = (index: number, field: keyof ReferenceEntry, value: string) => {
    setCvData(prev => ({
      ...prev,
      references: prev.references.map((ref, i) => i === index ? { ...ref, [field]: value } : ref)
    }));
  };
  const removeReference = (index: number) => {
    setCvData(prev => ({ ...prev, references: prev.references.filter((_, i) => i !== index) }));
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* Work Experience */}
      {cvData.enabledSections.experience && (
        <div className={SECTION_CARD}>
          <div className={SECTION_HEADER}>
            <h3 className="text-base font-bold tracking-tight">Work Experience</h3>
            <button onClick={addExperience} className={ADD_BTN}>
              <Plus size={14} /> Add Job
            </button>
          </div>
          {cvData.experience.length === 0 && <p className={EMPTY_MSG}>No work experience added yet.</p>}
          <div className="space-y-4">
            {cvData.experience.map((exp, i) => (
              <div key={i} className={ENTRY_CARD}>
                <button onClick={() => removeExperience(i)} className={DEL_BTN} title="Remove Job">
                  <Trash size={15} />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                  <div className="space-y-1">
                    <label className={LABEL}>Job Title</label>
                    <input type="text" placeholder="e.g. Lead Developer" value={exp.title}
                      onChange={e => updateExperience(i, 'title', e.target.value)} className={INPUT} />
                  </div>
                  <div className="space-y-1">
                    <label className={LABEL}>Organization / Company</label>
                    <input type="text" placeholder="e.g. Acme Inc" value={exp.organization}
                      onChange={e => updateExperience(i, 'organization', e.target.value)} className={INPUT} />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className={LABEL}>Dates / Duration</label>
                    <input type="text" placeholder="e.g. June 2024 — Present" value={exp.dates}
                      onChange={e => updateExperience(i, 'dates', e.target.value)} className={INPUT} />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className={`${LABEL} flex justify-between`}>
                      <span>Description Points</span>
                      <span className="text-[9px] normal-case text-zinc-400">One bullet per line</span>
                    </label>
                    <textarea
                      placeholder={'Led a team of developers...\nReduced latency by 40%...'}
                      value={exp.description.join('\n')}
                      onChange={e => updateExperienceDescription(i, e.target.value)}
                      className={`${INPUT} h-24 font-sans`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {cvData.enabledSections.education && (
        <div className={SECTION_CARD}>
          <div className={SECTION_HEADER}>
            <h3 className="text-base font-bold tracking-tight">Education</h3>
            <button onClick={addEducation} className={ADD_BTN}>
              <Plus size={14} /> Add School
            </button>
          </div>
          {cvData.education.length === 0 && <p className={EMPTY_MSG}>No education entries added yet.</p>}
          <div className="space-y-4">
            {cvData.education.map((edu, i) => (
              <div key={i} className={ENTRY_CARD}>
                <button onClick={() => removeEducation(i)} className={DEL_BTN}>
                  <Trash size={15} />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                  <div className="space-y-1">
                    <label className={LABEL}>Degree / Program</label>
                    <input type="text" placeholder="e.g. B.Sc. in Computer Science" value={edu.degree}
                      onChange={e => updateEducation(i, 'degree', e.target.value)} className={INPUT} />
                  </div>
                  <div className="space-y-1">
                    <label className={LABEL}>Institution / School</label>
                    <input type="text" placeholder="e.g. Stanford University" value={edu.institution}
                      onChange={e => updateEducation(i, 'institution', e.target.value)} className={INPUT} />
                  </div>
                  <div className="space-y-1">
                    <label className={LABEL}>Dates / Duration</label>
                    <input type="text" placeholder="e.g. 2021 — 2025" value={edu.dates}
                      onChange={e => updateEducation(i, 'dates', e.target.value)} className={INPUT} />
                  </div>
                  <div className="space-y-1">
                    <label className={LABEL}>CGPA / Grade (Optional)</label>
                    <input type="text" placeholder="e.g. 3.90 / 4.00" value={edu.gpa || ''}
                      onChange={e => updateEducation(i, 'gpa', e.target.value)} className={INPUT} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {cvData.enabledSections.projects && (
        <div className={SECTION_CARD}>
          <div className={SECTION_HEADER}>
            <h3 className="text-base font-bold tracking-tight">Projects</h3>
            <button onClick={addProject} className={ADD_BTN}>
              <Plus size={14} /> Add Project
            </button>
          </div>
          {cvData.projects.length === 0 && <p className={EMPTY_MSG}>No projects added yet.</p>}
          <div className="space-y-4">
            {cvData.projects.map((proj, i) => (
              <div key={i} className={ENTRY_CARD}>
                <button onClick={() => removeProject(i)} className={DEL_BTN}>
                  <Trash size={15} />
                </button>
                <div className="grid grid-cols-1 gap-3 pr-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className={LABEL}>Project Title</label>
                      <input type="text" placeholder="e.g. ChatApp" value={proj.title}
                        onChange={e => updateProject(i, 'title', e.target.value)} className={INPUT} />
                    </div>
                    <div className="space-y-1">
                      <label className={LABEL}>Dates (Optional)</label>
                      <input type="text" placeholder="e.g. Autumn 2024" value={proj.dates || ''}
                        onChange={e => updateProject(i, 'dates', e.target.value)} className={INPUT} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className={`${LABEL} flex justify-between`}>
                      <span>Description Points</span>
                      <span className="text-[9px] normal-case text-zinc-400">One bullet per line</span>
                    </label>
                    <textarea
                      placeholder={'Designed real-time chat architecture...\nIntegrated WebSockets...'}
                      value={proj.description.join('\n')}
                      onChange={e => updateProjectDescription(i, e.target.value)}
                      className={`${INPUT} h-24 font-sans`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {cvData.enabledSections.skills && (
        <div className={SECTION_CARD}>
          <div className={SECTION_HEADER}>
            <h3 className="text-base font-bold tracking-tight">Skills</h3>
            <button onClick={addSkillCategory} className={ADD_BTN}>
              <Plus size={14} /> Add Category
            </button>
          </div>
          {cvData.skills.length === 0 && <p className={EMPTY_MSG}>No skill categories added yet.</p>}
          <div className="space-y-4">
            {cvData.skills.map((cat, i) => (
              <div key={i} className={ENTRY_CARD}>
                <button onClick={() => removeSkillCategory(i)} className={DEL_BTN}>
                  <Trash size={15} />
                </button>
                <div className="grid grid-cols-1 gap-3 pr-8">
                  <div className="space-y-1">
                    <label className={LABEL}>Category</label>
                    <input type="text" placeholder="e.g. Languages or Frameworks" value={cat.category}
                      onChange={e => updateSkillCategory(i, 'category', e.target.value)} className={INPUT} />
                  </div>
                  <div className="space-y-1">
                    <label className={LABEL}>Skills (comma separated)</label>
                    <input type="text" placeholder="e.g. Python, Go, C++, SQL" value={cat.skills.join(', ')}
                      onChange={e => updateSkillCategory(i, 'skills', e.target.value.split(',').map(s => s.trim()))}
                      className={INPUT} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      {cvData.enabledSections.achievements && (
        <div className={SECTION_CARD}>
          <div className={SECTION_HEADER}>
            <h3 className="text-base font-bold tracking-tight">Achievements</h3>
            <button onClick={addAchievement} className={ADD_BTN}>
              <Plus size={14} /> Add Item
            </button>
          </div>
          {cvData.achievements.length === 0 && <p className={EMPTY_MSG}>No achievements added yet.</p>}
          <div className="space-y-2">
            {cvData.achievements.map((ach, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input type="text" placeholder="e.g. Dean's Award — University, 2024" value={ach}
                  onChange={e => updateAchievement(i, e.target.value)} className={INLINE_INPUT} />
                <button onClick={() => removeAchievement(i)} className={DEL_INLINE}>
                  <Trash size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {cvData.enabledSections.languages && (
        <div className={SECTION_CARD}>
          <div className={SECTION_HEADER}>
            <h3 className="text-base font-bold tracking-tight">Languages</h3>
            <button onClick={addLanguage} className={ADD_BTN}>
              <Plus size={14} /> Add Language
            </button>
          </div>
          {cvData.languages.length === 0 && <p className={EMPTY_MSG}>No languages added yet.</p>}
          <div className="space-y-2">
            {cvData.languages.map((lang, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input type="text" placeholder="e.g. Bengali — Native" value={lang}
                  onChange={e => updateLanguage(i, e.target.value)} className={INLINE_INPUT} />
                <button onClick={() => removeLanguage(i)} className={DEL_INLINE}>
                  <Trash size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interests */}
      {cvData.enabledSections.interests && (
        <div className={SECTION_CARD}>
          <div className={SECTION_HEADER}>
            <h3 className="text-base font-bold tracking-tight">Interests</h3>
            <button onClick={addInterest} className={ADD_BTN}>
              <Plus size={14} /> Add Interest
            </button>
          </div>
          {cvData.interests.length === 0 && <p className={EMPTY_MSG}>No interests added yet.</p>}
          <div className="space-y-2">
            {cvData.interests.map((int, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input type="text" placeholder="e.g. Football or Teaching" value={int}
                  onChange={e => updateInterest(i, e.target.value)} className={INLINE_INPUT} />
                <button onClick={() => removeInterest(i)} className={DEL_INLINE}>
                  <Trash size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* References */}
      {cvData.enabledSections.references && (
        <div className={SECTION_CARD}>
          <div className={SECTION_HEADER}>
            <h3 className="text-base font-bold tracking-tight">References</h3>
            <button onClick={addReference} className={ADD_BTN}>
              <Plus size={14} /> Add Reference
            </button>
          </div>
          {cvData.references.length === 0 && <p className={EMPTY_MSG}>No references added yet.</p>}
          <div className="space-y-4">
            {cvData.references.map((ref, i) => (
              <div key={i} className={ENTRY_CARD}>
                <button onClick={() => removeReference(i)} className={DEL_BTN}>
                  <Trash size={15} />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                  <div className="space-y-1">
                    <label className={LABEL}>Reference Name</label>
                    <input type="text" placeholder="e.g. Dr. John Smith" value={ref.name}
                      onChange={e => updateReference(i, 'name', e.target.value)} className={INPUT} />
                  </div>
                  <div className="space-y-1">
                    <label className={LABEL}>Job Title & Institution</label>
                    <input type="text" placeholder="e.g. Professor at MIT" value={ref.title}
                      onChange={e => updateReference(i, 'title', e.target.value)} className={INPUT} />
                  </div>
                  <div className="space-y-1">
                    <label className={LABEL}>Phone</label>
                    <input type="text" placeholder="e.g. +1 617-000-0000" value={ref.phone}
                      onChange={e => updateReference(i, 'phone', e.target.value)} className={INPUT} />
                  </div>
                  <div className="space-y-1">
                    <label className={LABEL}>Email</label>
                    <input type="email" placeholder="e.g. jsmith@example.edu" value={ref.email}
                      onChange={e => updateReference(i, 'email', e.target.value)} className={INPUT} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}