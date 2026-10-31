// English consonants grouped by the age band in which most U.S. children
// produce them correctly, per the authors' own summary chart of
// Crowe & McLeod (2020). Each example word is split as [before, sound, after]
// so the target sound can be highlighted.

export type Sound = { label: string; word: [string, string, string]; note?: string };

export const soundBands: { age: number; sounds: Sound[] }[] = [
  {
    age: 2,
    sounds: [
      { label: 'p', word: ['', 'p', 'op'] },
      { label: 'b', word: ['', 'b', 'all'] },
      { label: 'd', word: ['', 'd', 'og'] },
      { label: 'm', word: ['', 'm', 'ama'] },
      { label: 'n', word: ['', 'n', 'ose'] },
      { label: 'h', word: ['', 'h', 'at'] },
      { label: 'w', word: ['', 'w', 'ater'] },
    ],
  },
  {
    age: 3,
    sounds: [
      { label: 't', word: ['', 't', 'oy'] },
      { label: 'k', word: ['', 'c', 'at'] },
      { label: 'g', word: ['', 'g', 'o'] },
      { label: 'ng', word: ['ri', 'ng', ''] },
      { label: 'f', word: ['', 'f', 'ish'] },
      { label: 'y', word: ['', 'y', 'es'] },
    ],
  },
  {
    age: 4,
    sounds: [
      { label: 'v', word: ['', 'v', 'an'] },
      { label: 's', word: ['', 's', 'un'] },
      { label: 'z', word: ['', 'z', 'oo'] },
      { label: 'sh', word: ['', 'sh', 'oe'] },
      { label: 'ch', word: ['', 'ch', 'air'] },
      { label: 'j', word: ['', 'j', 'ump'] },
      { label: 'l', word: ['', 'l', 'ion'] },
    ],
  },
  {
    age: 5,
    sounds: [
      { label: 'th', word: ['', 'th', 'is'], note: 'voiced' },
      { label: 'zh', word: ['trea', 's', 'ure'] },
      { label: 'r', word: ['', 'r', 'ed'] },
    ],
  },
  {
    age: 6,
    sounds: [{ label: 'th', word: ['', 'th', 'umb'], note: 'voiceless' }],
  },
];

export const totalSounds = soundBands.reduce((n, band) => n + band.sounds.length, 0);

export const soundSources = [
  {
    text: 'Crowe, K., & McLeod, S. (2020). Children’s English consonant acquisition in the United States: A review. American Journal of Speech-Language Pathology, 29(4).',
    url: 'https://doi.org/10.1044/2020_AJSLP-19-00168',
  },
  {
    text: 'McLeod, S., Crowe, K., & Shahaeian, A. (2015). Intelligibility in Context Scale: Normative and validation data for English-speaking preschoolers. Language, Speech, and Hearing Services in Schools, 46(3), 266–276.',
    url: 'https://doi.org/10.1044/2015_LSHSS-14-0120',
  },
];
