// app/api/hunt/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getTemplateCatalog, huntNextTemplate } from '@/lib/template-hunter';

export const dynamic = 'force-dynamic';

/** GET /api/hunt - public: returns catalog metadata (no secrets, no .tex content) */
export async function GET() {
  try {
    const catalog = await getTemplateCatalog();
    // Strip full texTemplate content from catalog listing - only metadata
    const safeCatalog = catalog.map(({ texTemplate: _tex, ...rest }) => rest);
    const huntedCount = safeCatalog.filter((t) => !t.isBuiltin).length;
    return NextResponse.json({ success: true, catalog: safeCatalog, huntedCount });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to retrieve catalog';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

/** POST /api/hunt - protected: requires Authorization: Bearer <HUNT_SECRET> or x-hunt-secret header */
export async function POST(req: NextRequest) {
  const secret = process.env.HUNT_SECRET || 'presume-hunt-dev-secret';

  const authHeader = req.headers.get('authorization') ?? '';
  const xSecret = req.headers.get('x-hunt-secret') ?? '';
  const provided = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : (xSecret || authHeader).trim();

  if (!provided || provided !== secret) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Valid hunt secret key is required.' },
      { status: 401 }
    );
  }

  try {
    const result = await huntNextTemplate();
    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 });
    }
    return NextResponse.json({
      success: true,
      template: result.template,
      message: result.message,
    });
  } catch (error: unknown) {
    console.error('Template hunt error:', error);
    const message =
      error instanceof Error ? error.message : 'Template hunt pipeline encountered an error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
