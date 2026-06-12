// components/CVForm/SectionToggles.tsx
'use client';

import { CVData } from '@/lib/cv-types';
import { Switch } from 'lucide-react'; // We'll use simple HTML toggles for now

interface Props {
  cvData: CVData;
  setCvData: React.Dispatch<React.SetStateAction<CVData>>;
}

export default function SectionToggles({ cvData, setCvData }: Props) {
  const toggleSection = (section: keyof CVData['enabledSections']) => {
    setCvData(prev => ({
      ...prev,
      enabledSections: {
        ...prev.enabledSections,
        [section]: !prev.enabledSections[section]
      }
    }));
  };

  return (
    <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
      <h3 className="font-medium text-lg mb-4">Show / Hide Sections</h3>
      <div className="grid grid-cols-2 gap-3">
        {Object.keys(cvData.enabledSections).map((key) => {
          const sectionKey = key as keyof CVData['enabledSections'];
          return (
            <label key={key} className="flex items-center justify-between bg-zinc-800 p-3 rounded-xl cursor-pointer hover:bg-zinc-700 transition">
              <span className="capitalize">{key}</span>
              <input
                type="checkbox"
                checked={cvData.enabledSections[sectionKey]}
                onChange={() => toggleSection(sectionKey)}
                className="w-5 h-5 accent-blue-600"
              />
            </label>
          );
        })}
      </div>
    </div>
  );
}