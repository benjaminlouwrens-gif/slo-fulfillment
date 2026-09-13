import { Resend } from 'resend';
import { requireEnv } from './supabaseAdmin';

export function ownerEmail(): string {
  return process.env.OWNER_EMAIL || 'louwrensventures@gmail.com';
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function send(args: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<void> {
  const resend = new Resend(requireEnv('RESEND_API_KEY'));
  const { error } = await resend.emails.send({
    from: requireEnv('INQUIRY_FROM_EMAIL'),
    to: args.to,
    subject: args.subject,
    html: args.html,
    replyTo: args.replyTo,
  });
  if (error) {
    throw new Error(`Resend send failed (${args.subject}): ${error.message}`);
  }
}

export interface ContactSubmission {
  name: string;
  company: string;
  email: string;
  phone: string;
  website: string | null;
  productCategory: string;
  monthlyVolume: string;
  currentMethod: string;
  challenge: string;
  notes: string | null;
}

export async function sendContactNotification(sub: ContactSubmission): Promise<void> {
  const rows: [string, string][] = [
    ['Name', sub.name],
    ['Company', sub.company],
    ['Email', sub.email],
    ['Phone', sub.phone],
    ['Website', sub.website ?? '—'],
    ['Product category', sub.productCategory],
    ['Monthly volume', sub.monthlyVolume],
    ['Current method', sub.currentMethod],
  ];
  const table = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#555;white-space:nowrap">${label}</td>` +
        `<td style="padding:4px 0">${escapeHtml(value)}</td></tr>`
    )
    .join('');
  await send({
    to: ownerEmail(),
    replyTo: sub.email,
    subject: `New fulfillment inquiry from ${sub.name} — ${sub.company}`,
    html:
      `<h2 style="margin:0 0 12px">New fulfillment matchmaking inquiry</h2>` +
      `<table style="border-collapse:collapse;font-size:14px">${table}</table>` +
      `<p style="margin:16px 0 4px;color:#555">Biggest fulfillment challenge:</p>` +
      `<p style="white-space:pre-wrap;margin:0">${escapeHtml(sub.challenge)}</p>` +
      (sub.notes
        ? `<p style="margin:16px 0 4px;color:#555">Additional notes:</p>` +
          `<p style="white-space:pre-wrap;margin:0">${escapeHtml(sub.notes)}</p>`
        : ''),
  });
}
