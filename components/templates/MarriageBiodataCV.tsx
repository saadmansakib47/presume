// components/templates/MarriageBiodataCV.tsx
'use client';

import React from 'react';
import { BiodataData } from '@/lib/cv-types';

interface Props {
  data: BiodataData;
}

// ── Design tokens matching the LaTeX template ────────────────────────────────
const ACCENT = '#3F5F49';
const CHARCOAL = '#292A28';
const SOFTGRAY = '#666864';
const RULEGRAY = '#D9DBD7';
const BGSOFT = '#FCFBF8';

function SectionTitle({ title }: { title: string }) {
  return (
    <div style={{ marginTop: '10px', marginBottom: '5px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 700,
          fontSize: '7.2px',
          letterSpacing: '0.1em',
          color: ACCENT,
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}>
          {title}
        </span>
        <div style={{ flex: 1, borderTop: `0.5px solid ${RULEGRAY}`, marginTop: '1px' }} />
      </div>
    </div>
  );
}

function BoldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      fontFamily: "'Lato', sans-serif",
      fontWeight: 700,
      fontSize: '8px',
      color: CHARCOAL,
    }}>
      {children}
    </span>
  );
}

function BodyText({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <span style={{
      fontFamily: "'Lato', sans-serif",
      fontSize: '8px',
      color: SOFTGRAY,
      lineHeight: '1.45',
      wordBreak: 'break-word',
      ...style,
    }}>
      {children}
    </span>
  );
}

