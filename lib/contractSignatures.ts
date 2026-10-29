import 'server-only';
import { randomBytes } from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import {
  AGREEMENT_TITLE,
  AGREEMENT_VERSION,
  MONTHLY_OPTIONS,
  NOTIFY_TO,
  PARTIES,
  PAYPAL,
  PRICES,
  REQUIRED_CHECKBOXES,
  SECTIONS,
  formatPacific,
  type Block,
  type CheckboxId,
  type MonthlyChoice,
} from './abideAgreement';

export interface SignaturePacket {
  confirmationId: string;
  agreementVersion: string;
  typedName: string;
  signerTitle: string;
  signatureDataUrl: string; // data:image/png;base64,...
  checkboxes: Record<CheckboxId, boolean>;
  monthlyChoice: MonthlyChoice;
  signedAtUtc: string; // ISO 8601
  signedAtPacific: string; // "Oct 28, 2026, 4:52:10 PM PDT"
  userAgent: string;
  ip: string | null;
}

// ── Config ──────────────────────────────────────────────────────────

const supabaseConfigured = () =>
  Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
const emailConfigured = () => Boolean(process.env.RESEND_API_KEY);
const fromAddress = () =>
  process.env.EMAIL_FROM || process.env.FROM_EMAIL || 'Plerona <onboarding@resend.dev>';

/**
 * TEMPORARY STOPGAP (2026-10-28): Resend's shared test sender (@resend.dev)
 * can only deliver to the Resend account owner. Until plerona.com is verified
 * on Resend and EMAIL_FROM uses that domain, signed packets go to the account
 * owner instead. As soon as EMAIL_FROM is a plerona.com address, mail goes to
 * NOTIFY_TO (contact@plerona.com) again — no code change needed.
 */
const SANDBOX_RECIPIENT = 'owendonlane@gmail.com';
const usingSandboxSender = () => /@resend\.dev>?\s*$/i.test(fromAddress().trim());
export const recipientAddress = () => (usingSandboxSender() ? SANDBOX_RECIPIENT : NOTIFY_TO);

export function configStatus() {
  return {
    storage: supabaseConfigured(),
    email: emailConfigured(),
    customSender: Boolean(process.env.EMAIL_FROM || process.env.FROM_EMAIL),
    sandboxRecipient: usingSandboxSender(),
  };
}

export function newConfirmationId(now: Date): string {
  // Pacific calendar date, matching the signed-at time shown to the client.
  const ymd = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(now)
    .replace(/-/g, '');
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = randomBytes(6);
  let suffix = '';
  for (const b of bytes) suffix += alphabet[b % alphabet.length];
  return `ABIDE-${ymd}-${suffix}`;
}

function supabase() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });
}

// ── Storage ─────────────────────────────────────────────────────────

export async function storePacket(p: SignaturePacket): Promise<{ ok: boolean; error?: string }> {
  if (!supabaseConfigured()) return { ok: false, error: 'storage_not_configured' };
  const { error } = await supabase().from('contract_signatures').insert({
    confirmation_id: p.confirmationId,
    agreement_version: p.agreementVersion,
    client_company: PARTIES.client.company,
    typed_name: p.typedName,
    signer_title: p.signerTitle,
    signature_png: p.signatureDataUrl,
    checkboxes: p.checkboxes,
    monthly_choice: p.monthlyChoice,
    signed_at_utc: p.signedAtUtc,
    signed_at_pacific: p.signedAtPacific,
    user_agent: p.userAgent,
    ip: p.ip,
    email_status: 'pending',
  });
  if (error) {
    console.error('contract_signatures insert failed:', error.message);
    return { ok: false, error: 'storage_insert_failed' };
  }
  return { ok: true };
}

export async function markEmailStatus(id: string, status: 'sent' | 'failed', detail?: string) {
  if (!supabaseConfigured()) return;
  await supabase()
    .from('contract_signatures')
    .update({ email_status: status, email_detail: detail ?? null, email_updated_at: new Date().toISOString() })
    .eq('confirmation_id', id);
}

export async function loadPacket(id: string): Promise<SignaturePacket | null> {
  if (!supabaseConfigured()) return null;
  const { data, error } = await supabase()
    .from('contract_signatures')
    .select('*')
    .eq('confirmation_id', id)
    .maybeSingle();
  if (error || !data) return null;
  return {
    confirmationId: data.confirmation_id,
    agreementVersion: data.agreement_version,
    typedName: data.typed_name,
    signerTitle: data.signer_title ?? '',
    signatureDataUrl: data.signature_png,
    checkboxes: data.checkboxes,
    monthlyChoice: data.monthly_choice,
    signedAtUtc: new Date(data.signed_at_utc).toISOString(),
    signedAtPacific: data.signed_at_pacific,
    userAgent: data.user_agent ?? '',
    ip: data.ip ?? null,
  };
}

