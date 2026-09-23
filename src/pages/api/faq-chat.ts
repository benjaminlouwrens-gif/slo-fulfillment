import { createHmac } from 'node:crypto';
import type { NextApiRequest, NextApiResponse } from 'next';
import { FAQ_REFERRAL, FAQ_SYSTEM_PROMPT } from '@/src/lib/server/faqPrompt';
import { clientIp } from '@/src/lib/server/rateLimit';
import { supabaseAdmin } from '@/src/lib/server/supabaseAdmin';

type Answer = { answer: string; referred: boolean };
type ErrorBody = { error: string };

const MAX_QUESTIONS_PER_HOUR = 10;
const MAX_QUESTION_LENGTH = 500;
const MAX_ANSWER_LENGTH = 240;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Answer | ErrorBody>
): Promise<void> {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  const question = typeof req.body?.question === 'string' ? req.body.question.trim() : '';
  if (question.length < 2 || question.length > MAX_QUESTION_LENGTH) {
    res.status(400).json({ error: 'invalid_question' });
    return;
  }

  const key = process.env.ZHIPU_API_KEY;
  if (!key) {
    res.status(503).json({ error: 'answer_unavailable' });
    return;
  }

  try {
    const ipHash = createHmac('sha256', key).update(clientIp(req) || 'unknown').digest('hex');
    const db = supabaseAdmin();
    const since = new Date(Date.now() - 60 * 60_000).toISOString();
    const { count, error: countError } = await db
      .from('slof_faq_requests')
      .select('id', { count: 'exact', head: true })
      .eq('ip_hash', ipHash)
      .gte('created_at', since);
    if (countError) throw countError;
    if ((count ?? 0) >= MAX_QUESTIONS_PER_HOUR) {
      res.status(429).json({ error: 'rate_limited' });
      return;
    }
    const { error: insertError } = await db.from('slof_faq_requests').insert({ ip_hash: ipHash });
    if (insertError) throw insertError;
  } catch (error) {
    console.error('FAQ rate limit unavailable:', error);
    res.status(503).json({ error: 'answer_unavailable' });
    return;
  }

  try {
    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: 'glm-4-flash',
        messages: [
          { role: 'system', content: FAQ_SYSTEM_PROMPT },
          { role: 'user', content: question },
        ],
        temperature: 0.2,
        max_tokens: 100,
        stream: false,
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error(`Zhipu HTTP ${response.status}`);
    const data = await response.json();
    const raw = data?.choices?.[0]?.message?.content;
    if (typeof raw !== 'string' || !raw.trim()) throw new Error('Zhipu returned no answer');
    const answer = raw.trim().replace(/\s+/g, ' ');
    const refer = /^REFER_TO_FORM\.?$/i.test(answer)
      || answer.length > MAX_ANSWER_LENGTH
      || answer.split(/\s+/).length > 40
      || /\$\s*\d|\b\d+(?:\.\d+)?\s*(?:usd|dollars|cents)\b/i.test(answer)
      || /\b(?:craveble|guarantee[ds]?|we (?:own|operate) (?:a )?warehouse)\b/i.test(answer);
    res.status(200).json({ answer: refer ? FAQ_REFERRAL : answer, referred: refer });
  } catch (error) {
    console.error('FAQ answer unavailable:', error);
    res.status(502).json({ error: 'answer_unavailable' });
  }
}
