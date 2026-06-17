// components/CVForm/PersonalInfo.tsx
'use client';

import { CVData } from '@/lib/cv-types';
import { Camera, Trash2 } from 'lucide-react';
import React from 'react';

interface Props {
  cvData: CVData;
  setCvData: React.Dispatch<React.SetStateAction<CVData>>;
}

const INPUT = 'w-full bg-zinc-50 border border-zinc-200 rounded-[10px] px-3.5 py-2.5 text-sm transition focus:border-zinc-900 focus:bg-white';
const LABEL = 'text-xs font-bold text-zinc-500 uppercase tracking-wider';

export default function PersonalInfoForm({ cvData, setCvData }: Props) {
  const { personalInfo, template, showPhoto } = cvData;

  const handleChange = (field: keyof typeof personalInfo, value: string) => {
    setCvData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCvData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, photo: event.target!.result as string }
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setCvData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, photo: '' }
    }));
  };

  return (
    <div className="bg-white p-6 rounded-[10px] border border-zinc-200 space-y-6">
      <h3 className="text-base font-bold tracking-tight">Personal Information</h3>

      {/* Photo upload — Classic template only */}
      {template === 'classic' && showPhoto && (
        <div className="flex items-center gap-5 pb-2">
          <div className="relative w-20 h-20 rounded-full overflow-hidden border border-zinc-200 bg-zinc-100 flex items-center justify-center shrink-0">
            {personalInfo.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={personalInfo.photo} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <Camera size={24} className="text-zinc-400" />
            )}
          </div>
          <div className="space-y-2">
            <span className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider">Profile Photo</span>
            <div className="flex gap-2">
              <label className="cursor-pointer bg-zinc-950 hover:bg-zinc-800 text-white px-3.5 py-1.5 rounded-[10px] text-xs font-bold transition shadow-sm">
                Upload Photo
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
              {personalInfo.photo && (
                <button
                  type="button"
                  onClick={removePhoto}
                  className="bg-red-50 hover:bg-red-100 text-red-600 px-3.5 py-1.5 rounded-[10px] text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 size={12} /> Remove
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Fields grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className={LABEL}>First Name</label>
          <input type="text" value={personalInfo.firstName} onChange={e => handleChange('firstName', e.target.value)}
            placeholder="John" className={INPUT} />
        </div>
        <div className="space-y-1.5">
          <label className={LABEL}>Last Name</label>
          <input type="text" value={personalInfo.lastName} onChange={e => handleChange('lastName', e.target.value)}
            placeholder="Doe" className={INPUT} />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <label className={LABEL}>Headline / Role</label>
          <input type="text" value={personalInfo.headline} onChange={e => handleChange('headline', e.target.value)}
            placeholder="Software Engineer | Public Health Professional" className={INPUT} />
        </div>
        <div className="space-y-1.5">
          <label className={LABEL}>Email</label>
          <input type="email" value={personalInfo.email} onChange={e => handleChange('email', e.target.value)}
            placeholder="johndoe@example.com" className={INPUT} />
        </div>
        <div className="space-y-1.5">
          <label className={LABEL}>Phone</label>
          <input type="text" value={personalInfo.phone} onChange={e => handleChange('phone', e.target.value)}
            placeholder="+1 (555) 000-0000" className={INPUT} />
        </div>
        <div className="space-y-1.5">
          <label className={LABEL}>Location</label>
          <input type="text" value={personalInfo.location} onChange={e => handleChange('location', e.target.value)}
            placeholder="San Francisco, CA" className={INPUT} />
        </div>
        <div className="space-y-1.5">
          <label className={LABEL}>LinkedIn URL</label>
          <input type="text" value={personalInfo.linkedin} onChange={e => handleChange('linkedin', e.target.value)}
            placeholder="https://linkedin.com/in/username" className={INPUT} />
        </div>
        <div className="space-y-1.5">
          <label className={LABEL}>GitHub URL</label>
          <input type="text" value={personalInfo.github} onChange={e => handleChange('github', e.target.value)}
            placeholder="https://github.com/username" className={INPUT} />
        </div>
        <div className="space-y-1.5">
          <label className={LABEL}>Portfolio URL <span className="normal-case text-zinc-400 font-medium">(optional)</span></label>
          <input type="text" value={personalInfo.portfolio} onChange={e => handleChange('portfolio', e.target.value)}
            placeholder="https://myportfolio.com" className={INPUT} />
        </div>
      </div>
    </div>
  );
}
