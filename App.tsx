import React, { useState } from 'react';
import StarryBackground from './components/StarryBackground';
import HeroSection from './components/HeroSection';
import BlogModal from './components/BlogModal';
import { BlogPost } from './types';

const App: React.FC = () => {
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);

  const handleStarClick = (blog: BlogPost) => {
    setSelectedBlog(blog);
  };

  const handleCloseModal = () => {
    setSelectedBlog(null);
  };

  return (
    <main className="relative w-screen h-screen bg-slate-950 text-white overflow-hidden">
      
      {/* Layer 1: Background and Interactive Stars */}
      <StarryBackground onStarClick={handleStarClick} />

      {/* Layer 2: Hero Content (Title & Quote) */}
      {/* We hide the hero content slightly or blur it when a modal is open for focus */}
      <div className={`transition-all duration-500 ${selectedBlog ? 'blur-sm scale-95 opacity-50' : 'blur-0 scale-100 opacity-100'}`}>
        <HeroSection />
      </div>

      {/* Layer 3: Modal Overlay */}
      <BlogModal blog={selectedBlog} onClose={handleCloseModal} />
      
    </main>
  );
};

export default App;
