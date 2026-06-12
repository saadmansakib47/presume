// components/CVForm/BasicSections.tsx
'use client';

import { CVData, EducationEntry, ProjectEntry } from '@/lib/cv-types';

interface Props {
  cvData: CVData;
  setCvData: React.Dispatch<React.SetStateAction<CVData>>;
}

export default function BasicSections({ cvData, setCvData }: Props) {
  const addEducation = () => {
    const newEdu: EducationEntry = {
      degree: "",
      institution: "",
      dates: "",
      gpa: ""
    };
    setCvData(prev => ({
      ...prev,
      education: [...prev.education, newEdu]
    }));
  };

  const updateEducation = (index: number, field: keyof EducationEntry, value: string) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (index: number) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  // Similar for Projects
  const addProject = () => {
    const newProj: ProjectEntry = {
      title: "",
      dates: "",
      description: [""]
    };
    setCvData(prev => ({
      ...prev,
      projects: [...prev.projects, newProj]
    }));
  };

  const updateProject = (index: number, field: 'title' | 'dates', value: string) => {
    setCvData(prev => ({
      ...prev,
      projects: prev.projects.map((p, i) =>
        i === index ? { ...p, [field]: value } : p
      )
    }));
  };

  return (
    <div className="space-y-8">
      {/* Education Section */}
      <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-lg">Education</h3>
          <button onClick={addEducation} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm">
            + Add Education
          </button>
        </div>

        {cvData.education.map((edu, index) => (
          <div key={index} className="bg-zinc-800 p-5 rounded-xl mb-4">
            <input
              placeholder="Degree (e.g. BSc in Software Engineering)"
              value={edu.degree}
              onChange={(e) => updateEducation(index, 'degree', e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 mb-3"
            />
            <input
              placeholder="Institution"
              value={edu.institution}
              onChange={(e) => updateEducation(index, 'institution', e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 mb-3"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder="Dates (e.g. 2022 - Present)"
                value={edu.dates}
                onChange={(e) => updateEducation(index, 'dates', e.target.value)}
                className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3"
              />
              <input
                placeholder="CGPA (optional)"
                value={edu.gpa || ''}
                onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3"
              />
            </div>
            <button onClick={() => removeEducation(index)} className="text-red-500 text-sm mt-3 hover:underline">
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Projects Section */}
      <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-lg">Projects</h3>
          <button onClick={addProject} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm">
            + Add Project
          </button>
        </div>

        {cvData.projects.map((proj, index) => (
          <div key={index} className="bg-zinc-800 p-5 rounded-xl mb-4">
            <input
              placeholder="Project Title"
              value={proj.title}
              onChange={(e) => updateProject(index, 'title', e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 mb-3"
            />
            <input
              placeholder="Dates (optional)"
              value={proj.dates || ''}
              onChange={(e) => updateProject(index, 'dates', e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 mb-3"
            />
            <textarea
              placeholder="Project Description (you can add multiple lines)"
              value={proj.description.join('\n')}
              onChange={(e) => {
                setCvData(prev => ({
                  ...prev,
                  projects: prev.projects.map((p, i) =>
                    i === index ? { ...p, description: e.target.value.split('\n') } : p
                  )
                }));
              }}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 h-24"
            />
          </div>
        ))}
      </div>
    </div>
  );
}