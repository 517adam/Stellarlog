export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string; // Full blog content
  category: string;
  date: string;
  color: string; // Star color
  size: number; // Star size in px
  x: number; // Initial X position (%)
  y: number; // Initial Y position (%)
  speed: number; // Animation duration modifier
  delay: number; // Animation delay
}

export interface Quote {
  text: string;
  author: string;
}
