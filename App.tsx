import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UniversePage from './pages/UniversePage';
import BlogPostPage from './pages/BlogPostPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UniversePage />} />
        <Route path="/blog/:id" element={<BlogPostPage />} />
      </Routes>
    </Router>
  );
};

export default App;
