// components/ContributeModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { X, FileText, UploadCloud, Info } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export default function ContributeModal({ onClose }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [contributor, setContributor] = useState('');
  const [latexContent, setLatexContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleFileRead = (file: File) => {
    if (!file.name.endsWith('.tex')) {
      alert('Only .tex LaTeX files are supported currently.');
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setLatexContent(e.target.result as string);
      }
    };
    reader.readAsText(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileRead(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileRead(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !latexContent) return;

    const issueTitle = `[Template Contribution] ${name}`;
    const issueBody = `### Contributed Template Details
- **Name:** ${name}
- **Description:** ${description}
- **GitHub Contributor Tag:** ${contributor ? `@${contributor.replace(/^@/, '')}` : 'Anonymous'}
- **Uploaded Filename:** ${fileName || 'unnamed.tex'}

### LaTeX Code
\`\`\`latex
${latexContent}
\`\`\`
`;

    const githubUrl = `https://github.com/saadmansakib47/presume/issues/new?title=${encodeURIComponent(issueTitle)}&body=${encodeURIComponent(issueBody)}`;
    window.open(githubUrl, '_blank');
    onClose();
  };

  return (
    <div
      className="modal-backdrop fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="modal-panel bg-white rounded-2xl border border-zinc-200 shadow-2xl w-full max-w-xl p-5 sm:p-8 relative flex flex-col max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 transition cursor-pointer p-1"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <div className="space-y-1.5 mb-6">
          <h2 className="text-lg sm:text-xl font-black tracking-tight text-zinc-950 uppercase flex items-center gap-2">
            Contribute a Template
          </h2>
          <p className="text-sm text-zinc-500 font-medium">
            Share your layouts. Contributed LaTeX files are reviewed and added directly to the official list.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 flex-1">
          {/* Grid inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="contrib-name" className="text-[10px] font-bold uppercase tracking-widest text-zinc-450">Template Name</label>
              <input
                id="contrib-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-zinc-700 transition"
                placeholder="e.g. Executive Single-Page"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="contrib-user" className="text-[10px] font-bold uppercase tracking-widest text-zinc-450">GitHub Username (Optional)</label>
              <input
                id="contrib-user"
                type="text"
                value={contributor}
                onChange={(e) => setContributor(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-zinc-700 transition"
                placeholder="e.g. octocat"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="contrib-desc" className="text-[10px] font-bold uppercase tracking-widest text-zinc-450">Description</label>
            <textarea
              id="contrib-desc"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-zinc-700 transition resize-none"
              placeholder="e.g. A formal two-column layout with centered headers for consulting roles..."
            />
          </div>

          {/* Upload files container */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* LaTeX Upload */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-450">LaTeX Template (.tex)</span>

              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition ${dragActive
                  ? "border-zinc-950 bg-zinc-50"
                  : "border-zinc-200 hover:border-zinc-400"
                  }`}
                onClick={() => document.getElementById('latex-file-upload')?.click()}
              >
                <input
                  id="latex-file-upload"
                  type="file"
                  accept=".tex"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <UploadCloud size={24} className="text-zinc-400 mb-1" />
                <span className="text-[10px] font-bold text-zinc-500">
                  {fileName ? fileName : 'Upload or Drag & Drop'}
                </span>
                <span className="text-[9px] text-zinc-400 mt-0.5">LaTeX source only</span>
              </div>
            </div>

            {/* PDF Upload (Coming Soon) */}
            <div className="space-y-1.5 opacity-55 select-none relative">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-450">
                PDF Upload
              </span>
              <div className="border-2 border-dashed border-zinc-200 rounded-xl p-4 flex flex-col items-center justify-center text-center bg-zinc-50 h-[86px]">
                <FileText size={24} className="text-zinc-350 mb-1" />
                <span className="text-[10px] font-bold text-zinc-400">PDF Document</span>
                <span className="absolute top-8 px-2 py-0.5 bg-zinc-950 text-white text-[8px] font-bold uppercase tracking-widest rounded shadow-sm">
                  Coming Soon (AI)
                </span>
              </div>
            </div>
          </div>

          {/* LaTeX preview if present */}
          {latexContent && (
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-450">File Preview</span>
              <div className="w-full bg-zinc-50 text-zinc-800 border border-zinc-200 p-3 rounded-xl font-mono text-[9px] max-h-32 overflow-y-auto leading-normal whitespace-pre-wrap">
                {latexContent}
              </div>
            </div>
          )}

          {/* Info Banner */}
          <div className="flex gap-2 p-3 bg-zinc-50 border border-zinc-150 rounded-xl items-start">
            <Info size={14} className="text-zinc-450 shrink-0 mt-0.5" />
            <p className="text-[10px] font-medium leading-normal text-zinc-500">
              Submitting redirects you to a GitHub Issue creation page. The maintainer will review the code, format it as a JSON preset, and merge it.
            </p>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={!name || !description || !latexContent}
            className="w-full py-3 bg-zinc-950 hover:bg-zinc-850 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
          >
            <span>Submit via GitHub Issues →</span>
          </button>
        </form>
      </div>
    </div>
  );
}
