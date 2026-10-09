// components/BiodataForm/BiodataForm.tsx
'use client';

import React from 'react';
import {
  BiodataData,
  BiodataEducationEntry,
  BiodataOnlineLink,
  BiodataContactPerson,
  BiodataCustomSection,
} from '@/lib/cv-types';
import { Camera, Trash2, Plus } from 'lucide-react';

interface Props {
  data: BiodataData;
  setData: React.Dispatch<React.SetStateAction<BiodataData>>;
}

// ── Shared styling classes matching PersonalInfo & BasicSections ──────────────
const SECTION_CARD = 'bg-white p-6 rounded-[10px] border border-zinc-200 space-y-4';
const SECTION_HEADER = 'flex justify-between items-center border-b border-zinc-100 pb-3';
const ENTRY_CARD = 'bg-zinc-50 border border-zinc-200 p-4 rounded-[10px] space-y-3 relative';
const ADD_BTN = 'bg-zinc-950 hover:bg-zinc-800 text-white px-3.5 py-1.5 rounded-[10px] text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer';
const DEL_BTN = 'absolute top-4 right-4 text-zinc-400 hover:text-red-500 transition cursor-pointer';
const FORM_INPUT = 'w-full bg-zinc-50 border border-zinc-200 rounded-[10px] px-3.5 py-2.5 text-sm transition focus:border-zinc-900 focus:bg-white focus:outline-none';
const CARD_INPUT = 'w-full bg-white border border-zinc-200 rounded-[10px] px-3 py-2 text-sm transition focus:border-zinc-900 focus:outline-none';
const CARD_TEXTAREA = 'w-full bg-white border border-zinc-200 rounded-[10px] px-3 py-2 text-sm transition focus:border-zinc-900 focus:outline-none resize-y';
const FORM_TEXTAREA = 'w-full bg-zinc-50 border border-zinc-200 rounded-[10px] px-3.5 py-2.5 text-sm transition focus:border-zinc-900 focus:bg-white focus:outline-none resize-y';
const LABEL = 'text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1';
const CARD_LABEL = 'text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1';

