// Facts that appear on several pages live here, so a change (like when groups
// open) is made once instead of hunted down across the site.

export const site = {
  name: 'Kolarik Speech Therapy',
  url: 'https://kolarikspeechtherapy.com',
  email: 'kolarikspeechtherapy@gmail.com',
  owner: 'Molly Kolarik',
  credentials: 'M.S., CCC-SLP',
  area: 'Kansas City metro',
  launch: {
    status: 'Coming soon',
    // Only used where a parent asks "when?" directly (FAQ answers).
    opens: 'in 2027',
  },
  groups: {
    price: 50,
    minutes: 30,
    minAge: 3,
  },
  gaId: 'G-1TDDYMJY8J',
} as const;

export type Faq = { q: string; a: string };

export const faqs = {
  start: {
    q: 'When do Sound Groups start?',
    a: `I'm planning to open the first groups ${site.launch.opens}. Families on the priority list hear first and pick their group times before enrollment opens to everyone.`,
  },
  where: {
    q: 'Where will groups meet?',
    a: "In Kansas City. I'll share the location with the priority list first. The ZIP codes families share when they join help me choose a spot that's convenient for as many of them as possible.",
  },
  ages: {
    q: 'What ages are Sound Groups for?',
    a: "Children ages 3 and up. I match groups by age and by the sounds kids are working on, so every child practices alongside peers at a similar stage.",
  },
  cost: {
    q: 'How much will it cost?',
    a: "$50 per 30-minute session. It's simple private pay, with no insurance paperwork and no long-term contract.",
  },
  commitment: {
    q: 'Is joining the priority list a commitment?',
    a: "Not at all. Joining is free. When the schedule is ready, you'll decide whether to enroll.",
  },
  diagnosis: {
    q: 'Does my child need a diagnosis or referral?',
    a: "No diagnosis or referral is needed. If your child is hard to understand or working on certain sounds, you're welcome to join.",
  },
  moreSupport: {
    q: 'What if my child needs more than a group?',
    a: "Some children do best with one-on-one support. If I think that's true for your child, I'll tell you honestly and help you find the right next step.",
  },
  session: {
    q: 'What happens in a session?',
    a: "Each 30-minute session is play-based and built around the sounds your child's group is practicing. Kids get lots of practice turns through games, stories, and movement, so it feels like fun, not work.",
  },
  insurance: {
    q: 'Do you take insurance?',
    a: "Kolarik Speech Therapy is private pay. At $50 a session, Sound Groups are designed to be affordable without insurance billing.",
  },
  leader: {
    q: 'Who leads the groups?',
    a: "I do. I'm Molly Kolarik, an experienced pediatric speech-language pathologist (M.S., CCC-SLP) who specializes in speech sounds. Sound Groups are a new way I'm offering that expertise to Kansas City families.",
  },
  needsHelp: {
    q: 'How do I know if my child needs help with speech?',
    a: "If people outside your family often have a hard time understanding your child, or your child gets frustrated trying to say certain words, it's worth a conversation. The speech sound chart on this site is a good place to start.",
  },
} satisfies Record<string, Faq>;

export const launchSteps = [
  { when: 'Now', title: 'Join the priority list', text: 'Free, no commitment. Tell me a little about your child.', now: true },
  { when: 'Every month', title: 'Sound of the Month', text: 'A short email with a playful sound game to try at home.' },
  { when: 'Before groups open', title: 'First pick of times', text: 'Priority list families choose group times before enrollment opens to everyone.' },
  { when: 'When groups open', title: 'Let the fun begin', text: 'Kids are matched by age and sound. Show up, play, and watch confidence grow.' },
];

export const listPerks = [
  { icon: 'calendar', title: 'First pick of times', text: 'Choose your group time before enrollment opens to everyone.' },
  { icon: 'mail', title: 'Sound of the Month', text: 'One short email a month with a playful game to practice at home.' },
  { icon: 'friends', title: 'Bring a buddy', text: "Signing up with a friend? I'll do my best to put them in the same group." },
  { icon: 'heart', title: 'Free, no commitment', text: "Joining costs nothing. You'll decide about enrolling once the schedule is ready." },
] as const;
