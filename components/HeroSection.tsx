import React, { useState, useEffect } from 'react';
import { Quote } from '../types';
import { getDailyQuote } from '../services/geminiService';

const defaultQuotes: Quote[] = [
    { text: "The cosmos is within us. We are made of star-stuff.", author: "Carl Sagan" },
    { text: "Look up at the stars and not down at your feet.", author: "Stephen Hawking" },
    { text: "Code is the poetry of a better reality.", author: "Stellar Walker" }
];

const HeroSection: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>(defaultQuotes);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true); // Controls opacity for transition

  // Load daily quote from Gemini and append to the list
  useEffect(() => {
    const fetchQuote = async () => {
        try {
            const q = await getDailyQuote();
            // Only add if it's different from our default fallback
            if (q.text !== defaultQuotes[0].text) {
                setQuotes(prev => [...prev, q]);
            }
        } catch (e) {
            console.error("Failed to fetch quote", e);
        }
    };
    fetchQuote();
  }, []);

  // Rotation Logic
  useEffect(() => {
    const interval = setInterval(() => {
        setFade(false); // Fade out
        
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % quotes.length);
            setFade(true); // Fade in
        }, 800); // Wait for fade out transition to finish

    }, 8000); // Switch every 8 seconds

    return () => clearInterval(interval);
  }, [quotes.length]);

  const currentQuote = quotes[currentIndex];

  return (
    <div className="absolute inset-0 z-50 pointer-events-none flex flex-col items-center pt-24 md:pt-32">
      
      {/* Minimalist Quote Display */}
      <div 
          className={`max-w-4xl w-full px-6 flex flex-col items-center text-center transition-all duration-1000 ease-in-out transform ${fade ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 -translate-y-4 blur-sm'}`}
      >
          {/* Quote Text - Large, White, Clean */}
          <p className="text-2xl md:text-4xl font-light leading-relaxed text-white drop-shadow-[0_0_20px_rgba(0,0,0,0.8)] tracking-wide font-sans">
              {currentQuote.text}
          </p>
          
          {/* Purple Accent Bar */}
          <div className="w-20 h-1.5 bg-gradient-to-r from-purple-600 to-indigo-500 rounded-full my-8 shadow-[0_0_15px_rgba(139,92,246,0.6)]"></div>
          
          {/* Author */}
          <p className="text-xs md:text-sm font-bold text-indigo-200 uppercase tracking-[0.3em] drop-shadow-md">
              {currentQuote.author}
          </p>
      </div>

    </div>
  );
};

export default HeroSection;