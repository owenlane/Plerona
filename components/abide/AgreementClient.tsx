'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import SignaturePad, { type SignaturePadHandle } from './SignaturePad';
import {
  AGREEMENT_VERSION,
  MONTHLY_OPTIONS,
  PAYPAL,
  PRICES,
  REQUIRED_CHECKBOXES,
  SECTIONS,
  formatPacific,
  type Block,
  type CheckboxId,
  type MonthlyChoice,
} from '@/lib/abideAgreement';

interface SuccessState {
  confirmationId: string;
  signedAtPacific: string;
  signedAtUtc: string;
  typedName: string;
  monthlyChoice: MonthlyChoice;
  stored: boolean;
  emailSent: boolean;
  canRetryEmail: boolean;
}

const STORAGE_KEY = 'abide-agreement-confirmation';

const emptyChecks = () =>
  Object.fromEntries(REQUIRED_CHECKBOXES.map((c) => [c.id, false])) as Record<CheckboxId, boolean>;

function BlockView({ b }: { b: Block }) {
  switch (b.kind) {
    case 'p':
      return <p>{b.text}</p>;
    case 'kv':
      return (
        <p className={b.strong ? 'rounded-[2px] border border-rule bg-blue-wash/60 px-4 py-3' : ''}>
          <span className="font-semibold text-ink">{b.label}:</span> {b.text}
        </p>
      );
    case 'link':
      return (
        <p>
          <span className="font-semibold text-ink">{b.label}:</span>{' '}
          <a
            href={b.href}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all font-medium text-blue underline-offset-2 hover:text-blue-hover hover:underline"
          >
            {b.href}
          </a>
        </p>
      );
    case 'list':
      return (
        <div>
          {b.label && <p className="mb-2 font-semibold text-ink">{b.label}:</p>}
          <ul className="space-y-1.5 pl-5 [list-style:square] marker:text-blue">
            {b.items.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
      );
  }
}

function PayButtons({ compact = false }: { compact?: boolean }) {
  return (
    <div>
      <a
        href={PAYPAL.depositUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex w-full items-center justify-center rounded-[2px] bg-blue font-semibold text-white transition-colors hover:bg-blue-hover active:bg-blue-active sm:w-auto ${
          compact ? 'px-6 py-3 text-sm' : 'px-10 py-4 text-base'
        }`}
      >
        Pay deposit {PRICES.deposit} with PayPal
      </a>
      <p className="mt-3 text-xs leading-relaxed text-graymid">
        Funds to <span className="font-semibold text-ink">{PAYPAL.handle}</span>. No card fields on
        this page. If the amount isn’t filled in, open{' '}
        <a
          href={PAYPAL.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-blue hover:text-blue-hover"
        >
          paypal.me/owenlan
        </a>{' '}
        and enter amount <span className="font-semibold text-ink">${PAYPAL.depositAmount}</span>.
      </p>
    </div>
  );
}

export default function AgreementClient() {
  const [checks, setChecks] = useState<Record<CheckboxId, boolean>>(emptyChecks);
  const [typedName, setTypedName] = useState('');
  const [signerTitle, setSignerTitle] = useState('');
  const [monthly, setMonthly] = useState<MonthlyChoice | null>(null);
  const [strokeCount, setStrokeCount] = useState(0);
  const [honeypot, setHoneypot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<SuccessState | null>(null);
  const [retrying, setRetrying] = useState(false);
  const [now, setNow] = useState<Date | null>(null);
  const [active, setActive] = useState(SECTIONS[0].id);
  const padRef = useRef<SignaturePadHandle>(null);

  // Live PT clock for the signature block (client-only to avoid hydration drift).
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Restore a confirmation from this browser after a refresh (display only;
  // the record of truth is on the server).
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setSuccess(JSON.parse(saved));
    } catch {
      /* storage unavailable */
    }
  }, []);

  // Track which section is on screen for the progress rail.
  useEffect(() => {
    if (success) return;
    // Active = the last section whose top has scrolled past the header line.
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const update = () => {
      const line = 180;
      let current = els[0]?.id ?? SECTIONS[0].id;
      for (const el of els) {
        if (el.getBoundingClientRect().top <= line) current = el.id;
        else break;
      }
      // At the very bottom of the page, show the last section.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        current = els[els.length - 1]?.id ?? current;
      }
      setActive(current);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [success]);

  const checkedCount = Object.values(checks).filter(Boolean).length;
  const allChecked = checkedCount === REQUIRED_CHECKBOXES.length;
  const nameOk = typedName.trim().length >= 2;
  const sigOk = strokeCount > 0;
  const monthlyOk = monthly !== null;
  const canSubmit = allChecked && nameOk && sigOk && monthlyOk && !submitting;

  const missing = useMemo(() => {
    const m: string[] = [];
    if (!allChecked)
      m.push(`Check all required boxes (${checkedCount}/${REQUIRED_CHECKBOXES.length})`);
    if (!monthlyOk) m.push('Choose Yes or No for optional monthly hosting (§7)');
    if (!nameOk) m.push('Type your full name');
    if (!sigOk) m.push('Draw your signature');
    return m;
  }, [allChecked, checkedCount, monthlyOk, nameOk, sigOk]);

  const activeIndex = SECTIONS.findIndex((s) => s.id === active);
  const activeSection = SECTIONS[Math.max(0, activeIndex)];

  async function submit() {
    if (!canSubmit) return;
    const signatureDataUrl = padRef.current?.toDataUrl();
    if (!signatureDataUrl) {
      setError('Draw your signature before submitting.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/abide-agreement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agreementVersion: AGREEMENT_VERSION,
          typedName: typedName.trim(),
          signerTitle: signerTitle.trim(),
          signatureDataUrl,
          strokeCount,
          checkboxes: checks,
          monthlyChoice: monthly,
          company_website: honeypot,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        setError(
          data?.error ||
            'Your signature could not be recorded. Nothing was submitted. Please try again or email contact@plerona.com.',
        );
        return;
      }
      const s: SuccessState = {
        confirmationId: data.confirmationId,
        signedAtPacific: data.signedAtPacific,
        signedAtUtc: data.signedAtUtc,
        typedName: typedName.trim(),
        monthlyChoice: monthly as MonthlyChoice,
        stored: Boolean(data.stored),
        emailSent: Boolean(data.emailSent),
        canRetryEmail: Boolean(data.canRetryEmail),
      };
      setSuccess(s);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
      } catch {
        /* ignore */
      }
      window.scrollTo({ top: 0 });
    } catch {
      setError(
        'Network error — your signature was not submitted. Check your connection and try again.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function retryEmail() {
    if (!success) return;
    setRetrying(true);
    try {
      const res = await fetch('/api/abide-agreement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'retry-email', confirmationId: success.confirmationId }),
      });
      const data = await res.json().catch(() => null);
      if (data?.ok && data.emailSent) {
        const s = { ...success, emailSent: true, canRetryEmail: false };
        setSuccess(s);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
        } catch {
          /* ignore */
        }
      }
    } finally {
      setRetrying(false);
    }
  }

  // ── Success screen ────────────────────────────────────────────────
  if (success) {
    return (
      <>
        <section className="bg-ink pt-16 text-white">
          <div className="container-px py-14 md:py-20">
            <p className="eyebrow tracking-eyebrow mb-4">Agreement submitted</p>
            <h1 className="text-3xl font-bold tracking-tighter2 md:text-5xl">Congratulations.</h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-silver">
              Your contract is filled out and submitted to Plerona. Pay the deposit below to start
              your build.
            </p>
          </div>
        </section>
        <section className="bg-offwhite">
          <div className="container-px py-12 md:py-16">
            <div className="mx-auto max-w-2xl space-y-6">
              <div className="rounded-[2px] border border-rule bg-white p-6 md:p-8">
                <p className="eyebrow-muted">Next step — required to start your build</p>
                <h2 className="mt-3 text-2xl font-bold tracking-tightish text-ink">
                  Pay your 25% deposit: {PRICES.deposit}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-graymid">
                  Non-refundable once paid. V1 is ready for review within 2 business days after the
                  deposit is paid.
                </p>
                <div className="mt-6">
                  <PayButtons />
                </div>
              </div>

              <div className="rounded-[2px] border border-rule bg-white p-6 md:p-8">
                <dl className="divide-y divide-rule text-sm">
                  {[
                    ['Confirmation ID', success.confirmationId],
                    ['Signed', success.signedAtPacific],
                    ['Signed (UTC)', success.signedAtUtc],
                    ['Signed by', success.typedName],
                    ['Agreement version', AGREEMENT_VERSION],
                    [
                      'Optional monthly hosting',
                      success.monthlyChoice === 'yes' ? 'Yes — $198.98/month after go-live' : 'No — yearly hosting only',
                    ],
                    ['Balance (due before go-live)', PRICES.balance],
                  ].map(([k, v]) => (
                    <div key={k} className="flex flex-col gap-1 py-3 sm:flex-row sm:justify-between sm:gap-6">
                      <dt className="text-graymid">{k}</dt>
                      <dd className="break-all font-semibold text-ink sm:text-right">{v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-5 rounded-[2px] bg-offwhite px-4 py-3 text-sm leading-relaxed text-ink/80">
                  {success.emailSent ? (
                    <>A signed copy was emailed to Plerona at contact@plerona.com.</>
                  ) : (
                    <>
                      <span className="font-semibold text-ink">Submitted — email pending.</span> Your
                      signed agreement was saved on Plerona’s server, but the notification email
                      didn’t go out yet.{' '}
                      {success.canRetryEmail && (
                        <button
                          type="button"
                          onClick={retryEmail}
                          disabled={retrying}
                          className="font-semibold text-blue hover:text-blue-hover disabled:opacity-50"
                        >
                          {retrying ? 'Retrying…' : 'Retry email'}
                        </button>
                      )}{' '}
                      You can also send your confirmation ID to contact@plerona.com.
                    </>
                  )}
                </div>
                <p className="mt-4 text-xs leading-relaxed text-graymid">
                  Owner counter-signature (Owen Lane, Plerona) follows by email. Save this
                  confirmation ID for your records.
                </p>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  // ── Agreement ─────────────────────────────────────────────────────
  return (
    <>
      <section className="bg-ink pt-16 text-white">
        <div className="container-px py-12 md:py-16">
          <p className="eyebrow tracking-eyebrow mb-4">Website Build Agreement</p>
          <h1 className="text-3xl font-bold tracking-tighter2 md:text-5xl">
            Plerona × Abide Electrical
          </h1>
          <p className="mt-3 text-sm text-graymid">
            Agreement Version: {AGREEMENT_VERSION} · Prepared for Ryan Hansen
          </p>
          <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-[2px] border border-white/10 bg-white/10 sm:grid-cols-3">
            {[
              ['Accepted setup', PRICES.acceptedSetup, `List ${PRICES.listSetup} · 20% off`],
              ['Deposit (25%)', PRICES.deposit, 'Due at signing · starts build'],
              ['Balance (75%)', PRICES.balance, 'Due before go-live'],
            ].map(([k, v, sub]) => (
              <div key={k} className="bg-ink px-5 py-4">
                <p className="text-xs uppercase tracking-eyebrow text-graymid">{k}</p>
                <p className="mt-1 text-2xl font-bold tabular-nums tracking-tightish">{v}</p>
                <p className="mt-0.5 text-xs text-silver">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile section progress */}
      <div className="sticky top-16 z-30 border-b border-rule bg-white/95 backdrop-blur lg:hidden">
        <div className="container-px flex items-center justify-between gap-3 py-2.5 text-xs">
          <span className="truncate font-semibold text-ink">
            <span className="text-blue">§{activeSection.number}</span> {activeSection.title}
          </span>
          <span className="shrink-0 tabular-nums text-graymid">
            {activeSection.number}/{SECTIONS.length}
          </span>
        </div>
        <div className="h-0.5 bg-rule">
          <div
            className="h-full bg-blue transition-[width] duration-300"
            style={{ width: `${(activeSection.number / SECTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      <section className="bg-offwhite">
        <div className="mx-auto w-full max-w-container px-4 py-10 md:px-8 md:py-14">
          <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10">
            {/* Desktop section rail */}
            <nav aria-label="Agreement sections" className="hidden lg:block">
              <ol className="sticky top-24 space-y-0.5 text-sm">
                {SECTIONS.map((s) => {
                  const isActive = s.id === active;
                  return (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className={`flex gap-2 border-l-2 py-1.5 pl-3 leading-snug transition-colors ${
                          isActive
                            ? 'border-blue font-semibold text-ink'
                            : 'border-transparent text-graymid hover:text-ink'
                        }`}
                      >
                        <span className={`tabular-nums ${isActive ? 'text-blue' : ''}`}>
                          {s.number}.
                        </span>
                        <span className="line-clamp-2">{s.title.split(' — ')[0]}</span>
                      </a>
                    </li>
                  );
                })}
              </ol>
            </nav>

            <article className="min-w-0 rounded-[2px] border border-rule bg-white">
              <header className="border-b border-rule px-4 py-6 md:px-10 md:py-8">
                <p className="eyebrow-muted">Agreement Version: {AGREEMENT_VERSION}</p>
                <h2 className="mt-3 text-xl font-bold tracking-tightish text-ink md:text-2xl">
                  PLERONA × ABIDE ELECTRICAL — Website Build Agreement
                </h2>
                <p className="mt-2 text-sm text-graymid">
                  Read the full agreement, check the required boxes, then sign in Section 12.
                </p>
              </header>

              {SECTIONS.map((s) => (
                <section
                  key={s.id}
                  id={s.id}
                  className="scroll-mt-16 border-b border-rule px-4 py-8 last:border-b-0 md:px-10 md:py-10"
                >
                  <h3 className="text-lg font-bold tracking-tight text-ink">
                    <span className="mr-2.5 tabular-nums text-blue">{s.number}.</span>
                    {s.title}
                  </h3>
                  <div className="mt-4 space-y-3 text-[15px] leading-[1.75] text-ink/75">
                    {s.blocks.map((b, i) => (
                      <BlockView key={i} b={b} />
                    ))}
                  </div>

                  {s.id === 'monthly' && (
                    <fieldset className="mt-6">
                      <legend className="mb-3 text-sm font-semibold text-ink">
                        Your choice <span className="text-blue">*</span>
                      </legend>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {(Object.keys(MONTHLY_OPTIONS) as MonthlyChoice[]).map((k) => {
                          const selected = monthly === k;
                          return (
                            <label
                              key={k}
                              className={`flex cursor-pointer gap-3 rounded-[2px] border p-4 text-sm leading-snug transition-colors ${
                                selected
                                  ? 'border-blue bg-blue-wash text-ink'
                                  : 'border-rule bg-white text-ink/80 hover:border-silver'
                              }`}
                            >
                              <input
                                type="radio"
                                name="monthly"
                                value={k}
                                checked={selected}
                                onChange={() => setMonthly(k)}
                                className="mt-0.5 h-4 w-4 shrink-0 accent-[#1a56db]"
                              />
                              <span>
                                <span className="font-semibold">{k === 'yes' ? 'Yes' : 'No'}</span>
                                {' — '}
                                {MONTHLY_OPTIONS[k].split(' — ')[1]}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </fieldset>
                  )}

                  {s.id === 'checkboxes' && (
                    <div className="mt-4">
                      <ul className="space-y-2.5">
                        {REQUIRED_CHECKBOXES.map((c) => (
                          <li key={c.id}>
                            <label
                              className={`flex cursor-pointer gap-3 rounded-[2px] border p-3.5 text-[15px] leading-snug transition-colors ${
                                checks[c.id]
                                  ? 'border-blue/40 bg-blue-wash/60 text-ink'
                                  : 'border-rule text-ink/80 hover:border-silver'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={checks[c.id]}
                                onChange={(e) =>
                                  setChecks((prev) => ({ ...prev, [c.id]: e.target.checked }))
                                }
                                className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-[#1a56db]"
                              />
                              <span>{c.label}</span>
                            </label>
                          </li>
                        ))}
                      </ul>
                      <p className="mt-3 text-xs tabular-nums text-graymid">
                        {checkedCount} of {REQUIRED_CHECKBOXES.length} checked
                      </p>
                    </div>
                  )}

                  {s.id === 'signatures' && (
                    <div className="mt-6 space-y-6">
                      <div className="rounded-[2px] border border-rule p-3 md:p-6">
                        <p className="eyebrow-muted">Client — Abide Electrical (Ryan Hansen)</p>
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                          <label className="block text-sm">
                            <span className="font-semibold text-ink">
                              Typed full name <span className="text-blue">*</span>
                            </span>
                            <input
                              type="text"
                              value={typedName}
                              onChange={(e) => setTypedName(e.target.value)}
                              autoComplete="name"
                              placeholder="Ryan Hansen"
                              className="mt-1.5 block w-full rounded-[2px] border border-rule bg-white px-3 py-2.5 text-base text-ink outline-none placeholder:text-silver focus:border-blue"
                            />
                          </label>
                          <label className="block text-sm">
                            <span className="font-semibold text-ink">Title</span>
                            <input
                              type="text"
                              value={signerTitle}
                              onChange={(e) => setSignerTitle(e.target.value)}
                              autoComplete="organization-title"
                              placeholder="Owner"
                              className="mt-1.5 block w-full rounded-[2px] border border-rule bg-white px-3 py-2.5 text-base text-ink outline-none placeholder:text-silver focus:border-blue"
                            />
                          </label>
                        </div>

                        <div className="mt-5">
                          <div className="flex items-end justify-between">
                            <span className="text-sm font-semibold text-ink">
                              Signature <span className="text-blue">*</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => padRef.current?.clear()}
                              className="text-sm font-semibold text-blue hover:text-blue-hover"
                            >
                              Clear
                            </button>
                          </div>
                          <div
                            className={`relative mt-1.5 overflow-hidden rounded-[2px] border ${
                              sigOk ? 'border-silver' : 'border-dashed border-silver'
                            }`}
                          >
                            <SignaturePad ref={padRef} onChange={setStrokeCount} />
                            {!sigOk && (
                              <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-silver">
                                Sign here with your finger, pen, or mouse
                              </span>
                            )}
                            <div className="pointer-events-none absolute inset-x-5 bottom-8 border-b border-rule" />
                          </div>
                        </div>

                        <p className="mt-4 text-sm text-graymid">
                          Date / time (Pacific):{' '}
                          <span className="font-semibold tabular-nums text-ink">
                            {now ? formatPacific(now) : '—'}
                          </span>
                          <span className="block text-xs">
                            Final timestamp is recorded by Plerona’s server when you submit.
                          </span>
                        </p>
                      </div>

                      <div className="rounded-[2px] border border-dashed border-rule p-4 md:p-6">
                        <p className="eyebrow-muted">Plerona — Owen Lane, Owner</p>
                        <p className="mt-2 text-sm text-ink/75">
                          Counter-signature pending — follows by email after you submit.
                        </p>
                      </div>
                    </div>
                  )}
                </section>
              ))}

              {/* Submit */}
              <div className="relative border-t border-rule bg-offwhite/60 px-4 py-8 md:px-10">
                {/* Honeypot (hidden from people) */}
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  className="absolute left-[-9999px] h-0 w-0 opacity-0"
                  name="company_website"
                />
                {missing.length > 0 && (
                  <div className="mb-5">
                    <p className="text-sm font-semibold text-ink">Before you can submit:</p>
                    <ul className="mt-2 space-y-1 text-sm text-graymid">
                      {missing.map((m) => (
                        <li key={m} className="flex gap-2">
                          <span className="text-blue">—</span>
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {error && (
                  <div
                    role="alert"
                    className="mb-5 rounded-[2px] border border-ink/20 bg-white px-4 py-3 text-sm text-ink"
                  >
                    {error}
                  </div>
                )}
                <button
                  type="button"
                  onClick={submit}
                  disabled={!canSubmit}
                  className="inline-flex w-full items-center justify-center rounded-[2px] bg-blue px-10 py-4 text-base font-semibold text-white transition-colors hover:bg-blue-hover active:bg-blue-active disabled:cursor-not-allowed disabled:bg-silver sm:w-auto"
                >
                  {submitting ? 'Submitting…' : 'Sign & submit agreement'}
                </button>
                <p className="mt-4 text-xs leading-relaxed text-graymid">
                  Signing doesn’t charge you. After you submit, you’ll get a confirmation and a
                  link to pay the {PRICES.deposit} deposit by PayPal ({PAYPAL.handle}). The deposit
                  is required to start the build. Electronic signature with timestamp constitutes
                  agreement to these terms.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
