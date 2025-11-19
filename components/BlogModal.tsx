import React, { useEffect, useState } from 'react';
import { BlogPost } from '../types';
import { X, ArrowRight, Calendar, Tag } from 'lucide-react';
import { generateBlogSummary } from '../services/geminiService';

interface BlogModalProps {
  blog: BlogPost | null;
  onClose: () => void;
}

const BlogModal: React.FC<BlogModalProps> = ({ blog, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [loadingSummary, setLoadingSummary] = useState(false);

  useEffect(() => {
    if (blog) {
      setIsVisible(true);
      setLoadingSummary(true);
      generateBlogSummary(blog.title).then(summary => {
          setAiSummary(summary);
          setLoadingSummary(false);
      });
    } else {
      setIsVisible(false);
      setAiSummary('');
    }
  }, [blog]);

  if (!blog && !isVisible) return null;

  return (
    <div 
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-500 ${blog ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div 
        className={`relative w-full max-w-2xl bg-slate-900/90 border border-slate-700 text-slate-100 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden transform transition-all duration-500 ${blog ? 'scale-100 translate-y-0' : 'scale-95 translate-y-10'}`}
      >
        {/* Header Image / Gradient placeholder */}
        <div 
            className="h-32 w-full relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${blog?.color || '#fff'}40, #0f172a)` }}
        >
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-white/10 rounded-full transition-colors"
            >
                <X size={24} />
            </button>
        </div>

        <div className="p-8">
            <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-slate-800 border border-slate-700">
                    <Tag size={14} /> {blog?.category}
                </span>
                <span className="flex items-center gap-1">
                    <Calendar size={14} /> {blog?.date}
                </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                {blog?.title}
            </h2>

            <p className="text-lg text-slate-300 mb-6 leading-relaxed">
                {blog?.excerpt}
            </p>

            {/* AI Summary Section */}
            <div className="mb-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">Gemini Insight</h4>
                {loadingSummary ? (
                     <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                     </div>
                ) : (
                    <p className="text-sm text-indigo-200 italic">
                        "{aiSummary}"
                    </p>
                )}
            </div>

            <div className="flex justify-end">
                <button 
                    className="group flex items-center gap-2 px-6 py-3 bg-white text-slate-900 font-bold rounded-full hover:bg-indigo-50 transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                    onClick={() => alert(`Navigating to full post: ${blog?.title}`)}
                >
                    Read Full Story
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default BlogModal;
