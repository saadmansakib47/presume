// components/CVForm/SectionToggles.tsx
'use client';

import { CVData } from '@/lib/cv-types';
import React from 'react';

interface Props {
  cvData: CVData;
  setCvData: React.Dispatch<React.SetStateAction<CVData>>;
}

const formatTitle = (key: string): string => {
  if (key === 'technicalWriting') return 'Technical Writing';
  if (key === 'problemSolving') return 'Problem Solving';
  return key.charAt(0).toUpperCase() + key.slice(1);
};

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

  const handleTogglePhoto = () => {
    setCvData(prev => ({ ...prev, showPhoto: !prev.showPhoto }));
  };

  return (
    <div className="bg-white p-6 rounded-[10px] border border-zinc-200 space-y-4">
      <h3 className="text-base font-bold tracking-tight">Show / Hide Sections</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {Object.keys(cvData.enabledSections).map((key) => {
          const sectionKey = key as keyof CVData['enabledSections'];
          return (
            <label
              key={key}
              className="flex items-center justify-between bg-zinc-50 border border-zinc-200 p-3 rounded-[10px] cursor-pointer hover:bg-zinc-100 transition select-none"
            >
              <span className="text-xs font-semibold text-zinc-700 capitalize">
                {formatTitle(key)}
              </span>
              <input
                type="checkbox"
                checked={cvData.enabledSections[sectionKey]}
                onChange={() => toggleSection(sectionKey)}
                className="w-4 h-4 rounded-[4px] border-zinc-300 accent-zinc-900 cursor-pointer"
              />
            </label>
          );
        })}

        {/* Photo toggle — Classic only */}
        {cvData.template === 'classic' && (
          <label className="flex items-center justify-between bg-zinc-50 border border-zinc-200 p-3 rounded-[10px] cursor-pointer hover:bg-zinc-100 transition select-none">
            <span className="text-xs font-semibold text-zinc-700">Profile Photo</span>
            <input
              type="checkbox"
              checked={cvData.showPhoto}
              onChange={handleTogglePhoto}
              className="w-4 h-4 rounded-[4px] border-zinc-300 accent-zinc-900 cursor-pointer"
            />
          </label>
        )}
      </div>
    </div>
  );
}