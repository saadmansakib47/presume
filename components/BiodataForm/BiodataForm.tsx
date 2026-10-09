// components/BiodataForm/BiodataForm.tsx
'use client';

import React, { useState } from 'react';
import {
  BiodataData,
  BiodataEducationEntry,
  BiodataOnlineLink,
  BiodataContactPerson,
  BiodataCustomSection,
} from '@/lib/cv-types';
import {
  Camera,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  User,
  GraduationCap,
  Briefcase,
  Users,
  Heart,
  Compass,
  Link as LinkIcon,
  Phone,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface Props {
  data: BiodataData;
  setData: React.Dispatch<React.SetStateAction<BiodataData>>;
}

const INPUT =
  'w-full bg-zinc-50 border border-zinc-200 rounded-[10px] px-3.5 py-2.5 text-sm transition focus:border-zinc-900 focus:bg-white focus:outline-none';
const TEXTAREA =
  'w-full bg-zinc-50 border border-zinc-200 rounded-[10px] px-3.5 py-2.5 text-sm transition focus:border-zinc-900 focus:bg-white focus:outline-none resize-y';
const LABEL = 'text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1';

export default function BiodataForm({ data, setData }: Props) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    toggles: false,
    personal: true,
    religion: true,
    education: true,
    career: true,
    family: true,
    aboutMe: true,
    lifestyle: true,
    partner: true,
    familyValues: true,
    online: true,
    contacts: true,
    custom: true,
  });

  const toggleAccordion = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // ── Personal Info ──────────────────────────────────────────────────────────
  const handlePersonalChange = (field: keyof BiodataData['personalInfo'], val: string) => {
    setData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: val },
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setData((prev) => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, photo: event.target!.result as string },
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, photo: '' },
    }));
  };

  // ── Toggle Section Visibility ──────────────────────────────────────────────
  const toggleSection = (section: keyof BiodataData['enabledSections']) => {
    setData((prev) => ({
      ...prev,
      enabledSections: {
        ...prev.enabledSections,
        [section]: !prev.enabledSections[section],
      },
    }));
  };

  // ── Education entries ──────────────────────────────────────────────────────
  const updateEducation = (index: number, field: keyof BiodataEducationEntry, val: string) => {
    setData((prev) => {
      const updated = [...prev.education];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, education: updated };
    });
  };

  const addEducation = () => {
    setData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { degree: '', institution: '', dates: '', thesis: '' },
      ],
    }));
  };

  const removeEducation = (index: number) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  // ── Online Presence ────────────────────────────────────────────────────────
  const updateOnlineLink = (index: number, field: keyof BiodataOnlineLink, val: string) => {
    setData((prev) => {
      const updated = [...prev.onlinePresence];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, onlinePresence: updated };
    });
  };

  const addOnlineLink = () => {
    setData((prev) => ({
      ...prev,
      onlinePresence: [
        ...prev.onlinePresence,
        { platform: 'LinkedIn', url: 'https://', displayUrl: '' },
      ],
    }));
  };

  const removeOnlineLink = (index: number) => {
    setData((prev) => ({
      ...prev,
      onlinePresence: prev.onlinePresence.filter((_, i) => i !== index),
    }));
  };

  // ── Contact Persons ────────────────────────────────────────────────────────
  const updateContact = (index: number, field: keyof BiodataContactPerson, val: string) => {
    setData((prev) => {
      const updated = [...prev.contactPersons];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, contactPersons: updated };
    });
  };

  const addContact = () => {
    setData((prev) => ({
      ...prev,
      contactPersons: [
        ...prev.contactPersons,
        { name: '', relation: '', phone: '' },
      ],
    }));
  };

  const removeContact = (index: number) => {
    setData((prev) => ({
      ...prev,
      contactPersons: prev.contactPersons.filter((_, i) => i !== index),
    }));
  };

  // ── Custom Sections ────────────────────────────────────────────────────────
  const updateCustomSection = (index: number, field: keyof BiodataCustomSection, val: string) => {
    setData((prev) => {
      const updated = [...prev.customSections];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, customSections: updated };
    });
  };

  const addCustomSection = () => {
    setData((prev) => ({
      ...prev,
      customSections: [
        ...prev.customSections,
        {
          id: `custom_${Date.now()}`,
          title: 'Additional Information',
          content: '',
        },
      ],
    }));
  };

  const removeCustomSection = (index: number) => {
    setData((prev) => ({
      ...prev,
      customSections: prev.customSections.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-5">

      {/* ── SECTION VISIBILITY CONTROLLER ──────────────────────────────────── */}
      <div className="bg-white rounded-[10px] border border-zinc-200 overflow-hidden shadow-sm">
        <button
          onClick={() => toggleAccordion('toggles')}
          className="w-full px-5 py-3.5 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between text-left transition border-b border-zinc-200"
        >
          <div className="flex items-center gap-2.5">
            <Sparkles size={16} className="text-zinc-600" />
            <div>
              <span className="font-extrabold text-xs text-zinc-900 uppercase tracking-wider block">
                Manage Sections & Visibility
              </span>
              <span className="text-[11px] text-zinc-400 font-medium">
                Enable, hide, or drop optional biodata sections
              </span>
            </div>
          </div>
          {openSections.toggles ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {openSections.toggles && (
          <div className="p-4 sm:p-5 space-y-3 bg-white">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 border border-zinc-150">
                <span className="font-semibold text-zinc-800">Personal Info</span>
                <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Required
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 border border-zinc-150">
                <span className="font-semibold text-zinc-800">Education</span>
                <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Required
                </span>
              </div>

              {[
                { key: 'religion', label: 'Religious Background' },
                { key: 'career', label: 'Profession & Career' },
                { key: 'family', label: 'Family Background' },
                { key: 'aboutMe', label: 'About Me' },
                { key: 'lifestyle', label: 'Lifestyle & Interests' },
                { key: 'partnerExpectations', label: 'Partner Expectations' },
                { key: 'familyValues', label: 'Family Values' },
                { key: 'onlinePresence', label: 'Online Presence' },
                { key: 'contactPersons', label: 'Contact Persons' },
              ].map(({ key, label }) => {
                const isEnabled = data.enabledSections[key as keyof BiodataData['enabledSections']];
                return (
                  <div
                    key={key}
                    onClick={() => toggleSection(key as keyof BiodataData['enabledSections'])}
                    className={`flex items-center justify-between p-2 rounded-lg border cursor-pointer transition select-none ${
                      isEnabled
                        ? 'bg-zinc-50 border-zinc-200 text-zinc-900'
                        : 'bg-zinc-100/50 border-zinc-200/60 text-zinc-400'
                    }`}
                  >
                    <span className="font-semibold">{label}</span>
                    <button
                      type="button"
                      className={`text-xs flex items-center gap-1 font-bold ${
                        isEnabled ? 'text-emerald-700' : 'text-zinc-400'
                      }`}
                    >
                      {isEnabled ? (
                        <>
                          <Eye size={13} /> Active
                        </>
                      ) : (
                        <>
                          <EyeOff size={13} /> Hidden
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── 1. PERSONAL INFORMATION (CORE) ─────────────────────────────────── */}
      <div className="bg-white p-5 sm:p-6 rounded-[10px] border border-zinc-200 space-y-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User size={16} className="text-zinc-700" />
            <h3 className="text-sm font-black tracking-tight uppercase text-zinc-950">
              Personal Information
            </h3>
          </div>
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
            Core Section
          </span>
        </div>

        {/* Photo Upload */}
        <div className="flex items-center gap-4 pb-2 border-b border-zinc-100">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border border-zinc-200 bg-zinc-100 flex items-center justify-center shrink-0">
            {data.personalInfo.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.personalInfo.photo}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <Camera size={20} className="text-zinc-400" />
            )}
          </div>
          <div className="space-y-1.5">
            <span className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
              Biodata Photo (Circular on LaTeX header)
            </span>
            <div className="flex gap-2">
              <label className="cursor-pointer bg-zinc-950 hover:bg-zinc-800 text-white px-3 py-1.5 rounded-[8px] text-xs font-bold transition shadow-sm inline-block">
                Upload Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
              {data.personalInfo.photo && (
                <button
                  type="button"
                  onClick={removePhoto}
                  className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-semibold px-2.5 py-1.5 rounded-[8px] hover:bg-red-50 transition border border-red-200/50"
                >
                  <Trash2 size={13} /> Remove
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Name & Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="sm:col-span-2">
            <label className={LABEL}>Full Name</label>
            <input
              type="text"
              value={data.personalInfo.fullName}
              onChange={(e) => handlePersonalChange('fullName', e.target.value)}
              placeholder="e.g. Rachel Evelyn Chen"
              className={INPUT}
            />
          </div>

          <div>
            <label className={LABEL}>Date of Birth</label>
            <input
              type="text"
              value={data.personalInfo.dateOfBirth}
              onChange={(e) => handlePersonalChange('dateOfBirth', e.target.value)}
              placeholder="e.g. 23 October 2002"
              className={INPUT}
            />
          </div>

          <div>
            <label className={LABEL}>Age</label>
            <input
              type="text"
              value={data.personalInfo.age}
              onChange={(e) => handlePersonalChange('age', e.target.value)}
              placeholder="e.g. 23 years"
              className={INPUT}
            />
          </div>

          <div>
            <label className={LABEL}>Height</label>
            <input
              type="text"
              value={data.personalInfo.height}
              onChange={(e) => handlePersonalChange('height', e.target.value)}
              placeholder="e.g. 5'3''"
              className={INPUT}
            />
          </div>

          <div>
            <label className={LABEL}>Blood Group</label>
            <input
              type="text"
              value={data.personalInfo.bloodGroup}
              onChange={(e) => handlePersonalChange('bloodGroup', e.target.value)}
              placeholder="e.g. O+"
              className={INPUT}
            />
          </div>

          <div>
            <label className={LABEL}>Marital Status</label>
            <input
              type="text"
              value={data.personalInfo.maritalStatus}
              onChange={(e) => handlePersonalChange('maritalStatus', e.target.value)}
              placeholder="e.g. Unmarried"
              className={INPUT}
            />
          </div>

          <div>
            <label className={LABEL}>Nationality</label>
            <input
              type="text"
              value={data.personalInfo.nationality}
              onChange={(e) => handlePersonalChange('nationality', e.target.value)}
              placeholder="e.g. Bangladeshi"
              className={INPUT}
            />
          </div>

          <div>
            <label className={LABEL}>Home District</label>
            <input
              type="text"
              value={data.personalInfo.homeDistrict}
              onChange={(e) => handlePersonalChange('homeDistrict', e.target.value)}
              placeholder="e.g. Chittagong"
              className={INPUT}
            />
          </div>

          <div>
            <label className={LABEL}>Current Residence</label>
            <input
              type="text"
              value={data.personalInfo.currentResidence}
              onChange={(e) => handlePersonalChange('currentResidence', e.target.value)}
              placeholder="e.g. Dhaka, Bangladesh"
              className={INPUT}
            />
          </div>
        </div>
      </div>

      {/* ── 2. RELIGIOUS BACKGROUND (OPTIONAL) ──────────────────────────────── */}
      {data.enabledSections.religion && (
        <div className="bg-white p-5 sm:p-6 rounded-[10px] border border-zinc-200 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-zinc-700" />
              <h3 className="text-sm font-black tracking-tight uppercase text-zinc-950">
                Religious Background
              </h3>
            </div>
            <button
              type="button"
              onClick={() => toggleSection('religion')}
              className="text-xs text-zinc-400 hover:text-red-600 transition flex items-center gap-1 font-semibold"
              title="Drop this section"
            >
              <Trash2 size={13} /> Drop Section
            </button>
          </div>

          <div>
            <label className={LABEL}>Religion / Denomination</label>
            <input
              type="text"
              value={data.religion}
              onChange={(e) => setData((prev) => ({ ...prev, religion: e.target.value }))}
              placeholder="e.g. Islam (Sunni)"
              className={INPUT}
            />
          </div>

          <div>
            <label className={LABEL}>Religious Practice & Values</label>
            <textarea
              rows={3}
              value={data.religiousPractice}
              onChange={(e) =>
                setData((prev) => ({ ...prev, religiousPractice: e.target.value }))
              }
              placeholder="Describe prayer habits, religious observance, or values..."
              className={TEXTAREA}
            />
          </div>
        </div>
      )}

      {/* ── 3. EDUCATION (CORE) ─────────────────────────────────────────────── */}
      <div className="bg-white p-5 sm:p-6 rounded-[10px] border border-zinc-200 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap size={16} className="text-zinc-700" />
            <h3 className="text-sm font-black tracking-tight uppercase text-zinc-950">
              Education
            </h3>
          </div>
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
            Core Section
          </span>
        </div>

        <div className="space-y-4">
          {data.education.map((edu, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-[10px] space-y-3 relative group"
            >
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  Degree #{idx + 1}
                </span>
                {data.education.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEducation(idx)}
                    className="text-zinc-400 hover:text-red-600 transition p-1"
                    title="Remove degree"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className={LABEL}>Degree / Certificate</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateEducation(idx, 'degree', e.target.value)}
                    placeholder="e.g. B.Sc. (Engg.) in Software Engineering"
                    className={INPUT}
                  />
                </div>
                <div>
                  <label className={LABEL}>Institution / Board</label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => updateEducation(idx, 'institution', e.target.value)}
                    placeholder="e.g. University Name"
                    className={INPUT}
                  />
                </div>
                <div>
                  <label className={LABEL}>Year / Duration</label>
                  <input
                    type="text"
                    value={edu.dates}
                    onChange={(e) => updateEducation(idx, 'dates', e.target.value)}
                    placeholder="e.g. 2022 – 2026"
                    className={INPUT}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={LABEL}>Thesis / Major / Academic Project (Optional)</label>
                  <input
                    type="text"
                    value={edu.thesis || ''}
                    onChange={(e) => updateEducation(idx, 'thesis', e.target.value)}
                    placeholder="e.g. Neural Networks for Medical Diagnosis"
                    className={INPUT}
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addEducation}
            className="w-full py-2.5 border-2 border-dashed border-zinc-200 hover:border-zinc-400 text-zinc-600 hover:text-zinc-900 rounded-[10px] text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <Plus size={14} /> Add Another Degree
          </button>
        </div>
      </div>

      {/* ── 4. PROFESSION & CAREER (OPTIONAL) ────────────────────────────────── */}
      {data.enabledSections.career && (
        <div className="bg-white p-5 sm:p-6 rounded-[10px] border border-zinc-200 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase size={16} className="text-zinc-700" />
              <h3 className="text-sm font-black tracking-tight uppercase text-zinc-950">
                Profession & Career
              </h3>
            </div>
            <button
              type="button"
              onClick={() => toggleSection('career')}
              className="text-xs text-zinc-400 hover:text-red-600 transition flex items-center gap-1 font-semibold"
              title="Drop this section"
            >
              <Trash2 size={13} /> Drop Section
            </button>
          </div>

          <div>
            <label className={LABEL}>Work Experience (Title, Org, Dates)</label>
            <textarea
              rows={3}
              value={data.careerExperience}
              onChange={(e) =>
                setData((prev) => ({ ...prev, careerExperience: e.target.value }))
              }
              placeholder="e.g. Software Engineer&#10;Google, Mountain View&#10;Jan 2023 – Present"
              className={TEXTAREA}
            />
          </div>

          <div>
            <label className={LABEL}>Current Status / Future Plans</label>
            <textarea
              rows={2}
              value={data.careerCurrentStatus}
              onChange={(e) =>
                setData((prev) => ({ ...prev, careerCurrentStatus: e.target.value }))
              }
              placeholder="e.g. Full-time employee; exploring opportunities in tech..."
              className={TEXTAREA}
            />
          </div>
        </div>
      )}

      {/* ── 5. FAMILY BACKGROUND (OPTIONAL) ─────────────────────────────────── */}
      {data.enabledSections.family && (
        <div className="bg-white p-5 sm:p-6 rounded-[10px] border border-zinc-200 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-zinc-700" />
              <h3 className="text-sm font-black tracking-tight uppercase text-zinc-950">
                Family Background
              </h3>
            </div>
            <button
              type="button"
              onClick={() => toggleSection('family')}
              className="text-xs text-zinc-400 hover:text-red-600 transition flex items-center gap-1 font-semibold"
              title="Drop this section"
            >
              <Trash2 size={13} /> Drop Section
            </button>
          </div>

          <div>
            <label className={LABEL}>Father's Details (Name & Occupation)</label>
            <textarea
              rows={2}
              value={data.fatherDetails}
              onChange={(e) =>
                setData((prev) => ({ ...prev, fatherDetails: e.target.value }))
              }
              placeholder="Father's Full Name&#10;Occupation and Organization"
              className={TEXTAREA}
            />
          </div>

          <div>
            <label className={LABEL}>Mother's Details (Name & Occupation)</label>
            <textarea
              rows={2}
              value={data.motherDetails}
              onChange={(e) =>
                setData((prev) => ({ ...prev, motherDetails: e.target.value }))
              }
              placeholder="Mother's Full Name&#10;Occupation"
              className={TEXTAREA}
            />
          </div>

          <div>
            <label className={LABEL}>Sibling(s) Details</label>
            <textarea
              rows={2}
              value={data.siblingDetails}
              onChange={(e) =>
                setData((prev) => ({ ...prev, siblingDetails: e.target.value }))
              }
              placeholder="Brief description of sibling(s) and their occupations..."
              className={TEXTAREA}
            />
          </div>
        </div>
      )}

      {/* ── 6. ABOUT ME (CORE / EDITABLE) ──────────────────────────────────── */}
      {data.enabledSections.aboutMe && (
        <div className="bg-white p-5 sm:p-6 rounded-[10px] border border-zinc-200 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User size={16} className="text-zinc-700" />
              <h3 className="text-sm font-black tracking-tight uppercase text-zinc-950">
                About Me
              </h3>
            </div>
            <button
              type="button"
              onClick={() => toggleSection('aboutMe')}
              className="text-xs text-zinc-400 hover:text-red-600 transition flex items-center gap-1 font-semibold"
              title="Drop this section"
            >
              <Trash2 size={13} /> Drop Section
            </button>
          </div>

          <div>
            <label className={LABEL}>Personal Narrative & Personality</label>
            <textarea
              rows={4}
              value={data.aboutMe}
              onChange={(e) => setData((prev) => ({ ...prev, aboutMe: e.target.value }))}
              placeholder="I enjoy learning, reading, exploring ideas... I tend to be quiet and reflective..."
              className={TEXTAREA}
            />
          </div>
        </div>
      )}

      {/* ── 7. LIFESTYLE & INTERESTS (OPTIONAL) ─────────────────────────────── */}
      {data.enabledSections.lifestyle && (
        <div className="bg-white p-5 sm:p-6 rounded-[10px] border border-zinc-200 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass size={16} className="text-zinc-700" />
              <h3 className="text-sm font-black tracking-tight uppercase text-zinc-950">
                Lifestyle & Interests
              </h3>
            </div>
            <button
              type="button"
              onClick={() => toggleSection('lifestyle')}
              className="text-xs text-zinc-400 hover:text-red-600 transition flex items-center gap-1 font-semibold"
              title="Drop this section"
            >
              <Trash2 size={13} /> Drop Section
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className={LABEL}>Interests / Hobbies</label>
              <input
                type="text"
                value={data.lifestyleInterests}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, lifestyleInterests: e.target.value }))
                }
                placeholder="e.g. Technology, reading, travelling"
                className={INPUT}
              />
            </div>

            <div>
              <label className={LABEL}>Lifestyle Preference</label>
              <input
                type="text"
                value={data.lifestyleDescription}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, lifestyleDescription: e.target.value }))
                }
                placeholder="e.g. Quiet, peaceful, frequent outings"
                className={INPUT}
              />
            </div>

            <div>
              <label className={LABEL}>Habits</label>
              <input
                type="text"
                value={data.lifestyleHabits}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, lifestyleHabits: e.target.value }))
                }
                placeholder="e.g. Non-smoker, health conscious"
                className={INPUT}
              />
            </div>

            <div>
              <label className={LABEL}>Approach to Life</label>
              <input
                type="text"
                value={data.lifestyleApproach}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, lifestyleApproach: e.target.value }))
                }
                placeholder="e.g. Friendly communication, rational thinking"
                className={INPUT}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── 8. LIFE PARTNER EXPECTATIONS (OPTIONAL) ─────────────────────────── */}
      {data.enabledSections.partnerExpectations && (
        <div className="bg-white p-5 sm:p-6 rounded-[10px] border border-zinc-200 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart size={16} className="text-zinc-700" />
              <h3 className="text-sm font-black tracking-tight uppercase text-zinc-950">
                Life Partner Expectations
              </h3>
            </div>
            <button
              type="button"
              onClick={() => toggleSection('partnerExpectations')}
              className="text-xs text-zinc-400 hover:text-red-600 transition flex items-center gap-1 font-semibold"
              title="Drop this section"
            >
              <Trash2 size={13} /> Drop Section
            </button>
          </div>

          <div>
            <label className={LABEL}>General Qualities & Character</label>
            <textarea
              rows={3}
              value={data.partnerExpectationsText}
              onChange={(e) =>
                setData((prev) => ({ ...prev, partnerExpectationsText: e.target.value }))
              }
              placeholder="Looking for someone with good character, compatible values, and respectful nature..."
              className={TEXTAREA}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className={LABEL}>Education Expectation</label>
              <input
                type="text"
                value={data.partnerEducation}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, partnerEducation: e.target.value }))
                }
                placeholder="e.g. Undergraduate / Bachelor's"
                className={INPUT}
              />
            </div>

            <div>
              <label className={LABEL}>Location Preference</label>
              <input
                type="text"
                value={data.partnerLocation}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, partnerLocation: e.target.value }))
                }
                placeholder="e.g. Open to any district"
                className={INPUT}
              />
            </div>

            <div>
              <label className={LABEL}>Career Expectation</label>
              <input
                type="text"
                value={data.partnerCareer}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, partnerCareer: e.target.value }))
                }
                placeholder="e.g. Flexible / Open to discussion"
                className={INPUT}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── 9. FAMILY VALUES (OPTIONAL) ─────────────────────────────────────── */}
      {data.enabledSections.familyValues && (
        <div className="bg-white p-5 sm:p-6 rounded-[10px] border border-zinc-200 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-zinc-700" />
              <h3 className="text-sm font-black tracking-tight uppercase text-zinc-950">
                Family Values
              </h3>
            </div>
            <button
              type="button"
              onClick={() => toggleSection('familyValues')}
              className="text-xs text-zinc-400 hover:text-red-600 transition flex items-center gap-1 font-semibold"
              title="Drop this section"
            >
              <Trash2 size={13} /> Drop Section
            </button>
          </div>

          <div>
            <label className={LABEL}>Perspective on Family & Marriage</label>
            <textarea
              rows={3}
              value={data.familyValues}
              onChange={(e) =>
                setData((prev) => ({ ...prev, familyValues: e.target.value }))
              }
              placeholder="Values a close, respectful family environment while giving space to grow individually..."
              className={TEXTAREA}
            />
          </div>
        </div>
      )}

      {/* ── 10. ONLINE PRESENCE (OPTIONAL) ──────────────────────────────────── */}
      {data.enabledSections.onlinePresence && (
        <div className="bg-white p-5 sm:p-6 rounded-[10px] border border-zinc-200 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LinkIcon size={16} className="text-zinc-700" />
              <h3 className="text-sm font-black tracking-tight uppercase text-zinc-950">
                Online Presence (Profiles)
              </h3>
            </div>
            <button
              type="button"
              onClick={() => toggleSection('onlinePresence')}
              className="text-xs text-zinc-400 hover:text-red-600 transition flex items-center gap-1 font-semibold"
              title="Drop this section"
            >
              <Trash2 size={13} /> Drop Section
            </button>
          </div>

          <div className="space-y-3">
            {data.onlinePresence.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row items-center gap-2 p-2.5 bg-zinc-50 border border-zinc-200 rounded-[10px]"
              >
                <div className="w-full sm:w-1/4">
                  <input
                    type="text"
                    value={item.platform}
                    onChange={(e) => updateOnlineLink(idx, 'platform', e.target.value)}
                    placeholder="Platform (e.g. Facebook)"
                    className={INPUT}
                  />
                </div>
                <div className="w-full sm:w-2/5">
                  <input
                    type="text"
                    value={item.url}
                    onChange={(e) => updateOnlineLink(idx, 'url', e.target.value)}
                    placeholder="Full URL (https://...)"
                    className={INPUT}
                  />
                </div>
                <div className="w-full sm:w-1/3">
                  <input
                    type="text"
                    value={item.displayUrl}
                    onChange={(e) => updateOnlineLink(idx, 'displayUrl', e.target.value)}
                    placeholder="Display text (e.g. fb.com/name)"
                    className={INPUT}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeOnlineLink(idx)}
                  className="text-zinc-400 hover:text-red-600 p-2 transition shrink-0"
                  title="Remove link"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addOnlineLink}
              className="w-full py-2 border-2 border-dashed border-zinc-200 hover:border-zinc-400 text-zinc-600 hover:text-zinc-900 rounded-[10px] text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <Plus size={14} /> Add Profile Link
            </button>
          </div>
        </div>
      )}

      {/* ── 11. FOR FURTHER COMMUNICATION (CONTACT PERSONS) ────────────────── */}
      {data.enabledSections.contactPersons && (
        <div className="bg-white p-5 sm:p-6 rounded-[10px] border border-zinc-200 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-zinc-700" />
              <h3 className="text-sm font-black tracking-tight uppercase text-zinc-950">
                Contact Persons (For Further Communication)
              </h3>
            </div>
            <button
              type="button"
              onClick={() => toggleSection('contactPersons')}
              className="text-xs text-zinc-400 hover:text-red-600 transition flex items-center gap-1 font-semibold"
              title="Drop this section"
            >
              <Trash2 size={13} /> Drop Section
            </button>
          </div>

          <div className="space-y-3">
            {data.contactPersons.map((person, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row items-center gap-2 p-2.5 bg-zinc-50 border border-zinc-200 rounded-[10px]"
              >
                <div className="w-full sm:w-2/5">
                  <input
                    type="text"
                    value={person.name}
                    onChange={(e) => updateContact(idx, 'name', e.target.value)}
                    placeholder="Contact Name"
                    className={INPUT}
                  />
                </div>
                <div className="w-full sm:w-1/4">
                  <input
                    type="text"
                    value={person.relation}
                    onChange={(e) => updateContact(idx, 'relation', e.target.value)}
                    placeholder="Relation (e.g. Father)"
                    className={INPUT}
                  />
                </div>
                <div className="w-full sm:w-1/3">
                  <input
                    type="text"
                    value={person.phone}
                    onChange={(e) => updateContact(idx, 'phone', e.target.value)}
                    placeholder="Phone number"
                    className={INPUT}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeContact(idx)}
                  className="text-zinc-400 hover:text-red-600 p-2 transition shrink-0"
                  title="Remove contact"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addContact}
              className="w-full py-2 border-2 border-dashed border-zinc-200 hover:border-zinc-400 text-zinc-600 hover:text-zinc-900 rounded-[10px] text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <Plus size={14} /> Add Contact Person
            </button>
          </div>
        </div>
      )}

      {/* ── 12. CUSTOM SECTIONS ─────────────────────────────────────────────── */}
      <div className="bg-white p-5 sm:p-6 rounded-[10px] border border-zinc-200 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-zinc-700" />
            <h3 className="text-sm font-black tracking-tight uppercase text-zinc-950">
              Custom Sections
            </h3>
          </div>
          <button
            type="button"
            onClick={addCustomSection}
            className="flex items-center gap-1 text-xs bg-zinc-950 hover:bg-zinc-800 text-white font-bold px-3 py-1.5 rounded-[8px] transition shadow-sm"
          >
            <Plus size={13} /> Add Custom Section
          </button>
        </div>

        {data.customSections.length === 0 ? (
          <p className="text-xs text-zinc-400 italic">
            No custom sections added. Click "+ Add Custom Section" to add any custom topic (e.g. Extracurricular, Ancestry, Dietary Preferences).
          </p>
        ) : (
          <div className="space-y-4">
            {data.customSections.map((sec, idx) => (
              <div
                key={sec.id}
                className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-[10px] space-y-2 relative"
              >
                <div className="flex justify-between items-center">
                  <label className={LABEL}>Section Title</label>
                  <button
                    type="button"
                    onClick={() => removeCustomSection(idx)}
                    className="text-zinc-400 hover:text-red-600 transition p-1"
                    title="Remove custom section"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <input
                  type="text"
                  value={sec.title}
                  onChange={(e) => updateCustomSection(idx, 'title', e.target.value)}
                  placeholder="e.g. Ancestry & Origins"
                  className={INPUT}
                />
                <label className={LABEL}>Content</label>
                <textarea
                  rows={3}
                  value={sec.content}
                  onChange={(e) => updateCustomSection(idx, 'content', e.target.value)}
                  placeholder="Write the details for this section..."
                  className={TEXTAREA}
                />
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
