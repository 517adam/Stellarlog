import { BlogPost } from './types';

// Helper to generate random ambient stars
const generateAmbientStars = (count: number) => {
  const stars: BlogPost[] = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      id: `ambient-${i}`,
      title: 'Lost Signal',
      excerpt: 'Just a faint signal from the deep cosmos...',
      content: 'This is a faint signal from the deep cosmos. It contains no data, only the echo of a star that once was.',
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
    content: 'React state management has evolved significantly. From Redux to Context API, and now signals, the landscape is ever-changing. In this post, we explore the best practices for 2024.',
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
    content: 'Utility-first CSS frameworks like Tailwind have revolutionized web design. By providing low-level utility classes, they enable rapid UI development without leaving your HTML.',
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
    content: 'TypeScript adds static typing to JavaScript, making it more robust and maintainable. It catches errors at compile-time, preventing runtime crashes that can be costly.',
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
    content: 'Artificial Intelligence is reshaping the web. The Gemini API allows developers to integrate powerful AI models into their applications, enabling features like smart summarization and content generation.',
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
    content: 'Web performance is critical for user retention. Optimizing render cycles, minimizing network requests, and using efficient data structures are key to building fast applications.',
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
    content: 'A design system is more than just a style guide. It is a collection of reusable components, guidelines, and principles that ensure consistency across your product suite.',
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
    content: 'Serverless computing allows developers to build and run applications without thinking about servers. It reduces operational overhead and scales automatically with demand.',
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
    content: 'The JavaScript event loop is the secret behind its asynchronous capabilities. Understanding how the call stack, callback queue, and event loop work together is essential for mastering JS.',
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
    content: 'GraphQL provides a more efficient, powerful and flexible alternative to REST. It allows clients to define the structure of the data required, and exactly the same structure of the data is returned from the server.',
    category: 'Data',
    date: 'Jun 28, 2024',
    color: '#e879f9',
    size: 26,
    x: 160,
    y: 160, // Deep space
    speed: 24,
    delay: 7
  },
  {
    id: '10',
    title: 'Cosmic Journey',
    excerpt: 'A travel log through the digital stars, exploring new frontiers in web development.',
    content: 'Join us on a cosmic journey as we explore the latest trends in web development. From WebAssembly to Edge Computing, the digital universe is expanding at an unprecedented rate.',
    category: 'Adventure',
    date: 'Nov 20, 2025',
    color: '#ec4899', // Pink-500
    size: 28,
    x: -50,
    y: 100,
    speed: 12,
    delay: 1
  },
  {
    id: '11',
    title: 'Nebula Notes',
    excerpt: 'Quick tips and tricks gathered from the dusty corners of the coding universe.',
    content: 'Here are some quick tips: 1. Always sanitize user input. 2. Use semantic HTML. 3. Optimize your images. 4. Keep your dependencies up to date.',
    category: 'Tips',
    date: 'Nov 21, 2025',
    color: '#10b981', // Emerald-500
    size: 18,
    x: 80,
    y: -80,
    speed: 25,
    delay: 3
  },
  {
    id: '12',
    title: 'Stardust Memories',
    excerpt: 'Reflecting on legacy code and what we can learn from the systems of the past.',
    content: 'Legacy code is often seen as a burden, but it holds valuable lessons. It shows us how decisions were made in the past and how systems evolve over time. Respect the legacy.',
    category: 'Reflection',
    date: 'Nov 22, 2025',
    color: '#f97316', // Orange-500
    size: 22,
    x: -80,
    y: -20,
    speed: 18,
    delay: 0
  }
];