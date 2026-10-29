import { NextResponse, type NextRequest } from 'next/server';
import {
  AGREEMENT_VERSION,
  REQUIRED_CHECKBOXES,
  formatPacific,
  type CheckboxId,
} from '@/lib/abideAgreement';
import {
  configStatus,
  loadPacket,
  markEmailStatus,
  newConfirmationId,
  sendSignedEmail,
  storePacket,
  type SignaturePacket,
} from '@/lib/contractSignatures';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_SIGNATURE_BYTES = 600_000; // data URL length cap (~450 KB PNG)

function clientIp(req: NextRequest): string | null {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim() || null;
  return req.headers.get('x-real-ip');
}

function bad(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

/** Config check — booleans only, never values. */
export async function GET() {
  return NextResponse.json({ ok: true, version: AGREEMENT_VERSION, configured: configStatus() });
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return bad('Invalid request.');
  }

  // Retry email for an already-stored packet.
  if (body.action === 'retry-email') {
    const id = typeof body.confirmationId === 'string' ? body.confirmationId : '';
    if (!/^ABIDE-\d{8}-[A-Z0-9]{6}$/.test(id)) return bad('Invalid confirmation id.');
    const packet = await loadPacket(id);
    if (!packet) return bad('Submission not found.', 404);
    const sent = await sendSignedEmail(packet);
    await markEmailStatus(id, sent.ok ? 'sent' : 'failed', sent.error ?? sent.detail);
    return NextResponse.json({ ok: true, emailSent: sent.ok, confirmationId: id });
  }

  // Honeypot — real users never fill this.
  if (typeof body.company_website === 'string' && body.company_website.trim() !== '') {
    return bad('Rejected.');
  }

  if (body.agreementVersion !== AGREEMENT_VERSION) return bad('Agreement version mismatch. Reload the page.');

  const typedName = typeof body.typedName === 'string' ? body.typedName.trim() : '';
  if (typedName.length < 2 || typedName.length > 120) return bad('Type your full name.');

  const signerTitle =
    typeof body.signerTitle === 'string' ? body.signerTitle.trim().slice(0, 80) : '';

  const sig = typeof body.signatureDataUrl === 'string' ? body.signatureDataUrl : '';
  if (!sig.startsWith('data:image/png;base64,') || sig.length < 200) return bad('Draw your signature.');
  if (sig.length > MAX_SIGNATURE_BYTES) return bad('Signature image is too large. Clear and sign again.');
  const strokes = Number(body.strokeCount);
  if (!Number.isFinite(strokes) || strokes < 1) return bad('Draw your signature.');

  const raw = (body.checkboxes ?? {}) as Record<string, unknown>;
  const checkboxes = {} as Record<CheckboxId, boolean>;
  for (const c of REQUIRED_CHECKBOXES) {
    if (raw[c.id] !== true) return bad('All required boxes must be checked.');
    checkboxes[c.id] = true;
  }

  const monthlyChoice = body.monthlyChoice;
  if (monthlyChoice !== 'yes' && monthlyChoice !== 'no') return bad('Choose Yes or No for optional monthly hosting.');

  const now = new Date();
  const packet: SignaturePacket = {
    confirmationId: newConfirmationId(now),
    agreementVersion: AGREEMENT_VERSION,
    typedName,
    signerTitle,
    signatureDataUrl: sig,
    checkboxes,
    monthlyChoice,
    signedAtUtc: now.toISOString(),
    signedAtPacific: formatPacific(now),
    userAgent: (req.headers.get('user-agent') ?? '').slice(0, 500),
    ip: clientIp(req),
  };

  const stored = await storePacket(packet);
  const sent = await sendSignedEmail(packet);
  if (stored.ok) await markEmailStatus(packet.confirmationId, sent.ok ? 'sent' : 'failed', sent.error ?? sent.detail);

  // Never report success unless the server kept the packet somewhere durable:
  // the database row, or the email (with signature + signed terms attached).
  if (!stored.ok && !sent.ok) {
    return NextResponse.json(
      {
        ok: false,
        error:
          'Your signature could not be recorded right now. Nothing was submitted. Please try again in a minute or email contact@plerona.com.',
        detail: { storage: stored.error, email: sent.error },
      },
      { status: 503 },
    );
  }

  return NextResponse.json({
    ok: true,
    confirmationId: packet.confirmationId,
    signedAtUtc: packet.signedAtUtc,
    signedAtPacific: packet.signedAtPacific,
    stored: stored.ok,
    emailSent: sent.ok,
    canRetryEmail: stored.ok && !sent.ok,
  });
}
