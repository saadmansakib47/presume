// app/api/hunt/route.ts
import { NextResponse } from 'next/server';
import { getTemplateCatalog, huntNextTemplate } from '@/lib/template-hunter';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const catalog = await getTemplateCatalog();
    const huntedCount = catalog.filter((t) => !t.isBuiltin).length;
    return NextResponse.json({
      success: true,
      catalog,
      huntedCount,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to retrieve catalog';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST() {
  try {
    const result = await huntNextTemplate();
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      template: result.template,
      message: result.message,
    });
  } catch (error: unknown) {
    console.error('Template hunt error:', error);
    const message = error instanceof Error ? error.message : 'Template hunt pipeline encountered an error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
