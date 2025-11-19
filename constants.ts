import { BlogPost } from './types';

// Helper to generate random ambient stars
const generateAmbientStars = (count: number) => {
  const stars: BlogPost[] = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      id: `ambient-${i}`,
      title: 'Lost Signal',
      excerpt: 'Just a faint signal from the deep cosmos...',
      category: 'Void',
      date: 'Unknown',
      color: ['#cbd5e1', '#94a3b8', '#64748b'][Math.floor(Math.random() * 3)], // Muted slate colors
      size: Math.random() * 10 + 5, // Smaller
      x: Math.random() * 300 - 100, // Range: -100% to 200%
      y: Math.random() * 300 - 100, // Range: -100% to 200%
      speed: Math.random() * 30 + 20,
      delay: Math.random() * 5
    });
  }
  return stars;
};

export const AMBIENT_STARS = generateAmbientStars(40);

export const MOCK_BLOGS: BlogPost[] = [
  {
    id: '1',
    title: 'The React Nebula',
    excerpt: 'Exploring the state management patterns in modern React applications.',
    category: 'Frontend',
    date: 'Oct 12, 2023',
    color: '#61dafb',
    size: 24,
    x: 50, // Center-ish
    y: 50,
    speed: 15,
    delay: 0
  },
  {
    id: '2',
    title: 'Tailwind Supernova',
    excerpt: 'How utility-first CSS exploded into popularity and changed the way we style.',
    category: 'CSS',
    date: 'Nov 05, 2023',
    color: '#38bdf8',
    size: 18,
    x: 120, // Off to the right
    y: 20,
    speed: 20,
    delay: 2
  },
  {
    id: '3',
    title: 'TypeScript Galaxy',
    excerpt: 'Navigating the strong typing system to prevent runtime black holes.',
    category: 'Language',
    date: 'Dec 01, 2023',
    color: '#3178c6',
    size: 22,
    x: -30, // Off to the left
    y: 65,
    speed: 18,
    delay: 5
  },
  {
    id: '4',
    title: 'The AI Horizon',
    excerpt: 'Integrating Gemini API into everyday web applications.',
    category: 'AI',
    date: 'Jan 15, 2024',
    color: '#a855f7',
    size: 30,
    x: 25,
    y: 130, // Down below
    speed: 25,
    delay: 1
  },
  {
    id: '5',
    title: 'Performance Pulsar',
    excerpt: 'Optimizing render cycles and network requests for blazing fast load times.',
    category: 'Performance',
    date: 'Feb 10, 2024',
    color: '#facc15',
    size: 16,
    x: 150,
    y: 90,
    speed: 22,
    delay: 8
  },
  {
    id: '6',
    title: 'Design Systems Constellation',
    excerpt: 'Building a consistent UI language across your entire product suite.',
    category: 'Design',
    date: 'Mar 20, 2024',
    color: '#f472b6',
    size: 20,
    x: -10,
    y: -20, // Top Left
    speed: 17,
    delay: 3
  },
  {
    id: '7',
    title: 'Serverless Void',
    excerpt: 'Why managing your own infrastructure is becoming a thing of the past.',
    category: 'Backend',
    date: 'Apr 05, 2024',
    color: '#fb923c',
    size: 14,
    x: 90,
    y: 30,
    speed: 28,
    delay: 6
  },
   {
    id: '8',
    title: 'Event Loop Orbit',
    excerpt: 'Understanding the asynchronous nature of JavaScript runtime.',
    category: 'JavaScript',
    date: 'May 12, 2024',
    color: '#bef264',
    size: 19,
    x: 60,
    y: -50, // Way up
    speed: 19,
    delay: 4
  },
    {
    id: '9',
    title: 'GraphQL Gravity',
    excerpt: 'Pulling exactly the data you need, nothing more, nothing less.',
    category: 'Data',
    date: 'Jun 28, 2024',
    color: '#e879f9',
    size: 26,
    x: 160,
    y: 160, // Deep space
    speed: 24,
    delay: 7
  }
];