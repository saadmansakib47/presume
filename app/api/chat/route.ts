// app/api/chat/route.ts
import { NextResponse } from 'next/server';

// In-memory store for basic rate-limiting
const rateLimitStore = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5; // 5 requests

export async function POST(req: Request) {
  try {
    // 1. Extract IP for rate limiting
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anonymous';
    const now = Date.now();
    const clientLimit = rateLimitStore.get(ip) || { count: 0, lastReset: now };

    // Reset rate limit window if expired
    if (now - clientLimit.lastReset > RATE_LIMIT_WINDOW_MS) {
      clientLimit.count = 0;
      clientLimit.lastReset = now;
    }

    if (clientLimit.count >= MAX_REQUESTS_PER_WINDOW) {
      const secondsLeft = Math.ceil((clientLimit.lastReset + RATE_LIMIT_WINDOW_MS - now) / 1000);
      return NextResponse.json(
        {
          error: `Too many requests. Please wait ${secondsLeft} second(s) before trying again.`,
        },
        { status: 429 }
      );
    }

    // Increment request count
    clientLimit.count++;
    rateLimitStore.set(ip, clientLimit);

    const { message, latexCode } = await req.json();

    // 2. Validate input size
    if (!message || typeof message !== 'string' || message.length > 1000) {
      return NextResponse.json(
        { error: 'Invalid message. Maximum allowed prompt length is 1000 characters.' },
        { status: 400 }
      );
    }

    if (!latexCode || typeof latexCode !== 'string' || latexCode.length > 50000) {
      return NextResponse.json(
        { error: 'Invalid LaTeX code payload. Maximum allowed length is 50,000 characters.' },
        { status: 400 }
      );
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;
    const openrouterApiKey = process.env.OPENROUTER_API_KEY;

    if (!geminiApiKey && !openrouterApiKey) {
      return NextResponse.json(
        {
          error: 'API Key not configured. Please set GEMINI_API_KEY or OPENROUTER_API_KEY in your environment variables.',
        },
        { status: 500 }
      );
    }

    const systemPrompt = `You are a helpful LaTeX Resume Assistant. A non-coder user wants to update their resume.
They might ask to reduce spacing, remove empty space, adjust page margins, rewrite or improve job descriptions, or add a section.
You are given the current LaTeX code of their resume, and their prompt.

Your job is to:
1. Figure out if their request requires changes to the LaTeX code.
2. If so, modify the LaTeX code appropriately. Keep it compile-ready, escaped, and matching the existing document style structure.
3. If not, or if they are just asking a general question, do not change the LaTeX code.
4. Respond ONLY with a JSON object. Do not output anything before or after the JSON.

The JSON structure must be:
{
  "message": "A friendly, conversational explanation of the changes made, or step-by-step guidance on how to edit the code manually if no automatic changes were made.",
  "updatedLatex": "The FULL, complete updated LaTeX source code including all edits. Set this to null if you didn't change the LaTeX code."
}

Ensure the LaTeX remains valid and compiles correctly. Keep spacing tweaks, font styling, or margin changes inline with standard LaTeX packages used in the document (like geometry, vspace, etc.).

Current LaTeX code:
${latexCode}
`;

    let responseText = '';

    if (geminiApiKey) {
      // Call Gemini API
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: systemPrompt + `\n\nUser request: ${message}` }],
            },
          ],
          generationConfig: {
            responseMimeType: 'application/json',
          },
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `Gemini API returned status ${response.status}`);
      }

      const data = await response.json();
      responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } else {
      // Call OpenRouter API
      const url = 'https://openrouter.ai/api/v1/chat/completions';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openrouterApiKey}`,
          'HTTP-Referer': 'https://github.com/saadmansakib47/presume',
          'X-Title': 'Presume Resume Builder',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash', // Fallback/primary free-tier model
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message },
          ],
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `OpenRouter API returned status ${response.status}`);
      }

      const data = await response.json();
      responseText = data?.choices?.[0]?.message?.content || '';
    }

    // Parse Response
    responseText = responseText.trim();
    // Strip markdown JSON block wrapper if the LLM outputted it anyway
    if (responseText.startsWith('```json')) {
      responseText = responseText.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (responseText.startsWith('```')) {
      responseText = responseText.replace(/^```/, '').replace(/```$/, '').trim();
    }

    const result = JSON.parse(responseText);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in chat API route:', error);
    return NextResponse.json(
      {
        error: error.message || 'An error occurred while processing your request.',
      },
      { status: 500 }
    );
  }
}