// ── Email ───────────────────────────────────────────────────────────

const INK = '#0a0a0a';
const BLUE = '#1a56db';
const OFFWHITE = '#f7f7f7';
const RULE = '#e4e4e4';
const GRAY = '#888888';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function row(label: string, value: string) {
  return `<tr>
    <td style="padding:8px 12px 8px 0;border-bottom:1px solid ${RULE};color:${GRAY};font-size:13px;vertical-align:top;width:42%;">${esc(label)}</td>
    <td style="padding:8px 0;border-bottom:1px solid ${RULE};color:${INK};font-size:13px;font-weight:600;vertical-align:top;">${esc(value)}</td>
  </tr>`;
}

function blockHtml(b: Block): string {
  switch (b.kind) {
    case 'p':
      return `<p style="margin:0 0 10px;">${esc(b.text)}</p>`;
    case 'kv':
      return `<p style="margin:0 0 10px;"><strong>${esc(b.label)}:</strong> ${esc(b.text)}</p>`;
    case 'link':
      return `<p style="margin:0 0 10px;"><strong>${esc(b.label)}:</strong> <a href="${esc(b.href)}" style="color:${BLUE};">${esc(b.href)}</a></p>`;
    case 'list':
      return `${b.label ? `<p style="margin:0 0 6px;"><strong>${esc(b.label)}:</strong></p>` : ''}<ul style="margin:0 0 10px;padding-left:20px;">${b.items
        .map((i) => `<li style="margin:0 0 4px;">${esc(i)}</li>`)
        .join('')}</ul>`;
  }
}

function summaryTable(p: SignaturePacket) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    ${row('Confirmation ID', p.confirmationId)}
    ${row('Agreement version', p.agreementVersion)}
    ${row('Client', `${PARTIES.client.company} — ${PARTIES.client.name}`)}
    ${row('Client email / phone', `${PARTIES.client.email} · ${PARTIES.client.phone}`)}
    ${row('Domain', PARTIES.domain)}
    ${row('Visuals', PARTIES.visualsUrl)}
    ${row('Provider', `${PARTIES.provider.company} — ${PARTIES.provider.name}, ${PARTIES.provider.title}`)}
    ${row('Typed name', p.typedName)}
    ${row('Title', p.signerTitle || '—')}
    ${row('Signed (Pacific)', p.signedAtPacific)}
    ${row('Signed (UTC)', p.signedAtUtc)}
    ${row('List setup', PRICES.listSetup)}
    ${row('Discount', PRICES.discountLabel)}
    ${row('Accepted setup', PRICES.acceptedSetup)}
    ${row('Deposit (25%, non-refundable once paid)', PRICES.deposit)}
    ${row('Balance (75%, due before go-live)', PRICES.balance)}
    ${row('Yearly hosting', `Year 1 FREE, then ${PRICES.yearlyHosting} (own domain)`)}
    ${row('Optional monthly ($198.98/mo)', p.monthlyChoice === 'yes' ? 'YES — ' + MONTHLY_OPTIONS.yes : 'NO — ' + MONTHLY_OPTIONS.no)}
    ${row('Deposit link', PAYPAL.depositUrl)}
    ${row('Balance link', PAYPAL.balanceUrl)}
    ${row('IP address', p.ip || 'not available')}
    ${row('User agent', p.userAgent || '—')}
    ${row('Owner counter-signature', 'Pending — follows by email')}
  </table>`;
}

function checkboxList(p: SignaturePacket) {
  return `<ul style="margin:0;padding-left:0;list-style:none;">${REQUIRED_CHECKBOXES.map(
    (c) =>
      `<li style="margin:0 0 6px;font-size:13px;color:${INK};">${p.checkboxes[c.id] ? '☑' : '☐'} ${esc(c.label)}</li>`,
  ).join('')}</ul>`;
}

/** Full signed agreement as a standalone HTML document (attached to the email). */
export function signedAgreementHtml(p: SignaturePacket): string {
  const sections = SECTIONS.map((s) => {
    let inner = s.blocks.map(blockHtml).join('');
    if (s.id === 'checkboxes') inner = checkboxList(p);
    if (s.id === 'monthly') {
      inner += `<p style="margin:10px 0 0;padding:10px 12px;background:#f0f5ff;border:1px solid ${RULE};"><strong>Client choice:</strong> ${esc(MONTHLY_OPTIONS[p.monthlyChoice])}</p>`;
    }
    if (s.id === 'signatures') {
      inner += `<div style="margin-top:12px;padding:16px;border:1px solid ${RULE};background:#fff;">
        <p style="margin:0 0 8px;color:${GRAY};font-size:12px;text-transform:uppercase;letter-spacing:.12em;">Client signature</p>
        <img src="${p.signatureDataUrl}" alt="Client signature" style="max-width:100%;height:auto;max-height:160px;display:block;border-bottom:1px solid ${INK};" />
        <p style="margin:8px 0 0;"><strong>${esc(p.typedName)}</strong>${p.signerTitle ? `, ${esc(p.signerTitle)}` : ''} — Abide Electrical</p>
        <p style="margin:2px 0 0;color:${GRAY};font-size:12px;">${esc(p.signedAtPacific)} · ${esc(p.signedAtUtc)} UTC · ID ${esc(p.confirmationId)}</p>
      </div>
      <div style="margin-top:12px;padding:16px;border:1px dashed ${RULE};">
        <p style="margin:0;"><strong>Plerona — Owen Lane, Owner:</strong> counter-signature pending; follows by email.</p>
      </div>`;
    }
    return `<h2 style="margin:28px 0 10px;font-size:16px;color:${INK};"><span style="color:${BLUE};margin-right:8px;">${s.number}.</span>${esc(s.title)}</h2>${inner}`;
  }).join('');

  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(AGREEMENT_TITLE)} — ${esc(p.confirmationId)}</title></head>
<body style="margin:0;background:${OFFWHITE};font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#333;line-height:1.6;font-size:14px;">
<div style="max-width:760px;margin:0 auto;padding:32px 20px;">
<div style="background:#fff;border:1px solid ${RULE};padding:32px;">
<p style="margin:0 0 4px;color:${BLUE};font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;">Signed agreement</p>
<h1 style="margin:0 0 6px;font-size:22px;color:${INK};">${esc(AGREEMENT_TITLE)}</h1>
<p style="margin:0 0 20px;color:${GRAY};">Agreement Version: ${esc(p.agreementVersion)} · Confirmation ${esc(p.confirmationId)}</p>
${summaryTable(p)}
${sections}
</div></div></body></html>`;
}

