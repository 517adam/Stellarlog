import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_BLOGS } from '../constants';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';

const BlogPostPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const blog = MOCK_BLOGS.find(b => b.id === id);

    if (!blog) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Star Not Found</h1>
                    <Link to="/" className="text-indigo-400 hover:text-indigo-300 flex items-center justify-center gap-2">
                        <ArrowLeft size={20} /> Return to Universe
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 overflow-y-auto">
            {/* Header / Hero for the post */}
            <div
                className="relative h-[40vh] w-full flex items-end p-8 md:p-16"
                style={{
                    background: `linear-gradient(to bottom, ${blog.color}20, #020617), radial-gradient(circle at 50% 50%, ${blog.color}10, transparent)`
                }}
            >
                <div className="absolute top-8 left-8">
                    <Link to="/" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10 hover:bg-white/10">
                        <ArrowLeft size={18} />
                        <span>Back to Universe</span>
                    </Link>
                </div>

                <div className="max-w-4xl w-full mx-auto">
                    <div className="flex items-center gap-4 text-sm text-slate-300 mb-4">
                        <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
                            <Tag size={14} /> {blog.category}
                        </span>
                        <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
                            <Calendar size={14} /> {blog.date}
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                        {blog.title}
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl">
                        {blog.excerpt}
                    </p>
                </div>
            </div>

            {/* Content Body */}
            <article className="max-w-3xl mx-auto px-6 py-16">
                <div className="prose prose-invert prose-lg max-w-none">
                    {blog.content.split('\n').map((paragraph, idx) => (
                        <p key={idx} className="mb-6 leading-relaxed text-slate-300">
                            {paragraph}
                        </p>
                    ))}
                </div>

                <div className="mt-16 pt-8 border-t border-slate-800 flex justify-between items-center">
                    <div className="text-slate-500 italic">
                        End of transmission.
                    </div>
                    <Link to="/" className="text-indigo-400 hover:text-indigo-300 font-semibold hover:underline">
                        Explore other stars
                    </Link>
                </div>
            </article>
        </div>
    );
};

export default BlogPostPage;
