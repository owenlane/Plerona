import 'server-only';
import { Resend } from 'resend';
import { MONEY, estimatedDelivery, CONSULT, IMPLEMENTATION } from './pricing';
import type { Order } from './orders';

const INK = '#0a0a0a';
const BLUE = '#E8C670'; // Beam token — transactional email accent
const OFFWHITE = '#f7f7f7';
const RULE = '#e4e4e4';
const GRAY = '#888888';

export const isEmailConfigured = (): boolean => Boolean(process.env.RESEND_API_KEY);

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  return key ? new Resend(key) : null;
}

const FROM = process.env.FROM_EMAIL || 'Plerona <onboarding@resend.dev>';
const NOTIFY = process.env.NOTIFY_EMAIL || 'contact@plerona.com';

function row(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid ${RULE};color:${GRAY};font-size:14px;">${label}</td>
      <td style="padding:10px 0;border-bottom:1px solid ${RULE};color:${INK};font-size:14px;font-weight:600;text-align:right;">${value}</td>
    </tr>`;
}

function shell(title: string, bodyInner: string): string {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${title}</title></head>
  <body style="margin:0;padding:0;background:${OFFWHITE};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${OFFWHITE};padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid ${RULE};border-radius:2px;overflow:hidden;">
          <tr><td style="background:${INK};padding:28px 32px;">
            <span style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:-0.02em;">Plerona</span>
          </td></tr>
          <tr><td style="padding:32px;">
            ${bodyInner}
          </td></tr>
          <tr><td style="background:${INK};padding:24px 32px;">
            <p style="margin:0;color:${GRAY};font-size:12px;line-height:1.6;">
              Plerona LLC · AI-powered infrastructure for small businesses<br>
              <a href="mailto:contact@plerona.com" style="color:${BLUE};text-decoration:none;">contact@plerona.com</a>
            </p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body></html>`;
}

function orderTable(order: Order): string {
  const delivery = estimatedDelivery(new Date(order.createdAt));
  const offerName = order.offer === 'consult' ? CONSULT.name : IMPLEMENTATION.name;
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 0;">
      ${row('Package', offerName)}
      ${order.offer === 'implementation' ? row('Connections', String(order.totalConnections)) : ''}
      ${order.hostingName ? row('Hosting (after implementation)', `${order.hostingName} · ${MONEY(order.hostingMonthly)}/mo`) : ''}
      ${row('Paid today', MONEY(order.amountTotal))}
      ${row('Estimated delivery', `${delivery.start} – ${delivery.end}`)}
    </table>`;
}

// ── 1. Buyer confirmation ──────────────────────────────────────────
export async function sendBuyerConfirmation(order: Order): Promise<void> {
  const resend = getResend();
  if (!resend || !order.email) return;

  const isConsult = order.offer === 'consult';
  const heading = isConsult ? 'Your Roadmap is reserved.' : 'Your implementation is underway.';
  const firstName = order.name.trim().split(/\s+/)[0] || 'there';

  const inner = `
    <p style="margin:0 0 6px;color:${BLUE};font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;">Order Confirmed</p>
    <h1 style="margin:0 0 16px;color:${INK};font-size:24px;font-weight:700;letter-spacing:-0.02em;line-height:1.2;">${heading}</h1>
    <p style="margin:0 0 20px;color:#444;font-size:15px;line-height:1.7;">
      ${firstName}, thank you — your order is confirmed and the work begins now. Here is what you purchased:
    </p>
    ${orderTable(order)}
    <h2 style="margin:28px 0 12px;color:${INK};font-size:15px;font-weight:700;">What happens next</h2>
    <p style="margin:0 0 20px;color:#444;font-size:14px;line-height:1.7;">
      ${
        isConsult
          ? 'Within minutes you’ll receive a short intake outline. Send it back with a clear picture of how your operation runs today, and your documented roadmap follows within one business day.'
          : 'We’ll reach out shortly to schedule kickoff and learn exactly how your business operates. From there we map, build, run a guided session, and hand off full ownership of your infrastructure.'
      }
    </p>
    <p style="margin:0;color:${GRAY};font-size:13px;line-height:1.7;">
      Questions any time? Just reply to this email or reach us at
      <a href="mailto:contact@plerona.com" style="color:${BLUE};text-decoration:none;">contact@plerona.com</a>.
    </p>`;

  await resend.emails.send({
    from: FROM,
    to: order.email,
    subject: isConsult ? 'Your Plerona Roadmap is confirmed' : 'Your Plerona implementation is confirmed',
    html: shell('Order Confirmed', inner),
  });
}

// ── 2. Internal notification ───────────────────────────────────────
export async function sendInternalNotification(order: Order): Promise<void> {
  const resend = getResend();
  if (!resend) return;

  const offerName = order.offer === 'consult' ? CONSULT.name : IMPLEMENTATION.name;
  const inner = `
    <p style="margin:0 0 6px;color:${BLUE};font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;">New Order</p>
    <h1 style="margin:0 0 16px;color:${INK};font-size:22px;font-weight:700;letter-spacing:-0.02em;">${offerName} — ${MONEY(order.amountTotal)}</h1>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${row('Name', order.name || '—')}
      ${row('Business', order.business || '—')}
      ${row('Email', order.email || '—')}
      ${row('Phone', order.phone || '—')}
      ${row('Offer', offerName)}
      ${order.offer === 'implementation' ? row('Total connections', String(order.totalConnections)) : ''}
      ${order.hostingName ? row('Hosting selected', `${order.hostingName} (${MONEY(order.hostingMonthly)}/mo, starts post-implementation)`) : row('Hosting selected', 'None')}
      ${row('Paid today', MONEY(order.amountTotal))}
      ${row('Stripe session', order.sessionId)}
    </table>
    <p style="margin:24px 0 0;color:${GRAY};font-size:13px;line-height:1.7;">
      ${order.hostingName ? 'Reminder: set up the hosting subscription at handoff — it is not yet billed.' : 'No hosting selected.'}
    </p>`;

  await resend.emails.send({
    from: FROM,
    to: NOTIFY,
    replyTo: order.email || undefined,
    subject: `New order — ${offerName} (${order.business || order.name || 'unknown'})`,
    html: shell('New Order', inner),
  });
}
