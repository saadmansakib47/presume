// app/presume-admin-hunt/page.tsx
// Secret admin page for triggering template hunts.
// The URL itself is the "secret" — it is not linked from anywhere in the UI.
// Additionally, the POST /api/hunt endpoint requires HUNT_SECRET authorization.
// This page reads HUNT_SECRET on the server and passes it to the client component.

import HuntAdminClient from './HuntAdminClient';

export const dynamic = 'force-dynamic';

export default function HuntAdminPage() {
  // Read secret server-side; only passed as a prop - never included in a public bundle
  const secret = process.env.HUNT_SECRET ?? '';
  return <HuntAdminClient secret={secret} />;
}