function emailBody(p: SignaturePacket) {
  return `<!doctype html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:${OFFWHITE};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Roboto,Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${OFFWHITE};padding:24px 12px;"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#fff;border:1px solid ${RULE};">
<tr><td style="background:${INK};padding:22px 28px;"><span style="color:#fff;font-size:18px;font-weight:700;letter-spacing:-0.02em;">Plerona</span></td></tr>
<tr><td style="padding:28px;">
<p style="margin:0 0 6px;color:${BLUE};font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;">Signed agreement received</p>
<h1 style="margin:0 0 16px;color:${INK};font-size:20px;font-weight:700;">Abide Electrical Website Agreement — ${esc(p.typedName)}</h1>
${summaryTable(p)}
<h2 style="margin:24px 0 8px;font-size:14px;color:${INK};">Required checkboxes</h2>
${checkboxList(p)}
<h2 style="margin:24px 0 8px;font-size:14px;color:${INK};">Signature</h2>
<p style="margin:0;color:${GRAY};font-size:13px;">Attached as <strong>signature-${esc(p.confirmationId)}.png</strong>. Full signed terms attached as HTML; the raw packet is attached as JSON.</p>
</td></tr></table></td></tr></table></body></html>`;
}

export async function sendSignedEmail(
  p: SignaturePacket,
): Promise<{ ok: boolean; id?: string; error?: string; detail?: string }> {
  if (!emailConfigured()) return { ok: false, error: 'email_not_configured' };
  const resend = new Resend(process.env.RESEND_API_KEY);
  const sigBase64 = p.signatureDataUrl.replace(/^data:image\/png;base64,/, '');
  const { signatureDataUrl: _omit, ...packetWithoutSig } = p;
  const to = recipientAddress();
  try {
    const { data, error } = await resend.emails.send({
      from: fromAddress(),
      to,
      replyTo: PARTIES.client.email,
      subject: `[SIGNED] Abide Electrical Website Agreement — ${p.typedName} — ${p.confirmationId}`,
      html: emailBody(p),
      attachments: [
        { filename: `signature-${p.confirmationId}.png`, content: Buffer.from(sigBase64, 'base64') },
        {
          filename: `abide-agreement-signed-${p.confirmationId}.html`,
          content: Buffer.from(signedAgreementHtml(p), 'utf8'),
        },
        {
          filename: `abide-agreement-packet-${p.confirmationId}.json`,
          content: Buffer.from(
            JSON.stringify({ ...packetWithoutSig, signatureFile: `signature-${p.confirmationId}.png` }, null, 2),
            'utf8',
          ),
        },
      ],
    });
    if (error) {
      console.error('Resend send failed:', error.name, error.message);
      return { ok: false, error: `${error.name}: ${error.message}` };
    }
    return { ok: true, id: data?.id, detail: `sent to ${to} (resend id ${data?.id ?? 'n/a'})` };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('Resend send threw:', msg);
    return { ok: false, error: msg };
  }
}
