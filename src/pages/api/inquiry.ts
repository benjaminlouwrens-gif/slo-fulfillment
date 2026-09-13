import type { NextApiRequest, NextApiResponse } from 'next';
import { sendContactNotification } from '@/src/lib/server/email';
import { clientIp, tooManyRecent } from '@/src/lib/server/rateLimit';
import { supabaseAdmin } from '@/src/lib/server/supabaseAdmin';
import { isEmail, optionalString, requiredString } from '@/src/lib/server/validate';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }
  const body = (req.body ?? {}) as Record<string, unknown>;

  // Honeypot tripped: report success so bots learn nothing, store nothing.
  if (typeof body.botField === 'string' && body.botField.trim()) {
    res.status(200).json({ ok: true });
    return;
  }

  const name = requiredString(body.name, 200);
  const company = requiredString(body.company, 200);
  const email = requiredString(body.email, 320);
  const phone = requiredString(body.phone, 50);
  const website = optionalString(body.website, 500);
  const productCategory = requiredString(body.productCategory, 100);
  const monthlyVolume = requiredString(body.monthlyVolume, 100);
  const currentMethod = requiredString(body.currentMethod, 100);
  const challenge = requiredString(body.challenge, 5000);
  const notes = optionalString(body.notes, 5000);

  if (
    !name || !company || !email || !phone ||
    !productCategory || !monthlyVolume || !currentMethod || !challenge
  ) {
    res.status(400).json({ error: 'missing_fields' });
    return;
  }
  if (!isEmail(email)) {
    res.status(400).json({ error: 'invalid_email' });
    return;
  }

  const ip = clientIp(req);
  try {
    if (ip && (await tooManyRecent('slof_form_submissions', 'ip', ip, 60, 5))) {
      res.status(429).json({ error: 'rate_limited' });
      return;
    }
    const { error } = await supabaseAdmin().from('slof_form_submissions').insert({
      name,
      company,
      email,
      phone,
      website,
      product_category: productCategory,
      monthly_volume: monthlyVolume,
      current_method: currentMethod,
      challenge,
      notes,
      ip,
      user_agent: optionalString(req.headers['user-agent'], 500),
    });
    if (error) throw new Error(error.message);
  } catch (err) {
    console.error('inquiry submission failed:', err);
    res.status(500).json({ error: 'server_error' });
    return;
  }

  // The lead is stored; a notification hiccup should not turn into a user-facing error.
  try {
    await sendContactNotification({
      name, company, email, phone, website,
      productCategory, monthlyVolume, currentMethod, challenge, notes,
    });
  } catch (err) {
    console.error('inquiry notification email failed:', err);
  }

  res.status(200).json({ ok: true });
}
