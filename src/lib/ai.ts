/**
 * AI Coach transport.
 *
 * In production this calls the Claude API through a Supabase Edge Function (so
 * the API key never ships in the client). The function should stream
 * `text_delta` events back to the app. For the offline demo we fall back to the
 * local keyword responder in src/data/coach.ts.
 *
 * Recommended model: `claude-opus-4-8` for deep coaching, with a cheaper model
 * for short follow-ups. Keep a system prompt that injects the user's profile
 * (goal, experience, equipment, injuries) so replies are personalized.
 */
import { getCoachReply } from '@/data/coach';

const ENDPOINT = process.env.EXPO_PUBLIC_AI_COACH_URL;

export async function askCoach(prompt: string): Promise<string> {
  if (!ENDPOINT) {
    // Demo mode — simulate latency then return a canned, on-brand reply.
    await new Promise((r) => setTimeout(r, 650));
    return getCoachReply(prompt);
  }

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  if (!res.ok) throw new Error(`Coach request failed: ${res.status}`);
  const data = (await res.json()) as { reply: string };
  return data.reply;
}
