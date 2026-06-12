// app/api/generate-cv/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateLatex } from '@/lib/latex-template';
import { CVData } from '@/lib/cv-types';

export async function POST(request: NextRequest) {
  try {
    const cvData: CVData = await request.json();
    const latexContent = generateLatex(cvData);

    // For now, return the .tex file (full PDF needs server TeXLive setup)
    return new NextResponse(latexContent, {
      headers: {
        'Content-Type': 'text/plain',
        'Content-Disposition': 'attachment; filename="cv.tex"',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate CV' }, { status: 500 });
  }
}