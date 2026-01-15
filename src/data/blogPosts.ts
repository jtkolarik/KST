// Centralized blog posts data - add new posts at the top (newest first)
export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  date: string;
  dateDisplay: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "what-to-expect-first-session",
    title: "What to Expect at Your First Speech Therapy Session",
    description: "Nervous about your child's first appointment? Here's exactly what happens and how to help your child feel comfortable.",
    image: "/blog-what-to-expect.png",
    imageAlt: "Speech therapist playing with a young child",
    date: "2026-01-15",
    dateDisplay: "January 2026"
  },
  {
    slug: "encourage-speech-at-home",
    title: "Simple Ways to Encourage Your Toddler's Speech at Home",
    description: "You don't need flashcards or apps. The best opportunities happen during everyday moments you're already having.",
    image: "/blog-encourage-speech.png",
    imageAlt: "Parent and child reading together",
    date: "2025-12-15",
    dateDisplay: "December 2025"
  },
  {
    slug: "late-talker-vs-speech-delay",
    title: "Late Talker vs. Speech Delay: What's the Difference?",
    description: "Some kids are late talkers who catch up on their own. Others have a delay that benefits from support. Here's how to tell the difference.",
    image: "/blog-late-talker.png",
    imageAlt: "Parent listening closely to toddler",
    date: "2025-12-10",
    dateDisplay: "December 2025"
  },
  {
    slug: "signs-toddler-needs-speech-therapy",
    title: "5 Signs Your Toddler Might Benefit from Speech Therapy",
    description: "Early intervention can make a big difference. Here are some signs to watch for in your child's speech development.",
    image: "/blog-speech-signs.png",
    imageAlt: "Mother and child sharing a tender moment",
    date: "2025-12-01",
    dateDisplay: "December 2025"
  }
];

export const POSTS_PER_PAGE = 3;

export function getPaginatedPosts(page: number) {
  const startIndex = (page - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  return blogPosts.slice(startIndex, endIndex);
}

export function getTotalPages() {
  return Math.ceil(blogPosts.length / POSTS_PER_PAGE);
}
