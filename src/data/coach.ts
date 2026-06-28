/**
 * Lightweight local stand-in for the AI Coach. In production this is replaced
 * by a streaming call to the Claude API (see src/lib/ai.ts) — the shape of
 * `ChatMessage` and `getCoachReply` is kept identical so the UI doesn't change.
 */

export interface ChatMessage {
  id: string;
  role: 'user' | 'coach';
  text: string;
}

export const COACH_SUGGESTIONS = [
  'Build me a push/pull/legs split',
  'How much protein should I eat?',
  'Is my bench press form correct?',
  'I feel unmotivated today',
];

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome',
    role: 'coach',
    text: "Hey Alex 👋 I'm your AI coach. Ask me about training, nutrition, recovery, or supplements — or tell me how you're feeling and I'll adjust your plan.",
  },
];

/** Naive keyword matcher used for the offline demo experience. */
export function getCoachReply(prompt: string): string {
  const p = prompt.toLowerCase();

  if (p.includes('protein')) {
    return 'For muscle gain, aim for ~1.6–2.2 g of protein per kg of bodyweight. At 78 kg that\'s roughly 140–170 g/day. Spread it across 3–4 meals of 30–40 g each for the best muscle-protein-synthesis response.';
  }
  if (p.includes('push') || p.includes('split') || p.includes('plan') || p.includes('program')) {
    return 'Here\'s a solid 6-day Push/Pull/Legs:\n\n• Push — bench, incline DB press, overhead press, lateral raise, triceps\n• Pull — pull-ups, barbell row, lat pulldown, curls\n• Legs — squat, RDL, leg press, calves\n\nRun it twice through the week, leave Sunday for recovery. Want me to load it into your planner?';
  }
  if (p.includes('form') || p.includes('bench')) {
    return 'For the bench press: retract and depress your scapula, keep a slight arch, wrists stacked over elbows, and tuck the elbows ~45° from your torso. Lower under control to the lower chest and drive up explosively. Upload a video and I\'ll give you frame-by-frame feedback.';
  }
  if (p.includes('motivat') || p.includes('tired') || p.includes('unmotivated')) {
    return 'Off days are normal — consistency beats intensity. You\'re on a 12-day streak 🔥. Let\'s not break it: do a lighter 20-minute session today, just the big lifts at 70%. Showing up is the win.';
  }
  if (p.includes('recovery') || p.includes('sleep') || p.includes('rest')) {
    return 'Recovery is where growth happens. Prioritise 7–9 h of sleep, keep training days 48 h apart per muscle group, stay hydrated, and consider a deload week every 6–8 weeks. Your sleep habit is checked off today — nice.';
  }
  if (p.includes('supplement') || p.includes('creatine')) {
    return 'The evidence-backed shortlist: creatine monohydrate (5 g/day), whey protein to fill gaps, caffeine pre-workout, and vitamin D if you\'re deficient. Everything else is optional. Want dosing details on any of these?';
  }
  return 'Great question. As your coach I\'d tailor this to your goal (build muscle), your intermediate experience, and your 6-day schedule. Tell me a bit more and I\'ll get specific — or tap one of the suggestions below.';
}
