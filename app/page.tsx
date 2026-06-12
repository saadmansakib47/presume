// app/page.tsx
'use client';

import { useState } from 'react';
import { CVData, defaultCVData } from '@/lib/cv-types';
import CVForm from '@/components/CVForm/CVForm';
import { generateLatex } from '@/lib/latex-template';

export default function CVGenerator() {
  const [cvData, setCvData] = useState<CVData>(defaultCVData);
  const [isGenerating, setIsGenerating] = useState(false);

  // Compute LaTeX on the fly (no useEffect + setState)
  const latexOutput = generateLatex(cvData);

  const downloadTeX = () => {
    const blob = new Blob([latexOutput], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cvData.personalInfo.firstName}_${cvData.personalInfo.lastName}_CV.tex`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadPDF = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cvData),
      });

      if (!response.ok) throw new Error('Failed to generate PDF');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${cvData.personalInfo.firstName}_${cvData.personalInfo.lastName}_CV.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      alert("PDF generation failed. For now, try downloading .tex and compile locally.");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">CV Generator</h1>
            <p className="text-zinc-400 mt-2">Moderncv • Professional • Instant Download</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={downloadTeX}
              className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl flex items-center gap-2 transition"
            >
              📄 Download .tex
            </button>
            <button
              onClick={downloadPDF}
              disabled={isGenerating}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 rounded-xl flex items-center gap-2 transition"
            >
              {isGenerating ? 'Generating PDF...' : '⬇️ Download PDF'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form Sidebar */}
          <div className="lg:col-span-3">
            <CVForm cvData={cvData} setCvData={setCvData} />
          </div>

          {/* Live Preview */}
          <div className="lg:col-span-2">
            <div className="sticky top-6">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <h3 className="font-medium mb-4">Live LaTeX Preview</h3>
                <pre className="bg-black p-4 rounded-xl text-xs overflow-auto max-h-[70vh] text-zinc-400 font-mono whitespace-pre-wrap border border-zinc-800">
                  {latexOutput.length > 1500 
                    ? latexOutput.substring(0, 1500) + '\n\n... (truncated for preview)' 
                    : latexOutput}
                </pre>
                <p className="text-xs text-zinc-500 mt-4">
                  Full LaTeX is used for download. PDF support coming soon.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}