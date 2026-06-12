// components/CVForm/CVForm.tsx
'use client';

import { CVData } from '@/lib/cv-types';
import PersonalInfoForm from '@/components/CVForm/PersonalInfo';
import SectionToggles from '@/components/CVForm/SectionToggles';
import BasicSections from './BasicSections';

interface CVFormProps {
  cvData: CVData;
  setCvData: React.Dispatch<React.SetStateAction<CVData>>;
}

export default function CVForm({ cvData, setCvData }: CVFormProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-6">Build Your CV</h2>
        <PersonalInfoForm cvData={cvData} setCvData={setCvData} />
      </div>

      <SectionToggles cvData={cvData} setCvData={setCvData} />

      <BasicSections cvData={cvData} setCvData={setCvData} />
    </div>
  );
}