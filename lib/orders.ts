import 'server-only';
import { createClient } from '@supabase/supabase-js';
import type Stripe from 'stripe';
import { HOSTING_TIERS, type HostingId } from './pricing';

export interface Order {
  sessionId: string;
  offer: 'consult' | 'implementation';
  name: string;
  business: string;
  email: string;
  phone: string;
  amountTotal: number; // one-time total, in dollars
  currency: string;
  additionalConnections: number;
  totalConnections: number;
  hosting: HostingId | 'none';
  hostingName: string | null;
  hostingMonthly: number; // dollars/mo, begins after implementation
  createdAt: string; // ISO
}

/** Normalize a completed Stripe Checkout Session into a clean Order. */
export function buildOrderFromSession(session: Stripe.Checkout.Session): Order {
  const m = session.metadata ?? {};
  const offer = m.offer === 'consult' ? 'consult' : 'implementation';
  const hosting = (m.hosting as HostingId | 'none') || 'none';
  const hostingTier =
    hosting !== 'none' ? HOSTING_TIERS.find((t) => t.id === hosting) ?? null : null;

  return {
    sessionId: session.id,
    offer,
    name: m.contact_name || session.customer_details?.name || '',
    business: m.contact_business || '',
    email: session.customer_details?.email || session.customer_email || '',
    phone: m.contact_phone || session.customer_details?.phone || '',
    amountTotal: (session.amount_total ?? 0) / 100,
    currency: (session.currency ?? 'usd').toUpperCase(),
    additionalConnections: Number(m.additional_connections ?? 0),
    totalConnections: Number(m.total_connections ?? 0),
    hosting,
    hostingName: hostingTier?.name ?? null,
    hostingMonthly: hostingTier?.pricePerMonth ?? 0,
    createdAt: new Date((session.created ?? Date.now() / 1000) * 1000).toISOString(),
  };
}

export const isSupabaseConfigured = (): boolean =>
  Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

export interface RecordResult {
  recorded: boolean; // did we write to a datastore at all
  isNew: boolean; // true if this is a first-time event (drives email sends)
}

/**
 * Write the order to the `orders` table (CRM record entry).
 *
 * Idempotent: the table has a UNIQUE constraint on stripe_session_id, so a
 * Stripe retry of the same event hits a conflict and is treated as "not new"
 * — which prevents duplicate confirmation emails.
 *
 * When Supabase isn't configured, returns { recorded:false, isNew:true } so the
 * rest of fulfillment (emails) still runs in preview/demo.
 */
export async function recordOrder(order: Order): Promise<RecordResult> {
  if (!isSupabaseConfigured()) {
    return { recorded: false, isNew: true };
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );

  const { error } = await supabase.from('orders').insert({
    stripe_session_id: order.sessionId,
    offer: order.offer,
    contact_name: order.name,
    business_name: order.business,
    email: order.email,
    phone: order.phone,
    amount_total: order.amountTotal,
    currency: order.currency,
    additional_connections: order.additionalConnections,
    total_connections: order.totalConnections,
    hosting: order.hosting,
    hosting_monthly: order.hostingMonthly,
    created_at: order.createdAt,
  });

  if (error) {
    // 23505 = unique_violation → duplicate event, already recorded.
    if (error.code === '23505') {
      return { recorded: true, isNew: false };
    }
    // Real failure — surface it but don't crash the webhook.
    console.error('Supabase recordOrder error:', error);
    return { recorded: false, isNew: true };
  }

  return { recorded: true, isNew: true };
}
