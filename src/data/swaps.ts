// Common sound swaps parents hear, shown on the speech sound chart page. Words
// are split [before, sound, after], like the chart’s examples: `said` is the
// word as a child might say it, `word` is the word itself. A swap that stands
// in for one chart sound names it (its label in sounds.ts, plus the note for
// th), so tapping that sound on the chart can show the swap.
// It lives apart from sounds.ts, which the flyer and Instagram builds read.

type Word = [string, string, string];

export type Swap = { said: Word; word: Word; what: string; sound?: string };

export const swaps: Swap[] = [
  { said: ['', 'w', 'abbit'], word: ['', 'r', 'abbit'], what: 'w for r', sound: 'r' },
  { said: ['', 'th', 'un'], word: ['', 's', 'un'], what: 'th for s (a lisp)', sound: 's' },
  { said: ['', 't', 'at'], word: ['', 'c', 'at'], what: 't for k', sound: 'k' },
  { said: ['ca', '', ''], word: ['ca', 't', ''], what: 'dropping the last sound' },
];