export default function BiodataForm({ data, setData }: Props) {
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
    <div className="space-y-8">
      {/* ── 1. PERSONAL INFORMATION ───────────────────────────────────────── */}
      <div>
        <h2 className="text-xl font-black tracking-tight mb-6 uppercase">Build Your Biodata</h2>
        <div className="bg-white p-6 rounded-[10px] border border-zinc-200 space-y-6">
          <h3 className="text-base font-bold tracking-tight">Personal Information</h3>

          {/* Photo upload */}
          <div className="flex items-center gap-5 pb-2">
            <div className="relative w-20 h-20 rounded-full overflow-hidden border border-zinc-200 bg-zinc-100 flex items-center justify-center shrink-0">
              {data.personalInfo.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={data.personalInfo.photo}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera size={24} className="text-zinc-400" />
              )}
            </div>
            <div className="space-y-2">
              <span className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Photo
              </span>
              <div className="flex gap-2">
                <label className="cursor-pointer bg-zinc-950 hover:bg-zinc-800 text-white px-3.5 py-1.5 rounded-[10px] text-xs font-bold transition shadow-sm">
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
                    className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-semibold px-2 py-1 rounded-[8px] hover:bg-red-50 transition cursor-pointer"
                  >
                    <Trash2 size={13} /> Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Personal Info inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={LABEL}>Full Name</label>
              <input
                type="text"
                value={data.personalInfo.fullName}
                onChange={(e) => handlePersonalChange('fullName', e.target.value)}
                placeholder="e.g. Your Full Name"
                className={FORM_INPUT}
              />
            </div>

            <div>
              <label className={LABEL}>Date of Birth</label>
              <input
                type="text"
                value={data.personalInfo.dateOfBirth}
                onChange={(e) => handlePersonalChange('dateOfBirth', e.target.value)}
                placeholder="e.g. 23 October 2002"
                className={FORM_INPUT}
              />
            </div>

            <div>
              <label className={LABEL}>Age</label>
              <input
                type="text"
                value={data.personalInfo.age}
                onChange={(e) => handlePersonalChange('age', e.target.value)}
                placeholder="e.g. 23 years"
                className={FORM_INPUT}
              />
            </div>

            <div>
              <label className={LABEL}>Height</label>
              <input
                type="text"
                value={data.personalInfo.height}
                onChange={(e) => handlePersonalChange('height', e.target.value)}
                placeholder="e.g. 5'3''"
                className={FORM_INPUT}
              />
            </div>

            <div>
              <label className={LABEL}>Blood Group</label>
              <input
                type="text"
                value={data.personalInfo.bloodGroup}
                onChange={(e) => handlePersonalChange('bloodGroup', e.target.value)}
                placeholder="e.g. O+"
                className={FORM_INPUT}
              />
            </div>

            <div>
              <label className={LABEL}>Marital Status</label>
              <input
                type="text"
                value={data.personalInfo.maritalStatus}
                onChange={(e) => handlePersonalChange('maritalStatus', e.target.value)}
                placeholder="e.g. Unmarried"
                className={FORM_INPUT}
              />
            </div>

            <div>
              <label className={LABEL}>Nationality</label>
              <input
                type="text"
                value={data.personalInfo.nationality}
                onChange={(e) => handlePersonalChange('nationality', e.target.value)}
                placeholder="e.g. Bangladeshi"
                className={FORM_INPUT}
              />
            </div>

            <div>
              <label className={LABEL}>Home District</label>
              <input
                type="text"
                value={data.personalInfo.homeDistrict}
                onChange={(e) => handlePersonalChange('homeDistrict', e.target.value)}
                placeholder="e.g. Your Home District"
                className={FORM_INPUT}
              />
            </div>

            <div>
              <label className={LABEL}>Current Residence</label>
              <input
                type="text"
                value={data.personalInfo.currentResidence}
                onChange={(e) => handlePersonalChange('currentResidence', e.target.value)}
                placeholder="e.g. Your City, Division"
                className={FORM_INPUT}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. SHOW / HIDE SECTIONS (MATCHING SECTIONTOGGLES STYLE) ────────── */}
      <div className="bg-white p-6 rounded-[10px] border border-zinc-200 space-y-4">
        <h3 className="text-base font-bold tracking-tight">Show/Hide Sections</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
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
              <label
                key={key}
                className="flex items-center justify-between bg-zinc-50 border border-zinc-200 p-3 rounded-[10px] cursor-pointer hover:bg-zinc-100 transition select-none"
              >
                <span className="text-xs font-semibold text-zinc-700 capitalize">
                  {label}
                </span>
                <input
                  type="checkbox"
                  checked={isEnabled}
                  onChange={() => toggleSection(key as keyof BiodataData['enabledSections'])}
                  className="w-4 h-4 rounded-[4px] border-zinc-300 accent-zinc-900 cursor-pointer"
                />
              </label>
            );
          })}
        </div>
      </div>

      {/* ── 3. EDUCATION (CORE SECTION) ────────────────────────────────────── */}
      <div className={SECTION_CARD}>
        <div className={SECTION_HEADER}>
          <h3 className="text-base font-bold tracking-tight">Education</h3>
          <button type="button" onClick={addEducation} className={ADD_BTN}>
            <Plus size={14} /> Add
          </button>
        </div>

        <div className="space-y-4">
          {data.education.map((edu, idx) => (
            <div key={idx} className={ENTRY_CARD}>
              {data.education.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEducation(idx)}
                  className={DEL_BTN}
                  title="Remove degree"
                >
                  <Trash2 size={16} />
                </button>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className={CARD_LABEL}>Degree / Certificate</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateEducation(idx, 'degree', e.target.value)}
                    placeholder="e.g. B.Sc. (Engg.) in Software Engineering"
                    className={CARD_INPUT}
                  />
                </div>
                <div>
                  <label className={CARD_LABEL}>Institution / Board</label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => updateEducation(idx, 'institution', e.target.value)}
                    placeholder="e.g. Your University Name"
                    className={CARD_INPUT}
                  />
                </div>
                <div>
                  <label className={CARD_LABEL}>Year / Duration</label>
                  <input
                    type="text"
                    value={edu.dates}
                    onChange={(e) => updateEducation(idx, 'dates', e.target.value)}
                    placeholder="e.g. 2022 - 2026"
                    className={CARD_INPUT}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={CARD_LABEL}>Thesis / Capstone Project (Optional)</label>
                  <input
                    type="text"
                    value={edu.thesis || ''}
                    onChange={(e) => updateEducation(idx, 'thesis', e.target.value)}
                    placeholder="e.g. Your thesis or capstone project title"
                    className={CARD_INPUT}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4. RELIGIOUS BACKGROUND ────────────────────────────────────────── */}
      {data.enabledSections.religion && (
        <div className={SECTION_CARD}>
          <div className="border-b border-zinc-100 pb-3">
            <h3 className="text-base font-bold tracking-tight">Religious Background</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className={LABEL}>Religion / Denomination</label>
              <input
                type="text"
                value={data.religion}
                onChange={(e) => setData((prev) => ({ ...prev, religion: e.target.value }))}
                placeholder="e.g. Islam (Sunni)"
                className={FORM_INPUT}
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
                className={FORM_TEXTAREA}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── 5. PROFESSION & CAREER ─────────────────────────────────────────── */}
      {data.enabledSections.career && (
        <div className={SECTION_CARD}>
          <div className="border-b border-zinc-100 pb-3">
            <h3 className="text-base font-bold tracking-tight">Profession & Career</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className={LABEL}>Work Experience (Title, Org, Dates)</label>
              <textarea
                rows={3}
                value={data.careerExperience}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, careerExperience: e.target.value }))
                }
                placeholder="Job Title&#10;Company Name, City&#10;Dates"
                className={FORM_TEXTAREA}
              />
            </div>
            <div>
              <label className={LABEL}>Current Status / Future Plans</label>
              <input
                type="text"
                value={data.careerCurrentStatus}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, careerCurrentStatus: e.target.value }))
                }
                placeholder="e.g. Recent graduate; currently exploring opportunities in tech..."
                className={FORM_INPUT}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── 6. FAMILY BACKGROUND ────────────────────────────────────────────── */}
      {data.enabledSections.family && (
        <div className={SECTION_CARD}>
          <div className="border-b border-zinc-100 pb-3">
            <h3 className="text-base font-bold tracking-tight">Family Background</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className={LABEL}>Father&apos;s Details (Name & Occupation)</label>
              <textarea
                rows={2}
                value={data.fatherDetails}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, fatherDetails: e.target.value }))
                }
                placeholder="Father's Full Name&#10;Occupation and Organization"
                className={FORM_TEXTAREA}
              />
            </div>
            <div>
              <label className={LABEL}>Mother&apos;s Details (Name & Occupation)</label>
              <textarea
                rows={2}
                value={data.motherDetails}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, motherDetails: e.target.value }))
                }
                placeholder="Mother's Full Name&#10;Occupation"
                className={FORM_TEXTAREA}
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
                className={FORM_TEXTAREA}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── 7. ABOUT ME ─────────────────────────────────────────────────────── */}
      {data.enabledSections.aboutMe && (
        <div className={SECTION_CARD}>
          <div className="border-b border-zinc-100 pb-3">
            <h3 className="text-base font-bold tracking-tight">About Me</h3>
          </div>
          <div>
            <label className={LABEL}>Personal Narrative & Personality</label>
            <textarea
              rows={4}
              value={data.aboutMe}
              onChange={(e) => setData((prev) => ({ ...prev, aboutMe: e.target.value }))}
              placeholder="I enjoy learning, reading, exploring ideas... I tend to be quiet and reflective..."
              className={FORM_TEXTAREA}
            />
          </div>
        </div>
      )}

      {/* ── 8. LIFESTYLE & INTERESTS ────────────────────────────────────────── */}
      {data.enabledSections.lifestyle && (
        <div className={SECTION_CARD}>
          <div className="border-b border-zinc-100 pb-3">
            <h3 className="text-base font-bold tracking-tight">Lifestyle & Interests</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Interests / Hobbies</label>
              <input
                type="text"
                value={data.lifestyleInterests}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, lifestyleInterests: e.target.value }))
                }
                placeholder="e.g. Technology, writing, reading"
                className={FORM_INPUT}
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
                placeholder="e.g. Quiet, simple, frequent outings"
                className={FORM_INPUT}
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
                placeholder="e.g. Non-smoker, does not consume alcohol"
                className={FORM_INPUT}
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
                placeholder="e.g. Friendly communication, thoughtful analysis"
                className={FORM_INPUT}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── 9. LIFE PARTNER EXPECTATIONS ────────────────────────────────────── */}
      {data.enabledSections.partnerExpectations && (
        <div className={SECTION_CARD}>
          <div className="border-b border-zinc-100 pb-3">
            <h3 className="text-base font-bold tracking-tight">Life Partner Expectations</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className={LABEL}>General Expectations & Values</label>
              <textarea
                rows={3}
                value={data.partnerExpectationsText}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, partnerExpectationsText: e.target.value }))
                }
                placeholder="Looking for someone with good character, compatible religious and lifestyle values..."
                className={FORM_TEXTAREA}
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
                  className={FORM_INPUT}
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
                  className={FORM_INPUT}
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
                  className={FORM_INPUT}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 10. FAMILY VALUES ───────────────────────────────────────────────── */}
      {data.enabledSections.familyValues && (
        <div className={SECTION_CARD}>
          <div className="border-b border-zinc-100 pb-3">
            <h3 className="text-base font-bold tracking-tight">Family Values</h3>
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
              className={FORM_TEXTAREA}
            />
          </div>
        </div>
      )}

      {/* ── 11. ONLINE PRESENCE ─────────────────────────────────────────────── */}
      {data.enabledSections.onlinePresence && (
        <div className={SECTION_CARD}>
          <div className={SECTION_HEADER}>
            <h3 className="text-base font-bold tracking-tight">Online Presence</h3>
            <button type="button" onClick={addOnlineLink} className={ADD_BTN}>
              <Plus size={14} /> Add
            </button>
          </div>

          <div className="space-y-3">
            {data.onlinePresence.map((item, idx) => (
              <div key={idx} className={ENTRY_CARD}>
                <button
                  type="button"
                  onClick={() => removeOnlineLink(idx)}
                  className={DEL_BTN}
                  title="Remove profile link"
                >
                  <Trash2 size={16} />
                </button>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className={CARD_LABEL}>Platform</label>
                    <input
                      type="text"
                      value={item.platform}
                      onChange={(e) => updateOnlineLink(idx, 'platform', e.target.value)}
                      placeholder="e.g. Facebook, GitHub"
                      className={CARD_INPUT}
                    />
                  </div>
                  <div>
                    <label className={CARD_LABEL}>Profile URL</label>
                    <input
                      type="text"
                      value={item.url}
                      onChange={(e) => updateOnlineLink(idx, 'url', e.target.value)}
                      placeholder="https://..."
                      className={CARD_INPUT}
                    />
                  </div>
                  <div>
                    <label className={CARD_LABEL}>Display Text</label>
                    <input
                      type="text"
                      value={item.displayUrl}
                      onChange={(e) => updateOnlineLink(idx, 'displayUrl', e.target.value)}
                      placeholder="e.g. facebook.com/profile"
                      className={CARD_INPUT}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 12. FOR FURTHER COMMUNICATION ───────────────────────────────────── */}
      {data.enabledSections.contactPersons && (
        <div className={SECTION_CARD}>
          <div className={SECTION_HEADER}>
            <h3 className="text-base font-bold tracking-tight">For Further Communication</h3>
            <button type="button" onClick={addContact} className={ADD_BTN}>
              <Plus size={14} /> Add
            </button>
          </div>

          <div className="space-y-3">
            {data.contactPersons.map((person, idx) => (
              <div key={idx} className={ENTRY_CARD}>
                <button
                  type="button"
                  onClick={() => removeContact(idx)}
                  className={DEL_BTN}
                  title="Remove contact"
                >
                  <Trash2 size={16} />
                </button>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className={CARD_LABEL}>Contact Name</label>
                    <input
                      type="text"
                      value={person.name}
                      onChange={(e) => updateContact(idx, 'name', e.target.value)}
                      placeholder="e.g. Father's Name"
                      className={CARD_INPUT}
                    />
                  </div>
                  <div>
                    <label className={CARD_LABEL}>Relation</label>
                    <input
                      type="text"
                      value={person.relation}
                      onChange={(e) => updateContact(idx, 'relation', e.target.value)}
                      placeholder="e.g. Father"
                      className={CARD_INPUT}
                    />
                  </div>
                  <div>
                    <label className={CARD_LABEL}>Phone</label>
                    <input
                      type="text"
                      value={person.phone}
                      onChange={(e) => updateContact(idx, 'phone', e.target.value)}
                      placeholder="e.g. +880-XXXXXXXXXX"
                      className={CARD_INPUT}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 13. CUSTOM SECTIONS ─────────────────────────────────────────────── */}
      <div className={SECTION_CARD}>
        <div className={SECTION_HEADER}>
          <h3 className="text-base font-bold tracking-tight">Custom Sections</h3>
          <button type="button" onClick={addCustomSection} className={ADD_BTN}>
            <Plus size={14} /> Add
          </button>
        </div>

        {data.customSections.length === 0 ? (
          <p className="text-zinc-400 text-sm py-2 italic">
            No custom sections added yet. Click &quot;Add&quot; to include custom topics.
          </p>
        ) : (
          <div className="space-y-3">
            {data.customSections.map((sec, idx) => (
              <div key={sec.id} className={ENTRY_CARD}>
                <button
                  type="button"
                  onClick={() => removeCustomSection(idx)}
                  className={DEL_BTN}
                  title="Remove custom section"
                >
                  <Trash2 size={16} />
                </button>
                <div className="space-y-3">
                  <div>
                    <label className={CARD_LABEL}>Section Title</label>
                    <input
                      type="text"
                      value={sec.title}
                      onChange={(e) => updateCustomSection(idx, 'title', e.target.value)}
                      placeholder="e.g. Ancestry & Origins"
                      className={CARD_INPUT}
                    />
                  </div>
                  <div>
                    <label className={CARD_LABEL}>Content</label>
                    <textarea
                      rows={3}
                      value={sec.content}
                      onChange={(e) => updateCustomSection(idx, 'content', e.target.value)}
                      placeholder="Write the details for this custom section..."
                      className={CARD_TEXTAREA}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