export default function MarriageBiodataCV({ data }: Props) {
  const pi = data.personalInfo;
  const es = data.enabledSections;

  return (
    <div
      className="print-page w-full"
      style={{
        backgroundColor: BGSOFT,
        color: CHARCOAL,
        fontFamily: "'Lato', sans-serif",
        fontSize: '8.5px',
        lineHeight: '1.45',
        padding: '18px 22px',
        paddingBottom: '2in',
        width: '100%',
        maxWidth: '210mm',
        margin: '0 auto',
        boxSizing: 'border-box',
      }}
    >
      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: '6.5px', color: ACCENT, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px' }}>
            Marriage Resume
          </div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: '26px', fontWeight: 400, color: CHARCOAL, lineHeight: 1, wordBreak: 'break-word' }}>
            {pi.fullName || 'Your Full Name'}
          </div>
        </div>

        {/* Photo circular avatar frame */}
        <div style={{
          width: '74px',
          height: '74px',
          borderRadius: '50%',
          overflow: 'hidden',
          border: `2px solid ${ACCENT}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#EAECE8',
          flexShrink: 0,
          marginLeft: '16px',
        }}>
          {pi.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={pi.photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#ECEEEA',
            }}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#7A877E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '6.5px',
                fontWeight: 700,
                color: '#6E7C71',
                letterSpacing: '0.08em',
                marginTop: '1px',
                textTransform: 'uppercase',
              }}>
                Photo
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: `0.5px solid ${RULEGRAY}`, marginBottom: '2px' }} />

      {/* PERSONAL + RELIGION */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        {/* Personal Info */}
        <div style={{ flex: '1 1 0%', minWidth: 0 }}>
          <SectionTitle title="Personal Information" />
          <table style={{ fontSize: '8px', lineHeight: '1.7', borderCollapse: 'collapse', width: '100%', tableLayout: 'fixed' }}>
            <tbody>
              {[
                ['Date of Birth', pi.dateOfBirth],
                ['Age', pi.age],
                ['Height', pi.height],
                ['Blood Group', pi.bloodGroup],
                ['Marital Status', pi.maritalStatus],
                ['Nationality', pi.nationality],
                ['Home District', pi.homeDistrict],
                ['Current Residence', pi.currentResidence],
              ].map(([label, value]) => (
                <tr key={label}>
                  <td style={{ color: SOFTGRAY, width: '42%', paddingRight: '6px', whiteSpace: 'nowrap', verticalAlign: 'top', fontFamily: "'Lato', sans-serif" }}>{label}</td>
                  <td style={{ color: CHARCOAL, width: '58%', wordBreak: 'break-word', fontFamily: "'Lato', sans-serif" }}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Religious Background */}
        {es.religion ? (
          <div style={{ flex: '1 1 0%', minWidth: 0 }}>
            <SectionTitle title="Religious Background" />
            <div style={{ fontSize: '8px', lineHeight: '1.5', wordBreak: 'break-word' }}>
              <p style={{ margin: '0 0 4px 0' }}>
                <BoldLabel>Religion: </BoldLabel>
                <BodyText>{data.religion}</BodyText>
              </p>
              <p style={{ margin: '0 0 3px 0' }}><BoldLabel>Religious Practice:</BoldLabel></p>
              <BodyText>{data.religiousPractice}</BodyText>
            </div>
          </div>
        ) : (
          <div style={{ flex: '1 1 0%', minWidth: 0 }} />
        )}
      </div>

      {/* EDUCATION */}
      <SectionTitle title="Education" />
      <table style={{ width: '100%', fontSize: '8px', lineHeight: '1.6', borderCollapse: 'collapse', tableLayout: 'auto' }}>
        <tbody>
          {data.education.map((edu, idx) => (
            <React.Fragment key={idx}>
              <tr>
                <td style={{ fontWeight: 700, color: CHARCOAL, fontFamily: "'Lato', sans-serif", paddingRight: '8px', verticalAlign: 'top', wordBreak: 'break-word' }}>{edu.degree}</td>
                <td style={{ color: SOFTGRAY, fontFamily: "'Lato', sans-serif", verticalAlign: 'top', wordBreak: 'break-word' }}>{edu.institution}</td>
                <td style={{ color: SOFTGRAY, fontFamily: "'Lato', sans-serif", textAlign: 'right', whiteSpace: 'nowrap', verticalAlign: 'top', paddingLeft: '8px' }}>{edu.dates}</td>
              </tr>
              {edu.thesis && (
                <tr>
                  <td colSpan={3} style={{ color: SOFTGRAY, fontStyle: 'italic', fontSize: '7.5px', paddingBottom: '3px', fontFamily: "'Lato', sans-serif", wordBreak: 'break-word' }}>
                    Thesis: {edu.thesis}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* CAREER + FAMILY */}
      {(es.career || es.family) && (
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{ flex: '1 1 0%', minWidth: 0 }}>
            {es.career && (
              <>
                <SectionTitle title="Profession & Career" />
                <div style={{ fontSize: '8px', lineHeight: '1.5', wordBreak: 'break-word' }}>
                  <p style={{ margin: '0 0 2px 0' }}><BoldLabel>Experience:</BoldLabel></p>
                  <BodyText>
                    {data.careerExperience.split('\n').map((line, i) => (
                      <React.Fragment key={i}>{line}{i < data.careerExperience.split('\n').length - 1 && <br />}</React.Fragment>
                    ))}
                  </BodyText>
                  <p style={{ margin: '5px 0 2px 0' }}><BoldLabel>Current Status:</BoldLabel></p>
                  <BodyText>{data.careerCurrentStatus}</BodyText>
                </div>
              </>
            )}
          </div>
          <div style={{ flex: '1 1 0%', minWidth: 0 }}>
            {es.family && (
              <>
                <SectionTitle title="Family Background" />
                <div style={{ fontSize: '8px', lineHeight: '1.5', wordBreak: 'break-word' }}>
                  <p style={{ margin: '0 0 2px 0' }}><BoldLabel>Father:</BoldLabel></p>
                  <BodyText>
                    {data.fatherDetails.split('\n').map((line, i) => (
                      <React.Fragment key={i}>{line}{i < data.fatherDetails.split('\n').length - 1 && <br />}</React.Fragment>
                    ))}
                  </BodyText>
                  <p style={{ margin: '5px 0 2px 0' }}><BoldLabel>Mother:</BoldLabel></p>
                  <BodyText>
                    {data.motherDetails.split('\n').map((line, i) => (
                      <React.Fragment key={i}>{line}{i < data.motherDetails.split('\n').length - 1 && <br />}</React.Fragment>
                    ))}
                  </BodyText>
                  <p style={{ margin: '5px 0 2px 0' }}><BoldLabel>Sibling(s):</BoldLabel></p>
                  <BodyText>{data.siblingDetails}</BodyText>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ABOUT ME */}
      {es.aboutMe && data.aboutMe && (
        <>
          <SectionTitle title="About Me" />
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: '8px', fontStyle: 'italic', color: SOFTGRAY, lineHeight: '1.55', margin: '0', wordBreak: 'break-word' }}>
            {data.aboutMe}
          </p>
        </>
      )}

      {/* LIFESTYLE + PARTNER */}
      {(es.lifestyle || es.partnerExpectations) && (
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{ flex: '1 1 0%', minWidth: 0 }}>
            {es.lifestyle && (
              <>
                <SectionTitle title="Lifestyle & Interests" />
                <div style={{ fontSize: '8px', lineHeight: '1.5', wordBreak: 'break-word' }}>
                  <p style={{ margin: '0 0 3px 0' }}><BoldLabel>Interests: </BoldLabel><BodyText>{data.lifestyleInterests}</BodyText></p>
                  <p style={{ margin: '0 0 3px 0' }}><BoldLabel>Lifestyle: </BoldLabel><BodyText>{data.lifestyleDescription}</BodyText></p>
                  <p style={{ margin: '0 0 3px 0' }}><BoldLabel>Habits: </BoldLabel><BodyText>{data.lifestyleHabits}</BodyText></p>
                  <p style={{ margin: '0' }}><BoldLabel>Approach to Life: </BoldLabel><BodyText>{data.lifestyleApproach}</BodyText></p>
                </div>
              </>
            )}
          </div>
          <div style={{ flex: '1 1 0%', minWidth: 0 }}>
            {es.partnerExpectations && (
              <>
                <SectionTitle title="Life Partner Expectations" />
                <div style={{ fontSize: '8px', lineHeight: '1.5', wordBreak: 'break-word' }}>
                  <BodyText>{data.partnerExpectationsText}</BodyText>
                  <p style={{ margin: '5px 0 2px 0' }}><BoldLabel>Education: </BoldLabel><BodyText>{data.partnerEducation}</BodyText></p>
                  <p style={{ margin: '0 0 2px 0' }}><BoldLabel>Location: </BoldLabel><BodyText>{data.partnerLocation}</BodyText></p>
                  <p style={{ margin: '0' }}><BoldLabel>Career: </BoldLabel><BodyText>{data.partnerCareer}</BodyText></p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* FAMILY VALUES */}
      {es.familyValues && data.familyValues && (
        <>
          <SectionTitle title="Family Values" />
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: '8px', fontStyle: 'italic', color: SOFTGRAY, lineHeight: '1.55', margin: '0', wordBreak: 'break-word' }}>
            {data.familyValues}
          </p>
        </>
      )}

      {/* CUSTOM SECTIONS */}
      {data.customSections.map(sec => (
        <div key={sec.id}>
          <SectionTitle title={sec.title} />
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: '8px', color: SOFTGRAY, lineHeight: '1.55', margin: '0', wordBreak: 'break-word' }}>
            {sec.content}
          </p>
        </div>
      ))}

      {/* ONLINE + CONTACT */}
      {(es.onlinePresence || es.contactPersons) && (
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{ flex: '1 1 0%', minWidth: 0 }}>
            {es.onlinePresence && data.onlinePresence.length > 0 && (
              <>
                <SectionTitle title="Online Presence" />
                <div style={{ fontSize: '8px', lineHeight: '1.6', wordBreak: 'break-word' }}>
                  {data.onlinePresence.map((link, idx) => (
                    <p key={idx} style={{ margin: '0 0 2px 0' }}>
                      <BoldLabel>{link.platform}: </BoldLabel>
                      <span style={{ color: ACCENT, fontFamily: "'Lato', sans-serif", wordBreak: 'break-all' }}>{link.displayUrl}</span>
                    </p>
                  ))}
                </div>
              </>
            )}
          </div>
          <div style={{ flex: '1 1 0%', minWidth: 0 }}>
            {es.contactPersons && data.contactPersons.length > 0 && (
              <>
                <SectionTitle title="For Further Communication" />
                <div style={{ fontSize: '8px', lineHeight: '1.6', wordBreak: 'break-word' }}>
                  {data.contactPersons.map((person, idx) => (
                    <p key={idx} style={{ margin: '0 0 2px 0' }}>
                      <BoldLabel>{person.name}</BoldLabel>
                      <BodyText> · {person.relation} · {person.phone}</BodyText>
                    </p>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
